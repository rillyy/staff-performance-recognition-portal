import { PlusCircle, Upload, Users, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

export default function QuickActions() {
  const router = useRouter()

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <button
          onClick={() => router.push("./admin/input-nilai")}
          className="border-2 border-indigo-500 text-indigo-600 rounded-xl p-4 flex items-center gap-3 hover:bg-indigo-50 transition"
        >
          <PlusCircle size={20} />
          Input Nilai Final
        </button>

        <button
          onClick={() => router.push("/admin/upload")}
          className="border-2 border-red-500 text-red-600 rounded-xl p-4 flex items-center gap-3 hover:bg-red-50 transition"
        >
          <Upload size={20} />
          Upload Excel
        </button>

        <button
          onClick={() => router.push("/admin/pegawai")}
          className="border-2 border-gray-500 text-gray-600 rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition"
        >
          <Users size={20} />
          Kelola Pegawai
        </button>

        <button
          onClick={() => router.push("/admin/laporan")}
          className="border-2 border-green-600 text-green-600 rounded-xl p-4 flex items-center gap-3 hover:bg-green-50 transition"
        >
          <FileText size={20} />
          Generate Laporan
        </button>

      </div>
    </div>
  )
}
