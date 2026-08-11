import Link from'next/link';import{Logo}from'@/components/Logo';import{CreativeLab}from'@/components/CreativeLab';
export default function CreativeLabPage(){return <><header><Logo/><nav><Link href="/spy">Ad library</Link><Link href="/creative-lab">Creative lab</Link></nav><Link className="back" href="/spy">← Library</Link></header><CreativeLab/></>}
