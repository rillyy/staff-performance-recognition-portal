"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

const BOBOT_KIPAPP = 2

export default function InputNilaiPage() {

  const router = useRouter()

  /* ================================
  STATE
  ================================ */

  const [pegawai, setPegawai] = useState<any[]>([])
  const [dataNilai, setDataNilai] = useState<any[]>([])

  const [selectedPegawai, setSelectedPegawai] = useState("")
  const [nilaiFinal, setNilaiFinal] = useState("")
  const [jumlahKipapp, setJumlahKipapp] = useState("")

  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [triwulan, setTriwulan] = useState("")
  const [bulan, setBulan] = useState("")

  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  /* ================================
  BULAN TRIWULAN
  ================================ */

  const bulanTriwulan: any = {
    1: ["Januari", "Februari", "Maret"],
    2: ["April", "Mei", "Juni"],
    3: ["Juli", "Agustus", "September"],
    4: ["Oktober", "November", "Desember"]
  }

  const bulanToNumber: any = {
    Januari: 1,
    Februari: 2,
    Maret: 3,
    April: 4,
    Mei: 5,
    Juni: 6,
    Juli: 7,
    Agustus: 8,
    September: 9,
    Oktober: 10,
    November: 11,
    Desember: 12
  }

  /* ================================
  LOAD DATA AWAL
  ================================ */

  useEffect(() => {
    getPegawai()
    getDataNilai()
  }, [])

  /* ================================
  HITUNG TOTAL NILAI
  ================================ */

  useEffect(() => {

    const nFinal = Number(nilaiFinal) || 0
    const kipapp = Number(jumlahKipapp) || 0

    setTotal(nFinal + kipapp * BOBOT_KIPAPP)

  }, [nilaiFinal, jumlahKipapp])

  /* ================================
  GET PEGAWAI
  ================================ */

  async function getPegawai() {

    const { data } = await supabase
      .from("pegawai")
      .select("*")
      .order("nama")

    setPegawai(data || [])

  }

  /* ================================
  GET DATA NILAI
  ================================ */

  async function getDataNilai() {

    const { data, error } = await supabase
      .from("nilai_final")
      .select(`
        id,
        nilai,
        jumlah_kipapp,
        total_nilai,
        periode_bulan,
        pegawai:pegawai_id (
          id,
          nama,
          tim
        )
      `)
      .order("periode_bulan", { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setDataNilai(data || [])

  }

  /* ================================
  SIMPAN NILAI
  ================================ */

  async function simpanNilai() {

    if (!selectedPegawai || !nilaiFinal || !jumlahKipapp || !triwulan || !bulan) {
      alert("Semua field harus diisi")
      return
    }

    setLoading(true)

    const monthNumber = bulanToNumber[bulan]

    const periodeDate =
      `${tahun}-${monthNumber.toString().padStart(2, "0")}-01`

    const { error } = await supabase
      .from("nilai_final")
      .upsert(
        {
          pegawai_id: selectedPegawai,
          nilai: Number(nilaiFinal),
          jumlah_kipapp: Number(jumlahKipapp),
          total_nilai: total,
          periode_bulan: periodeDate,
          tahun: tahun,
          periode: `Triwulan ${triwulan}`,
          status: "draft"
        },
        {
          onConflict: "pegawai_id,periode_bulan"
        }
      )

    setLoading(false)

    if (error) {
      console.log(error)
      alert(error.message)
      return
    }

    alert("Data berhasil disimpan")

    setSelectedPegawai("")
    setNilaiFinal("")
    setJumlahKipapp("")
    setBulan("")
    setTriwulan("")

    getDataNilai()

  }

  /* ================================
  EDIT DATA
  ================================ */

  function editData(item: any) {

    setSelectedPegawai(item.pegawai?.id)
    setNilaiFinal(item.nilai)
    setJumlahKipapp(item.jumlah_kipapp)

  }

  /* ================================
  GROUP DATA BULAN → TIM
  ================================ */

  const groupedData = dataNilai.reduce((acc: any, item: any) => {

    const bulan = item.periode_bulan
      ? new Date(item.periode_bulan)
          .toLocaleDateString("id-ID", { month: "long" })
      : "Tidak diketahui"

    const tim = item.pegawai?.tim || "Tanpa Tim"

    if (!acc[bulan]) acc[bulan] = {}

    if (!acc[bulan][tim]) acc[bulan][tim] = []

    acc[bulan][tim].push(item)

    return acc

  }, {})

  /* ================================
  UI
  ================================ */

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 px-6 sm:px-10 py-10">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* FORM INPUT */}

        <div className="bg-[#1a2f6d]/80 border border-cyan-400/15 rounded-2xl shadow-lg p-8">

          <h1 className="text-2xl font-bold mb-8 text-cyan-300">
            Input Nilai Final
          </h1>

          <div className="grid md:grid-cols-4 gap-6">

            {/* TAHUN */}

            <div>

              <label className="text-sm text-blue-200">
                Tahun
              </label>

              <input
                type="number"
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
              />

            </div>

            {/* TRIWULAN */}

            <div>

              <label className="text-sm text-blue-200">
                Triwulan
              </label>

              <select
                value={triwulan}
                onChange={(e) => {
                  setTriwulan(e.target.value)
                  setBulan("")
                }}
                className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
              >

                <option value="">Pilih Triwulan</option>

                <option value="1">Triwulan 1</option>
                <option value="2">Triwulan 2</option>
                <option value="3">Triwulan 3</option>
                <option value="4">Triwulan 4</option>

              </select>

            </div>

            {/* BULAN */}

            <div>

              <label className="text-sm text-blue-200">
                Bulan
              </label>

              <select
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
              >

                <option value="">Pilih Bulan</option>

                {triwulan &&
                  bulanTriwulan[triwulan].map((b: any) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}

              </select>

            </div>

            {/* PEGAWAI */}

            <div>

              <label className="text-sm text-blue-200">
                Pegawai
              </label>

              <select
                value={selectedPegawai}
                onChange={(e) => setSelectedPegawai(e.target.value)}
                className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
              >

                <option value="">Pilih Pegawai</option>

                {pegawai.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} - {p.tim}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* INPUT NILAI */}

          <div className="grid md:grid-cols-2 gap-6 mt-6">

            <div>

              <label className="text-sm text-blue-200">
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

              <label className="text-sm text-blue-200">
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

          {/* TOTAL NILAI */}

          <div className="mt-8 mb-6 bg-cyan-500/10 border border-cyan-400/20 p-5 rounded-xl">

            <p className="text-sm text-blue-300">
              Total Nilai
            </p>

            <p className="text-3xl font-bold text-cyan-300">
              {total}
            </p>

          </div>

          {/* BUTTON */}

          <div className="flex gap-4">

            <button
              onClick={simpanNilai}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold"
            >

              {loading ? "Menyimpan..." : "Simpan"}

            </button>

            <button
              onClick={() => router.push("/admin")}
              className="px-6 py-2 rounded-lg border border-cyan-400/30 text-cyan-300"
            >

              Kembali

            </button>

          </div>

        </div>

        {/* DATA YANG SUDAH DIINPUT */}

        <div className="bg-[#1a2f6d]/80 border border-cyan-400/15 rounded-2xl shadow-lg p-8">

          <h2 className="text-xl font-bold mb-8 text-cyan-300">
            Data Yang Sudah Diinput
          </h2>

          <div className="space-y-10">

            {Object.keys(groupedData).map((bulan) => (

              <div key={bulan}>

                <h3 className="text-lg font-bold text-cyan-200 mb-4">
                  {bulan}
                </h3>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                  {Object.keys(groupedData[bulan]).map((tim) => (

                    <div
                      key={tim}
                      className="bg-[#0f1c3f] border border-cyan-400/15 rounded-xl p-6"
                    >

                      <h4 className="text-cyan-300 font-bold mb-4 uppercase">
                        {tim}
                      </h4>

                      <div className="space-y-3">

                        {groupedData[bulan][tim].map((item: any) => (

                          <div
                            key={item.id}
                            className="p-3 bg-[#132a5c] rounded-lg"
                          >

                            <p className="font-semibold text-white text-sm">
                              {item.pegawai?.nama}
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

            ))}

          </div>

        </div>

      </div>

    </div>

  )

}