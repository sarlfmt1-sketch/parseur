(async function(){
if(!location.href.includes('abcplanning-fso.lacroixsavac.fr')){alert('Va sur abcplanning dabord!');return;}
var h4=document.querySelector('h4');
if(!h4){alert('Va sur la page ChoixDate!');return;}
var mn={'janvier':1,'fevrier':2,'mars':3,'avril':4,'mai':5,'juin':6,'juillet':7,'aout':8,'septembre':9,'octobre':10,'novembre':11,'decembre':12};
var p=h4.textContent.trim().toLowerCase().replace(/[\xe9\xe8]/g,'e').replace(/\xfb/g,'u').split(' ');
var mois=mn[p[0]]||1,annee=parseInt(p[1]);
var days=document.querySelectorAll('.ui-datebox-griddate.ui-btn');
var jours=[];
for(var i=0;i<days.length;i++){
  var n=parseInt(days[i].textContent.trim());
  if(!isNaN(n)&&n>0){
    var bg=days[i].style.backgroundColor;
    jours.push({n:n,s:bg&&bg!='rgb(255, 255, 255)'&&bg!=''});
  }
}
var mm=('0'+mois).slice(-2);
var html=jours.map(function(j){
  var dd=('0'+j.n).slice(-2);
  var dateStr=annee+'-'+mm+'-'+dd;
  var col=j.s?'#00d4ff':'#555';
  return '<label style="display:inline-flex;align-items:center;gap:3px;margin:3px;border:1px solid '+col+';border-radius:5px;padding:5px 8px;cursor:pointer;font-size:12px;color:'+col+'"><input type=checkbox value="'+dateStr+'" '+(j.s?'checked':'')+' style="accent-color:#00d4ff"> '+dd+'/'+mm+'</label>';
}).join('');
var ov=document.createElement('div');
ov.id='clv';
ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.88);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:sans-serif';
ov.innerHTML='<div style="background:#1a1a2e;border:2px solid #00d4ff;border-radius:12px;padding:20px;color:#fff;max-width:460px;width:92%;max-height:90vh;overflow-y:auto">'
  +'<div style="font-size:17px;font-weight:700;color:#00d4ff;margin-bottom:12px">ChronoLigne - '+h4.textContent.trim()+'</div>'
  +'<div id=clj style="display:flex;flex-wrap:wrap">'+html+'</div>'
  +'<div style="display:flex;gap:6px;margin:10px 0">'
  +'<button onclick="document.querySelectorAll(\'#clj input\').forEach(function(c){c.checked=true})" style="background:rgba(0,212,255,.1);border:1px solid #00d4ff;color:#00d4ff;padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px">Tout</button>'
  +'<button onclick="document.querySelectorAll(\'#clj input\').forEach(function(c){c.checked=false})" style="background:rgba(255,255,255,.05);border:1px solid #555;color:#888;padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px">Aucun</button>'
  +'</div>'
  +'<div id=cls style="font-size:12px;color:#9ca3af;margin:8px 0;min-height:18px"></div>'
  +'<div id=clp style="background:#0d1117;border-radius:5px;padding:6px;font-size:10px;color:#6b7280;max-height:80px;overflow-y:auto;display:none;margin-bottom:8px;font-family:monospace"></div>'
  +'<div style="display:flex;gap:8px">'
  +'<button id=clbtn style="flex:1;background:linear-gradient(135deg,#005f73,#0a9396);border:1px solid #00d4ff;color:#fff;font-size:14px;font-weight:700;padding:11px;border-radius:8px;cursor:pointer">Importer</button>'
  +'<button onclick="document.body.removeChild(document.getElementById(\'clv\'))" style="background:rgba(231,76,60,.1);border:1px solid #e74c3c;color:#e74c3c;padding:11px 14px;border-radius:8px;cursor:pointer">X</button>'
  +'</div>'
  +'</div>';
document.body.appendChild(ov);

function ss(m){document.getElementById('cls').textContent=m;}
function lg(m){var e=document.getElementById('clp');e.style.display='block';e.innerHTML+=m+'\n';e.scrollTop=e.scrollHeight;}
function hm(h){var p=h.split(':');return parseInt(p[0])*60+parseInt(p[1]);}

async function gt(date){
  var r=await fetch('/Home/Services?dateJour='+encodeURIComponent(date),{credentials:'include'});
  var h=await r.text();
  var doc=new DOMParser().parseFromString(h,'text/html');
  var els=doc.querySelectorAll('[idserv]');
  var ids=[];
  for(var i=0;i<els.length;i++){
    var v=els[i].getAttribute('idserv');
    if(v&&ids.indexOf(v)<0)ids.push(v);
  }
  var tr=[];
  for(var j=0;j<ids.length;j++){
    var el=doc.querySelector('[idserv="'+ids[j]+'"]');
    if(!el)continue;
    var hh=el.innerHTML;
    var lm=hh.match(/(\d{4})\s*-\s*[^&]/);
    if(!lm)continue;
    var sm=hh.match(/Itineraire\?SEMAINE_ID=(\d+)/);
    if(!sm)continue;
    try{
      var ir=await fetch('/Home/Itineraire?SEMAINE_ID='+sm[1],{credentials:'include'});
      var ih=await ir.text();
      var ar=[];
      var re=/([\d:]+)\s*>\s*([^\[<\n]+?)\s*\[([^\]]+)\]/g;
      var m;
      while((m=re.exec(ih))!==null)ar.push({heure:m[1].trim(),nom:m[2].trim(),code:m[3].trim()});
      if(ar.length>=2)tr.push({ligne:lm[1],arrets:ar});
    }catch(e){}
  }
  return tr;
}

document.getElementById('clbtn').onclick=async function(){
  var cs=document.querySelectorAll('#clj input:checked');
  if(!cs.length){ss('Selectionne au moins un jour!');return;}
  var btn=document.getElementById('clbtn');
  btn.disabled=true;
  btn.textContent='En cours...';
  var pl=[];
  for(var i=0;i<cs.length;i++){
    var dt=cs[i].value;
    ss('Jour '+(i+1)+'/'+cs.length+': '+dt);
    lg('>> '+dt);
    try{
      var tr=await gt(dt);
      var hasN=false;
      for(var k=0;k<tr.length;k++){
        var fin=tr[k].arrets[tr[k].arrets.length-1].heure;
        if(hm(fin)>=22*60)hasN=true;
      }
      if(hasN){
        var pt=dt.split('-');
        var d=new Date(parseInt(pt[0]),parseInt(pt[1])-1,parseInt(pt[2]));
        d.setDate(d.getDate()+1);
        var nx=d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
        var tr2=await gt(nx);
        var nt=tr2.filter(function(t){var dv=hm(t.arrets[0].heure);return dv>=0&&dv<=180;});
        if(nt.length){tr=tr.concat(nt);lg('   +'+nt.length+' nuit');}
      }
      pl.push({date:dt,trajets:tr});
      lg('   OK '+tr.length+' trajets');
    }catch(e){
      lg('   ERR: '+e.message);
    }
  }
  if(!pl.length){ss('Aucun trajet!');btn.disabled=false;btn.textContent='Importer';return;}
  ss(pl.length+' jour(s) - envoi...');
  var data=JSON.stringify({planning:pl,ts:Date.now()});
  var w=window.open('https://sarlfmt1-sketch.github.io/parseur/?fso=1','_blank');
  var snd=null,done=false;
  window.addEventListener('message',function(e){
    if(e.data&&e.data.type==='fso_ack'){
      done=true;
      if(snd)clearInterval(snd);
      var oel=document.getElementById('clv');
      if(oel)document.body.removeChild(oel);
    }
  });
  snd=setInterval(function(){
    if(!done)w.postMessage({type:'fso_import',data:data},'https://sarlfmt1-sketch.github.io');
  },500);
  setTimeout(function(){
    if(snd)clearInterval(snd);
    var oel=document.getElementById('clv');
    if(!done&&oel)document.body.removeChild(oel);
  },15000);
};
})();
