"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/me");
        if (!response.ok) throw new Error("Not authenticated");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "user_data=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    router.push("/login");
  };

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap');
          .t-loader {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0C0B09;
            font-family: 'Outfit', sans-serif;
          }
          .t-spinner {
            width: 36px; height: 36px;
            border: 2px solid rgba(201,169,110,0.15);
            border-top-color: #C9A96E;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .t-load-text {
            margin-top: 1rem;
            font-size: 0.78rem;
            letter-spacing: 0.1em;
            color: rgba(237,232,223,0.35);
            text-transform: uppercase;
          }
        `}</style>
        <div className="t-loader">
          <div style={{ textAlign: "center" }}>
            <div className="t-spinner" />
            <p className="t-load-text">Loading…</p>
          </div>
        </div>
      </>
    );
  }

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.email?.split("@")[0] || "Admin";

  const avatarLetter =
    user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "A";

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
    { section: "STORE" },
    { href: "/admin/products",  label: "Products",    icon: "👗" },
    { href: "/admin/orders",    label: "Orders",      icon: "🛒" },
    { href: "/admin/analytics", label: "Analytics",   icon: "📊" },
    { section: "USERS" },
    { href: "/admin/users",        label: "All Users",   icon: "👥" },
    { href: "/admin/users/create", label: "Create User", icon: "➕" },
    { section: "ACCOUNT" },
    { href: "/user/profile",    label: "Profile",     icon: "👤" },
    { section: "SYSTEM" },
    { href: "/admin/settings",  label: "Settings",    icon: "⚙️" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #0C0B09;
          --sidebar:  #111009;
          --surface:  #181610;
          --border:   rgba(255,220,120,0.07);
          --gold:     #C9A96E;
          --gold-dim: rgba(201,169,110,0.12);
          --text:     #EDE8DF;
          --muted:    #7A7060;
          --dim:      rgba(237,232,223,0.38);
        }

        html, body { height: 100%; background: var(--bg); }

        .tl-root {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'Outfit', sans-serif;
          font-weight: 300;
        }

        /* ── Sidebar ── */
        .tl-sidebar {
          width: 230px;
          flex-shrink: 0;
          background: var(--sidebar);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        /* Logo */
        .tl-logo {
          padding: 1.4rem 1.3rem 1.2rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
        }

        .tl-logo-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: var(--gold-dim);
          border: 1px solid rgba(201,169,110,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .tl-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          color: var(--gold);
          letter-spacing: 0.05em;
        }

        .tl-logo-sub {
          display: block;
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 2px;
        }

        /* Nav */
        .tl-nav { padding: 0.8rem 0; flex: 1; }

        .tl-nav-section {
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 1rem 1.3rem 0.35rem;
          opacity: 0.55;
        }

        .tl-nav-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.62rem 1.3rem;
          font-size: 0.82rem;
          color: var(--dim);
          text-decoration: none;
          border-left: 2px solid transparent;
          transition: all 0.18s ease;
        }

        .tl-nav-link:hover {
          color: var(--text);
          background: rgba(255,255,255,0.025);
          border-left-color: rgba(201,169,110,0.25);
        }

        .tl-nav-link.active {
          color: var(--gold);
          background: var(--gold-dim);
          border-left-color: var(--gold);
          font-weight: 500;
        }

        .tl-nav-icon { font-size: 0.95rem; width: 18px; text-align: center; flex-shrink: 0; }

        /* Sidebar footer */
        .tl-foot {
          padding: 1.1rem 1.3rem;
          border-top: 1px solid var(--border);
        }

        .tl-user-row {
          display: flex; align-items: center; gap: 0.65rem;
          margin-bottom: 0.9rem;
        }

        .tl-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: var(--gold-dim);
          border: 1px solid rgba(201,169,110,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 600;
          color: var(--gold); flex-shrink: 0;
          text-transform: uppercase;
        }

        .tl-user-info { flex: 1; min-width: 0; }

        .tl-user-name {
          font-size: 0.78rem; font-weight: 500;
          color: var(--text);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .tl-user-role {
          font-size: 0.6rem;
          color: var(--gold);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .tl-logout-btn {
          width: 100%;
          padding: 0.42rem 0;
          font-family: 'Outfit', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #E06C75;
          background: rgba(224,108,117,0.07);
          border: 1px solid rgba(224,108,117,0.15);
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.18s;
        }

        .tl-logout-btn:hover {
          background: rgba(224,108,117,0.13);
          border-color: rgba(224,108,117,0.3);
        }

        /* Main */
        .tl-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: auto; }
      `}</style>

      <div className="tl-root">
        {/* Sidebar */}
        <aside className="tl-sidebar">
          <Link href="/admin/dashboard" className="tl-logo">
            <div className="tl-logo-icon">👗</div>
            <div>
              <div className="tl-logo-name">Trendora</div>
              <span className="tl-logo-sub">Admin Panel</span>
            </div>
          </Link>

          <nav className="tl-nav">
            {navItems.map((item, i) =>
              "section" in item ? (
                <div key={i} className="tl-nav-section">{item.section}</div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`tl-nav-link${pathname === item.href ? " active" : ""}`}
                >
                  <span className="tl-nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="tl-foot">
            <div className="tl-user-row">
              <div className="tl-avatar">{avatarLetter}</div>
              <div className="tl-user-info">
                <div className="tl-user-name">{displayName}</div>
                <div className="tl-user-role">{user?.role || "Admin"}</div>
              </div>
            </div>
            <button className="tl-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        {/* Page content */}
        <div className="tl-main">{children}</div>
      </div>
    </>
  );
}