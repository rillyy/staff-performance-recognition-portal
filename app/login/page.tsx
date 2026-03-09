"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: any) {

    e.preventDefault()
    setLoading(true)

    /* ================= LOGIN ================= */

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert("Login gagal: " + error.message)
      setLoading(false)
      return
    }

    /* ================= AMBIL ROLE ================= */

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("email", email)
      .single()

    if (profileError || !profile) {
      alert("Role user tidak ditemukan")
      setLoading(false)
      return
    }

    const role = profile.role

    /* ================= REDIRECT ================= */

    if (role === "admin") {
      router.push("/admin")
    } 
    else if (role === "juri") {
      router.push("/juri")
    } 
    else if (role === "verifikator") {
      router.push("/verifikator")
    } 
    else {
      router.push("/")
    }

  }

  return (

    <div className="cosmic-wrapper">

      <div className="cosmic-bg"></div>

      <div className="cosmic-card">

        <div className="c-logo-wrap">

          <div className="c-orbit-graphic">

            <div className="c-planet"></div>
            <div className="c-ring c-ring-1"></div>
            <div className="c-ring c-ring-2"></div>
            <div className="c-ring c-ring-3"></div>

          </div>

          <h1 className="c-title">ORBIT</h1>

          <div className="c-divider"></div>

          <p className="c-sub">
            Outstanding Recognition & Benchmarking Tool
          </p>

        </div>

        <form onSubmit={handleLogin}>

          <label className="c-label">Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            className="c-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="c-label">Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            className="c-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="c-btn">
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

        </form>

      </div>


      <style jsx global>{`

        body {
          margin: 0;
          background: #03010d;
        }

        .cosmic-wrapper {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .cosmic-bg {
          position: absolute;
          inset: 0;
          background:
          radial-gradient(ellipse at 20% 50%, #071a3a 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, #140a3a 0%, transparent 50%),
          radial-gradient(ellipse at 60% 80%, #020617 0%, transparent 60%),
          linear-gradient(135deg, #020617 0%, #03001c 40%, #0a0020 100%);
        }

        .cosmic-card {
          position: relative;
          z-index: 10;
          background: linear-gradient(
          145deg,
          rgba(10, 25, 60, 0.95),
          rgba(5, 15, 40, 0.9)
        );
          border: 1px solid rgba(0, 198, 255, 0.15);
          border-radius: 24px;
          padding: 50px 48px;
          width: 400px;
          backdrop-filter: blur(25px);
          box-shadow:
            0 0 0 1px rgba(0, 198, 255, 0.05),
            0 0 60px rgba(0, 198, 255, 0.08),
            0 40px 80px rgba(0, 0, 0, 0.8);
        }

        .c-logo-wrap {
          text-align: center;
          margin-bottom: 30px;
        }

        .c-orbit-graphic {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto 16px;
        }

        .c-planet {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #7ee8fa, #0e3b5c);
          box-shadow: 0 0 15px #00c6ffaa;
        }

        .c-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          border: 1px solid transparent;
        }

        .c-ring-1 {
          width: 50px;
          height: 50px;
          margin: -25px 0 0 -25px;
          border-color: #00c6ff44;
          border-top-color: #00c6ff;
          animation: spin 2.5s linear infinite;
        }

        .c-ring-2 {
          width: 72px;
          height: 72px;
          margin: -36px 0 0 -36px;
          border-color: #f0a50033;
          border-right-color: #f0a500;
          animation: spin 4.5s linear infinite reverse;
        }

        .c-ring-3 {
          width: 96px;
          height: 96px;
          margin: -48px 0 0 -48px;
          border-color: #a259ff22;
          border-left-color: #a259ff;
          animation: spin 7s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .c-title {
          font-size: 28px;
          letter-spacing: 8px;
          background: linear-gradient(135deg, #00c6ff, #fff, #a259ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .c-divider {
          height: 1px;
          width: 120px;
          background: linear-gradient(90deg, transparent, #00c6ff, transparent);
          margin: 8px auto;
        }

        .c-sub {
          font-size: 10px;
          color: #4a6a8a;
          letter-spacing: 2px;
        }

        .c-label {
          font-size: 11px;
          color: #3a6a8a;
          margin-bottom: 6px;
          display: block;
        }

        .c-input {
          width: 100%;
          background: rgba(0, 198, 255, 0.05);
          border: 1px solid #0c3a5a;
          border-radius: 8px;
          padding: 12px;
          color: #a8d8f0;
          margin-bottom: 20px;
          outline: none;
        }

        .c-input:focus {
          border-color: #00c6ff66;
          box-shadow: 0 0 0 3px #00c6ff22;
        }

        .c-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0057b7, #00c6ff);
          border: none;
          border-radius: 8px;
          color: white;
          letter-spacing: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .c-btn:hover {
          box-shadow: 0 0 25px #00c6ff55;
          transform: translateY(-1px);
        }

      `}</style>

    </div>

  )

}