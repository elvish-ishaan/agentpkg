export default function SkillLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: `
          radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
          radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
        `,
        backgroundSize: '10px 10px',
        imageRendering: 'pixelated',
      }}
    >
      {children}
    </div>
  )
}
