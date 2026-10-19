<?php
$pageTitle = '实用工具 - 公子鱼工具箱 | 在线工具集合';
$pageDescription = '公子鱼在线工具箱提供实用在线工具：图片格式转换、二维码生成、在线白板、待办清单等免费工具，提升工作效率。';
$pageKeywords = '在线工具,工具箱,图片转换,二维码生成,在线白板,待办清单,免费工具';
$canonical = 'https://gongziyu.com/tools.php';
$ogTitle = '实用工具 - 公子鱼工具箱';
$ogDescription = '图片格式转换、二维码生成、在线白板等免费实用工具。';
$activeNav = 'tools';
$pwaTitle = '公子鱼工具';

ob_start();
?>
<style>
    /* 工具页面专属样式 */
    .nav-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-6);
    }
    
    .nav-card {
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      transition: all var(--transition-base);
      position: relative;
      overflow: hidden;
    }
    
    .nav-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      transform: scaleX(0);
      transition: transform var(--transition-base);
    }
    
    .nav-card:hover {
      border-color: var(--primary);
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 212, 255, 0.15);
    }
    
    .nav-card:hover::before {
      transform: scaleX(1);
    }
    
    .nav-card-title {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      font-size: var(--font-xl);
      font-weight: 600;
      margin-bottom: var(--space-5);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--border);
    }
    
    .nav-card-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .nav-card-icon svg {
      width: 18px;
      height: 18px;
      stroke: white;
    }
    
    .nav-link-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    
    .nav-link-item a {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: var(--font-sm);
      transition: all var(--transition-fast);
      position: relative;
    }
    
    .nav-link-item a::before {
      content: '';
      width: 4px;
      height: 4px;
      background: var(--primary);
      border-radius: 50%;
      opacity: 0;
      transition: opacity var(--transition-fast);
    }
    
    .nav-link-item a:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
      padding-left: var(--space-5);
    }
    
    .nav-link-item a:hover::before {
      opacity: 1;
    }
    
    .nav-link-item a svg {
      width: 14px;
      height: 14px;
      stroke: var(--text-tertiary);
      transition: all var(--transition-fast);
    }
    
    .nav-link-item a:hover svg {
      stroke: var(--primary);
      transform: translateX(2px);
    }
    
    .nav-link-desc {
      font-size: var(--font-xs);
      color: var(--text-tertiary);
      margin-left: auto;
    }
    
    /* 搜索框 */
    .search-section {
      margin-bottom: var(--space-12);
    }
    
    .search-box {
      max-width: 600px;
      margin: 0 auto;
      position: relative;
    }
    
    .search-input {
      width: 100%;
      padding: var(--space-4) var(--space-6);
      padding-left: 50px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      color: var(--text-primary);
      font-size: var(--font-base);
      outline: none;
      transition: all var(--transition-fast);
    }
    
    .search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }
    
    .search-input::placeholder {
      color: var(--text-tertiary);
    }
    
    .search-icon {
      position: absolute;
      left: var(--space-5);
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      stroke: var(--text-tertiary);
    }
    
    /* 统计信息 */
    .stats-row {
      display: flex;
      justify-content: center;
      gap: var(--space-12);
      margin-bottom: var(--space-12);
      padding: var(--space-6);
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }
    
    .stat-item-inline {
      text-align: center;
    }
    
    .stat-item-inline .stat-number {
      font-size: var(--font-3xl);
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .stat-item-inline .stat-label {
      display: block;
      font-size: var(--font-sm);
      color: var(--text-secondary);
      margin-top: var(--space-1);
    }
    
    /* 极致压缩：紧凑头部 */
    .page-header {
      padding: 84px 0 var(--space-4);
      background: none;
    }
    .page-header-content { text-align: left; }
    .tools-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      flex-wrap: wrap;
    }
    .tools-header-bar .page-title {
      font-size: var(--font-xl);
      margin-bottom: 0;
      line-height: 1.2;
    }
    .tools-header-bar .page-subtitle { font-size: var(--font-xs); }
    .search-box {
      max-width: 260px;
      margin: 0;
    }
    .search-input {
      padding: var(--space-2) var(--space-4);
      padding-left: 36px;
      font-size: var(--font-sm);
      border-radius: var(--radius-md);
    }
    .search-icon {
      left: var(--space-3);
      width: 16px;
      height: 16px;
    }
    .tools-section { padding: var(--space-8) 0; }

    @media (max-width: 768px) {
      .nav-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-row {
        flex-direction: column;
        gap: var(--space-4);
      }
    }
  </style>
<?php
$pageStyles = ob_get_clean();

require __DIR__ . '/includes/header.php';
?>
  <!-- 页面头部（紧凑） -->
  <section class="page-header">
    <div class="container">
      <div class="page-header-content">
        <div class="tools-header-bar">
          <div>
            <h1 class="page-title">实用工具箱</h1>
            <p class="page-subtitle">日常开发与生活实用工具</p>
          </div>
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input type="text" class="search-input" placeholder="搜索工具..." id="searchInput">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 工具导航 -->
  <section class="section tools-section">
    <div class="container">
      <div class="nav-grid">
        
        <!-- 图片处理 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            图片处理
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item">
              <a href="tools/image2jpg.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  <polyline points="16 16 12 12 8 16"/>
                </svg>
                批量图片转JPG
                <span class="nav-link-desc">自定义宽度 & 压缩</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- AI 图像创作 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 3a4 4 0 0 1 4 4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z"/>
                <path d="M12 7v10"/>
                <path d="M7 12h10"/>
              </svg>
            </div>
            AI 图像创作
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item">
              <a href="tools/aigiamge.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 3a4 4 0 0 1 4 4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1 4-4z"/>
                  <path d="M12 7v10"/>
                  <path d="M7 12h10"/>
                </svg>
                服装AI创作画布
                <span class="nav-link-desc">AI 换装 & 批量生成</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- 音视频工具 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            音视频工具
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item">
              <a href="tools/v2mp3.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
                视频提取音频
                <span class="nav-link-desc">视频转 MP3 / WAV / FLAC</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- 二维码工具 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            二维码工具
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item">
              <a href="tools/qrcode.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                二维码生成器
                <span class="nav-link-desc">在线生成二维码</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- 待办 & 效率 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            待办 & 效率
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item">
              <a href="tools/To-Do/To-Do.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                To-Do 待办管理
                <span class="nav-link-desc">任务清单管理</span>
              </a>
            </li>
            <li class="nav-link-item">
              <a href="tools/todo/index.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                简易 Todo
                <span class="nav-link-desc">轻量级待办工具</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- 创意工具 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
                <path d="M8.5 8.5A4 4 0 0 0 12 12a4 4 0 0 1 3.5 3.5"/>
              </svg>
            </div>
            创意工具
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item">
              <a href="tools/whiteboard/index.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                  <path d="M2 2l7.586 7.586"/>
                  <circle cx="11" cy="11" r="2"/>
                </svg>
                在线白板
                <span class="nav-link-desc">自由绘图 & 手写</span>
              </a>
            </li>
            <li class="nav-link-item">
              <a href="tools/rulesOfLife/">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                随机人生规则
                <span class="nav-link-desc">趣味人生哲理</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- JS 工具库 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            JS 工具库
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item">
              <a href="tools/js-library/demo.html">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>
                  <polyline points="8 12 12 8 16 12"/>
                  <line x1="12" y1="16" x2="12" y2="8"/>
                </svg>
                JS 工具库演示
                <span class="nav-link-desc">常用JS方法封装</span>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </section>

<?php
ob_start();
?>
<script>
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    const navCards = document.querySelectorAll('.nav-card');
    
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      navCards.forEach(card => {
        const title = card.querySelector('.nav-card-title').textContent.toLowerCase();
        const links = Array.from(card.querySelectorAll('.nav-link-item a')).map(a => a.textContent.toLowerCase());
        const hasMatch = title.includes(searchTerm) || links.some(link => link.includes(searchTerm));
        
        if (searchTerm === '') {
          card.style.display = '';
          card.style.opacity = '1';
        } else if (hasMatch) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  </script>
<?php
$pageScripts = ob_get_clean();

require __DIR__ . '/includes/footer.php';
?>
