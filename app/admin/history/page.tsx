"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

/* ================= TYPES ================= */

type Pegawai = {
  id: string
  nama: string
  tim: string
}

type RawHistoryItem = {
  id: string
  total_nilai: number
  tahun: number
  triwulan: number
  created_at: string
  pegawai: Pegawai | Pegawai[] | null
}

type HistoryItem = {
  id: string
  total_nilai: number
  tahun: number
  triwulan: number
  created_at: string
  pegawai: Pegawai[]
}

export default function HistoryPage() {

  const [data,setData] = useState<HistoryItem[]>([])
  const [loading,setLoading] = useState(true)

  const [tahunList,setTahunList] = useState<number[]>([])
  const [selectedTahun,setSelectedTahun] = useState<number | null>(null)

  /* ================= LOAD DATA ================= */

  useEffect(()=>{
    loadHistory()
  },[])

  async function loadHistory(){

    setLoading(true)

    const {data:result,error} = await supabase
      .from("nilai_final")
      .select(`
        id,
        total_nilai,
        tahun,
        triwulan,
        created_at,
        pegawai:pegawai_id(
          id,
          nama,
          tim
        )
      `)
      .eq("status","approved")
      .order("tahun",{ascending:false})

    if(error){
      console.error(error)
      setLoading(false)
      return
    }

    const raw = (result as RawHistoryItem[]) ?? []

    /* ================= NORMALIZE DATA ================= */

    const normalized: HistoryItem[] = raw.map(item=>{

      let pegawaiArray: Pegawai[] = []

      if(Array.isArray(item.pegawai)){
        pegawaiArray = item.pegawai
      }
      else if(item.pegawai){
        pegawaiArray = [item.pegawai]
      }

      return {
        ...item,
        pegawai: pegawaiArray
      }

    })

    setData(normalized)

    /* ================= DAFTAR TAHUN ================= */

    const years = [...new Set(normalized.map(i=>i.tahun))]

    setTahunList(years)

    if(years.length>0){
      setSelectedTahun(years[0])
    }

    setLoading(false)
  }

  /* ================= FILTER TAHUN ================= */

  const filtered = data.filter(
    item => item.tahun === selectedTahun
  )

  /* ================= GROUP BY TRIWULAN ================= */

  const grouped = filtered.reduce((acc:Record<number,HistoryItem[]>,item)=>{

    const tri = item.triwulan

    if(!acc[tri]) acc[tri] = []

    acc[tri].push(item)

    return acc

  },{})

  /* ================= UI ================= */

  return(

  <div className="min-h-screen bg-[#0b1635] text-blue-100 px-8 py-10">

  <div className="max-w-6xl mx-auto space-y-10">

  {/* HEADER */}

  <div>

  <h1 className="text-3xl font-bold text-cyan-300 tracking-wide">
  Arsip Pegawai Teladan
  </h1>

  <p className="text-blue-300/70 mt-1">
  Hall of Excellence. Celebrating Achievement.
  </p>

  </div>

  {/* FILTER TAHUN */}

  <div className="flex gap-3 flex-wrap">

  {tahunList.map((tahun)=>(
  <button
  key={tahun}
  onClick={()=>setSelectedTahun(tahun)}
  className={`px-4 py-2 rounded-lg text-sm transition
  ${selectedTahun===tahun
  ? "bg-cyan-400 text-[#0b1635] font-semibold"
  : "bg-[#1a2f6d] hover:bg-[#223c8a]"
  }`}
  >
  {tahun}
  </button>
  ))}

  </div>

  {/* LOADING */}

  {loading && (
  <p className="text-blue-300">
  Loading history...
  </p>
  )}

  {/* EMPTY */}

  {!loading && filtered.length === 0 && (

  <div className="bg-[#1a2f6d]/80 border border-cyan-400/15 rounded-xl p-10 text-center text-blue-300">
  Belum ada pegawai teladan
  </div>

  )}

  {/* TRIWULAN */}

  <div className="space-y-10">

  {Object.entries(grouped).map(([triwulan,list])=>(

  <div key={triwulan}>

  <h2 className="text-2xl font-bold text-cyan-300 mb-6">
  Triwulan {triwulan}
  </h2>

  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

  {list.map((item)=>{

  const pegawai = item.pegawai?.[0]

  return(

  <div
  key={item.id}
  className="bg-[#1a2f6d]/80 border border-cyan-400/15 rounded-xl p-6 shadow-lg flex flex-col justify-between"
  >

  <div className="text-xs text-cyan-300 uppercase mb-2">
  Pegawai Teladan
  </div>

  <h3 className="text-xl font-semibold text-white">
  {pegawai?.nama ?? "Nama tidak ditemukan"}
  </h3>

  <p className="text-sm text-blue-300 mt-1">
  Tim {pegawai?.tim ?? "-"}
  </p>

  <div className="mt-4 text-sm text-blue-200">

  <p>
  Triwulan : {item.triwulan}
  </p>

  <p>
  Nilai : {item.total_nilai}
  </p>

  </div>

  <div className="mt-6 text-xs text-blue-400">
  Ditetapkan {new Date(item.created_at).toLocaleDateString("id-ID")}
  </div>

  </div>

  )

  })}

  </div>

  </div>

  ))}

  </div>

  </div>

  </div>

  )

}