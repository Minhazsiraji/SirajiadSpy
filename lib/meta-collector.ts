import type { Ad } from './types';
import { demoAds } from './demo-data';
import {matchesAdQuery} from './search';
export type CollectionResult={ads:Ad[];source:'demo'|'live';notice:string};
export async function collectAds(query:string,country='BD'):Promise<CollectionResult>{
  if(process.env.ENABLE_LIVE_META_COLLECTOR!=='true') return{ads:filterDemo(query,country),source:'demo',notice:'Demo search results — these are examples, not live Meta ads. Use “Open Meta Ad Library” for current competitor evidence.'};
  // Live browser automation is deliberately isolated here. Meta markup and access rules change often;
  // production deployments should use an approved data source or a maintained Browserless worker.
  return{ads:filterDemo(query,country),source:'demo',notice:'Live collection was unavailable, so clearly labeled demo evidence was returned.'};
}
function filterDemo(query:string,country:string){return demoAds.filter(a=>a.country===country&&matchesAdQuery(a,query))}
