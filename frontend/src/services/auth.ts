// Service to handle authentication operations
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

console.log('API_BASE_URL:', API_BASE_URL); // For debugging

class AuthService {
  private tokenKey = 'auth-token';
  private refreshTokenKey = 'refresh-token';

  // Check if running in browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Save tokens to localStorage
  setTokens(accessToken: string, refreshToken: string) {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, accessToken);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  // Get access token from localStorage
  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Get refresh token from localStorage
  getRefreshToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.refreshTokenKey);
    }
    return null;
  }

  // Remove tokens from localStorage
  removeTokens() {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    // In a real implementation, you would also validate the token's expiration
    return !!token;
  }

  // Validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  private isValidPassword(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Login user and save tokens
  async login(email: string, password: string): Promise<{ success: boolean; message?: string; token?: string; user?: any }> {
    // Input validation
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    if (!this.isValidEmail(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        // Add timeout for Hugging Face Spaces which may take longer to respond
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (response.ok) {
        const data = await response.json();

        // Validate response data
        if (!data.access_token) {
          return { success: false, message: 'Invalid response from server' };
        }

        // Store both access and refresh tokens
        this.setTokens(data.access_token, data.refresh_token);
        return {
          success: true,
          token: data.access_token,
          user: data.user || null
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Login failed (${response.status})`;
        return { success: false, message: errorMessage };
      }
    } catch (error: any) {
      console.error('Login error:', error);

      // Handle timeout specifically
      if (error.name === 'TimeoutError') {
        return { success: false, message: 'Request timed out. Please try again later.' };
      }

      // Network error handling
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { success: false, message: 'Network error: Unable to connect to the server. Please check your internet connection.' };
      }

      return { success: false, message: 'An error occurred during login. Please try again.' };
    }
  }

  // Register a new user
  async register(userData: { email: string; password: string; firstName?: string; lastName?: string }): Promise<{ success: boolean; message?: string }> {
    // Input validation
    if (!userData.email || !userData.password) {
      return { success: false, message: 'Email and password are required' };
    }

    if (!this.isValidEmail(userData.email)) {
      return { success: false, message: 'Invalid email format' };
    }

    if (!this.isValidPassword(userData.password)) {
      return { success: false, message: 'Password must be at least 8 characters with uppercase, lowercase, and number' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName
        }),
        // Add timeout for Hugging Face Spaces which may take longer to respond
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Registration failed (${response.status})`;
        return { success: false, message: errorMessage };
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      // Handle timeout specifically
      if (error.name === 'TimeoutError') {
        return { success: false, message: 'Request timed out. Please try again later.' };
      }

      // Network error handling
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { success: false, message: 'Network error: Unable to connect to the server. Please check your internet connection.' };
      }

      return { success: false, message: 'An error occurred during registration. Please try again.' };
    }
  }

  // Logout user
  logout() {
    this.removeTokens();
  }

  // Get current user info
  async getCurrentUser(): Promise<any> {
    try {
      const response = await this.makeAuthenticatedRequest(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Add timeout for Hugging Face Spaces which may take longer to respond
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || `Failed to fetch user data (${response.status})`;
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);

      // Handle timeout specifically
      if (error.name === 'TimeoutError') {
        throw new Error('Request timed out. Please try again later.');
      }

      // Network error handling
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }

      throw error;
    }
  }

  // Check if access token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Refresh access token using refresh token
  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          // Update the access token but keep the same refresh token
          this.setTokens(data.access_token, refreshToken);
          return true;
        } else {
          console.warn('No access token returned from refresh endpoint');
          return false;
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Token refresh failed:', errorData);
        // If refresh fails, clear all tokens
        this.removeTokens();
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  // Method to make authenticated requests with automatic token refresh
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    let token = this.getToken();
    
    // If token is expired, try to refresh it
    if (this.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        token = this.getToken(); // Get the new token
      } else {
        // If refresh failed, redirect to login
        window.location.href = '/login';
        throw new Error('Authentication failed and could not be refreshed');
      }
    }

    // Add the token to the request
    const authenticatedOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      }
    };

    return fetch(url, authenticatedOptions);
  }
}

export const authService = new AuthService();