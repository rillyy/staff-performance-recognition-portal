"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function HistoryPage() {

  const [data, setData] = useState<any[]>([])
  const [tahunFilter, setTahunFilter] = useState("all")

  useEffect(() => {
    getHistory()
  }, [])

  async function getHistory() {

    const { data } = await supabase
      .from("nilai_final")
      .select(`
        id,
        total_nilai,
        periode,
        tahun,
        pegawai (
          nama,
          tim
        )
      `)
      .eq("status", "approved")
      .order("tahun", { ascending: false })

    setData(data || [])
  }

  const filteredData =
    tahunFilter === "all"
      ? data
      : data.filter((d) => d.tahun === Number(tahunFilter))

  const tahunList = [...new Set(data.map((d) => d.tahun))]

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 px-6 sm:px-10 py-10">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}

        <div className="
          bg-[#1a2f6d]/80
          backdrop-blur-xl
          border border-cyan-400/15
          rounded-2xl
          shadow-lg
          p-8
        ">

          <h1 className="text-2xl font-bold text-cyan-300">
            Arsip Pegawai Teladan
          </h1>

          <p className="text-sm text-blue-300/70 mt-2">
            Riwayat pegawai teladan yang telah disetujui
          </p>

        </div>


        {/* FILTER */}

        <div className="
          bg-[#1a2f6d]/80
          backdrop-blur-xl
          border border-cyan-400/15
          rounded-2xl
          shadow-lg
          p-6
        ">

          <label className="text-sm text-blue-300 mr-4">
            Filter Tahun
          </label>

          <select
            value={tahunFilter}
            onChange={(e) => setTahunFilter(e.target.value)}
            className="
              bg-[#0f1c3f]
              border border-cyan-400/20
              rounded-lg
              px-4 py-2
              text-blue-100
            "
          >

            <option value="all">Semua Tahun</option>

            {tahunList.map((tahun) => (
              <option key={tahun} value={tahun}>
                {tahun}
              </option>
            ))}

          </select>

        </div>


        {/* DATA */}

        <div className="
          bg-[#1a2f6d]/80
          backdrop-blur-xl
          border border-cyan-400/15
          rounded-2xl
          shadow-lg
          p-8
        ">

          <h2 className="text-xl font-bold mb-8 text-cyan-300">
            Daftar Arsip
          </h2>

          {filteredData.length === 0 && (
            <p className="text-blue-300/60">
              Belum ada arsip pegawai teladan
            </p>
          )}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredData.map((item) => (

              <div
                key={item.id}
                className="
                  bg-[#0f1c3f]
                  border border-cyan-400/15
                  rounded-xl
                  p-6
                "
              >

                <p className="text-sm text-cyan-300 uppercase">
                  {item.periode} • {item.tahun}
                </p>

                <h3 className="text-lg font-semibold text-white mt-2">
                  {item.pegawai.nama}
                </h3>

                <p className="text-sm text-blue-300 mt-2">
                  Tim : {item.pegawai.tim}
                </p>

                <p className="text-sm text-blue-300">
                  Total Nilai : {item.total_nilai}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )
}