// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  // Google Client ID from Google Cloud Console
  CLIENT_ID: '75467858657-h6ev0aua16t0n1ruif35vpart2uuqkqn.apps.googleusercontent.com',
  
  // API endpoints for Google authentication
  API_ENDPOINTS: {
    // For testing - replace with your actual backend endpoints
    LOGIN: 'https://admin.truckstaffer.com/api/google-login',
    REGISTER: 'https://admin.truckstaffer.com/api/google-register'
  }
};

// Instructions to get Google Client ID:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable Google+ API
// 4. Go to Credentials
// 5. Create OAuth 2.0 Client ID
// 6. Add your domain to authorized origins
// 7. Copy the Client ID and replace 'YOUR_GOOGLE_CLIENT_ID' above
// 8. For production, set REACT_APP_GOOGLE_CLIENT_ID environment variable 