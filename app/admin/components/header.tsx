"use client"

import { useEffect, useState } from "react"
import NotificationBell from "./notification/notification-bell"
import ProfilePanel from "./profile/profile-panel"

interface HeaderProps {
  title: string
  subtitle: string
}

export default function Header({ title, subtitle }: HeaderProps) {

  const [time, setTime] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {

    const updateTime = () => {

      const now = new Date()

      setTime(
        now.toLocaleTimeString("id-ID", { hour12: false })
      )

      setDate(
        now.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric"
        })
      )

    }

    updateTime()

    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)

  }, [])

  return (

    <header
  className="
  relative
  flex items-center justify-between
  px-10 py-6
  bg-[#182758]
  border border-[#252564]
  rounded-xl
  overflow-visible"
>

      {/* Neon Bottom Line */}

      <div className="
        absolute bottom-0 left-0 right-0 h-0.5
        bg-linear-to-r
        from-transparent
        via-cyan-400
        to-transparent
        shadow-[0_0_12px_rgba(0,198,255,0.5)]
      " />

      {/* Top Line */}

      <div className="
        absolute top-0 left-0 right-0 h-px
        bg-linear-to-r
        from-transparent
        via-white/10
        to-transparent
      " />

      {/* Background Glow */}

      <div className="
        absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_at_5%_50%,rgba(0,198,255,0.05),transparent_50%),radial-gradient(ellipse_at_95%_50%,rgba(162,89,255,0.05),transparent_50%)]
      " />



      {/* LEFT SIDE */}

      <div className="relative z-10 flex items-center gap-6">

        <div className="relative">

          <h1 className="
            font-['Orbitron']
            text-3xl
            font-black
            tracking-[5px]
            bg-linear-to-r
            from-cyan-400
            to-purple-500
            bg-clip-text
            text-transparent
          ">
            ORBIT
          </h1>

          <div className="
            absolute inset-0
            blur-lg
            opacity-40
            bg-linear-to-r
            from-cyan-400
            to-purple-500
            bg-clip-text
            text-transparent
          ">
            ORBIT
          </div>

        </div>


        <div className="w-px h-12 bg-linear-to-b from-transparent via-cyan-400/40 to-transparent" />

        <div>

          <h2 className="
            text-sm
            tracking-[3px]
            uppercase
            font-semibold
            text-blue-100
          ">
            {title}
          </h2>

          <p className="
            text-[10px]
            tracking-[3px]
            uppercase
            text-blue-400
            mt-1
          ">
            {subtitle}
          </p>

        </div>

      </div>



      {/* RIGHT SIDE */}

      <div className="relative z-10 flex items-center gap-6">

        {/* Clock */}

        <div className="text-right">

          <div className="
            font-['Orbitron']
            text-sm
            tracking-[2px]
            text-cyan-400
          ">
            {time}
          </div>

          <div className="text-[10px] tracking-[2px] text-blue-400 mt-1 uppercase">
            {date}
          </div>

        </div>


        <div className="w-px h-10 bg-linear-to-b from-transparent via-white/10 to-transparent" />


        {/* Notification Bell */}

        <NotificationBell />


        {/* Avatar */}

        <ProfilePanel />

      </div>

    </header>

  )

}