/* ===== 金手指系统 · 单页应用 ===== */
(() => {
  "use strict";

  const STORAGE_KEY = "kingsystem_state_v1";
  const KEY_STORAGE = "kingsystem_deepseek_key";
  const MODEL_STORAGE = "kingsystem_model";
  const API_URL = "https://api.deepseek.com/chat/completions";
  const DEFAULT_MODEL = "deepseek-chat";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const LEVEL_TITLES = [
    "新手冒险者",
    "命运实习生",
    "自律学徒",
    "目标猎手",
    "金手指持有者",
    "人生外挂",
    "命运程序员",
    "传说玩家",
    "系统管理员",
    "命运本身"
  ];

  const LOADING_MESSAGES = [
    "金手指正在拆解你的人生目标…",
    "正在扫描你的自律指数…",
    "正在把「明天开始」翻译成「现在动手」…",
    "正在给荒诞任务加一点羞耻感…",
    "正在计算六块腹肌的显形路径…",
    "正在和命运服务器握手…"
  ];

  const FITNESS_BASE_EXERCISES = [
    "动态热身：开合跳 3 组 × 30 秒（无需器械）",
    "自重深蹲 3 组 × 15 次（膝盖对齐脚尖）",
    "俯卧撑 3 组 × 8-15 次（可跪姿，动作标准优先）",
    "平板支撑 3 组 × 30-45 秒（收紧腹部，不塌腰）",
    "登山跑 3 组 × 20 秒（核心稳定，保持呼吸）"
  ];

  const FITNESS_BONUSES = [
    "今日加练：药球砸地 3 组 × 10 次（没有药球就抱一摞书）",
    "今日加练：哑铃深蹲推举 3 组 × 12 次（没有哑铃就用水瓶）",
    "今日加练：骑行 20 分钟，保持能说短句的节奏",
    "今日加练：爆发力冲刺 6 组 × 15 秒，组间走回起点",
    "今日加练：靠墙静蹲 3 组 × 45 秒",
    "今日加练：反向划船 / 桌下划船 3 组 × 8 次",
    "今日加练：药球旋转抛掷 3 组 × 8 次/侧（可用米袋）",
    "今日加练：波比跳 4 组 × 8 次（动作可降级为半程）"
  ];

  const CATEGORY_ICONS = {
    成长: "🌱",
    搞钱: "💰",
    社交: "🗣️",
    生活: "🍜",
    荒诞: "🤪",
    健身: "💪",
    主线: "🧭"
  };

  const FUNNY_WORDS = [
    "荒诞",
    "搞笑",
    "整活",
    "离谱",
    "中二",
    "羞耻",
    "沙雕",
    "奇葩",
    "无厘头",
    "戏精",
    "空气",
    "植物",
    "镜子",
    "路人",
    "外星",
    "唱歌",
    "奶茶",
    "猫",
    "狗"
  ];

  const SYSTEM_PROMPT = [
    "你是「金手指系统」的首席命运任务设计师，擅长把人生目标拆成游戏任务，并加入荒诞、搞笑、有梗但现实中可执行的任务。",
    "你说话热血、中二、幽默，但任务步骤必须具体、可执行、可验证。",
    "安全底线：不得生成危险、违法、自伤、侵犯他人、涉及隐私骚扰或需要高风险身体对抗的任务。",
    "健身任务必须量力而行，提供可降级方案，不依赖器械。",
    "你只输出一个合法 JSON 对象，不要输出 Markdown、代码块、解释或多余文字。"
  ].join("\n");

  const els = {
    dashboard: $("#dashboard"),
    playerAvatar: $("#playerAvatar"),
    playerName: $("#playerName"),
    playerTag: $("#playerTag"),
    levelRing: $("#levelRing"),
    levelNumber: $("#levelNumber"),
    xpFill: $("#xpFill"),
    statXp: $("#statXp"),
    statCoins: $("#statCoins"),
    statStreak: $("#statStreak"),
    goalLine: $("#goalLine"),
    mainList: $("#mainList"),
    mainCount: $("#mainCount"),
    dailyList: $("#dailyList"),
    sideList: $("#sideList"),
    historyList: $("#historyList"),
    historyCount: $("#historyCount"),
    tabbar: $("#tabbar"),

    setupScreen: $("#setupScreen"),
    setupForm: $("#setupForm"),
    setupCloseBtn: $("#setupCloseBtn"),
    stepDots: $("#stepDots"),
    setupBackBtn: $("#setupBackBtn"),
    setupNextBtn: $("#setupNextBtn"),
    inputName: $("#inputName"),
    inputLifeGoal: $("#inputLifeGoal"),
    inputShortGoals: $("#inputShortGoals"),
    inputApiKey: $("#inputApiKey"),
    toggleSetupKeyBtn: $("#toggleSetupKeyBtn"),
    genderGroup: $("#genderGroup"),
    lifeChips: $("#lifeChips"),
    shortChips: $("#shortChips"),

    loadingScreen: $("#loadingScreen"),
    loadingTitle: $("#loadingTitle"),
    loadingMessage: $("#loadingMessage"),

    errorScreen: $("#errorScreen"),
    errorMessage: $("#errorMessage"),
    errorRetryBtn: $("#errorRetryBtn"),
    errorOfflineBtn: $("#errorOfflineBtn"),
    errorSettingsBtn: $("#errorSettingsBtn"),

    resultScreen: $("#resultScreen"),
    resultStats: $("#resultStats"),
    resultGoal: $("#resultGoal"),
    resultEnterBtn: $("#resultEnterBtn"),

    taskScreen: $("#taskScreen"),
    taskScreenTag: $("#taskScreenTag"),
    taskBody: $("#taskBody"),
    taskFooter: $("#taskFooter"),
    taskBackBtn: $("#taskBackBtn"),
    taskCloseBtn: $("#taskCloseBtn"),

    rewardsScreen: $("#rewardsScreen"),
    rewardsBody: $("#rewardsBody"),
    rewardsBackBtn: $("#rewardsBackBtn"),

    statsScreen: $("#statsScreen"),
    statsBody: $("#statsBody"),
    statsBackBtn: $("#statsBackBtn"),

    settingsScreen: $("#settingsScreen"),
    settingsBackBtn: $("#settingsBackBtn"),
    settingsName: $("#settingsName"),
    settingsGender: $("#settingsGender"),
    settingsLifeGoal: $("#settingsLifeGoal"),
    settingsShortGoals: $("#settingsShortGoals"),
    settingsApiKey: $("#settingsApiKey"),
    toggleSettingsKeyBtn: $("#toggleSettingsKeyBtn"),
    settingsModel: $("#settingsModel"),
    settingsKeyStatus: $("#settingsKeyStatus"),
    saveProfileBtn: $("#saveProfileBtn"),
    editSetupBtn: $("#editSetupBtn"),
    saveAiBtn: $("#saveAiBtn"),
    regenerateBtn: $("#regenerateBtn"),
    exportBtn: $("#exportBtn"),
    importBtn: $("#importBtn"),
    importFile: $("#importFile"),
    resetBtn: $("#resetBtn"),

    confirmScreen: $("#confirmScreen"),
    confirmEmoji: $("#confirmEmoji"),
    confirmTitle: $("#confirmTitle"),
    confirmMessage: $("#confirmMessage"),
    confirmOkBtn: $("#confirmOkBtn"),
    confirmCancelBtn: $("#confirmCancelBtn"),

    claimScreen: $("#claimScreen"),
    claimEmoji: $("#claimEmoji"),
    claimLevelUp: $("#claimLevelUp"),
    claimTitle: $("#claimTitle"),
    claimReward: $("#claimReward"),
    claimDetail: $("#claimDetail"),
    claimStats: $("#claimStats"),
    claimCloseBtn: $("#claimCloseBtn"),

    headerSettingsBtn: $("#headerSettingsBtn"),
    dashboardRegenerateBtn: $("#dashboardRegenerateBtn"),
    dashboardRewardsBtn: $("#dashboardRewardsBtn"),

    toast: $("#toast"),
    confettiLayer: $("#confettiLayer")
  };

  let state = defaultState();
  let activeTaskId = null;
  let selectedGender = "";
  let setupStep = 0;
  let setupEditing = false;
  let setupReturnScreen = null;
  let loadingTimer = null;
  let toastTimer = null;
  let confirmResolver = null;
  let generationProfile = null;
  let generating = false;

  /* ===== 通用工具 ===== */
  function uid(prefix = "id") {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID().slice(0, 8)}`;
    }
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[char]));
  }

  function clampInt(value, fallback, min, max) {
    const num = Number.parseInt(value, 10);
    if (Number.isNaN(num)) return fallback;
    return Math.min(max, Math.max(min, num));
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function dateKey(date = new Date()) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function addDays(date, amount) {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
  }

  function formatDate(value) {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  function formatDateTime(value) {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getMonth() + 1}/${date.getDate()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
  }

  function levelInfo(xp) {
    const safeXp = Math.max(0, Number(xp) || 0);
    const level = Math.floor(Math.sqrt(safeXp / 80)) + 1;
    const base = 80 * Math.pow(level - 1, 2);
    const next = 80 * Math.pow(level, 2);
    const need = Math.max(1, next - base);
    const current = Math.max(0, safeXp - base);
    return {
      level,
      current,
      need,
      pct: Math.min(100, Math.round((current / need) * 100)),
      title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
    };
  }

  function typeLabel(type) {
    return type === "main" ? "主线任务" : type === "daily" ? "每日健身" : "支线任务";
  }

  function typeIcon(type) {
    return type === "main" ? "🧭" : type === "daily" ? "💪" : "🎲";
  }

  function categoryIcon(category) {
    return CATEGORY_ICONS[category] || "🎲";
  }

  function rewardEmoji(task) {
    if (task.type === "main") return "🏆";
    if (task.type === "daily") return "🔥";
    if (isAbsurdTask(task)) return "😂";
    return "🎁";
  }

  function isAbsurdTask(task) {
    if (!task) return false;
    if (task.category === "荒诞") return true;
    const haystack = `${task.title || ""} ${task.description || ""} ${task.reward?.title || ""}`;
    return FUNNY_WORDS.some((word) => haystack.includes(word));
  }

  function taskProgress(task) {
    const steps = Array.isArray(task?.steps) ? task.steps : [];
    const total = steps.length;
    const done = steps.filter((step) => step.done).length;
    return {
      total,
      done,
      pct: total ? Math.round((done / total) * 100) : 0,
      allDone: total === 0 || done === total,
      completed: Boolean(task?.completedAt)
    };
  }

  function deadlineText(task) {
    if (!task?.deadlineDays) return "";
    const created = new Date(task.createdAt || Date.now());
    const end = created.getTime() + task.deadlineDays * 86400000;
    const days = Math.ceil((end - Date.now()) / 86400000);
    if (days < 0) return "已超时";
    if (days === 0) return "今天截止";
    return `剩 ${days} 天`;
  }

  /* ===== 本地存储 ===== */
  function defaultState() {
    return {
      version: 1,
      profile: null,
      tasks: { main: [], side: [], daily: null },
      xp: 0,
      coins: 0,
      streak: 0,
      lastFitnessCompletedDate: null,
      lastDailyDate: null,
      rewards: [],
      history: [],
      settings: { model: DEFAULT_MODEL },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function getApiKey() {
    try {
      return localStorage.getItem(KEY_STORAGE) || "";
    } catch {
      return "";
    }
  }

  function setApiKey(value) {
    try {
      if (value) localStorage.setItem(KEY_STORAGE, value);
      else localStorage.removeItem(KEY_STORAGE);
    } catch {
      /* ignore storage failures */
    }
  }

  function getModel() {
    try {
      return localStorage.getItem(MODEL_STORAGE) || state.settings?.model || DEFAULT_MODEL;
    } catch {
      return state.settings?.model || DEFAULT_MODEL;
    }
  }

  function setModel(value) {
    const model = String(value || "").trim() || DEFAULT_MODEL;
    state.settings.model = model;
    try {
      localStorage.setItem(MODEL_STORAGE, model);
    } catch {
      /* ignore storage failures */
    }
  }

  function saveState() {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("保存本地存档失败", error);
      toast("本地存档失败，可能是浏览器空间不足", "error");
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return mergeState(JSON.parse(raw));
    } catch (error) {
      console.warn("读取本地存档失败", error);
      return defaultState();
    }
  }

  function mergeState(raw) {
    const base = defaultState();
    const data = raw && typeof raw === "object" ? raw : {};
    const tasks = data.tasks && typeof data.tasks === "object" ? data.tasks : {};

    const main = Array.isArray(tasks.main) ? tasks.main.map(sanitizeTask).filter(Boolean) : [];
    const side = Array.isArray(tasks.side) ? tasks.side.map(sanitizeTask).filter(Boolean) : [];
    const daily = tasks.daily && typeof tasks.daily === "object" ? sanitizeTask(tasks.daily) : null;

    return {
      ...base,
      ...data,
      profile: data.profile && typeof data.profile === "object" ? { ...data.profile } : null,
      tasks: {
        main,
        side,
        daily: daily ? { ...daily, type: "daily", category: "健身" } : null
      },
      rewards: Array.isArray(data.rewards) ? data.rewards : [],
      history: Array.isArray(data.history) ? data.history : [],
      settings: { ...base.settings, ...(data.settings || {}) }
    };
  }

  function sanitizeTask(task) {
    if (!task || typeof task !== "object") return null;
    const type = ["main", "side", "daily"].includes(task.type) ? task.type : "side";
    const safe = { ...task };
    safe.id = safe.id || uid(type);
    safe.type = type;
    safe.title = String(safe.title || "未命名任务");
    safe.description = String(safe.description || "");
    safe.category = String(
      safe.category || (type === "main" ? "主线" : type === "daily" ? "健身" : "成长")
    );
    safe.difficulty = String(
      safe.difficulty || (type === "daily" ? "每日" : type === "main" ? "普通" : "轻松")
    );
    safe.xp = clampInt(safe.xp, type === "main" ? 120 : type === "daily" ? 60 : 50, 0, 9999);
    safe.coins = clampInt(safe.coins, type === "main" ? 60 : type === "daily" ? 30 : 20, 0, 9999);
    safe.reward = normalizeReward(safe.reward);
    safe.createdAt = safe.createdAt || new Date().toISOString();
    safe.completedAt = safe.completedAt || null;
    safe.deadlineDays = clampInt(safe.deadlineDays, type === "main" ? 7 : type === "side" ? 3 : 0, 0, 365);
    safe.dailyDate = safe.dailyDate || null;
    safe.bonus = safe.bonus || (type === "daily" ? pickDailyBonus() : "");

    const rawSteps = Array.isArray(safe.steps) ? safe.steps : [];
    safe.steps = rawSteps.slice(0, 10).map((step, index) => {
      if (typeof step === "string") {
        return { id: `${safe.id}-s${index}`, text: step, done: false };
      }
      return {
        id: step?.id || `${safe.id}-s${index}`,
        text: String(step?.text || step?.title || step?.step || step?.description || "完成一步"),
        done: Boolean(step?.done)
      };
    });

    if (safe.steps.length === 0) {
      safe.steps = [{ id: `${safe.id}-s0`, text: "完成这条任务", done: false }];
    }

    if (type === "daily" && safe.steps.length < 4) {
      const existing = new Set(safe.steps.map((step) => step.text));
      FITNESS_BASE_EXERCISES.forEach((text) => {
        if (!existing.has(text)) {
          safe.steps.push({ id: `${safe.id}-s${safe.steps.length}`, text, done: false });
          existing.add(text);
        }
      });
    }

    return safe;
  }

  /* ===== 奖励与任务归一化 ===== */
  function normalizeReward(reward) {
    if (typeof reward === "string" && reward.trim()) {
      return { title: reward.trim(), detail: "" };
    }
    if (reward && typeof reward === "object") {
      const title = String(reward.title || reward.name || reward.reward || reward.text || "神秘奖励");
      const detail = String(reward.detail || reward.description || reward.desc || "");
      return { title: title.trim() || "神秘奖励", detail: detail.trim() };
    }
    return { title: "神秘奖励", detail: "" };
  }

  function normalizeSteps(rawSteps, taskId, type) {
    let steps = rawSteps;
    if (!Array.isArray(steps)) steps = [];
    if (steps.length === 0) {
      if (type === "daily") steps = FITNESS_BASE_EXERCISES.slice(0, 4);
      else steps = ["把任务目标写下来", "完成最小可执行的一步", "记录结果并复盘"];
    }
    return steps.slice(0, 10).map((step, index) => {
      if (typeof step === "string") {
        return { id: `${taskId}-s${index}`, text: step, done: false };
      }
      return {
        id: step?.id || `${taskId}-s${index}`,
        text: String(step?.text || step?.title || step?.step || step?.description || "完成一步"),
        done: false
      };
    });
  }

  function normalizeTask(raw, type, index) {
    const source = typeof raw === "string" ? { title: raw } : raw && typeof raw === "object" ? raw : {};
    const taskId = uid(type);
    const title = String(source.title || source.name || source.task || "未命名任务").trim();
    const description = String(
      source.description || source.desc || source.detail || "金手指没有给出说明，但你可以自己赋予它意义。"
    ).trim();
    const defaultXp = type === "main" ? 120 : type === "daily" ? 60 : 50;
    const defaultCoins = type === "main" ? 60 : type === "daily" ? 30 : 20;

    return {
      id: taskId,
      type,
      title: title || `任务 ${index + 1}`,
      description,
      category: String(
        source.category || (type === "main" ? "主线" : type === "daily" ? "健身" : "成长")
      ),
      difficulty: String(
        source.difficulty || (type === "main" ? "普通" : type === "daily" ? "每日" : "轻松")
      ),
      xp: clampInt(source.xp ?? source.exp, defaultXp, 0, 9999),
      coins: clampInt(source.coins ?? source.gold, defaultCoins, 0, 9999),
      reward: normalizeReward(source.reward ?? source.rewards),
      steps: normalizeSteps(
        source.steps ?? source.tasks ?? source.actions ?? source.exercises,
        taskId,
        type
      ),
      deadlineDays: clampInt(
        source.deadline_days ?? source.deadlineDays,
        type === "main" ? 7 : type === "side" ? 3 : 0,
        0,
        365
      ),
      createdAt: new Date().toISOString(),
      completedAt: null,
      dailyDate: type === "daily" ? dateKey() : null,
      bonus: type === "daily" ? pickDailyBonus() : ""
    };
  }

  function pickDailyBonus(key = dateKey()) {
    const seed = Array.from(key).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return FITNESS_BONUSES[seed % FITNESS_BONUSES.length];
  }

  function normalizeDaily(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const exercises = Array.isArray(source.exercises)
      ? source.exercises
      : Array.isArray(source.steps)
        ? source.steps
        : Array.isArray(source.actions)
          ? source.actions
          : [];

    const texts = exercises
      .map((item) => (typeof item === "string" ? item : item?.text || item?.title || item?.step || ""))
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    const filled = texts.slice(0, 8);
    FITNESS_BASE_EXERCISES.forEach((exercise) => {
      if (filled.length < 4 && !filled.includes(exercise)) filled.push(exercise);
    });

    const bonus = pickDailyBonus();
    if (!filled.some((text) => text.includes("今日加练"))) filled.push(bonus);

    const taskId = uid("daily");
    return {
      id: taskId,
      type: "daily",
      title: String(source.title || "每日健身 · 六块腹肌唤醒计划"),
      description: String(
        source.description ||
          "目标是保持六块腹肌和爆发力身材。动作可以降级，但今天必须先动起来。"
      ),
      category: "健身",
      difficulty: "每日",
      xp: clampInt(source.xp ?? source.exp, 60, 0, 9999),
      coins: clampInt(source.coins ?? source.gold, 30, 0, 9999),
      reward: normalizeReward(
        source.reward ?? "腹肌显形进度 +1% · 今日份自律勋章"
      ),
      steps: normalizeSteps(filled, taskId, "daily"),
      deadlineDays: 0,
      createdAt: new Date().toISOString(),
      completedAt: null,
      dailyDate: dateKey(),
      bonus
    };
  }

  function normalizeAiPayload(payload, profile) {
    const root =
      payload && typeof payload === "object"
        ? payload.quests && typeof payload.quests === "object"
          ? payload.quests
          : payload.data && typeof payload.data === "object" && !payload.main_quests
            ? payload.data
            : payload
        : {};

    const pick = (object, keys) => {
      for (const key of keys) {
        if (object && object[key] != null) return object[key];
      }
      return null;
    };

    const mainRaw = pick(root, ["main_quests", "mainQuests", "main", "主线任务", "主线"]);
    const sideRaw = pick(root, ["side_quests", "sideQuests", "side", "支线任务", "支线"]);
    const dailyRaw = pick(root, ["daily_fitness", "dailyFitness", "daily", "每日健身", "健身"]);

    const main = Array.isArray(mainRaw)
      ? mainRaw.slice(0, 3).map((item, index) => normalizeTask(item, "main", index))
      : [];
    const side = Array.isArray(sideRaw)
      ? sideRaw.slice(0, 8).map((item, index) => normalizeTask(item, "side", index))
      : [];

    const local = localQuestSet(profile || state.profile || {});
    while (main.length < 2) {
      main.push(normalizeTask(local.main[main.length % local.main.length], "main", main.length));
    }
    let localSideIndex = 0;
    while (side.length < 4 && localSideIndex < local.side.length) {
      const candidate = local.side[localSideIndex];
      localSideIndex += 1;
      if (side.some((task) => task.title === candidate.title)) continue;
      side.push(normalizeTask(candidate, "side", side.length));
    }

    let absurdCount = side.filter(isAbsurdTask).length;
    if (absurdCount < 2) {
      const localAbsurd = local.side.filter(isAbsurdTask);
      const existingTitles = new Set(side.map((task) => task.title));
      for (const task of localAbsurd) {
        if (absurdCount >= 2) break;
        if (existingTitles.has(task.title)) continue;
        side.push(normalizeTask(task, "side", side.length));
        existingTitles.add(task.title);
        absurdCount += 1;
      }
    }

    const daily = dailyRaw ? normalizeDaily(dailyRaw) : local.daily;

    const finalSide = side.slice(0, 8);
    let absurdInFinal = finalSide.filter(isAbsurdTask).length;
    if (absurdInFinal < 2) {
      const extraAbsurd = side
        .filter(isAbsurdTask)
        .filter((task) => !finalSide.includes(task));
      let replaceIndex = finalSide.length - 1;
      for (const task of extraAbsurd) {
        if (absurdInFinal >= 2) break;
        while (replaceIndex >= 0 && isAbsurdTask(finalSide[replaceIndex])) {
          replaceIndex -= 1;
        }
        if (replaceIndex < 0) break;
        finalSide[replaceIndex] = task;
        absurdInFinal += 1;
        replaceIndex -= 1;
      }
    }

    return {
      main: main.slice(0, 3),
      side: finalSide,
      daily
    };
  }

  /* ===== 离线任务生成 ===== */
  function localQuestSet(profile) {
    const name = String(profile?.name || "玩家").trim() || "玩家";
    const lifeGoal = String(profile?.lifeGoal || "成为更强的自己").trim();
    const shortGoals = String(profile?.shortGoals || "完成一个能落地的小目标").trim();

    const mainRaw = [
      {
        title: "主线 · 命运启动",
        description: `把「${lifeGoal}」从一句愿望拆成真正能执行的第一步。先让齿轮转起来，再谈宏大叙事。`,
        difficulty: "普通",
        xp: 120,
        coins: 60,
        reward: "命运齿轮开始转动 · 主线启动勋章",
        steps: [
          `把「${lifeGoal}」拆成 3 个可量化阶段`,
          `围绕短期目标「${shortGoals}」写出未来 7 天的最小行动清单`,
          "完成第一次行动，并记录结果与感受"
        ],
        deadline_days: 7
      },
      {
        title: "主线 · 30 天破局",
        description: `用 30 天给「${shortGoals}」制造一次真实进展。不要等状态，先制造证据。`,
        difficulty: "困难",
        xp: 220,
        coins: 120,
        reward: "破局者徽章 · 30 天连续推进记录",
        steps: [
          "连续 7 天推进短期目标，每天至少 20 分钟",
          "找一个真实用户、朋友或同行验证你的进展",
          "复盘一次：保留有效动作，砍掉自嗨动作",
          "制定下一轮 30 天升级计划"
        ],
        deadline_days: 30
      }
    ];

    const sideRaw = [
      {
        title: "支线 · 10 元快乐实验",
        description: "用 10 元买到今天最真实的快乐。禁止用来买焦虑，禁止用来买会员。",
        category: "荒诞",
        difficulty: "轻松",
        xp: 45,
        coins: 25,
        reward: "快乐经济学家 · 低成本幸福许可证",
        steps: [
          "带 10 元出门，或者打开 10 元预算",
          "买到 / 做出一个让你快乐的小东西",
          "拍照记录，并写一句为什么快乐"
        ]
      },
      {
        title: "支线 · 给植物开一场演唱会",
        description: "选一盆植物或路边的一棵树，认真唱完一首歌。它是你今晚唯一的观众。",
        category: "荒诞",
        difficulty: "社死级",
        xp: 60,
        coins: 35,
        reward: "植物界首席歌手 · 绿色观众认证",
        steps: [
          "选一盆植物或一棵树作为观众",
          "完整唱完一首歌，不许笑场",
          "观察并记录它的「反应」"
        ]
      },
      {
        title: "支线 · 真诚夸夸一个陌生人",
        description: "夸一个具体细节，不要油腻，不要搭讪，夸完就走。",
        category: "社交",
        difficulty: "普通",
        xp: 55,
        coins: 30,
        reward: "人间夸夸官 · 社交勇气 +1",
        steps: [
          "找到一位店员、路人或同事",
          "真诚夸赞一个具体细节",
          "记录对方的反应和你的感受"
        ]
      },
      {
        title: "支线 · 断网 30 分钟",
        description: "把手机开飞行模式 30 分钟，去完成一件你拖了很久的小事。",
        category: "成长",
        difficulty: "普通",
        xp: 50,
        coins: 25,
        reward: "专注力 +1 · 拖延症驱散符",
        steps: [
          "手机开启飞行模式 30 分钟",
          "完成一件拖延超过 3 天的小事",
          "记录断网后的真实感受"
        ]
      },
      {
        title: "支线 · 用非惯用手吃一顿饭",
        description: "用你平时不用的那只手吃完一顿饭，感受一下大脑重新布线的笨拙。",
        category: "荒诞",
        difficulty: "轻松",
        xp: 40,
        coins: 20,
        reward: "左右互搏初学者 · 笨拙勋章",
        steps: [
          "选择一顿饭，全程只用非惯用手",
          "不许中途换手作弊",
          "记录最狼狈的一个瞬间"
        ]
      }
    ];

    return {
      main: mainRaw.map((task, index) => normalizeTask(task, "main", index)),
      side: sideRaw.map((task, index) => normalizeTask(task, "side", index)),
      daily: normalizeDaily({})
    };
  }

  /* ===== Prompt / AI ===== */
  function buildUserPrompt(profile) {
    return [
      "玩家信息：",
      `- 代号：${profile.name}`,
      `- 性别：${profile.gender}`,
      `- 人生目标：${profile.lifeGoal}`,
      `- 短期目标：${profile.shortGoals}`,
      "",
      "请为这个玩家生成一套「金手指系统」任务，严格输出以下 JSON 结构：",
      "{",
      '  "main_quests": [',
      "    {",
      '      "title": "主线任务标题",',
      '      "description": "为什么做、要做到什么程度",',
      '      "difficulty": "普通/困难/地狱",',
      '      "xp": 120,',
      '      "coins": 60,',
      '      "reward": "有趣的奖励称号或现实小奖励",',
      '      "steps": ["具体步骤1", "具体步骤2", "具体步骤3"],',
      '      "deadline_days": 7',
      "    }",
      "  ],",
      '  "side_quests": [',
      "    {",
      '      "title": "支线任务标题",',
      '      "description": "任务说明",',
      '      "category": "成长/搞钱/社交/生活/荒诞",',
      '      "difficulty": "轻松/普通/困难",',
      '      "xp": 50,',
      '      "coins": 25,',
      '      "reward": "有趣的奖励",',
      '      "steps": ["具体步骤1", "具体步骤2"]',
      "    }",
      "  ],",
      '  "daily_fitness": {',
      '    "title": "每日健身任务标题",',
      '    "description": "目标说明",',
      '    "xp": 60,',
      '    "coins": 30,',
      '    "reward": "健身奖励",',
      '    "exercises": ["动作1 组数×次数/时间", "动作2", "动作3", "动作4"]',
      "  }",
      "}",
      "",
      "硬性要求：",
      "1. 生成 2 个主线任务，围绕人生目标，难度递进，步骤具体可执行。",
      "2. 生成 4-6 个支线任务，其中至少 2 个必须搞笑、荒诞、有梗、有节目效果，但现实中可完成且不违法、不危险、不伤害他人。",
      "3. 必须生成 1 个每日健身任务，目标是保持六块腹肌和爆发力身材。",
      "4. 每日健身包含 4-6 个动作，至少一半无需器械；可以包含骑行、哑铃、药球、深蹲、俯卧撑、平板支撑、开合跳、冲刺跑等，但不要依赖器械。",
      "5. 奖励 = XP + 金币 + 一个有趣的奖励称号或现实小奖励，例如「奶茶赦免券」「中二之王」「植物界首席歌手」。",
      "6. 语言热血、中二、幽默；任务步骤具体、可验证，避免空话。",
      "7. 每个任务 2-5 个步骤；只输出 JSON，不要 Markdown，不要解释。"
    ].join("\n");
  }

  class AppError extends Error {
    constructor(code, message) {
      super(message);
      this.name = "AppError";
      this.code = code;
    }
  }

  function parseAiJson(text) {
    let clean = String(text || "").trim();
    clean = clean.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start >= 0 && end > start) clean = clean.slice(start, end + 1);
    try {
      return JSON.parse(clean);
    } catch {
      try {
        return JSON.parse(clean.replace(/,\s*([}\]])/g, "$1"));
      } catch {
        throw new AppError("PARSE", "AI 返回的任务格式无法解析，请重试。");
      }
    }
  }

  function apiErrorMessage(status, data) {
    const detail = data?.error?.message || data?.message || "";
    if (status === 401) return "API Key 无效或已过期，请到设置里重新填写。";
    if (status === 402) return "DeepSeek 账户余额不足，请充值后再试。";
    if (status === 429) return "请求太频繁，请稍后再试。";
    if (status >= 500) return "DeepSeek 服务暂时不可用，请稍后重试。";
    return detail || `请求失败（HTTP ${status}）。`;
  }

  async function requestDeepSeek(profile) {
    const key = getApiKey();
    if (!key) throw new AppError("NO_KEY", "未配置 DeepSeek API Key。");

    const model = getModel();
    const isReasoner = model.includes("reasoner");
    const payload = {
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(profile) }
      ],
      max_tokens: 4096
    };
    if (!isReasoner) {
      payload.temperature = 1.15;
      payload.response_format = { type: "json_object" };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);
    let response;
    try {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    } catch (error) {
      if (error?.name === "AbortError") {
        throw new AppError("TIMEOUT", "AI 推演超时，请稍后重试。");
      }
      throw new AppError("NETWORK", "网络请求失败，可能是网络或跨域问题。");
    } finally {
      clearTimeout(timer);
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new AppError("API", apiErrorMessage(response.status, data));
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new AppError("EMPTY", "AI 没有返回任务内容，请重试。");
    }
    return content;
  }

  /* ===== 生成流程 ===== */
  function startLoadingCycle() {
    let index = 0;
    els.loadingMessage.textContent = LOADING_MESSAGES[0];
    clearInterval(loadingTimer);
    loadingTimer = setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      els.loadingMessage.textContent = LOADING_MESSAGES[index];
    }, 1600);
  }

  function stopLoadingCycle() {
    clearInterval(loadingTimer);
    loadingTimer = null;
  }

  async function startGeneration({ offline = false } = {}) {
    if (generating) return;
    const profile = generationProfile || state.profile;
    if (!profile) {
      openSetup();
      return;
    }

    generating = true;
    showScreen("loadingScreen");
    els.loadingTitle.textContent = offline || !getApiKey() ? "正在启动离线推演…" : "正在扫描命运线…";
    startLoadingCycle();

    try {
      let questSet;
      if (offline || !getApiKey()) {
        await delay(1100 + Math.random() * 700);
        questSet = localQuestSet(profile);
        if (!offline && !getApiKey()) {
          toast("未配置 API Key，已使用离线任务模板", "success");
        }
      } else {
        const content = await requestDeepSeek(profile);
        const payload = parseAiJson(content);
        questSet = normalizeAiPayload(payload, profile);
      }
      applyQuestSet(questSet, profile);
    } catch (error) {
      stopLoadingCycle();
      const message =
        error instanceof AppError
          ? error.message
          : "生成任务时发生未知错误，请重试或使用离线任务。";
      showError(message);
    } finally {
      generating = false;
      generationProfile = null;
    }
  }

  function applyQuestSet(questSet, profile) {
    state.profile = { ...profile };
    state.tasks = {
      main: questSet.main,
      side: questSet.side,
      daily: questSet.daily
    };
    state.lastDailyDate = dateKey();
    state.tasks.daily.dailyDate = dateKey();
    state.tasks.daily.bonus = pickDailyBonus();
    if (!state.createdAt) state.createdAt = new Date().toISOString();
    saveState();
    stopLoadingCycle();
    renderAll();
    showResult(questSet, profile);
  }

  function showError(message) {
    els.errorMessage.textContent = message;
    showScreen("errorScreen");
  }

  function showResult(questSet, profile) {
    els.resultStats.innerHTML = [
      `<div class="result-stat"><strong>${questSet.main.length}</strong><span>主线任务</span></div>`,
      `<div class="result-stat"><strong>${questSet.side.length}</strong><span>支线任务</span></div>`,
      `<div class="result-stat"><strong>1</strong><span>每日健身</span></div>`
    ].join("");
    els.resultGoal.innerHTML = `<strong>${esc(profile.name)}</strong> 的人生目标：${esc(
      profile.lifeGoal
    )}<br><strong>短期目标：</strong>${esc(profile.shortGoals)}`;
    showScreen("resultScreen");
  }

  /* ===== 渲染 ===== */
  function renderAll() {
    renderHeader();
    renderTasks();
    renderHistory();
    if (activeTaskId && els.taskScreen.classList.contains("active")) {
      renderTaskDetail();
    }
  }

  function renderHeader() {
    const profile = state.profile;
    const level = levelInfo(state.xp);

    els.playerName.textContent = profile?.name || "命运玩家";
    els.playerTag.textContent = `Lv.${level.level} · ${level.title}`;
    els.playerAvatar.textContent =
      profile?.gender === "男"
        ? "🧑‍🚀"
        : profile?.gender === "女"
          ? "🦸‍♀️"
          : profile?.gender === "其他"
            ? "🧑‍🎤"
            : profile?.gender === "保密"
              ? "🕶️"
              : "🕶️";
    els.playerAvatar.dataset.gender = profile?.gender || "保密";
    els.levelNumber.textContent = String(level.level);
    els.levelRing.style.setProperty("--pct", String(level.pct));
    els.levelRing.title = `${level.current} / ${level.need} XP`;
    els.xpFill.style.width = `${level.pct}%`;
    els.statXp.textContent = String(state.xp);
    els.statCoins.textContent = String(state.coins);
    els.statStreak.textContent = String(state.streak || 0);

    if (profile?.lifeGoal || profile?.shortGoals) {
      els.goalLine.innerHTML = [
        profile.lifeGoal ? `<strong>人生目标</strong> ${esc(profile.lifeGoal)}` : "",
        profile.shortGoals ? `<strong>短期目标</strong> ${esc(profile.shortGoals)}` : ""
      ]
        .filter(Boolean)
        .join("<br>");
    } else {
      els.goalLine.textContent = "还没有绑定人生目标。点击设置或重新进入新手引导。";
    }
  }

  function emptyState(emoji, title, text) {
    return `<div class="empty-state"><span class="emoji">${emoji}</span><strong>${esc(
      title
    )}</strong><p>${esc(text)}</p></div>`;
  }

  function taskCard(task) {
    const progress = taskProgress(task);
    const completed = progress.completed;
    const absurd = task.type === "side" && isAbsurdTask(task);
    const icon =
      task.type === "daily" ? "💪" : task.type === "main" ? "🧭" : categoryIcon(task.category);
    const classes = [
      "task-card",
      task.type,
      completed ? "completed" : "",
      absurd ? "absurd" : ""
    ]
      .filter(Boolean)
      .join(" ");

    const chips = [
      `<span class="chip xp">+${task.xp} XP</span>`,
      `<span class="chip coin">+${task.coins} 金币</span>`
    ];

    if (task.type === "side" && !absurd) {
      chips.push(`<span class="chip category">${esc(task.category)}</span>`);
    }
    if (task.type === "main") {
      const deadline = deadlineText(task);
      if (deadline) chips.push(`<span class="chip category">${esc(deadline)}</span>`);
    }
    if (task.type === "daily") {
      chips.push(`<span class="chip daily">🔥 连续 ${state.streak || 0} 天</span>`);
    }
    if (absurd) {
      chips.push(`<span class="chip absurd">荒诞</span>`);
    }

    const badge = completed
      ? `<span class="chip done">已领取</span>`
      : task.type === "daily"
        ? `<span class="chip daily">每日</span>`
        : "";

    const footRight = completed
      ? `已领取 · ${formatDate(task.completedAt)}`
      : progress.allDone
        ? "可领取奖励"
        : "查看任务 →";

    return `
      <article class="${classes}" data-task-id="${esc(task.id)}" role="button" tabindex="0" aria-label="${esc(
        task.title
      )}">
        <div class="task-icon" aria-hidden="true">${icon}</div>
        <div class="task-body">
          <div class="task-top">
            <h3 class="task-title">${esc(task.title)}</h3>
            ${badge}
          </div>
          <p class="task-desc">${esc(task.description)}</p>
          <div class="task-chips">${chips.join("")}</div>
          <div class="task-progress" aria-hidden="true"><i style="width:${progress.pct}%"></i></div>
          <div class="task-foot">
            <span>${progress.done}/${progress.total} 步</span>
            <span class="${progress.allDone && !completed ? "done-label" : ""}">${footRight}</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderTasks() {
    const main = state.tasks.main || [];
    const side = state.tasks.side || [];
    const daily = state.tasks.daily;

    els.mainList.innerHTML = main.length
      ? main.map(taskCard).join("")
      : emptyState("🧭", "主线任务还没生成", "点击上方「AI 重铸任务」，让金手指开始推演。");

    const mainDone = main.filter((task) => task.completedAt).length;
    els.mainCount.textContent = main.length ? `${mainDone}/${main.length} 已完成` : "0 个";

    els.dailyList.innerHTML = daily
      ? taskCard(daily)
      : emptyState("💪", "今日健身任务未生成", "重新生成任务后，每日健身会自动出现。");

    els.sideList.innerHTML = side.length
      ? side.map(taskCard).join("")
      : emptyState("🎲", "支线任务还没生成", "没有支线的游戏，是没有灵魂的。");

    els.historyCount.textContent = state.history.length ? `${state.history.length} 条` : "";
  }

  function buildHistoryHtml(limit = 6) {
    const history = state.history.slice(0, limit);
    if (!history.length) {
      return emptyState("📜", "还没有战报", "完成第一个任务后，这里会记录你的高光时刻。");
    }
    return history
      .map((item) => {
        const icon =
          item.type === "main" ? "🧭" : item.type === "daily" ? "💪" : "🎲";
        return `
          <div class="history-item">
            <div class="history-icon" aria-hidden="true">${icon}</div>
            <div class="history-main">
              <strong>${esc(item.title)}</strong>
              <span>${formatDateTime(item.at)} · ${typeLabel(item.type)}</span>
            </div>
            <div class="history-reward">+${item.xp} XP</div>
          </div>
        `;
      })
      .join("");
  }

  function renderHistory() {
    els.historyList.innerHTML = buildHistoryHtml(6);
  }

  function findTask(taskId) {
    const all = [state.tasks.daily, ...(state.tasks.main || []), ...(state.tasks.side || [])];
    return all.find((task) => task && task.id === taskId) || null;
  }

  function renderTaskDetail() {
    const task = findTask(activeTaskId);
    if (!task) {
      closeAllScreens();
      return;
    }

    const progress = taskProgress(task);
    const absurd = task.type === "side" && isAbsurdTask(task);
    const completed = progress.completed;

    els.taskScreenTag.textContent = typeLabel(task.type);

    const meta = [
      `<span class="chip xp">+${task.xp} XP</span>`,
      `<span class="chip coin">+${task.coins} 金币</span>`,
      task.type === "side" ? `<span class="chip category">${esc(task.category)}</span>` : "",
      task.difficulty ? `<span class="chip">${esc(task.difficulty)}</span>` : "",
      task.type === "main" && deadlineText(task)
        ? `<span class="chip category">${esc(deadlineText(task))}</span>`
        : "",
      absurd ? `<span class="chip absurd">荒诞</span>` : ""
    ]
      .filter(Boolean)
      .join("");

    const stepsHtml = task.steps
      .map(
        (step) => `
          <button type="button" class="step ${step.done ? "done" : ""}"
            data-step-id="${esc(step.id)}" aria-pressed="${step.done ? "true" : "false"}"
            ${completed ? "disabled" : ""}>
            <span class="step-check" aria-hidden="true">✓</span>
            <span>${esc(step.text)}</span>
          </button>
        `
      )
      .join("");

    const completedBanner = completed
      ? `<div class="completed-banner">✅ 已完成 · ${formatDateTime(task.completedAt)} 领取了奖励</div>`
      : "";

    const dailyBonus =
      task.type === "daily" && task.bonus
        ? `<div class="daily-bonus">🔥 ${esc(task.bonus)}</div>`
        : "";

    els.taskBody.innerHTML = `
      <div class="task-detail-head">
        <span class="eyebrow">${typeLabel(task.type)}${absurd ? " · 荒诞支线" : ""}</span>
        <h1>${esc(task.title)}</h1>
        <p>${esc(task.description)}</p>
        <div class="detail-meta">${meta}</div>
      </div>

      <div class="reward-panel">
        <div class="reward-panel-top">
          <span>🎁 任务奖励</span>
          <span class="chip xp">+${task.xp} XP</span>
          <span class="chip coin">+${task.coins} 金币</span>
        </div>
        <strong>${esc(task.reward.title)}</strong>
        ${task.reward.detail ? `<p>${esc(task.reward.detail)}</p>` : ""}
      </div>

      ${completedBanner}

      <div class="detail-progress">
        <span>任务进度</span>
        <span class="progress-pill">${progress.done}/${progress.total} 步</span>
      </div>
      <div class="steps">${stepsHtml}</div>
      ${dailyBonus}
      <p class="complete-note">${
        completed
          ? "这条任务已经完成，奖励已进入奖励仓库。"
          : "完成全部步骤后，按钮会亮起。别急着点，先真做。"
      }</p>
    `;

    if (completed) {
      els.taskFooter.innerHTML = `<button class="btn btn-ghost btn-block btn-lg" type="button" disabled>✅ 奖励已领取</button>`;
    } else {
      els.taskFooter.innerHTML = `
        <button class="btn btn-primary btn-block btn-lg" type="button" id="completeTaskBtn"
          ${progress.allDone ? "" : "disabled"}>
          ${progress.allDone ? "完成任务，领取奖励" : `还差 ${progress.total - progress.done} 步`}
        </button>
      `;
    }
  }

  /* ===== 奖励与完成 ===== */
  function grantRewards(task) {
    const beforeLevel = levelInfo(state.xp);
    state.xp += task.xp;
    state.coins += task.coins;
    const afterLevel = levelInfo(state.xp);

    state.rewards.unshift({
      id: uid("reward"),
      title: task.reward.title,
      detail: task.reward.detail,
      source: task.title,
      type: task.type,
      emoji: rewardEmoji(task),
      earnedAt: new Date().toISOString()
    });

    state.history.unshift({
      id: uid("history"),
      taskId: task.id,
      type: task.type,
      title: task.title,
      xp: task.xp,
      coins: task.coins,
      date: dateKey(),
      at: new Date().toISOString()
    });

    state.rewards = state.rewards.slice(0, 120);
    state.history = state.history.slice(0, 160);

    if (task.type === "daily") {
      const today = dateKey();
      if (state.lastFitnessCompletedDate !== today) {
        state.streak = (state.streak || 0) + 1;
        state.lastFitnessCompletedDate = today;
      }
    }

    return {
      beforeLevel,
      afterLevel,
      leveledUp: afterLevel.level > beforeLevel.level
    };
  }

  function completeTask(taskId) {
    const task = findTask(taskId);
    if (!task || task.completedAt) return;
    const progress = taskProgress(task);
    if (!progress.allDone) {
      toast("还有步骤没完成，先把它们勾掉", "error");
      return;
    }

    task.completedAt = new Date().toISOString();
    const result = grantRewards(task);
    saveState();
    renderAll();
    showClaim(task, result);
    burstConfetti();
  }

  function showClaim(task, result) {
    els.claimEmoji.textContent = rewardEmoji(task);
    els.claimTitle.textContent = task.type === "daily" ? "今日健身完成！" : "任务完成！";
    els.claimReward.textContent = task.reward.title;
    els.claimDetail.textContent = task.reward.detail || task.description;
    els.claimLevelUp.innerHTML = result.leveledUp
      ? `<span class="level-up">⬆️ 升级！Lv.${result.afterLevel.level} · ${result.afterLevel.title}</span>`
      : "";
    els.claimStats.innerHTML = [
      `<div><strong>+${task.xp}</strong><span>XP</span></div>`,
      `<div><strong>+${task.coins}</strong><span>金币</span></div>`,
      `<div><strong>${state.streak || 0}</strong><span>连续健身</span></div>`
    ].join("");
    showScreen("claimScreen");
  }

  function burstConfetti() {
    const colors = ["#0284c7", "#7c3aed", "#f59e0b", "#ec4899", "#10b981", "#38bdf8"];
    for (let index = 0; index < 48; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = `${5 + Math.random() * 6}px`;
      piece.style.height = `${10 + Math.random() * 10}px`;
      piece.style.animationDelay = `${Math.random() * 0.45}s`;
      piece.style.animationDuration = `${1.5 + Math.random() * 1.4}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      els.confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 3400);
    }
  }

  /* ===== 奖励仓库 / 数据 / 设置 ===== */
  function openRewards() {
    renderRewards();
    showScreen("rewardsScreen");
    setActiveTab("rewards");
  }

  function renderRewards() {
    const totalXp = state.history.reduce((sum, item) => sum + (Number(item.xp) || 0), 0);
    const totalCoins = state.history.reduce((sum, item) => sum + (Number(item.coins) || 0), 0);

    const summary = `
      <div class="summary-strip">
        <div><strong>${state.rewards.length}</strong><span>奖励</span></div>
        <div><strong>${totalXp}</strong><span>累计 XP</span></div>
        <div><strong>${totalCoins}</strong><span>累计金币</span></div>
      </div>
    `;

    const list = state.rewards.length
      ? state.rewards
          .map(
            (reward) => `
              <div class="reward-card">
                <div class="reward-emoji" aria-hidden="true">${reward.emoji || "🎁"}</div>
                <div class="reward-main">
                  <strong>${esc(reward.title)}</strong>
                  ${reward.detail ? `<p>${esc(reward.detail)}</p>` : ""}
                  <small>来自「${esc(reward.source)}」 · ${formatDate(reward.earnedAt)}</small>
                </div>
              </div>
            `
          )
          .join("")
      : emptyState("🎁", "奖励仓库还空着", "去完成第一个任务，把第一份奖励拿回来。");

    els.rewardsBody.innerHTML = summary + `<div class="reward-list">${list}</div>`;
  }

  function openStats() {
    renderStats();
    showScreen("statsScreen");
    setActiveTab("stats");
  }

  function renderStats() {
    const level = levelInfo(state.xp);
    const allTasks = [state.tasks.daily, ...state.tasks.main, ...state.tasks.side].filter(Boolean);
    const currentCompleted = allTasks.filter((task) => task.completedAt).length;
    const dailyDone = state.history.filter((item) => item.type === "daily").length;
    const mainDone = state.tasks.main.filter((task) => task.completedAt).length;
    const sideDone = state.tasks.side.filter((task) => task.completedAt).length;

    const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
    const days = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = addDays(new Date(), -offset);
      const key = dateKey(date);
      const done = state.history.some((item) => item.date === key && item.type === "daily");
      days.push({
        key,
        label: dayNames[date.getDay()],
        done,
        today: key === dateKey()
      });
    }

    const streakDots = days
      .map(
        (day) => `
          <div class="day-dot ${day.done ? "done" : ""} ${day.today ? "today" : ""}">
            <i></i><span>${day.label}</span>
          </div>
        `
      )
      .join("");

    els.statsBody.innerHTML = `
      <div class="stat-grid">
        <div class="stat-box"><strong>${state.xp}</strong><span>累计 XP</span></div>
        <div class="stat-box"><strong>${state.coins}</strong><span>金币</span></div>
        <div class="stat-box"><strong>${state.streak || 0}</strong><span>连续健身天数</span></div>
        <div class="stat-box"><strong>${state.history.length}</strong><span>累计完成任务</span></div>
      </div>

      <div class="panel">
        <h3>⬆️ 等级进度 · Lv.${level.level} ${level.title}</h3>
        <div class="xp-track" aria-hidden="true"><div class="xp-fill" style="width:${level.pct}%"></div></div>
        <p class="goal-summary" style="margin-top:8px">当前等级经验：${level.current} / ${level.need} XP</p>
      </div>

      <div class="panel">
        <h3>🎯 当前目标</h3>
        <p class="goal-summary">
          <strong>人生目标：</strong>${esc(state.profile?.lifeGoal || "尚未设置")}<br>
          <strong>短期目标：</strong>${esc(state.profile?.shortGoals || "尚未设置")}
        </p>
      </div>

      <div class="panel">
        <h3>🔥 最近 7 天健身</h3>
        <div class="streak-days">${streakDots}</div>
      </div>

      <div class="panel">
        <h3>🗂️ 当前任务完成度</h3>
        <p class="goal-summary">
          主线：${mainDone}/${state.tasks.main.length} · 支线：${sideDone}/${state.tasks.side.length} · 每日健身累计：${dailyDone} 次
        </p>
      </div>

      <div class="panel">
        <h3>📜 最近战报</h3>
        <div class="history-list">${buildHistoryHtml(5)}</div>
      </div>
    `;
  }

  function openSettings() {
    fillSettingsForm();
    showScreen("settingsScreen");
    setActiveTab("settings");
  }

  function fillSettingsForm() {
    const profile = state.profile;
    els.settingsName.value = profile?.name || "";
    els.settingsGender.value = profile?.gender || "保密";
    els.settingsLifeGoal.value = profile?.lifeGoal || "";
    els.settingsShortGoals.value = profile?.shortGoals || "";
    els.settingsApiKey.value = getApiKey();
    els.settingsApiKey.type = "password";
    els.toggleSettingsKeyBtn.textContent = "显示";
    els.settingsModel.value = getModel();
    updateKeyStatus();
  }

  function updateKeyStatus() {
    const hasKey = Boolean(getApiKey());
    els.settingsKeyStatus.textContent = hasKey
      ? `已配置 API Key（${getApiKey().slice(0, 6)}…）。Key 只保存在本机浏览器，只会发送到 api.deepseek.com。`
      : "未配置 API Key。保存后即可使用 AI 生成；也可以继续使用离线模板。";
  }

  async function saveProfileFromSettings() {
    const name = els.settingsName.value.trim();
    const gender = els.settingsGender.value;
    const lifeGoal = els.settingsLifeGoal.value.trim();
    const shortGoals = els.settingsShortGoals.value.trim();

    if (!name) {
      toast("先给玩家起个代号", "error");
      els.settingsName.focus();
      return;
    }
    if (!lifeGoal) {
      toast("人生目标不能为空", "error");
      els.settingsLifeGoal.focus();
      return;
    }

    const oldProfile = state.profile || {};
    const goalsChanged =
      oldProfile.lifeGoal !== lifeGoal || oldProfile.shortGoals !== shortGoals;

    state.profile = {
      ...oldProfile,
      name,
      gender,
      lifeGoal,
      shortGoals
    };
    saveState();
    renderHeader();
    toast("玩家信息已保存", "success");

    if (goalsChanged) {
      const confirmed = await askConfirm({
        emoji: "🔄",
        title: "目标已更新",
        message: "要立刻根据新目标重铸任务吗？当前任务进度会被替换，XP、金币和奖励仓库会保留。",
        okText: "立即重铸"
      });
      if (confirmed) {
        closeAllScreens();
        generationProfile = state.profile;
        startGeneration();
      }
    }
  }

  function saveAiSettings() {
    const key = els.settingsApiKey.value.trim();
    const model = els.settingsModel.value.trim() || DEFAULT_MODEL;
    setApiKey(key);
    setModel(model);
    saveState();
    updateKeyStatus();
    toast("AI 设置已保存", "success");
  }

  function exportData() {
    const data = JSON.parse(JSON.stringify(state));
    data.exportedAt = new Date().toISOString();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kingsystem-backup-${dateKey()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("存档已导出", "success");
  }

  async function importData(file) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || !parsed.profile || !parsed.tasks) {
        throw new Error("invalid");
      }
      const confirmed = await askConfirm({
        emoji: "📥",
        title: "导入存档",
        message: "导入会覆盖当前存档，包括玩家信息、任务、进度和奖励。确定继续吗？",
        okText: "导入并覆盖"
      });
      if (!confirmed) return;
      state = mergeState(parsed);
      saveState();
      location.reload();
    } catch {
      toast("存档格式不正确，导入失败", "error");
    }
  }

  async function resetData() {
    const confirmed = await askConfirm({
      emoji: "🧨",
      title: "清空所有数据",
      message: "玩家信息、任务、进度、奖励和本地 API Key 都会被删除，且无法恢复。确定吗？",
      okText: "全部清空",
      danger: true
    });
    if (!confirmed) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(KEY_STORAGE);
      localStorage.removeItem(MODEL_STORAGE);
    } catch {
      /* ignore */
    }
    location.reload();
  }

  async function regenerateTasks(fromSettings = false) {
    if (!hasProfile()) {
      openSetup();
      return;
    }
    const confirmed = await askConfirm({
      emoji: "✨",
      title: "重铸任务",
      message: "当前任务进度会被替换，XP、金币和奖励仓库会保留。要让金手指重新推演吗？",
      okText: "开始重铸"
    });
    if (!confirmed) return;
    if (fromSettings) closeAllScreens();
    generationProfile = state.profile;
    startGeneration();
  }

  /* ===== 确认弹窗 ===== */
  function askConfirm({
    emoji = "⚠️",
    title = "确认操作",
    message = "",
    okText = "确定",
    cancelText = "取消",
    danger = false
  } = {}) {
    els.confirmEmoji.textContent = emoji;
    els.confirmTitle.textContent = title;
    els.confirmMessage.textContent = message;
    els.confirmOkBtn.textContent = okText;
    els.confirmCancelBtn.textContent = cancelText;
    els.confirmOkBtn.className = `btn ${danger ? "btn-danger" : "btn-primary"}`;
    els.confirmScreen.classList.add("active");
    els.confirmScreen.setAttribute("aria-hidden", "false");
    document.body.classList.add("screen-open");

    return new Promise((resolve) => {
      confirmResolver = resolve;
    });
  }

  function resolveConfirm(value) {
    els.confirmScreen.classList.remove("active");
    els.confirmScreen.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".screen.active")) {
      document.body.classList.remove("screen-open");
    }
    if (confirmResolver) {
      const resolve = confirmResolver;
      confirmResolver = null;
      resolve(value);
    }
  }

  /* ===== 页面与导航 ===== */
  function showScreen(screenId) {
    $$(".screen").forEach((screen) => {
      const active = screen.id === screenId;
      screen.classList.toggle("active", active);
      screen.setAttribute("aria-hidden", active ? "false" : "true");
    });
    document.body.classList.add("screen-open");
  }

  function closeAllScreens() {
    $$(".screen").forEach((screen) => {
      screen.classList.remove("active");
      screen.setAttribute("aria-hidden", "true");
    });
    document.body.classList.remove("screen-open");
    activeTaskId = null;
    setActiveTab("dashboard");
  }

  function setActiveTab(tab) {
    $$(".tab").forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === tab);
    });
  }

  /* ===== 新手引导 ===== */
  function openSetup({ editing = false, returnScreen = null } = {}) {
    setupEditing = editing;
    setupReturnScreen = returnScreen;
    const profile = state.profile;

    els.inputName.value = profile?.name || "";
    els.inputLifeGoal.value = profile?.lifeGoal || "";
    els.inputShortGoals.value = profile?.shortGoals || "";
    els.inputApiKey.value = getApiKey();
    els.inputApiKey.type = "password";
    els.toggleSetupKeyBtn.textContent = "显示";
    selectedGender = profile?.gender || "";
    updateGenderUI();
    setSetupStep(0);
    els.setupCloseBtn.hidden = !editing;
    showScreen("setupScreen");
  }

  function updateGenderUI() {
    $$("#genderGroup button").forEach((button) => {
      button.classList.toggle("active", button.dataset.gender === selectedGender);
    });
  }

  function setSetupStep(step) {
    setupStep = Math.max(0, Math.min(2, step));
    $$(".setup-step").forEach((section) => {
      section.classList.toggle("active", Number(section.dataset.step) === setupStep);
    });
    $$("#stepDots span").forEach((dot, index) => {
      dot.classList.toggle("active", index === setupStep);
    });
    els.setupBackBtn.disabled = setupStep === 0;
    els.setupNextBtn.textContent =
      setupStep === 2 ? (setupEditing ? "保存并重铸" : "激活金手指") : "下一步";
  }

  function validateSetupStep(step) {
    if (step === 0) {
      if (!els.inputName.value.trim()) {
        toast("先给玩家起个代号", "error");
        els.inputName.focus();
        return false;
      }
      if (!selectedGender) {
        toast("请选择一个性别", "error");
        return false;
      }
    }
    if (step === 1) {
      if (!els.inputLifeGoal.value.trim()) {
        toast("人生目标不能为空", "error");
        els.inputLifeGoal.focus();
        return false;
      }
      if (!els.inputShortGoals.value.trim()) {
        toast("写一个短期目标，哪怕是「先活过这个月」", "error");
        els.inputShortGoals.focus();
        return false;
      }
    }
    return true;
  }

  async function finalizeSetup() {
    if (!validateSetupStep(0) || !validateSetupStep(1)) return;

    const profile = {
      name: els.inputName.value.trim(),
      gender: selectedGender,
      lifeGoal: els.inputLifeGoal.value.trim(),
      shortGoals: els.inputShortGoals.value.trim()
    };

    setApiKey(els.inputApiKey.value.trim());
    setModel(getModel());
    saveState();

    if (hasTasks()) {
      const confirmed = await askConfirm({
        emoji: "🔄",
        title: "重铸现有任务",
        message: "你已经有任务存档了。继续会替换当前任务进度，XP、金币和奖励仓库会保留。确定吗？",
        okText: "继续重铸"
      });
      if (!confirmed) return;
    }

    generationProfile = profile;
    startGeneration();
  }

  /* ===== 初始化 & 事件 ===== */
  function hasProfile() {
    return Boolean(state.profile?.name && state.profile?.lifeGoal);
  }

  function hasTasks() {
    return Boolean(
      state.tasks.main.length || state.tasks.side.length || state.tasks.daily
    );
  }

  function ensureDailyReset() {
    const today = dateKey();
    if (state.lastDailyDate === today) return false;

    const daily = state.tasks.daily;
    if (daily) {
      daily.steps.forEach((step) => {
        step.done = false;
      });
      daily.completedAt = null;
      daily.dailyDate = today;
      daily.bonus = pickDailyBonus(today);
    }

    const yesterday = dateKey(addDays(new Date(), -1));
    if (
      state.lastFitnessCompletedDate &&
      state.lastFitnessCompletedDate !== today &&
      state.lastFitnessCompletedDate !== yesterday
    ) {
      state.streak = 0;
    }

    state.lastDailyDate = today;
    saveState();
    return true;
  }

  function toast(message, type = "") {
    els.toast.textContent = message;
    els.toast.className = `toast show ${type}`.trim();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove("show");
    }, 2800);
  }

  function bindEvents() {
    els.headerSettingsBtn.addEventListener("click", openSettings);
    els.dashboardRegenerateBtn.addEventListener("click", () => regenerateTasks());
    els.dashboardRewardsBtn.addEventListener("click", openRewards);

    els.tabbar.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-tab]");
      if (!tab) return;
      const name = tab.dataset.tab;
      if (name === "dashboard") {
        closeAllScreens();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (name === "rewards") {
        openRewards();
      } else if (name === "stats") {
        openStats();
      } else if (name === "settings") {
        openSettings();
      }
    });

    els.dashboard.addEventListener("click", (event) => {
      const card = event.target.closest("[data-task-id]");
      if (card) openTask(card.dataset.taskId);
    });
    els.dashboard.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest("[data-task-id]");
      if (card) {
        event.preventDefault();
        openTask(card.dataset.taskId);
      }
    });

    els.setupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (setupStep < 2) {
        if (!validateSetupStep(setupStep)) return;
        setSetupStep(setupStep + 1);
        return;
      }
      await finalizeSetup();
    });
    els.setupBackBtn.addEventListener("click", () => setSetupStep(setupStep - 1));
    els.setupCloseBtn.addEventListener("click", () => {
      if (setupReturnScreen === "settings") {
        closeAllScreens();
        openSettings();
      } else {
        closeAllScreens();
      }
    });

    els.genderGroup.addEventListener("click", (event) => {
      const button = event.target.closest("[data-gender]");
      if (!button) return;
      selectedGender = button.dataset.gender;
      updateGenderUI();
    });

    [els.lifeChips, els.shortChips].forEach((container) => {
      container.addEventListener("click", (event) => {
        const chip = event.target.closest("[data-target]");
        if (!chip) return;
        const target = chip.dataset.target === "life" ? els.inputLifeGoal : els.inputShortGoals;
        const value = chip.dataset.value || chip.textContent.trim();
        if (!value) return;
        if (target.value.includes(value)) return;
        target.value = target.value.trim() ? `${target.value.trim()}；${value}` : value;
        target.focus();
      });
    });

    els.toggleSetupKeyBtn.addEventListener("click", () => togglePassword(els.inputApiKey, els.toggleSetupKeyBtn));
    els.toggleSettingsKeyBtn.addEventListener("click", () =>
      togglePassword(els.settingsApiKey, els.toggleSettingsKeyBtn)
    );

    els.taskBackBtn.addEventListener("click", closeAllScreens);
    els.taskCloseBtn.addEventListener("click", closeAllScreens);
    els.taskBody.addEventListener("click", (event) => {
      const step = event.target.closest("[data-step-id]");
      if (!step || !activeTaskId) return;
      toggleStep(activeTaskId, step.dataset.stepId);
    });
    els.taskFooter.addEventListener("click", (event) => {
      if (event.target.closest("#completeTaskBtn") && activeTaskId) {
        completeTask(activeTaskId);
      }
    });

    els.rewardsBackBtn.addEventListener("click", closeAllScreens);
    els.statsBackBtn.addEventListener("click", closeAllScreens);
    els.settingsBackBtn.addEventListener("click", closeAllScreens);

    els.saveProfileBtn.addEventListener("click", saveProfileFromSettings);
    els.saveAiBtn.addEventListener("click", saveAiSettings);
    els.regenerateBtn.addEventListener("click", () => regenerateTasks(true));
    els.exportBtn.addEventListener("click", exportData);
    els.importBtn.addEventListener("click", () => els.importFile.click());
    els.importFile.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (file) importData(file);
      event.target.value = "";
    });
    els.resetBtn.addEventListener("click", resetData);
    els.editSetupBtn.addEventListener("click", () => {
      closeAllScreens();
      openSetup({ editing: true, returnScreen: "settings" });
    });

    els.confirmOkBtn.addEventListener("click", () => resolveConfirm(true));
    els.confirmCancelBtn.addEventListener("click", () => resolveConfirm(false));

    els.errorRetryBtn.addEventListener("click", () => startGeneration());
    els.errorOfflineBtn.addEventListener("click", () => startGeneration({ offline: true }));
    els.errorSettingsBtn.addEventListener("click", () => {
      closeAllScreens();
      openSettings();
    });

    els.resultEnterBtn.addEventListener("click", () => {
      closeAllScreens();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    els.claimCloseBtn.addEventListener("click", () => {
      closeAllScreens();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (els.confirmScreen.classList.contains("active")) {
        resolveConfirm(false);
        return;
      }
      const activeScreens = $$(".screen.active");
      const top = activeScreens[activeScreens.length - 1];
      if (!top) return;
      if (["loadingScreen", "setupScreen", "resultScreen"].includes(top.id)) return;
      closeAllScreens();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && ensureDailyReset()) {
        renderAll();
        toast("新的一天，健身任务已刷新", "success");
      }
    });
  }

  function togglePassword(input, button) {
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.textContent = show ? "隐藏" : "显示";
  }

  function toggleStep(taskId, stepId) {
    const task = findTask(taskId);
    if (!task || task.completedAt) return;
    const step = task.steps.find((item) => item.id === stepId);
    if (!step) return;
    step.done = !step.done;
    saveState();
    renderTaskDetail();
    renderTasks();

    const progress = taskProgress(task);
    if (progress.allDone) {
      toast("全部步骤完成，可以领取奖励了", "success");
    }
  }

  function openTask(taskId) {
    const task = findTask(taskId);
    if (!task) return;
    activeTaskId = task.id;
    renderTaskDetail();
    showScreen("taskScreen");
  }

  function init() {
    state = loadState();
    ensureDailyReset();
    bindEvents();
    renderAll();

    if (!hasProfile() || !hasTasks()) {
      openSetup();
    }

    setInterval(() => {
      if (ensureDailyReset()) {
        renderAll();
        toast("新的一天，健身任务已刷新", "success");
      }
    }, 60000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
