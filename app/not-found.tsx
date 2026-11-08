import Link from 'next/link';
export default function NotFound() {
  return (<div className="pm-container" style={{ padding: '96px 0', textAlign: 'center' }}><h1>Page not found</h1><p>The page you are looking for doesn’t exist.</p><p><Link className="pm-btn pm-btn--primary" href="/shop">Browse products</Link></p></div>);
}
