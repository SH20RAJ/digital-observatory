import Link from "next/link";

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">
    {items.map((item, index) => <span key={item.name}>{index > 0 ? <span className="breadcrumb-sep">/</span> : null}{item.href ? <Link href={item.href}>{item.name}</Link> : <span>{item.name}</span>}</span>)}
  </nav>;
}