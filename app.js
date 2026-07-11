
const DATA=window.ULM_DATA;

const GLOSSARY_ITEMS=[
 ["ADOT","Average Depth of Target","Average distance downfield of a player's targets."],
 ["BTT","Big-Time Throw","A high-difficulty, high-value throw with excellent placement or timing."],
 ["COMP%","Completion Percentage","Completed passes divided by pass attempts."],
 ["EPA","Expected Points Added","Change in expected points created by a play."],
 ["EPA/DB","EPA per Dropback","Expected Points Added divided by quarterback dropbacks."],
 ["EPA/TGT","EPA per Target","Expected Points Added divided by receiving targets."],
 ["FINC","Forced Incompletion","An incompletion directly caused by the defender."],
 ["INT","Interception","A pass caught by the defense."],
 ["MTF","Missed Tackles Forced","Number of missed tackles created by the ball carrier."],
 ["MT%","Missed Tackle Rate","Missed tackles divided by tackle opportunities."],
 ["PBE","Pass Blocking Efficiency","Weighted pass-protection efficiency using sacks, hits and hurries allowed."],
 ["PBLK","Pass Blocking Grade","PFF grade for pass-blocking performance."],
 ["PBU","Pass Breakup","A defensive play that directly prevents a completion."],
 ["PR%","Pressure Rate","Total pressures divided by pass-rush snaps."],
 ["RBLK","Run Blocking Grade","PFF grade for run-blocking performance."],
 ["RTG","Passer Rating Allowed","Quarterback passer rating when targeting a defender."],
 ["STOP","Defensive Stop","A tackle producing a failed offensive play based on down and distance."],
 ["TGT","Target","A pass directed to a receiver."],
 ["TWP","Turnover-Worthy Play","A play judged to have a realistic chance of becoming a turnover."],
 ["TWP%","Turnover-Worthy Play Rate","Turnover-worthy plays divided by quarterback dropbacks."],
 ["YAC","Yards After Catch","Receiving yards gained after the catch."],
 ["YBC/ATT","Yards Before Contact per Attempt","Average rushing yards gained before first contact."],
 ["YCO/ATT","Yards After Contact per Attempt","Average rushing yards gained after first contact."],
 ["YPA","Yards per Attempt","Passing yards divided by pass attempts."],
 ["YPR","Yards per Reception","Receiving yards divided by receptions."],
 ["YPRR","Yards per Route Run","Receiving yards divided by routes run."]
];

function openGlossary(){
 $("#glossaryShade").classList.add("open");
 $("#glossaryDrawer").classList.add("open");
 renderGlossary("");
 setTimeout(()=>$("#glossarySearch").focus(),50);
}
function closeGlossary(){
 $("#glossaryShade").classList.remove("open");
 $("#glossaryDrawer").classList.remove("open");
}
function renderGlossary(query){
 const q=String(query||"").trim().toLowerCase();
 const rows=GLOSSARY_ITEMS.filter(([abbr,name,definition])=>
  !q || `${abbr} ${name} ${definition}`.toLowerCase().includes(q)
 );
 $("#glossaryList").innerHTML=rows.length
  ?rows.map(([abbr,name,definition])=>`<div class="glossary-item">
    <div class="glossary-term">${state.mode==="coach"?esc(name):esc(abbr)}</div>
    <div class="glossary-full">${state.mode==="coach"?esc(abbr):esc(name)}</div>
    <div class="glossary-definition">${esc(definition)}</div>
   </div>`).join("")
  :'<div class="meta">No glossary terms match that search.</div>';
}

const state={page:"offense",team:"Florida Atlantic",group:"",search:"",sort:"snaps",view:"cards",mode:localStorage.getItem("ulmMode")||"coach"};
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=v=>v==null?"—":Number(v).toFixed(1);
const pct=v=>v==null?"—":Number(v).toFixed(1)+"%";
const initials=n=>n.split(" ").map(x=>x[0]).slice(0,2).join("");
const fullLabels={TWP:"Turnover-Worthy Plays","TWP%":"Turnover-Worthy Play Rate",YPRR:"Yards per Route Run",ADOT:"Average Depth of Target",PBE:"Pass Blocking Efficiency","PR%":"Pressure Rate","MT%":"Missed Tackle Rate",RTG:"Passer Rating Allowed",PBU:"Pass Breakups",BTT:"Big-Time Throws"};
const label=x=>state.mode==="coach"?(fullLabels[x]||x):x;

const routePaths={"Backfield":"M50 102 L50 72 L28 52","Slide":"M50 102 L50 76 Q44 60 25 54","Screen":"M50 102 L50 82 Q55 70 76 72","Flat":"M50 102 L50 72 L18 72","Slant":"M50 102 L50 76 L82 50","In":"M50 102 L50 48 L82 48","Basic":"M50 102 L50 50 L78 50","Dig":"M50 102 L50 38 L84 38","Speed Out":"M50 102 L50 58 Q60 54 84 54","Out":"M50 102 L50 50 L16 50","Deep Out":"M50 102 L50 30 L16 30","Comeback":"M50 102 L50 26 Q50 18 42 34","Hitch":"M50 102 L50 46 Q50 35 42 46","Curl":"M50 102 L50 34 Q50 22 38 38","Sit":"M50 102 L50 55","Drag":"M50 102 L50 80 Q52 66 85 66","Crosser":"M50 102 L50 78 Q62 58 88 46","Over":"M50 102 L50 62 Q58 42 88 42","Corner":"M50 102 L50 52 L82 22","Post":"M50 102 L50 52 L72 22","Go":"M50 102 L50 14","Double Move":"M50 102 L50 68 L64 56 L50 46 L72 16","Jet":"M50 102 Q34 88 18 84","Ghost":"M50 102 Q66 88 82 84","Wheel":"M50 102 Q22 82 24 54 Q26 26 50 14","Block & Go":"M50 102 L50 82 L40 76 L50 70 L50 14"};
function routeSVG(name){const d=routePaths[name]||"M50 102 L50 60 L76 30";return `<svg viewBox="0 0 100 115"><line x1="10" y1="106" x2="90" y2="106" stroke="#999" stroke-width="2"/><circle class="route-start" cx="50" cy="102" r="5"/><path class="route-line" d="${d}"/></svg>`}
function photo(p,cls="photo"){const src=(p.photoCandidates&&p.photoCandidates[0])||p.photo||"";return `<div class="${cls}"><img src="${src}" alt="${esc(p.name)}" onerror="this.remove();this.parentElement.insertAdjacentHTML('afterbegin','<div class=initials>${initials(p.name)}</div>')"><div class="jersey">${p.number}</div></div>`}
function metric(k,v){return `<div class="metric"><div class="metric-label">${label(k)}</div><div class="metric-value">${v}</div></div>`}
function stat(k,v){return `<div class="stat"><div class="stat-label">${label(k)}</div><div class="stat-value">${v}</div></div>`}

function enter(page){state.page=page;$("#landing").classList.add("hidden");$("#shell").classList.remove("hidden");render()}
function home(){$("#shell").classList.add("hidden");$("#landing").classList.remove("hidden");closeDrawer();closeCompare()}
function filtered(){
 let rows=DATA.players.filter(p=>p.team===state.team && p.side===state.page);
 const q=state.search.toLowerCase().trim();
 if(q)rows=rows.filter(p=>[p.name,p.rosterPos,p.pffPos,p.hometown,p.previous].join(" ").toLowerCase().includes(q));
 if(state.group)rows=rows.filter(p=>p.group===state.group);
 rows.sort((a,b)=>(b[state.sort]??-999)-(a[state.sort]??-999));
 return rows;
}
function groups(){const vals=[...new Set(DATA.players.filter(p=>p.team===state.team&&p.side===state.page).map(p=>p.group).filter(Boolean))].sort();$("#group").innerHTML='<option value="">All groups</option>'+vals.map(v=>`<option>${v}</option>`).join("")}
function summary(rows){
 const off=state.page==="offense";
 const vals=off?[["Players",rows.length],["Off Snaps",rows.reduce((a,p)=>a+(p.snaps||0),0)],["Total Yards",rows.reduce((a,p)=>a+(p.totalYards||0),0)],["Targets",rows.reduce((a,p)=>a+(p.targets||0),0)],["TD",rows.reduce((a,p)=>a+(p.passTD||0)+(p.rushTD||0)+(p.recTD||0),0)],["Pressures Allowed",rows.reduce((a,p)=>a+(p.pressuresAllowed||0),0)]]:[["Players",rows.length],["Def Snaps",rows.reduce((a,p)=>a+(p.snaps||0),0)],["Tackles",rows.reduce((a,p)=>a+(p.tackles||0),0)],["Stops",rows.reduce((a,p)=>a+(p.totalStops||0),0)],["Pressures",rows.reduce((a,p)=>a+(p.pressures||0),0)],["PBU + INT",rows.reduce((a,p)=>a+(p.pbu||0)+(p.ints||0),0)]];
 $("#summary").innerHTML=vals.map(([k,v])=>`<div class="summary-card"><div class="summary-label">${k}</div><div class="summary-value">${v}</div></div>`).join("");
}
function aiSummary(p){
 const s=[];
 if(p.side==="offense"){
  if(p.rosterPos==="QB"){if((p.twpRate||0)>=4)s.push("Turnover-risk profile requires attention.");if((p.btt||0)>=15)s.push("Creates explosive throws.");if((p.scrambles||0)>=20)s.push("Adds a scramble component.");}
  else if(p.rosterPos==="OL"){if((p.pressuresAllowed||0)<=10&&(p.pbSnaps||0)>=250)s.push("Reliable pass protection.");if((p.runBlockGrade||0)>(p.passBlockGrade||0)+8)s.push("Run blocking is stronger than pass protection.");}
  else{if((p.targetShare||0)>=20)s.push("High-share receiving option.");if((p.yprr||0)>=2)s.push("Efficient per route.");if((p.deepTargets||0)>=10)s.push("Vertical target role.");if((p.yacPerRec||0)>=6)s.push("Creates after the catch.");}
 }else{
  if(["CB","S"].includes(p.pffPos)){if((p.ratingAllowed||999)<75)s.push("Strong passer-rating-allowed profile.");if((p.missPct||0)>=15)s.push("Tackling concern.");}
  else if(p.pffPos==="LB"){if((p.totalStops||0)>=30)s.push("Productive stop player.");if((p.coverageGrade||0)<55)s.push("Coverage is a stress point.");}
  else{if((p.pressureRate||0)>=12)s.push("Strong pressure rate.");if((p.runGrade||0)>=70)s.push("Positive run-defense profile.");}
 }
 return (s.length?s:["Requires additional film and sample context."]).slice(0,3).join(" ");
}
function cardMetrics(p){
 if(p.side==="offense"){
  if(p.rosterPos==="QB")return metric("Pass Yds",p.passYards||0)+metric("Pass TD",p.passTD||0)+metric("TWP",p.twp||0)+metric("TWP%",p.twpRate==null?"—":p.twpRate+"%");
  if(p.rosterPos==="OL")return metric("Snaps",p.snaps||0)+metric("PBLK",fmt(p.passBlockGrade))+metric("RBLK",fmt(p.runBlockGrade))+metric("PR Allowed",p.pressuresAllowed||0);
  if(p.rosterPos==="RB")return metric("Touches",p.touches||0)+metric("Rush Yds",p.rushYards||0)+metric("Rec Yds",p.recYards||0)+metric("TD",(p.rushTD||0)+(p.recTD||0));
  return metric("Targets",p.targets||0)+metric("Rec",p.receptions||0)+metric("Rec Yds",p.recYards||0)+metric("YPRR",fmt(p.yprr));
 }
 if(["CB","S"].includes(p.pffPos))return metric("Targets",p.coverageTargets||0)+metric("PBU",p.pbu||0)+metric("INT",p.ints||0)+metric("RTG",fmt(p.ratingAllowed));
 if(p.pffPos==="LB")return metric("Tackles",p.tackles||0)+metric("Stops",p.totalStops||0)+metric("MT%",p.missPct==null?"—":p.missPct+"%")+metric("COV",fmt(p.coverageGrade));
 return metric("Pressures",p.pressures||0)+metric("Sacks",p.sacks||0)+metric("PR%",p.pressureRate==null?"—":p.pressureRate+"%")+metric("RUND",fmt(p.runGrade));
}
function renderCards(rows){
 $("#cards").innerHTML=rows.map(p=>`<article class="card" data-id="${p.id}"><div class="card-top">${photo(p)}<div class="card-info"><div class="card-name">${esc(p.name)}</div><div class="card-pos">${esc(p.rosterPos||p.pffPos)} · PFF ${esc(p.pffPos||"")}</div><div class="meta">${esc(p.height||"")} · ${p.weight||""} lbs · ${esc(p.classYear||"")}</div><div class="meta">${esc(p.hometown||"")}</div><div class="meta">${p.previous?"Previous: "+esc(p.previous):""}</div><div class="meta">${p.snaps||0} snaps · <span class="sample">${p.sample||"—"}</span></div></div></div><div class="metric-grid">${cardMetrics(p)}</div><div class="card-summary">${aiSummary(p)}</div><div class="card-actions"><button class="compare-btn" data-compare="${p.id}">Compare</button><button class="open-btn" data-open="${p.id}">Open Profile</button></div></article>`).join("");
 document.querySelectorAll(".card").forEach(card=>card.addEventListener("click",e=>{if(e.target.closest("button"))return;openPlayer(Number(card.dataset.id))}));
 document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();openPlayer(Number(b.dataset.open))}));
 document.querySelectorAll("[data-compare]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();openCompare(Number(b.dataset.compare))}));
}
function renderTable(rows){
 $("#tableWrap").innerHTML=`<table><thead><tr><th>Player</th><th>Pos</th><th>Snaps</th><th>Grade</th>${state.page==="offense"?"<th>Total Yds</th><th>Targets</th><th>TWP</th><th>PR Allowed</th>":"<th>Tackles</th><th>Stops</th><th>Pressures</th><th>RTG</th>"}</tr></thead><tbody>${rows.map(p=>`<tr data-row="${p.id}"><td>${esc(p.name)}</td><td>${esc(p.rosterPos||p.pffPos)}</td><td>${p.snaps||0}</td><td>${fmt(p.overallGrade)}</td>${state.page==="offense"?`<td>${p.totalYards||0}</td><td>${p.targets||0}</td><td>${p.twp||0}</td><td>${p.pressuresAllowed||0}</td>`:`<td>${p.tackles||0}</td><td>${p.totalStops||0}</td><td>${p.pressures||0}</td><td>${fmt(p.ratingAllowed)}</td>`}</tr>`).join("")}</tbody></table>`;
 document.querySelectorAll("[data-row]").forEach(r=>r.addEventListener("click",()=>openPlayer(Number(r.dataset.row))));
}
function render(){
 $("#brandSub").textContent=state.mode==="coach"?"Version 5.2 Mobile · Coach Mode uses full football language":"Version 5.2 Mobile · Analyst Mode uses compact metric abbreviations";
 $("#modeBtn").textContent=state.mode==="coach"?"Coach Mode":"Analyst Mode";
 document.querySelectorAll("[data-nav]").forEach(b=>b.classList.toggle("active",b.dataset.nav===state.page));
 groups();
 const rows=filtered();summary(rows);
 $("#title").textContent=state.page==="offense"?"Offensive Personnel":"Defensive Personnel";
 $("#subtitle").textContent="Click any card to open the full scouting profile.";
 $("#cards").classList.toggle("hidden",state.view==="table");
 $("#tableWrap").classList.toggle("active",state.view==="table");
 if(state.view==="cards")renderCards(rows);else renderTable(rows);
}
function setView(v){state.view=v;document.querySelectorAll("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===v));render()}
function closeDrawer(){
 $("#shade").classList.remove("open");
 $("#drawer").classList.remove("open");
 document.body.style.overflow="";
}
function closeCompare(){
 $("#compareShade").classList.remove("open");
 $("#compareModal").classList.remove("open");
 document.body.style.overflow="";
}
function tab(id,labelText,content,active=false){return {button:`<button class="tab ${active?"active":""}" data-tab="${id}">${labelText}</button>`,panel:`<section class="panel ${active?"active":""}" id="${id}">${content}</section>`}}
function routePanel(p){
 const run=p.routeTree?Object.entries(p.routeTree).filter(([,c])=>c>0).sort((a,b)=>b[1]-a[1]).slice(0,5):[];
 const trg=p.targetedRouteTree?Object.entries(p.targetedRouteTree).filter(([,c])=>c>0).sort((a,b)=>b[1]-a[1]).slice(0,5):[];
 const cards=(arr,total,unit)=>arr.length?`<div class="route-grid">${arr.map(([n,c],i)=>`<div class="route-card"><div class="route-rank">${i+1}</div>${routeSVG(n)}<div class="route-name">${n}</div><div class="route-share">${c} ${unit} · ${(c/Math.max(total,1)*100).toFixed(1)}%</div></div>`).join("")}</div>`:`<div class="meta">No route sample.</div>`;
 return `<div class="route-wrap"><div class="route-title">Route Profile</div><div class="route-sub">Routes run and exact targeted routes.</div><div class="route-mode"><button class="active" data-rmode="run">Routes Run</button><button data-rmode="target">Targeted Routes</button></div><div class="route-run">${cards(run,p.routes||0,"routes")}</div><div class="route-target hidden">${cards(trg,p.targetedRouteTotal||0,"targets")}</div></div>`;
}
function weekNum(w){const m=String(w||"").match(/\d+/);return m?Number(m[0]):0}
function topGames(games,type){
 const rows=[...(games||[])];
 if(type==="passing"){
  return rows.sort((a,b)=>(b.yards||0)-(a.yards||0)).slice(0,3);
 }
 if(type==="rushing"){
  return rows.sort((a,b)=>(b.yards||0)-(a.yards||0)).slice(0,3);
 }
 return rows.sort((a,b)=>(b.yards||0)-(a.yards||0)).slice(0,3);
}
function trend(games,key="yards"){
 const rows=[...(games||[])].sort((a,b)=>weekNum(a.week)-weekNum(b.week));
 if(!rows.length)return "";
 const vals=rows.map(r=>Number(r[key]||0));
 const max=Math.max(...vals,1),min=Math.min(...vals,0);
 const W=760,H=220,padL=34,padR=24,padTop=20,padBottom=64;
 const range=Math.max(max-min,1);
 const usableW=W-padL-padR,usableH=H-padTop-padBottom;
 const pts=vals.map((v,i)=>[
   padL+usableW*(i/Math.max(rows.length-1,1)),
   padTop+usableH-(usableH*((v-min)/range))
 ]);
 return `<svg class="trend-svg" viewBox="0 0 ${W} ${H}">
   <line class="trend-axis" x1="${padL}" y1="${padTop+usableH}" x2="${W-padR}" y2="${padTop+usableH}"/>
   <polyline class="trend-line" points="${pts.map(p=>p.join(",")).join(" ")}"/>
   ${pts.map((p,i)=>`
     <circle class="trend-dot" cx="${p[0]}" cy="${p[1]}" r="4">
       <title>${rows[i].week} ${rows[i].opp}: ${vals[i]}</title>
     </circle>
     <text x="${p[0]}" y="${padTop+usableH+20}" text-anchor="middle" font-size="9" fill="#667085">${esc(rows[i].week)}</text>
     <text x="${p[0]}" y="${padTop+usableH+35}" text-anchor="middle" font-size="8" fill="#98a2b3">${esc(rows[i].opp)}</text>
   `).join("")}
 </svg>`;
}


function topImpactGames(games,type){
 const rows=[...(games||[])];
 const score=g=>{
  if(type==="passing") return (g.yards||0)+25*(g.td||0)-20*(g.ints||0)+2*(g.firstDowns||0);
  if(type==="rushing") return (g.yards||0)+20*(g.td||0)+2*(g.firstDowns||0)+2*(g.mtf||0);
  return (g.yards||0)+20*(g.td||0)+2*(g.firstDowns||0);
 };
 return rows.sort((a,b)=>score(b)-score(a)).slice(0,3);
}
function impactTable(games,type){
 const rows=topImpactGames(games,type);
 if(!rows.length)return "";
 const headers=type==="passing"
  ?["Week","Opp","Yds","TD","INT","1D","Grade"]
  :type==="rushing"
  ?["Week","Opp","Yds","TD","1D","MTF","Grade"]
  :["Week","Opp","Yds","TD","1D","YAC","Grade"];
 const body=rows.map(g=>{
  if(type==="passing")return `<tr><td>${g.week}</td><td>${g.opp}</td><td>${g.yards}</td><td>${g.td}</td><td>${g.ints}</td><td>${g.firstDowns}</td><td>${fmt(g.grade)}</td></tr>`;
  if(type==="rushing")return `<tr><td>${g.week}</td><td>${g.opp}</td><td>${g.yards}</td><td>${g.td}</td><td>${g.firstDowns}</td><td>${g.mtf}</td><td>${fmt(g.grade)}</td></tr>`;
  return `<tr><td>${g.week}</td><td>${g.opp}</td><td>${g.yards}</td><td>${g.td}</td><td>${g.firstDowns}</td><td>${g.yac}</td><td>${fmt(g.grade)}</td></tr>`;
 }).join("");
 return `<div class="section-head" style="margin-top:16px"><div><div class="section-title" style="font-size:16px">Top 3 Impact Games</div><div class="section-sub">Composite impact ranking using yardage, touchdowns and first downs.</div></div></div><table class="game-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table>`;
}

function gamePanel(p,type){
 const games=type==="passing"?p.passingGames:type==="rushing"?p.rushingGames:p.receivingGames;
 if(!games||!games.length)return `<div class="meta">No game log.</div>`;
 const top=topGames(games,type);
 const headers=type==="passing"
  ?["Week","Opp","Comp/Att","Yds","TD","INT","TWP","Grade"]
  :type==="rushing"
  ?["Week","Opp","Att","Yds","YPC","TD","MTF","Grade"]
  :["Week","Opp","TGT","REC","Yds","TD","YAC","Grade"];
 const body=top.map(g=>{
  if(type==="passing")return `<tr><td>${g.week}</td><td>${g.opp}</td><td>${g.completions}/${g.attempts}</td><td>${g.yards}</td><td>${g.td}</td><td>${g.ints}</td><td>${g.twp}</td><td>${fmt(g.grade)}</td></tr>`;
  if(type==="rushing")return `<tr><td>${g.week}</td><td>${g.opp}</td><td>${g.attempts}</td><td>${g.yards}</td><td>${fmt(g.ypc)}</td><td>${g.td}</td><td>${g.mtf}</td><td>${fmt(g.grade)}</td></tr>`;
  return `<tr><td>${g.week}</td><td>${g.opp}</td><td>${g.targets}</td><td>${g.receptions}</td><td>${g.yards}</td><td>${g.td}</td><td>${g.yac}</td><td>${fmt(g.grade)}</td></tr>`;
 }).join("");
 return `<div class="section-head" style="margin-top:0"><div><div class="section-title" style="font-size:16px">Top 3 Yardage Games</div><div class="section-sub">Ranked strictly by yards to match the weekly yardage chart.</div></div></div><table class="game-table"><thead><tr>${headers.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table><div class="trend-card">${trend(games)}</div>${impactTable(games,type)}`;
}





function normalizeRouteName(name){
 const raw=String(name||"").trim().toUpperCase()
  .replace(/\s+/g," ")
  .replace(/_/g," ")
  .replace(/\(.*?\)/g,"")
  .trim();

 const aliases={
  "VERT":"GO","VERTICAL":"GO","9":"GO","9 ROUTE":"GO",
  "NUMBERS GO":"NUMBERS GO","OUTSIDE GO":"NUMBERS GO","BOUNDARY GO":"NUMBERS GO",
  "FADE":"FADE","SIDELINE FADE":"FADE",
  "SEAM":"SEAM","HASH GO":"SEAM","INSIDE GO":"SEAM",
  "SKINNY POST":"SKINNY POST","GLANCE":"SKINNY POST",
  "POST":"POST",
  "CORNER":"CORNER","FLAG":"CORNER",
  "SAIL":"SAIL",
  "OUT":"OUT","SPEED OUT":"OUT",
  "DEEP OUT":"DEEP OUT",
  "IN":"IN","BASIC":"IN",
  "DIG":"DIG",
  "SLANT":"SLANT",
  "HITCH":"HITCH","STOP":"HITCH",
  "CURL":"CURL",
  "COMEBACK":"COMEBACK",
  "FLAT":"FLAT",
  "SHALLOW":"SHALLOW","SHALLOW CROSS":"SHALLOW",
  "CROSS":"CROSSER","CROSSING":"CROSSER","CROSSER":"CROSSER",
  "OVER":"OVER",
  "SCREEN":"SCREEN","WR SCREEN":"WR SCREEN","BUBBLE":"WR SCREEN",
  "WHEEL":"WHEEL",
  "ANGLE":"ANGLE","TEXAS":"ANGLE",
  "PIVOT":"PIVOT","PIVOT/CIRCLE":"PIVOT","WHIP":"PIVOT",
  "FLARE":"FLARE","SWING":"FLARE",
  "BACKFIELD":"BACKFIELD",
  "SLIDE":"SLIDE",
  "DOUBLE MOVE":"DOUBLE MOVE","SLUGGO":"DOUBLE MOVE",
  "CHOICE":"CHOICE","OPTION":"CHOICE"
 };
 return aliases[raw]||raw;
}

const ROUTE_DICTIONARY={
 "GO":{
  label:"Go",
  path:"M300 460 L300 75",
  end:[300,75],
  description:"Straight vertical release with no inside break."
 },
 "NUMBERS GO":{
  label:"Numbers Go",
  path:"M300 460 L250 420 L250 70",
  end:[250,70],
  description:"Vertical route released outside toward the numbers, staying on a true vertical track."
 },
 "FADE":{
  label:"Fade",
  path:"M300 460 Q235 405 225 315 Q215 185 235 75",
  end:[235,75],
  description:"Outside-release vertical route tracking toward the sideline."
 },
 "SEAM":{
  label:"Seam",
  path:"M300 460 L340 420 L340 70",
  end:[340,70],
  description:"Inside vertical route through the seam."
 },
 "POST":{
  label:"Post",
  path:"M300 460 L300 245 L430 105",
  end:[430,105],
  description:"Vertical stem followed by a clear inside break toward the goalpost."
 },
 "SKINNY POST":{
  label:"Skinny Post",
  path:"M300 460 L300 225 L365 95",
  end:[365,95],
  description:"Vertical stem with a tighter inside post angle."
 },
 "CORNER":{
  label:"Corner",
  path:"M300 460 L300 245 L170 105",
  end:[170,105],
  description:"Vertical stem followed by an outside break toward the corner."
 },
 "SAIL":{
  label:"Sail",
  path:"M300 460 L300 250 Q260 210 165 165",
  end:[165,165],
  description:"Intermediate-to-deep outside-breaking route with a rounded sail path."
 },
 "OUT":{
  label:"Out",
  path:"M300 460 L300 305 L125 305",
  end:[125,305],
  description:"Vertical stem with a 90-degree outside break."
 },
 "DEEP OUT":{
  label:"Deep Out",
  path:"M300 460 L300 220 L120 220",
  end:[120,220],
  description:"Deeper vertical stem with a 90-degree outside break."
 },
 "IN":{
  label:"In",
  path:"M300 460 L300 305 L475 305",
  end:[475,305],
  description:"Vertical stem with a 90-degree inside break."
 },
 "DIG":{
  label:"Dig",
  path:"M300 460 L300 220 L480 220",
  end:[480,220],
  description:"Deep inside-breaking route with a vertical stem."
 },
 "SLANT":{
  label:"Slant",
  path:"M300 460 L300 385 L450 275",
  end:[450,275],
  description:"Quick inside-breaking route."
 },
 "HITCH":{
  label:"Hitch",
  path:"M300 460 L300 305 Q300 278 270 305",
  end:[270,305],
  description:"Vertical stem with a short stop back toward the quarterback."
 },
 "CURL":{
  label:"Curl",
  path:"M300 460 L300 255 Q300 220 260 265",
  end:[260,265],
  description:"Intermediate vertical stem curling back inside."
 },
 "COMEBACK":{
  label:"Comeback",
  path:"M300 460 L300 205 Q300 175 245 235",
  end:[245,235],
  description:"Deep vertical stem breaking back outside toward the sideline."
 },
 "FLAT":{
  label:"Flat",
  path:"M300 460 L300 400 L120 400",
  end:[120,400],
  description:"Quick outside route to the flat."
 },
 "SHALLOW":{
  label:"Shallow",
  path:"M300 460 L300 405 Q365 360 510 365",
  end:[510,365],
  description:"Low crossing route across the formation."
 },
 "CROSSER":{
  label:"Crosser",
  path:"M300 460 L300 370 Q365 305 510 280",
  end:[510,280],
  description:"Intermediate crossing route."
 },
 "OVER":{
  label:"Over",
  path:"M300 460 L300 340 Q365 245 510 235",
  end:[510,235],
  description:"Deep crossing route over the second level."
 },
 "SCREEN":{
  label:"Screen",
  path:"M300 460 L300 420 Q250 400 165 405",
  end:[165,405],
  description:"Delayed short route into screen space."
 },
 "WR SCREEN":{
  label:"WR Screen",
  path:"M300 460 L300 430 L145 430",
  end:[145,430],
  description:"Immediate receiver screen path."
 },
 "WHEEL":{
  label:"Wheel",
  path:"M300 460 Q215 410 215 320 Q215 185 285 80",
  end:[285,80],
  description:"Outside arc turning up the sideline."
 },
 "ANGLE":{
  label:"Angle",
  path:"M300 460 L220 400 L390 285",
  end:[390,285],
  description:"Backfield route breaking outside before angling sharply inside."
 },
 "PIVOT":{
  label:"Pivot",
  path:"M300 460 L300 355 Q370 305 400 345 Q365 390 310 360",
  end:[310,360],
  description:"Inside break followed by a pivot back outside."
 },
 "FLARE":{
  label:"Flare",
  path:"M300 460 Q230 425 145 395",
  end:[145,395],
  description:"Backfield release widening quickly to the flat."
 },
 "BACKFIELD":{
  label:"Backfield",
  path:"M300 460 L300 425 L210 395",
  end:[210,395],
  description:"Short backfield release."
 },
 "SLIDE":{
  label:"Slide",
  path:"M300 460 L300 425 Q245 395 175 395",
  end:[175,395],
  description:"Backfield slide route across the formation."
 },
 "DOUBLE MOVE":{
  label:"Double Move",
  path:"M300 460 L300 330 L345 300 L300 270 L390 85",
  end:[390,85],
  description:"Two-break route designed to sell the first break before going vertical."
 },
 "CHOICE":{
  label:"Choice",
  path:"M300 460 L300 300",
  end:[300,300],
  description:"Option route whose final break depends on leverage."
 }
};

function routeDefinition(name){
 const key=normalizeRouteName(name);
 return ROUTE_DICTIONARY[key]||{
  label:String(name||"Route"),
  path:"M300 460 L300 300 L420 220",
  end:[420,220],
  description:"Route drawing unavailable for this PFF label."
 };
}
function routeShape(name){return routeDefinition(name).path}
function routeEndPoint(name){return routeDefinition(name).end}
function routeDisplayName(name){return routeDefinition(name).label}
function routeDescription(name){return routeDefinition(name).description}

function enhancedRouteDashboard(splitRows,modeLabel){
 const defaultRows=((splitRows&&splitRows.All)||[])
  .filter(r=>String(r.route||"").trim().toLowerCase()!=="unknown")
  .slice(0,5);
 if(!defaultRows.length)return `<div class="meta">No route sample matched this player.</div>`;

 const first=defaultRows[0];
 const maxTargets=Math.max(...defaultRows.map(r=>r.targets||0),1);

 const svg=defaultRows.map((r,i)=>{
  const width=2+5*((r.targets||0)/maxTargets);
  const [endX,endY]=routeEndPoint(r.route);
  return `<g data-route-index="${i}">
    <path class="route-tree-path ${i===0?"selected":""}" d="${routeShape(r.route)}" stroke-width="${width}"></path>
    <circle class="route-tree-index" cx="${endX}" cy="${endY}" r="11"></circle>
    <text class="route-tree-index-text" x="${endX}" y="${endY+3}" text-anchor="middle">${i+1}</text>
    <path class="route-tree-hit" d="${routeShape(r.route)}" stroke-width="24"></path>
  </g>`;
 }).join("");

 const detail=`<div class="route-detail-name">${esc(routeDisplayName(first.route))}</div>
  <div class="route-detail-meta">${first.targets} ${modeLabel} · ${pct(first.targetShare)}</div><div class="route-definition">${esc(routeDescription(first.route))}</div>
  <div class="route-detail-grid">
   <div class="route-detail-stat"><small>Comp %</small><span>${pct(first.completionPct)}</span></div>
   <div class="route-detail-stat"><small>Yards</small><span>${Math.round(first.yards||0)}</span></div>
   <div class="route-detail-stat"><small>Y/TGT</small><span>${fmt(first.yardsPerTarget)}</span></div>
   <div class="route-detail-stat"><small>EPA/TGT</small><span>${fmt(first.epaPerTarget)}</span></div>
   <div class="route-detail-stat"><small>TD</small><span>${first.td||0}</span></div>
   <div class="route-detail-stat"><small>INT</small><span>${first.ints||0}</span></div>
   <div class="route-detail-stat"><small>Explosive %</small><span>${pct(first.explosivePct)}</span></div>
   <div class="route-detail-stat"><small>First Downs</small><span>${first.firstDowns||0}</span></div>
  </div>`;

 const legend=`<div class="route-legend">${defaultRows.map((r,i)=>`
   <div class="route-legend-item ${i===0?"active":""}" data-route-legend="${i}">
    <div><span class="route-legend-rank">${i+1}</span><span class="route-legend-name">${esc(routeDisplayName(r.route))}</span></div>
    <div class="route-legend-meta">${r.targets} targets · ${pct(r.targetShare)} · ${fmt(r.yardsPerTarget)} Y/TGT</div>
   </div>`).join("")}</div>`;

 const table=`<div class="route-table-wrap"><table class="route-table">
  <thead><tr><th>Route</th><th>TGT</th><th>TGT %</th><th>Comp %</th><th>Yds</th><th>Y/TGT</th><th>TD</th><th>INT</th><th>EPA/TGT</th><th>Explosive %</th></tr></thead>
  <tbody>${defaultRows.map(r=>`<tr><td>${esc(routeDisplayName(r.route))}</td><td>${r.targets}</td><td>${pct(r.targetShare)}</td><td>${pct(r.completionPct)}</td><td>${Math.round(r.yards||0)}</td><td>${fmt(r.yardsPerTarget)}</td><td>${r.td||0}</td><td>${r.ints||0}</td><td>${fmt(r.epaPerTarget)}</td><td>${pct(r.explosivePct)}</td></tr>`).join("")}</tbody>
 </table></div>`;

 return `<div class="route-dashboard" data-route-splits='${JSON.stringify(splitRows).replace(/'/g,"&#39;")}'>
  <div class="route-toolbar">
   <div class="route-toolbar-left">
    <button class="route-filter active" data-route-filter="All">All</button>
    <button class="route-filter" data-route-filter="Man">vs Man</button>
    <button class="route-filter" data-route-filter="Zone">vs Zone</button>
   </div>
   <div class="route-toolbar-right">
    <button class="route-view-toggle active" data-route-view="usage">Usage</button>
    <button class="route-view-toggle" data-route-view="efficiency">Efficiency</button>
   </div>
  </div>
  <div class="route-stage">
   <div>
    <div class="route-tree-panel">
     <svg class="route-tree-svg" viewBox="0 0 600 520">
      <line x1="80" y1="470" x2="520" y2="470" stroke="#b8c1cc" stroke-width="2"/>
      <circle cx="300" cy="460" r="8" fill="#111"/>
      <g data-route-svg>${svg}</g>
     </svg>
    </div>
    <div data-route-legend>${legend}</div>
   </div>
   <div class="route-detail-panel" data-route-detail>${detail}</div>
  </div>
  <div data-route-table>${table}</div>
 </div>`;
}

function bindEnhancedRouteDashboard(root=document){
 root.querySelectorAll(".route-dashboard").forEach(dash=>{
  const splitRows=JSON.parse(dash.dataset.routeSplits.replace(/&#39;/g,"'"));
  let currentFilter="All";
  let currentView="usage";

  function detailHtml(r){
   return `<div class="route-detail-name">${esc(routeDisplayName(r.route))}</div>
    <div class="route-detail-meta">${r.targets} targets · ${pct(r.targetShare)}</div><div class="route-definition">${esc(routeDescription(r.route))}</div>
    <div class="route-detail-grid">
     <div class="route-detail-stat"><small>Comp %</small><span>${pct(r.completionPct)}</span></div>
     <div class="route-detail-stat"><small>Yards</small><span>${Math.round(r.yards||0)}</span></div>
     <div class="route-detail-stat"><small>Y/TGT</small><span>${fmt(r.yardsPerTarget)}</span></div>
     <div class="route-detail-stat"><small>EPA/TGT</small><span>${fmt(r.epaPerTarget)}</span></div>
     <div class="route-detail-stat"><small>TD</small><span>${r.td||0}</span></div>
     <div class="route-detail-stat"><small>INT</small><span>${r.ints||0}</span></div>
     <div class="route-detail-stat"><small>Explosive %</small><span>${pct(r.explosivePct)}</span></div>
     <div class="route-detail-stat"><small>First Downs</small><span>${r.firstDowns||0}</span></div>
    </div>`;
  }

  function rebuild(){
   const rows=((splitRows[currentFilter]||[])
    .filter(r=>String(r.route||"").trim().toLowerCase()!=="unknown"))
    .slice(0,5);

   const svgRoot=dash.querySelector("[data-route-svg]");
   const legendRoot=dash.querySelector("[data-route-legend]");
   const detail=dash.querySelector("[data-route-detail]");
   const table=dash.querySelector("[data-route-table]");

   if(!rows.length){
    svgRoot.innerHTML="";
    legendRoot.innerHTML="";
    detail.innerHTML='<div class="route-empty">No qualifying routes for this filter.</div>';
    table.innerHTML="";
    return;
   }

   const maxUsage=Math.max(...rows.map(r=>r.targets||0),1);
   const maxEff=Math.max(...rows.map(r=>Math.abs(r.epaPerTarget||0)),1);

   svgRoot.innerHTML=rows.map((r,i)=>{
    const value=currentView==="efficiency"?Math.abs(r.epaPerTarget||0):(r.targets||0);
    const max=currentView==="efficiency"?maxEff:maxUsage;
    const width=2+5*(value/max);
    const [endX,endY]=routeEndPoint(r.route);
    return `<g data-route-index="${i}">
      <path class="route-tree-path ${i===0?"selected":""}" d="${routeShape(r.route)}" stroke-width="${width}"></path>
      <circle class="route-tree-index" cx="${endX}" cy="${endY}" r="11"></circle>
      <text class="route-tree-index-text" x="${endX}" y="${endY+3}" text-anchor="middle">${i+1}</text>
      <path class="route-tree-hit" d="${routeShape(r.route)}" stroke-width="24"></path>
    </g>`;
   }).join("");

   legendRoot.innerHTML=`<div class="route-legend">${rows.map((r,i)=>`
    <div class="route-legend-item ${i===0?"active":""}" data-route-legend="${i}">
     <div><span class="route-legend-rank">${i+1}</span><span class="route-legend-name">${esc(routeDisplayName(r.route))}</span></div>
     <div class="route-legend-meta">${r.targets} targets · ${pct(r.targetShare)} · ${fmt(r.yardsPerTarget)} Y/TGT</div>
    </div>`).join("")}</div>`;

   detail.innerHTML=detailHtml(rows[0]);

   table.innerHTML=`<div class="route-table-wrap"><table class="route-table">
    <thead><tr><th>Route</th><th>TGT</th><th>TGT %</th><th>Comp %</th><th>Yds</th><th>Y/TGT</th><th>TD</th><th>INT</th><th>EPA/TGT</th><th>Explosive %</th></tr></thead>
    <tbody>${rows.map(r=>`<tr><td>${esc(routeDisplayName(r.route))}</td><td>${r.targets}</td><td>${pct(r.targetShare)}</td><td>${pct(r.completionPct)}</td><td>${Math.round(r.yards||0)}</td><td>${fmt(r.yardsPerTarget)}</td><td>${r.td||0}</td><td>${r.ints||0}</td><td>${fmt(r.epaPerTarget)}</td><td>${pct(r.explosivePct)}</td></tr>`).join("")}</tbody>
   </table></div>`;

   function selectRoute(index){
    svgRoot.querySelectorAll(".route-tree-path").forEach(x=>x.classList.remove("selected"));
    const group=svgRoot.querySelector(`[data-route-index="${index}"]`);
    if(group)group.querySelector(".route-tree-path").classList.add("selected");
    legendRoot.querySelectorAll(".route-legend-item").forEach(x=>x.classList.remove("active"));
    const legend=legendRoot.querySelector(`[data-route-legend="${index}"]`);
    if(legend)legend.classList.add("active");
    detail.innerHTML=detailHtml(rows[index]);
   }

   svgRoot.querySelectorAll("[data-route-index]").forEach(g=>g.addEventListener("click",()=>{
    selectRoute(Number(g.dataset.routeIndex));
   }));
   legendRoot.querySelectorAll("[data-route-legend]").forEach(item=>item.addEventListener("click",()=>{
    selectRoute(Number(item.dataset.routeLegend));
   }));
  }

  dash.querySelectorAll("[data-route-filter]").forEach(btn=>btn.addEventListener("click",()=>{
   dash.querySelectorAll("[data-route-filter]").forEach(x=>x.classList.remove("active"));
   btn.classList.add("active");
   currentFilter=btn.dataset.routeFilter;
   rebuild();
  }));

  dash.querySelectorAll("[data-route-view]").forEach(btn=>btn.addEventListener("click",()=>{
   dash.querySelectorAll("[data-route-view]").forEach(x=>x.classList.remove("active"));
   btn.classList.add("active");
   currentView=btn.dataset.routeView;
   rebuild();
  }));

  rebuild();
 });
}

function qbRoutesThrownPanel(p){
 const splits=p.qbRouteSplits||{};
 if(!splits.All||!splits.All.length)return `<div class="meta">No route-thrown sample matched this quarterback.</div>`;
 return enhancedRouteDashboard(splits,"targets");
}

function qbConnectionsPanel(p){
 const rows=p.qbReceiverConnections||[];
 if(!rows.length)return `<div class="meta">No quarterback-receiver connection sample matched this player.</div>`;
 const top=rows.slice(0,10);
 return `<div>
   <div class="section-head" style="margin-top:0">
    <div>
     <div class="section-title" style="font-size:18px">Favorite Receiver Connections</div>
     <div class="section-sub">Ranked by target volume from the play-level feed.</div>
    </div>
   </div>
   <div class="coverage-grid">${top.slice(0,5).map((r,i)=>`<div class="coverage-card">
     <div class="route-rank">${i+1}</div>
     <div class="card-name" style="margin-top:18px">${esc(r.receiver)}</div>
     <div class="meta">${r.targets} targets · ${pct(r.targetShare)} of QB targets</div>
     <div class="coverage-metrics">
      <div class="coverage-metric"><small>Comp %</small><span>${pct(r.completionPct)}</span></div>
      <div class="coverage-metric"><small>Yards</small><span>${Math.round(r.yards)}</span></div>
      <div class="coverage-metric"><small>Y/TGT</small><span>${fmt(r.yardsPerTarget)}</span></div>
      <div class="coverage-metric"><small>EPA/TGT</small><span>${fmt(r.epaPerTarget)}</span></div>
      <div class="coverage-metric"><small>TD</small><span>${r.td}</span></div>
      <div class="coverage-metric"><small>Explosives</small><span>${r.explosives}</span></div>
     </div>
    </div>`).join("")}</div>
   <div style="overflow:auto;margin-top:12px">
    <table class="game-table">
     <thead><tr>
      <th>Receiver</th><th>TGT</th><th>Share</th><th>Comp</th>
      <th>Comp %</th><th>Yds</th><th>Y/TGT</th><th>TD</th>
      <th>1D</th><th>EPA/TGT</th>
     </tr></thead>
     <tbody>${top.map(r=>`<tr>
      <td>${esc(r.receiver)}</td><td>${r.targets}</td><td>${pct(r.targetShare)}</td>
      <td>${r.completions}</td><td>${pct(r.completionPct)}</td>
      <td>${Math.round(r.yards)}</td><td>${fmt(r.yardsPerTarget)}</td>
      <td>${r.td}</td><td>${r.firstDowns}</td><td>${fmt(r.epaPerTarget)}</td>
     </tr>`).join("")}</tbody>
    </table>
   </div>
  </div>`;
}

function qbCoveragePanel(p){
 const rows=p.qbCoverageProduction||[];
 if(!rows.length)return `<div class="meta">No quarterback coverage split matched this player.</div>`;
 return `<div class="coverage-grid">${rows.map(c=>`<div class="coverage-card">
   <div class="card-name">${esc(c.coverage)}</div>
   <div class="meta">${c.dropbacks} dropbacks · ${c.attempts} attempts</div>
   <div class="coverage-metrics">
    <div class="coverage-metric"><small>Comp %</small><span>${pct(c.completionPct)}</span></div>
    <div class="coverage-metric"><small>Yards</small><span>${Math.round(c.yards)}</span></div>
    <div class="coverage-metric"><small>YPA</small><span>${fmt(c.yardsPerAttempt)}</span></div>
    <div class="coverage-metric"><small>EPA/DB</small><span>${fmt(c.epaPerDropback)}</span></div>
    <div class="coverage-metric"><small>TD</small><span>${c.td}</span></div>
    <div class="coverage-metric"><small>INT</small><span>${c.ints}</span></div>
    <div class="coverage-metric"><small>Sacks</small><span>${c.sacks}</span></div>
    <div class="coverage-metric"><small>Comp</small><span>${c.completions}/${c.attempts}</span></div>
   </div>
  </div>`).join("")}</div>
  <div class="meta" style="margin-top:10px">Exact play-level passing results grouped by PFF basic coverage family.</div>`;
}

function qbManZonePanel(p){
 const rows=p.qbManZoneProduction||[];
 if(!rows.length)return `<div class="meta">No quarterback man/zone split matched this player.</div>`;
 return `<div class="coverage-grid">${rows.map(c=>`<div class="coverage-card">
   <div class="card-name">${esc(c.coverage)}</div>
   <div class="meta">${c.dropbacks} dropbacks · ${c.attempts} attempts</div>
   <div class="coverage-metrics">
    <div class="coverage-metric"><small>Comp %</small><span>${pct(c.completionPct)}</span></div>
    <div class="coverage-metric"><small>Yards</small><span>${Math.round(c.yards)}</span></div>
    <div class="coverage-metric"><small>YPA</small><span>${fmt(c.yardsPerAttempt)}</span></div>
    <div class="coverage-metric"><small>EPA/DB</small><span>${fmt(c.epaPerDropback)}</span></div>
    <div class="coverage-metric"><small>TD</small><span>${c.td}</span></div>
    <div class="coverage-metric"><small>INT</small><span>${c.ints}</span></div>
   </div>
  </div>`).join("")}</div>
  <div class="meta" style="margin-top:10px">Man = Cover 0, Cover 1 and 2-Man. Zone = Cover 2, 3, 4 and 6 families.</div>`;
}

function receiverManZonePanel(p){
 const rows=p.receiverManZoneProduction||[];
 if(!rows.length)return `<div class="meta">No receiver man/zone split matched this player.</div>`;
 return `<div class="coverage-grid">${rows.map(c=>`<div class="coverage-card">
   <div class="card-name">${esc(c.coverage)}</div>
   <div class="meta">${c.targets} targets · ${c.receptions} receptions</div>
   <div class="coverage-metrics">
    <div class="coverage-metric"><small>Catch %</small><span>${pct(c.catchPct)}</span></div>
    <div class="coverage-metric"><small>Yards</small><span>${Math.round(c.yards)}</span></div>
    <div class="coverage-metric"><small>Y/TGT</small><span>${fmt(c.yardsPerTarget)}</span></div>
    <div class="coverage-metric"><small>EPA/TGT</small><span>${fmt(c.epaPerTarget)}</span></div>
    <div class="coverage-metric"><small>TD</small><span>${c.td}</span></div>
    <div class="coverage-metric"><small>First Downs</small><span>${c.firstDowns}</span></div>
   </div>
  </div>`).join("")}</div>
  <div class="meta" style="margin-top:10px">Man = Cover 0, Cover 1 and 2-Man. Zone = Cover 2, 3, 4 and 6 families.</div>`;
}

function coveragePanel(p){const rows=p.coverageProduction||[];if(!rows.length)return `<div class="meta">No play-level coverage sample.</div>`;return `<div class="coverage-grid">${rows.slice(0,6).map(c=>`<div class="coverage-card"><div class="card-name">${esc(c.coverage)}</div><div class="meta">${c.targets} targets · ${c.receptions} receptions</div><div class="coverage-metrics"><div class="coverage-metric"><small>Yards</small><span>${Math.round(c.yards)}</span></div><div class="coverage-metric"><small>Y/TGT</small><span>${fmt(c.yardsPerTarget)}</span></div><div class="coverage-metric"><small>Catch %</small><span>${pct(c.catchPct)}</span></div><div class="coverage-metric"><small>EPA/TGT</small><span>${fmt(c.epaPerTarget)}</span></div></div></div>`).join("")}</div>`}
function openPlayer(id){
 const p=DATA.players.find(x=>x.id===id);if(!p)return;
 $("#drawerTitle").textContent=p.name;
 const tabs=[],panels=[];
 const add=(x)=>{tabs.push(x.button);panels.push(x.panel)};
 add(tab("overview","Overview",`<div class="stats">${stat("Snaps",p.snaps||0)}${stat("Overall Grade",fmt(p.overallGrade))}${stat("Sample",p.sample||"—")}${stat("Position",p.rosterPos||p.pffPos)}</div>`,true));
 if(p.side==="offense"){
  add(tab("passing","Passing",`<div class="stats">${stat("Dropbacks",p.dropbacks||0)}${stat("Attempts",p.passAtt||0)}${stat("Completions",p.completions||0)}${stat("Comp %",p.compPct==null?"—":p.compPct+"%")}${stat("Pass Yards",p.passYards||0)}${stat("YPA",fmt(p.passYPA))}${stat("Pass TD",p.passTD||0)}${stat("INT",p.ints||0)}${stat("TWP",p.twp||0)}${stat("TWP%",p.twpRate==null?"—":p.twpRate+"%")}${stat("BTT",p.btt||0)}${stat("Avg TTT",fmt(p.avgTTT))}</div>`));
  add(tab("receiving","Receiving",`<div class="stats">${stat("Targets",p.targets||0)}${stat("Receptions",p.receptions||0)}${stat("Rec Yards",p.recYards||0)}${stat("YPR",fmt(p.ypr))}${stat("Rec TD",p.recTD||0)}${stat("Drops",p.drops||0)}${stat("YAC",p.yac||0)}${stat("YPRR",fmt(p.yprr))}${stat("ADOT",fmt(p.adot))}${stat("RZ Targets",p.rzTargets||0)}${stat("Deep Targets",p.deepTargets||0)}</div>`));
  add(tab("rushing","Rushing",`<div class="stats">${stat("Attempts",p.rushAtt||0)}${stat("Rush Yards",p.rushYards||0)}${stat("YPC",fmt(p.ypc))}${stat("Rush TD",p.rushTD||0)}${stat("Rush 1D",p.rush1D||0)}${stat("Forced Missed",p.mtfRun||0)}${stat("YBC/Att",fmt(p.ybcAtt))}${stat("YCO/Att",fmt(p.ycoAtt))}</div>`));
  add(tab("blocking","Blocking",`<div class="stats">${stat("PBLK Snaps",p.pbSnaps||0)}${stat("PBLK Grade",fmt(p.passBlockGrade))}${stat("RBLK Grade",fmt(p.runBlockGrade))}${stat("Sacks Allowed",p.sacksAllowed||0)}${stat("Hits Allowed",p.hitsAllowed||0)}${stat("Hurries Allowed",p.hurriesAllowed||0)}${stat("Pressures Allowed",p.pressuresAllowed||0)}${stat("PBE",fmt(p.pbe))}</div>`));
  add(tab("routes","Routes",routePanel(p)));
  if(p.rosterPos==="QB"){
   add(tab("games","Top 3 Games",gamePanel(p,"passing")));
   add(tab("qbRoutes","Routes Thrown",qbRoutesThrownPanel(p)));
   add(tab("qbConnections","Favorite Targets",qbConnectionsPanel(p)));
   add(tab("qbcoverage","Vs Coverage",qbCoveragePanel(p)));
   add(tab("qbmanzone","Man / Zone",qbManZonePanel(p)));
  }
  if(["WR","TE"].includes(p.rosterPos))add(tab("games","Top 3 Games",gamePanel(p,"receiving")));
  if(p.rosterPos==="RB")add(tab("games","Top 3 Games",gamePanel(p,"rushing")));
  if(["WR","RB","TE"].includes(p.rosterPos)){
   add(tab("coverage","Vs Coverage",coveragePanel(p)));
   add(tab("manzone","Man / Zone",receiverManZonePanel(p)));
  }
 }else{
  add(tab("tackling","Tackling",`<div class="stats">${stat("Tackles",p.tackles||0)}${stat("Assists",p.assists||0)}${stat("Missed",p.missed||0)}${stat("MT%",p.missPct==null?"—":p.missPct+"%")}${stat("Run Stops",p.runStops||0)}${stat("Pass Stops",p.passStops||0)}</div>`));
  add(tab("rush","Pass Rush",`<div class="stats">${stat("Rush Snaps",p.rushSnaps||0)}${stat("Sacks",p.sacks||0)}${stat("Hits",p.hits||0)}${stat("Hurries",p.hurries||0)}${stat("Pressures",p.pressures||0)}${stat("PR%",p.pressureRate==null?"—":p.pressureRate+"%")}</div>`));
  add(tab("coverage","Coverage",`<div class="stats">${stat("Coverage Snaps",p.coverageSnaps||0)}${stat("Targets",p.coverageTargets||0)}${stat("Receptions",p.receptions||0)}${stat("Comp %",p.completionPct==null?"—":p.completionPct+"%")}${stat("Yards",p.coverageYards||0)}${stat("RTG",fmt(p.ratingAllowed))}${stat("PBU",p.pbu||0)}${stat("INT",p.ints||0)}</div>`));
 }
 const key=`notes_${p.teamCode}_${p.side}_${p.id}`;
 add(tab("notes","Coach Notes",`<textarea class="notes" id="notesBox">${esc(localStorage.getItem(key)||"")}</textarea>`));
 $("#drawerBody").innerHTML=`<div class="profile-hero">${photo(p,"photo")}<div class="profile-info"><div class="profile-name">${esc(p.name)}</div><div class="profile-pos">${esc(p.rosterPos||p.pffPos)} · PFF ${esc(p.pffPos||"")}</div><div class="meta">${esc(p.height||"")} · ${p.weight||""} lbs · ${esc(p.classYear||"")}<br>${esc(p.hometown||"")}<br>${p.previous?"Previous: "+esc(p.previous):""}</div><a class="bio-link" href="${p.bio||p.profile||"#"}" target="_blank">Official Roster Bio</a><div class="ai-box"><div class="ai-label">Automated Summary</div><div class="ai-summary">${aiSummary(p)}</div></div><div style="margin-top:10px"><button class="compare-run" id="profileCompare">Compare This Player</button></div></div></div><div class="tabs">${tabs.join("")}</div>${panels.join("")}`;
 document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");
 $("#"+b.dataset.tab).classList.add("active");
 b.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})}));
 bindEnhancedRouteDashboard($("#drawerBody"));
 document.querySelectorAll("[data-rmode]").forEach(b=>b.addEventListener("click",()=>{const w=b.closest(".route-wrap");w.querySelectorAll("[data-rmode]").forEach(x=>x.classList.remove("active"));b.classList.add("active");const target=b.dataset.rmode==="target";w.querySelector(".route-run").classList.toggle("hidden",target);w.querySelector(".route-target").classList.toggle("hidden",!target)}));
 $("#profileCompare").addEventListener("click",()=>openCompare(p.id));
 const n=$("#notesBox");if(n){let t;n.addEventListener("input",()=>{clearTimeout(t);t=setTimeout(()=>localStorage.setItem(key,n.value),250)})}
 $("#shade").classList.add("open");
 $("#drawer").classList.add("open");
 document.body.style.overflow="hidden";
 $("#drawer").scrollTop=0;
}
function openCompare(firstId=null){
 const first=DATA.players.find(p=>p.id===firstId);const side=first?first.side:state.page;const opts=DATA.players.filter(p=>p.team===state.team&&p.side===side);
 $("#compareBody").innerHTML=`<div class="compare-selects"><select id="compareA"><option value="">Choose first player...</option>${opts.map(p=>`<option value="${p.id}" ${p.id===firstId?"selected":""}>${esc(p.name)} · ${esc(p.rosterPos||p.pffPos)}</option>`).join("")}</select><select id="compareB"><option value="">Choose second player...</option>${opts.filter(p=>p.id!==firstId).map(p=>`<option value="${p.id}">${esc(p.name)} · ${esc(p.rosterPos||p.pffPos)}</option>`).join("")}</select><button class="compare-run" id="runCompare">Run Comparison</button></div><div id="compareResults"></div>`;
 $("#runCompare").addEventListener("click",()=>{const a=DATA.players.find(p=>p.id===Number($("#compareA").value)),b=DATA.players.find(p=>p.id===Number($("#compareB").value));if(!a||!b)return;$("#compareResults").innerHTML=`<div class="compare-grid">${[a,b].map(p=>`<div class="compare-player"><div class="card-name">${esc(p.name)}</div><div class="meta">${esc(p.rosterPos||p.pffPos)} · ${p.snaps||0} snaps</div><div class="stats" style="margin-top:10px">${cardMetrics(p).replaceAll("metric","stat").replaceAll("metric-label","stat-label").replaceAll("metric-value","stat-value")}</div><div class="ai-box"><div class="ai-summary">${aiSummary(p)}</div></div></div>`).join("")}</div>`});
 $("#compareShade").classList.add("open");
 $("#compareModal").classList.add("open");
 document.body.style.overflow="hidden";
}
function ask(){
 const q=$("#search").value.trim().toLowerCase();if(!q)return;
 let rows=DATA.players.filter(p=>p.team===state.team);let text="Players ranked by snap volume.";
 if(q.includes("tackle")){rows=rows.filter(p=>p.side==="defense").sort((a,b)=>(b.missPct||0)-(a.missPct||0));text="Defenders ranked by highest missed-tackle rate."}
 else if(q.includes("pressure")){rows=rows.filter(p=>p.side==="defense").sort((a,b)=>(b.pressureRate||0)-(a.pressureRate||0));text="Defenders ranked by pressure rate."}
 else if(q.includes("twp")||q.includes("turnover")){rows=rows.filter(p=>p.rosterPos==="QB").sort((a,b)=>(b.twpRate||0)-(a.twpRate||0));text="Quarterbacks ranked by turnover-worthy play rate."}
 else if(q.includes("route")){rows=rows.filter(p=>p.side==="offense").sort((a,b)=>(b.routes||0)-(a.routes||0));text="Skill players ranked by route volume."}
 $("#answer").classList.add("open");$("#answer").innerHTML=`<div class="answer-title">Ask ULM Analytics</div><div class="answer-text">${text}</div><div class="answer-list">${rows.slice(0,5).map(p=>`<button data-answer="${p.id}">${esc(p.name)}</button>`).join("")}</div>`;
 document.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>openPlayer(Number(b.dataset.answer))));
}

document.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll("[data-entry]").forEach(b=>b.addEventListener("click",()=>enter(b.dataset.entry)));
 document.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",()=>b.dataset.nav==="home"?home():(state.page=b.dataset.nav,render())));
 $("#modeBtn").addEventListener("click",()=>{
  state.mode=state.mode==="coach"?"analyst":"coach";
  localStorage.setItem("ulmMode",state.mode);
  render();
  if($("#glossaryDrawer").classList.contains("open"))renderGlossary($("#glossarySearch").value);
 });
 $("#glossaryBtn").addEventListener("click",openGlossary);
 $("#glossaryClose").addEventListener("click",closeGlossary);
 $("#glossaryShade").addEventListener("click",closeGlossary);
 $("#glossarySearch").addEventListener("input",e=>renderGlossary(e.target.value));
 $("#search").addEventListener("input",e=>state.search=e.target.value);
 $("#team").addEventListener("change",e=>{state.team=e.target.value;render()});
 $("#group").addEventListener("change",e=>{state.group=e.target.value;render()});
 $("#sort").addEventListener("change",e=>{state.sort=e.target.value;render()});
 $("#ask").addEventListener("click",ask);
 document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
 $("#shade").addEventListener("click",closeDrawer);$("#drawerClose").addEventListener("click",closeDrawer);
 $("#compareShade").addEventListener("click",closeCompare);$("#compareClose").addEventListener("click",closeCompare);
});
