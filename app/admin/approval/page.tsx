"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ApprovalPage() {

  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  async function getData() {

    const { data, error } = await supabase
      .from("nominasi_final")
      .select(`
        id,
        total_nilai,
        pegawai (
          id,
          nama,
          tim
        )
      `)
      .order("total_nilai", { ascending: false })

    if(error){
      console.error("Error load approval:", error)
      return
    }

    setData(data || [])
  }

  async function updateStatus(pegawaiId: string, newStatus: string) {

    setLoading(true)

    const { error } = await supabase
      .from("nilai_final")
      .update({ status: newStatus })
      .eq("pegawai_id", pegawaiId)

    if(error){
      console.error("Update status error:", error)
      alert("Gagal update status")
    }

    await getData()

    setLoading(false)
  }

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
            Approval Nominasi
          </h1>

          <p className="text-sm text-blue-300/70 mt-2">
            Verifikasi nominasi pegawai teladan sebelum penetapan akhir
          </p>

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
            Daftar Nominasi
          </h2>

          {data.length === 0 && (
            <p className="text-blue-300/60">
              Belum ada data untuk approval
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

                  <p className="text-sm text-cyan-300 uppercase">
                    {item.pegawai.tim}
                  </p>

                  <h3 className="text-lg font-semibold text-white mt-1">
                    {item.pegawai.nama}
                  </h3>

                  <p className="text-sm text-blue-300 mt-2">
                    Total Nilai : {item.total_nilai}
                  </p>

                </div>

                {/* BUTTONS */}

                <div className="flex gap-3 mt-6">

                  <button
                    disabled={loading}
                    onClick={() => updateStatus(item.pegawai.id, "approved")}
                    className="
                      flex-1
                      bg-green-600
                      hover:bg-green-700
                      text-white
                      text-sm
                      py-2
                      rounded-lg
                      transition
                    "
                  >
                    Approve
                  </button>

                  <button
                    disabled={loading}
                    onClick={() => updateStatus(item.pegawai.id, "rejected")}
                    className="
                      flex-1
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      text-sm
                      py-2
                      rounded-lg
                      transition
                    "
                  >
                    Reject
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}