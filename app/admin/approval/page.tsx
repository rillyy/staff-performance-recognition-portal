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

    const { data } = await supabase
      .from("nilai_final")
      .select(`
        id,
        total_nilai,
        status,
        pegawai (
          nama,
          tim
        )
      `)
      .order("total_nilai", { ascending: false })

    setData(data || [])
  }

  async function updateStatus(id: string, newStatus: string) {

    setLoading(true)

    await supabase
      .from("nilai_final")
      .update({ status: newStatus })
      .eq("id", id)

    await getData()

    setLoading(false)
  }

  function getStatusStyle(status:string){

    if(status === "approved")
      return "bg-green-500/20 text-green-400 border-green-400/30"

    if(status === "rejected")
      return "bg-red-500/20 text-red-400 border-red-400/30"

    return "bg-orange-500/20 text-orange-400 border-orange-400/30"
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

                  {/* STATUS BADGE */}

                  <div className="
                    mt-4
                    text-xs
                    px-3 py-1
                    rounded-lg
                    border
                    inline-block
                    font-semibold
                  "
          >
  {item.status?.toUpperCase() || "PENDING"}
</div>

                </div>

                {/* BUTTONS */}

                <div className="flex gap-3 mt-6">

                  <button
                    disabled={loading}
                    onClick={() => updateStatus(item.id, "approved")}
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
                    onClick={() => updateStatus(item.id, "rejected")}
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