export const metadata = { title: 'My account', robots: { index: false } };
export default function Account() {
  return <div className="pm-container" style={{ padding: '64px 0 96px', maxWidth: 480 }}>
    <h1>My account</h1>
    <div className="woocommerce-info">Demo store: sign-in is not connected.</div>
    <form><div style={{ display: 'grid', gap: 6, marginBottom: 14 }}><label htmlFor="a-e">Email</label><input id="a-e" type="email" /></div>
    <div style={{ display: 'grid', gap: 6, marginBottom: 14 }}><label htmlFor="a-p">Password</label><input id="a-p" type="password" /></div>
    <button type="button" className="pm-btn pm-btn--primary" disabled>Log in</button></form></div>;
}
