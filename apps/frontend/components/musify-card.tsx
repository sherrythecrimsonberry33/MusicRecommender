// "use client"

// import { useState } from "react"
// import { Button } from "./ui/button"
// import { Instagram, Copy, Check, Play, ExternalLink, Share2, Music } from "lucide-react"
// import { QRCodeSVG } from "qrcode.react"

// interface MusicStyle {
//   name: string
//   score: number
//   color: string
// }

// interface Song {
//   id: string
//   title: string
//   artist: string
//   coverUrl: string
// }

// export default function MusicCard() {
//   const [copied, setCopied] = useState(false)
//   const [currentSong, setCurrentSong] = useState<string | null>(null)

//   const profileUrl = "https://musify.app/profile/johndoe"

//   const musicStyles: MusicStyle[] = [
//     { name: "Pop", score: 85, color: "bg-pink-500" },
//     { name: "Rock", score: 65, color: "bg-purple-500" },
//     { name: "Hip Hop", score: 75, color: "bg-blue-500" },
//     { name: "Electronic", score: 90, color: "bg-green-500" },
//   ]

//   const topSongs: Song[] = [
//     {
//       id: "1",
//       title: "Blinding Lights",
//       artist: "The Weeknd",
//       coverUrl: "/api/placeholder/60/60",
//     },
//     {
//       id: "2",
//       title: "As It Was",
//       artist: "Harry Styles",
//       coverUrl: "/api/placeholder/60/60",
//     },
//     {
//       id: "3",
//       title: "Bad Habit",
//       artist: "Steve Lacy",
//       coverUrl: "/api/placeholder/60/60",
//     },
//   ]

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(profileUrl)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   const shareToInstagram = () => {
//     window.open(`https://instagram.com`, "_blank")
//   }
  
//   const playSong = (id: string) => {
//     setCurrentSong(currentSong === id ? null : id)
//   }

//   return (
//     <div className="w-full max-w-sm mx-auto overflow-hidden rounded-xl shadow-lg border bg-white">
//       {/* Header with gradient */}
//       <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-800">
//         <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/30 to-transparent"></div>
//         <div className="absolute top-4 left-4 flex items-center">
//           <Music className="h-6 w-6 text-white" />
//           <h2 className="ml-2 text-xl font-bold text-white tracking-tight">Musify</h2>
//         </div>
        
//         {/* Profile Avatar - positioned to overlap the sections */}
//         <div className="absolute -bottom-14 left-6">
//           <div className="relative">
//             <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
//               <img 
//                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqbWitrQVchxsz7ZISxescTWLQNnKP8ctdhw&s" 
//                 alt="User profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
//               <Music className="w-4 h-4 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Content area */}
//       <div className="pt-16 px-6 pb-6">
//         {/* User info */}
//         <div className="flex justify-between items-start mb-6">
//           <div>
//             <h3 className="text-xl font-bold">Aryan</h3>
//             <p className="text-sm text-gray-500">@aryanmogera • Music Enthusiast</p>
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             className="flex items-center gap-1 text-xs h-8 rounded-full border-purple-200 hover:bg-purple-50 hover:text-purple-700"
//             onClick={copyToClipboard}
//           >
//             {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
//             {copied ? "Copied!" : "Share Profile"}
//           </Button>
//         </div>
        
//         {/* Music taste */}
//         <div className="mb-6">
//           <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Music Taste</h4>
//           <div className="grid grid-cols-4 gap-2">
//             {musicStyles.map((style) => (
//               <div key={style.name} className="flex flex-col items-center">
//                 <div className="relative w-14 h-14">
//                   <div className="absolute inset-0 rounded-full bg-gray-100"></div>
//                   <svg className="absolute inset-0 w-14 h-14 transform -rotate-90">
//                     <circle cx="28" cy="28" r="22" strokeWidth="4" stroke="#f3f4f6" fill="transparent" />
//                     <circle
//                       cx="28"
//                       cy="28"
//                       r="22"
//                       strokeWidth="4"
//                       stroke={style.color.replace("bg-", "var(--")}
//                       fill="transparent"
//                       strokeDasharray={`${(2 * Math.PI * 22 * style.score) / 100} ${2 * Math.PI * 22 * (1 - style.score / 100)}`}
//                       className="transition-all duration-1000 ease-out"
//                     />
//                   </svg>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="text-sm font-bold">{style.score}%</span>
//                   </div>
//                 </div>
//                 <span className="text-xs font-medium mt-1">{style.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Top 3 songs */}
//         <div className="mb-6">
//           <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Songs Discovered</h4>
//           <div className="space-y-3">
//             {topSongs.map((song) => (
//               <div
//                 key={song.id}
//                 className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
//               >
//                 <div 
//                   className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
//                   onClick={() => playSong(song.id)}
//                 >
//                   <img
//                     src={song.coverUrl}
//                     alt={`${song.title} cover`}
//                     className="object-cover w-full h-full"
//                   />
//                   <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${currentSong === song.id ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
//                     <Play className="w-6 h-6 text-white" fill={currentSong === song.id ? "white" : "transparent"} />
//                   </div>
//                 </div>
//                 <div className="ml-3 flex-grow">
//                   <h5 className="font-medium text-sm line-clamp-1">{song.title}</h5>
//                   <p className="text-xs text-gray-500">{song.artist}</p>
//                 </div>
//                 <Button variant="ghost" size="icon" className="w-8 h-8 flex-shrink-0 text-gray-500 hover:text-gray-700">
//                   <ExternalLink className="w-4 h-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* QR code and share section */}
//         <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
//           <div className="bg-white rounded-lg border border-gray-200 p-2">
//             <QRCodeSVG 
//               value={profileUrl} 
//               size={80} 
//               level="H" 
//               includeMargin={false}
//               bgColor="#FFFFFF"
//               fgColor="#000000"
//             />
//           </div>
//           <div className="flex-1">
//             <p className="text-xs text-gray-500 mb-2">Scan to view profile or share with friends</p>
//             <div className="flex gap-2">
//               <Button
//                 size="sm"
//                 className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs h-8 rounded-full flex-1"
//                 onClick={shareToInstagram}
//               >
//                 <Instagram className="h-3 w-3" />
//                 Share on Instagram
//               </Button>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="flex items-center gap-1 text-xs h-8 w-8 p-0 rounded-full"
//               >
//                 <Share2 className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Instagram, Copy, Check, Play, ExternalLink, Share2, Music } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface MusicStyle {
  name: string
  score: number
  color: string
}

interface Song {
  id?: string;
  title: string;
  artist: string;
  coverUrl?: string;
  album_image?: string;
  spotify_url?: string;
}

interface MusicCardProps {
  username: string;
  selectedSongs: Song[];
  playlistUrl: string;
}

export default function MusicCard({ username, selectedSongs = [], playlistUrl }: MusicCardProps) {
  const [copied, setCopied] = useState(false)
  const [currentSong, setCurrentSong] = useState<string | null>(null)

  // Use the playlistUrl from props, or a fallback
  const shareUrl = playlistUrl || "https://musify.app/shared-playlist";

  // Generate appropriate music taste based on selected songs
  const generateMusicTaste = (): MusicStyle[] => {
    // Default styles
    if (selectedSongs.length === 0) {
      return [
        { name: "Pop", score: 85, color: "bg-pink-500" },
        { name: "Rock", score: 65, color: "bg-purple-500" },
        { name: "Hip Hop", score: 75, color: "bg-blue-500" },
        { name: "Electronic", score: 90, color: "bg-green-500" },
      ];
    }
    
    // Generate dynamic styles based on song count
    const genres = ["Pop", "Rock", "Hip Hop", "Electronic"];
    const selectedGenres = genres.slice(0, Math.min(4, selectedSongs.length));
    
    return selectedGenres.map((genre, index) => {
      // Generate a random score between 65-95
      const score = Math.floor(Math.random() * 30) + 65;
      
      // Assign colors based on genre
      const colors = ["bg-pink-500", "bg-purple-500", "bg-blue-500", "bg-green-500"];
      
      return {
        name: genre,
        score: score,
        color: colors[index % colors.length]
      };
    });
  };

  const musicStyles = generateMusicTaste();

  // Get top 3 songs from selectedSongs, or use defaults if empty
  const topSongs = selectedSongs.length > 0 
    ? selectedSongs.slice(0, 3).map((song, index) => ({
        id: index.toString(),
        title: song.title,
        artist: song.artist,
        coverUrl: song.album_image || "/api/placeholder/60/60",
        spotify_url: song.spotify_url
      }))
    : [
        {
          id: "1",
          title: "Blinding Lights",
          artist: "The Weeknd",
          coverUrl: "/api/placeholder/60/60",
          spotify_url: "https://open.spotify.com/track/1",
        },
        {
          id: "2",
          title: "As It Was",
          artist: "Harry Styles",
          coverUrl: "/api/placeholder/60/60",
        },
        {
          id: "3",
          title: "Bad Habit",
          artist: "Steve Lacy",
          coverUrl: "/api/placeholder/60/60",
        },
      ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToInstagram = () => {
    // Create a shareable text with the playlist link
    const shareText = `Check out my Musify playlist: ${shareUrl}`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'My Musify Playlist',
        text: shareText,
        url: shareUrl,
      })
      .catch((error) => {
        // Fallback to Instagram website
        window.open(`https://instagram.com`, "_blank");
      });
    } else {
      // Fallback to Instagram website
      window.open(`https://instagram.com`, "_blank");
    }
  }
  
  const playSong = (id: string) => {
    setCurrentSong(currentSong === id ? null : id)
  }

  // Clean username for display
  const displayName = username || "Music Lover";
  const displayUsername = username.toLowerCase().replace(/\s+/g, '_').slice(0, 15) || "music_lover";

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-3xl shadow-md backdrop-blur-sm border border-white/10 bg-white/80">
      {/* Glassmorphic Header with subtle gradient */}
      <div className="relative h-20 bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-purple-700/90 backdrop-blur-md">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="absolute top-4 left-4 flex items-center">
          <Music className="h-4 w-4 text-white/90" />
          <h2 className="ml-2 text-base font-medium text-white/90 tracking-tight">Musify</h2>
        </div>
        
        {/* Profile Avatar - minimalist style */}
        <div className="absolute -bottom-8 left-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full ring-2 ring-white/50 ring-offset-2 ring-offset-purple-50 overflow-hidden backdrop-blur-sm flex items-center justify-center">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqbWitrQVchxsz7ZISxescTWLQNnKP8ctdhw&s" 
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400/90 backdrop-blur-sm rounded-full ring-1 ring-white/80 flex items-center justify-center">
              <Music className="w-3 h-3 text-white/90" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content area - more minimalist spacing */}
      <div className="pt-10 px-4 pb-4">
        {/* User info - with cleaner alignment */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-base font-medium">{displayName}</h3>
            <p className="text-xs text-gray-500/80">@{displayUsername} • Music Enthusiast</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-xs h-7 rounded-full text-purple-600 hover:bg-purple-50/50 backdrop-blur-sm hover:text-purple-700"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Share"}
          </Button>
        </div>
        
        {/* Music taste - glassmorphic design */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500/90 mb-2">MUSIC TASTE</h4>
          <div className="grid grid-cols-4 gap-2">
            {musicStyles.map((style) => (
              <div key={style.name} className="flex flex-col items-center">
                <div className="relative w-10 h-10 backdrop-blur-sm">
                  <div className="absolute inset-0 rounded-full bg-gray-50/30"></div>
                  <svg className="absolute inset-0 w-10 h-10 transform -rotate-90">
                    <circle cx="20" cy="20" r="16" strokeWidth="2" stroke="#f3f4f6" fill="transparent" />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      strokeWidth="2"
                      stroke={style.color.replace("bg-", "var(--")}
                      fill="transparent"
                      strokeDasharray={`${(2 * Math.PI * 16 * style.score) / 100} ${2 * Math.PI * 16 * (1 - style.score / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium">{style.score}</span>
                  </div>
                </div>
                <span className="text-xs mt-1 text-gray-600/90">{style.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 songs - glassmorphic minimalist list */}
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500/90 mb-2">TOP SONGS DISCOVERED</h4>
          <div className="space-y-2">
            {topSongs.map((song) => (
              <div
                key={song.id}
                className="flex items-center p-2 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                <div 
                  className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer shadow-sm"
                  onClick={() => playSong(song.id || '')}
                >
                  <img
                    src={song.coverUrl || "/api/placeholder/60/60"}
                    alt={`${song.title} cover`}
                    className="object-cover w-full h-full"
                  />
                  <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-opacity ${currentSong === song.id ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                    <Play className="w-4 h-4 text-white/90" fill={currentSong === song.id ? "white" : "transparent"} />
                  </div>
                </div>
                <div className="ml-2 flex-grow">
                  <h5 className="font-medium text-xs line-clamp-1">{song.title}</h5>
                  <p className="text-xs text-gray-500/80">{song.artist}</p>
                </div>
                {song.spotify_url && (
                  <a 
                    href={song.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <Button variant="ghost" size="icon" className="w-6 h-6 text-gray-400/90 hover:text-gray-600/90">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* QR code and share section - glassmorphic style */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100/30 mt-2">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm p-1">
            <QRCodeSVG 
              value={shareUrl} 
              size={60} 
              level="H" 
              includeMargin={false}
              bgColor="rgba(255, 255, 255, 0.5)"
              fgColor="rgba(79, 70, 229, 0.9)"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500/80 mb-1">Scan to listen on Spotify</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex items-center gap-1 bg-gradient-to-r from-indigo-500/80 to-purple-600/80 backdrop-blur-sm text-white/90 text-xs h-7 rounded-full flex-1 shadow-sm"
                onClick={shareToInstagram}
              >
                <Instagram className="h-3 w-3" />
                Share
              </Button>
              <a 
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-1 text-xs h-7 w-7 p-0 rounded-full text-purple-500 border border-purple-200/30 backdrop-blur-sm"
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}