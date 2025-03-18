

'use client'

import { useState, useEffect } from 'react'
import { Search, Sparkles, Play, Heart, Clock, LogIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from '@/public/images/textlogo.png'

interface SongResult {
  id: string;
  title: string;
  artist: string;
  duration: string;
  spotifyUrl?: string;
}

export default function SearchDashboard() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiModeActive, setAiModeActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [songResults, setSongResults] = useState<SongResult[]>([]);

  // Handle search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Determine which endpoint to use based on AI mode
      const endpoint = aiModeActive 
        ? '/api/ai-search' 
        : '/api/spotify-search';
      
      const response = await fetch(`${endpoint}?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      // Process and set results
      setSongResults(data);
    } catch (error) {
      console.error('Search error:', error);
      // Handle error state here
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data 
  useEffect(() => {
    // This would normally come from your API
    const mockResults: SongResult[] = [
      {
        id: "1",
        title: "Midnight Melodies",
        artist: "Luna Echo",
        duration: "3:45",
        spotifyUrl: "https://spotify.com/track/1",
      },
      {
        id: "2",
        title: "Electric Dreams",
        artist: "Synth Collective",
        duration: "4:12",
        spotifyUrl: "https://spotify.com/track/2"
      },
      {
        id: "3",
        title: "Cosmic Waves",
        artist: "Astral Project",
        duration: "3:28",
        spotifyUrl: "https://spotify.com/track/3"
      },
      {
        id: "4",
        title: "Urban Pulse",
        artist: "City Beats",
        duration: "2:56",
        spotifyUrl: "https://spotify.com/track/4"
      },
    ];
    
    setSongResults(mockResults);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#1a0933] text-white">
      {/* Header with Logo and Search */}
      <header className="p-4 md:p-6 bg-[#2d0f4c]">
        <div className="flex items-center justify-between mb-6">
          <Link className="block group" href="/" aria-label="Musify">
            <Image 
              src={Logo} 
              width={76} 
              height={68} 
              alt="Musify Logo" 
              className="invert" 
            />
          </Link>
          
          <Button 
            variant="ghost" 
            className="text-purple-300 hover:text-white"
            onClick={() => window.location.href = '/login'}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
            <Input
              placeholder={aiModeActive ? "Describe the music you're looking for..." : "Search for songs, artists, or albums"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 border-none focus-visible:ring-purple-500 text-white placeholder:text-purple-300 ${
                aiModeActive 
                  ? 'bg-[#4c2580]' 
                  : 'bg-[#3a1866]'
              }`}
            />
          </div>
          <Button
            type="button"
            className={`whitespace-nowrap px-4 flex items-center gap-2 transition-all duration-300 ${
              aiModeActive
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300'
            }`}
            onClick={() => setAiModeActive(!aiModeActive)}
          >
            <Sparkles className={`h-4 w-4 ${aiModeActive ? 'text-white' : 'text-purple-300'}`} />
            <span>Musify AI</span>
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            Search
          </Button>
        </form>
      </header>

      {/*Song Results */}
      <main className="flex-1 p-4 md:p-6 flex flex-col max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg md:text-xl font-bold">
            {aiModeActive ? 'AI-Powered Recommendations' : 'Search Results'}
          </h2>
          
          {/*filters */}
          <div className="flex flex-wrap -m-1">
            <button
              className="font-medium text-sm bg-[#3a1866] hover:bg-[#4a2876] px-3 py-1 rounded-full inline-flex transition duration-150 ease-in-out m-1"
            >
              All
            </button>
            <button
              className="font-medium text-sm bg-[#2d0f4c] hover:bg-[#4a2876] px-3 py-1 rounded-full inline-flex transition duration-150 ease-in-out m-1 text-purple-300"
            >
              Songs
            </button>
            <button
              className="font-medium text-sm bg-[#2d0f4c] hover:bg-[#4a2876] px-3 py-1 rounded-full inline-flex transition duration-150 ease-in-out m-1 text-purple-300"
            >
              Artists
            </button>
            <button
              className="font-medium text-sm bg-[#2d0f4c] hover:bg-[#4a2876] px-3 py-1 rounded-full inline-flex transition duration-150 ease-in-out m-1 text-purple-300"
            >
              Albums
            </button>
          </div>
        </div>

       
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 text-sm text-purple-300 border-b border-[#3a1866]">
          <div className="w-10">#</div>
          <div>TITLE</div>
          <div className="flex items-center justify-end">
            <Clock className="h-4 w-4" />
          </div>
          <div className="w-10"></div>
        </div>

        {/* Song List */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : songResults.length > 0 ? (
            songResults.map((song, index) => (
              <div
                key={song.id}
                className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-4 items-center hover:bg-[#2d0f4c] rounded-md transition-colors duration-200 border-b border-[#3a1866]/30"
              >
                <div className="w-10 text-purple-300">{index + 1}</div>
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    {/* <Image
                      src={song.imageUrl || "/placeholder.svg?height=48&width=48"}
                      alt={song.title}
                      width={48}
                      height={48}
                      className="rounded-md"
                    /> */}
                    <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                      <Play className="h-5 w-5 text-white" fill="white" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-medium">{song.title}</h3>
                    <p className="text-sm text-purple-300">{song.artist}</p>
                    <div className="flex gap-2 mt-1">
                      {song.spotifyUrl && (
                        <a
                          href={song.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-[#1DB954] text-white px-2 py-0.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity"
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                          </svg>
                          <span>Spotify</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-purple-300">{song.duration}</div>
                <div className="w-10 flex justify-end">
                  <button className="text-purple-300 hover:text-white transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-60 text-purple-300">
              <Search className="h-10 w-10 mb-2 opacity-50" />
              <p className="text-center">
                {aiModeActive 
                  ? "Try asking for music that matches your mood or activity" 
                  : "Search for your favorite songs, artists or albums"}
              </p>
            </div>
          )}
        </div>
      </main>

    </div>
  )
}