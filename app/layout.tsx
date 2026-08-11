import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Siraji AdSpy — Creative Intelligence',description:'Evidence-led competitor ad research for Bangladesh ecommerce'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
