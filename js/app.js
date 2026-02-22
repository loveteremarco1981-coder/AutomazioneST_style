
(function(){
  const WEB = window.__WEB_APP_URL__;
  const CB  = 'onModel';

  window[CB] = function(model){
    try{ render(model); }
    catch(e){ console.error('Render error', e); }
  };

  function fmtNum(n, d=1){ if(n==null) return '—'; const x=Number(n); return isFinite(x)? x.toFixed(d) : '—'; }

  function render(model){
    const st = (model.state||'—').replace(/_/g,' ');
    document.getElementById('state-banner').textContent = st;
    const temp = model?.weather?.tempC;
    document.getElementById('kpi-weather').textContent = `${fmtNum(temp)}°C · — km/h`;
    const ppl = (model.people||[]);
    const inCnt = ppl.filter(p=>p.onlineSmart).length;
    const total = ppl.length;
    document.getElementById('val-people').textContent = total? `${inCnt}/${total}` : '—';
    const kwh = model?.energy?.kwh; document.getElementById('val-energy').textContent = (kwh==null? '—' : String(kwh));
    document.getElementById('val-temp').textContent = fmtNum(temp);
    document.getElementById('val-hum').textContent = '—';
    document.getElementById('val-update').textContent = new Date(model?.meta?.nowIso||Date.now()).toLocaleString();
    const logs = document.getElementById('open-logs');
    const u = new URL(WEB); u.searchParams.set('logs','1'); u.searchParams.set('callback','console.log');
    logs.onclick = ()=> window.open(u.toString(),'_blank');
  }

  function load(){
    const u = WEB + (WEB.includes('?') ? '&' : '?') + 'callback=' + CB + '&_=' + Date.now();
    console.debug('[JSONP] url =', u);
    const s = document.createElement('script');
    s.src = u;
    s.onerror = () => {
      console.error('JSONP error', u);
      const b = document.getElementById('state-banner');
      b.textContent = 'CONNESSIONE FALLITA';
      b.style.background = '#c1121f';
    };
    document.head.appendChild(s);
  }

  // Preferiti (admin)
  document.addEventListener('click', (e)=>{
    const b = e.target.closest('.tile'); if(!b) return;
    const a = b.dataset.action;
    if(a==='set_vacanza' || a==='set_override'){
      // 1) reload per avere stato corrente
      const cb1 = 'tmp_'+Math.random().toString(36).slice(2);
      window[cb1] = (m)=>{ try{
        const next = (a==='set_vacanza'? !m.vacanza : !m.override);
        const u = WEB + (WEB.includes('?')?'&':'?') + 'admin=1&event='+a+'&value='+next+'&callback=console.log&_='+Date.now();
        console.debug('[ADMIN]', u); const s = document.createElement('script'); s.src = u; document.head.appendChild(s);
        setTimeout(load, 400);
      }finally{ delete window[cb1]; }};
      const u = WEB + (WEB.includes('?')?'&':'?') + 'callback='+cb1+'&_='+Date.now();
      const s=document.createElement('script'); s.src=u; document.head.appendChild(s);
    }else{
      const u = WEB + (WEB.includes('?')?'&':'?') + 'admin=1&event='+a+'&callback=console.log&_='+Date.now();
      console.debug('[ADMIN]', u); const s = document.createElement('script'); s.src = u; document.head.appendChild(s);
      setTimeout(load, 300);
    }
  });

  // start
  load();
})();
