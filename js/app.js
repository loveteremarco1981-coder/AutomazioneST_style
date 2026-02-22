
(function(){
  const WEB = window.__WEB_APP_URL__;

  function jsonp(params, cb){
    const cbName = 'cb_'+Math.random().toString(36).slice(2);
    window[cbName] = function(data){ try{ cb(null, data); } finally { delete window[cbName]; s.remove(); } };
    const u = new URL(WEB); Object.entries(params||{}).forEach(([k,v])=>u.searchParams.set(k,v)); u.searchParams.set('callback', cbName);
    const s = document.createElement('script'); s.src = u.toString(); s.onerror = () => cb(new Error('JSONP error: '+u.toString())); document.head.appendChild(s);
  }
  const fmt = (n,d=1)=> (n==null? '—' : (Number(n).toFixed(d)));

  function mapCams(state){
    const st = String(state||'').toUpperCase();
    let inter=false, ester=false;
    if(st==='SECURITY_DAY' || st==='SECURITY_NIGHT'){ inter=true; ester=true; }
    else if(st==='COMFY_NIGHT'){ inter=false; ester=true; }
    else { inter=false; ester=false; }
    return {inter, ester};
  }

  function render(m){
    const st = (m.state||'—').replace(/_/g,' ');
    document.getElementById('state-banner').textContent = st;

    const home = m.presenzaEffettiva ? 'OCCUPATA' : 'VUOTA';
    document.getElementById('val-home').textContent = home;

    const cams = mapCams(m.state);
    const inEl = document.getElementById('cam-interne');
    const exEl = document.getElementById('cam-esterne');
    inEl.classList.toggle('on', cams.inter); exEl.classList.toggle('on', cams.ester);

    const t = m?.weather?.tempC; const wind = m?.weather?.windKmh; const hum = m?.weather?.hum;
    document.getElementById('kpi-weather').textContent = `${fmt(t)}°C · ${wind==null?'—':wind} km/h`;

    document.getElementById('val-energy').textContent = (m?.energy?.kwh==null? '—': String(m.energy.kwh));
    document.getElementById('val-temp').textContent = fmt(t);
    document.getElementById('val-hum').textContent  = (hum==null? '—' : String(hum));

    document.getElementById('val-update').textContent = new Date(m?.meta?.nowIso||Date.now()).toLocaleString();

    const logs = document.getElementById('open-logs');
    const u = new URL(WEB); u.searchParams.set('logs','1'); u.searchParams.set('callback','console.log');
    logs.onclick = ()=> window.open(u.toString(),'_blank');
  }

  function load(){ jsonp({}, (err, m)=>{ if(err){ console.error(err); const b=document.getElementById('state-banner'); b.textContent='CONNESSIONE FALLITA'; b.style.background='#c1121f'; return; } render(m); }); }
  load();

  document.addEventListener('click', (e)=>{
    const b = e.target.closest('.tile'); if(!b) return; const a = b.dataset.action;
    if(a==='set_vacanza' || a==='set_override'){
      jsonp({}, (err, m)=>{ if(err||!m) return; const next=(a==='set_vacanza'? !m.vacanza : !m.override); jsonp({admin:'1',event:a,value:String(next)}, ()=> setTimeout(load,350)); });
    }else{ jsonp({admin:'1',event:a}, ()=> setTimeout(load,250)); }
  });
})();
