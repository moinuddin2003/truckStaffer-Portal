import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleOAuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [currentOrigin, setCurrentOrigin] = useState('');

  useEffect(() => {
    // Get current origin
    const origin = window.location.origin;
    setCurrentOrigin(origin);
    
    // Collect debug information
    setDebugInfo({
      origin: origin,
      href: window.location.href,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("✅ Google OAuth Success:", credentialResponse);
    alert("🎉 Google OAuth is working! Check console for details.");
  };

  const handleGoogleError = (error) => {
    console.error("❌ Google OAuth Error:", error);
    alert("❌ Google OAuth failed. Check console for details.");
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🔧 Google OAuth Debug Tool</h2>
      
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>📊 Current Environment</h3>
        <p><strong>Origin:</strong> {currentOrigin}</p>
        <p><strong>Full URL:</strong> {window.location.href}</p>
        <p><strong>Protocol:</strong> {window.location.protocol}</p>
        <p><strong>Hostname:</strong> {window.location.hostname}</p>
        <p><strong>Port:</strong> {window.location.port}</p>
      </div>

      <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>⚠️ Expected Configuration</h3>
        <p>Your Google Cloud Console should have:</p>
        <ul>
          <li><strong>JavaScript Origins:</strong> http://localhost:3000, http://127.0.0.1:3000</li>
          <li><strong>Redirect URIs:</strong> http://localhost:3000, http://localhost:3000/, http://127.0.0.1:3000, http://127.0.0.1:3000/</li>
        </ul>
      </div>

      <div style={{ background: '#d1ecf1', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>🧪 Test Google OAuth</h3>
        <p>Click the button below to test Google OAuth:</p>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          logo_alignment="left"
          width="400"
        />
      </div>

      <div style={{ background: '#f8d7da', padding: '15px', borderRadius: '8px' }}>
        <h3>🔍 Troubleshooting Steps</h3>
        <ol>
          <li>Make sure you're using: <code>http://127.0.0.1:3000</code></li>
          <li>Clear browser cache (Ctrl+Shift+R)</li>
          <li>Try incognito mode</li>
          <li>Wait 30-60 minutes after updating Google Cloud Console</li>
          <li>Check browser console (F12) for errors</li>
        </ol>
      </div>

      <details style={{ marginTop: '20px' }}>
        <summary>📋 Debug Information</summary>
        <pre style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default GoogleOAuthDebug; 