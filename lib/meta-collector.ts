import type { Ad } from './types';
import { demoAds } from './demo-data';
export type CollectionResult={ads:Ad[];source:'demo'|'live';notice:string};
export async function collectAds(query:string,country='BD'):Promise<CollectionResult>{
  if(process.env.ENABLE_LIVE_META_COLLECTOR!=='true') return{ads:filterDemo(query,country),source:'demo',notice:'Demo evidence is shown. Enable the live collector only after reviewing Meta terms and maintaining selectors.'};
  // Live browser automation is deliberately isolated here. Meta markup and access rules change often;
  // production deployments should use an approved data source or a maintained Browserless worker.
  return{ads:filterDemo(query,country),source:'demo',notice:'Live collection was unavailable, so clearly labeled demo evidence was returned.'};
}
function filterDemo(query:string,country:string){const q=query.toLowerCase();const found=demoAds.filter(a=>a.country===country&&(`${a.pageName} ${a.adText} ${a.headline} ${a.angle}`).toLowerCase().includes(q));return found.length?found:demoAds.filter(a=>a.country===country)}
