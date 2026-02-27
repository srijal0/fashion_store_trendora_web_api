"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllUsers, deleteUser } from "@/lib/api/admin.api";

interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage: string;
  createdAt: string;
}

// Helper: get the user's id regardless of _id or id
const getUserId = (user: User): string =>
  user.id || user._id || "";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(page, 10);
      setUsers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalUsers(data.pagination?.totalUsers || 0);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      // filter out by either id or _id
      setUsers(users.filter((u) => getUserId(u) !== id));
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
      setDeleteId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getAvatar = (user: User) => {
    if (user.profileImage) {
      const src =
        user.profileImage.includes("localhost") || user.profileImage.startsWith("/uploads")
          ? `/api/image-proxy?url=${encodeURIComponent(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profileImage}`
            )}`
          : user.profileImage;
      return (
        <img
          src={src}
          alt={user.firstName || "user"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }
    const letter = user.firstName
      ? user.firstName[0].toUpperCase()
      : user.email?.[0]?.toUpperCase() || "U";
    return (
      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#C9A96E" }}>
        {letter}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap');
          .tu-loader { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0C0B09; font-family:'Outfit',sans-serif; }
          .tu-spinner { width:34px; height:34px; border:2px solid rgba(201,169,110,0.15); border-top-color:#C9A96E; border-radius:50%; animation:spin 0.7s linear infinite; }
          @keyframes spin { to { transform:rotate(360deg); } }
          .tu-load-txt { margin-top:0.9rem; font-size:0.75rem; letter-spacing:0.1em; color:rgba(237,232,223,0.3); text-transform:uppercase; }
        `}</style>
        <div className="tu-loader">
          <div style={{ textAlign: "center" }}>
            <div className="tu-spinner" />
            <p className="tu-load-txt">Loading users…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --bg:      #0C0B09;
          --surface: #181610;
          --surface2:#1E1C15;
          --border:  rgba(255,220,120,0.07);
          --gold:    #C9A96E;
          --gold-dim:rgba(201,169,110,0.12);
          --text:    #EDE8DF;
          --muted:   #7A7060;
          --dim:     rgba(237,232,223,0.38);
        }

        .tu-wrap { background:var(--bg); min-height:100vh; font-family:'Outfit',sans-serif; font-weight:300; color:var(--text); }

        /* Topbar */
        .tu-topbar { height:58px; background:#111009; border-bottom:1px solid var(--border); padding:0 2rem; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:10; }
        .tu-breadcrumb { display:flex; align-items:center; gap:0.5rem; font-size:0.78rem; color:var(--muted); }
        .tu-breadcrumb strong { color:var(--text); font-weight:500; }
        .tu-create-btn { display:flex; align-items:center; gap:0.4rem; font-family:'Outfit',sans-serif; font-size:0.72rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:#0C0B09; background:var(--gold); text-decoration:none; padding:0.42rem 1rem; border-radius:5px; transition:opacity 0.18s; }
        .tu-create-btn:hover { opacity:0.88; }

        /* Page */
        .tu-page { padding:2rem 2rem 3rem; }
        .tu-header-row { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; margin-bottom:1.8rem; flex-wrap:wrap; }
        .tu-page-title { font-family:'Playfair Display',serif; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:400; color:var(--text); }
        .tu-page-sub { font-size:0.78rem; color:var(--muted); margin-top:0.3rem; }

        /* Controls */
        .tu-controls { display:flex; align-items:center; gap:0.8rem; margin-bottom:1.2rem; flex-wrap:wrap; }
        .tu-search-wrap { position:relative; flex:1; min-width:200px; max-width:340px; }
        .tu-search-icon { position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); font-size:0.8rem; color:var(--muted); pointer-events:none; }
        .tu-search { width:100%; background:var(--surface); border:1px solid var(--border); border-radius:7px; padding:0.55rem 0.85rem 0.55rem 2.2rem; font-family:'Outfit',sans-serif; font-size:0.82rem; font-weight:300; color:var(--text); outline:none; transition:border-color 0.18s; }
        .tu-search::placeholder { color:var(--muted); }
        .tu-search:focus { border-color:rgba(201,169,110,0.3); }
        .tu-filter-group { display:flex; gap:0.4rem; }
        .tu-filter-btn { font-family:'Outfit',sans-serif; font-size:0.68rem; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; padding:0.45rem 0.85rem; border-radius:5px; border:1px solid var(--border); background:var(--surface); color:var(--muted); cursor:pointer; transition:all 0.18s; }
        .tu-filter-btn:hover { color:var(--text); border-color:rgba(255,220,120,0.15); }
        .tu-filter-btn.active { background:var(--gold-dim); border-color:rgba(201,169,110,0.3); color:var(--gold); }
        .tu-count { margin-left:auto; font-size:0.72rem; color:var(--muted); white-space:nowrap; }

        /* Error */
        .tu-error { background:rgba(224,108,117,0.08); border:1px solid rgba(224,108,117,0.2); border-radius:7px; padding:0.75rem 1rem; font-size:0.8rem; color:#E06C75; margin-bottom:1.2rem; }

        /* Table card */
        .tu-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
        .tu-table-wrap { overflow-x:auto; }
        table.tu-table { width:100%; border-collapse:collapse; }
        .tu-table thead tr { border-bottom:1px solid var(--border); background:rgba(255,220,120,0.03); }
        .tu-table th { padding:0.85rem 1.2rem; font-size:0.62rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--muted); font-weight:500; text-align:left; white-space:nowrap; }
        .tu-table tbody tr { border-bottom:1px solid rgba(255,220,120,0.04); transition:background 0.15s; }
        .tu-table tbody tr:last-child { border-bottom:none; }
        .tu-table tbody tr:hover { background:rgba(255,255,255,0.018); }
        .tu-table td { padding:0.9rem 1.2rem; font-size:0.8rem; color:var(--dim); vertical-align:middle; }

        /* User cell */
        .tu-user-cell { display:flex; align-items:center; gap:0.75rem; }
        .tu-avatar { width:34px; height:34px; border-radius:50%; background:var(--gold-dim); border:1px solid rgba(201,169,110,0.2); overflow:hidden; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .tu-user-name { font-size:0.82rem; font-weight:500; color:var(--text); }

        /* Role badge */
        .tu-role { display:inline-block; padding:0.18rem 0.55rem; border-radius:20px; font-size:0.62rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; }
        .tu-role.admin { background:var(--gold-dim); color:var(--gold); border:1px solid rgba(201,169,110,0.2); }
        .tu-role.user { background:rgba(255,255,255,0.05); color:var(--muted); border:1px solid rgba(255,255,255,0.06); }

        /* Action buttons */
        .tu-actions { display:flex; align-items:center; gap:0.4rem; }
        .tu-btn { font-family:'Outfit',sans-serif; font-size:0.65rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; padding:0.32rem 0.7rem; border-radius:4px; border:1px solid transparent; text-decoration:none; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
        .tu-btn-view { color:var(--muted); background:rgba(255,255,255,0.04); border-color:rgba(255,255,255,0.06); }
        .tu-btn-view:hover { color:var(--text); background:rgba(255,255,255,0.07); }
        .tu-btn-edit { color:var(--gold); background:var(--gold-dim); border-color:rgba(201,169,110,0.2); }
        .tu-btn-edit:hover { background:rgba(201,169,110,0.2); }
        .tu-btn-delete { color:#E06C75; background:rgba(224,108,117,0.07); border-color:rgba(224,108,117,0.15); }
        .tu-btn-delete:hover { background:rgba(224,108,117,0.15); }

        /* Empty */
        .tu-empty { padding:3.5rem 1rem; text-align:center; color:var(--muted); font-size:0.82rem; }
        .tu-empty-icon { font-size:2rem; margin-bottom:0.75rem; opacity:0.4; }

        /* Pagination */
        .tu-pagination { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.2rem; border-top:1px solid var(--border); flex-wrap:wrap; gap:0.75rem; }
        .tu-page-info { font-size:0.72rem; color:var(--muted); }
        .tu-page-btns { display:flex; align-items:center; gap:0.4rem; }
        .tu-page-btn { font-family:'Outfit',sans-serif; font-size:0.72rem; font-weight:500; width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:5px; border:1px solid var(--border); background:var(--surface2); color:var(--muted); cursor:pointer; transition:all 0.15s; }
        .tu-page-btn:hover:not(:disabled) { color:var(--text); border-color:rgba(255,220,120,0.2); }
        .tu-page-btn:disabled { opacity:0.3; cursor:not-allowed; }
        .tu-page-btn.current { background:var(--gold-dim); border-color:rgba(201,169,110,0.3); color:var(--gold); }
        .tu-page-arrow { font-family:'Outfit',sans-serif; font-size:0.72rem; padding:0 0.6rem; height:32px; display:flex; align-items:center; border-radius:5px; border:1px solid var(--border); background:var(--surface2); color:var(--muted); cursor:pointer; transition:all 0.15s; }
        .tu-page-arrow:hover:not(:disabled) { color:var(--text); border-color:rgba(255,220,120,0.2); }
        .tu-page-arrow:disabled { opacity:0.3; cursor:not-allowed; }

        /* Modal */
        .tu-modal-bg { position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:50; backdrop-filter:blur(2px); }
        .tu-modal { background:#1A1812; border:1px solid var(--border); border-radius:14px; padding:1.8rem; max-width:380px; width:calc(100% - 2rem); box-shadow:0 20px 60px rgba(0,0,0,0.5); }
        .tu-modal-icon { width:44px; height:44px; border-radius:50%; background:rgba(224,108,117,0.1); border:1px solid rgba(224,108,117,0.2); display:flex; align-items:center; justify-content:center; font-size:1.1rem; margin-bottom:1rem; }
        .tu-modal-title { font-family:'Playfair Display',serif; font-size:1.15rem; font-weight:400; color:var(--text); margin-bottom:0.5rem; }
        .tu-modal-desc { font-size:0.8rem; color:var(--dim); line-height:1.65; margin-bottom:1.5rem; }
        .tu-modal-actions { display:flex; justify-content:flex-end; gap:0.6rem; }
        .tu-modal-cancel { font-family:'Outfit',sans-serif; font-size:0.75rem; font-weight:500; padding:0.5rem 1.1rem; border-radius:6px; border:1px solid var(--border); background:var(--surface2); color:var(--muted); cursor:pointer; transition:all 0.15s; }
        .tu-modal-cancel:hover { color:var(--text); }
        .tu-modal-confirm { font-family:'Outfit',sans-serif; font-size:0.75rem; font-weight:500; padding:0.5rem 1.1rem; border-radius:6px; border:1px solid rgba(224,108,117,0.25); background:rgba(224,108,117,0.1); color:#E06C75; cursor:pointer; transition:all 0.15s; }
        .tu-modal-confirm:hover { background:rgba(224,108,117,0.18); }
      `}</style>

      <div className="tu-wrap">
        {/* Topbar */}
        <header className="tu-topbar">
          <div className="tu-breadcrumb">
            <span>Admin</span>
            <span style={{ opacity: 0.3 }}>/</span>
            <strong>Users</strong>
          </div>
          <Link href="/admin/users/create" className="tu-create-btn">
            ＋ Create User
          </Link>
        </header>

        <div className="tu-page">
          {/* Heading */}
          <div className="tu-header-row">
            <div>
              <h1 className="tu-page-title">User Management</h1>
              <p className="tu-page-sub">{totalUsers} total users across all pages</p>
            </div>
          </div>

          {/* Error */}
          {error && <div className="tu-error">⚠ {error}</div>}

          {/* Controls */}
          <div className="tu-controls">
            <div className="tu-search-wrap">
              <span className="tu-search-icon">🔍</span>
              <input
                type="text"
                className="tu-search"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="tu-filter-group">
              {(["all", "user", "admin"] as const).map((r) => (
                <button
                  key={r}
                  className={`tu-filter-btn${roleFilter === r ? " active" : ""}`}
                  onClick={() => setRoleFilter(r)}
                >
                  {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <span className="tu-count">{filteredUsers.length} shown</span>
          </div>

          {/* Table */}
          <div className="tu-card">
            <div className="tu-table-wrap">
              <table className="tu-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="tu-empty">
                          <div className="tu-empty-icon">👥</div>
                          No users found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const uid = getUserId(user);
                      return (
                        <tr key={uid || user.email}>
                          <td>
                            <div className="tu-user-cell">
                              <div className="tu-avatar">{getAvatar(user)}</div>
                              <span className="tu-user-name">
                                {user.firstName && user.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.firstName || user.username || "—"}
                              </span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td style={{ color: "var(--muted)" }}>
                            {user.username ? `@${user.username}` : "—"}
                          </td>
                          <td>
                            <span className={`tu-role ${user.role}`}>{user.role}</span>
                          </td>
                          <td>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>
                          <td>
                            <div className="tu-actions">
                              <Link
                                href={`/admin/users/${uid}`}
                                className="tu-btn tu-btn-view"
                              >
                                View
                              </Link>
                              <Link
                                href={`/admin/users/${uid}/edit`}
                                className="tu-btn tu-btn-edit"
                              >
                                Edit
                              </Link>
                              <button
                                className="tu-btn tu-btn-delete"
                                onClick={() => setDeleteId(uid)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="tu-pagination">
              <span className="tu-page-info">
                Page {page} of {totalPages} · {totalUsers} users
              </span>
              <div className="tu-page-btns">
                <button
                  className="tu-page-arrow"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span
                          style={{
                            color: "var(--muted)",
                            fontSize: "0.72rem",
                            padding: "0 0.2rem",
                          }}
                        >
                          …
                        </span>
                      )}
                      <button
                        className={`tu-page-btn${page === p ? " current" : ""}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  className="tu-page-arrow"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="tu-modal-bg" onClick={() => setDeleteId(null)}>
          <div className="tu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tu-modal-icon">🗑️</div>
            <h3 className="tu-modal-title">Delete User</h3>
            <p className="tu-modal-desc">
              Are you sure you want to delete this user? This action is permanent and cannot
              be undone.
            </p>
            <div className="tu-modal-actions">
              <button className="tu-modal-cancel" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button
                className="tu-modal-confirm"
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}