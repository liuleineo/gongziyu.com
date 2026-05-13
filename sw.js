// 公子鱼AI实验室 - Service Worker
const CACHE_NAME = 'gongziyu-ai-cache-v1';
const urlsToCache = [
  '/',
  '/aihub.html',
  '/about.html',
  '/projects.html',
  '/products.html',
  '/index.html',
  '/services.html',
  '/hack.html',
  '/dianshang.html',
  '/assets/styles.css',
  '/assets/script.js',
  '/assets/shortcut.png',
  '/assets/logo-big.jpg'
];

// 安装事件 - 缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] 缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('[SW] 部分资源缓存失败，非关键错误:', err);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 让 service worker 立即接管所有页面
  return self.clients.claim();
});

// 拦截请求 - 网络优先，缓存兜底
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 只缓存成功的响应
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败时从缓存读取
        return caches.match(event.request);
      })
  );
});
