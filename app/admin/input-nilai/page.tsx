"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

const BOBOT_KIPAPP = 2

export default function InputNilaiPage() {

  const router = useRouter()

  const [pegawai, setPegawai] = useState<any[]>([])
  const [dataNilai, setDataNilai] = useState<any[]>([])

  const [selectedPegawai, setSelectedPegawai] = useState("")
  const [nilaiFinal, setNilaiFinal] = useState("")
  const [jumlahKipapp, setJumlahKipapp] = useState("")
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPegawai()
    getDataNilai()
  }, [])

  useEffect(() => {
    const nFinal = Number(nilaiFinal) || 0
    const kipapp = Number(jumlahKipapp) || 0
    setTotal(nFinal + kipapp * BOBOT_KIPAPP)
  }, [nilaiFinal, jumlahKipapp])

  async function getPegawai() {
    const { data } = await supabase
      .from("pegawai")
      .select("*")
      .order("nama")

    setPegawai(data || [])
  }

  async function getDataNilai() {
    const { data } = await supabase
      .from("nilai_final")
      .select(`
        id,
        nilai,
        jumlah_kipapp,
        total_nilai,
        pegawai (
          id,
          nama,
          tim
        )
      `)
      .order("total_nilai", { ascending: false })

    setDataNilai(data || [])
  }

  async function simpanNilai() {

    if (!selectedPegawai || !nilaiFinal || !jumlahKipapp) {
      alert("Semua field harus diisi")
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from("nilai_final")
      .upsert(
        {
          pegawai_id: selectedPegawai,
          nilai: Number(nilaiFinal),
          jumlah_kipapp: Number(jumlahKipapp),
          total_nilai: total,
        },
        { onConflict: "pegawai_id" }
      )

    setLoading(false)

    if (!error) {
      alert("Data berhasil disimpan / diperbarui!")
      setSelectedPegawai("")
      setNilaiFinal("")
      setJumlahKipapp("")
      getDataNilai()
    }
  }

  function editData(item: any) {
    setSelectedPegawai(item.pegawai.id)
    setNilaiFinal(item.nilai)
    setJumlahKipapp(item.jumlah_kipapp)
  }

  const groupedByTim = dataNilai.reduce((acc: any, item: any) => {

    const tim = item.pegawai?.tim || "Tanpa Tim"

    if (!acc[tim]) acc[tim] = []

    acc[tim].push(item)

    return acc

  }, {})

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 px-6 sm:px-10 py-10">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= FORM ================= */}

        <div className="bg-[#1a2f6d]/80 backdrop-blur-xl border border-cyan-400/15 rounded-2xl shadow-lg p-8">

          <h1 className="text-2xl font-bold mb-8 text-cyan-300 tracking-wide">
            Input Nilai Final
          </h1>

          <div className="grid md:grid-cols-3 gap-6">

            <div>
              <label className="block mb-2 text-sm font-medium text-blue-200">
                Nama Pegawai
              </label>

              <select
                value={selectedPegawai}
                onChange={(e) => setSelectedPegawai(e.target.value)}
                className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
              >
                <option value="">-- Pilih Pegawai --</option>

                {pegawai.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} - {p.tim}
                  </option>
                ))}

              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-blue-200">
                Nilai Final
              </label>

              <input
                type="number"
                value={nilaiFinal}
                onChange={(e) => setNilaiFinal(e.target.value)}
                className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-blue-200">
                Jumlah Kegiatan KIPAPP
              </label>

              <input
                type="number"
                value={jumlahKipapp}
                onChange={(e) => setJumlahKipapp(e.target.value)}
                className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
              />
            </div>

          </div>

          {/* TOTAL */}

          <div className="mt-8 mb-6 bg-linear-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20 p-5 rounded-xl">

            <p className="text-sm text-blue-300 mb-1">
              Total Nilai Otomatis
            </p>

            <p className="text-3xl font-bold text-cyan-300">
              {total}
            </p>

          </div>

          <div className="flex gap-4">

            <button
              onClick={simpanNilai}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition"
            >
              {loading ? "Menyimpan..." : "Simpan / Update"}
            </button>

            <button
              onClick={() => router.push("/admin")}
              className="px-6 py-2 rounded-lg border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              Kembali
            </button>

          </div>

        </div>

        {/* ================= DATA ================= */}

        <div className="bg-[#1a2f6d]/80 backdrop-blur-xl border border-cyan-400/15 rounded-2xl shadow-lg p-8">

          <h2 className="text-xl font-bold mb-8 text-cyan-300">
            Data Yang Sudah Diinput
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {Object.keys(groupedByTim).map((tim) => (

              <div
                key={tim}
                className="bg-[#0f1c3f] border border-cyan-400/15 rounded-xl p-6"
              >

                <h3 className="text-lg font-bold text-cyan-300 mb-4 uppercase">
                  {tim}
                </h3>

                <div className="space-y-3">

                  {groupedByTim[tim].map((item: any) => (

                    <div
                      key={item.id}
                      className="p-3 bg-[#132a5c] rounded-lg border border-cyan-400/10"
                    >

                      <p className="font-semibold text-white text-sm">
                        {item.pegawai.nama}
                      </p>

                      <p className="text-xs text-blue-300">
                        Nilai: {item.nilai} |
                        KIPAPP: {item.jumlah_kipapp} |
                        Total: {item.total_nilai}
                      </p>

                      <button
                        onClick={() => editData(item)}
                        className="mt-2 text-xs px-3 py-1 rounded-md bg-linear-to-r from-purple-500 to-cyan-500 text-white"
                      >
                        Edit
                      </button>

                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )

}