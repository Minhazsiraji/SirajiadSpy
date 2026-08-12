import type{Ad}from'./types';import{calculateSignalScore}from'./signal-score';import{deleteIncompleteAds,saveAds}from'./repository';
export type CollectionResult={ads:Ad[];source:'live';notice:string};
type RawAd={id:string;pageName:string;adText:string;headline:string;cta:string;creativeType:string;thumbnailUrl:string;landingUrl:string;sourceUrl:string;started:string};
export async function collectAds(query:string,country='BD'):Promise<CollectionResult>{
 if(process.env.ENABLE_LIVE_META_COLLECTOR!=='true')throw new Error('Live collector is disabled');
 const token=process.env.BROWSERLESS_TOKEN;if(!token)throw new Error('BROWSERLESS_TOKEN is missing');
 const target=`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${country}&q=${encodeURIComponent(query)}&search_type=keyword_unordered&media_type=all`;
 const code=`export default async({page,context})=>{
  await page.setViewport({width:1440,height:1000});
  await page.goto(context.url,{waitUntil:'domcontentloaded',timeout:90000});
  await new Promise(r=>setTimeout(r,12000));
  for(let i=0;i<5;i++){await page.evaluate(()=>window.scrollBy(0,Math.max(innerHeight,900)));await new Promise(r=>setTimeout(r,1800))}
  const ads=await page.evaluate(()=>{
   const idPattern=/Library ID:\\s*(\\d+)/i;
   const markers=[...document.querySelectorAll('div')].filter(el=>idPattern.test(el.innerText||'')&&(el.innerText||'').trim().length<160);
   const official=[...document.querySelectorAll('[data-testid="ad-library-card"]')];
   const roots=official.length?official:markers.map(marker=>{let best=marker,current=marker;for(let i=0;i<10&&current.parentElement;i++){current=current.parentElement;const text=(current.innerText||'').trim(),ids=text.match(/Library ID:\\s*\\d+/gi)||[];if(ids.length===1&&text.length<=8000)best=current;if(text.length>8000||ids.length>1)break}return best});
   const seen=new Set();return roots.map(card=>{
    const text=(card.innerText||'').trim(),id=(text.match(idPattern)||[])[1];if(!id||seen.has(id))return null;seen.add(id);
    const lines=text.split('\\n').map(x=>x.trim()).filter(Boolean);
    const links=[...card.querySelectorAll('a')].map(a=>({text:(a.textContent||'').trim(),href:a.href||''}));
    const pageLink=links.find(a=>a.text.length>1&&a.text.length<100&&/facebook\\.com/.test(a.href)&&!/ads\\/library|policies|privacy|help/.test(a.href));
    const media=[...card.querySelectorAll('img')].map(img=>({url:img.currentSrc||img.src||'',area:(img.naturalWidth||img.width)*(img.naturalHeight||img.height)})).filter(x=>x.url&&!/emoji|profile|scontent.*_s/.test(x.url)).sort((a,b)=>b.area-a.area)[0];
    const video=card.querySelector('video'),started=(text.match(/Started running on\\s+([^\\n]+)/i)||[])[1]||'';
    const system=/^(Library ID:|Started running on|Active|Sponsored|See ad details|See summary details|Platforms|Multiple versions|This ad has multiple versions|EU transparency)/i;
    const content=lines.filter(x=>!system.test(x)&&x!==pageLink?.text&&x.length>2);
    const cta=['Shop Now','Learn More','Send message','Order Now','Sign Up','Get Offer'].find(x=>lines.some(l=>l.toLowerCase()===x.toLowerCase()))||'Learn More';
    const destination=links.find(a=>a.href&&!/facebook\\.com|instagram\\.com/.test(a.href));
    return{id,pageName:pageLink?.text||content[0]||'Unknown advertiser',adText:content.slice(1).join('\\n').slice(0,3000)||content.join('\\n').slice(0,3000),headline:(content.find(x=>x.length>=12&&x.length<=180)||pageLink?.text||'Active Meta ad').slice(0,180),cta,creativeType:video?'VIDEO':'IMAGE',thumbnailUrl:(video&&video.poster)||media?.url||'',landingUrl:destination?.href||'',sourceUrl:'https://www.facebook.com/ads/library/?id='+id,started};
   }).filter(Boolean)
  });return{data:ads,type:'application/json'}
 }`;
 const response=await fetch(`https://production-sfo.browserless.io/function?token=${encodeURIComponent(token)}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code,context:{url:target}}),signal:AbortSignal.timeout(115000)});
 if(!response.ok){const detail=(await response.text()).slice(0,700);throw new Error(`Browserless returned ${response.status}: ${detail}`)}
 const payload=await response.json()as{data?:unknown};const raw=(payload.data||payload)as RawAd[];
 if(!Array.isArray(raw)||!raw.length)throw new Error('Meta returned no complete ad cards. Try a broader keyword.');
 const complete=raw.filter(r=>!/^\d+ ads? use this creative/i.test(r.pageName)&&r.adText.replace(/Library ID:\s*\d+/gi,'').trim().length>50&&(r.pageName!=='Unknown advertiser'||Boolean(r.thumbnailUrl)));
 if(!complete.length)throw new Error('Meta exposed only Library IDs. The collector refused to save incomplete records; retry shortly or connect a Browserless profile.');
 const now=Date.now(),ads=complete.map((r,index)=>{const started=Date.parse(r.started||''),daysActive=Number.isFinite(started)?Math.max(1,Math.floor((now-started)/86400000)):1;const ad:Ad={id:`meta-${r.id||index}`,pageName:r.pageName||'Unknown advertiser',adText:r.adText||'',headline:r.headline||'Active Meta ad',cta:r.cta||'',creativeType:r.creativeType==='VIDEO'?'VIDEO':'IMAGE',thumbnailUrl:r.thumbnailUrl||'',landingUrl:r.landingUrl||undefined,country,daysActive,signalScore:0,firstSeenAt:Number.isFinite(started)?new Date(started).toISOString():new Date().toISOString(),sourceUrl:r.sourceUrl,angle:'Pending AI analysis',hook:r.headline||'Active Meta ad',verified:true};ad.signalScore=calculateSignalScore(ad);return ad});
 await deleteIncompleteAds();const saved=await saveAds(ads);return{ads:saved,source:'live',notice:`${saved.length} complete live Meta ads collected and saved.`};
}
