<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neo电商工具 - 公子鱼 | 电商运营辅助工具集</title>
    <meta name="description" content="Neo电商工具集，提供电商运营辅助功能，帮助电商从业者提升工作效率。">
    <meta name="keywords" content="电商工具,电商运营,电商辅助">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://gongziyu.com/dianshang.html">
    <style>
        :root {
            --primary-color: #2563eb;
            --card-bg: rgba(255, 255, 255, 0.9);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui;
            line-height: 1.4;
            background: #f3f4f6;
            padding: 10px;
        }

        /* 海报板块 */
        .poster-banner {
            position: relative;
            max-width: 1200px;
            margin: 0 auto 20px;
            padding: 40px 30px;
            border-radius: 16px;
            overflow: hidden;
            text-align: center;
            color: #fff;
            background: linear-gradient(135deg, #ff6b35, #f7931e, #e91e63);
            box-shadow: 0 8px 32px rgba(233, 30, 99, 0.3);
        }
        .poster-bg {
            position: absolute;
            inset: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            pointer-events: none;
        }
        .poster-content {
            position: relative;
            z-index: 1;
        }
        .poster-badge {
            display: inline-block;
            background: rgba(255,255,255,0.25);
            color: #fff;
            padding: 4px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 12px;
            backdrop-filter: blur(4px);
        }
        .poster-title {
            font-size: clamp(1.8rem, 6vw, 2.8rem);
            font-weight: 800;
            margin: 0 0 10px;
            letter-spacing: 2px;
            text-shadow: 0 2px 8px rgba(0,0,0,0.2);
            border: none;
            padding: 0;
            color: #fff;
        }
        .poster-subtitle {
            font-size: clamp(1rem, 3vw, 1.3rem);
            font-weight: 500;
            margin: 0 0 16px;
            opacity: 0.95;
            letter-spacing: 1px;
        }
        .poster-contact {
            font-size: clamp(1.1rem, 4vw, 1.6rem);
            font-weight: 700;
            margin: 0;
            background: rgba(255,255,255,0.2);
            display: inline-block;
            padding: 10px 28px;
            border-radius: 30px;
            backdrop-filter: blur(4px);
            letter-spacing: 1px;
        }

        @media (max-width: 768px) {
            .poster-banner {
                padding: 28px 18px;
                border-radius: 12px;
            }
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            color: var(--primary-color);
            margin: 1.5rem 0;
            font-size: clamp(1.5rem, 5vw, 2.5rem);
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
            padding: 0.5rem;
        }

        .category-card {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 1.2rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
        }

        .category-card:hover {
            transform: translateY(-3px);
        }

        h2 {
            color: var(--primary-color);
            font-size: 1.15rem;
            margin-bottom: 0.75rem;
            padding-bottom: 0.25rem;
            border-bottom: 2px solid #e5e7eb;
        }

        .link-list {
            list-style: none;
        }

        .link-item {
            margin: 0.5rem 0;
        }

        .link-item a {
            display: flex;
            align-items: center;
            padding: 0.6rem;
            border-radius: 8px;
            color: #1f2937;
            text-decoration: none;
            transition: background 0.2s;
        }

        .link-item a:hover {
            background: #f1f5f9;
        }

        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }

            body {
                padding: 5px;
            }
        }
    </style>
</head>

<body>
    <!-- 海报板块 -->
    <div class="poster-banner">
        <div class="poster-content">
            <span class="poster-badge">🔥 限时合作</span>
            <h1 class="poster-title">电商运营合作，只收提点</h1>
            <p class="poster-subtitle">天猫 / 拼多多 / 抖店 代运营合作</p>
            <p class="poster-contact">合作电话：18868725001</p>
        </div>
        <div class="poster-bg"></div>
    </div>

    <div class="container">
        <h1>做品牌IP最重要的是：价值观+流量+复购</h1>

        <div class="grid">
             <!-- 流量+电商平台 -->
            <div class="category-card">
                <h2>电商平台</h2>
                <ul class="link-list">
                    <li class="link-item"><a href="https://www.taobao.com/" target="_blank">淘宝</a></li>
                    <li class="link-item"><a href="https://www.jd.com/" target="_blank">京东</a></li>
                    <li class="link-item"><a href="https://www.pinduoduo.com/" target="_blank">拼多多</a></li>


                </ul>
            </div>
            <!-- 流量+电商平台 -->
            <!-- 打爆款 -->
            <div class="category-card">
                <h2>电商就是持续打爆款</h2>
                <ul class="link-list">
                    <li class="link-item"><a href="" target="_blank">爆款商品</a></li>
                    <li class="link-item"><a href="" target="_blank">爆款视频</a></li>
                    <li class="link-item"><a href="" target="_blank">爆款IP</a></li>
                   

                </ul>
            </div>
             <!-- 打爆款 -->
            <div class="category-card">
                <h2>选赛道打排名</h2>
                <ul class="link-list">
                    <li class="link-item"><a href="" target="_blank">选择增长性赛道</a></li>
                    <li class="link-item"><a href="" target="_blank">选高复购赛道</a></li>
                    <li class="link-item"><a href="" target="_blank">做细分品类第一</a></li>
                    <li class="link-item"><a href="" target="_blank">私域赋能</a></li>

                </ul>
            </div>
           
            <!-- 创作中心 -->
            <div class="category-card">
                <h2>短视频创作中心</h2>
                <ul class="link-list">

                    <li class="link-item"><a href="https://channels.weixin.qq.com/platform" target="_blank">微信视频号助手</a>
                    </li>
                    <li class="link-item"><a href="https://creator.douyin.com/creator-micro/home"
                            target="_blank">抖音创作者中心</a></li>
                    <li class="link-item"><a href="https://me.weibo.com/" target="_blank">微博创作者中心</a></li>
                    <li class="link-item"><a href="" target="_blank">小红书创作中心</a></li>
                    <li class="link-item"><a href="" target="_blank">B站创作中心</a></li>




                </ul>
            </div>
           
            <!-- 投广告 -->
            <div class="category-card">
                <h2>关键词广告/投流</h2>
                <ul class="link-list">
                    <li class="link-item"><a href="" target="_blank">直通车</a></li>
                    <li class="link-item"><a href="" target="_blank">千川</a></li>
                    

                </ul>
            </div>
             <!-- 投广告 -->
           
            <!-- 佣金带货 -->
            <div class="category-card">
                <h2>cps佣金带货联盟</h2>
                <ul class="link-list">

                    <li class="link-item"><a href="https://jinbao.pinduoduo.com/" target="_blank">多多进宝</a></li>
                    <li class="link-item"><a href="https://pub.alimama.com/portal/v2/pages/promo/goods/index.htm"  target="_blank">淘宝联盟</a></li>
                    <li class="link-item"><a href="https://www.douyinec.com/" target="_blank">抖音带货</a></li>
                    <li class="link-item"><a href="https://union.jd.com/index" target="_blank">京东联盟</a></li>
                </ul>
            </div>

            <!-- 自有店铺 -->
            <div class="category-card">
                <h2>AI视频工具</h2>
                <ul class="link-list">
                    <li class="link-item"><a href="https://app.klingai.com/cn/" target="_blank">🔥快手可灵</a></li>
                    <li class="link-item"><a href="https://jimeng.jianying.com/ai-tool/home" target="_blank">🔥字节即梦</a>
                    </li>
                    <li class="link-item"><a href="https://tongyi.aliyun.com/wanxiang/videoCreation"
                            target="_blank">通义万象AI视频</a></li>
                    <li class="link-item"><a href="https://www.jianying.com/ai-creator/start" target="_blank">剪映ai成片</a>
                    </li>

                    <li class="link-item"><a href="" target="_blank"></a></li>

                </ul>
            </div>
            <!-- 自有店铺 -->







            <!-- 第三方工具 -->
            <div class="category-card">
                <h2>第三方工具</h2>
                <ul class="link-list">

                    <li class="link-item"><a href="https://www.yxiaoer.cn/?bd_vid=8810217301618066761"
                            target="_blank">蚁小二：多平台分发</a></li>
                    <li class="link-item"><a href="https://www.chanmama.com/" target="_blank">蝉妈妈</a></li>



                </ul>
            </div>





            <!-- 第三方工具 -->





        </div>
    </div>
</body>

</html>