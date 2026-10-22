<?php
$pageTitle = '公子鱼AI实验室 - 探索AI无限可能 | 人工智能研发与应用';
$pageDescription = '公子鱼AI实验室专注于大语言模型、计算机视觉、AI应用开发。提供销冠AI助手、电商AI中台、房车租售平台等创新产品。探索人工智能前沿技术，打造实用AI解决方案。';
$pageKeywords = 'AI实验室,人工智能,大语言模型,LLM,AI应用,电商AI,销冠AI,杭州公子鱼科技,AI工具,AI产品';
$canonical = 'https://gongziyu.com/';
$ogTitle = '公子鱼AI实验室 - 探索AI无限可能';
$ogDescription = '专注于大语言模型、计算机视觉、AI应用开发。打造实用AI解决方案，赋能未来智能生活。';
$activeNav = 'home';
$pwaTitle = '公子鱼AI';

ob_start();
?>
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "杭州公子鱼科技有限公司",
    "alternateName": "公子鱼AI实验室",
    "url": "https://gongziyu.com/",
    "logo": "https://gongziyu.com/assets/shortcut.png",
    "description": "专注于人工智能技术研发与创新应用",
    "email": "neo@gongziyu.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "杭州市",
      "addressCountry": "CN"
    },
    "sameAs": [
      "https://gongziyu.com/"
    ]
  }
  </script>
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "公子鱼AI实验室",
    "url": "https://gongziyu.com/",
    "description": "探索人工智能边界，打造创新AI应用",
    "inLanguage": "zh-CN"
  }
  </script>
<?php
$pageHead = ob_get_clean();

ob_start();
?>
<style>
    .products-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-6); }
    @media (max-width: 1400px) { .products-grid { grid-template-columns: repeat(4, 1fr); } }
    @media (max-width: 1100px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 800px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 500px) { .products-grid { grid-template-columns: 1fr; } }
    .product-card { background: var(--bg-tertiary); border: 1px solid var(--border); border-radius: var(--radius-xl); overflow: hidden; transition: all var(--transition-base); display: flex; flex-direction: column; }
    .product-card:hover { border-color: var(--primary); transform: translateY(-6px); box-shadow: 0 16px 40px rgba(2, 132, 199, 0.2); }
    .product-image { aspect-ratio: 1; background: linear-gradient(135deg, rgba(2, 132, 199, 0.1), rgba(124, 58, 237, 0.1)); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
    .product-image a {width:100%;height:100%;display: flex; align-items: center; justify-content: center;  }
    .product-image img { width: 85%; height: 85%;margin:0 auto; object-fit: cover; transition: transform var(--transition-base); }
    .product-card:hover .product-image img { transform: scale(1.05); }
    .product-image-placeholder { width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: var(--radius-2xl); display: flex; align-items: center; justify-content: center; transition: all var(--transition-base); }
    .product-card:hover .product-image-placeholder { transform: scale(1.1) rotate(5deg); }
    .product-image-placeholder svg { width: 40px; height: 40px; stroke: white; }
    .product-badge { position: absolute; top: var(--space-3); right: var(--space-3); padding: var(--space-1) var(--space-3); background: linear-gradient(135deg, #22C55E, #16A34A); border-radius: var(--radius-md); font-size: var(--font-xs); font-weight: 600; color: white; }
    .product-badge.new { background: linear-gradient(135deg, var(--primary), var(--secondary)); }
    .product-badge.hot { background: linear-gradient(135deg, #EF4444, #DC2626); }
    .product-content { padding: var(--space-5); flex: 1; display: flex; flex-direction: column; }
    .product-category { display: inline-block; padding: var(--space-1) var(--space-2); background: var(--bg-secondary); border-radius: var(--radius-sm); font-size: var(--font-xs); color: var(--text-tertiary); margin-bottom: var(--space-2); width: fit-content; }
    .product-name { padding-left:5%; font-size: var(--font-lg); font-weight: 600; margin-bottom: var(--space-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .product-desc {padding-left:5%; font-size: var(--font-sm); color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-4); flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  </style>
<?php
$pageStyles = ob_get_clean();

require __DIR__ . '/includes/header.php';
?>
  <!-- Hero 区域 -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="container">
      <div class="hero-content">
        <div class="hero-badge">
          <span>AI 目标拆解 · 一步一步实现</span>
        </div>
        <h1 class="hero-title">
          开启你的<span class="highlight">金手指</span>
        </h1>
        <p class="hero-subtitle">
          写下你想实现的目标，AI 自动拆解资源、长期目标、短期目标与任务清单<br>
          完成一项勾选一项，进度实时可见
        </p>

        <form class="hero-goal" id="heroGoalForm" autocomplete="off">
          <div class="hero-goal-box">
            <svg class="hero-goal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            <input type="text" id="heroGoalInput" class="hero-goal-input" maxlength="300"
                   placeholder="输入你想实现的目标，例如：3个月内上线一个AI工具站">
            <button type="submit" class="btn btn-primary hero-goal-btn" id="heroGoalSubmit">
              实现目标
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div class="hero-goal-hints">
            <span class="hero-goal-hint-label">试试：</span>
            <button type="button" class="hero-goal-chip" data-goal="3个月减脂10斤">3个月减脂10斤</button>
            <button type="button" class="hero-goal-chip" data-goal="从零学会Python并做出一个项目">从零学会Python</button>
            <button type="button" class="hero-goal-chip" data-goal="半年内把副业做到月入1万">副业月入1万</button>
            <button type="button" class="hero-goal-chip" data-goal="一年内读完24本书并输出读书笔记">一年读24本书</button>
          </div>
        </form>

        <div class="hero-actions hero-actions-sub">
          <a href="services.php" class="btn btn-outline">查看服务</a>
          <a href="tools.php" class="btn btn-outline">浏览工具</a>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="ai-particles">
          <div class="particle particle-1"></div>
          <div class="particle particle-2"></div>
          <div class="particle particle-3"></div>
          <div class="particle particle-4"></div>
          <div class="particle particle-5"></div>
        </div>
        <div class="ai-brain">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="url(#gradient1)" stroke-width="2" fill="none"/>
            <circle cx="100" cy="100" r="60" stroke="url(#gradient1)" stroke-width="2" fill="none"/>
            <circle cx="100" cy="100" r="40" stroke="url(#gradient1)" stroke-width="2" fill="none"/>
            <path d="M100 20 L100 180" stroke="url(#gradient1)" stroke-width="1" stroke-dasharray="5,5"/>
            <path d="M20 100 L180 100" stroke="url(#gradient1)" stroke-width="1" stroke-dasharray="5,5"/>
            <circle cx="100" cy="100" r="15" fill="url(#gradient2)"/>
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0284C7"/>
                <stop offset="100%" style="stop-color:#7C3AED"/>
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0284C7"/>
                <stop offset="100%" style="stop-color:#7C3AED"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  </section>

  <!-- 核心领域 -->
  <section class="section">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">研究方向</span>
        <h2 class="section-title">探索AI前沿领域</h2>
        <p class="section-subtitle">聚焦人工智能核心技术，打造创新应用</p>
      </div>
      
      <div class="research-grid">

         <div class="research-card">
          <div class="research-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <h3>AI电商应用</h3>
          <p>利用AI技术提升电商运营效率与用户体验</p>
        </div>

        <div class="research-card">
          <div class="research-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>AI找房网站</h3>
          <p>利用AI技术优化房产搜索与推荐</p>
        </div>
        
       
        
        <div class="research-card">
          <div class="research-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="4"/>
              <circle cx="12" cy="10" r="3"/>
              <path d="M12 13v3"/>
              <path d="M8 19h8"/>
              <path d="M9 22h6"/>
            </svg>
          </div>
          <h3>机器人</h3>
          <p>具身智能、自主导航与人机交互系统</p>
        </div>
        
      
      </div>
    </div>
  </section>

  <!-- 实验室产品 -->
  <section class="section">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">产品中心</span>
        <h2 class="section-title">实验室产品</h2>
        <p class="section-subtitle">精心打造的软件产品，为用户提供优质体验</p>
      </div>
      <div class="products-grid">

        <div class="product-card" data-category="web">
          <div class="product-image">
            <a href="https://hangfang123.com" target="_blank"><img src="assets/hangfang123.png" alt="电商AI中台"></a>
            <span class="product-badge hot">热门</span>
          </div>
          <div class="product-content">
            <span class="product-category">Web应用</span>
            <h3 class="product-name">杭房一二三</h3>
            <p class="product-desc">AI驱动的房产信息平台</p>
          </div>
        </div>


        <div class="product-card" data-category="app">
          <div class="product-image">
            <a href="https://gongziyu.com/dianshang.php" target="_blank"><img src="assets/dianshangai.png" alt="电商AI中台"></a>
            <span class="product-badge hot">热门</span>
          </div>
          <div class="product-content">
            <span class="product-category">网站应用</span>
            <h3 class="product-name">全域电商AI中台</h3>
            <p class="product-desc">企业数据可视化与AI分析</p>
          </div>
        </div>

          <div class="product-card" data-category="web">
          <div class="product-image">
             <a href="https://niurouzhou.com" target="_blank"><img src="assets/hangfang123.png" alt="电商AI中台"></a>
            <span class="product-badge hot">热门</span>
          </div>
          <div class="product-content">
            <span class="product-category">Web应用</span>
            <h3 class="product-name">众包平台</h3>
            <p class="product-desc">AI驱动的众包兼职服务平台</p>
          </div>
        </div>

        <div class="product-card" data-category="app">
          <div class="product-image">
            <a href="http://fangche.niurouzhou.com/" target="_blank"><img src="assets/fangche.png" alt="房车"></a>
            <span class="product-badge hot">热门</span>
          </div>
          <div class="product-content">
            <span class="product-category">SAAS应用</span>
            <h3 class="product-name">房车租售</h3>
            <p class="product-desc">房车租售平台，共创社区</p>
          </div>
        </div>

        <div class="product-card" data-category="web">
          <div class="product-image">
            <a href="products/xiaoguanai/index.html"><img src="assets/xiaoguanai.png" alt="销冠AI助手"></a>
            <span class="product-badge hot">热门</span>
            <span class="product-badge new">新品</span>
          </div>
          <div class="product-content">
            <span class="product-category">AI应用</span>
            <h3 class="product-name">销冠AI助手</h3>
            <p class="product-desc">AI驱动客户管理客户跟进工具</p>
          </div>
        </div>

        <div class="product-card" data-category="miniapp">
          <div class="product-image">
            <a href="https://neogood.coze.site/" target="_blank"><img src="assets/AIdesign.png" alt="AI电商设计"></a>
            <span class="product-badge hot">热门</span>
          </div>
          <div class="product-content">
            <span class="product-category">网站</span>
            <h3 class="product-name">电商设计助手</h3>
            <p class="product-desc">一键生成主图场景图详情页，在线AI图片编辑</p>
          </div>
        </div>
      

       
      </div>
    </div>
  </section>

  

  <!-- 统计数据 -->
  <section class="stats-section">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number" data-target="10">0</div>
          <div class="stat-label">AI项目</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" data-target="10">0</div>
          <div class="stat-label">行业调研</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" data-target="200">0</div>
          <div class="stat-label">产品分析</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" data-target="50">0</div>
          <div class="stat-label">策略分析</div>
        </div>
      </div>
    </div>
  </section>

<?php
ob_start();
?>
<script>
    // 金手指入口：输入目标 -> 跳转目标拆解页
    (function () {
      const form = document.getElementById('heroGoalForm');
      const input = document.getElementById('heroGoalInput');
      if (!form || !input) return;

      function go(goal) {
        goal = String(goal || '').trim();
        if (!goal) {
          input.focus();
          input.placeholder = '先写下你的目标，例如：3个月内上线一个AI工具站';
          return;
        }
        window.location.href = '/goal.php?goal=' + encodeURIComponent(goal);
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        go(input.value);
      });

      form.addEventListener('click', function (e) {
        const chip = e.target.closest('.hero-goal-chip');
        if (!chip) return;
        input.value = chip.getAttribute('data-goal') || '';
        go(input.value);
      });
    })();
  </script>
<?php
$pageScripts = ob_get_clean();

require __DIR__ . '/includes/footer.php';
?>
