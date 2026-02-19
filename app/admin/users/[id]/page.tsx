"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getUserById } from "@/lib/api/admin.api";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  phone: string;
  role: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserById(id as string);
        setUser(data.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    return imagePath.startsWith("/uploads")
      ? `/api/image-proxy?url=${encodeURIComponent(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${imagePath}`
        )}`
      : imagePath;
  };

  const avatarLetter = user?.firstName
    ? user.firstName[0].toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.username || "—";

  // ── Loading ──
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap');
          .tv-loader { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0C0B09; font-family:'Outfit',sans-serif; }
          .tv-spinner { width:34px; height:34px; border:2px solid rgba(201,169,110,0.15); border-top-color:#C9A96E; border-radius:50%; animation:spin 0.7s linear infinite; }
          @keyframes spin { to { transform:rotate(360deg); } }
          .tv-load-txt { margin-top:0.9rem; font-size:0.75rem; letter-spacing:0.1em; color:rgba(237,232,223,0.3); text-transform:uppercase; }
        `}</style>
        <div className="tv-loader">
          <div style={{ textAlign: "center" }}>
            <div className="tv-spinner" />
            <p className="tv-load-txt">Loading user…</p>
          </div>
        </div>
      </>
    );
  }

  // ── Error ──
  if (error || !user) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400&family=Outfit:wght@300;400;500&display=swap');
          .tv-err { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0C0B09; font-family:'Outfit',sans-serif; }
          .tv-err-box { background:#181610; border:1px solid rgba(255,220,120,0.07); border-radius:14px; padding:2.5rem 2rem; max-width:360px; width:calc(100% - 2rem); text-align:center; }
          .tv-err-icon { font-size:2rem; margin-bottom:1rem; opacity:0.5; }
          .tv-err-title { font-family:'Playfair Display',serif; font-size:1.2rem; color:#EDE8DF; margin-bottom:0.5rem; }
          .tv-err-msg { font-size:0.8rem; color:#E06C75; margin-bottom:1.5rem; }
          .tv-err-btn { display:inline-block; font-family:'Outfit',sans-serif; font-size:0.72rem; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; padding:0.5rem 1.2rem; border-radius:6px; background:#C9A96E; color:#0C0B09; text-decoration:none; transition:opacity 0.18s; }
          .tv-err-btn:hover { opacity:0.88; }
        `}</style>
        <div className="tv-err">
          <div className="tv-err-box">
            <div className="tv-err-icon">⚠️</div>
            <h2 className="tv-err-title">User Not Found</h2>
            <p className="tv-err-msg">{error || "This user doesn't exist or was deleted."}</p>
            <Link href="/admin/users" className="tv-err-btn">← Back to Users</Link>
          </div>
        </div>
      </>
    );
  }

  const infoRows = [
    { label: "User ID",      value: user.id,                                                      span: false },
    { label: "Username",     value: `@${user.username}`,                                          span: false },
    { label: "Email",        value: user.email,                                                   span: false },
    { label: "Phone",        value: user.phone || "Not provided",                                 span: false },
    { label: "Role",         value: user.role,                                                    span: false, isRole: true },
    { label: "Joined",       value: new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), span: false },
    { label: "Last Updated", value: new Date(user.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), span: false },
    { label: "Bio",          value: user.bio || "No bio provided",                               span: true  },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --bg:       #0C0B09;
          --sidebar:  #111009;
          --surface:  #181610;
          --surface2: #1E1C15;
          --border:   rgba(255,220,120,0.07);
          --gold:     #C9A96E;
          --gold-dim: rgba(201,169,110,0.12);
          --text:     #EDE8DF;
          --muted:    #7A7060;
          --dim:      rgba(237,232,223,0.38);
        }

        .tv-wrap { background:var(--bg); min-height:100vh; font-family:'Outfit',sans-serif; font-weight:300; color:var(--text); }

        /* Topbar */
        .tv-topbar { height:58px; background:var(--sidebar); border-bottom:1px solid var(--border); padding:0 2rem; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:10; }
        .tv-breadcrumb { display:flex; align-items:center; gap:0.5rem; font-size:0.78rem; color:var(--muted); }
        .tv-breadcrumb a { color:var(--muted); text-decoration:none; transition:color 0.15s; }
        .tv-breadcrumb a:hover { color:var(--gold); }
        .tv-breadcrumb strong { color:var(--text); font-weight:500; }
        .tv-edit-btn { font-family:'Outfit',sans-serif; font-size:0.72rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:#0C0B09; background:var(--gold); text-decoration:none; padding:0.42rem 1rem; border-radius:5px; transition:opacity 0.18s; }
        .tv-edit-btn:hover { opacity:0.88; }

        /* Page */
        .tv-page { padding:2rem 2rem 4rem; display:flex; flex-direction:column; align-items:center; }
        .tv-inner { width:100%; max-width:640px; }

        /* Profile hero card */
        .tv-hero {
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:14px;
          padding:2rem;
          display:flex;
          align-items:center;
          gap:1.5rem;
          margin-bottom:1rem;
          position:relative;
          overflow:hidden;
        }

        .tv-hero::before {
          content:'';
          position:absolute;
          top:0; left:0; right:0;
          height:2px;
          background:var(--gold);
          border-radius:14px 14px 0 0;
        }

        .tv-avatar {
          width:72px; height:72px;
          border-radius:50%;
          overflow:hidden;
          background:var(--gold-dim);
          border:2px solid rgba(201,169,110,0.3);
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0;
        }
        .tv-avatar img { width:100%; height:100%; object-fit:cover; }
        .tv-avatar-letter { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:400; color:var(--gold); }

        .tv-hero-info { flex:1; min-width:0; }

        .tv-hero-name {
          font-family:'Playfair Display',serif;
          font-size:1.4rem; font-weight:400;
          color:var(--text); line-height:1.2;
          margin-bottom:0.35rem;
        }

        .tv-hero-email { font-size:0.8rem; color:var(--muted); margin-bottom:0.6rem; }

        .tv-role-badge {
          display:inline-block;
          padding:0.2rem 0.6rem;
          border-radius:20px;
          font-size:0.62rem; font-weight:500;
          letter-spacing:0.08em; text-transform:uppercase;
        }
        .tv-role-badge.admin { background:var(--gold-dim); color:var(--gold); border:1px solid rgba(201,169,110,0.2); }
        .tv-role-badge.user  { background:rgba(255,255,255,0.05); color:var(--muted); border:1px solid rgba(255,255,255,0.06); }

        /* Info grid */
        .tv-card {
          background:var(--surface);
          border:1px solid var(--border);
          border-radius:14px;
          overflow:hidden;
        }

        .tv-card-header {
          padding:1rem 1.5rem;
          border-bottom:1px solid var(--border);
          font-size:0.62rem; letter-spacing:0.2em;
          text-transform:uppercase; color:var(--muted);
        }

        .tv-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:1px;
          background:var(--border);
        }
        @media (max-width:500px) { .tv-grid { grid-template-columns:1fr; } }

        .tv-cell {
          background:var(--surface);
          padding:1.1rem 1.5rem;
          transition:background 0.15s;
        }
        .tv-cell:hover { background:var(--surface2); }
        .tv-cell.span2 { grid-column:1/-1; }

        .tv-cell-label {
          font-size:0.62rem; letter-spacing:0.15em;
          text-transform:uppercase; color:var(--muted);
          margin-bottom:0.35rem;
        }

        .tv-cell-value {
          font-size:0.82rem; color:var(--text);
          word-break:break-all;
        }

        .tv-cell-value.muted { color:var(--muted); font-style:italic; }

        /* Action strip */
        .tv-actions {
          display:flex; gap:0.75rem;
          margin-top:1rem;
          flex-wrap:wrap;
        }

        .tv-action-btn {
          flex:1;
          font-family:'Outfit',sans-serif;
          font-size:0.72rem; font-weight:500;
          letter-spacing:0.1em; text-transform:uppercase;
          padding:0.6rem 1rem;
          border-radius:7px;
          text-decoration:none;
          text-align:center;
          cursor:pointer;
          transition:all 0.18s;
          border:1px solid;
          display:flex; align-items:center; justify-content:center; gap:0.4rem;
        }

        .tv-action-edit {
          background:var(--gold-dim);
          border-color:rgba(201,169,110,0.25);
          color:var(--gold);
        }
        .tv-action-edit:hover { background:rgba(201,169,110,0.2); }

        .tv-action-back {
          background:rgba(255,255,255,0.04);
          border-color:var(--border);
          color:var(--muted);
        }
        .tv-action-back:hover { color:var(--text); border-color:rgba(255,220,120,0.15); }
      `}</style>

      <div className="tv-wrap">
        {/* Topbar */}
        <header className="tv-topbar">
          <div className="tv-breadcrumb">
            <Link href="/admin/dashboard">Admin</Link>
            <span style={{ opacity: 0.3 }}>/</span>
            <Link href="/admin/users">Users</Link>
            <span style={{ opacity: 0.3 }}>/</span>
            <strong>View</strong>
          </div>
          <Link href={`/admin/users/${id}/edit`} className="tv-edit-btn">
            ✏ Edit User
          </Link>
        </header>

        {/* Page */}
        <div className="tv-page">
          <div className="tv-inner">

            {/* Hero */}
            <div className="tv-hero">
              <div className="tv-avatar">
                {user.profileImage
                  ? <img src={getImageUrl(user.profileImage) || ""} alt={fullName} />
                  : <span className="tv-avatar-letter">{avatarLetter}</span>
                }
              </div>
              <div className="tv-hero-info">
                <h2 className="tv-hero-name">{fullName}</h2>
                <p className="tv-hero-email">{user.email}</p>
                <span className={`tv-role-badge ${user.role}`}>{user.role}</span>
              </div>
            </div>

            {/* Info card */}
            <div className="tv-card">
              <div className="tv-card-header">Account Details</div>
              <div className="tv-grid">
                {infoRows.map(({ label, value, span, isRole }) => (
                  <div key={label} className={`tv-cell${span ? " span2" : ""}`}>
                    <p className="tv-cell-label">{label}</p>
                    {isRole ? (
                      <span className={`tv-role-badge ${value}`}>{value}</span>
                    ) : (
                      <p className={`tv-cell-value${value === "Not provided" || value === "No bio provided" ? " muted" : ""}`}>
                        {value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="tv-actions">
              <Link href="/admin/users" className="tv-action-btn tv-action-back">
                ← Back to Users
              </Link>
              <Link href={`/admin/users/${id}/edit`} className="tv-action-btn tv-action-edit">
                ✏ Edit User
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}