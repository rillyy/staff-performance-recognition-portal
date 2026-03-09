"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabaseClient"
import { LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePanel() {

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  const panelRef = useRef<HTMLDivElement>(null)

  /* ===============================
     Ambil Profile User
  =============================== */

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (data) setProfile(data)

  }

  /* ===============================
     Close Panel Jika Klik Diluar
  =============================== */

  useEffect(() => {

    function handleClickOutside(event: any) {

      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false)
      }

    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [open])

  /* ===============================
     Logout
  =============================== */

  async function logout() {

    await supabase.auth.signOut()

    router.push("/login")

  }

  return (

    <div className="relative" ref={panelRef}>

      {/* ===============================
          AVATAR BUTTON
      =============================== */}

      <div
        onClick={() => setOpen(!open)}
        className="
          w-9 h-9
          rounded-lg
          bg-linear-to-r
          from-blue-600
          to-cyan-400
          flex items-center justify-center
          text-white
          shadow-[0_0_10px_rgba(0,198,255,0.3)]
          cursor-pointer
          hover:shadow-[0_0_20px_rgba(0,198,255,0.6)]
          transition
        "
      >
        <User size={18} />
      </div>


      {/* ===============================
          PROFILE PANEL
      =============================== */}

      {open && (

        <div
          className="
            absolute right-0 mt-3
            w-60
            bg-[#132a5c]
            border border-cyan-400/20
            rounded-xl
            shadow-[0_0_25px_rgba(0,198,255,0.15)]
            p-4
            z-50
          "
        >

          {/* USER INFO */}

          <div className="border-b border-cyan-400/10 pb-3 mb-3">

            <p className="text-sm font-semibold text-cyan-300">
              {profile?.nama || "Admin"}
            </p>

            <p className="text-xs text-blue-400 uppercase">
              {profile?.role || "Administrator"}
            </p>

          </div>


          {/* LOGOUT */}

          <button
            onClick={logout}
            className="
              w-full
              flex items-center gap-2
              px-3 py-2
              rounded-lg
              text-sm
              hover:bg-red-500/10
              text-red-400
              transition
            "
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>

      )}

    </div>

  )

}