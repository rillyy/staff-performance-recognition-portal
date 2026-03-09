export default function NotificationItem({ notif }: any) {

  /* =========================================
     Menentukan warna berdasarkan tipe notif
  ========================================== */

  const warna =
    notif.tipe === "deadline"
      ? "text-orange-400"
      : notif.tipe === "warning"
      ? "text-red-400"
      : "text-cyan-300"


  return (

    <div
      className="
        p-3
        bg-[#132a5c]
        rounded-lg
        border border-cyan-400/10
        hover:border-cyan-400/40
        transition
        cursor-pointer
      "
    >

      {/* Judul Notifikasi */}

      <p
        className={`
          text-sm
          font-semibold
          ${warna}
        `}
      >
        {notif.judul}
      </p>


      {/* Pesan Notifikasi */}

      <p
        className="
          text-xs
          text-blue-200
          mt-1
        "
      >
        {notif.pesan}
      </p>


      {/* Deadline */}

      {notif.deadline && (

        <p
          className="
            text-xs
            text-orange-400
            mt-2
          "
        >
          Deadline:{" "}
          {new Date(notif.deadline).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </p>

      )}

    </div>

  )

}