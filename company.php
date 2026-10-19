<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>太极五行 · 修仙企业经营演化图</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:"Microsoft YaHei",sans-serif}
body{background:#0f141c;color:#e8e8e8;display:flex;flex-direction:column;align-items:center;padding:30px}
h1{font-size:24px;margin-bottom:8px;color:#ffd770}
.desc{max-width:700px;text-align:center;margin-bottom:24px;opacity:0.8;line-height:1.6}
.container{position:relative;width:650px;height:650px}
svg{width:100%;height:100%}
.text-label{font-size:14px;text-anchor:middle}
/* 五行流转光点 */
.dot{animation:flow 12s linear infinite;}
@keyframes flow{
  0%{opacity:0;}
  20%{opacity:1;}
  80%{opacity:1;}
  100%{opacity:0;}
}
/* 太极外圈呼吸光晕 */
.ring-glow{animation:ringGlow 5s ease-in-out infinite}
@keyframes ringGlow{0%,100%{opacity:0.45}50%{opacity:1}}
/* 五行：呼吸律动（按相生次序错峰） */
.pulse{transform-box:fill-box;transform-origin:center;animation:circlePulse 3.6s ease-in-out infinite}
.pulse-1{animation-delay:0s}
.pulse-2{animation-delay:0.72s}
.pulse-3{animation-delay:1.44s}
.pulse-4{animation-delay:2.16s}
.pulse-5{animation-delay:2.88s}
@keyframes circlePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
/* 八卦：五行对应高亮（与五行同步闪烁） */
.hl{animation:hlPulse 3.6s ease-in-out infinite}
.hl-1{animation-delay:0s}
.hl-2{animation-delay:0.72s}
.hl-3{animation-delay:1.44s}
.hl-4{animation-delay:2.16s}
.hl-5{animation-delay:2.88s}
@keyframes hlPulse{0%,100%{opacity:0.4}50%{opacity:1}}
.info-card{margin-top:20px;background:rgba(255,255,255,0.08);padding:16px;border-radius:12px;max-width:650px;line-height:1.7}
.info-card h3{color:#ffd770;margin-bottom:8px}
.info-card p{opacity:0.9;font-size:14px}
/* 修仙 · 灵气粒子 */
.lingqi{position:fixed;bottom:-30px;border-radius:50%;
  background:radial-gradient(circle at center,rgba(255,215,112,0.95),rgba(255,215,112,0.15) 60%,transparent 75%);
  pointer-events:none;z-index:-1;filter:drop-shadow(0 0 6px rgba(255,215,112,0.6));
  animation:rise linear infinite;}
@keyframes rise{
  0%{transform:translateY(0) translateX(0) scale(1);opacity:0}
  12%{opacity:0.9}
  80%{opacity:0.5}
  100%{transform:translateY(-108vh) translateX(40px) scale(1.6);opacity:0}
}
/* 修仙 · 境界阶梯 */
.realms{margin-top:24px;width:650px;max-width:100%}
.realms h2{color:#ffd770;font-size:18px;text-align:center;margin-bottom:12px}
.realm-list{display:flex;flex-direction:column;gap:10px}
.realm{position:relative;overflow:hidden;display:flex;align-items:center;gap:14px;
  background:rgba(255,255,255,0.05);border:1px solid rgba(255,215,112,0.25);
  border-radius:10px;padding:11px 16px}
.realm .bar{position:absolute;left:0;top:0;bottom:0;
  background:linear-gradient(90deg,rgba(255,215,112,0.4),rgba(255,215,112,0.06))}
.realm-name{font-size:16px;color:#ffd770;font-weight:bold;min-width:92px;white-space:nowrap}
.realm-desc{font-size:13px;opacity:0.85}
</style>
</head>
<body>
<h1>太极两仪 · 五行八卦 · 修仙企业经营模型</h1>
<p class="desc">太极=企业本体；两仪：阴（内功·沉淀）阳（外功·市场）；五行对应研发、生产、营销、资金、组织；八卦代表业务八大维度；以修仙境界观企业修为，灵气即现金流与人才，灵根即核心技术</p>

<div class="container">
<svg viewBox="0 0 640 640">
  <!-- 背景圆 -->
  <circle cx="320" cy="320" r="300" fill="none" stroke="#555" stroke-width="1"/>
  <!-- 八卦轨道 -->
  <circle cx="320" cy="320" r="272" fill="none" stroke="#555" stroke-width="1" stroke-dasharray="2 6"/>
  <!-- 太极图 -->
  <g transform="translate(320,320)">
    <!-- 太极外圈（呼吸光晕） -->
    <circle class="ring-glow" r="100" fill="none" stroke="#ffd770" stroke-width="2"/>
    <!-- 两仪（阴阳鱼，缓慢互转） -->
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="26s" repeatCount="indefinite"/>
      <!-- 阳鱼（外功·市场） -->
      <path d="M0,-100 A100,100 0 0,1 0,100 A50,50 0 0,0 0,0 A50,50 0 0,1 0,-100 Z" fill="#222"/>
      <!-- 阴鱼（内功·沉淀） -->
      <path d="M0,-100 A100,100 0 0,0 0,100 A50,50 0 0,1 0,0 A50,50 0 0,0 0,-100 Z" fill="#f0f0f0"/>
      <!-- 鱼眼 -->
      <circle cy="-50" r="13" fill="#f0f0f0"/>
      <circle cy="50" r="13" fill="#222"/>
    </g>
    <!-- 阳标注（置于鱼眼，随鱼公转，始终正立） -->
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="26s" repeatCount="indefinite"/>
      <g transform="translate(0,-50)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="26s" repeatCount="indefinite"/>
          <text x="0" y="5" class="text-label" style="font-size:14px;font-weight:bold" fill="#222">阳</text>
        </g>
      </g>
    </g>
    <!-- 阴标注（置于鱼眼，随鱼公转，始终正立） -->
    <g>
      <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="26s" repeatCount="indefinite"/>
      <g transform="translate(0,50)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="26s" repeatCount="indefinite"/>
          <text x="0" y="5" class="text-label" style="font-size:14px;font-weight:bold" fill="#f0f0f0">阴</text>
        </g>
      </g>
    </g>
    <text y="-118" class="text-label" fill="#fff">太极 · 企业本体</text>
  </g>

  <!-- 八卦外圈（固定方位 + 卦象符号 + 五行对应高亮：乾兑=金、离=火、震巽=木、坎=水、坤艮=土） -->
  <g>
    <!-- 乾 ☰ · 金 -->
    <g class="hl hl-5" transform="translate(320,48)">
      <g stroke="#82cfff" stroke-width="4" stroke-linecap="round" fill="none">
        <line x1="-14" y1="-14" x2="14" y2="-14"/>
        <line x1="-14" y1="-4" x2="14" y2="-4"/>
        <line x1="-14" y1="6" x2="14" y2="6"/>
      </g>
      <text y="28" class="text-label" fill="#82cfff">乾 · 战略</text>
    </g>
    <!-- 兑 ☱ · 金 -->
    <g class="hl hl-5" transform="translate(592,320)">
      <g stroke="#82cfff" stroke-width="4" stroke-linecap="round" fill="none">
        <line x1="-14" y1="-14" x2="-4" y2="-14"/><line x1="4" y1="-14" x2="14" y2="-14"/>
        <line x1="-14" y1="-4" x2="14" y2="-4"/>
        <line x1="-14" y1="6" x2="14" y2="6"/>
      </g>
      <text y="28" class="text-label" fill="#82cfff">兑 · 品牌</text>
    </g>
    <!-- 离 ☲ · 火 -->
    <g class="hl hl-3" transform="translate(512,512)">
      <g stroke="#ff6b6b" stroke-width="4" stroke-linecap="round" fill="none">
        <line x1="-14" y1="-14" x2="14" y2="-14"/>
        <line x1="-14" y1="-4" x2="-4" y2="-4"/><line x1="4" y1="-4" x2="14" y2="-4"/>
        <line x1="-14" y1="6" x2="14" y2="6"/>
      </g>
      <text y="28" class="text-label" fill="#ff6b6b">离 · 营销</text>
    </g>
    <!-- 坤 ☷ · 土 -->
    <g class="hl hl-4" transform="translate(320,592)">
      <g stroke="#ffc145" stroke-width="4" stroke-linecap="round" fill="none">
        <line x1="-14" y1="-14" x2="-4" y2="-14"/><line x1="4" y1="-14" x2="14" y2="-14"/>
        <line x1="-14" y1="-4" x2="-4" y2="-4"/><line x1="4" y1="-4" x2="14" y2="-4"/>
        <line x1="-14" y1="6" x2="-4" y2="6"/><line x1="4" y1="6" x2="14" y2="6"/>
      </g>
      <text y="28" class="text-label" fill="#ffc145">坤 · 组织</text>
    </g>
    <!-- 坎 ☵ · 水 -->
    <g class="hl hl-1" transform="translate(128,512)">
      <g stroke="#b19cd9" stroke-width="4" stroke-linecap="round" fill="none">
        <line x1="-14" y1="-14" x2="-4" y2="-14"/><line x1="4" y1="-14" x2="14" y2="-14"/>
        <line x1="-14" y1="-4" x2="14" y2="-4"/>
        <line x1="-14" y1="6" x2="-4" y2="6"/><line x1="4" y1="6" x2="14" y2="6"/>
      </g>
      <text y="28" class="text-label" fill="#b19cd9">坎 · 资金</text>
    </g>
    <!-- 艮 ☶ · 土 -->
    <g class="hl hl-4" transform="translate(48,320)">
      <g stroke="#ffc145" stroke-width="4" stroke-linecap="round" fill="none">
        <line x1="-14" y1="-14" x2="14" y2="-14"/>
        <line x1="-14" y1="-4" x2="-4" y2="-4"/><line x1="4" y1="-4" x2="14" y2="-4"/>
        <line x1="-14" y1="6" x2="-4" y2="6"/><line x1="4" y1="6" x2="14" y2="6"/>
      </g>
      <text y="28" class="text-label" fill="#ffc145">艮 · 生产</text>
    </g>
    <!-- 震 ☳ · 木 -->
    <g class="hl hl-2" transform="translate(128,128)">
      <g stroke="#72d572" stroke-width="4" stroke-linecap="round" fill="none">
        <line x1="-14" y1="-14" x2="-4" y2="-14"/><line x1="4" y1="-14" x2="14" y2="-14"/>
        <line x1="-14" y1="-4" x2="-4" y2="-4"/><line x1="4" y1="-4" x2="14" y2="-4"/>
        <line x1="-14" y1="6" x2="14" y2="6"/>
      </g>
      <text y="28" class="text-label" fill="#72d572">震 · 研发</text>
    </g>
    <!-- 巽 ☴ · 木 -->
    <g class="hl hl-2" transform="translate(512,128)">
      <g stroke="#72d572" stroke-width="4" stroke-linecap="round" fill="none">
        <line x1="-14" y1="-14" x2="14" y2="-14"/>
        <line x1="-14" y1="-4" x2="14" y2="-4"/>
        <line x1="-14" y1="6" x2="-4" y2="6"/><line x1="4" y1="6" x2="14" y2="6"/>
      </g>
      <text y="28" class="text-label" fill="#72d572">巽 · 供应链</text>
    </g>
  </g>

  <!-- 五行环（正五边形 · 上北水，顺时针相生：水→木→火→土→金） -->
  <g>
    <!-- 水：资金 #b19cd9（北） -->
    <circle class="pulse pulse-1" cx="320" cy="150" r="36" fill="rgba(177,156,217,0.15)" stroke="#b19cd9" stroke-width="2"/>
    <text x="320" y="154" class="text-label" fill="#b19cd9">水｜资金</text>
    <!-- 木：研发 #72d572（东） -->
    <circle class="pulse pulse-2" cx="482" cy="267" r="36" fill="rgba(114,213,114,0.15)" stroke="#72d572" stroke-width="2"/>
    <text x="482" y="271" class="text-label" fill="#72d572">木｜研发</text>
    <!-- 火：营销 #ff6b6b（南） -->
    <circle class="pulse pulse-3" cx="420" cy="458" r="36" fill="rgba(255,107,107,0.15)" stroke="#ff6b6b" stroke-width="2"/>
    <text x="420" y="462" class="text-label" fill="#ff6b6b">火｜营销</text>
    <!-- 土：组织 #ffc145（西南） -->
    <circle class="pulse pulse-4" cx="220" cy="458" r="36" fill="rgba(255,193,69,0.15)" stroke="#ffc145" stroke-width="2"/>
    <text x="220" y="462" class="text-label" fill="#ffc145">土｜组织</text>
    <!-- 金：生产 #82cfff（西） -->
    <circle class="pulse pulse-5" cx="158" cy="267" r="36" fill="rgba(130,207,255,0.15)" stroke="#82cfff" stroke-width="2"/>
    <text x="158" y="271" class="text-label" fill="#82cfff">金｜生产</text>
  </g>

  <!-- 五行相生连线 水→木→火→土→金→水 -->
  <path d="M320,150 L482,267" stroke="#b19cd9" stroke-width="1.5" opacity="0.6"/>
  <path d="M482,267 L420,458" stroke="#72d572" stroke-width="1.5" opacity="0.6"/>
  <path d="M420,458 L220,458" stroke="#ff6b6b" stroke-width="1.5" opacity="0.6"/>
  <path d="M220,458 L158,267" stroke="#ffc145" stroke-width="1.5" opacity="0.6"/>
  <path d="M158,267 L320,150" stroke="#82cfff" stroke-width="1.5" opacity="0.6"/>

  <!-- 流转粒子动画点（沿相生路径循环） -->
  <circle class="dot" cx="320" cy="150" r="4" fill="#fff">
    <animate attributeName="cx" values="320;482;420;220;158;320" dur="12s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="150;267;458;458;267;150" dur="12s" repeatCount="indefinite"/>
  </circle>
</svg>
</div>

<div class="info-card">
<h3>模型释义 · 修仙篇</h3>
<p>✅ 两仪：阳 = 外部市场获客（外功）；阴 = 内部技术资产沉淀（内功），企业阴阳必须平衡，偏阳容易虚耗，偏阴脱离市场。<br/>
✅ 五行相生：木(研发)生火(营销)，营销成果壮大组织(土)，组织成熟带动生产(金)，生产回款充盈资金(水)，资金反哺研发(木)，形成经营闭环。<br/>
✅ 八卦：乾战略、兑品牌、离营销、坤组织、坎资金、艮生产、震研发、巽供应链，环绕五行持续运转。<br/>
✅ 动画逻辑：两仪（阴阳鱼）缓慢互转；五行圆环按相生次序呼吸律动；八卦卦象与文字以五行配色同步闪烁（乾兑=金、离=火、震巽=木、坎=水、坤艮=土）；光点沿相生路径流转，灵气粒子自下而上蒸腾，象征企业修为与气运不断攀升。
</p>
</div>

<script>
(function(){
  for(var i=0;i<42;i++){
    var p=document.createElement('i');
    p.className='lingqi';
    var s=Math.random()*6+3;
    p.style.width=s+'px';
    p.style.height=s+'px';
    p.style.left=(Math.random()*100)+'%';
    p.style.animationDuration=(Math.random()*12+8)+'s';
    p.style.animationDelay=(Math.random()*10)+'s';
    document.body.appendChild(p);
  }
})();
</script>

</body>
</html>
