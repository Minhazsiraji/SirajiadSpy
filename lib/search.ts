import type{Ad}from'./types';
export function matchesAdQuery(ad:Ad,query:string){const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);if(!words.length)return true;const haystack=`${ad.pageName} ${ad.adText} ${ad.headline} ${ad.angle} ${ad.hook} ${ad.creativeType}`.toLowerCase();return words.every(word=>haystack.includes(word))}
