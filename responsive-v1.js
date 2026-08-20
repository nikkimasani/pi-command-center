(() => {
  'use strict';
  const style=document.createElement('style');
  style.id='pi-responsive-v1';
  style.textContent=`
  html,body{max-width:100%;overflow-x:hidden}
  body{min-width:0}
  .app-shell,.main-area,.content-wrap,.view,.step-layout,.step-main,.right-panel{min-width:0}
  img,svg,video,canvas{max-width:100%;height:auto}
  button,input,select,textarea{max-width:100%}
  .project-card,.quick-card,.inventory-card,.dash-card,.setting-item,.trouble-item,.resource-link{min-width:0}
  .project-body p,.quick-card-desc,.action-desc,.panel-muted,.note-entry p,.trouble-item p{overflow-wrap:anywhere}
  .cmd-block code,.result-block code,.v17-terminal pre,.v17-code pre{white-space:pre-wrap!important;overflow-wrap:anywhere;word-break:break-word}

  @media (min-width:1440px){
    :root{--sidebar-w:240px}
    .content-wrap{width:min(1480px,100%);margin:0 auto;padding:34px 36px 0}
    .project-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
    .quick-row{grid-template-columns:repeat(3,minmax(0,1fr))}
    .step-layout{grid-template-columns:minmax(0,1fr) 340px}
    .step-main{padding:32px 36px}
  }

  @media (max-width:1180px){
    .project-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
    .step-layout{grid-template-columns:minmax(0,1fr) 280px}
    .content-wrap{padding:24px 22px 0}
    .step-main{padding:22px}
    .right-panel{min-width:0}
  }

  @media (max-width:980px){
    .app-shell{grid-template-columns:1fr}
    .sidebar{position:fixed;left:-282px;top:0;width:282px;max-width:88vw;height:100dvh;z-index:1000;transition:transform .25s ease}
    .sidebar.open{transform:translateX(282px)}
    .mobile-header{display:flex;padding-top:max(12px,env(safe-area-inset-top));padding-left:max(14px,env(safe-area-inset-left));padding-right:max(14px,env(safe-area-inset-right))}
    .content-wrap{padding:18px 18px calc(84px + env(safe-area-inset-bottom))}
    .step-topbar{position:sticky;top:60px;z-index:80;padding:10px 18px;background:rgba(13,19,29,.96);backdrop-filter:blur(12px)}
    .step-layout{display:block;min-height:0}
    .step-main{border-right:0;padding:18px}
    .right-panel{position:static;height:auto;max-height:none;border-top:1px solid var(--line)}
    .right-panel .panel-section{padding:14px 18px}
    .bottom-nav.visible{display:flex;padding-bottom:env(safe-area-inset-bottom);height:calc(62px + env(safe-area-inset-bottom))}
  }

  @media (max-width:760px){
    .welcome-banner{padding:20px;align-items:flex-start}
    .welcome-title{font-size:20px}
    .welcome-subtitle{font-size:12.5px}
    .welcome-visual{display:none}
    .quick-row{grid-template-columns:1fr}
    .project-grid{grid-template-columns:1fr;gap:12px}
    .section-head{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .section-head-title{grid-column:1/-1}
    .section-search,.difficulty-filter{width:100%}
    .step-title-area h1{font-size:22px}
    .step-title-area p{font-size:13px}
    .step-hero{min-height:0}
    .step-thumbnails{margin-bottom:18px;scroll-snap-type:x proximity}
    .thumb{width:72px;height:54px;scroll-snap-align:start}
    .quicklinks-grid{grid-template-columns:1fr}
    .dashboard-placeholder{grid-template-columns:1fr}
    .inventory-grid{grid-template-columns:1fr}
    .action-item{grid-template-columns:30px minmax(0,1fr);gap:10px}
    .hardware-ref{align-items:flex-start}
    .nav-btn{padding:9px 14px;min-height:44px}
    .step-indicator{min-width:0}
    .step-indicator-text{white-space:nowrap}
    .v17-test-row{grid-template-columns:1fr!important}
  }

  @media (max-width:480px){
    .mobile-header{gap:8px;padding-left:10px;padding-right:10px}
    .mobile-header-title{font-size:13px}
    .mobile-toolbox-link{font-size:10px;padding:5px 7px}
    .content-wrap{padding:14px 12px calc(86px + env(safe-area-inset-bottom))}
    .welcome-banner{padding:16px;border-radius:12px}
    .welcome-title{font-size:18px}
    .quick-card{padding:14px}
    .project-image{height:88px}
    .project-body{padding:11px}
    .meta-row{flex-wrap:wrap;gap:6px 9px}
    .step-topbar{top:58px;padding:8px 12px;gap:8px}
    .step-chip,.step-time-est,.guided-label{font-size:10px}
    .step-main{padding:12px}
    .step-title-area{margin-bottom:14px}
    .step-title-area h1{font-size:20px}
    .step-actions-list{gap:7px}
    .action-item{padding:10px}
    .callout{padding:10px 11px}
    .right-panel .panel-section{padding:12px}
    .bottom-nav{padding-left:8px;padding-right:8px;gap:6px}
    .nav-btn{padding:8px 10px;font-size:11px}
    .step-dots{max-width:120px;overflow:hidden}
    .v17-desktop{min-height:300px!important;padding:20px!important}
    .v17-desktop h3{font-size:24px!important}
    .v17-desktop p{font-size:15px!important}
    .v17-terminal pre,.v17-code pre{font-size:11px!important;padding:14px!important}
    .v17-mirror{min-height:330px!important;padding:20px!important}
    .v17-clock{font-size:38px!important}
    .v17-weather{top:112px!important;right:20px!important;font-size:30px!important}
    .v17-wall{min-height:340px!important;padding:24px 14px!important}
    .v17-frame{width:88%!important;border-width:12px!important}
  }

  @media (max-height:520px) and (orientation:landscape){
    .mobile-header{position:relative}
    .content-wrap{padding-top:10px}
    .welcome-banner{padding:14px 18px}
    .welcome-subtitle{display:none}
    .quick-row{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    .quick-card{padding:10px}
    .quick-card-desc{display:none}
    .project-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
    .step-topbar{top:0;position:sticky}
    .step-main{padding:12px}
    .step-title-area h1{font-size:19px}
    .step-title-area p{font-size:12px}
    .right-panel .panel-section{padding:10px 12px}
    .bottom-nav.visible{height:52px;padding-bottom:0}
    .v17-diagram svg{max-height:66vh;object-fit:contain}
    .v17-screen,.v17-terminal,.v17-code,.v17-mirror,.v17-finished{max-height:none}
  }

  @media (pointer:coarse){
    button,.side-link,.qa-btn,.quicklink-card,.inventory-item,.outline-btn,.note-save-btn,.cmd-copy-btn,.photo-viewer-tabs button{min-height:44px}
    input,select,textarea{font-size:16px}
    .side-link{padding-top:11px;padding-bottom:11px}
  }

  @media (prefers-reduced-motion:reduce){
    *,*::before,*::after{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important}
  }
  `;
  document.head.appendChild(style);

  const setViewportClass=()=>{
    const w=window.innerWidth,h=window.innerHeight;
    document.documentElement.dataset.viewport=w<=480?'phone':w<=980?'tablet':w>=1440?'wide':'desktop';
    document.documentElement.dataset.orientation=w>=h?'landscape':'portrait';
  };
  setViewportClass();
  window.addEventListener('resize',setViewportClass,{passive:true});
  window.addEventListener('orientationchange',setViewportClass,{passive:true});
})();
