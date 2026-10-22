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
        <span class="goal-kicker">金手指 · AI 目标拆解引擎</span>
        <h1 class="goal-title">把目标交给 AI，剩下的<span class="highlight">一步一步做完</span></h1>
        <p class="goal-desc">
          输入一个目标，AI 帮你拆成目标阶梯、任务清单和阶段性奖励。<br>
          完成一项勾选一项，进度与奖励实时更新。
        </p>
      </div>

      <form class="goal-form" id="goalForm" autocomplete="off">
        <div class="goal-form-row">
          <div class="goal-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            <input type="text" id="goalInput" maxlength="300" placeholder="输入你想实现的目标，例如：3个月内上线一个AI工具站">
          </div>
          <button type="submit" class="btn btn-primary goal-submit" id="goalSubmit">
            <span id="goalSubmitText">AI 拆解目标</span>
            <span id="goalSubmitIcon">
              <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </button>
        </div>

        <div class="goal-chips" id="goalChips">
          <button type="button" class="goal-chip" data-goal="3个月内上线一个AI工具站">3个月内上线一个AI工具站</button>
          <button type="button" class="goal-chip" data-goal="3个月减脂10斤">3个月减脂10斤</button>
          <button type="button" class="goal-chip" data-goal="从零学会Python并做出一个项目">从零学会Python</button>
          <button type="button" class="goal-chip" data-goal="半年内把副业做到月入1万">副业月入1万</button>
          <button type="button" class="goal-chip" data-goal="一年内读完24本书并输出读书笔记">一年读24本书</button>
        </div>
      </form>

      <div class="goal-status" id="goalStatus" hidden></div>

      <div class="plan-skeleton" id="goalSkeleton" hidden>
        <div class="skeleton-line" style="width: 40%"></div>
        <div class="skeleton-line" style="width: 90%"></div>
        <div class="skeleton-line" style="width: 75%"></div>
        <div class="skeleton-line" style="width: 85%"></div>
        <div class="skeleton-line" style="width: 60%"></div>
      </div>

      <div class="saved-goals" id="savedGoals" hidden>
        <span class="goal-chips-label">我的目标</span>
        <div class="saved-goals-list" id="savedGoalsList"></div>
      </div>

      <div class="goal-plan" id="goalPlan" hidden>

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

        <section class="plan-card">
          <h3>目标阶梯</h3>
          <div id="goalList"></div>
        </section>

        <section class="plan-card">
          <h3>任务清单</h3>
          <div id="taskGroups"></div>
        </section>

        <section class="plan-card" id="rewardCard">
          <h3>奖励清单</h3>
          <div id="rewardList"></div>
        </section>

      </div>
    </div>
  </section>

<?php
require __DIR__ . '/includes/footer.php';
?>
