const ULM_PLATFORM={
  supabaseUrl:"https://hzrosmevuejjlxigdxmg.supabase.co",
  supabaseKey:"sb_publishable_FtmUeN1QkLlkRIqCIdQ5gw_KDbEFy1H",
  storageKey:"ulm-current-opponent-v2",
  fallbackOpponents:[
    {slug:"florida-atlantic",name:"Florida Atlantic",code:"FAU",published:true},
    {slug:"uab",name:"UAB",code:"UAB",published:true},
    {slug:"mississippi-state",name:"Mississippi State",code:"MSST",published:false}
  ]
};
function platformStoredOpponent(){try{return JSON.parse(localStorage.getItem(ULM_PLATFORM.storageKey)||"null")}catch{return null}}
function platformSetOpponent(team){localStorage.setItem(ULM_PLATFORM.storageKey,JSON.stringify(team));window.dispatchEvent(new CustomEvent("ulm:opponent-change",{detail:team}))}
async function platformGetOpponents(){
  if(!window.supabase)return ULM_PLATFORM.fallbackOpponents;
  try{
    const sb=supabase.createClient(ULM_PLATFORM.supabaseUrl,ULM_PLATFORM.supabaseKey);
    const {data,error}=await sb.from("teams").select("id,slug,name,code,published").eq("is_opponent",true).order("name");
    if(error||!data?.length)return ULM_PLATFORM.fallbackOpponents;
    return data;
  }catch{return ULM_PLATFORM.fallbackOpponents}
}
async function platformCurrentOpponent(){
  const teams=await platformGetOpponents();
  const stored=platformStoredOpponent();
  return teams.find(t=>t.id&&stored?.id===t.id)||teams.find(t=>stored?.slug===t.slug)||teams[0];
}
function platformSelectHtml(teams,current){return `<label for="fiOpponent">Opponent</label><select id="fiOpponent">${teams.map(t=>`<option value="${t.slug}" ${t.slug===current.slug?"selected":""}>${t.name}</option>`).join("")}</select>`}
async function platformBindOpponent(selectHost,onChange){
  const teams=await platformGetOpponents(),current=await platformCurrentOpponent();
  selectHost.innerHTML=platformSelectHtml(teams,current);
  const sel=selectHost.querySelector("select");
  sel.addEventListener("change",()=>{const team=teams.find(t=>t.slug===sel.value);platformSetOpponent(team);if(onChange)onChange(team)});
  return {teams,current};
}
