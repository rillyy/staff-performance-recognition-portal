"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import StatsCard from "./components/statscard"
import Header from "./components/header"
import QuickActions from "./components/quickactions"
import { Users, FileCheck, AlertCircle, Activity } from "lucide-react"

export default function AdminPage() {

  const [pegawai, setPegawai] = useState<any[]>([])
  const [ckpData, setCkpData] = useState<any[]>([])
  const [nominasi, setNominasi] = useState<any>({})
  const [nominasiFinal, setNominasiFinal] = useState<any[]>([])
  const [ranking, setRanking] = useState<any[]>([])
  const [juriDone, setJuriDone] = useState(0)
  const [juriTotal, setJuriTotal] = useState(0)

  function getNamaBulan(dateString: string) {

    const bulan = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ]

    const date = new Date(dateString)

    return bulan[date.getMonth()]
  }

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    await getPegawai()
    await getCKP()
    await getMonitoringJuri()
    await getNominasiPerTim()
    await getRankingLive()
  }

  async function getPegawai() {

    const { data } = await supabase
      .from("pegawai")
      .select("*")
      .order("nama")

    setPegawai(data || [])
  }

  async function getCKP() {

    const { data } = await supabase
      .from("ckp")
      .select(`id, pegawai ( nama )`)

    setCkpData(data || [])
  }

  async function getMonitoringJuri() {

    const { data } = await supabase
      .from("penilaian")
      .select("status")

    if (!data) return

    const done = data.filter((d:any)=> d.status === "done").length

    setJuriDone(done)
    setJuriTotal(data.length)
  }

  async function getNominasiPerTim() {

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
      .order("total_nilai", { ascending:false })

    const grouped:any = {}

    data?.forEach((item:any)=>{

      const tim = item.pegawai.tim
      const bulan = getNamaBulan(item.periode_bulan)

      if(!grouped[tim]) grouped[tim] = {}

      if(!grouped[tim][bulan]) grouped[tim][bulan] = item

    })

    setNominasi(grouped)
  }

  async function getRankingLive() {

    const { data } = await supabase.rpc("get_ranking_live")

    setRanking(data || [])
  }

  function handleSetFinal(item:any){

    const tim = item.pegawai.tim

    const already = nominasiFinal.find(
      (n)=> n.pegawai.tim === tim
    )

    if(already){
      alert("Tim ini sudah memiliki nominasi final")
      return
    }

    setNominasiFinal([...nominasiFinal,item])
  }

  function handleRemoveFinal(id:string){

    setNominasiFinal(
      nominasiFinal.filter((n)=> n.pegawai.id !== id)
    )
  }

  async function handleSubmitFinal() {

    if (nominasiFinal.length === 0) {
      alert("Belum ada nominasi final")
      return
    }

    const payload = nominasiFinal.map((item: any) => ({
      pegawai_id: item.pegawai.id,
      total_nilai: item.total_nilai,
      status: "pending"
    }))

    await supabase
      .from("approval")
      .insert(payload)

    alert("Berhasil dikirim ke penilaian juri")

    setNominasiFinal([])
  }

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 space-y-8">

      <Header
        title="Admin Board"
        subtitle="Manage. Evaluate. Recognize."
      />

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatsCard
          title="Total Pegawai"
          value={pegawai.length}
          subtitle="Data terdaftar"
          icon={<Users size={22}/>}
        />

        <StatsCard
          title="Data Sudah Dinilai"
          value={ckpData.length}
          subtitle="Sudah diinput"
          icon={<FileCheck size={22}/>}
        />

        <StatsCard
          title="Data Belum Dinilai"
          value={pegawai.length - ckpData.length}
          subtitle="Perlu input"
          icon={<AlertCircle size={22}/>}
        />

        <StatsCard
  title="Monitoring Penilaian TPK"
  value={
    juriTotal>0 && juriDone===juriTotal
    ? "DONE"
    : "IN PROGRESS"
  }
  valueColor={
    juriTotal>0 && juriDone===juriTotal
    ? "text-green-400"
    : "text-cyan-400"
  }
  subtitle="Status Evaluasi"
  icon={<Activity size={22}/>}
/>

      </div>

      <QuickActions/>

      {/* NOMINASI SECTION */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* NOMINASI TIM */}

        <div className="lg:col-span-2 bg-[#1a2f6d] p-6 rounded-xl">

          <h2 className="text-xl font-bold text-cyan-300 mb-6">
            Nominasi Tim
          </h2>

          {Object.keys(nominasi).map((tim)=>{

            const bulanData = nominasi[tim]

            return(

              <div key={tim} className="mb-8">

                <h3 className="text-cyan-400 font-semibold mb-3 uppercase">
                  {tim}
                </h3>

                <div className="grid md:grid-cols-3 gap-4">

                  {Object.keys(bulanData).map((bulan)=>{

                    const item:any = bulanData[bulan]

                    return(

                      <div
                        key={bulan}
                        className="bg-white/10 p-4 rounded-lg space-y-2"
                      >

                        <p className="text-xs text-yellow-300 font-semibold">
                          {bulan}
                        </p>

                        <p className="font-semibold">
                          {item.pegawai.nama}
                        </p>

                        <p className="text-sm text-blue-200">
                          Nilai {item.total_nilai}
                        </p>

                        <div className="flex gap-2 pt-2">

                          <button
                            onClick={()=>handleSetFinal(item)}
                            className="bg-green-500 hover:bg-green-600 px-3 py-1 text-sm rounded"
                          >
                            Oke
                          </button>

                          <button
                            className="bg-red-500 hover:bg-red-600 px-3 py-1 text-sm rounded"
                          >
                            Tidak
                          </button>

                        </div>

                      </div>

                    )

                  })}

                </div>

              </div>

            )

          })}

        </div>

        {/* NOMINASI FINAL */}

        <div className="bg-[#1a2f6d] p-6 rounded-xl">

          <h2 className="text-xl font-bold text-purple-300 mb-6">
            Nominasi Final
          </h2>

          {nominasiFinal.length === 0 && (
            <p className="text-blue-200">
              Belum ada kandidat dipilih
            </p>
          )}

          <div className="space-y-4">

            {nominasiFinal.map((item:any)=>(

              <div
                key={item.pegawai.id}
                className="bg-white/10 p-4 rounded-lg flex justify-between items-center"
              >

                <div>

                  <p className="text-xs text-cyan-400 uppercase">
                    {item.pegawai.tim}
                  </p>

                  <p className="font-semibold">
                    {item.pegawai.nama}
                  </p>

                  <p className="text-sm text-blue-200">
                    Nilai {item.total_nilai}
                  </p>

                </div>

                <button
                  onClick={()=>handleRemoveFinal(item.pegawai.id)}
                  className="bg-red-500 px-3 py-1 text-sm rounded"
                >
                  Hapus
                </button>

              </div>

            ))}

          </div>

          {nominasiFinal.length > 0 && (

            <button
              onClick={handleSubmitFinal}
              className="mt-6 w-full bg-yellow-400 text-black py-2 rounded-lg font-bold"
            >
              Kirim ke Penilaian Juri
            </button>

          )}

        </div>

      </div>


      {/* FINAL RANKING */}

      <div className="bg-[#1a2f6d] p-6 rounded-xl">

        <h2 className="text-2xl text-yellow-300 font-bold mb-5">
          Final Ranking
        </h2>

        {ranking.length===0 && (
          <p className="text-blue-200">
            Belum ada penilaian
          </p>
        )}

        <div className="space-y-4">

        {ranking.slice(0,3).map((item:any, index:number)=>(

          <div
            key={item.pegawai_id}
            className="flex items-center gap-4"
          >

            <div className="bg-white/15 w-16 h-20 flex items-center justify-center rounded-xl text-2xl font-bold">
              {index+1}
            </div>

            <div className="flex justify-between flex-1 bg-white/15 p-4 rounded-xl">

              <div>

                <p className="text-xs text-cyan-400 uppercase font-semibold">
                  {item.tim}
                </p>

                <p className="text-lg font-bold">
                  {item.nama}
                </p>

                <p className="text-sm text-blue-200">
                  Hasil: {Number(item.nilai).toFixed(1)}
                </p>

              </div>

            </div>

          </div>

        ))}

        </div>

      </div>

    </div>

  )

}