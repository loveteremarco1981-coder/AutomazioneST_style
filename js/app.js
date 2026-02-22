
(function(){
  const WEB = window.__WEB_APP_URL__;
  function jsonp(params, cb){
    const cbName = 'cb_'+Math.random().toString(36).slice(2);
    window[cbName] = function(data){ try{ cb(null, data); } finally { delete window[cbName]; s.remove(); } };
    const u = new URL(WEB);
    Object.entries(params||{}).forEach(([k,v])=>u.searchParams.set(k, v));
    u.searchParams.set('callback', cbName);
    const s = document.createElement('script'); s.src = u.toString();
    s.onerror = () => cb(new Error('JSONP error: '+u.toString()));
    document.head.appendChild(s);
  }
  function fmt(n,d=1){ if(n==null) return '—'; const x=Number(n); return isFinite(x)? x.toFixed(d) : '—'; }
  function render(m){
    document.getElementById('state-banner').textContent = (m.state||'—').replace(/_/g,' ');
    const t = m?.weather?.tempC; document.getElementById('kpi-weather').textContent = `${fmt(t)}°C · — km/h`;
    const ppl = (m.people||[]); const inCnt = ppl.filter(p=>p.onlineSmart).length; const tot = ppl.length; document.getElementById('val-people').textContent = tot? `${inCnt}/${tot}` : '—';
    const kwh = m?.energy?.kwh; document.getElementById('val-energy').textContent = (kwh==null? '—' : String(kwh));
    document.getElementById('val-temp').textContent = fmt(t);
    document.getElementById('val-hum').textContent = '—';
    document.getElementById('val-update').textContent = new Date(m?.meta?.nowIso||Date.now()).toLocaleString();
    const logs = document.getElementById('open-logs'); const u = new URL(WEB); u.searchParams.set('logs','1'); u.searchParams.set('callback','console.log'); logs.onclick = ()=> window.open(u.toString(),'_blank');
  }
  function load(){ jsonp({}, (err,m)=>{ if(err){ console.error(err); const b=document.getElementById('state-banner'); b.textContent='CONNESSIONE FALLITA'; b.style.background='#c1121f'; return; } render(m); }); }
  load();
  document.addEventListener('click', (e)=>{
    const b = e.target.closest('.tile'); if(!b) return; const a = b.dataset.action;
    if(a==='set_vacanza' || a==='set_override'){
      jsonp({}, (err, m)=>{ if(err||!m) return; const next=(a==='set_vacanza'? !m.vacanza : !m.override); jsonp({admin:'1',event:a,value:String(next)}, ()=> setTimeout(load,350)); });
    }else{ jsonp({admin:'1',event:a}, ()=> setTimeout(load,250)); }
  });
})();
