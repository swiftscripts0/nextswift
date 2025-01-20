import { Inter } from 'next/font/google'
import './globals.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { AuthProvider } from '@/components/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} wireframe-bg min-h-screen text-white`}>
        <AuthProvider>
          <div className="transition-opacity duration-300 ease-in-out">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

