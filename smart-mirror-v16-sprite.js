(() => {
  'use strict';

  const PAYLOAD = '/assets/projects/smart-mirror/v16/visual-sprite.b64?v=16';
  const positions = ['0%','16.6667%','33.3333%','50%','66.6667%','83.3333%','100%'];
  const map = {
    4: {index:1,label:'DSI ribbon insertion, unlock, align, insert and lock'},
    10:{index:2,label:'Mirror acrylic and 7-inch display dry-fit inside the shadow box'},
    11:{index:2,label:'Display mounting and alignment reference'},
    12:{index:4,label:'Back-panel cable routing, mounting strips, secure points and service slack'},
    13:{index:5,label:'Shadow-box rear panel ready for final closure'},
    14:{index:3,label:'Rear electronics layout with Raspberry Pi and routed cables'},
    15:{index:6,label:'Finished Smart Mirror mounted on the wall'},
    16:{index:6,label:'Completed Smart Mirror final reference'}
  };

  const style = document.createElement('style');
  style.textContent = `
    .v16-generated-visual{width:100%;aspect-ratio:4/3;border:1px solid #293746;border-radius:16px;background-color:#090d13;background-repeat:no-repeat;background-size:100% 700%;box-shadow:0 12px 32px rgba(0,0,0,.28);overflow:hidden}
    .v16-generated-caption{font-size:12px;line-height:1.5;color:#93a4b5;margin-top:-8px;padding:0 2px}
    body.v16-smart-mirror .v16-generated-visual + .v16-check{margin-top:0}
    @media(max-width:820px){.v16-generated-visual{border-radius:12px}.v16-generated-caption{font-size:11px}}
  `;
  document.head.appendChild(style);

  let spriteUrl = '';
  let loading = null;

  function loadSprite(){
    if(spriteUrl) return Promise.resolve(spriteUrl);
    if(loading) return loading;
    loading = fetch(PAYLOAD,{cache:'no-store'})
      .then(r => { if(!r.ok) throw new Error('sprite payload '+r.status); return r.text(); })
      .then(text => {
        const clean = text.replace(/\s+/g,'');
        const raw = atob(clean);
        const bytes = new Uint8Array(raw.length);
        for(let i=0;i<raw.length;i++) bytes[i] = raw.charCodeAt(i);
        spriteUrl = URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
        return spriteUrl;
      })
      .catch(err => { console.warn('Smart Mirror V16 visual sprite unavailable',err); return ''; });
    return loading;
  }

  function stepNumber(){
    const chip = document.querySelector('.step-chip');
    const m = chip && chip.textContent.match(/Step\s+(\d+)/i);
    return m ? Number(m[1]) : 0;
  }

  function placeVisual(){
    const n = stepNumber();
    const spec = map[n];
    const hero = document.querySelector('#stepView.active .step-hero');
    if(!hero || !spec || !spriteUrl) return;
    if(hero.dataset.generatedSprite === String(n)) return;

    const root = hero.querySelector('.v16-hero') || hero;
    root.querySelectorAll('.v16-photo,.v16-assembly,.v16-screen,.v16-generated-visual,.v16-generated-caption').forEach(el => el.remove());

    const visual = document.createElement('div');
    visual.className = 'v16-generated-visual';
    visual.setAttribute('role','img');
    visual.setAttribute('aria-label',spec.label);
    visual.style.backgroundImage = `url(${spriteUrl})`;
    visual.style.backgroundPosition = `center ${positions[spec.index]}`;

    const caption = document.createElement('div');
    caption.className = 'v16-generated-caption';
    caption.textContent = spec.label + '. This is the visual reference for this checkpoint.';

    const eyebrow = root.querySelector('.v16-eyebrow');
    if(eyebrow){ eyebrow.insertAdjacentElement('afterend',visual); visual.insertAdjacentElement('afterend',caption); }
    else { root.prepend(caption); root.prepend(visual); }
    hero.dataset.generatedSprite = String(n);
  }

  loadSprite().then(() => requestAnimationFrame(placeVisual));
  const observer = new MutationObserver(() => requestAnimationFrame(placeVisual));
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  window.addEventListener('pagehide',() => { if(spriteUrl) URL.revokeObjectURL(spriteUrl); },{once:true});
})();
