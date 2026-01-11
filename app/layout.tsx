import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import Footer from "./_components/footer"
import AuthProvider from "./_providers/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KN DO CORTE.",
  description: "Clique aqui para agendar, é rápido e fácil!",
  icons: "/logkn.png",

  openGraph: {
    title: "AGENDE SEU HORÁRIO.",
    description: "Clique aqui para agendar, é rápido e fácil!",
    url: "https://kndocorte.shop",
    siteName: "KN DO CORTE",
    type: "website",
    images: [
      {
        url: "https://kndocorte.shop/logwhatsakn.png",
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head></head>
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
