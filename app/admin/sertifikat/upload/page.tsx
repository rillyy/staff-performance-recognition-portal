"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function UploadSertifikatPage() {

  const [pegawai, setPegawai] = useState<any[]>([])
  const [selectedPegawai, setSelectedPegawai] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [periode, setPeriode] = useState("Triwulan 1")
  const [tahun, setTahun] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPegawai()
  }, [])

  async function getPegawai() {
    const { data } = await supabase
      .from("pegawai")
      .select("id, nama")
      .order("nama")

    setPegawai(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

    if (!file || !selectedPegawai) {
      alert("Lengkapi data terlebih dahulu")
      return
    }

    setLoading(true)

    const fileName = `${selectedPegawai}-${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("sertifikat")
      .upload(fileName, file)

    if (uploadError) {
      alert("Gagal upload file")
      setLoading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from("sertifikat")
      .getPublicUrl(fileName)

    const fileUrl = publicUrlData.publicUrl

    const { error: insertError } = await supabase
      .from("sertifikat")
      .insert([
        {
          pegawai_id: selectedPegawai,
          periode,
          tahun,
          file_url: fileUrl,
        },
      ])

    if (insertError) {
      alert("Gagal menyimpan data")
      setLoading(false)
      return
    }

    alert("Sertifikat berhasil disubmit")

    setFile(null)
    setSelectedPegawai("")
    setLoading(false)
  }

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 px-6 py-12 flex justify-center">

      {/* CARD */}
      <div className="
        w-full
        max-w-xl
        bg-[#1a2f6d]/80
        backdrop-blur-xl
        border border-cyan-400/15
        rounded-2xl
        shadow-lg
        p-8
      ">

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-8 text-cyan-300 tracking-wide">
          Upload Sertifikat
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* PEGAWAI */}
          <select
            value={selectedPegawai}
            onChange={(e) => setSelectedPegawai(e.target.value)}
            className="
              w-full
              bg-[#0f1c3f]
              border border-cyan-400/20
              rounded-lg
              px-4 py-2
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-400
              text-blue-100
            "
          >
            <option value="">Pilih Pegawai</option>

            {pegawai.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
              </option>
            ))}

          </select>

          {/* PERIODE */}
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="
              w-full
              bg-[#0f1c3f]
              border border-cyan-400/20
              rounded-lg
              px-4 py-2
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-400
              text-blue-100
            "
          >
            <option>Triwulan 1</option>
            <option>Triwulan 2</option>
            <option>Triwulan 3</option>
            <option>Triwulan 4</option>
          </select>

          {/* TAHUN */}
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
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-400
              text-blue-100
            "
          />

          {/* FILE */}
          <input
            type="file"
            accept=".pdf,.jpg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="
              w-full
              bg-[#0f1c3f]
              border border-cyan-400/20
              rounded-lg
              px-4 py-2
              text-blue-100
            "
          />

          {/* BUTTON */}
          <div className="flex justify-end pt-2">

            <button
              type="submit"
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
                transition-all
                shadow-lg
              "
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}