"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, getIdToken } from "firebase/auth";
import { getFirebaseAuth } from "../../../lib/firebase-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getFirebaseAuth();
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await getIdToken(credential.user, true);

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Gagal membuat sesi admin.");
      }

      router.push("/admin");
      router.refresh();
    } catch (loginError) {
      setError(loginError.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <div className="hero">
        <div>
          <span className="eyebrow">Admin Login</span>
          <h1 className="hero-title">Masuk ke dashboard admin</h1>
          <p className="hero-copy">
            Login ini memakai Firebase Auth. Setelah berhasil, server membuat session cookie
            httpOnly untuk mengamankan dashboard, produk, dan workflow order.
          </p>
        </div>
        <div className="panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email admin</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error ? <p className="auth-error">{error}</p> : null}
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in with Firebase"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
