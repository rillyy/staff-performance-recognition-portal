import Sidebar from "./components/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#0b1635]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main
        className="
        flex-1
        transition-all
        duration-300
        ml-0
        lg:ml-64
        group-data-[collapsed=true]:lg:ml-16
      "
      >

        <div
          className="
          w-full
          max-w-350
          mx-auto
          px-4 sm:px-6 lg:px-8
          py-6 sm:py-8
        "
        >
          {children}
        </div>

      </main>

    </div>
  )
}