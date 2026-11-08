import Link from 'next/link';
export default function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav className="woocommerce-breadcrumb" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i}>{i > 0 && ' / '}{it.href ? <Link href={it.href}>{it.name}</Link> : it.name}</span>
      ))}
    </nav>
  );
}
