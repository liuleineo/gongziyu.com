  <!-- 页脚 -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <a href="/index.php" class="footer-logo">
            <img src="/assets/shortcut.png" alt="公子鱼AI实验室">
            <span class="logo-text">公子鱼<span>AI实验室</span></span>
          </a>
          <p class="footer-desc">
            探索人工智能边界，打造创新AI应用
          </p>
        </div>

        <div class="footer-links">
          <div>
            <h4>快速导航</h4>
            <ul>
              <li><a href="/index.php">首页</a></li>
              <li><a href="/about.php">关于</a></li>
              <li><a href="/aihub.php">AIHub</a></li>
              <li><a href="/services.php">AI服务</a></li>
              

              <li><a href="https://docs.gongziyu.com/" target="_blank" rel="noopener">文档</a></li>
            </ul>
          </div>
           <div>
            <h4>工具</h4>
            <ul>
            
              <li><a href="/tools.php">工具</a></li>
              <li><a href="/hack.php">安全测试</a></li>
              <li><a href="/dianshang.php">电商工具</a></li>
              <li><a href="/taiji.php">太极</a></li>
              <li><a href="/products/kingsystem/index.html">金手指</a></li>

              <li><a href="https://docs.gongziyu.com/" target="_blank" rel="noopener">文档</a></li>
            </ul>
          </div>

          <div>
            <h4>联系方式</h4>
            <ul>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href="mailto:neo@gongziyu.com">neo@gongziyu.com</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.18 5.18 2 2 0 0 1 5.18 3h3a2 2 0 0 1 2 1.72c.13 1.21.37 2.39.72 3.53a2 2 0 0 1-.45 1.95l-2.11 2.11a16.05 16.05 0 0 0 6.58 6.58l2.11-2.11a2 2 0 0 1 1.95-.45c1.14.35 2.32.59 3.53.72A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a href="tel:+8618868725001">18868725001</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                杭州市
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© <?= date('Y') ?> 杭州公子鱼科技有限公司 版权所有 | 浙ICP备2021037366号-3</p>
      </div>
    </div>
  </footer>

  <script src="/assets/script.js"></script>

  <!-- Service Worker 注册 -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('[PWA] ServiceWorker 注册成功:', registration.scope);
          })
          .catch(error => {
            console.log('[PWA] ServiceWorker 注册失败:', error);
          });
      });
    }
  </script>
<?= $pageScripts ?? '' ?>
</body>
</html>
