"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getUserById, updateUser } from "@/lib/api/admin.api";

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
}

export default function AdminUserEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
    phone: "",
    role: "user",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getUserById(id as string);
        const user = data.data;
        setFormData({
          username: user.username || "",
          email: user.email || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          bio: user.bio || "",
          phone: user.phone || "",
          role: user.role || "user",
        });
        if (user.profileImage) {
          const proxiedUrl = user.profileImage.startsWith("/uploads")
            ? `/api/image-proxy?url=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profileImage}`
              )}`
            : user.profileImage;
          setImagePreview(proxiedUrl);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPG, PNG, GIF, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setSelectedFile(file);
    setShouldRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    setShouldRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      if (shouldRemoveImage) form.append("removeImage", "true");
      else if (selectedFile) form.append("image", selectedFile);
      await updateUser(id as string, form);
      setSuccess("User updated successfully!");
      setTimeout(() => router.push(`/admin/users/${id}`), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setSubmitting(false);
    }
  };

  const getDefaultAvatar = () =>
    formData.firstName
      ? formData.firstName[0].toUpperCase()
      : formData.email?.[0]?.toUpperCase() || "U";

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&display=swap');
          .te-loader { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0C0B09; font-family:'Outfit',sans-serif; }
          .te-spinner { width:34px; height:34px; border:2px solid rgba(201,169,110,0.15); border-top-color:#C9A96E; border-radius:50%; animation:spin 0.7s linear infinite; }
          @keyframes spin { to { transform:rotate(360deg); } }
          .te-load-txt { margin-top:0.9rem; font-size:0.75rem; letter-spacing:0.1em; color:rgba(237,232,223,0.3); text-transform:uppercase; }
        `}</style>
        <div className="te-loader">
          <div style={{ textAlign: "center" }}>
            <div className="te-spinner" />
            <p className="te-load-txt">Loading user…</p>
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
          --red:      #E06C75;
          --red-dim:  rgba(224,108,117,0.1);
          --green:    #88C0A0;
          --green-dim:rgba(136,192,160,0.1);
        }

        .te-wrap { background:var(--bg); min-height:100vh; font-family:'Outfit',sans-serif; font-weight:300; color:var(--text); }

        /* Topbar */
        .te-topbar { height:58px; background:var(--sidebar); border-bottom:1px solid var(--border); padding:0 2rem; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:10; }
        .te-breadcrumb { display:flex; align-items:center; gap:0.5rem; font-size:0.78rem; color:var(--muted); }
        .te-breadcrumb a { color:var(--muted); text-decoration:none; transition:color 0.15s; }
        .te-breadcrumb a:hover { color:var(--gold); }
        .te-breadcrumb strong { color:var(--text); font-weight:500; }

        /* Page */
        .te-page { padding:2rem 2rem 4rem; display:flex; flex-direction:column; align-items:center; }
        .te-inner { width:100%; max-width:580px; }
        .te-heading { font-family:'Playfair Display',serif; font-size:clamp(1.5rem,2.5vw,2rem); font-weight:400; color:var(--text); margin-bottom:0.3rem; }
        .te-sub { font-size:0.8rem; color:var(--muted); margin-bottom:1.8rem; }

        /* Card */
        .te-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:2rem; }

        /* Messages */
        .te-error { background:var(--red-dim); border:1px solid rgba(224,108,117,0.2); border-radius:7px; padding:0.7rem 1rem; font-size:0.78rem; color:var(--red); margin-bottom:1.4rem; display:flex; align-items:center; gap:0.5rem; }
        .te-success { background:var(--green-dim); border:1px solid rgba(136,192,160,0.2); border-radius:7px; padding:0.7rem 1rem; font-size:0.78rem; color:var(--green); margin-bottom:1.4rem; display:flex; align-items:center; gap:0.5rem; }

        /* Avatar */
        .te-avatar-section { display:flex; flex-direction:column; align-items:center; gap:1rem; margin-bottom:1.8rem; padding-bottom:1.8rem; border-bottom:1px solid var(--border); }
        .te-avatar-wrap { position:relative; width:90px; height:90px; cursor:pointer; }
        .te-avatar-ring { width:90px; height:90px; border-radius:50%; overflow:hidden; background:var(--gold-dim); border:2px solid rgba(201,169,110,0.3); display:flex; align-items:center; justify-content:center; }
        .te-avatar-ring img { width:100%; height:100%; object-fit:cover; }
        .te-avatar-letter { font-family:'Playfair Display',serif; font-size:1.6rem; font-weight:400; color:var(--gold); }
        .te-avatar-overlay { position:absolute; inset:0; border-radius:50%; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.18s; }
        .te-avatar-wrap:hover .te-avatar-overlay { opacity:1; }
        .te-avatar-overlay span { font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#fff; font-weight:500; }
        .te-avatar-hint { font-size:0.7rem; color:var(--muted); text-align:center; line-height:1.5; }
        .te-avatar-btns { display:flex; gap:0.5rem; }
        .te-img-btn { font-family:'Outfit',sans-serif; font-size:0.68rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; padding:0.38rem 0.9rem; border-radius:5px; cursor:pointer; transition:all 0.15s; border:1px solid; }
        .te-img-btn-choose { color:var(--gold); background:var(--gold-dim); border-color:rgba(201,169,110,0.2); }
        .te-img-btn-choose:hover { background:rgba(201,169,110,0.2); }
        .te-img-btn-remove { color:var(--muted); background:rgba(255,255,255,0.04); border-color:var(--border); }
        .te-img-btn-remove:hover:not(:disabled) { color:var(--red); border-color:rgba(224,108,117,0.2); }
        .te-img-btn-remove:disabled { opacity:0.35; cursor:not-allowed; }

        /* Form */
        .te-section-label { font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted); margin-bottom:0.9rem; opacity:0.7; }
        .te-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
        @media (max-width:480px) { .te-grid-2 { grid-template-columns:1fr; } }
        .te-field { display:flex; flex-direction:column; gap:0.35rem; margin-bottom:1rem; }
        .te-field:last-child { margin-bottom:0; }
        .te-label { font-size:0.72rem; font-weight:500; color:var(--dim); letter-spacing:0.04em; }
        .te-label span { color:var(--gold); margin-left:2px; }
        .te-input, .te-select, .te-textarea {
          width:100%; background:var(--surface2); border:1px solid var(--border); border-radius:7px;
          padding:0.6rem 0.85rem; font-family:'Outfit',sans-serif; font-size:0.82rem; font-weight:300;
          color:var(--text); outline:none; transition:border-color 0.18s, box-shadow 0.18s;
        }
        .te-input::placeholder, .te-textarea::placeholder { color:var(--muted); }
        .te-input:focus, .te-select:focus, .te-textarea:focus { border-color:rgba(201,169,110,0.35); box-shadow:0 0 0 3px rgba(201,169,110,0.06); }
        .te-textarea { resize:vertical; min-height:80px; }
        .te-select { cursor:pointer; -webkit-appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A7060' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 0.85rem center; background-color:var(--surface2); padding-right:2.2rem; }
        .te-select option { background:#1E1C15; color:var(--text); }

        /* Role toggle */
        .te-role-group { display:flex; gap:0.5rem; margin-bottom:1rem; }
        .te-role-btn { flex:1; font-family:'Outfit',sans-serif; font-size:0.75rem; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; padding:0.55rem; border-radius:7px; border:1px solid var(--border); background:var(--surface2); color:var(--muted); cursor:pointer; transition:all 0.18s; display:flex; align-items:center; justify-content:center; gap:0.4rem; }
        .te-role-btn:hover { color:var(--text); border-color:rgba(255,220,120,0.15); }
        .te-role-btn.active-user { background:rgba(136,192,160,0.1); border-color:rgba(136,192,160,0.25); color:#88C0A0; }
        .te-role-btn.active-admin { background:var(--gold-dim); border-color:rgba(201,169,110,0.3); color:var(--gold); }

        /* Divider */
        .te-divider { height:1px; background:var(--border); margin:1.5rem 0; }

        /* Submit */
        .te-submit { width:100%; margin-top:1.5rem; font-family:'Outfit',sans-serif; font-size:0.8rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; padding:0.75rem; border-radius:8px; border:none; background:var(--gold); color:#0C0B09; cursor:pointer; transition:opacity 0.18s, transform 0.15s; display:flex; align-items:center; justify-content:center; gap:0.5rem; }
        .te-submit:hover:not(:disabled) { opacity:0.88; transform:translateY(-1px); }
        .te-submit:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
        .te-spinner-sm { width:14px; height:14px; border:2px solid rgba(12,11,9,0.2); border-top-color:#0C0B09; border-radius:50%; animation:spin 0.6s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <div className="te-wrap">
        {/* Topbar */}
        <header className="te-topbar">
          <div className="te-breadcrumb">
            <Link href="/admin/dashboard">Admin</Link>
            <span style={{ opacity: 0.3 }}>/</span>
            <Link href="/admin/users">Users</Link>
            <span style={{ opacity: 0.3 }}>/</span>
            <Link href={`/admin/users/${id}`}>View</Link>
            <span style={{ opacity: 0.3 }}>/</span>
            <strong>Edit</strong>
          </div>
        </header>

        {/* Page */}
        <div className="te-page">
          <div className="te-inner">
            <h1 className="te-heading">Edit User</h1>
            <p className="te-sub">Update account details for this user.</p>

            <div className="te-card">
              {error   && <div className="te-error">  <span>⚠</span> {error}   </div>}
              {success && <div className="te-success"><span>✓</span> {success} </div>}

              <form onSubmit={handleSubmit}>

                {/* ── Avatar ── */}
                <div className="te-avatar-section">
                  <div className="te-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
                    <div className="te-avatar-ring">
                      {imagePreview
                        ? <img src={imagePreview} alt="Preview" />
                        : <span className="te-avatar-letter">{getDefaultAvatar()}</span>
                      }
                    </div>
                    <div className="te-avatar-overlay"><span>Change</span></div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  <div className="te-avatar-btns">
                    <button type="button" className="te-img-btn te-img-btn-choose" onClick={() => fileInputRef.current?.click()}>
                      Choose Photo
                    </button>
                    <button type="button" className="te-img-btn te-img-btn-remove" onClick={handleRemoveImage} disabled={!imagePreview}>
                      Remove
                    </button>
                  </div>
                  <p className="te-avatar-hint">JPG, PNG, GIF, WebP · Max 5MB</p>
                </div>

                {/* ── Personal Info ── */}
                <p className="te-section-label">Personal Info</p>
                <div className="te-grid-2">
                  <div className="te-field">
                    <label className="te-label">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className="te-input" />
                  </div>
                  <div className="te-field">
                    <label className="te-label">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className="te-input" />
                  </div>
                </div>

                <div className="te-field">
                  <label className="te-label">Username <span>*</span></label>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="username" required className="te-input" />
                </div>

                <div className="te-field">
                  <label className="te-label">Email <span>*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required className="te-input" />
                </div>

                <div className="te-grid-2">
                  <div className="te-field">
                    <label className="te-label">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" className="te-input" />
                  </div>
                  <div className="te-field" style={{ marginBottom: 0 }}>
                    <label className="te-label">Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short bio…" className="te-textarea" style={{ minHeight: "42px" }} />
                  </div>
                </div>

                <div className="te-divider" />

                {/* ── Role ── */}
                <p className="te-section-label">Role</p>
                <div className="te-role-group">
                  <button
                    type="button"
                    className={`te-role-btn${formData.role === "user" ? " active-user" : ""}`}
                    onClick={() => setFormData((p) => ({ ...p, role: "user" }))}
                  >
                    👤 User
                  </button>
                  <button
                    type="button"
                    className={`te-role-btn${formData.role === "admin" ? " active-admin" : ""}`}
                    onClick={() => setFormData((p) => ({ ...p, role: "admin" }))}
                  >
                    ⚙️ Admin
                  </button>
                </div>

                {/* ── Submit ── */}
                <button type="submit" disabled={submitting} className="te-submit">
                  {submitting
                    ? <><div className="te-spinner-sm" /> Updating…</>
                    : "Save Changes"
                  }
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}