<?php
/**
 * 金手指 · 目标 → 任务 → 奖励
 * 输入目标 → 服务端调用 DeepSeek 拆解 → 勾选任务实时显示进度与奖励解锁
 */
$pageTitle = '金手指 - AI目标拆解与执行 | 公子鱼AI实验室';
$pageDescription = '输入一个目标，AI 自动拆成目标阶梯、可执行任务与阶段性奖励。完成一项勾选一项，进度与奖励实时更新。';
$pageKeywords = '金手指,目标拆解,AI目标规划,任务清单,目标进度,奖励机制,DeepSeek,公子鱼AI实验室';
$canonical = 'https://gongziyu.com/goal.php';
$ogTitle = '金手指 - AI目标拆解与执行';
$ogDescription = '输入目标，AI 拆成目标阶梯、任务清单与阶段性奖励，一步一步完成。';
$activeNav = 'goal';
$pwaTitle = '金手指';

$pageHead = '<link rel="stylesheet" href="/assets/goal.css">';
$pageScripts = '<script src="/assets/goal.js" defer></script>';

require __DIR__ . '/includes/header.php';
?>

  <section class="goal-page">
    <div class="container">

      <div class="goal-hero">
        
        <h1 class="goal-title">金手指系统，<span class="highlight">帮你实现目标。</span></h1>
        <form class="goal-form" id="goalForm" autocomplete="off">
        <div class="goal-form-row">
          <div class="goal-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            <input type="text" id="goalInput" maxlength="300" placeholder="输入你想实现的目标">
          </div>
          <button type="submit" class="btn btn-primary goal-submit" id="goalSubmit">
            <span id="goalSubmitText">开启新目标</span>
            <span id="goalSubmitIcon">
              <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </button>
        </div>

        <div class="goal-chips" id="goalChips">
          
          <button type="button" class="goal-chip" data-goal="百万房产销冠">百万房产销冠</button>
          <button type="button" class="goal-chip" data-goal="0-1操盘亿级服装电商">0-1操盘亿级服装电商</button>
          <button type="button" class="goal-chip" data-goal="一年开发12个app">一年开发12个app</button>
          <button type="button" class="goal-chip" data-goal="三个月练成六块腹肌">三个月练成六块腹肌</button>
        </div>
      </form>
       
      </div>

      <!-- 我的目标（多目标切换） -->
      <div class="saved-goals" id="savedGoals" hidden>
        <span class="goal-chips-label">我的目标</span>
        <div class="saved-goals-list" id="savedGoalsList"></div>
      </div>

      <!-- 目标进度面板（拆解后置顶显示） -->
      <div class="goal-progress" id="goalProgress" hidden>
        <div class="plan-progress-card">
          <div class="plan-progress-head">
            <div class="plan-progress-info">
              <h2 id="planGoalTitle"></h2>
              <p class="plan-summary" id="planSummary"></p>
              <span class="plan-duration" id="planDuration" hidden></span>
            </div>
            <div class="plan-ring">
              <svg viewBox="0 0 132 132">
                <defs>
                  <linearGradient id="goalRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0284C7"/>
                    <stop offset="100%" stop-color="#7C3AED"/>
                  </linearGradient>
                </defs>
                <circle class="plan-ring-bg" cx="66" cy="66" r="54"></circle>
                <circle class="plan-ring-fill" id="planRingFill" cx="66" cy="66" r="54"></circle>
              </svg>
              <div class="plan-ring-text">
                <span class="plan-ring-num" id="planRingNum">0%</span>
                <span class="plan-ring-label" id="planRingLabel">开始吧</span>
              </div>
            </div>
          </div>

          <div class="stage-axis" id="planStage" hidden>
            <div class="stage-axis-line" id="stageAxisLine">
              <span class="stage-axis-fill" id="stageAxisFill"></span>
            </div>
            <div class="stage-axis-nodes" id="stageAxisNodes"></div>
          </div>

          <div class="plan-stats">
            <div class="plan-stat"><b id="statDone">0</b><span>已完成</span></div>
            <div class="plan-stat"><b id="statTotal">0</b><span>任务总数</span></div>
            <div class="plan-stat"><b id="statLeft">0</b><span>剩余任务</span></div>
            <div class="plan-stat"><b id="statReward">0</b><span>已解锁奖励</span></div>
          </div>

          <div class="plan-bar"><div class="plan-bar-fill" id="planBar"></div></div>

          <div class="plan-actions">
            <button type="button" class="goal-mini-btn danger" id="btnDelete">删除目标</button>
            <button type="button" class="goal-mini-btn" id="btnRegen">重新拆解</button>
            <button type="button" class="goal-mini-btn" id="btnReset">清空进度</button>
          </div>
        </div>
      </div>

      

      <div class="goal-status" id="goalStatus" hidden></div>

      <div class="plan-skeleton" id="goalSkeleton" hidden>
        <div class="skeleton-line" style="width: 40%"></div>
        <div class="skeleton-line" style="width: 90%"></div>
        <div class="skeleton-line" style="width: 75%"></div>
        <div class="skeleton-line" style="width: 85%"></div>
        <div class="skeleton-line" style="width: 60%"></div>
      </div>

      <div class="goal-plan" id="goalPlan" hidden>

       

        

        <section class="plan-card">
          <h3>阶段目标与任务<span class="plan-card-note">按阶段推进，完成上一阶段再进入下一阶段</span></h3>
          <div id="stageTasks"></div>
        </section>
        <section class="plan-card" id="dailyCard" hidden>
          <h3>每日日常任务<span class="plan-card-note">每天重复执行，0 点自动重置</span></h3>
          <div class="daily-summary" id="dailySummary"></div>
          <div id="dailyList"></div>
        </section>

        <section class="plan-card" id="rewardCard">
          <h3>奖励清单<span class="plan-card-note">每个任务有小奖励，完成一个阶段解锁对应大奖励</span></h3>
          <div id="rewardList"></div>
        </section>

      </div>
    </div>

    <!-- 奖励解锁弹窗：任务完成并达成解锁条件时弹出 -->
    <div class="goal-modal reward-modal" id="rewardUnlock" hidden>
      <div class="goal-modal-mask" id="rewardMask"></div>
      <div class="goal-modal-card" role="dialog" aria-modal="true" aria-labelledby="rewardTitle">
        <span class="goal-modal-kicker" id="rewardKicker">大奖励已解锁</span>
        <span class="reward-modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 12v9H4v-9"/><path d="M2 7h20v5H2z"/><path d="M12 21V7"/>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
          </svg>
        </span>
        <p class="goal-modal-stage" id="rewardCond"></p>
        <h3 class="goal-modal-title" id="rewardTitle"></h3>
        <p class="goal-modal-desc" id="rewardDesc" hidden></p>
        <div class="goal-modal-actions">
          <button type="button" class="goal-modal-btn primary" id="rewardOk">收下奖励</button>
        </div>
        <button type="button" class="goal-modal-speak" id="rewardSpeak">播报：开</button>
      </div>
    </div>

    <!-- 任务提醒弹窗：进入页面时提示接下来要完成的任务 -->
    <div class="goal-modal" id="taskReminder" hidden>
      <div class="goal-modal-mask" id="remindMask"></div>
      <div class="goal-modal-card" role="dialog" aria-modal="true" aria-labelledby="remindTitle">
        <span class="goal-modal-kicker">接下来要完成</span>
        <p class="goal-modal-stage" id="remindStage"></p>
        <h3 class="goal-modal-title" id="remindTitle"></h3>
        <p class="goal-modal-desc" id="remindDesc" hidden></p>
        <div class="goal-modal-meta" id="remindMeta"></div>
        <div class="goal-modal-actions">
          <button type="button" class="goal-modal-btn" id="remindLater">稍后安排</button>
          <button type="button" class="goal-modal-btn primary" id="remindDone">已完成</button>
        </div>
        <button type="button" class="goal-modal-speak" id="remindSpeak">播报：开</button>
      </div>
    </div>
  </section>

<?php
require __DIR__ . '/includes/footer.php';
?>
