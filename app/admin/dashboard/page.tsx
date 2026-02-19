import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token');
  const userDataCookie = cookieStore.get('user_data');

  if (!authToken || !userDataCookie) redirect('/login');

  let userData = null;
  try {
    userData = JSON.parse(userDataCookie.value);
    if (userData.role !== 'admin') redirect('/dashboard');
  } catch {
    redirect('/login');
  }

  const displayName =
    userData?.name || userData?.email?.split('@')[0] || 'Admin';

  const stats = [
    { label: 'Total Orders', value: '248',    change: '+12%', icon: '🛍️', color: '#E8A87C' },
    { label: 'Total Users',  value: '1,560',  change: '+8%',  icon: '👤', color: '#B48EAD' },
    { label: 'Revenue',      value: '$12.5k', change: '+23%', icon: '💎', color: '#88C0A0' },
    { label: 'New Today',    value: '14',     change: '+5',   icon: '✨', color: '#81A1C1' },
  ];

  const cards = [
    { href: '/admin/users',        icon: '👥', title: 'Manage Users',  desc: 'View, edit, and manage all registered users',   cta: 'View Users',    color: '#B48EAD' },
    { href: '/admin/users/create', icon: '➕', title: 'Create User',   desc: 'Add a new user account to the store',           cta: 'Add User',      color: '#88C0A0' },
    { href: '/admin/orders',       icon: '🛒', title: 'Manage Orders', desc: 'Track and update all customer orders',          cta: 'View Orders',   color: '#E8A87C' },
    { href: '/admin/analytics',    icon: '📊', title: 'Analytics',     desc: 'Sales reports and performance statistics',      cta: 'View Report',   color: '#81A1C1' },
    { href: '/admin/products',     icon: '👗', title: 'Products',      desc: 'Manage your fashion catalog and inventory',     cta: 'View Products', color: '#D08770' },
    { href: '/admin/settings',     icon: '⚙️', title: 'Settings',      desc: 'Configure your Trendora store settings',       cta: 'Open Settings', color: '#8FBCBB' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --bg:       #0C0B09;
          --surface:  #181610;
          --surface2: #1E1C15;
          --border:   rgba(255,220,120,0.07);
          --gold:     #C9A96E;
          --text:     #EDE8DF;
          --muted:    #7A7060;
          --dim:      rgba(237,232,223,0.38);
        }

        /* ── Topbar ── */
        .td-topbar {
          height: 58px;
          background: #111009;
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
          font-family: 'Outfit', sans-serif;
        }

        .td-breadcrumb {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.78rem; color: var(--muted);
        }

        .td-breadcrumb strong { color: var(--text); font-weight: 500; }

        .td-email { font-size: 0.76rem; color: var(--muted); }

        .td-topbar-right { display: flex; align-items: center; gap: 1rem; }

        .td-logout {
          font-family: 'Outfit', sans-serif;
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.13em; text-transform: uppercase;
          color: var(--gold);
          text-decoration: none;
          border: 1px solid rgba(201,169,110,0.22);
          padding: 0.38rem 0.9rem;
          border-radius: 5px;
          transition: all 0.18s;
        }
        .td-logout:hover { background: rgba(201,169,110,0.1); border-color: rgba(201,169,110,0.45); }

        /* ── Page content ── */
        .td-page {
          padding: 2.2rem 2rem 3rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 300;
          color: var(--text);
          background: var(--bg);
          min-height: calc(100vh - 58px);
        }

        /* Welcome */
        .td-welcome { margin-bottom: 2.2rem; }

        .td-welcome-row {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          gap: 1rem; flex-wrap: wrap;
        }

        .td-welcome-h {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 400; color: var(--text); line-height: 1.15;
        }

        .td-welcome-h em { font-style: italic; color: var(--gold); }

        .td-welcome-sub {
          font-size: 0.82rem; color: var(--dim); margin-top: 0.45rem;
        }

        .td-date {
          font-size: 0.68rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--muted);
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 0.45rem 0.9rem; border-radius: 5px;
          white-space: nowrap; align-self: flex-start;
        }

        /* Stats */
        .td-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.9rem;
          margin-bottom: 2.2rem;
        }

        @media (max-width: 880px) { .td-stats { grid-template-columns: repeat(2,1fr); } }

        .td-stat {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.3rem 1.2rem;
          position: relative; overflow: hidden;
          transition: transform 0.2s, border-color 0.2s;
        }

        .td-stat:hover {
          transform: translateY(-2px);
          border-color: rgba(255,220,120,0.14);
        }

        .td-stat::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--c);
          border-radius: 12px 12px 0 0;
        }

        .td-stat-row {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 0.9rem;
        }

        .td-stat-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }

        .td-stat-badge {
          font-size: 0.63rem; padding: 0.18rem 0.48rem;
          border-radius: 20px;
          background: rgba(136,192,160,0.1);
          color: #88C0A0; font-weight: 500;
        }

        .td-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem; font-weight: 400;
          color: var(--text); line-height: 1;
        }

        .td-stat-label {
          font-size: 0.67rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--muted); margin-top: 0.3rem;
        }

        /* Section header */
        .td-sec {
          display: flex; align-items: center; gap: 0.9rem;
          margin-bottom: 1.1rem;
        }

        .td-sec-title {
          font-size: 0.65rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--muted); white-space: nowrap;
        }

        .td-sec-line { flex: 1; height: 1px; background: var(--border); }

        /* Cards */
        .td-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.9rem;
        }

        @media (max-width: 880px) { .td-cards { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 540px) { .td-cards { grid-template-columns: 1fr; } }

        .td-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.4rem;
          text-decoration: none;
          display: flex; flex-direction: column; gap: 0.55rem;
          position: relative; overflow: hidden;
          transition: all 0.2s ease;
        }

        .td-card:hover {
          background: var(--surface2);
          border-color: rgba(255,220,120,0.14);
          transform: translateY(-3px);
          box-shadow: 0 10px 35px rgba(0,0,0,0.35);
        }

        .td-card::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: var(--ca);
          border-radius: 0 0 12px 12px;
          opacity: 0; transition: opacity 0.2s;
        }

        .td-card:hover::after { opacity: 1; }

        .td-card-icon {
          width: 44px; height: 44px; border-radius: 11px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.15rem; margin-bottom: 0.2rem;
        }

        .td-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.02rem; font-weight: 400; color: var(--text);
        }

        .td-card-desc {
          font-size: 0.76rem; color: var(--dim); line-height: 1.65; flex: 1;
        }

        .td-card-cta {
          font-size: 0.67rem; letter-spacing: 0.14em;
          text-transform: uppercase; font-weight: 500;
          color: var(--ca);
          display: inline-flex; align-items: center; gap: 0.35rem;
          margin-top: 0.35rem; transition: gap 0.18s;
        }

        .td-card:hover .td-card-cta { gap: 0.6rem; }
      `}</style>

      {/* Topbar */}
      <header className="td-topbar">
        <div className="td-breadcrumb">
          <span>Admin</span>
          <span style={{ opacity: 0.3 }}>/</span>
          <strong>Dashboard</strong>
        </div>
        <div className="td-topbar-right">
          <span className="td-email">{userData?.email}</span>
          <Link href="/logout" className="td-logout">Logout</Link>
        </div>
      </header>

      {/* Main */}
      <div className="td-page">

        {/* Welcome */}
        <div className="td-welcome">
          <div className="td-welcome-row">
            <div>
              <h1 className="td-welcome-h">
                Welcome back, <em>{displayName}</em>
              </h1>
              <p className="td-welcome-sub">
                Here's what's happening with your store today.
              </p>
            </div>
            <div className="td-date">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="td-stats">
          {stats.map((s) => (
            <div
              key={s.label}
              className="td-stat"
              style={{ '--c': s.color } as React.CSSProperties}
            >
              <div className="td-stat-row">
                <div className="td-stat-icon">{s.icon}</div>
                <span className="td-stat-badge">{s.change}</span>
              </div>
              <div className="td-stat-val">{s.value}</div>
              <div className="td-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="td-sec">
          <span className="td-sec-title">Quick Access</span>
          <div className="td-sec-line" />
        </div>

        <div className="td-cards">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="td-card"
              style={{ '--ca': c.color } as React.CSSProperties}
            >
              <div className="td-card-icon">{c.icon}</div>
              <div className="td-card-title">{c.title}</div>
              <p className="td-card-desc">{c.desc}</p>
              <span className="td-card-cta">{c.cta} →</span>
            </Link>
          ))}
        </div>

      </div>
    </>
  );
}