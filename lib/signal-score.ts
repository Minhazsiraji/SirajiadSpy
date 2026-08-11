import type { Ad } from './types';
export function calculateSignalScore(ad: Pick<Ad,'daysActive'|'creativeType'|'landingUrl'|'verified'> & Partial<Pick<Ad,'likes'|'comments'|'shares'>>){
  const longevity=Math.min(ad.daysActive*2.5,45);
  const engagement=Math.min(((ad.likes||0)+(ad.comments||0)*3+(ad.shares||0)*4)/25,20);
  const evidence=ad.verified?15:5;
  const creative=ad.creativeType==='VIDEO'?10:7;
  const destination=ad.landingUrl?10:0;
  return Math.min(100,Math.round(longevity+engagement+evidence+creative+destination));
}
export function signalLabel(score:number,days:number){if(score>=75&&days>=15)return{label:'Strong signal',tone:'strong'};if(score>=55||days>=8)return{label:'Worth studying',tone:'medium'};return{label:'Early signal',tone:'early'}}
