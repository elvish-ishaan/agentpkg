import type { Metadata } from "next"
import { Della_Respira, Actor, Merriweather } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/lib/providers/query-provider"
import { AuthProvider } from "@/lib/auth/auth-context"
import { Toaster } from "@/components/ui/sonner"



const dellaRespira = Della_Respira({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-della-respira",
  display: "swap",
})

const actor = Actor({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-actor",
})

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
})

export const metadata: Metadata = {
  title: "AgentPkg - Agent Package Registry",
  description: "Browse, publish, and manage agent packages",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={` ${dellaRespira.variable} ${actor.variable} ${merriweather.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
