
(function(){
  const WEB = window.__WEB_APP_URL__;

  function jsonp(params, cb){
    const name = 'cb_'+Math.random().toString(36).slice(2);
    window[name] = function(data){ try{ cb(null, data); } finally { delete window[name]; s.remove(); } };
    const u = new URL(WEB);
    Object.entries(params||{}).forEach(([k,v])=>u.searchParams.set(k, v));
    u.searchParams.set('callback', name);
    const s = document.createElement('script');
    s.src = u.toString();
    s.onerror = () => cb(new Error('JSONP error'));
    document.head.appendChild(s);
  }

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

  function load(){ jsonp({}, (err, data)=>{ if(err){ console.error(err); return; } render(data); }); }
  load();

  document.addEventListener('click', (e)=>{
    const b = e.target.closest('.tile'); if(!b) return;
    const a = b.dataset.action;
    if(a==='set_vacanza' || a==='set_override'){
      jsonp({}, (err, m)=>{ if(err||!m) return; const next = (a==='set_vacanza'? !m.vacanza : !m.override); jsonp({admin:'1',event:a,value:String(next)}, ()=> setTimeout(load,300)); });
    }else{
      jsonp({admin:'1',event:a}, ()=> setTimeout(load,200));
    }
  });
})();
