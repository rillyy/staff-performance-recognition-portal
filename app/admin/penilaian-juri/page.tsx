"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function PenilaianJuriPage() {

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getNominasi()
  }, [])

  async function getNominasi() {

    const { data } = await supabase
      .from("approval")
      .select(`
        id,
        total_nilai,
        pegawai (
          id,
          nama,
          tim
        )
      `)

    setData(data || [])
  }

  async function simpanNilai(id:any, nilai:number) {

    if (nilai < 0 || nilai > 100) {
      alert("Nilai harus 0 - 100")
      return
    }

    setLoading(true)

    await supabase
      .from("penilaian")
      .upsert({
        pegawai_id: id,
        nilai_juri: nilai,
        status: "done"
      })

    setLoading(false)

    alert("Nilai berhasil disimpan")
  }

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 px-6 py-10">

      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}

        <div className="bg-[#1a2f6d]/80 border border-cyan-400/15 rounded-2xl p-8">

          <h1 className="text-2xl font-bold text-cyan-300">
            Penilaian Juri
          </h1>

          <p className="text-sm text-blue-300/70 mt-2">
            Berikan nilai kualitas KIPAPP untuk setiap nominasi
          </p>

        </div>


        {/* LIST NOMINASI */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {data.map((item:any) => (

            <CardPenilaian
              key={item.id}
              item={item}
              simpanNilai={simpanNilai}
            />

          ))}

        </div>

      </div>

    </div>
  )
}

function CardPenilaian({item,simpanNilai}:any){

  const [nilai,setNilai] = useState("")

  return(

    <div className="bg-[#1a2f6d]/80 border border-cyan-400/15 rounded-xl p-6">

      <p className="text-sm text-cyan-300 uppercase">
        {item.pegawai.tim}
      </p>

      <h3 className="text-lg font-semibold text-white">
        {item.pegawai.nama}
      </h3>

      <p className="text-sm text-blue-300 mt-2">
        Nilai Awal : {item.total_nilai}
      </p>

      <div className="mt-4">

        <label className="text-sm text-blue-200">
          Nilai Kualitas KIPAPP (0-100)
        </label>

        <input
          type="number"
          value={nilai}
          onChange={(e)=>setNilai(e.target.value)}
          className="w-full mt-2 bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-3 py-2"
        />

      </div>

      <button
        onClick={()=>simpanNilai(item.pegawai.id,Number(nilai))}
        className="mt-4 w-full bg-linear-to-r from-purple-500 to-cyan-500 text-white py-2 rounded-lg"
      >
        Simpan Nilai
      </button>

    </div>
  )
}