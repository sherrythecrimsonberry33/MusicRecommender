import './css/style.css'



import { Inter, Permanent_Marker } from 'next/font/google'
import localFont from 'next/font/local'



const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})



const permanent_marker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-permanent-marker',
  display: 'swap'
})




const hkgrotesk = localFont({
  src: [
    {
      path: '../public/fonts/HKGrotesk-Medium.woff2',
      weight: '500',
    },
    {
      path: '../public/fonts/HKGrotesk-ExtraBold.woff2',
      weight: '800',
    },        
  ],
  variable: '--font-hkgrotesk',
  display: 'swap',  
})

export const metadata = {
  title: 'Create Musify App',
  description: 'Generated by next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${permanent_marker.variable} ${hkgrotesk.variable} font-inter antialiased bg-white text-slate-800 tracking-tight`}>
        <div className="flex flex-col min-h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}
