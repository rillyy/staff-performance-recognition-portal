"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { motion } from "framer-motion"

type Pegawai = {
  id: string
  nama: string
  tim: string
  status: string
}

const TIM_OPTIONS = [
  "Umum",
  "Sosial",
  "Produksi",
  "Nerwilis",
  "IPDS",
  "Distribusi",
]

const TIM_COLORS: Record<string, string> = {
  Umum: "bg-cyan-500/20 text-cyan-300",
  Sosial: "bg-purple-500/20 text-purple-300",
  Produksi: "bg-green-500/20 text-green-300",
  Nerwilis: "bg-orange-500/20 text-orange-300",
  IPDS: "bg-pink-500/20 text-pink-300",
  Distribusi: "bg-blue-500/20 text-blue-300",
}

export default function KelolaPegawaiPage() {

  const [pegawai, setPegawai] = useState<Pegawai[]>([])
  const [namaBaru, setNamaBaru] = useState("")
  const [timBaru, setTimBaru] = useState("Umum")

  const [search, setSearch] = useState("")

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    getPegawai()
  }, [])

  async function getPegawai() {
    const { data } = await supabase
      .from("pegawai")
      .select("*")
      .order("nama")

    setPegawai(data || [])
  }

  async function tambahPegawai() {

    if (!namaBaru.trim()) {
      alert("Nama tidak boleh kosong")
      return
    }

    await supabase.from("pegawai").insert([
      {
        nama: namaBaru,
        tim: timBaru,
        status: "aktif",
      },
    ])

    setNamaBaru("")
    getPegawai()
  }

  async function hapusPegawai(id: string) {

    const confirmDelete = confirm("Yakin ingin menghapus pegawai ini?")
    if (!confirmDelete) return

    await supabase.from("pegawai").delete().eq("id", id)

    getPegawai()
  }

  async function updateTim(id: string, timBaru: string) {

    await supabase
      .from("pegawai")
      .update({ tim: timBaru })
      .eq("id", id)

    getPegawai()
  }

  /* ================= SEARCH ================= */

  const filteredPegawai = pegawai.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  )

  /* ================= GROUP PER TIM ================= */

  const grouped = filteredPegawai.reduce((acc: any, item) => {

    if (!acc[item.tim]) acc[item.tim] = []

    acc[item.tim].push(item)

    return acc

  }, {})

  /* ================= STATISTIK ================= */

  const statistik = TIM_OPTIONS.map((tim) => ({
    tim,
    jumlah: pegawai.filter((p) => p.tim === tim).length,
  }))

  const totalPages = Math.ceil(filteredPegawai.length / ITEMS_PER_PAGE)

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 px-8 py-10 space-y-10">

      {/* HEADER */}

      <div className="bg-linear-to-r from-cyan-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Kelola Pegawai</h1>
        <p className="text-sm opacity-90">
          Manage your team members efficiently
        </p>
      </div>

      {/* ================= STATISTIK ================= */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {statistik.map((s) => (

          <div
            key={s.tim}
            className="bg-[#1a2f6d]/80 border border-cyan-400/10 rounded-xl p-4"
          >

            <p className="text-sm text-blue-300">{s.tim}</p>

            <p className="text-2xl font-bold text-cyan-300">
              {s.jumlah}
            </p>

          </div>

        ))}

      </div>

      {/* ================= TAMBAH PEGAWAI ================= */}

      <div className="bg-[#1a2f6d]/80 backdrop-blur-xl border border-cyan-400/10 rounded-2xl p-6">

        <h2 className="text-cyan-300 font-semibold mb-4">
          Tambah Pegawai
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            value={namaBaru}
            onChange={(e) => setNamaBaru(e.target.value)}
            placeholder="Nama Pegawai"
            className="bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
          />

          <select
            value={timBaru}
            onChange={(e) => setTimBaru(e.target.value)}
            className="bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
          >
            {TIM_OPTIONS.map((tim) => (
              <option key={tim}>{tim}</option>
            ))}
          </select>

          <button
            onClick={tambahPegawai}
            className="bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg py-2 hover:scale-105 transition"
          >
            Tambah
          </button>

        </div>

      </div>

      {/* ================= SEARCH ================= */}

      <div className="bg-[#1a2f6d]/80 border border-cyan-400/10 rounded-2xl p-6">

        <input
          placeholder="Search nama pegawai..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
        />

      </div>

      {/* ================= LIST PER TIM ================= */}

      {Object.keys(grouped).map((tim) => (

        <div
          key={tim}
          className="bg-[#1a2f6d]/80 border border-cyan-400/10 rounded-2xl p-6"
        >

          <h2 className="text-lg font-bold mb-4 text-cyan-300">
            {tim}
          </h2>

          <div className="space-y-3">

            {grouped[tim].map((p: Pegawai) => (

              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center p-4 bg-[#0f1c3f] rounded-lg border border-cyan-400/10"
              >

                <div>

                  <p className="font-medium text-white">{p.nama}</p>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${TIM_COLORS[p.tim]}`}
                  >
                    {p.tim}
                  </span>

                </div>

                <div className="flex gap-2">

                  <select
                    value={p.tim}
                    onChange={(e) => updateTim(p.id, e.target.value)}
                    className="bg-[#132a5c] border border-cyan-400/20 rounded px-2 py-1"
                  >
                    {TIM_OPTIONS.map((tim) => (
                      <option key={tim}>{tim}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => hapusPegawai(p.id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm"
                  >
                    Hapus
                  </button>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      ))}

    </div>
  )
}