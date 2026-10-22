/**
 * 金手指 · 目标拆解与执行
 *
 * 依赖服务端接口 /api/goal.php（DeepSeek Key 保存在服务器，前端拿不到）。
 * 进度保存在浏览器 localStorage，按目标分别记录。
 */
(function () {
  'use strict';

  var STORE_KEY = 'gongziyu_goal_v1';
  var API_URL = '/api/goal.php';
  var RING_R = 54;
  var RING_C = 2 * Math.PI * RING_R;

  var el = {};
  var store = null;
  var loading = false;

  /* ----------------------------- 工具 ----------------------------- */

  function $(id) { return document.getElementById(id); }

  function hashGoal(text) {
    var h = 5381;
    for (var i = 0; i < text.length; i++) {
      h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    }
    return 'g' + (h >>> 0).toString(36);
  }

  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pct(done, total) {
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  /* --------------------------- 本地存储 --------------------------- */

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.plans) {
          return data;
        }
      }
    } catch (e) { /* 忽略损坏数据 */ }
    return { version: 1, active: '', plans: {} };
  }

  function saveStore() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch (e) { /* 容量不足时静默失败 */ }
  }

  function current() {
    return store.plans[store.active] || null;
  }

  function ensurePlan(record) {
    var plan = record.plan;
    if (!Array.isArray(plan.tasks)) plan.tasks = [];
    if (!Array.isArray(plan.resources)) plan.resources = [];
    if (!Array.isArray(plan.longTermGoals)) plan.longTermGoals = [];
    if (!Array.isArray(plan.shortTermGoals)) plan.shortTermGoals = [];
    if (!Array.isArray(plan.risks)) plan.risks = [];
    plan.tasks.forEach(function (task, i) { task.id = 't' + i; });
    if (!Array.isArray(record.done)) record.done = [];
    return plan;
  }

  function upsertRecord(goal, extra, plan, keepDone) {
    var key = hashGoal(goal);
    var old = store.plans[key];
    var done = [];
    if (keepDone && old && Array.isArray(old.done)) {
      var oldTitles = {};
      old.plan.tasks.forEach(function (t) {
        if (old.done.indexOf(t.id) !== -1) oldTitles[t.title] = true;
      });
      plan.tasks.forEach(function (t, i) {
        if (oldTitles[t.title]) done.push('t' + i);
      });
    }
    store.plans[key] = {
      goal: goal,
      extra: extra || '',
      plan: plan,
      done: done,
      createdAt: old ? old.createdAt : Date.now(),
      updatedAt: Date.now()
    };
    store.active = key;
    saveStore();
    return store.plans[key];
  }

  /* ----------------------------- 渲染 ----------------------------- */

  function renderSavedGoals() {
    var keys = Object.keys(store.plans);
    if (keys.length < 1) {
      el.savedWrap.hidden = true;
      return;
    }
    el.savedWrap.hidden = false;
    keys.sort(function (a, b) {
      return (store.plans[b].updatedAt || 0) - (store.plans[a].updatedAt || 0);
    });
    el.savedList.innerHTML = keys.map(function (key) {
      var rec = store.plans[key];
      var total = rec.plan.tasks.length;
      var done = rec.done.length;
      return '<button type="button" class="saved-goal' + (key === store.active ? ' is-active' : '') +
        '" data-key="' + key + '" title="' + escapeHtml(rec.goal) + '">' +
        '<span>' + escapeHtml(rec.goal) + '</span>' +
        '<i class="saved-pct">' + pct(done, total) + '%</i></button>';
    }).join('');
  }

  function renderResources(plan) {
    if (!plan.resources.length) {
      el.resourceList.innerHTML = '<p class="resource-desc">暂无资源建议。</p>';
      return;
    }
    el.resourceList.innerHTML = plan.resources.map(function (r) {
      return '<div class="resource-item">' +
        '<div class="resource-head"><span class="resource-type">' + escapeHtml(r.type || '资源') + '</span>' +
        '<span>' + escapeHtml(r.name) + '</span></div>' +
        (r.desc ? '<p class="resource-desc">' + escapeHtml(r.desc) + '</p>' : '') +
        (r.how ? '<p class="resource-how">获取方式：' + escapeHtml(r.how) + '</p>' : '') +
        '</div>';
    }).join('');
  }

  function renderLongTerm(plan) {
    el.longTermList.innerHTML = plan.longTermGoals.map(function (g, i) {
      return '<div class="goal-node">' +
        '<div class="goal-node-head">' +
        '<span class="goal-node-index">' + (i + 1) + '</span>' +
        '<div><div class="goal-node-title">' + escapeHtml(g.title) + '</div>' +
        (g.desc ? '<p class="goal-node-desc">' + escapeHtml(g.desc) + '</p>' : '') +
        (g.measure ? '<p class="goal-node-measure">衡量标准：' + escapeHtml(g.measure) + '</p>' : '') +
        (g.deadline ? '<p class="goal-node-measure">节点：' + escapeHtml(g.deadline) + '</p>' : '') +
        '</div>' +
        '<span class="goal-node-pct" id="lt-pct-' + i + '">0%</span>' +
        '</div>' +
        '<div class="goal-node-bar"><span id="lt-bar-' + i + '"></span></div>' +
        '</div>';
    }).join('') || '<p class="resource-desc">暂无长期目标。</p>';
  }

  function renderShortTerm(plan) {
    el.shortTermList.innerHTML = plan.shortTermGoals.map(function (g, i) {
      return '<div class="goal-node">' +
        '<div class="goal-node-head">' +
        '<span class="goal-node-index">' + (i + 1) + '</span>' +
        '<div><div class="goal-node-title">' + escapeHtml(g.title) + '</div>' +
        (g.desc ? '<p class="goal-node-desc">' + escapeHtml(g.desc) + '</p>' : '') +
        (g.measure ? '<p class="goal-node-measure">衡量标准：' + escapeHtml(g.measure) + '</p>' : '') +
        '</div>' +
        '<span class="goal-node-pct" id="st-pct-' + i + '">0%</span>' +
        '</div>' +
        '<div class="goal-node-bar"><span id="st-bar-' + i + '"></span></div>' +
        '</div>';
    }).join('') || '<p class="resource-desc">暂无短期目标。</p>';
  }

  function renderTasks(plan, done) {
    var stages = [];
    var stageMap = {};
    plan.tasks.forEach(function (task) {
      var name = task.stage || '执行阶段';
      if (!stageMap[name]) {
        stageMap[name] = [];
        stages.push(name);
      }
      stageMap[name].push(task);
    });

    el.taskGroups.innerHTML = stages.map(function (stage) {
      var list = stageMap[stage];
      var doneCount = list.filter(function (t) { return done.indexOf(t.id) !== -1; }).length;
      return '<div class="task-stage">' +
        '<div class="task-stage-title">' + escapeHtml(stage) +
        '<em>' + doneCount + '/' + list.length + ' 已完成</em></div>' +
        list.map(function (task) {
          var isDone = done.indexOf(task.id) !== -1;
          var st = plan.shortTermGoals[task.shortTermIndex];
          var priorityText = { high: '高优先', medium: '中优先', low: '低优先' }[task.priority] || '中优先';
          return '<label class="task-item' + (isDone ? ' is-done' : '') + '" data-id="' + task.id + '">' +
            '<input type="checkbox" ' + (isDone ? 'checked' : '') + '>' +
            '<span class="task-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">' +
            '<path d="M20 6L9 17l-5-5"/></svg></span>' +
            '<span class="task-body">' +
            '<span class="task-title">' + escapeHtml(task.title) + '</span>' +
            (task.desc ? '<span class="task-desc">' + escapeHtml(task.desc) + '</span>' : '') +
            '<span class="task-meta">' +
            (task.estimate ? '<span class="task-tag">' + escapeHtml(task.estimate) + '</span>' : '') +
            '<span class="task-tag ' + (task.priority || 'medium') + '">' + priorityText + '</span>' +
            (st ? '<span class="task-tag">' + escapeHtml(st.title) + '</span>' : '') +
            '</span></span></label>';
        }).join('') +
        '</div>';
    }).join('');
  }

  function renderRisks(plan) {
    if (!plan.risks.length) {
      el.riskCard.hidden = true;
      return;
    }
    el.riskCard.hidden = false;
    el.riskList.innerHTML = plan.risks.map(function (r) {
      return '<div class="risk-item"><b>' + escapeHtml(r.risk) + '</b>' +
        (r.mitigation ? '<br>应对：' + escapeHtml(r.mitigation) : '') + '</div>';
    }).join('');
    el.adviceBox.textContent = plan.advice || '';
    el.adviceCard.hidden = !plan.advice;
  }

  function updateProgress() {
    var rec = current();
    if (!rec) return;
    var plan = rec.plan;
    var total = plan.tasks.length;
    var done = plan.tasks.filter(function (t) { return rec.done.indexOf(t.id) !== -1; }).length;
    var value = pct(done, total);

    el.ringFill.style.strokeDasharray = RING_C;
    el.ringFill.style.strokeDashoffset = RING_C * (1 - value / 100);
    el.ringNum.textContent = value + '%';
    el.statDone.textContent = done;
    el.statTotal.textContent = total;
    el.statLeft.textContent = total - done;
    el.planBar.style.width = value + '%';

    if (total > 0 && done === total) {
      el.ringLabel.textContent = '全部完成';
    } else if (done === 0) {
      el.ringLabel.textContent = '开始吧';
    } else {
      el.ringLabel.textContent = '完成进度';
    }

    // 短期目标进度
    plan.shortTermGoals.forEach(function (g, i) {
      var list = plan.tasks.filter(function (t) { return t.shortTermIndex === i; });
      var d = list.filter(function (t) { return rec.done.indexOf(t.id) !== -1; }).length;
      var p = pct(d, list.length);
      var bar = $('st-bar-' + i);
      var txt = $('st-pct-' + i);
      if (bar) bar.style.width = p + '%';
      if (txt) txt.textContent = p + '%';
    });

    // 长期目标进度
    plan.longTermGoals.forEach(function (g, i) {
      var idx = [];
      plan.shortTermGoals.forEach(function (sg, si) {
        if (Number(sg.longTermIndex) === i) idx.push(si);
      });
      var list = plan.tasks.filter(function (t) { return idx.indexOf(Number(t.shortTermIndex)) !== -1; });
      var d = list.filter(function (t) { return rec.done.indexOf(t.id) !== -1; }).length;
      var p = pct(d, list.length);
      var bar = $('lt-bar-' + i);
      var txt = $('lt-pct-' + i);
      if (bar) bar.style.width = p + '%';
      if (txt) txt.textContent = p + '%';
    });

    // 阶段标题上的计数
    var groups = el.taskGroups.querySelectorAll('.task-stage');
    for (var gi = 0; gi < groups.length; gi++) {
      var items = groups[gi].querySelectorAll('.task-item');
      var dc = 0;
      for (var ii = 0; ii < items.length; ii++) {
        if (items[ii].classList.contains('is-done')) dc++;
      }
      var em = groups[gi].querySelector('em');
      if (em) em.textContent = dc + '/' + items.length + ' 已完成';
    }

    renderSavedGoals();
  }

  function renderAll() {
    var rec = current();
    if (!rec) return;
    var plan = ensurePlan(rec);
    el.planWrap.hidden = false;
    el.planGoalTitle.textContent = plan.restatedGoal || rec.goal;
    el.planSummary.textContent = plan.summary || '';
    el.planDuration.textContent = plan.duration ? ('预计周期：' + plan.duration) : '';
    el.planDuration.hidden = !plan.duration;
    el.goalInput.value = rec.goal;
    el.goalExtra.value = rec.extra || '';
    renderResources(plan);
    renderLongTerm(plan);
    renderShortTerm(plan);
    renderTasks(plan, rec.done);
    renderRisks(plan);
    updateProgress();
  }

  /* --------------------------- 状态提示 --------------------------- */

  function showStatus(html, isError) {
    el.status.className = 'goal-status' + (isError ? ' is-error' : '');
    el.status.innerHTML = html;
    el.status.hidden = false;
  }

  function hideStatus() {
    el.status.hidden = true;
    el.status.innerHTML = '';
  }

  function setLoading(state) {
    loading = state;
    el.submit.disabled = state;
    el.submitText.textContent = state ? 'AI 拆解中…' : 'AI 拆解目标';
    el.submitIcon.innerHTML = state
      ? '<span class="spinner"></span>'
      : '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  }

  function showSkeleton(state) {
    el.skeleton.hidden = !state;
    el.planWrap.hidden = state;
  }

  /* --------------------------- 生成方案 --------------------------- */

  function generate(goal, extra, options) {
    options = options || {};
    goal = String(goal || '').trim();
    extra = String(extra || '').trim();
    if (!goal) {
      showStatus('请先输入你想实现的目标。', true);
      el.goalInput.focus();
      return Promise.resolve(false);
    }
    if (loading) return Promise.resolve(false);

    setLoading(true);
    showSkeleton(true);
    showStatus('DeepSeek 正在拆解你的目标，通常需要 20-60 秒，请稍候…', false);

    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'plan', goal: goal, extra: extra })
    })
      .then(function (res) {
        return res.json().catch(function () {
          return { ok: false, error: '服务端返回异常' };
        }).then(function (data) {
          return { status: res.status, data: data };
        });
      })
      .then(function (result) {
        setLoading(false);
        showSkeleton(false);
        if (!result.data.ok) {
          showStatus(
            '拆解失败：' + escapeHtml(result.data.error || '请稍后重试') +
            '<div class="goal-status-actions">' +
            '<button type="button" class="goal-mini-btn" id="btnRetry">重试</button>' +
            '<button type="button" class="goal-mini-btn" id="btnOffline">使用示例方案</button>' +
            '</div>', true);
          var retry = $('btnRetry');
          var offline = $('btnOffline');
          if (retry) retry.addEventListener('click', function () { generate(goal, extra, options); });
          if (offline) {
            offline.addEventListener('click', function () {
              upsertRecord(goal, extra, buildOfflinePlan(goal), true);
              hideStatus();
              renderAll();
            });
          }
          return false;
        }
        upsertRecord(goal, extra, result.data.plan, !!options.keepProgress);
        hideStatus();
        renderAll();
        saveStore();
        try {
          history.replaceState(null, '', '?goal=' + encodeURIComponent(goal));
        } catch (e) { /* ignore */ }
        el.planWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      })
      .catch(function () {
        setLoading(false);
        showSkeleton(false);
        showStatus('网络异常，无法连接服务器，请检查网络后重试。', true);
        return false;
      });
  }

  /* -------------------------- 离线示例方案 -------------------------- */

  function buildOfflinePlan(goal) {
    var stages = ['第1阶段·明确目标', '第2阶段·准备资源', '第3阶段·执行推进', '第4阶段·复盘优化'];
    var shortTitles = [
      '把目标写成可衡量的指标',
      '备齐实现目标所需的资源',
      '按计划每天推进',
      '每周复盘并调整计划'
    ];
    var taskTpl = [
      ['写下目标的具体衡量标准', '把"' + goal + '"拆解成可量化的数字与时间点。'],
      ['列出当前差距', '对比现状与目标，找出 3 个最关键的差距。'],
      ['收集 3 个可参考的案例', '找到已经做到的人或团队，总结他们的路径。'],
      ['准备必备工具与资料', '把需要用到的工具、课程、资料列成清单并备齐。'],
      ['制定每周执行计划', '把目标拆到每一周，明确每周要交付什么。'],
      ['搭建最小可行版本', '先用最小成本跑通一遍完整流程。'],
      ['每天推进一个关键动作', '每天只挑一件最重要的事，做完再扩展。'],
      ['记录过程数据', '用表格记录每天的关键数据，便于复盘。'],
      ['寻求一次外部反馈', '把阶段成果给懂行的人看，收集改进意见。'],
      ['优化最薄弱的环节', '针对反馈中最突出的问题做一次专项改进。'],
      ['做一次阶段性验收', '对照衡量标准检查完成度，补齐缺口。'],
      ['固化成习惯或流程', '把验证有效的做法沉淀下来，长期执行。']
    ];
    var tasks = taskTpl.map(function (item, i) {
      return {
        title: item[0],
        desc: item[1],
        estimate: '1-2 小时',
        stage: stages[Math.min(Math.floor(i / 3), stages.length - 1)],
        shortTermIndex: Math.min(Math.floor(i / 3), 3),
        priority: i < 3 ? 'high' : (i < 8 ? 'medium' : 'low')
      };
    });
    return {
      goal: goal,
      restatedGoal: goal,
      summary: '这是未连接 AI 时生成的通用示例方案，配置服务端 DeepSeek Key 后可获得针对该目标的专属拆解。',
      duration: '8-12 周',
      resources: [
        { name: '目标拆解表', type: '工具', desc: '用于记录目标、衡量标准与每周进度', how: '用表格或在线文档自建一份' },
        { name: '同领域案例', type: '资料', desc: '参考已达成同类目标的路径与方法', how: '在社区、视频站或行业报告中检索' },
        { name: '每日执行清单', type: '工具', desc: '保证每天推进一个关键动作', how: '使用本站工具或任意待办应用' }
      ],
      longTermGoals: [
        { title: '彻底掌握实现该目标所需的核心能力', desc: '', measure: '能独立完成完整流程', deadline: '第12周' },
        { title: '形成稳定可复用的执行流程', desc: '', measure: '连续 4 周按计划执行', deadline: '第10周' },
        { title: '达成目标设定的衡量标准', desc: '', measure: '对照最初指标验收', deadline: '第12周' }
      ],
      shortTermGoals: shortTitles.map(function (t, i) {
        return { title: t, desc: '', measure: '完成本阶段全部任务', longTermIndex: Math.min(i, 2) };
      }),
      tasks: tasks,
      risks: [
        { risk: '目标太模糊导致执行漂移', mitigation: '先把衡量标准写成数字和日期' },
        { risk: '中途断档', mitigation: '每天只做一件关键小事，降低启动成本' }
      ],
      advice: '1. 先把目标写成可衡量的数字与日期。\n2. 每天只推进一个关键动作。\n3. 每周复盘一次，及时调整计划。'
    };
  }

  /* ------------------------------ 事件 ------------------------------ */

  function bindEvents() {
    el.form.addEventListener('submit', function (e) {
      e.preventDefault();
      generate(el.goalInput.value, el.goalExtra.value, { keepProgress: true });
    });

    el.chips.addEventListener('click', function (e) {
      var chip = e.target.closest('.goal-chip');
      if (!chip) return;
      el.goalInput.value = chip.getAttribute('data-goal') || '';
      generate(el.goalInput.value, el.goalExtra.value, { keepProgress: true });
    });

    el.taskGroups.addEventListener('change', function (e) {
      var input = e.target.closest('input[type="checkbox"]');
      if (!input) return;
      var rec = current();
      if (!rec) return;
      var item = input.closest('.task-item');
      var id = item.getAttribute('data-id');
      var index = rec.done.indexOf(id);
      if (input.checked) {
        item.classList.add('is-done');
        if (index === -1) rec.done.push(id);
      } else {
        item.classList.remove('is-done');
        if (index !== -1) rec.done.splice(index, 1);
      }
      saveStore();
      updateProgress();
    });

    el.btnReset.addEventListener('click', function () {
      var rec = current();
      if (!rec) return;
      if (!window.confirm('确定清空这个目标的所有完成进度吗？（方案本身保留）')) return;
      rec.done = [];
      saveStore();
      renderTasks(ensurePlan(rec), rec.done);
      updateProgress();
    });

    el.btnRegen.addEventListener('click', function () {
      var rec = current();
      if (!rec) return;
      if (!window.confirm('重新拆解会刷新方案内容，已勾选的进度将按任务标题尽量保留，继续吗？')) return;
      generate(rec.goal, rec.extra, { keepProgress: true });
    });

    el.btnDelete && el.btnDelete.addEventListener('click', function () {
      var rec = current();
      if (!rec) return;
      if (!window.confirm('删除当前目标及其全部进度？')) return;
      delete store.plans[store.active];
      var keys = Object.keys(store.plans);
      store.active = keys.length ? keys[0] : '';
      saveStore();
      if (store.active) {
        renderAll();
      } else {
        el.planWrap.hidden = true;
        renderSavedGoals();
      }
    });

    el.savedList.addEventListener('click', function (e) {
      var btn = e.target.closest('.saved-goal');
      if (!btn) return;
      store.active = btn.getAttribute('data-key');
      saveStore();
      hideStatus();
      renderAll();
    });
  }

  /* ------------------------------ 初始化 ------------------------------ */

  function init() {
    el.form = $('goalForm');
    el.goalInput = $('goalInput');
    el.goalExtra = $('goalExtra');
    el.chips = $('goalChips');
    el.submit = $('goalSubmit');
    el.submitText = $('goalSubmitText');
    el.submitIcon = $('goalSubmitIcon');
    el.status = $('goalStatus');
    el.skeleton = $('goalSkeleton');
    el.planWrap = $('goalPlan');
    el.planGoalTitle = $('planGoalTitle');
    el.planSummary = $('planSummary');
    el.planDuration = $('planDuration');
    el.ringFill = $('planRingFill');
    el.ringNum = $('planRingNum');
    el.ringLabel = $('planRingLabel');
    el.statDone = $('statDone');
    el.statTotal = $('statTotal');
    el.statLeft = $('statLeft');
    el.planBar = $('planBar');
    el.resourceList = $('resourceList');
    el.longTermList = $('longTermList');
    el.shortTermList = $('shortTermList');
    el.taskGroups = $('taskGroups');
    el.riskCard = $('riskCard');
    el.riskList = $('riskList');
    el.adviceCard = $('adviceCard');
    el.adviceBox = $('adviceBox');
    el.btnReset = $('btnReset');
    el.btnRegen = $('btnRegen');
    el.btnDelete = $('btnDelete');
    el.savedWrap = $('savedGoals');
    el.savedList = $('savedGoalsList');

    if (!el.form) return;

    store = loadStore();
    bindEvents();
    renderSavedGoals();

    var params = new URLSearchParams(window.location.search);
    var goalParam = (params.get('goal') || '').trim();

    if (goalParam) {
      el.goalInput.value = goalParam;
      var key = hashGoal(goalParam);
      if (store.plans[key]) {
        store.active = key;
        saveStore();
        renderAll();
        return;
      }
      generate(goalParam, '', { keepProgress: true });
      return;
    }

    if (store.active && store.plans[store.active]) {
      renderAll();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
