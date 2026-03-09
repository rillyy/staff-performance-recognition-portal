"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import StatsCard from "./components/statscard"
import Header from "./components/header"
import QuickActions from "./components/quickactions"
import { Users, FileCheck, AlertCircle, Activity } from "lucide-react"

export default function AdminPage() {

  /* ================= STATE ================= */

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
      .select(`
        id,
        pegawai ( nama )
      `)

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
      console.error("Error getMonitoringJuri:", error)
      return
    }

    if (data) {

      const done = data.filter((d:any) => d.status === "done").length

      setJuriDone(done)
      setJuriTotal(data.length)

    }

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
      .order("total_nilai", { ascending: false })

    if (error) {
      console.error("Error getNominasiPerTim:", error)
      return
    }

    const grouped: any = {}

    data?.forEach((item: any) => {

      const tim = item.pegawai.tim
      const bulan = getNamaBulan(item.periode_bulan)

      if (!grouped[tim]) grouped[tim] = {}

      if (!grouped[tim][bulan]) grouped[tim][bulan] = item

    })

    setNominasi(grouped)

  }

  /* ================= LIVE RANKING ================= */

  async function getRankingLive() {

    const { data, error } = await supabase
      .rpc("get_ranking_live")

    if (error) {
      console.error("Ranking error:", error)
      return
    }

    setRanking(data || [])

  }

  /* ================= SET NOMINASI FINAL ================= */

  function handleSetFinal(item: any) {

    const tim = item.pegawai.tim

    const already = nominasiFinal.find(
      (n) => n.pegawai.tim === tim
    )

    if (already) {

      alert("Tim ini sudah memiliki nominasi final")
      return

    }

    setNominasiFinal([...nominasiFinal, item])

  }

  function handleRemoveFinal(id: string) {

    setNominasiFinal(
      nominasiFinal.filter((n) => n.pegawai.id !== id)
    )

  }

  /* ================= SUBMIT KE JURI ================= */

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

    const { error } = await supabase
      .from("approval")
      .insert(payload)

    if (error) {

      console.error("Submit error:", error)
      alert("Gagal mengirim data ke penilaian juri")
      return

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

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatsCard
          title="Total Pegawai"
          value={pegawai.length}
          subtitle="Data terdaftar"
          icon={<Users className="text-cyan-400" size={22} />}
          color="text-cyan-400"
        />

        <StatsCard
          title="Total Data CKP"
          value={ckpData.length}
          subtitle="Sudah diinput"
          icon={<FileCheck className="text-green-400" size={22} />}
          color="text-green-400"
        />

        <StatsCard
          title="Belum Dinilai"
          value={pegawai.length - ckpData.length}
          subtitle="Perlu input"
          icon={<AlertCircle className="text-orange-400" size={22} />}
          color="text-orange-400"
        />

        <StatsCard
          title="Monitoring Penilaian TPK"
          value={
            juriTotal > 0 && juriDone === juriTotal
              ? <span className="text-green-400 font-bold">DONE</span>
              : <span className="text-xl font-bold text-orange-400">IN PROGRESS</span>
          }
          subtitle="Status Evaluasi"
          icon={<Activity className="text-purple-400" size={22} />}
          color="text-purple-400"
        />

      </div>

      <QuickActions />

      {/* ================= LIVE RANKING ================= */}

      <div className="bg-[#1a2f6d] p-6 rounded-xl mt-6">

        <h2 className="text-2xl text-yellow-300 font-bold mb-5">
          Final Ranking
        </h2>

        {ranking.length === 0 && (
          <p className="text-blue-200">Belum ada penilaian</p>
        )}

        {ranking.slice(0,1).map((item:any, index:number)=>(

          <div
            key={item.pegawai_id}
            className="flex items-center gap-4"
          >

            <div className="bg-[#FFFFFF]/15 w-16 h-20 flex items-center justify-center rounded-xl text-white text-2xl font-bold">
              {index + 1}
            </div>

            <div className="flex items-center justify-between flex-1 bg-[#FFFFFF]/15 p-4 rounded-xl">

              <div>

                <p className="text-xs text-cyan-400 uppercase font-semibold">
                  {item.tim}
                </p>

                <p className="text-lg font-bold text-white">
                  {item.nama}
                </p>

                <p className="text-sm text-blue-200">
                  Hasil: {Number(item.nilai).toFixed(1)}
                </p>

              </div>

              <button className="bg-yellow-300 px-5 py-2 rounded-lg text-black font-bold">
                Submit
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}