<?php
/**
 * 金手指 - 服务端配置
 *
 * DeepSeek API Key 只保存在服务器上，绝不下发给浏览器。
 * 读取优先级：
 *   1. 环境变量 DEEPSEEK_API_KEY（推荐，Apache 可用 SetEnv / php-fpm 可用 env[DEEPSEEK_API_KEY]）
 *   2. $_SERVER['DEEPSEEK_API_KEY']
 *   3. 本目录下的 config.local.php（不入库，见 .gitignore）
 */

declare(strict_types=1);

/**
 * 获取接口配置
 *
 * @return array{api_key:string,model:string,api_url:string,timeout:int}
 */
function goal_api_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $config = [
        'api_key' => '',
        'model'   => 'deepseek-chat',
        'api_url' => 'https://api.deepseek.com/chat/completions',
        'timeout' => 120,
    ];

    $envKey = getenv('DEEPSEEK_API_KEY');
    if ($envKey === false || $envKey === '') {
        $envKey = $_SERVER['DEEPSEEK_API_KEY'] ?? '';
    }
    if (is_string($envKey) && trim($envKey) !== '') {
        $config['api_key'] = trim($envKey);
    }

    $localFile = __DIR__ . '/config.local.php';
    if (is_file($localFile)) {
        $local = require $localFile;
        if (is_array($local)) {
            foreach (['api_key', 'model', 'api_url', 'timeout'] as $key) {
                if (!empty($local[$key])) {
                    $config[$key] = $key === 'timeout' ? (int) $local[$key] : trim((string) $local[$key]);
                }
            }
        }
    }

    $envModel = getenv('DEEPSEEK_MODEL');
    if (is_string($envModel) && trim($envModel) !== '') {
        $config['model'] = trim($envModel);
    }

    return $config;
}

/**
 * 是否已配置 API Key
 */
function goal_has_key(): bool
{
    $config = goal_api_config();
    return $config['api_key'] !== '';
}
