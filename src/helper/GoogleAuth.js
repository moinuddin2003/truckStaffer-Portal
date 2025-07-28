// Google OAuth Configuration and Utilities
import { GOOGLE_CONFIG } from '../config/google';

// Initialize Google Identity Services
export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    // Check if Google script is already loaded
    if (window.google && window.google.accounts) {
      console.log('✅ Google Identity Services already loaded');
      resolve(window.google);
      return;
    }

    // Wait for Google script to load
    const maxAttempts = 50; // 5 seconds max
    let attempts = 0;

    const checkGoogle = () => {
      attempts++;
      
      if (window.google && window.google.accounts) {
        console.log('✅ Google Identity Services loaded successfully');
        resolve(window.google);
      } else if (attempts >= maxAttempts) {
        console.error('❌ Google Identity Services failed to load after 5 seconds');
        reject(new Error('Google Identity Services not available'));
      } else {
        setTimeout(checkGoogle, 100);
      }
    };

    checkGoogle();
  });
};

// Create Google Sign-In button
export const createGoogleSignInButton = (containerId, onSuccess, onError) => {
  console.log('🚀 Starting Google Sign-In button creation...');
  
  return initializeGoogleAuth()
    .then((google) => {
      console.log('📋 Configuration check:');
      console.log('  - Client ID:', GOOGLE_CONFIG.CLIENT_ID);
      console.log('  - Current origin:', window.location.origin);
      console.log('  - Current hostname:', window.location.hostname);
      console.log('  - Current protocol:', window.location.protocol);
      console.log('  - Current port:', window.location.port);

      // Validate client ID
      if (!GOOGLE_CONFIG.CLIENT_ID || GOOGLE_CONFIG.CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
        const error = 'Google Client ID not configured';
        console.error('❌', error);
        onError(error);
        return;
      }

      // Find the container
      const container = document.getElementById(containerId);
      if (!container) {
        const error = `Container with ID '${containerId}' not found`;
        console.error('❌', error);
        onError(error);
        return;
      }

      console.log('✅ Container found, initializing Google Identity Services...');

      try {
        // Initialize Google Identity Services
        google.accounts.id.initialize({
          client_id: GOOGLE_CONFIG.CLIENT_ID,
          callback: (response) => {
            console.log('🎉 Google Sign-In callback received:', response);
            onSuccess(response);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false, // Disable FedCM warnings
        });

        console.log('✅ Google Identity Services initialized');

        // Render the button
        google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 400,
        });

        console.log('✅ Google Sign-In button rendered');

        // Check if One Tap should be displayed
        google.accounts.id.prompt((notification) => {
          console.log('🔔 Google prompt notification:', notification);
          
          if (notification.isNotDisplayed()) {
            const reason = notification.getNotDisplayedReason();
            console.warn('⚠️ Google One Tap not displayed:', reason);
            
            if (reason === 'unregistered_origin') {
              console.error('❌ Origin not registered in Google Cloud Console');
              console.log('💡 Please add these origins to Google Cloud Console:');
              console.log('   - http://localhost:3000');
              console.log('   - http://127.0.0.1:3000');
            }
          } else if (notification.isSkippedMoment()) {
            console.log('ℹ️ Google One Tap skipped (normal behavior)');
          } else {
            console.log('✅ Google One Tap ready');
          }
        });

        console.log('✅ Google Sign-In setup complete');
      } catch (error) {
        console.error('❌ Error initializing Google Identity Services:', error);
        onError(`Google Sign-In initialization failed: ${error.message}`);
      }
    })
    .catch((error) => {
      console.error('❌ Failed to initialize Google Auth:', error);
      onError('Google Sign-In not available');
    });
};

// Handle Google Sign-In success
export const handleGoogleSignIn = async (response, isSignUp = false) => {
  console.log('🔄 Processing Google Sign-In response...');
  
  try {
    const { credential } = response;
    
    if (!credential) {
      console.error('❌ No credential in response');
      return { success: false, error: 'No credential received' };
    }

    // Decode the JWT token to get user info
    const payload = JSON.parse(atob(credential.split('.')[1]));
    
    const userData = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub,
      credential: credential
    };

    console.log('👤 User data extracted:', userData);

    // For testing - simulate successful authentication
    console.log('🎯 Simulating backend authentication...');
    
    const mockResponse = {
      status: true,
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: 1,
        name: userData.name,
        email: userData.email,
        picture: userData.picture
      }
    };
    
    // Store in localStorage
    localStorage.setItem('token', mockResponse.token);
    localStorage.setItem('name', mockResponse.user.name);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));
    
    console.log('✅ Authentication successful, data stored in localStorage');
    console.log('📦 Stored token:', mockResponse.token);
    console.log('👤 Stored user:', mockResponse.user);
    
    return { success: true, data: mockResponse };
    
    /* Uncomment this when your backend is ready:
    const apiEndpoint = isSignUp 
      ? GOOGLE_CONFIG.API_ENDPOINTS.REGISTER
      : GOOGLE_CONFIG.API_ENDPOINTS.LOGIN;

    console.log('🌐 Sending to backend:', apiEndpoint);
    
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential: credential,
        user_data: userData
      })
    });

    const data = await res.json();
    
    if (data.status && data.token) {
      localStorage.setItem('token', data.token);
      if (data.user && data.user.name) {
        localStorage.setItem('name', data.user.name);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return { success: true, data };
    } else {
      return { success: false, error: data.message || 'Authentication failed' };
    }
    */
  } catch (error) {
    console.error('❌ Google Sign-In processing error:', error);
    return { success: false, error: 'Failed to process Google Sign-In' };
  }
};

// Sign out from Google
export const signOutFromGoogle = () => {
  console.log('🚪 Signing out from Google...');
  
  if (window.google && window.google.accounts) {
    window.google.accounts.id.disableAutoSelect();
    window.google.accounts.id.revoke(localStorage.getItem('email'), () => {
      console.log('✅ Google Sign-Out successful');
    });
  }
  
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  localStorage.removeItem('user');
  
  console.log('🧹 Local storage cleared');
}; 