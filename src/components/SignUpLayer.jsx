import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const SignUpLayer = () => {
  // console.log("🚀 SignUpLayer component rendered");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("📝 Regular sign-up form submitted");

    
  // 🚨 Frontend Validation
  if (!name.trim()) {
    Swal.fire({
      icon: 'error',
      title: '<span style="color:#d33;font-weight:700;">Name Required</span>',
      html: `<div style="font-size:1.1em;color:#333;">Name is required</div>`,
      background: '#fff6f6',
      iconColor: '#d33',
      showClass: { popup: 'animate__animated animate__shakeX' },
      width: 400,
      backdrop: 'rgba(220,53,69,0.08)',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK'
    });
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    Swal.fire({
      icon: 'error',
      title: '<span style="color:#d33;font-weight:700;">Invalid Email</span>',
      html: `<div style="font-size:1.1em;color:#333;">Invalid email address</div>`,
      background: '#fff6f6',
      iconColor: '#d33',
      showClass: { popup: 'animate__animated animate__shakeX' },
      width: 400,
      backdrop: 'rgba(220,53,69,0.08)',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK'
    });
    return;
  }

  if (password.length < 8) {
    Swal.fire({
      icon: 'error',
      title: '<span style="color:#d33;font-weight:700;">Password Error</span>',
      html: `<div style="font-size:1.1em;color:#333;">Password must be at least 8 characters</div>`,
      background: '#fff6f6',
      iconColor: '#d33',
      showClass: { popup: 'animate__animated animate__shakeX' },
      width: 400,
      backdrop: 'rgba(220,53,69,0.08)',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK'
    });
    return;
  }

  if (password !== passwordConfirmation) {
    Swal.fire({
      icon: 'error',
      title: '<span style="color:#d33;font-weight:700;">Password Mismatch</span>',
      html: `<div style="font-size:1.1em;color:#333;">Passwords do not match</div>`,
      background: '#fff6f6',
      iconColor: '#d33',
      showClass: { popup: 'animate__animated animate__shakeX' },
      width: 400,
      backdrop: 'rgba(220,53,69,0.08)',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK'
    });
    return;
  }

    setError("");
    setLoading(true);
    
    try {
      // console.log("🌐 Sending sign-up request to API...");
      const res = await fetch("https://admin.truckstaffer.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation
        })
      });
      
      // console.log("📡 API response status:", res.status);
      const data = await res.json();
      // console.log("📦 API sign-up response:", data);
      
      if (data.status && data.token) {
        localStorage.setItem("token", data.token);
        // console.log("💾 Token saved to localStorage:", localStorage.getItem("token"));  it is giving commplete token in console
        
        // Send welcome email
        try {
          await fetch("https://admin.truckstaffer.com/api/send-welcome-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email
            })
          });
          // console.log("📧 Welcome email sent successfully");
        } catch (emailError) {
          console.log("📧 Welcome email failed to send:", emailError);
          // Don't block the sign-up process if email fails
        }
        
        // console.log("🏠 Navigating to home page");
        navigate("/");
      } else {
        // setError(data.message || "Registration failed");
        // Show all validation errors if present
        if (data.errors) {
          const errorMessages = Object.values(data.errors).join('<br>');
          Swal.fire({
            icon: 'error',
            title: '<span style="color:#d33;font-weight:700;">Validation Error</span>',
            html: `<div style="font-size:1.1em;color:#333;">${errorMessages}</div>`,
            background: '#fff6f6',
            iconColor: '#d33',
            showClass: { popup: 'animate__animated animate__shakeX' },
            width: 400,
            backdrop: 'rgba(220,53,69,0.08)',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: '<span style="color:#d33;font-weight:700;">Registration Error</span>',
            html: `<div style="font-size:1.1em;color:#333;">${data.message || "Registration failed"}</div>`,
            background: '#fff6f6',
            iconColor: '#d33',
            showClass: { popup: 'animate__animated animate__shakeX' },
            width: 400,
            backdrop: 'rgba(220,53,69,0.08)',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
          });
        }
        // console.log("❌ Sign-up failed, error message:", data.message);
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '<span style="color:#d33;font-weight:700;">Network Error</span>',
        html: `<div style="font-size:1.1em;color:#333;">Unable to connect to the server.<br>Please check your internet connection and try again.</div>`,
        background: '#fff6f6',
        iconColor: '#d33',
        showClass: { popup: 'animate__animated animate__shakeX' },
        width: 400,
        backdrop: 'rgba(220,53,69,0.08)',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      console.log("🌐 Network error during sign-up:", err);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In handlers
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("🎉 Google Sign-Up success callback triggered");
    setGoogleLoading(true);
    setError("");
    
    try {
      const { credential } = credentialResponse;
      
      if (!credential) {
        console.error("❌ No credential in response");
        setError("Google Sign-Up failed - no credential received");
        Swal.fire({
          icon: 'error',
          title: '<span style="color:#d33;font-weight:700;">Google Sign-Up Error</span>',
          html: `<div style="font-size:1.1em;color:#333;">No credential received from Google. Please try again.</div>`,
          background: '#fff6f6',
          iconColor: '#d33',
          showClass: { popup: 'animate__animated animate__shakeX' },
          width: 400,
          backdrop: 'rgba(220,53,69,0.08)',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
        return;
      }

      // Decode the JWT token to get user info
      const decoded = jwtDecode(credential);
      console.log("👤 Decoded user data:", decoded);
      
      const userData = {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        googleId: decoded.sub,
        credential: credential
      };

      console.log("👤 User data extracted:", userData);

      // For testing - simulate successful authentication
      console.log("🎯 Simulating backend authentication...");
      
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
      
      console.log("✅ Authentication successful, data stored in localStorage");
      console.log("📦 Stored token:", mockResponse.token);
      console.log("👤 Stored user:", mockResponse.user);
      
      console.log("✅ Google Sign-Up successful, navigating to home...");
      // console.log("🏠 Navigating to home page");
      // Force navigation to home page
      window.location.href = "/";
      
    } catch (err) {
      console.error("❌ Google Sign-Up error:", err);
      setError("Google Sign-Up failed");
      Swal.fire({
        icon: 'error',
        title: '<span style="color:#d33;font-weight:700;">Google Sign-Up Error</span>',
        html: `<div style="font-size:1.1em;color:#333;">An error occurred during Google sign-up. Please try again.</div>`,
        background: '#fff6f6',
        iconColor: '#d33',
        showClass: { popup: 'animate__animated animate__shakeX' },
        width: 400,
        backdrop: 'rgba(220,53,69,0.08)',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("❌ Google Sign-Up error");
    setError("Google Sign-Up failed");
    setGoogleLoading(false);
    Swal.fire({
      icon: 'error',
      title: '<span style="color:#d33;font-weight:700;">Google Sign-Up Error</span>',
      html: `<div style="font-size:1.1em;color:#333;">Google sign-up was cancelled or failed. Please try again.</div>`,
      background: '#fff6f6',
      iconColor: '#d33',
      showClass: { popup: 'animate__animated animate__shakeX' },
      width: 400,
      backdrop: 'rgba(220,53,69,0.08)',
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK'
    });
  };

  return (
    <section className='auth d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center p-0 m-0 w-100'>
          <img src='/login.jpg' alt='main-website-logo' />
          <div className='auth-left-overlay'></div>
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <img src='/main-logo.png' alt='main-website-logo' className='auth-logo' />
          <h4 className='mb-12 auth-title'>Create your Account</h4>
          <p className='mb-32 text-lg auth-desc'>Join us! Please enter your details to sign up.</p>
          
          <form className='auth-form' onSubmit={handleSubmit}>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='f7:person' />
              </span>
              <input
                type='text'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Username'
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='mage:email' />
              </span>
              <input
                type='email'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className='mb-20'>
              <div className='position-relative'>
                <div className='icon-field'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='solar:lock-password-outline' />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className='form-control h-56-px bg-neutral-50 radius-12'
                    id='your-password'
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                <span
                  className={`toggle-password ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                  onClick={() => setShowPassword((prev) => !prev)}
                  data-toggle='#your-password'
                />
              </div>
              <div className='mt-12'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className='form-control h-56-px bg-neutral-50 radius-12 mt-2'
                  placeholder='Confirm Password'
                  value={passwordConfirmation}
                  onChange={e => setPasswordConfirmation(e.target.value)}
                  required
                />
              </div>
              <span className='mt-12 text-sm text-secondary-light'>
                Your password must have at least 8 characters
              </span>
            </div>
            
            {/* {error && (
              <div className='text-danger mb-2'>
                <strong>Error:</strong> {error}
              </div>
            )} */}
            
            <div className=''>
              <div className='d-flex justify-content-between gap-2'>
                <div className='form-check style-check d-flex align-items-start'>
                  <input
                    className='form-check-input border border-neutral-300 mt-4'
                    type='checkbox'
                    defaultValue=''
                    id='condition'
                    required
                  />
                  <label className='form-check-label text-sm' htmlFor='condition'>
                    By creating an account means you agree to the
                    <Link to='#' className='text-primary-600 fw-semibold'>
                      Terms &amp; Conditions
                    </Link>{" "}
                    and our
                    <Link to='#' className='text-primary-600 fw-semibold'>
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            </div>
            
            <button
              type='submit'
              className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-3'
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
            
            <div className=' center-border-horizontal text-center'>
              {/* <span className='bg-base z-1 px-4'>Or sign up with</span> */}
            </div>
            
            <div className='mb-3 d-flex align-items-center justify-content-center gap-4 flex-wrap'>
              {/* <GoogleLogin
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
              
              {googleLoading && (
                <div className="text-center mt-2">
                  <small className="text-secondary">Signing up with Google...</small>
                </div>
              ) */}
              
              <div className='text-sm'>
                <span>Already have an account? </span>
                <Link to='/sign-in' className='text-primary-600 fw-semibold'>
                  Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpLayer;
