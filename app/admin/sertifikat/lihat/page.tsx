"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function LihatSertifikatPage() {

  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    getSertifikat()
  }, [])

  async function getSertifikat() {

    const { data } = await supabase
      .from("sertifikat")
      .select(`
        id,
        periode,
        tahun,
        file_url,
        pegawai (
          nama,
          tim
        )
      `)
      .order("created_at", { ascending: false })

    setData(data || [])
  }

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 px-6 sm:px-10 py-10">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= HEADER ================= */}

        <div className="
          bg-[#1a2f6d]/80
          backdrop-blur-xl
          border border-cyan-400/15
          rounded-2xl
          shadow-lg
          p-8
        ">

          <h1 className="text-2xl font-bold text-cyan-300 tracking-wide">
            Lihat Sertifikat Pegawai
          </h1>

          <p className="text-blue-300/70 text-sm mt-2">
            Daftar sertifikat kegiatan pegawai yang telah diupload
          </p>

        </div>


        {/* ================= LIST SERTIFIKAT ================= */}

        <div className="
          bg-[#1a2f6d]/80
          backdrop-blur-xl
          border border-cyan-400/15
          rounded-2xl
          shadow-lg
          p-8
        ">

          <h2 className="text-xl font-bold mb-8 text-cyan-300">
            Data Sertifikat
          </h2>

          {data.length === 0 && (
            <p className="text-blue-300/60">
              Belum ada sertifikat
            </p>
          )}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {data.map((item) => (

              <div
                key={item.id}
                className="
                  bg-[#0f1c3f]
                  border border-cyan-400/15
                  rounded-xl
                  p-6
                  flex flex-col
                  justify-between
                "
              >

                <div>

                  <p className="text-sm text-cyan-300 uppercase mb-1">
                    {item.pegawai.tim}
                  </p>

                  <h3 className="font-semibold text-white text-lg">
                    {item.pegawai.nama}
                  </h3>

                  <p className="text-sm text-blue-300 mt-2">
                    {item.periode} • {item.tahun}
                  </p>

                </div>

                <a
                  href={item.file_url}
                  target="_blank"
                  className="
                    mt-4
                    px-4 py-2
                    text-sm
                    rounded-lg
                    bg-linear-to-r
                    from-purple-500
                    to-cyan-500
                    text-white
                    text-center
                    hover:scale-105
                    transition
                  "
                >
                  Lihat Sertifikat
                </a>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}