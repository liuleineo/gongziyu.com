<?php
/**
 * 金手指 - 目标拆解接口
 *
 * POST /api/goal.php
 *   body: {"action":"plan","goal":"…","extra":"…"}
 *   resp: {"ok":true,"plan":{…},"cached":false}
 *
 * GET /api/goal.php?action=status
 *   resp: {"ok":true,"configured":true,"model":"deepseek-chat"}
 *
 * DeepSeek API Key 只保存在服务端（见 config.php / config.local.php）。
 */

declare(strict_types=1);

require __DIR__ . '/config.php';

// 接口只返回 JSON，避免任何警告/弃用信息混入响应
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

set_time_limit(180);

const GOAL_MAX_LEN = 300;
const GOAL_RATE_LIMIT = 40;      // 每个 IP 每小时最多请求数
const GOAL_RATE_WINDOW = 3600;
const GOAL_CACHE_TTL = 21600;    // 同一目标方案缓存 6 小时

/**
 * 输出 JSON 并终止
 */
function goal_respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * 简易来源校验：带 Origin 头时必须与本站同源
 */
function goal_check_origin(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return true;
    }
    $host = preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? ''));
    $originHost = parse_url($origin, PHP_URL_HOST);
    return $originHost !== false && $originHost !== null && $host !== '' && strtolower((string) $originHost) === strtolower($host);
}

/**
 * 获取客户端 IP
 */
function goal_client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR'] as $key) {
        if (!empty($_SERVER[$key])) {
            $value = trim(explode(',', (string) $_SERVER[$key])[0]);
            if ($value !== '') {
                $ip = $value;
                break;
            }
        }
    }
    return preg_replace('/[^0-9a-fA-F:.]/', '', $ip) ?: 'unknown';
}

/**
 * 临时文件目录（自动创建）
 */
function goal_tmp_dir(string $name): string
{
    $dir = rtrim(sys_get_temp_dir(), '/') . '/gongziyu_goal_' . $name;
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    return $dir;
}

/**
 * 文件锁读写
 */
function goal_file_edit(string $file, callable $fn)
{
    $fp = @fopen($file, 'c+');
    if (!$fp) {
        return $fn(null);
    }
    flock($fp, LOCK_EX);
    $raw = stream_get_contents($fp);
    $current = $raw === '' || $raw === false ? null : json_decode($raw, true);
    $result = $fn($current);
    if ($result !== null) {
        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($result, JSON_UNESCAPED_UNICODE));
    }
    flock($fp, LOCK_UN);
    fclose($fp);
    return $result;
}

/**
 * IP 限流，返回剩余次数
 */
function goal_rate_limit(): bool
{
    $file = goal_tmp_dir('rate') . '/' . md5(goal_client_ip()) . '.json';
    $now = time();
    $allowed = false;
    goal_file_edit($file, function ($data) use ($now, &$allowed) {
        $list = is_array($data) ? $data : [];
        $list = array_values(array_filter($list, static fn($t) => is_numeric($t) && ($now - (int) $t) < GOAL_RATE_WINDOW));
        if (count($list) >= GOAL_RATE_LIMIT) {
            $allowed = false;
        } else {
            $list[] = $now;
            $allowed = true;
        }
        return $list;
    });
    return $allowed;
}

/**
 * 方案缓存
 */
function goal_cache_get(string $key): ?array
{
    $file = goal_tmp_dir('cache') . '/' . $key . '.json';
    if (!is_file($file) || filemtime($file) < time() - GOAL_CACHE_TTL) {
        return null;
    }
    $data = json_decode((string) @file_get_contents($file), true);
    return is_array($data) ? $data : null;
}

function goal_cache_set(string $key, array $plan): void
{
    $file = goal_tmp_dir('cache') . '/' . $key . '.json';
    @file_put_contents($file, json_encode($plan, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

/**
 * 构造系统提示词
 */
function goal_system_prompt(): string
{
    return <<<'PROMPT'
你是"金手指"目标达成教练，擅长把任何一个模糊目标拆解成可执行、可勾选、可量化进度的行动方案。

你只能输出一个严格合法的 JSON 对象，不要输出 Markdown 代码块、不要输出任何解释文字。JSON 结构如下：
{
  "restatedGoal": "把用户的目标改写为清晰、可衡量、有期限的表述",
  "summary": "总体策略，不超过 80 字",
  "duration": "预计完成周期，如 12周",
  "resources": [
    {"name": "资源名称", "type": "工具|课程|人脉|资料|资金|环境", "desc": "这个资源用来做什么", "how": "如何获取或准备", "link": ""}
  ],
  "longTermGoals": [
    {"title": "长期目标", "desc": "说明", "measure": "可量化的衡量标准", "deadline": "如 第12周"}
  ],
  "shortTermGoals": [
    {"title": "短期目标", "desc": "说明", "measure": "可量化的衡量标准", "longTermIndex": 0}
  ],
  "tasks": [
    {"title": "任务标题", "desc": "具体动作说明", "estimate": "预计耗时", "stage": "第1阶段·启动", "shortTermIndex": 0, "priority": "high|medium|low"}
  ],
  "risks": [
    {"risk": "可能的阻碍", "mitigation": "应对办法"}
  ],
  "advice": "3 条以内的执行建议"
}

硬性约束：
1. resources 4-6 条，longTermGoals 3-5 条，shortTermGoals 4-8 条，tasks 12-24 条，risks 2-4 条。
2. shortTermGoals 的 longTermIndex 必须是 longTermGoals 中存在的下标（从 0 开始）。
3. tasks 的 shortTermIndex 必须是 shortTermGoals 中存在的下标（从 0 开始），每个短期目标至少挂 2 个任务。
4. tasks 必须按执行先后顺序排列，越靠前越先做；stage 用"第N阶段·阶段名"格式，相同阶段的任务连续排列。
5. 全部使用简体中文，内容具体可执行，避免空话套话。
PROMPT;
}

/**
 * 构造用户提示词
 */
function goal_user_prompt(string $goal, string $extra): string
{
    $text = "我的目标：\n" . $goal;
    if ($extra !== '') {
        $text .= "\n\n补充信息（现状、时间、预算、约束等）：\n" . $extra;
    }
    $text .= "\n\n请基于现实条件，给出一份可以一步一步照着做、每完成一项就能勾选一项的方案。";
    return $text;
}

/**
 * 从模型输出中提取 JSON
 */
function goal_extract_json(string $text): ?array
{
    $text = trim($text);
    $text = preg_replace('/^```(?:json)?/i', '', $text) ?? $text;
    $text = preg_replace('/```$/', '', trim($text)) ?? $text;
    $text = trim($text);

    $decoded = json_decode($text, true);
    if (is_array($decoded)) {
        return $decoded;
    }

    $start = strpos($text, '{');
    $end = strrpos($text, '}');
    if ($start !== false && $end !== false && $end > $start) {
        $slice = substr($text, $start, $end - $start + 1);
        $decoded = json_decode($slice, true);
        if (is_array($decoded)) {
            return $decoded;
        }
        // 兜底：去掉尾逗号后重试
        $decoded = json_decode(preg_replace('/,\s*([}\]])/', '$1', $slice) ?? '', true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }
    return null;
}

function goal_str($value, string $default = ''): string
{
    if (is_string($value)) {
        $value = trim($value);
        return $value === '' ? $default : $value;
    }
    if (is_numeric($value)) {
        return (string) $value;
    }
    return $default;
}

function goal_len(string $text): int
{
    return function_exists('mb_strlen') ? mb_strlen($text, 'UTF-8') : strlen($text);
}

function goal_cut(string $text, int $len): string
{
    if (goal_len($text) <= $len) {
        return $text;
    }
    return function_exists('mb_substr') ? mb_substr($text, 0, $len, 'UTF-8') : substr($text, 0, $len);
}

function goal_int($value, int $default, int $max): int
{
    $n = is_numeric($value) ? (int) $value : $default;
    if ($n < 0) {
        $n = 0;
    }
    if ($n > $max) {
        $n = $max;
    }
    return $n;
}

/**
 * 把模型输出规整成前端可用的结构
 */
function goal_normalize_plan(array $raw, string $goal): array
{
    $resources = [];
    foreach ((is_array($raw['resources'] ?? null) ? $raw['resources'] : []) as $item) {
        if (!is_array($item)) {
            continue;
        }
        $name = goal_str($item['name'] ?? ($item['title'] ?? ''));
        if ($name === '') {
            continue;
        }
        $resources[] = [
            'name' => $name,
            'type' => goal_str($item['type'] ?? '', '其他'),
            'desc' => goal_str($item['desc'] ?? ($item['description'] ?? '')),
            'how'  => goal_str($item['how'] ?? ''),
            'link' => goal_str($item['link'] ?? ''),
        ];
        if (count($resources) >= 8) {
            break;
        }
    }

    $longTerm = [];
    foreach ((is_array($raw['longTermGoals'] ?? null) ? $raw['longTermGoals'] : []) as $item) {
        if (!is_array($item)) {
            continue;
        }
        $title = goal_str($item['title'] ?? ($item['name'] ?? ''));
        if ($title === '') {
            continue;
        }
        $longTerm[] = [
            'title'    => $title,
            'desc'     => goal_str($item['desc'] ?? ($item['description'] ?? '')),
            'measure'  => goal_str($item['measure'] ?? ''),
            'deadline' => goal_str($item['deadline'] ?? ''),
        ];
        if (count($longTerm) >= 6) {
            break;
        }
    }

    $shortTerm = [];
    $longCount = max(count($longTerm), 1);
    foreach ((is_array($raw['shortTermGoals'] ?? null) ? $raw['shortTermGoals'] : []) as $item) {
        if (!is_array($item)) {
            continue;
        }
        $title = goal_str($item['title'] ?? ($item['name'] ?? ''));
        if ($title === '') {
            continue;
        }
        $idx = $item['longTermIndex'] ?? null;
        if (!is_numeric($idx) && isset($item['related']) && is_array($item['related']) && isset($item['related'][0])) {
            $idx = $item['related'][0];
        }
        $shortTerm[] = [
            'title'         => $title,
            'desc'          => goal_str($item['desc'] ?? ($item['description'] ?? '')),
            'measure'       => goal_str($item['measure'] ?? ''),
            'longTermIndex' => goal_int($idx, 0, $longCount - 1),
        ];
        if (count($shortTerm) >= 10) {
            break;
        }
    }

    $shortCount = count($shortTerm);
    $tasks = [];
    foreach ((is_array($raw['tasks'] ?? null) ? $raw['tasks'] : []) as $item) {
        if (!is_array($item)) {
            continue;
        }
        $title = goal_str($item['title'] ?? ($item['name'] ?? ''));
        if ($title === '') {
            continue;
        }
        $stage = goal_str($item['stage'] ?? '');
        if ($stage === '') {
            $stage = '第1阶段·启动';
        }
        $priority = strtolower(goal_str($item['priority'] ?? 'medium', 'medium'));
        if (!in_array($priority, ['high', 'medium', 'low'], true)) {
            $priority = 'medium';
        }
        $tasks[] = [
            'title'          => $title,
            'desc'           => goal_str($item['desc'] ?? ($item['description'] ?? '')),
            'estimate'       => goal_str($item['estimate'] ?? ''),
            'stage'          => $stage,
            'shortTermIndex' => $shortCount > 0 ? goal_int($item['shortTermIndex'] ?? 0, 0, $shortCount - 1) : 0,
            'priority'       => $priority,
        ];
        if (count($tasks) >= 30) {
            break;
        }
    }

    // 兜底：模型没有给任务时，按短期目标生成占位任务
    if (count($tasks) === 0) {
        if ($shortCount === 0) {
            $shortTerm[] = ['title' => '完成目标的第一步', 'desc' => '', 'measure' => '', 'longTermIndex' => 0];
            $shortCount = 1;
        }
        foreach ($shortTerm as $i => $st) {
            $tasks[] = [
                'title'          => '推进：' . $st['title'],
                'desc'           => '把这一项拆成今天就能开始的具体动作。',
                'estimate'       => '1-2 小时',
                'stage'          => '第1阶段·启动',
                'shortTermIndex' => $i,
                'priority'       => 'medium',
            ];
        }
    }

    $risks = [];
    foreach ((is_array($raw['risks'] ?? null) ? $raw['risks'] : []) as $item) {
        if (!is_array($item)) {
            continue;
        }
        $risk = goal_str($item['risk'] ?? ($item['title'] ?? ''));
        if ($risk === '') {
            continue;
        }
        $risks[] = [
            'risk'       => $risk,
            'mitigation' => goal_str($item['mitigation'] ?? ''),
        ];
        if (count($risks) >= 6) {
            break;
        }
    }

    return [
        'goal'          => $goal,
        'restatedGoal'  => goal_str($raw['restatedGoal'] ?? '', $goal),
        'summary'       => goal_str($raw['summary'] ?? ''),
        'duration'      => goal_str($raw['duration'] ?? ''),
        'resources'     => $resources,
        'longTermGoals' => $longTerm,
        'shortTermGoals' => $shortTerm,
        'tasks'         => $tasks,
        'risks'         => $risks,
        'advice'        => goal_str($raw['advice'] ?? ''),
        'createdAt'     => date('c'),
    ];
}

/**
 * 调用 DeepSeek
 *
 * @return array{ok:bool,plan?:array,error?:string,status?:int}
 */
function goal_request_deepseek(string $goal, string $extra): array
{
    $cfg = goal_api_config();
    if ($cfg['api_key'] === '') {
        return ['ok' => false, 'error' => '服务端尚未配置 DeepSeek API Key，请联系管理员在服务器上配置', 'status' => 503];
    }

    $payload = [
        'model'           => $cfg['model'],
        'messages'        => [
            ['role' => 'system', 'content' => goal_system_prompt()],
            ['role' => 'user', 'content' => goal_user_prompt($goal, $extra)],
        ],
        'temperature'     => 0.8,
        'max_tokens'      => 4096,
        'response_format' => ['type' => 'json_object'],
        'stream'          => false,
    ];

    $ch = curl_init($cfg['api_url']);
    if ($ch === false) {
        return ['ok' => false, 'error' => '服务器不支持 curl，无法调用 AI 接口', 'status' => 500];
    }

    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $cfg['api_key'],
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT        => max(30, (int) $cfg['timeout']),
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);

    $response = curl_exec($ch);
    $curlErr = $response === false ? curl_error($ch) : '';
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    unset($ch);

    if ($response === false) {
        return ['ok' => false, 'error' => '调用 AI 接口失败：' . ($curlErr ?: '网络异常'), 'status' => 502];
    }

    $data = json_decode($response, true);
    if ($httpCode >= 400 || !is_array($data)) {
        $message = '';
        if (is_array($data) && isset($data['error']['message']) && is_string($data['error']['message'])) {
            $message = trim($data['error']['message']);
        }
        if ($message === '') {
            $message = 'AI 接口返回异常（HTTP ' . $httpCode . '）';
        }
        $map = [
            401 => 'AI 接口鉴权失败，请检查服务器上的 API Key 是否正确',
            402 => 'API 账户余额不足，请充值后重试',
            403 => 'API Key 无权限访问该模型',
            422 => '请求参数被 AI 接口拒绝：' . $message,
            429 => '请求过于频繁或已达速率上限，请稍后再试',
        ];
        return ['ok' => false, 'error' => $map[$httpCode] ?? $message, 'status' => $httpCode >= 500 ? 502 : 400];
    }

    $content = $data['choices'][0]['message']['content'] ?? '';
    if (!is_string($content) || trim($content) === '') {
        return ['ok' => false, 'error' => 'AI 返回内容为空，请重试', 'status' => 502];
    }

    $parsed = goal_extract_json($content);
    if ($parsed === null) {
        return ['ok' => false, 'error' => 'AI 返回内容解析失败，请重试', 'status' => 502];
    }

    return ['ok' => true, 'plan' => goal_normalize_plan($parsed, $goal)];
}

// ---------------------------------------------------------------- 请求处理

if (!goal_check_origin()) {
    goal_respond(['ok' => false, 'error' => '非法来源请求'], 403);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$body = [];
if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '{}', true);
    $body = is_array($decoded) ? $decoded : [];
}

$action = (string) ($_GET['action'] ?? ($body['action'] ?? ''));

if ($action === 'status') {
    goal_respond([
        'ok'         => true,
        'configured' => goal_has_key(),
        'model'      => goal_api_config()['model'],
    ]);
}

if ($action !== 'plan') {
    goal_respond(['ok' => false, 'error' => '不支持的操作'], 400);
}

if ($method !== 'POST') {
    goal_respond(['ok' => false, 'error' => '请使用 POST 请求'], 405);
}

$goal = goal_str($body['goal'] ?? '', '');
$extra = goal_str($body['extra'] ?? '', '');

if ($goal === '') {
    goal_respond(['ok' => false, 'error' => '请先输入你的目标'], 400);
}
if (goal_len($goal) > GOAL_MAX_LEN) {
    $goal = goal_cut($goal, GOAL_MAX_LEN);
}
if (goal_len($extra) > 1000) {
    $extra = goal_cut($extra, 1000);
}

if (!goal_rate_limit()) {
    goal_respond(['ok' => false, 'error' => '请求太频繁了，请稍后再试'], 429);
}

$cacheKey = md5(goal_api_config()['model'] . '|' . $goal . '|' . $extra);
$cached = goal_cache_get($cacheKey);
if ($cached !== null) {
    goal_respond(['ok' => true, 'plan' => $cached, 'cached' => true]);
}

$result = goal_request_deepseek($goal, $extra);
if (!$result['ok']) {
    goal_respond([
        'ok'    => false,
        'error' => $result['error'],
        'code'  => ($result['status'] ?? 500) === 503 ? 'no_key' : 'ai_error',
    ], $result['status'] ?? 500);
}

goal_cache_set($cacheKey, $result['plan']);
goal_respond(['ok' => true, 'plan' => $result['plan'], 'cached' => false]);
