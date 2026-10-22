/**
 * 金手指 · 目标 / 任务 / 奖励
 *
 * 依赖服务端接口 /api/goal.php（DeepSeek Key 保存在服务器，前端拿不到）。
 * 进度保存在浏览器 localStorage，按目标分别记录。
 */
(function () {
  'use strict';

  var STORE_KEY = 'gongziyu_goal_v2';
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

  function priorityText(value) {
    return { high: '高优先', medium: '中优先', low: '低优先' }[value] || '中优先';
  }

  /**
   * 阶段统计：每个阶段的完成百分比、是否全部完成，以及当前阶段下标（全部完成为 -1）
   */
  function stageStats(plan, done) {
    var stats = plan.goals.map(function (g, i) {
      var list = plan.tasks.filter(function (t) { return (Number(t.goalIndex) || 0) === i; });
      var d = list.filter(function (t) { return done.indexOf(t.id) !== -1; }).length;
      return { pct: pct(d, list.length), finished: list.length > 0 && d === list.length };
    });
    var prevAllDone = true;
    var currentIndex = -1;
    stats.forEach(function (info, i) {
      if (prevAllDone && !info.finished && currentIndex === -1) {
        currentIndex = i;
      }
      prevAllDone = prevAllDone && info.finished;
    });
    return { stats: stats, currentIndex: currentIndex };
  }

  /**
   * 当前阶段里下一个待完成的任务
   */
  function nextTask() {
    var rec = current();
    if (!rec) return null;
    var plan = ensurePlan(rec);
    var res = stageStats(plan, rec.done);
    if (res.currentIndex < 0) return null;
    for (var i = 0; i < plan.tasks.length; i++) {
      var task = plan.tasks[i];
      if ((Number(task.goalIndex) || 0) === res.currentIndex && rec.done.indexOf(task.id) === -1) {
        return { task: task, stageIndex: res.currentIndex, stage: plan.goals[res.currentIndex] };
      }
    }
    return null;
  }

  /* --------------------------- 本地存储 --------------------------- */

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.plans) {
          // 清理旧结构（含资源/长短期目标）的记录
          Object.keys(data.plans).forEach(function (key) {
            var rec = data.plans[key];
            if (!rec || !rec.plan || !Array.isArray(rec.plan.goals)) {
              delete data.plans[key];
              if (data.active === key) data.active = '';
            }
          });
          return data;
        }
      }
    } catch (e) { /* 忽略损坏数据 */ }
    return { version: 2, active: '', plans: {} };
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
    if (!Array.isArray(plan.goals)) plan.goals = [];
    if (!Array.isArray(plan.tasks)) plan.tasks = [];
    if (!Array.isArray(plan.rewards)) plan.rewards = [];
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

  function renderGoals(plan) {
    el.goalList.innerHTML = plan.goals.map(function (g, i) {
      return '<div class="goal-node" id="gn-' + i + '">' +
        '<div class="goal-node-head">' +
        '<span class="goal-node-index">' + (i + 1) + '</span>' +
        '<div>' +
        '<span class="goal-node-stage">' + escapeHtml(g.stage || ('第' + (i + 1) + '阶段')) + '</span>' +
        '<div class="goal-node-title">' + escapeHtml(g.title) + '</div>' +
        (g.desc ? '<p class="goal-node-desc">' + escapeHtml(g.desc) + '</p>' : '') +
        (g.measure ? '<p class="goal-node-measure">衡量标准：' + escapeHtml(g.measure) + '</p>' : '') +
        (g.deadline ? '<p class="goal-node-measure">节点：' + escapeHtml(g.deadline) + '</p>' : '') +
        '<span class="goal-node-state" id="g-state-' + i + '">未开始</span>' +
        '</div>' +
        '<span class="goal-node-pct" id="g-pct-' + i + '">0%</span>' +
        '</div>' +
        '<div class="goal-node-bar"><span id="g-bar-' + i + '"></span></div>' +
        '</div>';
    }).join('') || '<p class="goal-node-desc">暂无目标拆解。</p>';
  }

  function stageShortName(stage, i) {
    var text = String(stage || '').trim();
    var parts = text.split(/[·・:：]/);
    var name = parts.length > 1 ? parts[parts.length - 1].trim() : text;
    return name || ('第' + (i + 1) + '阶段');
  }

  function renderStageAxis(plan) {
    var total = plan.goals.length;
    var half = total > 0 ? (100 / (2 * total)) : 0;
    if (el.stageLine) {
      el.stageLine.style.left = half + '%';
      el.stageLine.style.right = half + '%';
    }
    if (!el.stageNodes) return;
    el.stageNodes.innerHTML = plan.goals.map(function (g, i) {
      var full = g.stage || ('第' + (i + 1) + '阶段');
      return '<div class="stage-node" id="sn-' + i + '" title="' +
        escapeHtml(full + ' · ' + g.title) + '">' +
        '<span class="stage-dot">' + (i + 1) + '</span>' +
        '<span class="stage-name">' + escapeHtml(stageShortName(g.stage, i)) + '</span>' +
        '</div>';
    }).join('');
  }

  function renderTasks(plan, done) {
    var groups = [];
    var map = {};
    plan.tasks.forEach(function (task) {
      var gi = Number(task.goalIndex) || 0;
      if (!map[gi]) {
        map[gi] = [];
        groups.push(gi);
      }
      map[gi].push(task);
    });

    el.taskGroups.innerHTML = groups.map(function (gi) {
      var list = map[gi];
      var goal = plan.goals[gi];
      var doneCount = list.filter(function (t) { return done.indexOf(t.id) !== -1; }).length;
      var stage = goal ? (goal.stage || ('第' + (gi + 1) + '阶段')) : ('第' + (gi + 1) + '阶段');
      var title = goal ? (stage + ' · ' + goal.title) : stage;
      return '<div class="task-stage">' +
        '<div class="task-stage-title">' + escapeHtml(title) +
        '<em>' + doneCount + '/' + list.length + '</em></div>' +
        list.map(function (task) {
          var isDone = done.indexOf(task.id) !== -1;
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
            '</span></span></label>';
        }).join('') +
        '</div>';
    }).join('');
  }

  function renderRewards(plan) {
    if (!plan.rewards.length) {
      el.rewardCard.hidden = true;
      return;
    }
    el.rewardCard.hidden = false;
    el.rewardList.innerHTML = plan.rewards.map(function (r, i) {
      return '<div class="reward-item" id="rw-' + i + '" data-at="' + (Number(r.unlockAt) || 0) + '">' +
        '<span class="reward-badge">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<path d="M20 12v9H4v-9"/><path d="M2 7h20v5H2z"/><path d="M12 21V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>' +
        '<path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>' +
        '</span>' +
        '<div><div class="reward-title">' + escapeHtml(r.title) + '</div>' +
        (r.condition ? '<p class="reward-cond">解锁条件：' + escapeHtml(r.condition) + '</p>' : '') +
        (r.desc ? '<p class="reward-desc">' + escapeHtml(r.desc) + '</p>' : '') +
        '</div>' +
        '<span class="reward-state" id="rw-state-' + i + '">待解锁</span>' +
        '</div>';
    }).join('');
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

    // 阶段阶梯进度：前一阶段全部完成，才解锁下一阶段
    var stageRes = stageStats(plan, rec.done);
    var statsOfStage = stageRes.stats;
    var currentIndex = stageRes.currentIndex;
    var currentPct = 0;
    var totalStage = plan.goals.length;
    var prevAllDone = true;
    statsOfStage.forEach(function (info, i) {
      var isCurrent = prevAllDone && !info.finished;
      if (isCurrent && currentIndex === i) {
        currentPct = info.pct;
      }
      var node = $('gn-' + i);
      if (node) {
        node.classList.toggle('is-done', info.finished);
        node.classList.toggle('is-current', isCurrent);
        node.classList.toggle('is-locked', !info.finished && !isCurrent);
        node.classList.toggle('is-last', i === statsOfStage.length - 1);
      }
      var axisNode = $('sn-' + i);
      if (axisNode) {
        axisNode.classList.toggle('is-done', info.finished);
        axisNode.classList.toggle('is-current', isCurrent);
        axisNode.classList.toggle('is-locked', !info.finished && !isCurrent);
      }
      var state = $('g-state-' + i);
      if (state) {
        state.textContent = info.finished ? '已完成' : (isCurrent ? '进行中' : '待解锁');
      }
      var bar = $('g-bar-' + i);
      var txt = $('g-pct-' + i);
      if (bar) bar.style.width = info.pct + '%';
      if (txt) txt.textContent = info.pct + '%';
      prevAllDone = prevAllDone && info.finished;
    });

    // 横轴进度条：填充到当前阶段节点（含该阶段内部进度）
    if (el.planStage) {
      el.planStage.hidden = !totalStage;
      var fill = 0;
      if (totalStage > 0) {
        if (currentIndex < 0) {
          fill = 100;
        } else if (totalStage > 1) {
          fill = ((currentIndex + currentPct / 100) / (totalStage - 1)) * 100;
        } else {
          fill = currentPct;
        }
      }
      if (el.stageFill) {
        el.stageFill.style.width = Math.max(0, Math.min(100, fill)) + '%';
      }
    }

    // 奖励解锁
    var unlocked = 0;
    plan.rewards.forEach(function (r, i) {
      var at = Number(r.unlockAt) || 0;
      var node = $('rw-' + i);
      var state = $('rw-state-' + i);
      var ok = value >= at;
      if (ok) unlocked++;
      if (node) node.classList.toggle('is-unlocked', ok);
      if (state) state.textContent = ok ? '已解锁' : (at + '% 解锁');
    });
    el.statReward.textContent = unlocked;

    // 分组计数
    var groups = el.taskGroups.querySelectorAll('.task-stage');
    for (var gi = 0; gi < groups.length; gi++) {
      var items = groups[gi].querySelectorAll('.task-item');
      var dc = 0;
      for (var ii = 0; ii < items.length; ii++) {
        if (items[ii].classList.contains('is-done')) dc++;
      }
      var em = groups[gi].querySelector('em');
      if (em) em.textContent = dc + '/' + items.length;
    }

    renderSavedGoals();
  }

  function renderAll() {
    var rec = current();
    if (!rec) return;
    var plan = ensurePlan(rec);
    el.progressWrap.hidden = false;
    el.planWrap.hidden = false;
    el.planGoalTitle.textContent = plan.restatedGoal || rec.goal;
    el.planSummary.textContent = plan.summary || '';
    el.planDuration.textContent = plan.duration ? ('预计周期：' + plan.duration) : '';
    el.planDuration.hidden = !plan.duration;
    el.goalInput.value = rec.goal;
    renderStageAxis(plan);
    renderGoals(plan);
    renderTasks(plan, rec.done);
    renderRewards(plan);
    updateProgress();
    showReminder();
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

  /* --------------------------- 任务提醒弹窗 --------------------------- */

  function openReminder(data) {
    var rec = current();
    if (!rec || !data || !el.reminder) return;
    var plan = ensurePlan(rec);
    var task = data.task;
    var goal = data.stage || {};
    el.remindStage.textContent = (goal.stage || ('第' + (data.stageIndex + 1) + '阶段')) +
      (goal.title ? ' · ' + goal.title : '');
    el.remindTitle.textContent = task.title;
    el.remindDesc.textContent = task.desc || '';
    el.remindDesc.hidden = !task.desc;
    var meta = [];
    if (task.estimate) meta.push('<span class="goal-modal-tag">' + escapeHtml(task.estimate) + '</span>');
    meta.push('<span class="goal-modal-tag ' + (task.priority || 'medium') + '">' + priorityText(task.priority) + '</span>');
    meta.push('<span class="goal-modal-tag">第' + (data.stageIndex + 1) + '/' + plan.goals.length + ' 阶段</span>');
    el.remindMeta.innerHTML = meta.join('');
    el.reminder.setAttribute('data-task-id', task.id);
    el.reminder.hidden = false;
    document.body.classList.add('is-modal-open');
  }

  function closeReminder() {
    if (!el.reminder) return;
    el.reminder.hidden = true;
    document.body.classList.remove('is-modal-open');
  }

  function showReminder() {
    var data = nextTask();
    if (!data) {
      closeReminder();
      return;
    }
    openReminder(data);
  }

  /* --------------------------- 奖励解锁弹窗 --------------------------- */

  var rewardQueue = [];

  function planProgress(rec, plan) {
    var total = plan.tasks.length;
    var done = plan.tasks.filter(function (t) { return rec.done.indexOf(t.id) !== -1; }).length;
    return pct(done, total);
  }

  function closeReward() {
    if (!el.rewardModal) return;
    el.rewardModal.hidden = true;
    document.body.classList.remove('is-modal-open');
  }

  function showRewardQueue() {
    if (!rewardQueue.length) {
      closeReward();
      advanceReminder();
      return;
    }
    var reward = rewardQueue.shift();
    if (!el.rewardModal) {
      advanceReminder();
      return;
    }
    var at = Number(reward.unlockAt) || 0;
    el.rewardTitle.textContent = reward.title;
    el.rewardCond.textContent = reward.condition
      ? ('解锁条件：' + reward.condition)
      : ('进度达到 ' + at + '%');
    el.rewardDesc.textContent = reward.desc || '';
    el.rewardDesc.hidden = !reward.desc;
    el.rewardModal.hidden = false;
    document.body.classList.add('is-modal-open');
  }

  function advanceReminder() {
    var next = nextTask();
    if (next) {
      openReminder(next);
    } else {
      closeReminder();
    }
  }

  function completeReminderTask() {
    var rec = current();
    if (!rec || !el.reminder) return;
    var plan = ensurePlan(rec);
    var id = el.reminder.getAttribute('data-task-id');
    var before = planProgress(rec, plan);

    if (id && rec.done.indexOf(id) === -1) {
      rec.done.push(id);
    }
    saveStore();

    var after = planProgress(rec, plan);
    renderTasks(plan, rec.done);
    updateProgress();
    closeReminder();

    // 本次达成的新解锁奖励（进度跨过 unlockAt）
    rewardQueue = plan.rewards.filter(function (r) {
      var at = Number(r.unlockAt) || 0;
      return after >= at && before < at;
    });

    showRewardQueue();
  }

  function showSkeleton(state) {
    el.skeleton.hidden = !state;
    el.planWrap.hidden = state || !current();
    el.progressWrap.hidden = state || !current();
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
        });
      })
      .then(function (data) {
        setLoading(false);
        showSkeleton(false);
        if (!data.ok) {
          showStatus(
            '拆解失败：' + escapeHtml(data.error || '请稍后重试') +
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
        upsertRecord(goal, extra, data.plan, !!options.keepProgress);
        hideStatus();
        renderAll();
        saveStore();
        try {
          history.replaceState(null, '', '?goal=' + encodeURIComponent(goal));
        } catch (e) { /* ignore */ }
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
    var goals = [
      { stage: '第1阶段·明确目标', title: '把目标写成可衡量的指标', desc: '把「' + goal + '」拆成数字与时间点。', measure: '写清衡量标准与截止日期', deadline: '第1周' },
      { stage: '第2阶段·备齐条件', title: '备齐实现目标所需的条件', desc: '完成指标后才进入这一阶段。', measure: '清单上的条件全部就位', deadline: '第2周' },
      { stage: '第3阶段·持续推进', title: '按计划持续推进', desc: '每天推进一个关键动作。', measure: '连续 4 周按计划执行', deadline: '第6周' },
      { stage: '第4阶段·验收固化', title: '验收并固化成果', desc: '对照衡量标准验收，沉淀流程。', measure: '达成最初设定的指标', deadline: '第8周' }
    ];
    var taskTpl = [
      ['写下目标的衡量标准', '把目标写成可量化的数字与日期。', 0, 'high'],
      ['列出当前与目标的差距', '找出 3 个最关键的差距。', 0, 'high'],
      ['收集 3 个可参考的案例', '总结别人做到的路径与方法。', 0, 'medium'],
      ['备齐工具与资料', '把需要的工具、课程、资料列成清单。', 1, 'medium'],
      ['制定每周执行计划', '把目标拆到每一周。', 1, 'medium'],
      ['搭建最小可行版本', '先用最小成本跑通完整流程。', 1, 'high'],
      ['每天推进一个关键动作', '每天只挑一件最重要的事。', 2, 'high'],
      ['记录过程数据', '用表格记录每天的关键数据。', 2, 'medium'],
      ['寻求一次外部反馈', '把阶段成果给懂行的人看。', 2, 'medium'],
      ['优化最薄弱的环节', '针对反馈做一次专项改进。', 2, 'medium'],
      ['做一次阶段性验收', '对照衡量标准补齐缺口。', 3, 'medium'],
      ['固化成习惯或流程', '把有效做法沉淀下来长期执行。', 3, 'low']
    ];

    return {
      goal: goal,
      restatedGoal: goal,
      summary: '这是未连接 AI 时生成的通用示例方案，配置服务端 DeepSeek Key 后可获得针对该目标的专属拆解。',
      duration: '8 周',
      goals: goals,
      tasks: taskTpl.map(function (t) {
        return { title: t[0], desc: t[1], estimate: '1-2 小时', goalIndex: t[2], priority: t[3] };
      }),
      rewards: [
        { title: '一杯喜欢的咖啡', condition: '完成前 3 个任务', desc: '给自己一个即时的小正向反馈。', unlockAt: 25 },
        { title: '看一场电影或半天休息', condition: '进度过半', desc: '犒劳坚持到一半的自己。', unlockAt: 50 },
        { title: '买一件想要的小物件', condition: '进度达到 75%', desc: '提前预支一点成就感。', unlockAt: 75 },
        { title: '一次短途旅行或大餐', condition: '全部任务完成', desc: '为完整走完全程庆祝一次。', unlockAt: 100 }
      ]
    };
  }

  /* ------------------------------ 事件 ------------------------------ */

  function bindEvents() {
    el.form.addEventListener('submit', function (e) {
      e.preventDefault();
      generate(el.goalInput.value, '', { keepProgress: true });
    });

    el.chips.addEventListener('click', function (e) {
      var chip = e.target.closest('.goal-chip');
      if (!chip) return;
      el.goalInput.value = chip.getAttribute('data-goal') || '';
      generate(el.goalInput.value, '', { keepProgress: true });
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

    el.btnDelete.addEventListener('click', function () {
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
        el.progressWrap.hidden = true;
        renderSavedGoals();
      }
    });

    if (el.remindLater) {
      el.remindLater.addEventListener('click', closeReminder);
    }
    if (el.remindDone) {
      el.remindDone.addEventListener('click', completeReminderTask);
    }
    if (el.remindMask) {
      el.remindMask.addEventListener('click', closeReminder);
    }
    if (el.rewardOk) {
      el.rewardOk.addEventListener('click', showRewardQueue);
    }
    if (el.rewardMask) {
      el.rewardMask.addEventListener('click', showRewardQueue);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (el.rewardModal && !el.rewardModal.hidden) {
        showRewardQueue();
      } else if (el.reminder && !el.reminder.hidden) {
        closeReminder();
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
    el.chips = $('goalChips');
    el.submit = $('goalSubmit');
    el.submitText = $('goalSubmitText');
    el.submitIcon = $('goalSubmitIcon');
    el.status = $('goalStatus');
    el.skeleton = $('goalSkeleton');
    el.planWrap = $('goalPlan');
    el.progressWrap = $('goalProgress');
    el.planGoalTitle = $('planGoalTitle');
    el.planSummary = $('planSummary');
    el.planDuration = $('planDuration');
    el.planStage = $('planStage');
    el.stageLine = $('stageAxisLine');
    el.stageFill = $('stageAxisFill');
    el.stageNodes = $('stageAxisNodes');
    el.ringFill = $('planRingFill');
    el.ringNum = $('planRingNum');
    el.ringLabel = $('planRingLabel');
    el.statDone = $('statDone');
    el.statTotal = $('statTotal');
    el.statLeft = $('statLeft');
    el.statReward = $('statReward');
    el.planBar = $('planBar');
    el.goalList = $('goalList');
    el.taskGroups = $('taskGroups');
    el.rewardCard = $('rewardCard');
    el.rewardList = $('rewardList');
    el.btnReset = $('btnReset');
    el.btnRegen = $('btnRegen');
    el.btnDelete = $('btnDelete');
    el.savedWrap = $('savedGoals');
    el.reminder = $('taskReminder');
    el.remindMask = $('remindMask');
    el.remindStage = $('remindStage');
    el.remindTitle = $('remindTitle');
    el.remindDesc = $('remindDesc');
    el.remindMeta = $('remindMeta');
    el.remindLater = $('remindLater');
    el.remindDone = $('remindDone');
    el.rewardModal = $('rewardUnlock');
    el.rewardMask = $('rewardMask');
    el.rewardTitle = $('rewardTitle');
    el.rewardCond = $('rewardCond');
    el.rewardDesc = $('rewardDesc');
    el.rewardOk = $('rewardOk');
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
