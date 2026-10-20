<?php
$pageTitle = 'AI工具导航 - 公子鱼AI实验室 | 优质AI工具资源汇集';
$pageDescription = '公子鱼AI工具导航汇集优质AI工具与资源，涵盖AI写作、AI绘画、AI编程、AI办公、AI设计等多个分类，帮助你发现最好用的AI工具。';
$pageKeywords = 'AI工具,AI导航,AI资源,AI写作,AI绘画,AI编程,AI办公,AI工具推荐';
$canonical = 'https://gongziyu.com/aihub.php';
$ogTitle = 'AI工具导航 - 公子鱼AI实验室';
$ogDescription = '汇集优质AI工具与资源，涵盖AI写作、AI绘画、AI编程等多个分类。';
$activeNav = 'aihub';
$pwaTitle = '公子鱼AI';

ob_start();
?>
<style>
    /* AI导航页面专属样式 */
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
      box-shadow: 0 8px 24px rgba(2, 132, 199, 0.15);
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
    
    /* 本页搜索区上方留白压缩 */
    .section {
      padding-top: var(--space-6);
    }
    
    /* 搜索框（紧凑） */
    .search-section {
      margin-bottom: var(--space-3);
    }
    
    .search-box {
      max-width: 600px;
      margin: 0 auto;
      position: relative;
    }
    
    .search-input {
      width: 100%;
      padding: var(--space-2) var(--space-4);
      padding-left: 40px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: var(--font-sm);
      outline: none;
      transition: all var(--transition-fast);
    }
    
    .search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
    }
    
    .search-input::placeholder {
      color: var(--text-tertiary);
    }
    
    .search-icon {
      position: absolute;
      left: var(--space-3);
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      stroke: var(--text-tertiary);
    }
    
    /* 统计信息（紧凑单行） */
    .stats-row {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-5);
      margin-bottom: var(--space-6);
      padding: var(--space-2) var(--space-4);
      background: var(--bg-tertiary);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }
    
    .stat-item-inline {
      display: flex;
      align-items: baseline;
      gap: var(--space-1);
    }
    
    .stat-item-inline .stat-number {
      font-size: var(--font-base);
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .stat-item-inline .stat-label {
      font-size: var(--font-sm);
      color: var(--text-secondary);
    }
    
    @media (max-width: 768px) {
      .nav-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-row {
        gap: var(--space-3);
      }
    }
  </style>
<?php
$pageStyles = ob_get_clean();

require __DIR__ . '/includes/header.php';
?>
  <!-- 页面头部 -->
  <section class="page-header">
    <div class="container">
      <div class="page-header-content">
        <h1 class="page-title">AI工具导航</h1>
        <p class="page-subtitle">汇集优质AI工具与资源，助力开发与创作</p>
      </div>
    </div>
  </section>

  <!-- 搜索与统计 -->
  <section class="section">
    <div class="container">
      <div class="search-section">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" class="search-input" placeholder="搜索AI工具..." id="searchInput">
        </div>
      </div>
      
      <div class="stats-row">
        <div class="stat-item-inline">
          <div class="stat-number">12</div>
          <span class="stat-label">工具分类</span>
        </div>
        <div class="stat-item-inline">
          <div class="stat-number">70+</div>
          <span class="stat-label">精选工具</span>
        </div>
        <div class="stat-item-inline">
          <div class="stat-number">持续</div>
          <span class="stat-label">更新中</span>
        </div>
      </div>
      
      <!-- 工具导航网格 -->
      <div class="nav-grid">
        
        <!-- 头部AI厂商 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            头部AI厂商
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://www.deepseek.com/" target="_blank">DeepSeek</a></li>
            <li class="nav-link-item"><a href="https://www.doubao.com/chat/" target="_blank">字节豆包</a></li>
            <li class="nav-link-item"><a href="https://yuanbao.tencent.com/chat/naQivTmsDa" target="_blank">腾讯元宝</a></li>
            <li class="nav-link-item"><a href="https://www.qianwen.com/" target="_blank">阿里千问</a></li>
            <li class="nav-link-item"><a href="https://www.minimaxi.com/" target="_blank">MiniMax</a></li>
            <li class="nav-link-item"><a href="https://www.kimi.com/" target="_blank">Kimi</a></li>
            <li class="nav-link-item"><a href="https://www.zhipuai.cn/zh" target="_blank">智谱AI</a></li>
            <li class="nav-link-item"><a href="https://gemini.google.com/app" target="_blank">Google Gemini</a></li>
            <li class="nav-link-item"><a href="https://chat.openai.com/" target="_blank">OpenAI ChatGPT</a></li>
            <li class="nav-link-item"><a href="https://copilot.microsoft.com/" target="_blank">Microsoft Copilot</a></li>
          </ul>
        </div>

        <!-- 模型训练 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            模型训练
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://www.modelscope.cn/home" target="_blank">魔塔社区</a></li>
            <li class="nav-link-item"><a href="https://openrouter.ai/" target="_blank">OpenRouter</a></li>
            <li class="nav-link-item"><a href="https://www.huggingface.co/" target="_blank">Hugging Face</a></li>
            <li class="nav-link-item"><a href="https://promptpilot.volcengine.com/startup" target="_blank">提示词生成</a></li>
            <li class="nav-link-item"><a href="https://ollama.com/" target="_blank">Ollama本地模型</a></li>
          </ul>
        </div>

           <!-- 云端在线AI-IDE -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
            </div>
            云端在线 AI-IDE
          </div>
          <ul class="nav-link-list">
           <li class="nav-link-item"><a href="https://code.coze.cn/home" target="_blank">Coze在线编程</a></li>
           <li class="nav-link-item"><a href="https://solo.trae.cn/" target="_blank">Trae Solo</a></li>
            <li class="nav-link-item"><a href="https://meoo.com/" target="_blank">Meoo在线编程</a></li>
            <li class="nav-link-item"><a href="https://aistudio.google.com/prompts/new_chat" target="_blank">Google AI Studio</a></li>
            <li class="nav-link-item"><a href="https://www.codebuddy.cn/agents" target="_blank">CodeBuddy智能体</a></li>
           
          </ul>
        </div>

        <!-- 本地AI-IDE -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            本地 AI-IDE
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://copilot.tencent.com/" target="_blank">腾讯CodeBuddy</a></li>
            <li class="nav-link-item"><a href="https://www.trae.com.cn/" target="_blank">字节Trae</a></li>
            <li class="nav-link-item"><a href="https://lingma.aliyun.com/lingma" target="_blank">通义灵码IDE</a></li>
            <li class="nav-link-item"><a href="https://codearts.huaweicloud.com/index.html" target="_blank">华为云CodeArts</a></li>
            <li class="nav-link-item"><a href="https://claude.com/product/claude-code" target="_blank">Claude Code</a></li>
          </ul>
        </div>


        <!-- 智能体 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
                <path d="M8.5 8.5A4 4 0 0 0 12 12a4 4 0 0 1 3.5 3.5"/>
              </svg>
            </div>
            智能体 / Skill
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://yuanqi.tencent.com/my-creation/agent" target="_blank">腾讯元器</a></li>
            <li class="nav-link-item"><a href="https://www.coze.cn/" target="_blank">扣子</a></li>
            <li class="nav-link-item"><a href="https://skillhub.tencent.com/" target="_blank">腾讯技能中心</a></li>
            <li class="nav-link-item"><a href="https://www.cherry-ai.com/" target="_blank">Cherry AI</a></li>
            <li class="nav-link-item"><a href="https://cloud.dify.ai/apps" target="_blank">Dify AI</a></li>
          </ul>
        </div>

        <!-- AGI-AIGC -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
            AIGC/视频/漫剧
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://jimeng.jianying.com/ai-tool/home" target="_blank">字节即梦</a></li>
            <li class="nav-link-item"><a href="https://xyq.jianying.com/novel/list" target="_blank">字节即梦小云雀</a></li>
            <li class="nav-link-item"><a href="https://app.klingai.com/cn/" target="_blank">快手-可灵</a></li>
            <li class="nav-link-item"><a href="https://agi.taobao.com/" target="_blank">淘宝AGI万象营造</a></li>
            <li class="nav-link-item"><a href="https://workrally.qq.com/home" target="_blank">腾讯Workrally</a></li>
          </ul>
        </div>

      
       

        <!-- 设计资源 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            设计资源
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://pixso.cn/" target="_blank">Pixso</a></li>
            <li class="nav-link-item"><a href="https://modao.cc/workspace/home/proto" target="_blank">墨刀在线原型</a></li>
            <li class="nav-link-item"><a href="https://www.figma.com/" target="_blank">Figma在线原型</a></li>
            <li class="nav-link-item"><a href="https://stitch.withgoogle.com/" target="_blank">Google Stitch</a></li>
            <li class="nav-link-item"><a href="https://www.iconfont.cn/" target="_blank">Icon图标资源</a></li>
            <li class="nav-link-item"><a href="https://d.design/" target="_blank">阿里巴巴堆友</a></li>
            <li class="nav-link-item"><a href="https://ps.gaoding.com/#/" target="_blank">在线PS</a></li>
            <li class="nav-link-item"><a href="https://jiazuo.taobao.com/" target="_blank">淘宝设计</a></li>
            <li class="nav-link-item"><a href="https://visvise.com.cn/index" target="_blank">VisVise</a></li>
          </ul>
        </div>

        <!-- 数据库设计 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            数据库设计
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://www.drawdb.app/editor" target="_blank">DrawDB在线数据表</a></li>
            <li class="nav-link-item"><a href="https://www.mysql.com/" target="_blank">MySQL</a></li>
            <li class="nav-link-item"><a href="https://www.postgresql.org/" target="_blank">PostgreSQL</a></li>
            <li class="nav-link-item"><a href="https://www.mongodb.com/" target="_blank">MongoDB</a></li>
          </ul>
        </div>

        <!-- 技术文档 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            技术文档
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://developer.huawei.com/consumer/cn/develop/" target="_blank">鸿蒙开发</a></li>
            <li class="nav-link-item"><a href="https://devdocs.io" target="_blank">DevDocs</a></li>
            <li class="nav-link-item"><a href="https://vuejs.org" target="_blank">Vue.js 文档</a></li>
          </ul>
        </div>

        <!-- 芯片/硬件 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
                <rect x="9" y="9" width="6" height="6"/>
                <line x1="9" y1="1" x2="9" y2="4"/>
                <line x1="15" y1="1" x2="15" y2="4"/>
                <line x1="9" y1="20" x2="9" y2="23"/>
                <line x1="15" y1="20" x2="15" y2="23"/>
                <line x1="20" y1="9" x2="23" y2="9"/>
                <line x1="20" y1="14" x2="23" y2="14"/>
                <line x1="1" y1="9" x2="4" y2="9"/>
                <line x1="1" y1="14" x2="4" y2="14"/>
              </svg>
            </div>
            芯片 / 硬件
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://www.nvidia.com/en-us/" target="_blank">NVIDIA</a></li>
            <li class="nav-link-item"><a href="https://semiee.com/" target="_blank">半导小芯</a></li>
            <li class="nav-link-item"><a href="https://www.hqchip.com/" target="_blank">华强芯城</a></li>
          </ul>
        </div>

        <!-- 开源项目 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </div>
            开源项目
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://gitee.com/explore/all?order=starred" target="_blank">Gitee热门开源项目</a></li>
            <li class="nav-link-item"><a href="https://github.com/trending" target="_blank">GitHub Trending</a></li>
          </ul>
        </div>

        <!-- 云厂商 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
            </div>
            云厂商
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://cloud.tencent.com" target="_blank">腾讯云</a></li>
            <li class="nav-link-item"><a href="https://www.aliyun.com/" target="_blank">阿里云</a></li>
            <li class="nav-link-item"><a href="https://www.volcengine.com/" target="_blank">火山引擎</a></li>
            <li class="nav-link-item"><a href="https://www.huaweicloud.com/product/ai" target="_blank">华为云</a></li>
            <li class="nav-link-item"><a href="https://aws.amazon.com/" target="_blank">Amazon Web Services</a></li>
            <li class="nav-link-item"><a href="https://cloud.google.com/" target="_blank">Google Cloud</a></li>
            <li class="nav-link-item"><a href="https://www.oracle.com/cn/cloud/index.html" target="_blank">Oracle云</a></li>
            <li class="nav-link-item"><a href="https://cloud.baidu.com/" target="_blank">百度云</a></li>
          </ul>
        </div>

        <!-- 开发者联盟 -->
        <div class="nav-card">
          <div class="nav-card-title">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            开发者联盟
          </div>
          <ul class="nav-link-list">
            <li class="nav-link-item"><a href="https://developer.huawei.com/consumer/cn/console/overview" target="_blank">华为开发者联盟</a></li>
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
    const navLinks = document.querySelectorAll('.nav-link-item a');
    
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
