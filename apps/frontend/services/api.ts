// services/api.ts
class ApiService {
    private baseUrl: string;
  
    constructor() {
      this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    }
  
    // Get the auth token from localStorage
    private getToken(): string | null {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
      }
      return null;
    }
  
    // Create headers with authentication token if available
    private getHeaders(includeAuth: boolean = true): HeadersInit {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
  
      if (includeAuth) {
        const token = this.getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
  
      return headers;
    }
  


    async register(username: string, email: string, password: string) {
        try {
          const response = await fetch(`${this.baseUrl}/auth/register`, {
            method: 'POST',
            headers: this.getHeaders(false),
            body: JSON.stringify({ username, email, password }),
          });
      
          const data = await response.json();
      
          if (!response.ok) {
            // Pass through the structured error from the backend
            throw new Error(JSON.stringify(data.detail));
          }
      
          return data;
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        }
      }
  
    // Login user
    async login(username: string, password: string) {
      try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
  
        const response = await fetch(`${this.baseUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }
  
        // Store token
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.access_token);
        }
  
        return data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    }
  
    // Logout user
    logout() {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
  
    // Check if user is authenticated
    isAuthenticated(): boolean {
      return !!this.getToken();
    }
  
    // Get user profile
    async getUserProfile() {
      try {
        const response = await fetch(`${this.baseUrl}/auth/me`, {
          method: 'GET',
          headers: this.getHeaders(),
        });
  
        if (!response.ok) {
          if (response.status === 401) {
            this.logout(); // Clear invalid token
          }
          throw new Error('Failed to get user profile');
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    }
  


    async getRecommendations(query: string) {
        try {
          const response = await fetch(`${this.baseUrl}/recommend?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: this.getHeaders(),
          });
      
          const data = await response.json();
          
          // For validation messages, return the data directly instead of throwing an error

          if (data.message && data.message.includes("inappropriate")) {
            return data;
          }
      
          if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch recommendations');
          }
      
          return data;
        } catch (error) {
          console.error('Error fetching recommendations:', error);
          throw error;
        }
      }

  


    async getGuestRecommendations(query: string) {
        try {
          const response = await fetch(`${this.baseUrl}/recommend/guest?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: this.getHeaders(false),
          });
      
          const data = await response.json();
          
          // For validation messages, return the data directly instead of throwing an error
    
          if (data.message && data.message.includes("inappropriate")) {
            return data;
          }
      
          if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch recommendations');
          }
      
          return data;
        } catch (error) {
          console.error('Error fetching guest recommendations:', error);
          throw error;
        }
      }



  
    // Direct Spotify search
    async searchSpotify(query: string) {
      try {
        const response = await fetch(`${this.baseUrl}/spotify/songs?query=${encodeURIComponent(query)}`, {
          method: 'GET',
          headers: this.getHeaders(false),
        });
  
        if (!response.ok) {
          throw new Error('Failed to search Spotify');
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error searching Spotify:', error);
        throw error;
      }
    }
  
    // Get search history (authenticated only)
    async getSearchHistory() {
      try {
        const response = await fetch(`${this.baseUrl}/search/history`, {
          method: 'GET',
          headers: this.getHeaders(),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch search history');
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error fetching search history:', error);
        throw error;
      }
    }
    // Add these methods to your api.ts service

    // Delete a specific search history entry
    async deleteSearchHistory(historyId: number): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/search/history/${historyId}`, {
          method: 'DELETE',
          headers: this.getHeaders(),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Failed to delete search history');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error deleting search history:', error);
        throw error;
      }
    }

    // Delete all search history
    async deleteAllSearchHistory(): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/search/history`, {
          method: 'DELETE',
          headers: this.getHeaders(),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Failed to delete all search history');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error deleting all search history:', error);
        throw error;
      }
    }
    
    async createSpotifyPlaylist(name: string, songUris: string[], description: string): Promise<string> {
      try {
        // This is a placeholder - in a real implementation, 
        // you would call the Spotify API to create a playlist
        // For now, we'll just return a mock playlist URL
        const playlistId = Math.random().toString(36).substring(2, 15);
        return `https://open.spotify.com/playlist/${playlistId}`;
      } catch (error) {
        console.error('Error creating Spotify playlist:', error);
        throw error;
      }
    }


// Get Spotify Track URIs from URLs
    getSpotifyUrisFromUrls(spotifyUrls: string[]): string[] {
      return spotifyUrls.map(url => {
        // Extract track ID from Spotify URL
        // Format: https://open.spotify.com/track/1dGr1c8CrMLDpV6mPbImSI?si=...
        const match = url.match(/track\/([a-zA-Z0-9]+)/);
        if (match && match[1]) {
          return `spotify:track:${match[1]}`;
        }
        // If we can't extract a track ID, return empty string (will be filtered out)
        return "";
      }).filter(uri => uri !== ""); // Remove any empty URIs
    }

// Initiate Spotify authorization for playlist creation
    // Initiate Spotify authorization for playlist creation
    async initiateSpotifyPlaylistCreation(
      name: string,
      songUris: string[],
      description: string = "Created with Musify"
    ): Promise<{ authUrl: string; state: string }> {
      try {
        // Log parameters for debugging
        console.log("Creating playlist with params:", { name, songUris, description });
        
        if (songUris.length === 0) {
          throw new Error("No songs selected for playlist");
        }
    
        const response = await fetch(
          `${this.baseUrl}/spotify/create-playlist?${new URLSearchParams({
            name,
            description, 
            is_public: 'true',
            song_uris: songUris.join(',')
          })}`,
          {
            headers: this.getHeaders()
          }
        );
    
        // Log the raw response for debugging
        const responseData = await response.text();
        console.log("Raw response:", responseData);
        
        if (!response.ok) {
          throw new Error(`Failed to initiate Spotify authorization: ${responseData}`);
        }
    
        try {
          const data = JSON.parse(responseData);
          console.log("Parsed response:", data);
          return data;
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          throw new Error(`Invalid response format: ${responseData}`);
        }
      } catch (error) {
        console.error('Error initiating Spotify playlist creation:', error);
        throw error;
      }
    }

// Open Spotify authorization window
    openSpotifyAuthWindow(authUrl: string): void {
      // Store current URL to return to after auth
      localStorage.setItem('musify_return_url', window.location.href);
      
      // Open the auth URL in a popup window
      const width = 500;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      window.open(
        authUrl,
        'Spotify Authorization',
        `width=${width},height=${height},top=${top},left=${left}`
      );
    }

    // Check URL for Spotify callback results
    checkForSpotifyCallback(): { success: boolean; playlistUrl?: string; error?: string } {
      const urlParams = new URLSearchParams(window.location.search);
      
      // Check for errors
      if (urlParams.has('error')) {
        return { 
          success: false, 
          error: urlParams.get('error') || 'Unknown error during Spotify authorization' 
        };
      }
      
      // Check for success
      if (urlParams.has('playlist_created') && urlParams.has('playlist_url')) {
        const playlistUrl = urlParams.get('playlist_url') || '';
        
        // Clean up URL parameters
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        return { success: true, playlistUrl };
      }
      
      // No relevant params found
      return { success: false };
    }

  }
  
  // Export a singleton instance
  export const apiService = new ApiService();