

import Link from 'next/link'
import MusifyApp from './mobilemockup/page'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">


          {/*Main content div */}
          <div className="relative max-w-xl mx-auto md:max-w-none text-center md:text-left flex flex-col md:flex-row">
        
            <div
              className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl -mx-20 -z-10 overflow-hidden mb-12 mt-0 md:mb-0"
              aria-hidden="true"
            >
              {/* the color path problem fixed added the graphic svg path */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/3 md:-translate-x-1/2 pointer-events-none -z-10 blur-2xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="2106" height="1327">
                  <defs>
                    <filter id="hi-a" width="133.3%" height="131.3%" x="-16.7%" y="-15.6%" filterUnits="objectBoundingBox">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
                    </filter>
                    <filter id="hi-b" width="133.3%" height="131.3%" x="-16.7%" y="-15.6%" filterUnits="objectBoundingBox">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
                    </filter>
                    <filter id="hi-c" width="159.9%" height="145%" x="-29.9%" y="-22.5%" filterUnits="objectBoundingBox">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
                    </filter>
                  </defs>
                  <g fill="none" fillRule="evenodd" opacity="0.3">
                    <path
                      fill="#9333EA"
                      fillOpacity=".5"
                      d="M1110.164 893.257C1191.124 1079.102 1484 839.962 1484 626.315S883.228 0 669.507 0s40.54 412.668 40.54 626.315c0 213.647 319.156 81.096 400.117 266.942Z"
                      filter="url(#hi-a)"
                      transform="translate(0 -605)"
                    />
                    <path
                      fill="#8B5CF6"
                      fillOpacity=".4"
                      d="M1732.164 1753.257c80.96 185.845 373.836-53.295 373.836-266.942S1505.228 860 1291.507 860s40.54 412.668 40.54 626.315c0 213.647 319.156 81.096 400.117 266.942Z"
                      filter="url(#hi-b)"
                      transform="translate(0 -605)"
                    />
                    <path
                      fill="#A78BFA"
                      fillOpacity=".3"
                      d="M1191.108 871C1338.988 871 1631 635.765 1631 487.507 1631 339.248 1625.874 205 1477.994 205s-267.76 120.187-267.76 268.445c0 148.259-167.006 397.555-19.126 397.555Z"
                      filter="url(#hi-c)"
                      transform="translate(0 -605)"
                    />
                  </g>
                </svg>
              </div>
              
              {/* Music wave svg */}
              
              <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                  <path d="M0,0 C150,120 350,0 500,80 C650,160 700,0 900,40 C1050,75 1200,0 1200,0 V120 H0 V0 Z" className="fill-white"></path>
                </svg>
              </div>
            </div>

          
            <div className="md:w-[640px] py-12 md:py-20 md:min-h-[480px]">
           
              <h1 className="h1 font-hkgrotesk text-slate-100 mb-6" data-aos="fade-right" data-aos-delay="100">
                Discover music that matches your{' '}
                <span className="font-permanent-marker text-indigo-400 font-normal whitespace-nowrap">
                  mood{' '}
                  <span className="inline-flex relative">
                    <svg
                      className="absolute right-0 top-full mt-1 max-w-none -z-10"
                      width="135"
                      height="9"
                      viewBox="0 0 135 9"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="fill-white"
                        fillRule="nonzero"
                        d="M36.54 1.016C40.01.912 43.39.78 46.95.712 50.51.644 54.071.567 57.81.566c2.744.002 5.018-.162 7.897-.113 9.89.085 20.486.459 31.646 1.116 2.484.151 4.835.242 7.296.39 2.461.147 4.924.282 7.34.413 1.528.069 3.186.202 4.684.31a187 187 0 0 1 4.89.34c3.416.326 6.937.738 10.5 1.23 2.316.32 2.482.762 1.474 1.152-1.082.485-3.3.708-6.3.635-.705-.026-1.39-.039-2.117-.076l-2.202-.137-4.43-.268a899.607 899.607 0 0 1-8.75-.477c-2.953-.174-5.754-.262-8.71-.427-2.955-.165-5.803-.257-8.829-.424-1.786-.084-3.509-.137-5.156-.16-1.697-.039-3.396-.07-5.027-.081l-9.497.059c-6.873.071-13.98.132-20.388.403-4.089.123-7.886.344-11.683.565l-8.169.637c-2.596.256-5.236.496-7.537.828-1.768.261-3.332.576-4.873.895-1.541.319-2.877.683-4.575.95-.775.112-1.367.265-2.142.376-2.903.406-4.781.312-8.094-.282a79.95 79.95 0 0 1-2.301-.412C.465 7.541-.327 6.866.558 6.205c.714-.471 1.384-.971 2.398-1.395 1.013-.424 2.483-.741 3.838-1.08 1.355-.34 3.28-.546 5.025-.802 1.744-.256 3.69-.446 5.594-.66C23.24 1.688 29.49 1.233 36.13.904l.408.112Z"
                        opacity=".32"
                      />
                    </svg>
                    perfectly
                  </span>
                  <span className="text-slate-100">.</span>
                </span>
              </h1>
              <p className="text-lg text-slate-300 mb-8" data-aos="fade-right" data-aos-delay="200">
                Musify's AI-powered recommendation engine finds the perfect soundtrack for every moment, based on your unique taste and current vibe.
              </p>
              {/* all the Buttons */}
              <div
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <div>
                  <Link className="btn text-white bg-indigo-600 hover:bg-indigo-700 group shadow-md rounded-md px-5 py-2 font-medium transition-all duration-200 ease-in-out" href="/dashboard">
                    Get Started{' '}
                    <span className="tracking-normal text-white group-hover:translate-x-1 transition-transform duration-150 ease-in-out ml-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
    
            </div>



            <MusifyApp/>
            
            {/* Floating music icons */}
            <div className="absolute top-20 right-16 animate-float-slow hidden lg:block">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" opacity="0.2">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <div className="absolute bottom-32 left-24 animate-float-medium hidden lg:block">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" opacity="0.15">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Full page overlay gradient behind the hero section */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 -z-20"></div>
    </section>
  )
}