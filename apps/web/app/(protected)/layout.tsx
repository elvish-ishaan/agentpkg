import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { OrgProvider } from '@/lib/contexts/org-context'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#0a0a0a',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
            radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
          imageRendering: 'pixelated',
        }}
      />

      <OrgProvider>
        <DashboardSidebar />
        <main className="flex-1 overflow-auto relative z-10">{children}</main>
      </OrgProvider>
    </div>
  )
}
