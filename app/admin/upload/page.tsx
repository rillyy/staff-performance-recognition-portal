"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function UploadPage() {

  const router = useRouter()

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<any[]>([])

  useEffect(() => {
    getUploadedFiles()
  }, [])

  async function getUploadedFiles() {

    const { data } = await supabase
      .from("excel_uploads")
      .select("*")
      .order("uploaded_at", { ascending: false })

    setFiles(data || [])
  }

  async function handleUpload() {

    if (!file) {
      alert("Pilih file Excel terlebih dahulu")
      return
    }

    setUploading(true)

    const fileName = `${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("doc-pegawai")
      .upload(fileName, file)

    if (uploadError) {
      alert("Gagal upload file")
      setUploading(false)
      return
    }

    const { data: publicUrl } = supabase.storage
      .from("doc-pegawai")
      .getPublicUrl(fileName)

    await supabase.from("excel_uploads").insert({
      file_name: file.name,
      file_url: publicUrl.publicUrl,
    })

    setUploading(false)
    setFile(null)
    getUploadedFiles()

    alert("File berhasil diupload!")
  }

  return (

    <div className="min-h-screen bg-[#0b1635] text-blue-100 px-6 sm:px-10 py-10">

      {/* CONTAINER UTAMA */}

      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= UPLOAD CARD ================= */}

        <div className="
          bg-[#1a2f6d]/80
          backdrop-blur-xl
          border border-cyan-400/15
          rounded-2xl
          shadow-lg
          p-8
        ">

          <h1 className="text-2xl font-bold mb-8 text-cyan-300 tracking-wide">
            Upload File Excel Mentah
          </h1>

          {/* DROP ZONE */}

          <div className="mb-6">

            <label className="block mb-3 text-sm font-medium text-blue-200">
              Pilih File Excel (.xlsx / .xls)
            </label>

            <label className="
              flex
              flex-col
              items-center
              justify-center
              w-full
              h-36
              border-2
              border-dashed
              border-cyan-400/30
              rounded-xl
              cursor-pointer
              bg-[#0f1c3f]
              hover:bg-[#142454]
              transition
            ">

              <div className="flex flex-col items-center text-center px-4">

                <p className="text-sm text-blue-200">
                  <span className="font-semibold text-cyan-300">
                    Klik untuk memilih file
                  </span>{" "}
                  atau drag & drop di sini
                </p>

                <p className="text-xs text-blue-400/60 mt-1">
                  Format yang diperbolehkan: .xlsx / .xls
                </p>

                {file && (
                  <p className="mt-3 text-sm font-semibold text-green-400">
                    📄 {file.name}
                  </p>
                )}

              </div>

              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

            </label>

          </div>

          {/* BUTTON */}

          <div className="flex justify-between items-center">

            <button
              onClick={() => router.push("/admin")}
              className="
                px-6 py-2
                rounded-lg
                border border-cyan-400/30
                text-cyan-300
                hover:bg-cyan-500/10
                transition
              "
            >
              Kembali
            </button>

            <button
              onClick={handleUpload}
              disabled={uploading}
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
              {uploading ? "Uploading..." : "Upload File"}
            </button>

          </div>

        </div>


        {/* ================= FILE LIST ================= */}

        <div className="
          bg-[#1a2f6d]/80
          backdrop-blur-xl
          border border-cyan-400/15
          rounded-2xl
          shadow-lg
          p-8
        ">

          <h2 className="text-xl font-bold mb-6 text-cyan-300">
            File Yang Sudah Diupload
          </h2>

          {files.length === 0 && (
            <p className="text-blue-300/60">
              Belum ada file
            </p>
          )}

          <div className="space-y-4">

            {files.map((f) => (

              <div
                key={f.id}
                className="
                  flex
                  flex-col
                  md:flex-row
                  md:items-center
                  md:justify-between
                  gap-3
                  p-4
                  bg-[#0f1c3f]
                  rounded-lg
                  border border-cyan-400/10
                "
              >

                <div>
                  <p className="font-semibold text-white">
                    {f.file_name}
                  </p>

                  <p className="text-xs text-blue-300/70">
                    {new Date(f.uploaded_at).toLocaleString()}
                  </p>
                </div>

                <a
                  href={f.file_url}
                  target="_blank"
                  className="
                    px-4 py-1.5
                    text-sm
                    rounded-lg
                    bg-linear-to-r
                    from-purple-500
                    to-cyan-500
                    text-white
                    hover:scale-105
                    transition
                    self-start md:self-auto
                  "
                >
                  Lihat File
                </a>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}