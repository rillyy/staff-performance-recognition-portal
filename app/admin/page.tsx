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

  /* ================= HELPER BULAN ================= */

  function getNamaBulan(dateString: string) {

    const bulan = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember"
    ]

    const date = new Date(dateString)

    return bulan[date.getMonth()]
  }

  /* ================= LOAD DATA ================= */

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

  /* ================= GET PEGAWAI ================= */

  async function getPegawai() {

    const { data, error } = await supabase
      .from("pegawai")
      .select("*")
      .order("nama")

    if (error) {
      console.error("Error getPegawai:", error)
      return
    }

    setPegawai(data || [])
  }

  /* ================= GET CKP ================= */

  async function getCKP() {

    const { data, error } = await supabase
      .from("ckp")
      .select(`id, pegawai ( nama )`)

    if (error) {
      console.error("Error getCKP:", error)
      return
    }

    setCkpData(data || [])
  }

  /* ================= MONITORING JURI ================= */

  async function getMonitoringJuri() {

    const { data, error } = await supabase
      .from("penilaian")
      .select("status")

    if (error) {
      console.warn("Monitoring juri gagal:", error.message)
      return
    }

    if (!data) return

    const done = data.filter((d:any)=> d.status === "done").length

    setJuriDone(done)
    setJuriTotal(data.length)
  }

  /* ================= NOMINASI PER TIM ================= */

  async function getNominasiPerTim() {

    const { data, error } = await supabase
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

    if (error) {
      console.error("Error getNominasiPerTim:", error)
      return
    }

    const grouped:any = {}

    data?.forEach((item:any)=>{

      const tim = item.pegawai.tim
      const bulan = getNamaBulan(item.periode_bulan)

      if(!grouped[tim]) grouped[tim] = {}

      if(!grouped[tim][bulan]) grouped[tim][bulan] = item

    })

    setNominasi(grouped)
  }

  /* ================= LIVE RANKING ================= */

  async function getRankingLive() {

    const { data, error } = await supabase.rpc("get_ranking_live")

    if(error){
      console.warn("Ranking error:", error.message)
      return
    }

    setRanking(data || [])
  }

  /* ================= NOMINASI FINAL ================= */

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

  /* ================= SUBMIT ================= */
    async function handleSubmitRanking(item:any){

      // kosongkan nominasi_final dulu
      await supabase
        .from("nominasi_final")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")

      // insert pemenang
      const { error } = await supabase
        .from("nominasi_final")
        .insert({
          pegawai_id: item.pegawai_id,
          tim: item.tim,
          total_nilai: item.nilai
        })

      if(error){
        console.error(error)
        alert("Gagal kirim ke approval")
        return
      }

      alert("Berhasil dikirim ke approval")
    }

    async function handleSubmitFinal(){

      if(nominasiFinal.length === 0){
        alert("Belum ada nominasi final")
        return
      }

      for (const item of nominasiFinal) {

        // update status
        await supabase
          .from("nilai_final")
          .update({ status: "pending" })
          .eq("pegawai_id", item.pegawai.id)

        // insert kandidat ke tabel nominasi_final
        const { error } = await supabase
          .from("nominasi_final")
          .insert({
            pegawai_id: item.pegawai.id,
            tim: item.pegawai.tim,
            total_nilai: item.total_nilai
          })

        if(error){
          console.error("Submit error:", error)
          alert("Gagal kirim ke juri")
          return
        }

      }

      alert("Berhasil dikirim ke penilaian juri")
      setNominasiFinal([])

    }

  /* ================= UI ================= */

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
          title="Total Data CKP"
          value={ckpData.length}
          subtitle="Sudah diinput"
          icon={<FileCheck size={22}/>}
        />

        <StatsCard
          title="Belum Dinilai"
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
          subtitle="Status Evaluasi"
          icon={<Activity size={22}/>}
        />

      </div>

      <QuickActions/>

      {/* ================= FINAL RANKING ================= */}

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

        {ranking.map((item:any,index:number)=>(
          <div
            key={item.pegawai_id}
            className="flex items-center gap-4"
          >

            <div className="bg-white/15 w-16 h-20 flex items-center justify-center rounded-xl text-2xl font-bold">
              {index+1}
            </div>

            <div className="flex justify-between flex-1 bg-white/15 p-4 rounded-xl">

              <div>

                <p className="text-xs text-cyan-400 uppercase">
                  {item.tim}
                </p>

                <p className="text-lg font-bold">
                  {item.nama}
                </p>

                <p className="text-sm text-blue-200">
                  Hasil: {Number(item.nilai).toFixed(1)}
                </p>

              </div>
                <button
                  onClick={() => handleSubmitRanking(item)}
                  className="bg-yellow-300 px-5 py-2 rounded-lg text-black font-bold"
                >
                  Submit
                </button>
            </div>

          </div>
        ))}

        </div>

      </div>

      {/* ================= NOMINASI ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* DAFTAR NOMINASI */}

        <div className="bg-[#1a2f6d] p-6 rounded-xl">

          <h2 className="text-xl font-bold mb-6 text-cyan-300">
            Daftar Nominasi Tim
          </h2>

          {Object.keys(nominasi).length === 0 && (
            <p className="text-blue-300">
              Belum ada nominasi
            </p>
          )}

          {Object.entries(nominasi).map(([tim,bulanData]:any)=>(
            <div key={tim} className="mb-6">

              <h3 className="font-bold mb-3">
                {tim}
              </h3>

              {Object.entries(bulanData).map(([bulan,data]:any)=>(
                <div key={bulan} className="bg-[#233e80] p-4 rounded-xl mb-3">

                  <p>{bulan}</p>

                  <p className="font-semibold">
                    {data.pegawai.nama}
                  </p>

                  <p>Nilai: {data.total_nilai}</p>

                  <div className="flex gap-2 mt-2">

                    <button
                      onClick={()=>handleSetFinal(data)}
                      className="bg-green-500 px-3 py-1 rounded"
                    >
                      OKE
                    </button>

                    <button
                      onClick={()=>handleRemoveFinal(data.pegawai.id)}
                      className="bg-red-500 px-3 py-1 rounded"
                    >
                      TIDAK
                    </button>

                  </div>

                </div>
              ))}

            </div>
          ))}

        </div>

        {/* NOMINASI FINAL */}

        <div className="bg-[#1a2f6d] p-6 rounded-xl flex flex-col justify-between">

          <div>

            <h2 className="text-xl font-bold mb-6 text-cyan-300">
              Nominasi Final
            </h2>

            {nominasiFinal.length === 0 && (
              <p className="text-blue-300">
                Belum ada nominasi final
              </p>
            )}

            {nominasiFinal.map((n:any)=>(
              <div key={n.pegawai.id} className="mb-4 bg-green-900/30 p-4 rounded">

                <p className="font-bold">
                  {n.pegawai.tim}
                </p>

                <p className="text-lg">
                  {n.pegawai.nama}
                </p>

                <p>
                  Nilai: {n.total_nilai}
                </p>

              </div>
            ))}

          </div>

          {nominasiFinal.length>0 && (

            <div className="flex justify-end mt-6">

              <button
                onClick={handleSubmitFinal}
                className="px-6 py-2 bg-cyan-500 rounded-lg"
              >
                Submit ke Juri
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}