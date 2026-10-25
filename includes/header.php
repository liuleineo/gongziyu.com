<?php
/**
 * 全站公共页头
 *
 * 页面在引入本文件前可设置：
 * $pageTitle、$pageDescription、$pageKeywords、$canonical、
 * $ogTitle、$ogDescription、$ogImage、$activeNav、$pwaTitle、
 * $pageHead（额外的 head 内容）、$pageStyles（页面专属样式）
 */
$siteName = '公子鱼AI实验室';
$siteUrl = 'https://gongziyu.com';
$pageTitle = $pageTitle ?? $siteName;
$pageDescription = $pageDescription ?? '';
$pageKeywords = $pageKeywords ?? '';
$canonical = $canonical ?? $siteUrl . '/';
$ogTitle = $ogTitle ?? $pageTitle;
$ogDescription = $ogDescription ?? $pageDescription;
$ogImage = $ogImage ?? $siteUrl . '/assets/shortcut.png';
$activeNav = $activeNav ?? '';
$pwaTitle = $pwaTitle ?? '公子鱼AI';
$pageHead = $pageHead ?? '';
$pageStyles = $pageStyles ?? '';

$navItems = [
    'home' => ['label' => '首页', 'href' => '/index.php'],
    'aihub' => ['label' => 'AIHub', 'href' => '/aihub.php'],
    'goal' => ['label' => '金手指', 'href' => '/goal.php'],
    'services' => ['label' => 'AI服务', 'href' => '/services.php'],
    'tools' => ['label' => '工具', 'href' => '/tools.php'],
    'about' => ['label' => '关于', 'href' => '/about.php'],
];
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO 核心 -->
  <title><?= htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8') ?></title>
  <meta name="description" content="<?= htmlspecialchars($pageDescription, ENT_QUOTES, 'UTF-8') ?>">
  <meta name="keywords" content="<?= htmlspecialchars($pageKeywords, ENT_QUOTES, 'UTF-8') ?>">
  <meta name="robots" content="index, follow">
  <meta name="author" content="杭州公子鱼科技有限公司">
  <link rel="canonical" href="<?= htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8') ?>">

  <!-- Open Graph / 社交媒体 -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="<?= htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:title" content="<?= htmlspecialchars($ogTitle, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:description" content="<?= htmlspecialchars($ogDescription, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:image" content="<?= htmlspecialchars($ogImage, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">
  <meta property="og:site_name" content="<?= htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8') ?>">
  <meta property="og:locale" content="zh_CN">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="<?= htmlspecialchars($canonical, ENT_QUOTES, 'UTF-8') ?>">
  <meta name="twitter:title" content="<?= htmlspecialchars($ogTitle, ENT_QUOTES, 'UTF-8') ?>">
  <meta name="twitter:description" content="<?= htmlspecialchars($ogDescription, ENT_QUOTES, 'UTF-8') ?>">
  <meta name="twitter:image" content="<?= htmlspecialchars($ogImage, ENT_QUOTES, 'UTF-8') ?>">

  <!-- Favicon & PWA -->
  <link rel="icon" href="/assets/shortcut.png" type="image/png">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#F7FAFC">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="<?= htmlspecialchars($pwaTitle, ENT_QUOTES, 'UTF-8') ?>">
  <link rel="apple-touch-icon" href="/assets/shortcut.png">

  <!-- 性能优化：DNS预解析 -->
  <link rel="dns-prefetch" href="//fangche.niurouzhou.com">
  <link rel="dns-prefetch" href="//neogood.coze.site">
  <link rel="dns-prefetch" href="//ai.gongziyu.com">
  <link rel="dns-prefetch" href="//hangfang123.com">
  <link rel="dns-prefetch" href="//niurouzhou.com">

  <link rel="stylesheet" href="/assets/styles.css?v=20261025">
<?= $pageHead ?>
<?= $pageStyles ?>
</head>
<body>
  <!-- 导航栏 -->
  <nav class="navbar" aria-label="主导航">
    <div class="container">
      <a href="/index.php" class="logo">
        <img src="/assets/shortcut.png" alt="<?= htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8') ?>">
        <span class="logo-text">公子鱼<span>AI实验室</span></span>
      </a>

      <ul class="nav-menu">
        <?php foreach ($navItems as $key => $item): ?>
          <li><a href="<?= $item['href'] ?>" class="nav-link<?= $key === $activeNav ? ' active' : '' ?>"<?= $key === $activeNav ? ' aria-current="page"' : '' ?>><?= $item['label'] ?></a></li>
        <?php endforeach; ?>
       
      </ul>

      <button class="menu-toggle" aria-label="菜单">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
