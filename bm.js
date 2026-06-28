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
    var hasService=false;
    if(bg&&bg!='rgb(255, 255, 255)'&&bg!=''){
      var rgbM=bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if(rgbM){
        var r=parseInt(rgbM[1]),g=parseInt(rgbM[2]),b=parseInt(rgbM[3]);
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
var premierJour=new Date(annee,mois-1,1).getDay();
var decalage=(premierJour+6)%7;
var html='<table style="border-collapse:collapse;width:100%"><thead><tr>';
var joursLabels=['L','M','M','J','V','S','D'];
joursLabels.forEach(function(l){html+='<th style="text-align:center;font-size:10px;color:#6b7280;padding:2px;width:14.28%">'+l+'</th>';});
html+='</tr></thead><tbody><tr>';
for(var e=0;e<decalage;e++)html+='<td></td>';
var col=decalage;
jours.forEach(function(j){
  var dd=('0'+j.n).slice(-2);
  var dateStr=annee+'-'+mm+'-'+dd;
  var col2=j.past?'#444':j.s?'#00d4ff':'#555';
  var txtCol=j.past?'#666':j.s?'#00d4ff':'#888';
  var checked=j.s&&!j.past?'checked':'';
  var bg=j.s&&!j.past?'rgba(0,212,255,.1)':j.past?'rgba(255,255,255,.02)':'rgba(255,255,255,.03)';
  html+='<td style="padding:2px;text-align:center">'
    +'<label style="display:flex;flex-direction:column;align-items:center;gap:1px;border:1px solid '+col2+';border-radius:5px;padding:4px 2px;cursor:pointer;font-size:10px;color:'+txtCol+';opacity:'+(j.past?'0.5':'1')+';background:'+bg+'">'
    +'<input type=checkbox value="'+dateStr+'" '+checked+' style="accent-color:#00d4ff;margin:0;width:12px;height:12px">'
    +'<span style="font-size:9px;color:#6b7280">'+j.nom+'</span>'
    +'<span style="font-weight:700;font-size:11px">'+dd+'</span>'
    +'</label></td>';
  col++;
  if(col%7===0)html+='</tr><tr>';
});
while(col%7!==0){html+='<td></td>';col++;}
html+='</tr></tbody></table>';
var ov=document.createElement('div');
ov.id='clv';
ov.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.88);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:sans-serif';
ov.innerHTML='<div style="background:#1a1a2e;border:2px solid #00d4ff;border-radius:12px;padding:20px;color:#fff;max-width:460px;width:92%;max-height:90vh;overflow-y:auto">'
  +'<div style="font-size:17px;font-weight:700;color:#00d4ff;margin-bottom:12px">ChronoLigne - '+h4.textContent.trim()+'</div>'
  +'<div id=clj style="margin-bottom:4px">'+html+'</div>'
  +'<div style="display:flex;gap:6px;margin:10px 0">'
  +'<button onclick="document.querySelectorAll(\'#clj input\').forEach(function(c){c.checked=true})" style="background:rgba(0,212,255,.1);border:1px solid #00d4ff;color:#00d4ff;padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px">Tout</button>'
  +'<button onclick="document.querySelectorAll(\'#clj input\').forEach(function(c){c.checked=false})" style="background:rgba(255,255,255,.05);border:1px solid #555;color:#888;padding:5px 10px;border-radius:5px;cursor:pointer;font-size:11px">Aucun</button>'
  +'</div>'
  +'<div style="margin:8px 0;padding:8px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:6px">'
  +'<div style="font-size:11px;color:#9ca3af;margin-bottom:6px">Mode import :</div>'
  +'<div style="display:flex;gap:6px;margin-bottom:6px">'
  +'<label style="flex:1;display:flex;align-items:center;gap:5px;border:1px solid #00d4ff;border-radius:6px;padding:6px 8px;cursor:pointer;background:rgba(0,212,255,.1)"><input type=radio name=clmode value=planning checked style="accent-color:#00d4ff"><span style="font-size:11px;color:#00d4ff"><b>Planning</b><br><span style="font-size:10px;color:#6b7280">Assigner au planning</span></span></label>'
  +'<label style="flex:1;display:flex;align-items:center;gap:5px;border:1px solid #555;border-radius:6px;padding:6px 8px;cursor:pointer;background:rgba(255,255,255,.03)"><input type=radio name=clmode value=base style="accent-color:#f59e0b"><span style="font-size:11px;color:#888"><b>Base seule</b><br><span style="font-size:10px;color:#6b7280">Enrichir sans planning</span></span></label>'
  +'</div>'
  +'<label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:11px;color:#fbbf24"><input type=checkbox id=clEte style="accent-color:#fbbf24"> <span>&#9728;&#65039; <b>Service \xe9t\xe9</b> &mdash; ajouter "E" au num\xe9ro (ex: 106 &rarr; 106E)</span></label>'
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

  // ── DETECTION COUPURE : tous les PS et FS ──
  var tousPS=[], tousFS=[];
  var rePS=/(\d{2}:\d{2})\s*-\s*PS\s*&gt;&gt;/g;
  var reFS=/(\d{2}:\d{2})\*?\s*-\s*FS\s*&gt;&gt;/g;
  var mp, mf;
  while((mp=rePS.exec(h))!==null) tousPS.push(mp[1]);
  while((mf=reFS.exec(h))!==null){
    var fp=mf[1].split(':').map(Number), fm=fp[0]*60+fp[1]+5;
    if(fm>=1440)fm-=1440;
    tousFS.push(('0'+Math.floor(fm/60)).slice(-2)+':'+('0'+(fm%60)).slice(-2));
  }

  var heurePS = tousPS.length>0 ? tousPS[0] : null;
  var heureFS = tousFS.length>0 ? tousFS[tousFS.length-1] : null;
  var estCoupure = tousPS.length>1;
  var heurePS2 = estCoupure ? tousPS[1] : null;
  var heureFS1 = estCoupure && tousFS.length>1 ? tousFS[0] : null;
  var heureFS2 = estCoupure ? heureFS : null;

  var psIdx=h.search(/(\d{2}:\d{2})\s*-\s*PS\s*&gt;&gt;/);
  var hApresPS=psIdx>=0?h.slice(psIdx):h;
  var numSvcPS=null;
  var grpM=hApresPS.match(/Groupage\s*:\s*(\d+)/);
  if(grpM)numSvcPS=grpM[1];
  if(numSvcPS)numSvc=numSvcPS;

  var docApresPS=new DOMParser().parseFromString(hApresPS,'text/html');
  var els=docApresPS.querySelectorAll('[idserv]');
  var ids=[];
  for(var i=0;i<els.length;i++){
    var v=els[i].getAttribute('idserv');
    if(v&&ids.indexOf(v)<0)ids.push(v);
  }
  var tr=[];
  for(var j=0;j<ids.length;j++){
    var el=docApresPS.querySelector('[idserv="'+ids[j]+'"]');
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
  return {
    trajets:tr, numSvc:numSvc,
    heurePS:heurePS, heureFS:heureFS,
    coupure:estCoupure,
    heurePS2:heurePS2, heureFS1:heureFS1, heureFS2:heureFS2
  };
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
        var nxDejaSel=false;
        for(var cs2=document.querySelectorAll('#clj input:checked'),ci=0;ci<cs2.length;ci++){if(cs2[ci].value===nx)nxDejaSel=true;}
        if(!nxDejaSel){
          var res2=await gt(nx);
          var nt=res2.trajets.filter(function(t){var dv=hm(t.arrets[0].heure);return dv>=0&&dv<=180;});
          if(nt.length){tr=tr.concat(nt);lg('   +'+nt.length+' nuit');}
        }else{lg('   nuit ignoree ('+nx+' deja selectionne)');}
      }
      if(numSvc)lg('   N service: '+numSvc);
      if(res.coupure){
        lg('   COUPURE detectee: matin '+res.heurePS+'>'+res.heureFS1+' / aprem '+res.heurePS2+'>'+res.heureFS2);
      } else {
        lg('   PS: '+res.heurePS+' FS: '+(res.heureFS||'?'));
      }
      pl.push({
        date:dt, trajets:tr, numSvc:numSvc,
        heurePS:res.heurePS, heureFS:res.heureFS,
        coupure:res.coupure,
        heurePS2:res.heurePS2, heureFS1:res.heureFS1, heureFS2:res.heureFS2
      });
      lg('   OK '+tr.length+' trajets');
    }catch(e){
      lg('   ERR: '+e.message);
    }
  }
  if(!pl.length){ss('Aucun trajet!');btn.disabled=false;btn.textContent='Importer';return;}
  ss(pl.length+' jour(s) - envoi...');
  var modeEl=document.querySelector('input[name=clmode]:checked');
  var mode=modeEl?modeEl.value:'planning';
  var ete=document.getElementById('clEte')&&document.getElementById('clEte').checked;
  var REPAS_TABLE={
    50:'Repas Unique',63:'Repas Unique',66:'Repas Unique',67:'Repas Unique',69:'Repas Unique',
    70:'Repas Unique',71:'Repas Unique',72:'Repas Unique',74:'Repas Unique',76:'Repas Unique',
    77:'Repas Unique',78:'Repas Unique',79:'Repas Unique',80:'Repas Unique',81:'Repas Unique',
    82:'Repas Unique',83:'Repas Unique',84:'Repas Unique',130:'Repas Unique',131:'Repas Unique',
    132:'Repas Unique',134:'Repas Unique',135:'Repas Unique',136:'Repas Unique',139:'Repas Unique',
    140:'Repas Unique',144:'Repas Unique',145:'Repas Unique',146:'Repas Unique',149:'Repas Unique',
    150:'Repas Unique',151:'Repas Unique',152:'Repas Unique',154:'Repas Unique',155:'Repas Unique',
    156:'Repas Unique',157:'Repas Unique',158:'Repas Unique',159:'Repas Unique',160:'Repas Unique',
    161:'Repas Unique',162:'Repas Unique',163:'Repas Unique',165:'Repas Unique',166:'Repas Unique',
    167:'Repas Unique',168:'Repas Unique',169:'Repas Unique',170:'Repas Unique',171:'Repas Unique',
    172:'Repas Unique',173:'Repas Unique',174:'Repas Unique',175:'Repas Unique',176:'Repas Unique',
    177:'Repas Unique',178:'Repas Unique',179:'Repas Unique',180:'Repas Unique',181:'Repas Unique',
    182:'Repas Unique',183:'Repas Unique',184:'Repas Unique',185:'Repas Unique',186:'Repas Unique',
    1:'Repas Special',2:'Repas Special',3:'Repas Special',4:'Repas Special',5:'Repas Special',
    6:'Repas Special',7:'Repas Special',8:'Repas Special',9:'Repas Special',10:'Repas Special',
    11:'Repas Special',12:'Repas Special',13:'Repas Special',14:'Repas Special',15:'Repas Special',
    16:'Repas Special',17:'Repas Special',18:'Repas Special',19:'Repas Special',20:'Repas Special',
    21:'Repas Special',22:'Repas Special',23:'Repas Special',24:'Repas Special',25:'Repas Special',
    28:'Repas Special',29:'Repas Special',34:'Repas Special',35:'Repas Special',40:'Repas Special',
    46:'Repas Special',48:'Repas Special',49:'Repas Special',51:'Repas Special',52:'Repas Special',
    53:'Repas Special',54:'Repas Special',55:'Repas Special',56:'Repas Special',57:'Repas Special',
    58:'Repas Special',59:'Repas Special',60:'Repas Special',61:'Repas Special',64:'Repas Special',
    65:'Repas Special',68:'Repas Special',73:'Repas Special',85:'Repas Special',86:'Repas Special',
    106:'Repas Special',109:'Repas Special',111:'Repas Special',117:'Repas Special',120:'Repas Special',
    121:'Repas Special',123:'Repas Special',124:'Repas Special',129:'Repas Special',138:'Repas Special',
    141:'Repas Special',143:'Repas Special',147:'Repas Special',164:'Repas Special',
    2013:'Repas Unique',2007:'Repas Unique',2010:'Repas Unique',2014:'Repas Unique',
    2012:'Repas Unique',2011:'Repas Unique',2017:'Repas Unique',2018:'Repas Unique',
    2015:'Repas Unique',2008:'Repas Unique',2019:'Repas Unique',2029:'Repas Unique',
    2030:'Repas Unique',2031:'Repas Unique',2032:'Repas Unique',2034:'Repas Unique',
    2040:'Repas Unique',2035:'Repas Unique',2037:'Repas Unique',2036:'Repas Unique',
    2038:'Repas Unique',2039:'Repas Unique',2043:'Repas Unique',2044:'Repas Unique',
    2041:'Repas Unique',2042:'Repas Unique',
    2003:'Repas Special',2009:'Repas Special',2004:'Repas Special',2005:'Repas Special',
    2028:'Repas Special',2026:'Repas Special',2027:'Repas Special',
    1022:'Repas Unique',1030:'Repas Unique',1031:'Repas Unique',1032:'Repas Unique',
    1033:'Repas Unique',1034:'Repas Unique',1035:'Repas Unique',1036:'Repas Unique',
    1038:'Repas Unique',1039:'Repas Unique',1040:'Repas Unique',1041:'Repas Unique',
    1042:'Repas Unique',1043:'Repas Unique',1044:'Repas Unique',1045:'Repas Unique',
    1046:'Repas Unique',1076:'Repas Unique',1077:'Repas Unique',1079:'Repas Unique',
    1080:'Repas Unique',1082:'Repas Unique',1083:'Repas Unique',1084:'Repas Unique',
    1085:'Repas Unique',1086:'Repas Unique',1087:'Repas Unique',1088:'Repas Unique',
    1089:'Repas Unique',1090:'Repas Unique',1091:'Repas Unique',1092:'Repas Unique',
    1093:'Repas Unique',1094:'Repas Unique',1095:'Repas Unique',1096:'Repas Unique',
    1097:'Repas Unique',1098:'Repas Unique',1099:'Repas Unique',1100:'Repas Unique',
    1101:'Repas Unique',1102:'Repas Unique',1103:'Repas Unique',1104:'Repas Unique',
    1105:'Repas Unique',
    1001:'Repas Special',1002:'Repas Special',1003:'Repas Special',1004:'Repas Special',
    1005:'Repas Special',1011:'Repas Special',1025:'Repas Special',1028:'Repas Special',
    1071:'Repas Special',1074:'Repas Special',1075:'Repas Special',1078:'Repas Special',
    1081:'Repas Special',1106:'Repas Special',1107:'Repas Special',1108:'Repas Special'
  };
  var REPAS_PRIX={'Repas Unique':10,'Repas Special':5};
  for(var pi=0;pi<pl.length;pi++){
    var svc=pl[pi].numSvc?parseInt(pl[pi].numSvc):null;
    if(svc&&REPAS_TABLE[svc]){
      var typeRepas=REPAS_TABLE[svc];
      pl[pi].repas={type:typeRepas,prix:REPAS_PRIX[typeRepas]};
      lg('   Repas: '+typeRepas+' ('+REPAS_PRIX[typeRepas]+'EUR)');
    }else{
      pl[pi].repas=null;
      if(svc)lg('   Repas: service '+svc+' non trouve dans la table');
    }
  }
  var data=JSON.stringify({planning:pl,ts:Date.now(),mode:mode,ete:ete});
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
