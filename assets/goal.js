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

  /** 本地日期 key，用于每日日常任务的重置 */
  function todayKey() {
    var d = new Date();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
  }

  function ensurePlan(record) {
    var plan = record.plan;
    if (!Array.isArray(plan.goals)) plan.goals = [];
    if (!Array.isArray(plan.tasks)) plan.tasks = [];
    if (!Array.isArray(plan.daily)) plan.daily = [];
    if (!Array.isArray(plan.rewards)) plan.rewards = [];
    plan.tasks.forEach(function (task, i) { task.id = 't' + i; });
    plan.daily.forEach(function (task, i) { task.id = 'd' + i; });
    if (!Array.isArray(record.done)) record.done = [];
    // 每日日常任务：换成新的一天就清空
    if (!record.daily || record.daily.date !== todayKey()) {
      record.daily = { date: todayKey(), ids: [] };
    }
    if (!Array.isArray(record.daily.ids)) record.daily.ids = [];
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

  function taskItemHtml(task, isDone) {
    var priority = { high: '高优先', medium: '中优先', low: '低优先' }[task.priority] || '中优先';
    return '<label class="task-item' + (isDone ? ' is-done' : '') + '" data-id="' + task.id + '">' +
      '<input type="checkbox" ' + (isDone ? 'checked' : '') + '>' +
      '<span class="task-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">' +
      '<path d="M20 6L9 17l-5-5"/></svg></span>' +
      '<span class="task-body">' +
      '<span class="task-title">' + escapeHtml(task.title) + '</span>' +
      (task.desc ? '<span class="task-desc">' + escapeHtml(task.desc) + '</span>' : '') +
      '<span class="task-meta">' +
      (task.estimate ? '<span class="task-tag">' + escapeHtml(task.estimate) + '</span>' : '') +
      '<span class="task-tag ' + (task.priority || 'medium') + '">' + priority + '</span>' +
      '</span></span></label>';
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
      return '<div class="stage-node" id="sn-' + i + '" data-index="' + i +
        '" role="button" tabindex="0" title="' + escapeHtml(full + ' · ' + g.title) + '">' +
        '<span class="stage-dot">' + (i + 1) + '</span>' +
        '<span class="stage-name">' + escapeHtml(stageShortName(g.stage, i)) + '</span>' +
        '</div>';
    }).join('');
  }

  /* ------------------- 点击阶段：展开该阶段内容与任务 ------------------- */

  var activeStage = -1;

  function highlightStageNode(index) {
    if (!el.stageNodes) return;
    var nodes = el.stageNodes.querySelectorAll('.stage-node');
    for (var n = 0; n < nodes.length; n++) {
      nodes[n].classList.toggle('is-active', n === index);
    }
  }

  function closeStageDetail() {
    if (!el.stageDetail) return;
    el.stageDetail.hidden = true;
    el.stageDetail.innerHTML = '';
    activeStage = -1;
    highlightStageNode(-1);
  }

  /** 在进度面板下方展开某个阶段的内容 + 任务；不传 index 时展开当前阶段 */
  function renderStageDetail(index) {
    var rec = current();
    if (!rec || !el.stageDetail) return;
    var plan = ensurePlan(rec);
    var stats = stageStats(plan, rec.done);
    if (typeof index !== 'number' || index < 0) {
      index = stats.currentIndex;
    }
    var g = plan.goals[index];
    if (!g) {
      closeStageDetail();
      return;
    }
    activeStage = index;
    highlightStageNode(index);

    var info = stats.stats[index] || { pct: 0, finished: false };
    var isCurrent = stats.currentIndex === index;
    var stateText = info.finished ? '已完成' : (isCurrent ? '进行中' : '待解锁');
    var list = plan.tasks.filter(function (t) { return (Number(t.goalIndex) || 0) === index; });
    var doneCount = list.filter(function (t) { return rec.done.indexOf(t.id) !== -1; }).length;

    el.stageDetail.innerHTML =
      '<div class="stage-detail-head">' +
      '<span class="goal-node-stage">' + escapeHtml(g.stage || ('第' + (index + 1) + '阶段')) + '</span>' +
      '<span class="goal-node-state' + (info.finished ? ' is-done' : (isCurrent ? ' is-current' : '')) + '">' +
      stateText + '</span>' +
      '<span class="goal-node-pct">' + info.pct + '%</span>' +
      '<button type="button" class="stage-detail-close" id="stageDetailClose">收起</button>' +
      '</div>' +
      '<div class="goal-node-title">' + escapeHtml(g.title) + '</div>' +
      (g.desc ? '<p class="goal-node-desc">' + escapeHtml(g.desc) + '</p>' : '') +
      (g.measure ? '<p class="goal-node-measure">衡量标准：' + escapeHtml(g.measure) + '</p>' : '') +
      (g.deadline ? '<p class="goal-node-measure">节点：' + escapeHtml(g.deadline) + '</p>' : '') +
      '<div class="goal-node-bar"><span style="width:' + info.pct + '%"></span></div>' +
      (list.length
        ? '<div class="task-stage">' +
        '<div class="task-stage-title">阶段任务<em>' + doneCount + '/' + list.length + '</em></div>' +
        list.map(function (t) {
          return taskItemHtml(t, rec.done.indexOf(t.id) !== -1);
        }).join('') +
        '</div>'
        : '');
    el.stageDetail.hidden = false;
  }

  /** 点击阶段：再次点击已展开的阶段则收起 */
  function selectStage(index) {
    if (index === activeStage && el.stageDetail && !el.stageDetail.hidden) {
      closeStageDetail();
      return;
    }
    renderStageDetail(index);
  }

  /**
   * 今日任务 = 日常任务（按天记录，换天自动重置）+ 一项当前阶段任务
   */
  function renderToday(plan, rec) {
    var list = plan.daily || [];
    var ids = rec.daily.ids;
    var doneCount = list.filter(function (t) { return ids.indexOf(t.id) !== -1; }).length;
    var value = pct(doneCount, list.length);
    var next = nextTask();

    el.todayCard.hidden = !list.length && !next;
    if (el.todayCard.hidden) {
      el.todaySummary.innerHTML = '';
      el.todayList.innerHTML = '';
      el.todayStage.hidden = true;
      el.todayStageList.innerHTML = '';
      return;
    }

    el.todaySummary.innerHTML =
      '<div class="daily-head">' +
      '<span class="daily-count"><b>' + doneCount + '/' + list.length + '</b> 日常已完成</span>' +
      '<span class="daily-hint">' + (list.length && doneCount === list.length ? '今日日常全部完成' : '每天 0 点自动重置') + '</span>' +
      '</div>' +
      '<div class="daily-bar"><span style="width:' + value + '%"></span></div>';

    el.todayList.innerHTML = list.map(function (task) {
      var isDone = ids.indexOf(task.id) !== -1;
      return '<label class="task-item' + (isDone ? ' is-done' : '') + '" data-id="' + task.id + '">' +
        '<input type="checkbox" ' + (isDone ? 'checked' : '') + '>' +
        '<span class="task-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">' +
        '<path d="M20 6L9 17l-5-5"/></svg></span>' +
        '<span class="task-body">' +
        '<span class="task-title">' + escapeHtml(task.title) + '</span>' +
        (task.desc ? '<span class="task-desc">' + escapeHtml(task.desc) + '</span>' : '') +
        '</span>' +
        (task.estimate ? '<span class="task-estimate">' + escapeHtml(task.estimate) + '</span>' : '') +
        '</label>';
    }).join('');

    if (!next) {
      el.todayStage.hidden = true;
      el.todayStageList.innerHTML = '';
      return;
    }
    el.todayStage.hidden = false;
    el.todayStageName.textContent = next.stage
      ? (next.stage.stage || ('第' + (next.stageIndex + 1) + '阶段'))
      : ('第' + (next.stageIndex + 1) + '阶段');
    el.todayStageList.innerHTML = taskItemHtml(next.task, false);
  }

  /** 勾选一次性任务（整合面板 / 阶段详情里都能点），完成给奖励 */
  function toggleTask(id, checked) {
    var rec = current();
    if (!rec) return;
    var index = rec.done.indexOf(id);
    if (checked) {
      if (index === -1) {
        // 列表里直接勾选也发放奖励
        grantRewards(finishTask(id));
      }
      return;
    }
    if (index !== -1) {
      rec.done.splice(index, 1);
      saveStore();
      renderToday(ensurePlan(rec), rec);
      updateProgress();
    }
  }

  /** 勾选每日日常任务：按天记录，完成给小奖励 */
  function toggleDailyTask(id, checked) {
    var rec = current();
    if (!rec) return;
    var plan = ensurePlan(rec);
    var index = rec.daily.ids.indexOf(id);
    if (checked) {
      if (index === -1) rec.daily.ids.push(id);
    } else if (index !== -1) {
      rec.daily.ids.splice(index, 1);
    }
    saveStore();
    renderToday(plan, rec);
    if (!checked) return;
    var allDone = plan.daily.length > 0 && plan.daily.length === rec.daily.ids.length;
    grantRewards({ plan: plan, newStages: [] },
      allDone ? '今日日常任务全部完成，可以安心收工了。' : '完成一个日常任务，先给自己一点即时反馈。');
  }

  /**
   * 奖励改为弹窗发放（任务小奖励 / 阶段大奖励），奖励清单面板不再展示。
   * 解锁数量仍会在进度面板的「已解锁奖励」统计里体现。
   */
  function renderRewards() {
    el.rewardCard.hidden = true;
    el.rewardList.innerHTML = '';
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

    // 奖励解锁：方案里的奖励按阶段一一对应，前 N 个奖励由对应阶段完成解锁
    var unlocked = 0;
    plan.rewards.forEach(function (r, i) {
      var at = Number(r.unlockAt) || 0;
      var node = $('rw-' + i);
      var state = $('rw-state-' + i);
      var byStage = i < statsOfStage.length;
      var ok = byStage ? statsOfStage[i].finished : value >= at;
      if (ok) unlocked++;
      if (node) node.classList.toggle('is-unlocked', ok);
      if (state) {
        state.textContent = ok ? '已解锁' : (byStage ? ('完成第' + (i + 1) + '阶段') : (at + '% 解锁'));
      }
    });
    el.statReward.textContent = unlocked;

    // 阶段详情展开时同步刷新
    if (el.stageDetail && !el.stageDetail.hidden) {
      renderStageDetail(activeStage);
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
    renderStageDetail();
    renderToday(plan, rec);
    renderRewards();
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

  /* --------------------------- 语音播报 --------------------------- */

  var SPEAK_KEY = 'gongziyu_goal_speak';
  var pendingSpeak = '';

  function speakSupported() {
    return typeof window.speechSynthesis !== 'undefined' &&
      typeof window.SpeechSynthesisUtterance !== 'undefined';
  }

  function speakOn() {
    try {
      return localStorage.getItem(SPEAK_KEY) !== '0';
    } catch (e) {
      return true;
    }
  }

  function pickZhVoice() {
    var voices = window.speechSynthesis.getVoices() || [];
    for (var i = 0; i < voices.length; i++) {
      if (/^zh/i.test(voices[i].lang) || /Chinese|中文/i.test(voices[i].name)) {
        return voices[i];
      }
    }
    return null;
  }

  function speak(text) {
    if (!speakSupported() || !text) return;
    try {
      window.speechSynthesis.cancel();
      var u = new window.SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 1.05;
      var voice = pickZhVoice();
      if (voice) {
        try { u.voice = voice; } catch (e) { /* 音色设置失败仍继续播报 */ }
      }
      window.speechSynthesis.speak(u);
    } catch (e) { /* 浏览器不支持时静默忽略 */ }
  }

  function stopSpeak() {
    if (!speakSupported()) return;
    try {
      window.speechSynthesis.cancel();
    } catch (e) { /* ignore */ }
  }

  /**
   * 播报弹窗内容；iOS Safari 等要求用户交互后才能发声，
   * 因此先尝试播报，失败/无声时存为 pending，等首次交互再补播。
   */
  function speakModal(text) {
    pendingSpeak = text;
    if (speakOn()) {
      speak(text);
    }
  }

  function toggleSpeak() {
    var next = !speakOn();
    try {
      localStorage.setItem(SPEAK_KEY, next ? '1' : '0');
    } catch (e) { /* ignore */ }
    updateSpeakLabels();
    if (next) {
      speak(pendingSpeak || (el.remindTitle ? el.remindTitle.textContent : ''));
    } else {
      stopSpeak();
    }
  }

  function updateSpeakLabels() {
    var label = speakOn() ? '播报：开' : '播报：关';
    if (el.remindSpeak) el.remindSpeak.textContent = label;
    if (el.rewardSpeak) el.rewardSpeak.textContent = label;
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
    speakModal('叮....宿主，新任务开启，' + (goal.stage || '') + '，' + task.title + '。' + (task.desc || ''));
  }

  function closeReminder() {
    if (!el.reminder) return;
    el.reminder.hidden = true;
    document.body.classList.remove('is-modal-open');
    stopSpeak();
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

  /* 即时小奖励池：每完成一个任务随机给一个 */
  var SMALL_REWARDS = [
    '伸个懒腰，站起来走动 2 分钟',
    '喝一杯水，顺便远眺 20 秒',
    '听一首喜欢的歌',
    '刷 5 分钟想看的内容',
    '吃一小块黑巧克力或喜欢的水果',
    '给朋友发条消息炫耀一下进度',
    '闭眼深呼吸 10 次，放松肩颈',
    '看一眼窗外，活动一下手腕'
  ];

  /* 大奖励兜底池：方案里没有对应阶段奖励时使用 */
  var BIG_REWARDS = [
    '吃一顿一直想吃的大餐',
    '买一件惦记已久的东西',
    '给自己放半天假',
    '做一次按摩或 SPA',
    '约朋友好好聚一次',
    '安排一次短途出行'
  ];

  var rewardQueue = [];
  var lastSmallIndex = -1;

  function pickSmallReward() {
    var i = Math.floor(Math.random() * SMALL_REWARDS.length);
    if (SMALL_REWARDS.length > 1 && i === lastSmallIndex) {
      i = (i + 1) % SMALL_REWARDS.length;
    }
    lastSmallIndex = i;
    return SMALL_REWARDS[i];
  }

  function stageNameOf(plan, i) {
    return (plan.goals[i] && plan.goals[i].stage) || ('第' + (i + 1) + '阶段');
  }

  /* 阶段 i 对应的大奖励：优先用方案里的奖励，不足时用兜底池 */
  function bigRewardFor(plan, i) {
    var stage = stageNameOf(plan, i);
    var r = plan.rewards[i];
    if (r && r.title) {
      return {
        big: true,
        stageIndex: i,
        title: r.title,
        desc: r.desc || '',
        condition: '完成' + stage
      };
    }
    return {
      big: true,
      stageIndex: i,
      title: BIG_REWARDS[i % BIG_REWARDS.length],
      desc: '完成' + stage + '，值得好好犒劳自己。',
      condition: '完成' + stage
    };
  }

  function closeReward() {
    if (!el.rewardModal) return;
    el.rewardModal.hidden = true;
    document.body.classList.remove('is-modal-open');
    stopSpeak();
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
    var isBig = !!reward.big;
    el.rewardModal.classList.toggle('is-big', isBig);
    el.rewardModal.classList.toggle('is-small', !isBig);
    el.rewardKicker.textContent = isBig ? '大奖励已解锁' : '小奖励到账';
    el.rewardOk.textContent = isBig ? '收下奖励' : '收下，继续';
    el.rewardTitle.textContent = reward.title;
    el.rewardCond.textContent = reward.condition || '';
    el.rewardCond.hidden = !reward.condition;
    el.rewardDesc.textContent = reward.desc || '';
    el.rewardDesc.hidden = !reward.desc;
    el.rewardModal.hidden = false;
    document.body.classList.add('is-modal-open');
    speakModal(isBig
      ? ('恭喜宿主，' + (reward.condition || '阶段完成') + '，大奖励解锁：' + reward.title + '。' + (reward.desc || ''))
      : ('恭喜宿主，小奖励到账，' + reward.title + '。' + (reward.desc || '')));
  }

  function advanceReminder() {
    var next = nextTask();
    if (next) {
      openReminder(next);
    } else {
      closeReminder();
      speakModal('恭喜宿主，全部任务已完成，目标达成。');
    }
  }

  /**
   * 勾选一个任务：保存进度并重算阶段状态，返回本次新完成的阶段下标
   */
  function finishTask(id) {
    var rec = current();
    if (!rec) return null;
    var plan = ensurePlan(rec);
    var before = stageStats(plan, rec.done).stats.map(function (s) { return s.finished; });

    if (id && rec.done.indexOf(id) === -1) {
      rec.done.push(id);
    }
    saveStore();

    var after = stageStats(plan, rec.done).stats;
    var newStages = [];
    after.forEach(function (s, i) {
      if (s.finished && !before[i]) {
        newStages.push(i);
      }
    });

    renderToday(plan, rec);
    updateProgress();
    return { plan: plan, newStages: newStages };
  }

  /**
   * 发放奖励：完成阶段给大奖励，否则给即时小奖励
   */
  function grantRewards(res, note) {
    if (!res) {
      closeReminder();
      return;
    }
    rewardQueue = res.newStages.map(function (i) {
      return bigRewardFor(res.plan, i);
    });
    if (!rewardQueue.length) {
      rewardQueue = [{
        big: false,
        title: pickSmallReward(),
        desc: note || '完成一个任务，先给自己一点即时反馈。'
      }];
    }
    showRewardQueue();
  }

  function completeReminderTask() {
    var id = el.reminder ? el.reminder.getAttribute('data-task-id') : '';
    var res = finishTask(id);
    closeReminder();
    grantRewards(res);
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
      daily: [
        { title: '记录今天的关键数据', desc: '花 2 分钟记下与目标相关的数字。', estimate: '2 分钟' },
        { title: '推进一个关键动作', desc: '做一件离目标更近的小事。', estimate: '20 分钟' },
        { title: '今日复盘', desc: '记下今天做对了什么、明天改什么。', estimate: '3 分钟' }
      ],
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

    el.todayList.addEventListener('change', function (e) {
      var input = e.target.closest('input[type="checkbox"]');
      if (!input) return;
      var item = input.closest('.task-item');
      if (!item) return;
      toggleDailyTask(item.getAttribute('data-id'), input.checked);
    });

    // 今日任务里的那一项阶段任务
    el.todayStageList.addEventListener('change', function (e) {
      var input = e.target.closest('input[type="checkbox"]');
      if (!input) return;
      var item = input.closest('.task-item');
      if (!item) return;
      toggleTask(item.getAttribute('data-id'), input.checked);
    });

    // 点击横轴阶段：在下方展开该阶段内容与任务
    if (el.stageNodes) {
      el.stageNodes.addEventListener('click', function (e) {
        var node = e.target.closest('.stage-node');
        if (!node) return;
        selectStage(Number(node.getAttribute('data-index')));
      });
      el.stageNodes.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var node = e.target.closest('.stage-node');
        if (!node) return;
        e.preventDefault();
        selectStage(Number(node.getAttribute('data-index')));
      });
    }

    el.stageDetail.addEventListener('change', function (e) {
      var input = e.target.closest('input[type="checkbox"]');
      if (!input) return;
      var item = input.closest('.task-item');
      if (!item) return;
      toggleTask(item.getAttribute('data-id'), input.checked);
    });

    el.stageDetail.addEventListener('click', function (e) {
      if (e.target.closest('#stageDetailClose')) {
        closeStageDetail();
      }
    });

    el.btnReset.addEventListener('click', function () {
      var rec = current();
      if (!rec) return;
      if (!window.confirm('确定清空这个目标的所有完成进度吗？（方案本身保留）')) return;
      rec.done = [];
      saveStore();
      renderToday(ensurePlan(rec), rec);
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
    if (el.remindSpeak) {
      el.remindSpeak.addEventListener('click', toggleSpeak);
    }
    if (el.rewardSpeak) {
      el.rewardSpeak.addEventListener('click', toggleSpeak);
    }
    // iOS/部分浏览器要求用户交互后才能发声：首次交互时补播
    document.addEventListener('click', function flush() {
      document.removeEventListener('click', flush);
      if (!pendingSpeak) return;
      if (speakOn()) {
        speak(pendingSpeak);
      }
      pendingSpeak = '';
    });
    if (speakSupported()) {
      window.speechSynthesis.addEventListener('voiceschanged', updateSpeakLabels);
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
    el.stageDetail = $('stageDetail');
    el.ringFill = $('planRingFill');
    el.ringNum = $('planRingNum');
    el.ringLabel = $('planRingLabel');
    el.statDone = $('statDone');
    el.statTotal = $('statTotal');
    el.statLeft = $('statLeft');
    el.statReward = $('statReward');
    el.planBar = $('planBar');
    el.todayCard = $('todayCard');
    el.todaySummary = $('todaySummary');
    el.todayList = $('todayList');
    el.todayStage = $('todayStage');
    el.todayStageName = $('todayStageName');
    el.todayStageList = $('todayStageList');
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
    el.rewardKicker = $('rewardKicker');
    el.remindSpeak = $('remindSpeak');
    el.rewardSpeak = $('rewardSpeak');
    updateSpeakLabels();
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
