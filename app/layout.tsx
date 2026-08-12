import type { Metadata } from 'next';
import './globals.css';
import{AuthProvider}from'@/components/AuthProvider';import{AccountDock}from'@/components/AccountDock';
export const metadata:Metadata={title:'Siraji AdSpy — Creative Intelligence',description:'Evidence-led competitor ad research for Bangladesh ecommerce'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><AuthProvider>{children}<AccountDock/></AuthProvider></body></html>}
