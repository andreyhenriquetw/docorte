import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import Footer from "./_components/footer"
import AuthProvider from "./_providers/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KN Do Corte",
  description:
    "Agendamentos rápidos na Barbearia KN Do Corte – estilo em primeiro lugar!",
  icons: "/logkn.png",
  openGraph: {
    title: "KN Do Corte",
    description: "Agende seu corte com estilo!",
    url: "https://kndocorte.shop", // coloque seu domínio aqui
    siteName: "KN Do Corte",
    type: "website",
    images: [
      {
        url: "/logkn.png", // imagem que aparecerá no WhatsApp
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KN Do Corte",
    description: "Agende seu corte com estilo!",
    images: ["/logkn.png"],
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
