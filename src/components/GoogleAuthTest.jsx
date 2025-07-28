import React, { useState, useEffect } from 'react';
import { GOOGLE_CONFIG } from '../config/google';

const GoogleAuthTest = () => {
  const [checks, setChecks] = useState([]);
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    const performChecks = () => {
      const newChecks = [];

      // Check 1: Google script loading
      if (window.google) {
        newChecks.push('✅ Google Identity Services script loaded');
      } else {
        newChecks.push('❌ Google Identity Services script not loaded');
      }

      // Check 2: Client ID configuration
      if (GOOGLE_CONFIG.CLIENT_ID && GOOGLE_CONFIG.CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID') {
        newChecks.push('✅ Google Client ID configured (hard-coded)');
      } else {
        newChecks.push('❌ Google Client ID not configured');
      }

      // Check 3: Current origin
      const currentOrigin = window.location.origin;
      newChecks.push(`ℹ️ Current origin: ${currentOrigin}`);

      // Check 4: Google accounts object
      if (window.google && window.google.accounts) {
        newChecks.push('✅ Google accounts object available');
      } else {
        newChecks.push('❌ Google accounts object not available');
      }

      // Check 5: Detailed origin analysis
      newChecks.push(`ℹ️ Protocol: ${window.location.protocol}`);
      newChecks.push(`ℹ️ Hostname: ${window.location.hostname}`);
      newChecks.push(`ℹ️ Port: ${window.location.port}`);
      newChecks.push(`ℹ️ Full URL: ${window.location.href}`);

      // Check 6: Expected origins for Google Cloud Console
      newChecks.push('📋 Expected origins in Google Cloud Console:');
      newChecks.push('   - http://localhost:3000');
      newChecks.push('   - http://127.0.0.1:3000');

      // Check 7: Browser cache and cookies
      newChecks.push('💡 Troubleshooting tips:');
      newChecks.push('   1. Clear browser cache (Ctrl+Shift+Delete)');
      newChecks.push('   2. Try incognito/private window');
      newChecks.push('   3. Wait 5-15 minutes for Google changes to propagate');
      newChecks.push('   4. Check if you have any browser extensions blocking Google');

      setChecks(newChecks);
    };

    performChecks();
  }, []);

  const testGoogleAuth = () => {
    setTestResult('Testing...');
    
    if (!window.google || !window.google.accounts) {
      setTestResult('❌ Google Identity Services not loaded');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        callback: (response) => {
          setTestResult('✅ Google OAuth test successful!');
          console.log('Test response:', response);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          setTestResult(`❌ Google test failed: ${notification.getNotDisplayedReason()}`);
        } else if (notification.isSkippedMoment()) {
          setTestResult('⚠️ Google test skipped (normal behavior)');
        } else {
          setTestResult('✅ Google test ready');
        }
      });
    } catch (error) {
      setTestResult(`❌ Google test error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '14px' }}>
      <h2>🔍 Google OAuth Diagnostic Report</h2>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        {checks.map((check, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            {check}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
        <h3>🧪 Manual Test</h3>
        <button 
          onClick={testGoogleAuth}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Google OAuth
        </button>
        {testResult && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '3px' }}>
            <strong>Test Result:</strong> {testResult}
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
        <h3>🚨 If you still see "unregistered_origin":</h3>
        <ol>
          <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
          <li>Edit your OAuth 2.0 Client ID</li>
          <li>Add these EXACT origins to "Authorized JavaScript origins":</li>
          <ul>
            <li><code>http://localhost:3000</code></li>
            <li><code>http://127.0.0.1:3000</code></li>
          </ul>
          <li>Click "Save"</li>
          <li>Wait 5-15 minutes</li>
          <li>Clear browser cache and try again</li>
        </ol>
      </div>
    </div>
  );
};

export default GoogleAuthTest; 