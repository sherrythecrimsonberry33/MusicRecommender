import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/public/images/monologo.png'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
            <div className="flex items-center">
              <Link className="inline-flex" href="/" aria-label="Musify">
                <Image src={Logo} width={32} height={24} alt="Logo" />
              </Link>
              <div className="text-sm text-slate-300 ml-3">
                Musify © The Music Recommender <span className="md:hidden lg:inline">. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}