(async function(){
if(!location.href.includes('abcplanning-fso.lacroixsavac.fr')){alert('Va sur abcplanning dabord!');return;}
var h4=document.querySelector('h4');
if(!h4){alert('Va sur la page ChoixDate!');return;}
var mn={'janvier':1,'fevrier':2,'mars':3,'avril':4,'mai':5,'juin':6,'juillet':7,'aout':8,'septembre':9,'octobre':10,'novembre':11,'decembre':12};
var p=h4.textContent.trim().toLowerCase().replace(/[\xe9\xe8]/g,'e').replace(/\xfb/g,'u').split(' ');
var mois=mn[p[0]]||1,annee=parseInt(p[1]);
var jours_noms=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
var days=document.querySelectorAll('.ui-datebox-griddate.ui-btn');
var jours=[];
var today=new Date();
today.setHours(0,0,0,0);
for(var i=0;i<days.length;i++){
  var n=parseInt(days[i].textContent.trim());
  if(!isNaN(n)&&n>0){
    var bg=days[i].style.backgroundColor;
    // Seulement les jours avec service coloré (bleu clair = Régulier)
    // Exclure gris (absence/repos) et blanc (pas de service)
    var hasService=false;
    if(bg&&bg!='rgb(255, 255, 255)'&&bg!=''){
      // Exclure les gris : rgb(128,128,128), rgb(211,211,211), rgb(169,169,169) etc.
      var rgbM=bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if(rgbM){
        var r=parseInt(rgbM[1]),g=parseInt(rgbM[2]),b=parseInt(rgbM[3]);
        // Si les 3 canaux sont proches = gris => pas de service
        var isGrey=Math.abs(r-g)<20&&Math.abs(g-b)<20&&Math.abs(r-b)<20;
        if(!isGrey)hasService=true;
      }
    }
    var dateJour=new Date(annee,mois-1,n);
    var isPast=dateJour<today;
    var nomJour=jours_noms[dateJour.getDay()];
    jours.push({n:n,s:hasService,past:isPast,nom:nomJour});
  }
}
var mm=('0'+mois).slice(-2);
var html=jours.map(function(j){
  var dd=('0'+j.n).slice(-2);
  var dateStr=annee+'-'+mm+'-'+dd;
  var col=j.past?(j.s?'#b45309':'#444'):j.s?'#00d4ff':'#555';
  var txtCol=j.past?(j.s?'#fbbf24':'#666'):j.s?'#00d4ff':'#888';
  var accentCol=j.past?'#fbbf24':'#00d4ff';
  var checked=j.s&&!j.past?'checked':'';
  return '<label style="display:inline-flex;align-items:center;gap:3px;margin:3px;border:1px solid '+col+';border-radius:5px;padding:5px 8px;cursor:pointer;font-size:11px;color:'+txtCol+';opacity:'+(j.past&&!j.s?'0.35':'1')+'"><input type=checkbox value="'+dateStr+'" '+checked+' style="accent-color:'+accentCol+'"> <span><b>'+j.nom+'</b> '+dd+'/'+mm+(j.past?' ↩':'')+'</span></label>';
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
  +'<button onclick="(function(){document.querySelectorAll(\'#clj input\').forEach(function(c){c.checked=false});document.querySelectorAll(\'#clj label\').forEach(function(l){var sp=l.querySelector(\'span\');var cb=l.querySelector(\'input\');if(sp&&cb&&sp.textContent.indexOf(\' \u21a9\')>=0&&l.style.opacity!==\'0.35\')cb.checked=true})})()" style="background:rgba(251,191,36,.1);border:1px solid #b45309;color:#fbbf24;padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px">\u21a9 Pass\u00e9s</button>'
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

  // Extraire numero de service (Groupage)
  var numSvc=null;
  var bTags=doc.querySelectorAll('b');
  for(var bi=0;bi<bTags.length;bi++){
    if(bTags[bi].textContent.includes('Groupage')){
      var gTxt=bTags[bi].parentElement.textContent;
      var gm=gTxt.match(/Groupage\s*:\s*(\d+)/);
      if(gm)numSvc=gm[1];
      break;
    }
  }

  // Extraire PS et FS depuis les titres des collapsibles
  var heurePS=null, heureFS=null;
  var allEls=doc.querySelectorAll('[idserv]');
  for(var pi=0;pi<allEls.length;pi++){
    var pH=allEls[pi].innerHTML;
    // PS : heure dans le titre "HH:MM - PS >>"
    if(!heurePS){var psM=pH.match(/([\d]{2}:[\d]{2})\s*-\s*PS\s*>>/);if(psM)heurePS=psM[1];}
    // FS : heure dans le titre "HH:MM - FS >>" + 5 minutes
    if(!heureFS){var fsM=pH.match(/([\d]{2}:[\d]{2})\s*-\s*FS\s*>>/);if(fsM){
      var fp=fsM[1].split(':').map(Number);
      var fm=fp[0]*60+fp[1]+5;
      if(fm>=1440)fm-=1440;
      heureFS=('0'+Math.floor(fm/60)).slice(-2)+':'+('0'+(fm%60)).slice(-2);
    }}
  }

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
  return {trajets:tr, numSvc:numSvc, heurePS:heurePS, heureFS:heureFS};
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
      var res=await gt(dt);
      var tr=res.trajets;
      var numSvc=res.numSvc;
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
        var res2=await gt(nx);
        var nt=res2.trajets.filter(function(t){var dv=hm(t.arrets[0].heure);return dv>=0&&dv<=180;});
        if(nt.length){tr=tr.concat(nt);lg('   +'+nt.length+' nuit');}
      }
      if(numSvc)lg('   N service: '+numSvc);
      if(res.heurePS)lg('   PS: '+res.heurePS+' FS: '+(res.heureFS||'?'));
      pl.push({date:dt,trajets:tr,numSvc:numSvc,heurePS:res.heurePS,heureFS:res.heureFS});
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
