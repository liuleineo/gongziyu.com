<?php
$pageTitle = 'AI服务 - 杭州公子鱼科技有限公司 | 软件开发与AI解决方案';
$pageDescription = '杭州公子鱼科技有限公司提供网站开发、小程序开发、企业软件定制、AI解决方案等专业技术服务。涵盖Web应用、微信小程序、电商系统、AI集成开发。';
$pageKeywords = '软件开发,网站开发,小程序开发,AI解决方案,企业软件定制,杭州软件开发,公子鱼科技';
$canonical = 'https://gongziyu.com/services.php';
$ogTitle = 'AI服务 - 杭州公子鱼科技有限公司';
$ogDescription = '网站开发、小程序开发、企业软件定制、AI解决方案等专业服务。';
$activeNav = 'services';
$pwaTitle = '公子鱼AI';

require __DIR__ . '/includes/header.php';
?>
  <div class="page-loader">
    <div class="loader-spinner"></div>
  </div>


  <!-- 页面标题 -->
  <section style="padding-top: calc(var(--header-height) + var(--space-20)); padding-bottom: var(--space-16); text-align: center; position: relative;">
    <div class="grid-bg"></div>
    <div class="container" style="position: relative; z-index: 1;">
      <div class="reveal">
        <span class="tag tag-primary" style="margin-bottom: var(--space-4); display: inline-block;">Services</span>
        <h1 style="font-size: var(--text-5xl); font-weight: var(--font-bold); margin-bottom: var(--space-6);">服务项目</h1>
        <p style="font-size: var(--text-xl); color: var(--text-tertiary); max-width: 600px; margin: 0 auto;">
          我们提供全方位的数字化解决方案，从网站到AI，助力企业实现数字化转型
        </p>
      </div>
    </div>
  </section>

  <!-- 服务详情 -->
  <section class="section" style="background: var(--bg-secondary);">
    <div class="container">
      <!-- 网站开发 -->
      <div class="reveal" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16); align-items: center; margin-bottom: var(--space-24);">
        <div>
          <div class="service-card-icon" style="margin-bottom: var(--space-6);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 32px; height: 32px;">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <h2 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: var(--space-6);">网站开发</h2>
          <p style="color: var(--text-tertiary); font-size: var(--text-lg); line-height: var(--leading-relaxed); margin-bottom: var(--space-6);">
            我们提供专业的网站开发服务，从企业官网到复杂的Web应用，都能为您量身定制。采用最新的前端技术栈，确保网站在各种设备上都有出色的表现。
          </p>
          <ul style="display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-8);">
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              响应式设计，完美适配各种设备
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              SEO优化，提升搜索引擎排名
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              高性能架构，快速加载体验
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              完整的后台管理系统
            </li>
          </ul>
          <div class="case-card-tags" style="margin-bottom: var(--space-6);">
            <span class="tag">HTML5/CSS3</span>
            <span class="tag">JavaScript</span>
            <span class="tag">Vue.js</span>
            <span class="tag">React</span>
            <span class="tag">Node.js</span>
          </div>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80" alt="网站开发" style="width: 100%; border-radius: var(--radius-2xl); box-shadow: var(--shadow-xl);" onerror="this.src='https://placehold.co/800x600/1F2937/00BFFF?text=网站开发'">
        </div>
      </div>

      <!-- 小程序开发 -->
      <div class="reveal" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16); align-items: center; margin-bottom: var(--space-24);">
        <div style="order: 2;">
          <div class="service-card-icon" style="margin-bottom: var(--space-6);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 32px; height: 32px;">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
          </div>
          <h2 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: var(--space-6);">小程序开发</h2>
          <p style="color: var(--text-tertiary); font-size: var(--text-lg); line-height: var(--leading-relaxed); margin-bottom: var(--space-6);">
            覆盖微信、支付宝、抖音等多平台小程序开发，一次开发多端运行。我们深谙各平台特性，能够最大化利用平台能力，为您打造极致用户体验。
          </p>
          <ul style="display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-8);">
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              微信小程序原生开发
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              跨平台解决方案（uni-app/Taro）
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              电商、预约、会员等场景解决方案
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              完整的支付、物流对接能力
            </li>
          </ul>
          <div class="case-card-tags" style="margin-bottom: var(--space-6);">
            <span class="tag">微信小程序</span>
            <span class="tag">支付宝小程序</span>
            <span class="tag">uni-app</span>
            <span class="tag">Taro</span>
          </div>
        </div>
        <div style="order: 1;">
          <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80" alt="小程序开发" style="width: 100%; border-radius: var(--radius-2xl); box-shadow: var(--shadow-xl);" onerror="this.src='https://placehold.co/800x600/1F2937/00BFFF?text=小程序开发'">
        </div>
      </div>

      <!-- 企业软件 -->
      <div class="reveal" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16); align-items: center; margin-bottom: var(--space-24);">
        <div>
          <div class="service-card-icon" style="margin-bottom: var(--space-6);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 32px; height: 32px;">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <h2 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: var(--space-6);">企业软件定制</h2>
          <p style="color: var(--text-tertiary); font-size: var(--text-lg); line-height: var(--leading-relaxed); margin-bottom: var(--space-6);">
            针对企业特定业务场景，提供定制化的软件解决方案。无论是ERP、CRM还是OA系统，我们都能根据您的需求进行深度定制开发。
          </p>
          <ul style="display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-8);">
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              ERP企业资源计划系统
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              CRM客户关系管理系统
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              OA办公自动化系统
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              数据可视化与报表系统
            </li>
          </ul>
          <div class="case-card-tags" style="margin-bottom: var(--space-6);">
            <span class="tag">Java</span>
            <span class="tag">Python</span>
            <span class="tag">Spring Boot</span>
            <span class="tag">MySQL</span>
            <span class="tag">Redis</span>
          </div>
        </div>
        <div>
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" alt="企业软件" style="width: 100%; border-radius: var(--radius-2xl); box-shadow: var(--shadow-xl);" onerror="this.src='https://placehold.co/800x600/1F2937/00BFFF?text=企业软件'">
        </div>
      </div>

      <!-- AI解决方案 -->
      <div class="reveal" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-16); align-items: center;">
        <div style="order: 2;">
          <div class="service-card-icon" style="margin-bottom: var(--space-6);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 32px; height: 32px;">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
              <path d="M8.5 8.5A4 4 0 0 0 12 12a4 4 0 0 1 3.5 3.5"/>
            </svg>
          </div>
          <h2 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: var(--space-6);">AI解决方案</h2>
          <p style="color: var(--text-tertiary); font-size: var(--text-lg); line-height: var(--leading-relaxed); margin-bottom: var(--space-6);">
            将人工智能技术融入您的业务流程，提升效率和竞争力。我们提供从智能客服到数据分析的全套AI解决方案。
          </p>
          <ul style="display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-8);">
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              AI智能客服系统
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              智能数据分析与预测
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              图像识别与处理
            </li>
            <li style="display: flex; align-items: center; gap: var(--space-3); color: var(--text-secondary);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              业务流程自动化
            </li>
          </ul>
          <div class="case-card-tags" style="margin-bottom: var(--space-6);">
            <span class="tag">Python</span>
            <span class="tag">TensorFlow</span>
            <span class="tag">OpenAI API</span>
            <span class="tag">机器学习</span>
          </div>
        </div>
        <div style="order: 1;">
          <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" alt="AI解决方案" style="width: 100%; border-radius: var(--radius-2xl); box-shadow: var(--shadow-xl);" onerror="this.src='https://placehold.co/800x600/1F2937/00BFFF?text=AI解决方案'">
        </div>
      </div>
    </div>
  </section>

  <!-- 服务流程 -->
  <section class="section">
    <div class="container">
      <div class="section-header reveal">
        <span class="tag" style="margin-bottom: var(--space-4); display: inline-block;">Process</span>
        <h2 class="section-title">服务流程</h2>
        <p class="section-subtitle">标准化的开发流程，确保项目高效、高质量交付</p>
      </div>
      
      <div class="process-steps stagger-children" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-8);">
        <div style="text-align: center; position: relative;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-6); font-size: var(--text-2xl); font-weight: var(--font-bold); color: white;">1</div>
          <h3 style="font-size: var(--text-xl); font-weight: var(--font-semibold); margin-bottom: var(--space-3);">需求沟通</h3>
          <p style="color: var(--text-muted); font-size: var(--text-sm);">深入了解您的业务需求，制定项目方案和时间计划</p>
        </div>
        
        <div style="text-align: center; position: relative;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-6); font-size: var(--text-2xl); font-weight: var(--font-bold); color: white;">2</div>
          <h3 style="font-size: var(--text-xl); font-weight: var(--font-semibold); margin-bottom: var(--space-3);">设计开发</h3>
          <p style="color: var(--text-muted); font-size: var(--text-sm);">UI/UX设计，前后端开发，迭代测试优化</p>
        </div>
        
        <div style="text-align: center; position: relative;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-6); font-size: var(--text-2xl); font-weight: var(--font-bold); color: white;">3</div>
          <h3 style="font-size: var(--text-xl); font-weight: var(--font-semibold); margin-bottom: var(--space-3);">测试上线</h3>
          <p style="color: var(--text-muted); font-size: var(--text-sm);">全面测试，部署上线，确保系统稳定运行</p>
        </div>
        
        <div style="text-align: center; position: relative;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-6); font-size: var(--text-2xl); font-weight: var(--font-bold); color: white;">4</div>
          <h3 style="font-size: var(--text-xl); font-weight: var(--font-semibold); margin-bottom: var(--space-3);">运维支持</h3>
          <p style="color: var(--text-muted); font-size: var(--text-sm);">持续监控，定期更新，技术支持服务</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 常见问题 -->
  <section class="section" style="background: var(--bg-secondary);">
    <div class="container">
      <div class="section-header reveal">
        <span class="tag" style="margin-bottom: var(--space-4); display: inline-block;">FAQ</span>
        <h2 class="section-title">常见问题</h2>
        <p class="section-subtitle">关于我们的服务，您可能想了解的问题</p>
      </div>
      
      <div style="max-width: 800px; margin: 0 auto;">
        <div class="accordion" style="display: flex; flex-direction: column; gap: var(--space-4);">
          <div class="accordion-item reveal" style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-xl); overflow: hidden;">
            <button class="accordion-trigger" style="width: 100%; padding: var(--space-6); display: flex; justify-content: space-between; align-items: center; text-align: left; background: transparent; color: var(--text-primary); font-size: var(--text-lg); font-weight: var(--font-semibold); cursor: pointer;">
              <span>开发一个项目需要多长时间？</span>
              <svg class="accordion-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
              <div style="padding: 0 var(--space-6) var(--space-6); color: var(--text-tertiary);">
                项目周期取决于功能复杂度和需求范围。一般来说，简单的企业官网需要1-2周，小程序需要2-4周，复杂的企业系统可能需要2-6个月。我们会在需求沟通阶段提供准确的时间评估。
              </div>
            </div>
          </div>
          
          <div class="accordion-item reveal" style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-xl); overflow: hidden;">
            <button class="accordion-trigger" style="width: 100%; padding: var(--space-6); display: flex; justify-content: space-between; align-items: center; text-align: left; background: transparent; color: var(--text-primary); font-size: var(--text-lg); font-weight: var(--font-semibold); cursor: pointer;">
              <span>项目报价是如何计算的？</span>
              <svg class="accordion-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
              <div style="padding: 0 var(--space-6) var(--space-6); color: var(--text-tertiary);">
                我们的报价基于功能复杂度、技术难度、开发工时等因素综合评估。在正式开发前，我们会提供详细的项目报价单，包含功能清单、开发周期和费用明细，确保透明无隐藏费用。
              </div>
            </div>
          </div>
          
          <div class="accordion-item reveal" style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-xl); overflow: hidden;">
            <button class="accordion-trigger" style="width: 100%; padding: var(--space-6); display: flex; justify-content: space-between; align-items: center; text-align: left; background: transparent; color: var(--text-primary); font-size: var(--text-lg); font-weight: var(--font-semibold); cursor: pointer;">
              <span>项目完成后提供维护服务吗？</span>
              <svg class="accordion-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
              <div style="padding: 0 var(--space-6) var(--space-6); color: var(--text-tertiary);">
                是的，我们提供项目交付后的维护服务。包括系统bug修复、安全更新、性能优化等。我们提供灵活的维护套餐，您可以根据实际需求选择合适的维护方案。
              </div>
            </div>
          </div>
          
          <div class="accordion-item reveal" style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-xl); overflow: hidden;">
            <button class="accordion-trigger" style="width: 100%; padding: var(--space-6); display: flex; justify-content: space-between; align-items: center; text-align: left; background: transparent; color: var(--text-primary); font-size: var(--text-lg); font-weight: var(--font-semibold); cursor: pointer;">
              <span>如何保障项目的质量？</span>
              <svg class="accordion-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            <div class="accordion-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease;">
              <div style="padding: 0 var(--space-6) var(--space-6); color: var(--text-tertiary);">
                我们采用严格的软件开发流程，包括代码审查、自动化测试、持续集成等措施。项目分为多个里程碑节点，每个节点都会进行验收测试。同时，我们采用敏捷开发方式，您可以持续跟踪项目进度并及时反馈。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="section" style="background: var(--gradient-primary);">
    <div class="container">
      <div class="reveal" style="text-align: center; max-width: 700px; margin: 0 auto;">
        <h2 style="font-size: var(--text-4xl); font-weight: var(--font-bold); color: white; margin-bottom: var(--space-6);">
          开始您的项目
        </h2>
        <p style="font-size: var(--text-xl); color: rgba(255,255,255,0.9); margin-bottom: var(--space-10);">
          立即联系我们，获取免费咨询和项目报价
        </p>
        <a href="mailto:neo@gongziyu.com" class="btn btn-lg" style="background: white; color: var(--primary-600);">
          免费咨询
        </a>
      </div>
    </div>
  </section>

<?php
ob_start();
?>
<script>
    // 页面加载器
    window.addEventListener('load', function() {
      const loader = document.querySelector('.page-loader');
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => (loader.style.display = 'none'), 500);
      }
    });

    // Reveal 滚动显示动画
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 手风琴功能
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', function() {
        const item = this.parentElement;
        const isActive = item.classList.contains('active');
        
        // 关闭所有
        document.querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('active');
          i.querySelector('.accordion-content').style.maxHeight = '0';
        });
        
        // 打开当前
        if (!isActive) {
          item.classList.add('active');
          const content = item.querySelector('.accordion-content');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  </script>
<?php
$pageScripts = ob_get_clean();

require __DIR__ . '/includes/footer.php';
?>
