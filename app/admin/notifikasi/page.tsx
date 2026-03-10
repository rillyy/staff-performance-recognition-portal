"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function NotifikasiPage() {

  const [judul, setJudul] = useState("")
  const [pesan, setPesan] = useState("")
  const [role, setRole] = useState("")
  const [deadline, setDeadline] = useState("")
  const [tipe, setTipe] = useState("info")

  const [dataNotif, setDataNotif] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getNotif()
  }, [])

  /* ===============================
     Ambil Data Notifikasi
  =============================== */

  async function getNotif() {

    const { data, error } = await supabase
      .from("notifikasi")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setDataNotif(data || [])

  }

  /* ===============================
     Simpan Notifikasi
  =============================== */

  async function simpanNotif() {

    if (!judul || !pesan || !role) {
      alert("Isi semua field")
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from("notifikasi")
      .insert({
        judul,
        pesan,
        role_target: role,
        deadline,
        tipe
      })

    setLoading(false)

    if (error) {

      alert("Gagal menyimpan notifikasi")

    } else {

      alert("Notifikasi berhasil dibuat")

      setJudul("")
      setPesan("")
      setRole("")
      setDeadline("")
      setTipe("info")

      getNotif()

    }

  }

  /* ===============================
     Hapus Notifikasi
  =============================== */

  async function hapusNotif(id: string) {

    const confirmDelete = confirm("Hapus notifikasi ini?")

    if (!confirmDelete) return

    const { error } = await supabase
      .from("notifikasi")
      .delete()
      .eq("id", id)

    if (error) {

      alert("Gagal menghapus")

    } else {

      getNotif()

    }

  }

  /* ===============================
     UI
  =============================== */

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 px-10 py-10">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* ===============================
            HEADER PAGE
        =============================== */}

        <div>

          <h1 className="text-3xl font-bold text-cyan-300">
            Notifikasi
          </h1>

          <p className="text-blue-300/70 mt-1">
            Create and manage system notifications.
          </p>

        </div>


        {/* ===============================
            FORM TAMBAH NOTIF
        =============================== */}

        <div className="bg-[#1a2f6d] border border-cyan-400/15 rounded-2xl p-8">

          <h1 className="text-xl font-bold text-cyan-300 mb-6">
            Tambah Notifikasi
          </h1>

          <div className="grid md:grid-cols-2 gap-6">

            <input
              placeholder="Judul Notifikasi"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
            >

              <option value="">
                Target Role
              </option>

              <option value="juri">
                Juri
              </option>

              <option value="verifikator">
                Verifikator
              </option>

              <option value="semua">
                Semua
              </option>

            </select>

          </div>


          <textarea
            placeholder="Pesan Notifikasi"
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            className="w-full mt-4 bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
          />


          <div className="grid md:grid-cols-2 gap-6 mt-4">

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
            />

            <select
              value={tipe}
              onChange={(e) => setTipe(e.target.value)}
              className="bg-[#0f1c3f] border border-cyan-400/20 rounded-lg px-4 py-2"
            >

              <option value="info">
                Info
              </option>

              <option value="deadline">
                Deadline
              </option>

              <option value="warning">
                Warning
              </option>

            </select>

          </div>


          <button
            onClick={simpanNotif}
            disabled={loading}
            className="
            mt-6
            px-6 py-2
            rounded-lg
            bg-linear-to-r
            from-cyan-500
            to-blue-600
            text-white
            font-semibold
          "
          >

            {loading ? "Menyimpan..." : "Simpan Notifikasi"}

          </button>

        </div>


        {/* ===============================
            DAFTAR NOTIFIKASI
        =============================== */}

        <div className="bg-[#1a2f6d] border border-cyan-400/15 rounded-2xl p-8">

          <h2 className="text-lg font-bold text-cyan-300 mb-6">
            Daftar Notifikasi
          </h2>

          <div className="space-y-4">

            {dataNotif.length === 0 && (

              <p className="text-sm text-blue-300">
                Belum ada notifikasi
              </p>

            )}

            {dataNotif.map((n) => (

              <div
                key={n.id}
                className="
                p-4
                bg-[#132a5c]
                rounded-lg
                border border-cyan-400/10
                flex justify-between items-start
              "
              >

                <div>

                  <p className="font-semibold text-cyan-300">
                    {n.judul}
                  </p>

                  <p className="text-sm text-blue-200 mt-1">
                    {n.pesan}
                  </p>

                  {n.deadline && (

                    <p className="text-xs text-orange-400 mt-2">
                      Deadline:{" "}
                      {new Date(n.deadline).toLocaleDateString("id-ID")}
                    </p>

                  )}

                </div>


                <button
                  onClick={() => hapusNotif(n.id)}
                  className="
                  text-xs
                  px-3 py-1
                  bg-red-500
                  rounded-md
                  text-white
                "
                >
                  Hapus
                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )

}