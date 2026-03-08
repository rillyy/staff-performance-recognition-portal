"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function LaporanPage() {

  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [triwulan, setTriwulan] = useState("1")
  const [hasil, setHasil] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  function getRangeBulan() {
    switch (triwulan) {
      case "1":
        return ["01", "03"]
      case "2":
        return ["04", "06"]
      case "3":
        return ["07", "09"]
      case "4":
        return ["10", "12"]
      default:
        return ["01", "03"]
    }
  }

  async function generateLaporan() {

    setLoading(true)

    const [startMonth, endMonth] = getRangeBulan()

    const startDate = `${tahun}-${startMonth}-01`
    const endDate = `${tahun}-${endMonth}-31`

    const { data } = await supabase
      .from("nilai_final")
      .select(`
        total_nilai,
        periode_bulan,
        pegawai (
          id,
          nama,
          tim
        )
      `)
      .gte("periode_bulan", startDate)
      .lte("periode_bulan", endDate)
      .order("total_nilai", { ascending: false })

    if (!data) {
      setLoading(false)
      return
    }

    const bestPerTim: any = {}

    data.forEach((item: any) => {
      const tim = item.pegawai.tim
      if (!bestPerTim[tim]) {
        bestPerTim[tim] = item
      }
    })

    setHasil(Object.values(bestPerTim))
    setLoading(false)
  }

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 px-6 sm:px-10 py-10">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= FORM ================= */}

        <div className="
          bg-[#1a2f6d]/80
          backdrop-blur-xl
          border border-cyan-400/15
          rounded-2xl
          shadow-lg
          p-8
        ">

          <h1 className="text-2xl font-bold mb-8 text-cyan-300 tracking-wide">
            Generate Laporan Triwulanan
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">

            <div>
              <label className="block mb-2 text-sm font-medium text-blue-200">
                Tahun
              </label>

              <input
                type="number"
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className="
                  w-full
                  bg-[#0f1c3f]
                  border border-cyan-400/20
                  rounded-lg
                  px-4 py-2
                "
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-blue-200">
                Triwulan
              </label>

              <select
                value={triwulan}
                onChange={(e) => setTriwulan(e.target.value)}
                className="
                  w-full
                  bg-[#0f1c3f]
                  border border-cyan-400/20
                  rounded-lg
                  px-4 py-2
                "
              >
                <option value="1">Triwulan 1 (Jan–Mar)</option>
                <option value="2">Triwulan 2 (Apr–Jun)</option>
                <option value="3">Triwulan 3 (Jul–Sep)</option>
                <option value="4">Triwulan 4 (Okt–Des)</option>
              </select>
            </div>

          </div>

          <button
            onClick={generateLaporan}
            disabled={loading}
            className="
              px-6 py-2
              rounded-lg
              bg-linear-to-r
              from-cyan-500
              to-blue-600
              text-white
              font-semibold
              hover:scale-105
              transition
            "
          >
            {loading ? "Memproses..." : "Generate Laporan"}
          </button>

        </div>


        {/* ================= HASIL ================= */}

        <div className="
          bg-[#1a2f6d]/80
          backdrop-blur-xl
          border border-cyan-400/15
          rounded-2xl
          shadow-lg
          p-8
        ">

          <h2 className="text-xl font-bold mb-8 text-cyan-300">
            Hasil Rekapan Terbaik Per Tim
          </h2>

          {hasil.length === 0 && (
            <p className="text-blue-300/60">
              Belum ada laporan
            </p>
          )}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {hasil.map((item: any) => (

              <div
                key={item.pegawai.id}
                className="
                  bg-[#0f1c3f]
                  border border-cyan-400/15
                  rounded-xl
                  p-6
                "
              >

                <h3 className="font-bold text-cyan-300 uppercase mb-2">
                  {item.pegawai.tim}
                </h3>

                <p className="text-lg font-semibold text-white">
                  {item.pegawai.nama}
                </p>

                <p className="text-sm text-blue-300 mt-1">
                  Total Nilai: {item.total_nilai}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}