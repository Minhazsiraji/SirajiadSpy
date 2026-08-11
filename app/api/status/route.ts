import {NextResponse} from 'next/server';
export function GET(){return NextResponse.json({app:'ready',ai:process.env.OPENAI_API_KEY?'connected':'demo fallback',database:process.env.DATABASE_URL?'configured':'demo data',collector:process.env.META_ACCESS_TOKEN?'configured':'Meta Ad Library handoff',checkedAt:new Date().toISOString()})}
