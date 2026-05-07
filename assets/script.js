// ===== 导航栏交互 =====
const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// 移动端菜单切换
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// 点击导航链接后关闭移动端菜单
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// 滚动时导航栏样式变化
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    navbar.style.background = 'rgba(10, 10, 15, 0.98)';
    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
  } else {
    navbar.style.background = 'rgba(10, 10, 15, 0.95)';
    navbar.style.boxShadow = 'none';
  }
  
  lastScroll = currentScroll;
});

// ===== 数字动画 =====
function animateNumber(element, target) {
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // 缓动函数
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// ===== 滚动显示动画 =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      
      // 统计数字动画
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        if (target && !stat.classList.contains('animated')) {
          stat.classList.add('animated');
          animateNumber(stat, target);
        }
      });
      
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// 观察所有需要动画的元素
document.querySelectorAll('.stat-item, .section-header, .project-card, .research-card, .value-card, .tech-category').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});

// ===== 项目筛选 =====
const filterTabs = document.querySelectorAll('.filter-tab');
const projectDetails = document.querySelectorAll('.project-detail');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // 更新活动标签
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    const filter = tab.dataset.filter;
    
    // 筛选项目
    projectDetails.forEach(project => {
      const category = project.dataset.category;
      
      if (filter === 'all' || category === filter) {
        project.classList.remove('hidden');
        project.style.opacity = '0';
        project.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          project.style.opacity = '1';
          project.style.transform = 'translateY(0)';
        }, 50);
      } else {
        project.classList.add('hidden');
      }
    });
  });
});

// ===== 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== 当前页面导航高亮 =====
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  // 从路径中提取文件名（兼容 file:// 和 http://）
  const currentFile = currentPath.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    const linkFile = linkPath.split('/').pop();
    const isActive = currentFile === linkFile || 
                     (currentFile === '' && linkFile === 'index.html');
    
    if (isActive) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

setActiveNavLink();

// ===== 鼠标跟随效果（可选） =====
const heroSection = document.querySelector('.hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    particles.forEach((particle, index) => {
      const speed = (index + 1) * 0.02;
      const offsetX = (x - rect.width / 2) * speed;
      const offsetY = (y - rect.height / 2) * speed;
      
      particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  });
  
  heroSection.addEventListener('mouseleave', () => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      particle.style.transform = 'translate(0, 0)';
    });
  });
}

// ===== 输入框焦点效果 =====
document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('focused');
  });
  
  input.addEventListener('blur', () => {
    input.parentElement.classList.remove('focused');
  });
});

// ===== 节流函数 =====
function throttle(func, wait) {
  let timeout;
  let previous = 0;
  
  return function(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}

// ===== 防抖函数 =====
function debounce(func, wait) {
  let timeout;
  
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// ===== 窗口大小变化处理 =====
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // 关闭移动端菜单
    if (window.innerWidth > 768) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  }, 250);
});

// ===== 打字机效果（可选） =====
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// ===== 控制台欢迎信息 =====
console.log('%c公子鱼AI实验室', 'font-size: 24px; font-weight: bold; color: #00D4FF;');
console.log('%c探索AI无限可能', 'font-size: 14px; color: #A0A0B0;');
console.log('%c欢迎联系我们: neo@gongziyu.com', 'font-size: 12px; color: #7C3AED;');
