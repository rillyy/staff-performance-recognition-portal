"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type Pegawai = {
  id: string
  nama: string
  tim: string
}

type Nominasi = {
  id: string
  pegawai: Pegawai
}

type Juri = {
  id: string
  nama: string
}

export default function PenilaianJuriPage() {
  const [nominasi, setNominasi] = useState<Nominasi[]>([])
  const [juriList, setJuriList] = useState<Juri[]>([])
  const [penilaian, setPenilaian] = useState<any[]>([])
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null)
  const [selectedJuri, setSelectedJuri] = useState<Juri | null>(null)
  const [nilai, setNilai] = useState("")
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    await fetchNominasi()
    await fetchJuri()
    await fetchPenilaian()
  }

  async function fetchNominasi() {
    const { data } = await supabase
      .from("nominasi_final")
      .select(`
        id,
        pegawai:pegawai_id (
          id,
          nama,
          tim
        )
      `)

    if (data) setNominasi(data as any)
  }

  async function fetchJuri() {
    const { data } = await supabase.from("juri").select("*")
    if (data) setJuriList(data)
  }

  async function fetchPenilaian() {
    const { data } = await supabase.from("penilaian").select("*")
    if (data) setPenilaian(data)
  }

  function openModal(juri: Juri, pegawai: Pegawai) {
    setSelectedJuri(juri)
    setSelectedPegawai(pegawai)

    const existing = penilaian.find(
      (p) => p.pegawai_id === pegawai.id && p.juri_id === juri.id
    )

    if (existing) {
      setNilai(existing.total_nilai)
    } else {
      setNilai("")
    }

    setShowModal(true)
  }

  async function submitNilai() {
    if (!selectedPegawai || !selectedJuri) return

    await supabase.from("penilaian").upsert(
      {
        pegawai_id: selectedPegawai.id,
        juri_id: selectedJuri.id,
        total_nilai: Number(nilai),
      },
      {
        onConflict: "pegawai_id,juri_id",
      }
    )

    setShowModal(false)
    setNilai("")
    fetchPenilaian()
  }

  async function hapusNilai() {
    if (!selectedPegawai || !selectedJuri) return

    await supabase
      .from("penilaian")
      .delete()
      .match({
        pegawai_id: selectedPegawai.id,
        juri_id: selectedJuri.id,
      })

    setShowModal(false)
    setNilai("")
    fetchPenilaian()
  }

    function sudahMenilai(pegawaiId: string, juriId: string) {
      return penilaian.some(
        (p) => p.pegawai_id === pegawaiId && p.juri_id === juriId
      )
    }

    function hitungRataNilai(pegawaiId: string) {
    const nilaiPegawai = penilaian.filter(
      (p) => p.pegawai_id === pegawaiId
    )

    if (nilaiPegawai.length === 0) return 0

    const total = nilaiPegawai.reduce(
      (sum, item) => sum + Number(item.total_nilai),
      0
    )

    return (total / nilaiPegawai.length).toFixed(1)
  }

    function hitungPeringkat() {
    const ranking = nominasi.map((item) => ({
      pegawaiId: item.pegawai.id,
      nilai: Number(hitungRataNilai(item.pegawai.id))
    }))

    ranking.sort((a, b) => b.nilai - a.nilai)

    const rankMap: any = {}

    ranking.forEach((item, index) => {
      rankMap[item.pegawaiId] = index + 1
    })

    return rankMap
  }

  const peringkat = hitungPeringkat()

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Penilaian Juri</h1>

      {nominasi.length === 0 && (
        <div className="bg-gray-200 text-black p-4 rounded">
          Belum ada data penilaian
        </div>
      )}

      <div className="space-y-6">
        {nominasi.map((item) => (
          <div
            key={item.id}
            className="bg-blue-900 p-6 rounded-xl shadow-md"
          >
            <p className="text-sm text-cyan-400 font-semibold">
              {item.pegawai.tim.toUpperCase()}
            </p>

            <h2 className="text-xl font-bold mb-4">
              {item.pegawai.nama}
            </h2>

            <div className="grid grid-cols-10 gap-3">
              {juriList.map((juri) => {
                const isDone = sudahMenilai(item.pegawai.id, juri.id)

                return (
                  <button
                    key={juri.id}
                    onClick={() => openModal(juri, item.pegawai)}
                    className={`px-4 py-2 rounded-lg font-semibold text-white ${
                      isDone ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {juri.nama}
                  </button>
                )
              })}

            </div>

            <div className="mt-4 text-white font-semibold">
              Nilai: {hitungRataNilai(item.pegawai.id)}
            </div>

            <div className="text-white font-semibold">
              Peringkat: {peringkat[item.pegawai.id] || "-"}
            </div>
            </div>
          ))}
        </div>

      {showModal && selectedPegawai && selectedJuri && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          
          <div className="relative bg-[#1f3a74] w-[700px] p-10 rounded-2xl shadow-xl">

            {/* tombol X */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl"
            >
              ✕
            </button>

            <h1 className="text-4xl font-bold text-cyan-400 mb-6">
              {selectedJuri.nama}
            </h1>

            <div className="mb-5">
              <p className="text-gray-300 mb-2">Nama Pegawai</p>
              <div className="bg-[#0b1a4a] text-white px-4 py-3 rounded-lg">
                {selectedPegawai.nama}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-300 mb-2">Input Nilai</p>
              <input
                type="number"
                value={nilai}
                onChange={(e) => setNilai(e.target.value)}
                className="w-full bg-[#0b1a4a] text-white px-4 py-3 rounded-lg outline-none"
                placeholder="Masukkan nilai"
              />
            </div>

            <div className="flex justify-between items-center">

              <button
                onClick={hapusNilai}
                className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Hapus Nilai
              </button>

              <button
                onClick={submitNilai}
                className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-lg font-semibold text-white"
              >
                Submit
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}