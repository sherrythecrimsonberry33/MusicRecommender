
'use client'

import { useState, useEffect } from 'react'
import { Search, Sparkles, Play, Heart, Clock, LogIn, LogOut, User, History, Music } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from '@/public/images/textlogo.png'
import { apiService } from '@/services/api'
import { useRouter } from 'next/navigation'

interface SongResult {
  title: string;
  artist: string;
  spotify_url?: string;
  album_image?: string;
  imageUrl?: string;  
  duration?: string;
  deezer_id?: string;
}

interface SearchHistoryItem {
  query: string;
  timestamp: string;
  recommendations: SongResult[];
}

export default function SearchDashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiModeActive, setAiModeActive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [songResults, setSongResults] = useState<SongResult[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showingHistory, setShowingHistory] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'songs' | 'artists'>('all');

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiService.isAuthenticated()) {
          setIsAuthenticated(true);
          // Try to get user profile
          try {
            const userProfile = await apiService.getUserProfile();
            setUsername(userProfile.username);
          } catch (err) {
            console.error("Failed to get user profile:", err);
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    };

    checkAuth();
  }, []);

  // Handle logout
  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setUsername('');
    // Reset results
    setSongResults([]);
    setShowingHistory(false);
    router.push('/');
  };

  const sortByTitle = (results: SongResult[]) => {
    return [...results].sort((a, b) => 
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
  };
  
  const sortByArtist = (results: SongResult[]) => {
    return [...results].sort((a, b) => 
      a.artist.toLowerCase().localeCompare(b.artist.toLowerCase())
    );
  };

  const getFilteredResults = () => {
    switch (filterMode) {
      case 'songs':
        return sortByTitle(songResults);
      case 'artists':
        return sortByArtist(songResults);
      default:
        return songResults; // 'all' just shows the original order for now
    }
  };

  // Fetch search history
  const fetchSearchHistory = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const history = await apiService.getSearchHistory();
      setSearchHistory(history);
      setShowingHistory(true);
      setSongResults([]); // Clear song results when showing history
    } catch (error) {
      console.error('Error fetching history:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch search history.');
    } finally {
      setIsLoading(false);
    }
  };


// Handle search submission
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!searchQuery.trim()) return;
  
  setIsLoading(true);
  setError('');
  setShowingHistory(false);
  
  try {
    let results: SongResult[] = [];

    try {
      if (aiModeActive) {
        // AI-powered recommendations
        let data;
        if (isAuthenticated) {
          // Authenticated recommendations (saves history)
          data = await apiService.getRecommendations(searchQuery);
        } else {
          // Guest recommendations (no history)
          data = await apiService.getGuestRecommendations(searchQuery);
        }
        
        // Check if response contains a validation message
        if (data.message) {
          // This is a validation error from the backend (inappropriate content)
          throw new Error(data.message);
        }
        
        results = data.recommendations || [];
      } else {
        // Direct Spotify search
        const data = await apiService.searchSpotify(searchQuery);
        results = data.songs || [];
      }
    } catch (apiError) {
      const errorMessage = apiError instanceof Error 
        ? apiError.message 
        : 'Unknown error occurred';
      
      // Check if it's a backend connectivity issue
      if (errorMessage.includes('Unable to connect')) {
        throw new Error("Can't connect to server. Please ensure the backend is running.");
      } else if (errorMessage.includes('No relevant songs found')) {
        throw new Error(`No songs found matching "${searchQuery}". Try a different search.`);
      } else {
        throw new Error(errorMessage);
      }
    }
    
    // Add default duration if not provided by API
    const processedResults = results.map((song: SongResult) => ({
      ...song,
      duration: song.duration || "3:30", // Default duration if not provided
    }));
    
    setSongResults(processedResults);
  } catch (error) {
    console.error('Search error:', error);
    setError(error instanceof Error ? error.message : 'Failed to search. Please try again.');
    setSongResults([]);
  } finally {
    setIsLoading(false);
  }
};

  // Function to load a specific historical search's recommendations
  const loadHistoricalRecommendations = (recommendations: SongResult[]) => {
    setShowingHistory(false);
    setSongResults(recommendations.map(rec => ({
      ...rec,
      duration: rec.duration || "3:30" // Default duration if not provided
    })));
  };

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
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-purple-300 hidden md:inline">Welcome, {username}</span>
              <Button 
                variant="ghost" 
                className="text-purple-300 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              className="text-purple-300 hover:text-white"
              onClick={() => router.push('/login')}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
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
          
          {/* Search History Button (only for authenticated users) */}
          {isAuthenticated && (
            <Button 
              type="button" 
              variant={showingHistory ? "default" : "outline"}
              className={showingHistory 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
              }
              onClick={fetchSearchHistory}
            >
              <History className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">History</span>
            </Button>
          )}
        </form>
      </header>

      {/*Main Content */}
      <main className="flex-1 p-4 md:p-6 flex flex-col max-w-6xl mx-auto w-full">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg md:text-xl font-bold">
            {showingHistory 
              ? 'Previous Musify AI recommendations' 
              : aiModeActive 
                ? 'AI-Powered Recommendations' 
                : 'Search Results'}
          </h2>
          
          {!showingHistory && (
          <div className="flex flex-wrap -m-1">
            <button
              onClick={() => setFilterMode('all')}
              className={`font-medium text-sm px-3 py-1 rounded-full inline-flex transition duration-150 ease-in-out m-1 ${
                filterMode === 'all' 
                  ? 'bg-[#3a1866] text-white' 
                  : 'bg-[#2d0f4c] text-purple-300 hover:bg-[#4a2876]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('songs')}
              className={`font-medium text-sm px-3 py-1 rounded-full inline-flex transition duration-150 ease-in-out m-1 ${
                filterMode === 'songs' 
                  ? 'bg-[#3a1866] text-white' 
                  : 'bg-[#2d0f4c] text-purple-300 hover:bg-[#4a2876]'
              }`}
            >
              Sort by Title
            </button>
            <button
              onClick={() => setFilterMode('artists')}
              className={`font-medium text-sm px-3 py-1 rounded-full inline-flex transition duration-150 ease-in-out m-1 ${
                filterMode === 'artists' 
                  ? 'bg-[#3a1866] text-white' 
                  : 'bg-[#2d0f4c] text-purple-300 hover:bg-[#4a2876]'
              }`}
            >
              Sort by Artist
            </button>
          </div>
        )}
        </div>

        {/* Search History View */}
        {showingHistory ? (
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : searchHistory.length > 0 ? (
              <div className="space-y-6">
                {searchHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-[#2d0f4c] rounded-lg p-4 shadow-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-lg">"{item.query}"</h3>
                      <span className="text-sm text-purple-300">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-3">
                      <h4 className="text-sm text-purple-300 mb-2">Recommendations:</h4>
                      <ul className="space-y-1 text-sm">
                        {item.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="flex justify-between">
                            <span>{rec.title} by {rec.artist}</span>
                            <div className="flex items-center gap-2">
                              {rec.spotify_url && (
                                <a 
                                  href={rec.spotify_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs bg-[#1DB954] text-white px-2 py-0.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity"
                                >
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                                  </svg>
                                  <span>Play</span>
                                </a>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="mt-3 bg-purple-600 hover:bg-purple-700 text-sm"
                        onClick={() => loadHistoricalRecommendations(item.recommendations)}
                      >
                        View as Results
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 text-purple-300">
                <History className="h-10 w-10 mb-2 opacity-50" />
                <p className="text-center">Your search history is empty</p>
                <p className="text-center text-sm mt-1">Try searching for some music!</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Table Header (only show when results are present) */}
            {songResults.length > 0 && songResults[0].deezer_id && (
              <div className="mb-6 p-4 bg-[#2d0f4c] rounded-lg">
                <h3 className="text-white font-medium mb-2">30s Free Top Audio Preview</h3>
                <iframe 
                  title="Deezer Player"
                  src={`https://widget.deezer.com/widget/dark/track/${songResults[0].deezer_id}`}
                  width="100%" 
                  height="90" 
                  allow="encrypted-media; clipboard-write"
                ></iframe>
              </div>
            )}
            
            {songResults.length > 0 && (
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 text-sm text-purple-300 border-b border-[#3a1866]">
                <div className="w-10">#</div>
                <div>TITLE</div>
                <div className="flex items-center justify-end">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="w-10"></div>
              </div>
            )}

            {/* Song List */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : songResults.length > 0 ? (
                getFilteredResults().map((song, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-4 items-center hover:bg-[#2d0f4c] rounded-md transition-colors duration-200 border-b border-[#3a1866]/30"
                  >
                    <div className="w-10 text-purple-300">{index + 1}</div>
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        {song.album_image || song.imageUrl ?(
                          <Image
                            src={song.album_image || song.imageUrl || ''}
                            alt={song.title}
                            width={48}
                            height={48}
                            className="rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-purple-800/50 rounded-md flex items-center justify-center">
                            <Music className="h-6 w-6 text-purple-300" />
                          </div>
                        )}
                        <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                          <Play className="h-5 w-5 text-white" fill="white" />
                        </button>
                      </div>
                      <div>
                        <h3 className="font-medium">{song.title}</h3>
                        <p className="text-sm text-purple-300">{song.artist}</p>
                        <div className="flex gap-2 mt-1">
                          {song.spotify_url && (
                            <a
                              href={song.spotify_url}
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
          </>
        )}
      </main>
    </div>
  )
}