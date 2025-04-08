// 'use client'

// import { useState } from 'react'
// import { 
//   History, 
//   Search, 
//   Trash2, 
//   Share2, 
//   AlertTriangle, 
//   X, 
//   Check, 
//   Music 
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogDescription,
//   DialogFooter,
//   DialogClose
// } from "@/components/ui/dialog"
// import { 
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import Image from "next/image"
// import { format } from 'date-fns'
// import { apiService } from '@/services/api'
// import MusicCard from './musify-card'

// interface SongResult {
//   title: string;
//   artist: string;
//   spotify_url?: string;
//   album_image?: string;
//   imageUrl?: string;  
//   duration?: string;
//   deezer_id?: string;
// }

// interface SearchHistoryItem {
//   id: number;
//   query: string;
//   timestamp: string;
//   recommendations: SongResult[];
// }

// interface SearchHistoryProps {
//   searchHistory: SearchHistoryItem[];
//   loadHistoricalRecommendations: (recommendations: SongResult[]) => void;
//   onHistoryDeleted: () => void;
//   isLoading: boolean;
// }

// export default function SearchHistory({ 
//   searchHistory, 
//   loadHistoricalRecommendations, 
//   onHistoryDeleted,
//   isLoading
// }: SearchHistoryProps) {
//   const [selectedHistoryItem, setSelectedHistoryItem] = useState<SearchHistoryItem | null>(null);
//   const [selectedSongs, setSelectedSongs] = useState<SongResult[]>([]);
//   const [deleteAlertOpen, setDeleteAlertOpen] = useState<boolean>(false);
//   const [deleteAllAlertOpen, setDeleteAllAlertOpen] = useState<boolean>(false);
//   const [historyIdToDelete, setHistoryIdToDelete] = useState<number | null>(null);
//   const [showShareCard, setShowShareCard] = useState<boolean>(false);
//   const [generatedPlaylistUrl, setGeneratedPlaylistUrl] = useState<string>('');
//   const [deleteError, setDeleteError] = useState<string>('');
//   const [shareStep, setShareStep] = useState<'select' | 'preview'>('select');

//   const handleDeleteHistory = async (historyId: number) => {
//     setHistoryIdToDelete(historyId);
//     setDeleteAlertOpen(true);
//   };

//   const confirmDeleteHistory = async () => {
//     if (!historyIdToDelete) return;
    
//     try {
//       await apiService.deleteSearchHistory(historyIdToDelete);
//       onHistoryDeleted();
//       setDeleteAlertOpen(false);
//       setHistoryIdToDelete(null);
//       setDeleteError('');
//     } catch (error) {
//       setDeleteError('Failed to delete search history. Please try again.');
//     }
//   };

//   const handleDeleteAllHistory = () => {
//     setDeleteAllAlertOpen(true);
//   };

//   const confirmDeleteAllHistory = async () => {
//     try {
//       await apiService.deleteAllSearchHistory();
//       onHistoryDeleted();
//       setDeleteAllAlertOpen(false);
//       setDeleteError('');
//     } catch (error) {
//       setDeleteError('Failed to delete all search history. Please try again.');
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return format(date, 'MMM d, yyyy • h:mm a');
//   };

//   const handleSelectToShare = (historyItem: SearchHistoryItem) => {
//     setSelectedHistoryItem(historyItem);
//     setSelectedSongs([]);
//     setShareStep('select');
//   };

//   const toggleSongSelection = (song: SongResult) => {
//     if (selectedSongs.some(s => s.title === song.title && s.artist === song.artist)) {
//       setSelectedSongs(selectedSongs.filter(s => 
//         !(s.title === song.title && s.artist === song.artist)
//       ));
//     } else {
//       setSelectedSongs([...selectedSongs, song]);
//     }
//   };

//   const isSongSelected = (song: SongResult) => {
//     return selectedSongs.some(s => s.title === song.title && s.artist === song.artist);
//   };

//   const handleShareSelected = async () => {
//     if (selectedSongs.length === 0) return;
    
//     try {
//       // Generate a Spotify playlist URL from the selected songs
//       const spotifyUris = selectedSongs
//         .filter(song => song.spotify_url)
//         .map(song => song.spotify_url as string);
      
//       const playlistName = selectedHistoryItem ? `Musify: ${selectedHistoryItem.query}` : "Musify Playlist";
      
//       // This would normally call the Spotify API, but for now we're just mocking it
//     //   const playlistUrl = await apiService.createSpotifyPlaylist(playlistName, spotifyUris);
      
//     //   setGeneratedPlaylistUrl(playlistUrl);
//       setShareStep('preview');
//     } catch (error) {
//       console.error('Error creating share card:', error);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-2">
//           <History className="h-5 w-5 text-purple-300" />
//           <h2 className="text-lg md:text-xl font-bold">Your Search History</h2>
//         </div>
        
//         {searchHistory.length > 0 && (
//           <Button 
//             variant="outline" 
//             className="text-red-400 border-red-400/30 hover:bg-red-400/10"
//             onClick={handleDeleteAllHistory}
//           >
//             <Trash2 className="h-4 w-4 mr-2" />
//             Clear All
//           </Button>
//         )}
//       </div>

//       {/* Error Message */}
//       {deleteError && (
//         <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
//           {deleteError}
//         </div>
//       )}

//       {/* History Content */}
//       {isLoading ? (
//         <div className="flex justify-center items-center h-40">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
//         </div>
//       ) : searchHistory.length > 0 ? (
//         <div className="space-y-4">
//           {searchHistory.map((item) => (
//             <div 
//               key={item.id} 
//               className="bg-[#2d0f4c] rounded-lg overflow-hidden shadow-lg"
//             >
//               {/* Header */}
//               <div className="bg-[#3a1866] px-4 py-3 flex justify-between items-center">
//                 <div>
//                   <h3 className="font-medium text-lg">"{item.query}"</h3>
//                   <span className="text-xs text-purple-300">
//                     {formatDate(item.timestamp)}
//                   </span>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button 
//                     size="sm"
//                     variant="ghost" 
//                     className="h-8 w-8 p-0 text-purple-300 hover:text-white hover:bg-purple-500/20"
//                     onClick={() => handleSelectToShare(item)}
//                   >
//                     <Share2 className="h-4 w-4" />
//                   </Button>
//                   <Button 
//                     size="sm"
//                     variant="ghost" 
//                     className="h-8 w-8 p-0 text-red-400 hover:text-white hover:bg-red-500/20"
//                     onClick={() => handleDeleteHistory(item.id)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
              
//               {/* Recommendations */}
//               <div className="p-4">
//                 <div className="grid gap-2">
//                   {item.recommendations.map((rec, recIndex) => (
//                     <div key={recIndex} className="flex items-center py-2 px-3 hover:bg-[#3a1866]/30 rounded-md transition-colors">
//                       <div className="w-8 h-8 mr-3 flex-shrink-0">
//                         {rec.album_image ? (
//                           <Image
//                             src={rec.album_image}
//                             alt={rec.title}
//                             width={32}
//                             height={32}
//                             className="rounded-md object-cover"
//                           />
//                         ) : (
//                           <div className="w-8 h-8 bg-purple-800/50 rounded-md flex items-center justify-center">
//                             <Music className="h-4 w-4 text-purple-300" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-grow">
//                         <div className="font-medium text-sm">{rec.title}</div>
//                         <div className="text-xs text-purple-300">{rec.artist}</div>
//                       </div>
//                       {rec.spotify_url && (
//                         <a
//                           href={rec.spotify_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-xs bg-[#1DB954] text-white px-2 py-0.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity"
//                         >
//                           <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
//                           </svg>
//                         </a>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <Button 
//                   className="mt-3 bg-purple-600 hover:bg-purple-700 text-sm"
//                   onClick={() => loadHistoricalRecommendations(item.recommendations)}
//                 >
//                   View as Results
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center h-60 text-purple-300 bg-[#2d0f4c]/50 rounded-lg">
//           <History className="h-10 w-10 mb-2 opacity-50" />
//           <p className="text-center">Your search history is empty</p>
//           <p className="text-center text-sm mt-1">Try searching for some music!</p>
//         </div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
//         <AlertDialogContent className="bg-[#2d0f4c] border-purple-500/30 text-white">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Search History</AlertDialogTitle>
//             <AlertDialogDescription className="text-purple-300">
//               Are you sure you want to delete this search history entry? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white">
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction 
//               className="bg-red-500 hover:bg-red-600 text-white"
//               onClick={confirmDeleteHistory}
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Delete All Confirmation Dialog */}
//       <AlertDialog open={deleteAllAlertOpen} onOpenChange={setDeleteAllAlertOpen}>
//         <AlertDialogContent className="bg-[#2d0f4c] border-purple-500/30 text-white">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Clear All Search History</AlertDialogTitle>
//             <AlertDialogDescription className="text-purple-300">
//               Are you sure you want to delete your entire search history? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white">
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction 
//               className="bg-red-500 hover:bg-red-600 text-white"
//               onClick={confirmDeleteAllHistory}
//             >
//               Delete All
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Share Songs Dialog */}
//       <Dialog open={!!selectedHistoryItem} onOpenChange={(open) => {
//         if (!open) {
//           setSelectedHistoryItem(null);
//           setSelectedSongs([]);
//           setShareStep('select');
//         }
//       }}>
//         <DialogContent className="bg-[#2d0f4c] border-purple-500/30 text-white sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>
//               {shareStep === 'select' ? 'Select Songs to Share' : 'Preview Shareable Card'}
//             </DialogTitle>
//             <DialogDescription className="text-purple-300">
//               {shareStep === 'select' 
//                 ? 'Choose songs from this search to include in your shareable music card.'
//                 : 'This is how your music card will look when shared with others.'}
//             </DialogDescription>
//           </DialogHeader>

//           {shareStep === 'select' && selectedHistoryItem && (
//             <>
//               <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
//                 {selectedHistoryItem.recommendations.map((song, idx) => (
//                   <div 
//                     key={idx}
//                     className={`flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer ${
//                       isSongSelected(song) 
//                         ? 'bg-purple-500/30 border-purple-500/50 border' 
//                         : 'hover:bg-[#3a1866]/50'
//                     }`}
//                     onClick={() => toggleSongSelection(song)}
//                   >
//                     <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-purple-400/50">
//                       {isSongSelected(song) && <Check className="h-4 w-4 text-purple-400" />}
//                     </div>
//                     <div className="w-8 h-8 flex-shrink-0">
//                       {song.album_image ? (
//                         <Image
//                           src={song.album_image}
//                           alt={song.title}
//                           width={32}
//                           height={32}
//                           className="rounded-md object-cover"
//                         />
//                       ) : (
//                         <div className="w-8 h-8 bg-purple-800/50 rounded-md flex items-center justify-center">
//                           <Music className="h-4 w-4 text-purple-300" />
//                         </div>
//                       )}
//                     </div>
//                     <div>
//                       <div className="font-medium text-sm">{song.title}</div>
//                       <div className="text-xs text-purple-300">{song.artist}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-between items-center mt-4">
//                 <div className="text-sm text-purple-300">
//                   {selectedSongs.length} song{selectedSongs.length !== 1 ? 's' : ''} selected
//                 </div>
//                 <div className="flex gap-2">
//                   <DialogClose asChild>
//                     <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white">
//                       Cancel
//                     </Button>
//                   </DialogClose>
//                   <Button 
//                     className="bg-purple-600 hover:bg-purple-700"
//                     disabled={selectedSongs.length === 0}
//                     onClick={handleShareSelected}
//                   >
//                     <Share2 className="h-4 w-4 mr-2" />
//                     Create Shareable Card
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}

//           {shareStep === 'preview' && (
//             <div className="flex flex-col items-center">
//               <div className="max-w-xs mx-auto w-full">
//                 <MusicCard 
//                   username={selectedHistoryItem?.query || "My Music"}
//                   selectedSongs={selectedSongs}
//                   playlistUrl={generatedPlaylistUrl}
//                 />
//               </div>
              
//               <DialogFooter className="flex gap-2 mt-4 w-full">
//                 <Button 
//                   variant="outline" 
//                   className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white"
//                   onClick={() => setShareStep('select')}
//                 >
//                   Back to Selection
//                 </Button>
//                 <Button 
//                   className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white"
//                 >
//                   <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
//                   </svg>
//                   Share to Spotify
//                 </Button>
//               </DialogFooter>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


// 'use client'

// import { useState } from 'react'
// import { 
//   History, 
//   Search, 
//   Trash2, 
//   Share2, 
//   AlertTriangle, 
//   X, 
//   Check, 
//   Music 
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogDescription,
//   DialogFooter,
//   DialogClose
// } from "@/components/ui/dialog"
// import { 
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import Image from "next/image"
// import { format } from 'date-fns'
// import { apiService } from '@/services/api'
// import MusicCard from './musify-card'

// interface SongResult {
//   title: string;
//   artist: string;
//   spotify_url?: string;
//   album_image?: string;
//   imageUrl?: string;  
//   duration?: string;
//   deezer_id?: string;
// }

// interface SearchHistoryItem {
//   id: number;
//   query: string;
//   timestamp: string;
//   recommendations: SongResult[];
// }

// interface SearchHistoryProps {
//   searchHistory: SearchHistoryItem[];
//   loadHistoricalRecommendations: (recommendations: SongResult[]) => void;
//   onHistoryDeleted: () => void;
//   isLoading: boolean;
// }

// export default function SearchHistory({ 
//   searchHistory, 
//   loadHistoricalRecommendations, 
//   onHistoryDeleted,
//   isLoading
// }: SearchHistoryProps) {
//   const [selectedHistoryItem, setSelectedHistoryItem] = useState<SearchHistoryItem | null>(null);
//   const [selectedSongs, setSelectedSongs] = useState<SongResult[]>([]);
//   const [deleteAlertOpen, setDeleteAlertOpen] = useState<boolean>(false);
//   const [deleteAllAlertOpen, setDeleteAllAlertOpen] = useState<boolean>(false);
//   const [historyIdToDelete, setHistoryIdToDelete] = useState<number | null>(null);
//   const [showShareCard, setShowShareCard] = useState<boolean>(false);
//   const [generatedPlaylistUrl, setGeneratedPlaylistUrl] = useState<string>('');
//   const [deleteError, setDeleteError] = useState<string>('');
//   const [shareStep, setShareStep] = useState<'select' | 'preview'>('select');

//   const handleDeleteHistory = async (historyId: number) => {
//     if (!historyId) {
//       console.error("Delete failed: No history ID provided");
//       setDeleteError('Invalid history ID. Please try again.');
//       return;
//     }
    
//     console.log(`Attempting to delete history ID: ${historyId}`);
//     setHistoryIdToDelete(historyId);
//     setDeleteAlertOpen(true);
//   };

//   const confirmDeleteHistory = async () => {
//     if (!historyIdToDelete) return;
    
//     try {
//       console.log(`Confirming deletion of history ID: ${historyIdToDelete}`);
//       const response = await apiService.deleteSearchHistory(historyIdToDelete);
//       console.log('Delete response:', response);
//       onHistoryDeleted();
//       setDeleteAlertOpen(false);
//       setHistoryIdToDelete(null);
//       setDeleteError('');
//     } catch (error) {
//       console.error(`Error deleting history ID ${historyIdToDelete}:`, error);
//       setDeleteError('Failed to delete search history. Please try again.');
//     }
//   };

//   const handleDeleteAllHistory = () => {
//     setDeleteAllAlertOpen(true);
//   };

//   const confirmDeleteAllHistory = async () => {
//     try {
//       await apiService.deleteAllSearchHistory();
//       onHistoryDeleted();
//       setDeleteAllAlertOpen(false);
//       setDeleteError('');
//     } catch (error) {
//       setDeleteError('Failed to delete all search history. Please try again.');
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return format(date, 'MMM d, yyyy • h:mm a');
//   };

//   const handleSelectToShare = (historyItem: SearchHistoryItem) => {
//     setSelectedHistoryItem(historyItem);
//     setSelectedSongs([]);
//     setShareStep('select');
//   };

//   const toggleSongSelection = (song: SongResult) => {
//     if (selectedSongs.some(s => s.title === song.title && s.artist === song.artist)) {
//       setSelectedSongs(selectedSongs.filter(s => 
//         !(s.title === song.title && s.artist === song.artist)
//       ));
//     } else {
//       setSelectedSongs([...selectedSongs, song]);
//     }
//   };

//   const isSongSelected = (song: SongResult) => {
//     return selectedSongs.some(s => s.title === song.title && s.artist === song.artist);
//   };

//   const handleShareSelected = async () => {
//     if (selectedSongs.length === 0) return;
    
//     try {
//       // Generate a Spotify playlist URL from the selected songs
//       const spotifyUrls = selectedSongs
//         .filter(song => song.spotify_url)
//         .map(song => song.spotify_url as string);
      
//       // Convert Spotify URLs to URIs (spotify:track:id format)
//       const spotifyUris = await apiService.getSpotifyUrisFromUrls(spotifyUrls);
      
//       const playlistName = selectedHistoryItem 
//         ? `Musify: ${selectedHistoryItem.query}` 
//         : "Musify Playlist";
      
//       const description = `Created with Musify - Based on "${selectedHistoryItem?.query || 'My music'}"`;
      
//       // Create the Spotify playlist
//       const playlistUrl = await apiService.createSpotifyPlaylist(
//         playlistName, 
//         spotifyUris,
//         description,
//          // Make it public
//       );
      
//       setGeneratedPlaylistUrl(playlistUrl);
//       setShareStep('preview');
//     } catch (error) {
//       console.error('Error creating share card:', error);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-2">
//           <History className="h-5 w-5 text-purple-300" />
//           <h2 className="text-lg md:text-xl font-bold">Your Search History</h2>
//         </div>
        
//         {searchHistory.length > 0 && (
//           <Button 
//             variant="outline" 
//             className="text-red-400 border-red-400/30 hover:bg-red-400/10"
//             onClick={handleDeleteAllHistory}
//           >
//             <Trash2 className="h-4 w-4 mr-2" />
//             Clear All
//           </Button>
//         )}
//       </div>

//       {/* Error Message */}
//       {deleteError && (
//         <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
//           {deleteError}
//         </div>
//       )}

//       {/* History Content */}
//       {isLoading ? (
//         <div className="flex justify-center items-center h-40">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
//         </div>
//       ) : searchHistory.length > 0 ? (
//         <div className="space-y-4">
//           {searchHistory.map((item) => (
//             <div 
//               key={item.id} 
//               className="bg-[#2d0f4c] rounded-lg overflow-hidden shadow-lg"
//             >
//               {/* Header */}
//               <div className="bg-[#3a1866] px-4 py-3 flex justify-between items-center">
//                 <div>
//                   <h3 className="font-medium text-lg">"{item.query}"</h3>
//                   <span className="text-xs text-purple-300">
//                     {formatDate(item.timestamp)}
//                   </span>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button 
//                     size="sm"
//                     variant="ghost" 
//                     className="h-8 w-8 p-0 text-purple-300 hover:text-white hover:bg-purple-500/20"
//                     onClick={() => handleSelectToShare(item)}
//                   >
//                     <Share2 className="h-4 w-4" />
//                   </Button>
//                   <Button 
//                     size="sm"
//                     variant="ghost" 
//                     className="h-8 w-8 p-0 text-red-400 hover:text-white hover:bg-red-500/20"
//                     onClick={() => handleDeleteHistory(item.id)}
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
              
//               {/* Recommendations */}
//               <div className="p-4">
//                 <div className="grid gap-2">
//                   {item.recommendations.map((rec, recIndex) => (
//                     <div key={recIndex} className="flex items-center py-2 px-3 hover:bg-[#3a1866]/30 rounded-md transition-colors">
//                       <div className="w-8 h-8 mr-3 flex-shrink-0">
//                         {rec.album_image ? (
//                           <Image
//                             src={rec.album_image}
//                             alt={rec.title}
//                             width={32}
//                             height={32}
//                             className="rounded-md object-cover"
//                           />
//                         ) : (
//                           <div className="w-8 h-8 bg-purple-800/50 rounded-md flex items-center justify-center">
//                             <Music className="h-4 w-4 text-purple-300" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-grow">
//                         <div className="font-medium text-sm">{rec.title}</div>
//                         <div className="text-xs text-purple-300">{rec.artist}</div>
//                       </div>
//                       {rec.spotify_url && (
//                         <a
//                           href={rec.spotify_url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-xs bg-[#1DB954] text-white px-2 py-0.5 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity"
//                         >
//                           <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
//                           </svg>
//                         </a>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <Button 
//                   className="mt-3 bg-purple-600 hover:bg-purple-700 text-sm"
//                   onClick={() => loadHistoricalRecommendations(item.recommendations)}
//                 >
//                   View as Results
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center h-60 text-purple-300 bg-[#2d0f4c]/50 rounded-lg">
//           <History className="h-10 w-10 mb-2 opacity-50" />
//           <p className="text-center">Your search history is empty</p>
//           <p className="text-center text-sm mt-1">Try searching for some music!</p>
//         </div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
//         <AlertDialogContent className="bg-[#2d0f4c] border-purple-500/30 text-white">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Search History</AlertDialogTitle>
//             <AlertDialogDescription className="text-purple-300">
//               Are you sure you want to delete this search history entry? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white">
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction 
//               className="bg-red-500 hover:bg-red-600 text-white"
//               onClick={confirmDeleteHistory}
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Delete All Confirmation Dialog */}
//       <AlertDialog open={deleteAllAlertOpen} onOpenChange={setDeleteAllAlertOpen}>
//         <AlertDialogContent className="bg-[#2d0f4c] border-purple-500/30 text-white">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Clear All Search History</AlertDialogTitle>
//             <AlertDialogDescription className="text-purple-300">
//               Are you sure you want to delete your entire search history? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white">
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction 
//               className="bg-red-500 hover:bg-red-600 text-white"
//               onClick={confirmDeleteAllHistory}
//             >
//               Delete All
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Share Songs Dialog */}
//       <Dialog open={!!selectedHistoryItem} onOpenChange={(open) => {
//         if (!open) {
//           setSelectedHistoryItem(null);
//           setSelectedSongs([]);
//           setShareStep('select');
//         }
//       }}>
//         <DialogContent className="bg-[#2d0f4c] border-purple-500/30 text-white sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>
//               {shareStep === 'select' ? 'Select Songs to Share' : 'Preview Shareable Card'}
//             </DialogTitle>
//             <DialogDescription className="text-purple-300">
//               {shareStep === 'select' 
//                 ? 'Choose songs from this search to include in your shareable music card.'
//                 : 'This is how your music card will look when shared with others.'}
//             </DialogDescription>
//           </DialogHeader>

//           {shareStep === 'select' && selectedHistoryItem && (
//             <>
//               <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
//                 {selectedHistoryItem.recommendations.map((song, idx) => (
//                   <div 
//                     key={idx}
//                     className={`flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer ${
//                       isSongSelected(song) 
//                         ? 'bg-purple-500/30 border-purple-500/50 border' 
//                         : 'hover:bg-[#3a1866]/50'
//                     }`}
//                     onClick={() => toggleSongSelection(song)}
//                   >
//                     <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-purple-400/50">
//                       {isSongSelected(song) && <Check className="h-4 w-4 text-purple-400" />}
//                     </div>
//                     <div className="w-8 h-8 flex-shrink-0">
//                       {song.album_image ? (
//                         <Image
//                           src={song.album_image}
//                           alt={song.title}
//                           width={32}
//                           height={32}
//                           className="rounded-md object-cover"
//                         />
//                       ) : (
//                         <div className="w-8 h-8 bg-purple-800/50 rounded-md flex items-center justify-center">
//                           <Music className="h-4 w-4 text-purple-300" />
//                         </div>
//                       )}
//                     </div>
//                     <div>
//                       <div className="font-medium text-sm">{song.title}</div>
//                       <div className="text-xs text-purple-300">{song.artist}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-between items-center mt-4">
//                 <div className="text-sm text-purple-300">
//                   {selectedSongs.length} song{selectedSongs.length !== 1 ? 's' : ''} selected
//                 </div>
//                 <div className="flex gap-2">
//                   <DialogClose asChild>
//                     <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white">
//                       Cancel
//                     </Button>
//                   </DialogClose>
//                   <Button 
//                     className="bg-purple-600 hover:bg-purple-700"
//                     disabled={selectedSongs.length === 0}
//                     onClick={handleShareSelected}
//                   >
//                     <Share2 className="h-4 w-4 mr-2" />
//                     Create Shareable Card
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}

//           {shareStep === 'preview' && (
//             <div className="flex flex-col items-center">
//               <div className="max-w-xs mx-auto w-full">
//                 <MusicCard 
//                   username={selectedHistoryItem?.query || "My Music"}
//                   selectedSongs={selectedSongs}
//                   playlistUrl={generatedPlaylistUrl}
//                 />
//               </div>
              
//               <DialogFooter className="flex gap-2 mt-4 w-full">
//                 <Button 
//                   variant="outline" 
//                   className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white"
//                   onClick={() => setShareStep('select')}
//                 >
//                   Back to Selection
//                 </Button>
//                 <Button 
//                   className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white"
//                 >
//                   <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
//                   </svg>
//                   Share to Spotify
//                 </Button>
//               </DialogFooter>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { 
  History, 
  Search, 
  Trash2, 
  Share2, 
  AlertTriangle, 
  X, 
  Check, 
  Music,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { format } from 'date-fns'
import { apiService } from '@/services/api'
import MusicCard from './musify-card'

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
  id: number;
  query: string;
  timestamp: string;
  recommendations: SongResult[];
}

interface SearchHistoryProps {
  searchHistory: SearchHistoryItem[];
  loadHistoricalRecommendations: (recommendations: SongResult[]) => void;
  onHistoryDeleted: () => void;
  isLoading: boolean;
}

export default function SearchHistory({ 
  searchHistory, 
  loadHistoricalRecommendations, 
  onHistoryDeleted,
  isLoading
}: SearchHistoryProps) {
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<SearchHistoryItem | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<SongResult[]>([]);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState<boolean>(false);
  const [deleteAllAlertOpen, setDeleteAllAlertOpen] = useState<boolean>(false);
  const [historyIdToDelete, setHistoryIdToDelete] = useState<number | null>(null);
  const [showShareCard, setShowShareCard] = useState<boolean>(false);
  const [generatedPlaylistUrl, setGeneratedPlaylistUrl] = useState<string>('');
  const [deleteError, setDeleteError] = useState<string>('');
  const [shareStep, setShareStep] = useState<'select' | 'preview'>('select');
  const [creatingPlaylist, setCreatingPlaylist] = useState<boolean>(false);
  const [playlistError, setPlaylistError] = useState<string | null>(null);

  // Check for Spotify callback results when component mounts or URL changes
  useEffect(() => {
    // Check if we have returned from Spotify auth
    const urlParams = new URLSearchParams(window.location.search);
    
    // Log the URL parameters for debugging
    console.log("URL parameters:", Object.fromEntries(urlParams.entries()));
    
    if (urlParams.has('playlist_created') && urlParams.has('playlist_url')) {
      // Playlist was created successfully
      const playlistUrl = urlParams.get('playlist_url') || '';
      console.log("Playlist created successfully:", playlistUrl);
      
      // Set the generated URL and switch to preview step
      setGeneratedPlaylistUrl(playlistUrl);
      setShareStep('preview');
      setCreatingPlaylist(false);
      
      // Reopen the dialog with the success view
      if (selectedHistoryItem) {
        setShowShareCard(true);
      } else {
        // If we lost the selected item during redirect, show a success toast instead
        // You can add a toast notification library for this
        alert(`Playlist created successfully! URL: ${playlistUrl}`);
      }
      
      // Clean up URL parameters
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else if (urlParams.has('error')) {
      // There was an error
      const error = urlParams.get('error') || 'Unknown error';
      console.error("Spotify error:", error);
      setPlaylistError(`Spotify playlist creation failed: ${error}`);
      setCreatingPlaylist(false);
      
      // Clean up URL parameters
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const handleDeleteHistory = async (historyId: number) => {
    if (!historyId) {
      console.error("Delete failed: No history ID provided");
      setDeleteError('Invalid history ID. Please try again.');
      return;
    }
    
    console.log(`Attempting to delete history ID: ${historyId}`);
    setHistoryIdToDelete(historyId);
    setDeleteAlertOpen(true);
  };

  const confirmDeleteHistory = async () => {
    if (!historyIdToDelete) return;
    
    try {
      console.log(`Confirming deletion of history ID: ${historyIdToDelete}`);
      const response = await apiService.deleteSearchHistory(historyIdToDelete);
      console.log('Delete response:', response);
      onHistoryDeleted();
      setDeleteAlertOpen(false);
      setHistoryIdToDelete(null);
      setDeleteError('');
    } catch (error) {
      console.error(`Error deleting history ID ${historyIdToDelete}:`, error);
      setDeleteError('Failed to delete search history. Please try again.');
    }
  };

  const handleDeleteAllHistory = () => {
    setDeleteAllAlertOpen(true);
  };

  const confirmDeleteAllHistory = async () => {
    try {
      await apiService.deleteAllSearchHistory();
      onHistoryDeleted();
      setDeleteAllAlertOpen(false);
      setDeleteError('');
    } catch (error) {
      setDeleteError('Failed to delete all search history. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy • h:mm a');
  };

  const handleSelectToShare = (historyItem: SearchHistoryItem) => {
    setSelectedHistoryItem(historyItem);
    setSelectedSongs([]);
    setShareStep('select');
    setPlaylistError(null);
  };

  const toggleSongSelection = (song: SongResult) => {
    if (selectedSongs.some(s => s.title === song.title && s.artist === song.artist)) {
      setSelectedSongs(selectedSongs.filter(s => 
        !(s.title === song.title && s.artist === song.artist)
      ));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const isSongSelected = (song: SongResult) => {
    return selectedSongs.some(s => s.title === song.title && s.artist === song.artist);
  };

//   const handleShareSelected = async () => {
//     if (selectedSongs.length === 0) return;
    
//     try {
//       setCreatingPlaylist(true);
//       setPlaylistError(null);
      
//       // Get Spotify URLs from selected songs
//       const spotifyUrls = selectedSongs
//         .filter(song => song.spotify_url)
//         .map(song => song.spotify_url as string);
      
//       // Convert Spotify URLs to URIs
//       const spotifyUris = apiService.getSpotifyUrisFromUrls(spotifyUrls);
      
//       if (spotifyUris.length === 0) {
//         throw new Error("No valid Spotify tracks found in selection");
//       }
      
//       const playlistName = selectedHistoryItem 
//         ? `Musify: ${selectedHistoryItem.query}` 
//         : "Musify Playlist";
      
//       const description = `Created with Musify - Based on "${selectedHistoryItem?.query || 'My music'}"`;
      
//       // Get the Spotify authorization URL
//       const authData = await apiService.initiateSpotifyPlaylistCreation(
//         playlistName,
//         spotifyUris,
//         description,
//         true // Make it public
//       );
      
//       // Open the authorization window
//       window.location.href = authData.authUrl;
      
//       // The callback will be handled by the useEffect hook when we return
      
//     } catch (error) {
//       console.error('Error creating share card:', error);
//       setPlaylistError(error instanceof Error ? error.message : 'Failed to create playlist');
//       setCreatingPlaylist(false);
//     }
//   };

const handleShareSelected = async () => {
    if (selectedSongs.length === 0) return;
    
    try {
      setCreatingPlaylist(true);
      setPlaylistError(null);
      
      // Get Spotify URLs from selected songs
      const spotifyUrls = selectedSongs
        .filter(song => song.spotify_url)
        .map(song => song.spotify_url as string);
      
      console.log("Spotify URLs:", spotifyUrls);
      
      // Convert Spotify URLs to URIs
      const spotifyUris = apiService.getSpotifyUrisFromUrls(spotifyUrls);
      
      console.log("Spotify URIs:", spotifyUris);
      
      if (spotifyUris.length === 0) {
        throw new Error("No valid Spotify tracks found in selection");
      }
      
      const playlistName = selectedHistoryItem 
        ? `Musify: ${selectedHistoryItem.query}` 
        : "Musify Playlist";
      
      // Log the request parameters
      console.log("Request params:", {
        playlistName,
        spotifyUris,
        description: `Created with Musify - Based on "${selectedHistoryItem?.query || 'My music'}"`,
        isPublic: true
      });
      
      // Get the Spotify authorization URL
      const response = await apiService.initiateSpotifyPlaylistCreation(
        playlistName,
        spotifyUris,
        `Created with Musify - Based on "${selectedHistoryItem?.query || 'My music'}"`,
      );
      
      // Log the raw response
      console.log("Raw response:", response);
      
      if (!response) {
        throw new Error("Empty response from Spotify authorization request");
      }
      
      if (!response.authUrl && !response.authUrl) {
        throw new Error("Response doesn't contain authUrl or auth_url property");
      }
      
      // Determine which property name is used
      const authUrl = response.authUrl || response.authUrl;
      
      // Open the authorization window
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('Error creating share card:', error);
      setPlaylistError(error instanceof Error ? error.message : 'Failed to create playlist');
      setCreatingPlaylist(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-purple-300" />
          <h2 className="text-lg md:text-xl font-bold">Your Search History</h2>
        </div>
        
        {searchHistory.length > 0 && (
          <Button 
            variant="outline" 
            className="text-red-400 border-red-400/30 hover:bg-red-400/10"
            onClick={handleDeleteAllHistory}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Error Message */}
      {deleteError && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
          {deleteError}
        </div>
      )}

      {/* History Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : searchHistory.length > 0 ? (
        <div className="space-y-4">
          {searchHistory.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#2d0f4c] rounded-lg overflow-hidden shadow-lg"
            >
              {/* Header */}
              <div className="bg-[#3a1866] px-4 py-3 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">"{item.query}"</h3>
                  <span className="text-xs text-purple-300">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-purple-300 hover:text-white hover:bg-purple-500/20"
                    onClick={() => handleSelectToShare(item)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm"
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-red-400 hover:text-white hover:bg-red-500/20"
                    onClick={() => handleDeleteHistory(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="p-4">
                <div className="grid gap-2">
                  {item.recommendations.map((rec, recIndex) => (
                    <div key={recIndex} className="flex items-center py-2 px-3 hover:bg-[#3a1866]/30 rounded-md transition-colors">
                      <div className="w-8 h-8 mr-3 flex-shrink-0">
                        {rec.album_image ? (
                          <Image
                            src={rec.album_image}
                            alt={rec.title}
                            width={32}
                            height={32}
                            className="rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-purple-800/50 rounded-md flex items-center justify-center">
                            <Music className="h-4 w-4 text-purple-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-sm">{rec.title}</div>
                        <div className="text-xs text-purple-300">{rec.artist}</div>
                      </div>
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
                        </a>
                      )}
                    </div>
                  ))}
                </div>
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
        <div className="flex flex-col items-center justify-center h-60 text-purple-300 bg-[#2d0f4c]/50 rounded-lg">
          <History className="h-10 w-10 mb-2 opacity-50" />
          <p className="text-center">Your search history is empty</p>
          <p className="text-center text-sm mt-1">Try searching for some music!</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent className="bg-[#2d0f4c] border-purple-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Search History</AlertDialogTitle>
            <AlertDialogDescription className="text-purple-300">
              Are you sure you want to delete this search history entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={confirmDeleteHistory}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Confirmation Dialog */}
      <AlertDialog open={deleteAllAlertOpen} onOpenChange={setDeleteAllAlertOpen}>
        <AlertDialogContent className="bg-[#2d0f4c] border-purple-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Search History</AlertDialogTitle>
            <AlertDialogDescription className="text-purple-300">
              Are you sure you want to delete your entire search history? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={confirmDeleteAllHistory}
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Songs Dialog */}
      <Dialog open={!!selectedHistoryItem} onOpenChange={(open) => {
        if (!open) {
          setSelectedHistoryItem(null);
          setSelectedSongs([]);
          setShareStep('select');
          setPlaylistError(null);
        }
      }}>
        <DialogContent className="bg-[#2d0f4c] border-purple-500/30 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {shareStep === 'select' ? 'Select Songs to Share' : 'Preview Shareable Card'}
            </DialogTitle>
            <DialogDescription className="text-purple-300">
              {shareStep === 'select' 
                ? 'Choose songs from this search to include in your shareable music card.'
                : 'This is how your music card will look when shared with others.'}
            </DialogDescription>
          </DialogHeader>

          {shareStep === 'select' && selectedHistoryItem && (
            <>
              {/* Error message */}
              {playlistError && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm mb-4">
                  {playlistError}
                </div>
              )}
            
              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
                {selectedHistoryItem.recommendations.map((song, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer ${
                      isSongSelected(song) 
                        ? 'bg-purple-500/30 border-purple-500/50 border' 
                        : 'hover:bg-[#3a1866]/50'
                    }`}
                    onClick={() => toggleSongSelection(song)}
                  >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-purple-400/50">
                      {isSongSelected(song) && <Check className="h-4 w-4 text-purple-400" />}
                    </div>
                    <div className="w-8 h-8 flex-shrink-0">
                      {song.album_image ? (
                        <Image
                          src={song.album_image}
                          alt={song.title}
                          width={32}
                          height={32}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-purple-800/50 rounded-md flex items-center justify-center">
                          <Music className="h-4 w-4 text-purple-300" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{song.title}</div>
                      <div className="text-xs text-purple-300">{song.artist}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-purple-300">
                  {selectedSongs.length} song{selectedSongs.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={selectedSongs.length === 0 || creatingPlaylist}
                    onClick={handleShareSelected}
                  >
                    {creatingPlaylist ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 mr-2" />
                        Create Shareable Card
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}

          {shareStep === 'preview' && (
            <div className="flex flex-col items-center">
              <div className="max-w-xs mx-auto w-full">
                <MusicCard 
                  username={selectedHistoryItem?.query || "My Music"}
                  selectedSongs={selectedSongs}
                  playlistUrl={generatedPlaylistUrl}
                />
              </div>
              
              <DialogFooter className="flex gap-2 mt-4 w-full">
                <Button 
                  variant="outline" 
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white"
                  onClick={() => setShareStep('select')}
                >
                  Back to Selection
                </Button>
                {generatedPlaylistUrl && (
                  <a 
                    href={generatedPlaylistUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button 
                      className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white w-full"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      Open in Spotify
                    </Button>
                  </a>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}