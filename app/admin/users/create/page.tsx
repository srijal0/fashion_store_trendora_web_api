// app/admin/users/create/page.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUser } from "@/lib/api/admin.api";

export default function AdminCreateUserPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "user",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("role", formData.role);
      if (selectedFile) form.append("image", selectedFile);

      await createUser(form);
      setSuccess("User created successfully!");
      setTimeout(() => router.push("/admin/users"), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  const getDefaultAvatar = () =>
    formData.firstName
      ? formData.firstName[0].toUpperCase()
      : formData.email
      ? formData.email[0].toUpperCase()
      : "U";

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

        .tc-wrap {
          background: var(--bg);
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          font-weight: 300;
          color: var(--text);
        }

        /* ── Topbar ── */
        .tc-topbar {
          height: 58px;
          background: var(--sidebar);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 10;
        }

        .tc-breadcrumb {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.78rem; color: var(--muted);
        }
        .tc-breadcrumb a {
          color: var(--muted); text-decoration: none;
          transition: color 0.15s;
        }
        .tc-breadcrumb a:hover { color: var(--gold); }
        .tc-breadcrumb strong { color: var(--text); font-weight: 500; }

        /* ── Page ── */
        .tc-page {
          padding: 2rem 2rem 4rem;
          display: flex; flex-direction: column; align-items: center;
        }

        .tc-inner { width: 100%; max-width: 580px; }

        /* Page heading */
        .tc-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          font-weight: 400; color: var(--text);
          margin-bottom: 0.3rem;
        }
        .tc-sub { font-size: 0.8rem; color: var(--muted); margin-bottom: 1.8rem; }

        /* Card */
        .tc-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 2rem;
        }

        /* Messages */
        .tc-error {
          background: var(--red-dim);
          border: 1px solid rgba(224,108,117,0.2);
          border-radius: 7px;
          padding: 0.7rem 1rem;
          font-size: 0.78rem; color: var(--red);
          margin-bottom: 1.4rem;
          display: flex; align-items: center; gap: 0.5rem;
        }

        .tc-success {
          background: var(--green-dim);
          border: 1px solid rgba(136,192,160,0.2);
          border-radius: 7px;
          padding: 0.7rem 1rem;
          font-size: 0.78rem; color: var(--green);
          margin-bottom: 1.4rem;
          display: flex; align-items: center; gap: 0.5rem;
        }

        /* ── Avatar section ── */
        .tc-avatar-section {
          display: flex; flex-direction: column; align-items: center;
          gap: 1rem; margin-bottom: 1.8rem;
          padding-bottom: 1.8rem;
          border-bottom: 1px solid var(--border);
        }

        .tc-avatar-wrap {
          position: relative; width: 90px; height: 90px; cursor: pointer;
        }

        .tc-avatar-ring {
          width: 90px; height: 90px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--gold-dim);
          border: 2px solid rgba(201,169,110,0.3);
          display: flex; align-items: center; justify-content: center;
        }

        .tc-avatar-ring img { width: 100%; height: 100%; object-fit: cover; }

        .tc-avatar-letter {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem; font-weight: 400;
          color: var(--gold);
        }

        .tc-avatar-overlay {
          position: absolute; inset: 0;
          border-radius: 50%;
          background: rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.18s;
        }
        .tc-avatar-wrap:hover .tc-avatar-overlay { opacity: 1; }

        .tc-avatar-overlay span {
          font-size: 0.65rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: #fff; font-weight: 500;
        }

        .tc-avatar-hint {
          font-size: 0.7rem; color: var(--muted);
          text-align: center; line-height: 1.5;
        }

        .tc-avatar-btns { display: flex; gap: 0.5rem; }

        .tc-img-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0.38rem 0.9rem;
          border-radius: 5px; cursor: pointer;
          transition: all 0.15s; border: 1px solid;
        }

        .tc-img-btn-choose {
          color: var(--gold);
          background: var(--gold-dim);
          border-color: rgba(201,169,110,0.2);
        }
        .tc-img-btn-choose:hover { background: rgba(201,169,110,0.2); }

        .tc-img-btn-remove {
          color: var(--muted);
          background: rgba(255,255,255,0.04);
          border-color: var(--border);
        }
        .tc-img-btn-remove:hover:not(:disabled) { color: var(--red); border-color: rgba(224,108,117,0.2); }
        .tc-img-btn-remove:disabled { opacity: 0.35; cursor: not-allowed; }

        /* ── Form fields ── */
        .tc-section-label {
          font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 0.9rem; opacity: 0.7;
        }

        .tc-grid-2 {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
          margin-bottom: 1rem;
        }
        @media (max-width: 480px) { .tc-grid-2 { grid-template-columns: 1fr; } }

        .tc-field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem; }
        .tc-field:last-child { margin-bottom: 0; }

        .tc-label {
          font-size: 0.72rem; font-weight: 500;
          color: var(--dim); letter-spacing: 0.04em;
        }

        .tc-label span { color: var(--gold); margin-left: 2px; }

        .tc-input, .tc-select {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 7px;
          padding: 0.6rem 0.85rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem; font-weight: 300;
          color: var(--text);
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          -webkit-appearance: none;
        }
        .tc-input::placeholder { color: var(--muted); }
        .tc-input:focus, .tc-select:focus {
          border-color: rgba(201,169,110,0.35);
          box-shadow: 0 0 0 3px rgba(201,169,110,0.06);
        }

        .tc-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A7060' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.85rem center;
          padding-right: 2.2rem;
        }

        .tc-select option { background: #1E1C15; color: var(--text); }

        /* Role toggle */
        .tc-role-group {
          display: flex; gap: 0.5rem; margin-bottom: 1rem;
        }

        .tc-role-btn {
          flex: 1;
          font-family: 'Outfit', sans-serif;
          font-size: 0.75rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0.55rem;
          border-radius: 7px;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--muted);
          cursor: pointer;
          transition: all 0.18s;
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
        }
        .tc-role-btn:hover { color: var(--text); border-color: rgba(255,220,120,0.15); }
        .tc-role-btn.active-user {
          background: rgba(136,192,160,0.1);
          border-color: rgba(136,192,160,0.25);
          color: #88C0A0;
        }
        .tc-role-btn.active-admin {
          background: var(--gold-dim);
          border-color: rgba(201,169,110,0.3);
          color: var(--gold);
        }

        /* Divider */
        .tc-divider {
          height: 1px; background: var(--border);
          margin: 1.5rem 0;
        }

        /* Submit */
        .tc-submit {
          width: 100%; margin-top: 1.5rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          background: var(--gold);
          color: #0C0B09;
          cursor: pointer;
          transition: opacity 0.18s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .tc-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .tc-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        .tc-spinner-sm {
          width: 14px; height: 14px;
          border: 2px solid rgba(12,11,9,0.2);
          border-top-color: #0C0B09;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="tc-wrap">
        {/* Topbar */}
        <header className="tc-topbar">
          <div className="tc-breadcrumb">
            <Link href="/admin/dashboard">Admin</Link>
            <span style={{ opacity: 0.3 }}>/</span>
            <Link href="/admin/users">Users</Link>
            <span style={{ opacity: 0.3 }}>/</span>
            <strong>Create</strong>
          </div>
        </header>

        {/* Page */}
        <div className="tc-page">
          <div className="tc-inner">
            <h1 className="tc-heading">Create User</h1>
            <p className="tc-sub">Add a new account to your Trendora store.</p>

            <div className="tc-card">
              {/* Messages */}
              {error && (
                <div className="tc-error">
                  <span>⚠</span> {error}
                </div>
              )}
              {success && (
                <div className="tc-success">
                  <span>✓</span> {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Avatar */}
                <div className="tc-avatar-section">
                  <div
                    className="tc-avatar-wrap"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="tc-avatar-ring">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" />
                      ) : (
                        <span className="tc-avatar-letter">{getDefaultAvatar()}</span>
                      )}
                    </div>
                    <div className="tc-avatar-overlay">
                      <span>Change</span>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />

                  <div className="tc-avatar-btns">
                    <button
                      type="button"
                      className="tc-img-btn tc-img-btn-choose"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Photo
                    </button>
                    <button
                      type="button"
                      className="tc-img-btn tc-img-btn-remove"
                      onClick={handleRemoveImage}
                      disabled={!selectedFile}
                    >
                      Remove
                    </button>
                  </div>
                  <p className="tc-avatar-hint">JPG, PNG, GIF, WebP · Max 5MB</p>
                </div>

                {/* Personal Info */}
                <p className="tc-section-label">Personal Info</p>
                <div className="tc-grid-2">
                  <div className="tc-field">
                    <label className="tc-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      className="tc-input"
                    />
                  </div>
                  <div className="tc-field">
                    <label className="tc-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className="tc-input"
                    />
                  </div>
                </div>

                <div className="tc-field">
                  <label className="tc-label">
                    Username <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="e.g. johndoe"
                    required
                    className="tc-input"
                  />
                </div>

                <div className="tc-field">
                  <label className="tc-label">
                    Email <span>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    required
                    className="tc-input"
                  />
                </div>

                <div className="tc-divider" />

                {/* Security */}
                <p className="tc-section-label">Security</p>
                <div className="tc-grid-2">
                  <div className="tc-field">
                    <label className="tc-label">
                      Password <span>*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 8 characters"
                      required
                      className="tc-input"
                    />
                  </div>
                  <div className="tc-field">
                    <label className="tc-label">
                      Confirm Password <span>*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      required
                      className="tc-input"
                    />
                  </div>
                </div>

                <div className="tc-divider" />

                {/* Role */}
                <p className="tc-section-label">Role</p>
                <div className="tc-role-group">
                  <button
                    type="button"
                    className={`tc-role-btn${formData.role === "user" ? " active-user" : ""}`}
                    onClick={() => setFormData((p) => ({ ...p, role: "user" }))}
                  >
                    👤 User
                  </button>
                  <button
                    type="button"
                    className={`tc-role-btn${formData.role === "admin" ? " active-admin" : ""}`}
                    onClick={() => setFormData((p) => ({ ...p, role: "admin" }))}
                  >
                    ⚙️ Admin
                  </button>
                </div>

                {/* Submit */}
                <button type="submit" disabled={submitting} className="tc-submit">
                  {submitting ? (
                    <>
                      <div className="tc-spinner-sm" /> Creating…
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}