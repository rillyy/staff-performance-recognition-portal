"use client"

import NotificationItem from "./notification-item"

export default function NotificationPanel({ data }: any) {

  return (

    <div className="
    absolute
    right-0
    mt-4
    w-85
    bg-[#1a2f6d]
    border border-cyan-400/20
    rounded-xl
    shadow-2xl
    z-50
    overflow-hidden
  ">

      {/* Header */}

      <div className="
      px-4 py-3
      border-b border-cyan-400/10
      flex items-center justify-between
    ">

        <span className="text-sm font-semibold text-cyan-300">
          Notifikasi
        </span>

      </div>


      {/* Content */}

      <div className="max-h-80 overflow-y-auto p-3 space-y-3">

        {data.length === 0 && (

          <p className="text-sm text-blue-300 text-center py-6">
            Belum ada notifikasi
          </p>

        )}

        {data.map((n: any) => (

          <NotificationItem
            key={n.id}
            notif={n}
          />

        ))}

      </div>


      {/* Footer */}

      <div className="
      border-t border-cyan-400/10
      px-4 py-2
      text-center
    ">

        <button className="
        text-xs
        text-cyan-300
        hover:text-cyan-200
      ">
          Lihat semua notifikasi
        </button>

      </div>

    </div>

  )

}