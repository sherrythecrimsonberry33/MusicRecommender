import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/public/images/textlogo.png'

export default function Header({ nav = true }: {
  nav?: boolean
}) {
  return (
    <header className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-7xl mx-auto rounded-xl bg-white/60 backdrop-blur-md shadow-md">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
       
          <div className="shrink-0 mr-4">
          
            <Link className="block group" href="/" aria-label="Musify">
              <Image src={Logo} width={96} height={78} alt="Logo" />
            </Link>
          </div>
      

          {nav &&
            <nav className="flex grow">
       
              <ul className="flex grow justify-end flex-wrap items-center">
                <li>
                  <Link 
                    className="btn-sm text-white bg-indigo-600 hover:bg-indigo-700 group shadow-md rounded-md px-5 py-2 font-medium transition-all duration-200 ease-in-out transform hover:scale-105" 
                    href="/login"
                  >
                    Login
                    <span className="tracking-normal text-white group-hover:translate-x-1 transition-transform duration-150 ease-in-out ml-1">
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>
          }
        </div>
      </div>
    </header>
  )
}