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
    
    

  }
  
  // Export a singleton instance
  export const apiService = new ApiService();