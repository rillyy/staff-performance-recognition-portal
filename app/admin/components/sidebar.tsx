"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

import {
  LayoutDashboard,
  FileText,
  Upload,
  Users,
  Award,
  CheckCircle,
  History,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Bell,
  User
} from "lucide-react"

export default function Sidebar() {

  const pathname = usePathname()
  const router = useRouter()

  const [openCertificate, setOpenCertificate] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [profile, setProfile] = useState<any>(null)

  function isActive(path: string) {
    return pathname === path
  }

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

    if (data) {
      setProfile(data)
    }

  }

  async function logout() {

    await supabase.auth.signOut()
    router.push("/login")

  }

  return (
    <>

      {/* MOBILE TOP BAR */}

      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0b1635] border-b border-cyan-400/10 flex items-center px-4 z-50">

        <button onClick={() => setMobileOpen(true)}>
          <Menu className="text-cyan-400" />
        </button>

        <span className="ml-4 font-bold tracking-widest bg-linear-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
          ORBIT
        </span>

      </div>

      {/* OVERLAY */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <div
        data-collapsed={collapsed}
        className={`
        sidebar
        fixed top-0 left-0 h-screen
        bg-linear-to-b from-[#0f1c3f] to-[#132a5c]
        border-r border-cyan-400/10
        shadow-[0_0_40px_rgba(0,198,255,0.08)]
        flex flex-col
        overflow-y-auto
        transition-all duration-300
        z-50
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >

        {/* CLOSE MOBILE */}

        <div className="lg:hidden flex justify-end p-4">

          <button onClick={() => setMobileOpen(false)}>
            <X className="text-cyan-400" />
          </button>

        </div>

        {/* LOGO */}

        <div className="flex flex-col items-center py-8 border-b border-cyan-400/10">

          <div className="relative w-25 h-25 mb-4">

            <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/20 border-l-purple-500 animate-[spin_7s_linear_infinite]" />

            <div className="absolute top-1/2 left-1/2 w-18 h-18 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-400/30 border-r-orange-400 animate-[spin_4.5s_linear_infinite_reverse]" />

            <div className="absolute top-1/2 left-1/2 w-12.5 h-12.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40 border-t-cyan-400 animate-[spin_2.5s_linear_infinite]" />

            <div className="absolute top-1/2 left-1/2 w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#7ee8fa,#0e3b5c)] shadow-[0_0_15px_#00c6ffaa]" />

          </div>

          {!collapsed && (
            <>
              <h1 className="
              text-[28px]
              font-black
              tracking-[8px]
              bg-linear-to-r
              from-cyan-400
              via-white
              to-purple-500
              bg-clip-text
              text-transparent
              font-['Orbitron']
            ">
                ORBIT
              </h1>

              <div className="h-px w-30 bg-linear-to-r from-transparent via-cyan-400 to-transparent mt-2" />

              <p className="text-[10px] tracking-widest text-blue-300/50 mt-3 text-center leading-relaxed">
                Outstanding Recognition <br />
                & Benchmarking Tool
              </p>
            </>
          )}

        </div>

        {/* MENU */}

        <nav className="flex-1 px-3 py-6 space-y-2 text-sm">

          {menuItem("/admin", "Dashboard", <LayoutDashboard size={18} />, collapsed, isActive)}

          {menuItem("/admin/input-nilai", "Input Nilai Final", <FileText size={18} />, collapsed, isActive)}

          {menuItem("/admin/upload", "Upload Excel", <Upload size={18} />, collapsed, isActive)}

          {menuItem("/admin/pegawai", "Kelola Pegawai", <Users size={18} />, collapsed, isActive)}

          {menuItem("/admin/laporan", "Generate Laporan", <FileText size={18} />, collapsed, isActive)}

          {menuItem("/admin/penilaian-juri", "Penilaian Juri", <Award size={18} />, collapsed, isActive)}

          {menuItem("/admin/notifikasi", "Notifikasi", <Bell size={18} />, collapsed, isActive)}

          {/* DROPDOWN */}

          <div>

            <button
              onClick={() => setOpenCertificate(!openCertificate)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-cyan-500/10 hover:text-cyan-300 transition"
            >

              <div className="flex items-center gap-3">

                <Award size={18} />

                {!collapsed && "Sertifikat"}

              </div>

              {!collapsed && (
                openCertificate
                  ? <ChevronDown size={16} />
                  : <ChevronRight size={16} />
              )}

            </button>

            {openCertificate && !collapsed && (

              <div className="ml-7 mt-2 space-y-2 text-blue-300">

                <Link href="/admin/sertifikat/upload" className="block hover:text-cyan-300 transition">
                  Upload Sertifikat
                </Link>

                <Link href="/admin/sertifikat/lihat" className="block hover:text-cyan-300 transition">
                  Lihat Sertifikat
                </Link>

              </div>

            )}

          </div>

          {menuItem("/admin/approval", "Approval", <CheckCircle size={18} />, collapsed, isActive)}

          {menuItem("/admin/history", "Arsip / History", <History size={18} />, collapsed, isActive)}

        </nav>

        {/* PROFILE */}

        <div className="px-3 py-4 border-t border-cyan-400/10">

          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-500/10 transition">

            <div className="
              w-9 h-9
              rounded-full
              bg-linear-to-br
              from-blue-600
              to-cyan-400
              flex items-center justify-center
              text-white
              shadow-[0_0_15px_rgba(0,198,255,0.4)]
            ">
              <User size={16} />
            </div>

            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">

                  <p className="text-sm font-semibold text-blue-200 truncate">
                    {profile?.nama || "Admin"}
                  </p>

                  <p className="text-[10px] tracking-wider text-blue-400/60 uppercase">
                    {profile?.role || "Administrator"}
                  </p>

                </div>

                <LogOut
                  size={16}
                  onClick={logout}
                  className="
                    text-blue-400/50
                    hover:text-red-400
                    transition
                    cursor-pointer
                  "
                />

              </>
            )}

          </div>

          {/* COLLAPSE BUTTON */}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block mt-4 w-full text-xs text-cyan-400/60 hover:text-cyan-300 transition"
          >

            {collapsed ? "Expand" : "Collapse"}

          </button>

        </div>

      </div>

    </>
  )
}

function menuItem(path: string, label: string, icon: any, collapsed: boolean, isActive: any) {

  return (
    <Link
      href={path}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition-all
        ${isActive(path)
          ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/20"
          : "hover:bg-cyan-500/10 hover:text-cyan-300"}
      `}
    >

      {icon}

      {!collapsed && label}

    </Link>
  )

}