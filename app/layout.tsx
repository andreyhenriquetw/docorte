import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cookies } from "next/headers"
import { Toaster } from "sonner"
import Footer from "./_components/footer"
import AuthProvider from "./_providers/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KN DO CORTE",
  description: "Clique aqui para agendar, é rapido e fácil!",
  icons: "/logkn.png",
  openGraph: {
    title: "AGENDE SEU HORÁRIO!",
    description: "Clique aqui para agendar, é rapido e fácil!",
    url: "https://kndocorte.shop",
    siteName: "KN DO CORTE",
    type: "website",
    images: [
      {
        url: "/logoknlink.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KN DO CORTE",
    description: "Clique aqui para agendar, é rapido e fácil!",
    images: ["/logoknlink.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 🔹 pega o idioma salvo pelo middleware
  const locale = cookies().get("locale")?.value || "pt"

  return (
    <html lang={locale} className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex h-full flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
