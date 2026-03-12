import { SessionProvider } from "next-auth/react"
import { Sidebar } from "@/components/wavelength/sidebar"
import { Topbar } from "@/components/wavelength/topbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-[#0a0a0f]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SessionProvider>
  )
}
