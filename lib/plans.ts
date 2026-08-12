export const PLANS={FREE:{name:'Free',searchesPerDay:20,aiPerDay:5,exportsPerMonth:0},PRO:{name:'Pro',searchesPerDay:Infinity,aiPerDay:100,exportsPerMonth:50,priceBdt:799}}as const;
export const UPGRADE={bkash:process.env.NEXT_PUBLIC_BKASH_NUMBER||'01XXXXXXXXX',nagad:process.env.NEXT_PUBLIC_NAGAD_NUMBER||'01XXXXXXXXX',whatsapp:process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'8801XXXXXXXXX'};
export type PlanName=keyof typeof PLANS;
