"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import NotificationPanel from "./notification-panel"

export default function NotificationBell() {

  const [open, setOpen] = useState(false)
  const [notif, setNotif] = useState<any[]>([])

  useEffect(() => {
    loadNotif()
  }, [])

  async function loadNotif() {

    const { data, error } = await supabase
      .from("notifikasi")
      .select("*")
      .or("role_target.eq.semua,role_target.eq.admin")
      .order("created_at", { ascending: false })
      .limit(5)

    if (error) {
      console.log(error)
      return
    }

    setNotif(data || [])
  }

  return (
    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="
        flex items-center gap-2
        bg-[#2b36a8]
        border border-[#1a1a35]
        rounded-lg
        px-4 py-2
        text-blue-200
        hover:bg-cyan-400/10
        transition
      "
      >

        <Bell size={16} className="text-yellow-400" />

        <span className="text-sm">
          Notifikasi
        </span>

        {notif.length > 0 && (

          <span className="
          ml-1
          text-xs
          bg-red-500
          px-2
          py-0.5
          rounded-full
          text-white
        ">
            {notif.length}
          </span>

        )}

      </button>

      {open && (
        <NotificationPanel data={notif} />
      )}

    </div>
  )
}