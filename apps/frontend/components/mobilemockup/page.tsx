
"use client";
import React, { useState, useEffect } from 'react';
import { Search, Play, Heart, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/images/textlogo.png'


export default function MusifyHeroMockup() {

  const songResults = [
    {
      id: 1,
      title: "Midnight Monte Carlo",
      artist: "Lunar Vibes",
      duration: "3:45",
   
    },
    {
      id: 2,
      title: "Electric Sinatra",
      artist: "Synth Collectives",
      duration: "4:12",
    },
    {
      id: 3,
      title: "Cosmic Undulation",
      artist: "Astral Projections",
      duration: "3:28",
    },
    {
      id: 4,
      title: "Blue Pulse",
      artist: "City tunes",
      duration: "2:56",
    },
  ];

  // animation states
  const [searchText, setSearchText] = useState("");
  const [visibleSongs, setVisibleSongs] = useState<number[]>([]);
  const searchTerms = ["Monday Blues", "Chill Vibes", "Workout Mix", "Study Music"];
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Text search animation
  useEffect(() => {

    const term = searchTerms[currentTermIndex];
    
    if (currentCharIndex < term.length) {

      const timer = setTimeout(() => {
        setSearchText(term.substring(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      }, 100);
      return () => clearTimeout(timer);

    } else {

      // When finished typing current term
      const timer = setTimeout(() => {
        setCurrentCharIndex(0);
        setCurrentTermIndex((currentTermIndex + 1) % searchTerms.length);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentCharIndex, currentTermIndex]);


  useEffect(() => {
    //  trigger when "Monday Blues" is the search text or "Workout Mix". This will show the songs one after another
    if (searchText === "Monday Blues" || "Workout Mix" ) 
      
      {

      // Reset 
      setVisibleSongs([]);
      
    
      const timers = songResults.map((_, index) => {
        return setTimeout(() => {
          setVisibleSongs(prev => [...prev, index]);
        }, 300 * (index + 1));
      });
      
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [searchText]);

  // Custom props 
  const heartButtonProps = {
    variant: "ghost", 
    size: "icon", 
    className: "text-purple-300 hover:text-white"
  };
  
  const playButtonProps = {
    size: "icon", 
    className: "rounded-full bg-purple-600 hover:bg-purple-700 h-10 w-10"
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {/* Mobile Frame */}
      <div className="relative w-[375px] h-[700px] bg-black rounded-[40px] overflow-hidden shadow-2xl border-[14px] border-black">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-6 bg-black flex justify-between items-center px-5 z-10">
          <div className="text-white text-xs">9:41</div>
          <div className="flex space-x-1">
            <div className="w-7 h-3 bg-white opacity-80 rounded-md"></div>
            <div className="w-3 h-3 bg-white opacity-80 rounded-full"></div>
            <div className="w-3 h-3 bg-white opacity-80 rounded-full"></div>
          </div>
        </div>
        
    
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl z-20"></div>
        
    
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full z-20"></div>

        {/* App Content */}
        <div className="h-full w-full bg-[#1a0933] pt-6 flex flex-col  overflow-hidden  ">

          {/* Header ADDED Logo and Search */}
          <header className="p-4 rounded-2xl bg-[#2d0f4c]">
            <div className="flex items-center justify-center mb-4 rounded-2xl">
            <Link className="block group mt-2" href="/" aria-label="Musify">
                <Image 
                    src={Logo} 
                    width={76} 
                    height={68} 
                    alt="Logo" 
                    className="invert" 
                />
            </Link>

            </div>

            {/* Search Bar */}
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
                <Input
                  placeholder="Search for songs, artists, or albums"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 bg-[#3a1866] border-none focus-visible:ring-purple-500 text-white placeholder:text-purple-300"
                />
              </div>
              {/* <Button className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap text-white text-xs px-2">Musify mood</Button> */}
              <Button
              type="button"
              className="whitespace-nowrap px-4 flex items-center gap-2 transition-all duration-300 bg-purple-600 hover:bg-purple-700 text-white"
              >
              <Sparkles className="h-4 w-4 text-white" />
              <span>Musify AI</span>
              </Button>
            
            </div>
          </header>

          {/*  Song Results */}
          <main className="flex-1 p-4 flex flex-col overflow-hidden">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white">Search Results</h2>
            </div>

            {/* Song List  */}
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-2 py-2 text-sm text-purple-300 border-b border-[#3a1866]">
              <div className="w-6">#</div>
              <div>TITLE</div>
              <div className="flex items-center justify-end">
                <Clock className="h-3 w-3" />
              </div>
              <div className="w-8"></div>
            </div>

            {/* Song List */}
            <div className="flex-1 overflow-hidden">
              {songResults.map((song, index) => (
                <div
                  key={song.id}
                  className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 px-2 py-2 items-center hover:bg-[#2d0f4c] rounded-md transform ${
                    visibleSongs.includes(index) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-0'
                  } transition-opacity duration-300 ease-in`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-6 text-purple-300 text-xs">{index + 1}</div>
                  <div className="flex items-center gap-2">
                    
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm text-white truncate">{song.title}</h3>
                      <p className="text-xs text-purple-300 truncate">{song.artist}</p>
                      <div className="flex gap-1 mt-1">
                        <a
                          href="#"
                          className="text-[9px] bg-[#1DB954] text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5 hover:opacity-90 transition-opacity"
                        >
                          <svg className="w-2 h-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                          </svg>
                          <span>Spotify</span>
                        </a>
                        
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-purple-300">{song.duration}</div>
                  <div className="w-8 flex justify-end">
                    <Button {...heartButtonProps}>
                      <Heart className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </main>

          <footer className="bg-[#2d0f4c] p-2 border-t border-[#3a1866] flex items-center">
            <div className="flex items-center gap-2 flex-1">
    

              <div className="min-w-0 ml-3 mb-3">
                <h4 className="font-medium text-sm text-white truncate">Cosmic Waves</h4>
                <p className="text-xs text-purple-300 truncate">Astral Project</p>
              </div>

              <Button {...heartButtonProps}>
                <Heart className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center mb-3 mr-3 mt-2">
              <Button {...playButtonProps}>
                <Play className="h-4 w-4 " fill="#3a1866" />
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}