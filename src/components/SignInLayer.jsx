import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const SignInLayer = () => {
  // console.log("🚀 SignInLayer component rendered");
  //When writing email and password

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("📝 Regular sign-in form submitted"); When Clicking on SignIn
    setError("");
    setLoading(true);
    setFieldErrors({});
    try {
      //console.log("🌐 Sending sign-in request to API..."); // before sending request to API
      const res = await fetch("https://admin.truckstaffer.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // console.log("📡 API response status:", res.status);
      const data = await res.json();
      //console.log("📦 API sign-in response:", data); // return Object like this { status: false, message: "Invalid email or password" }

      if (data.status && data.token) {
        localStorage.setItem("token", data.token);

        // Remove previous user info
        localStorage.removeItem("user");

        // Store new user info from API response if available, otherwise fallback to input
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.setItem("user", JSON.stringify({
            email
            // Optionally add name if available from input or API
          }));
        }
        // console.log(
        //   "💾 Token saved to localStorage:",
        //   localStorage.getItem("token")
        // );

        // Showing token saved in localStorage

        // console.log("🏠 Navigating to home page");
        navigate("/");
      } else {
        if (data.errors) {
          setFieldErrors(data.errors);
          // Show validation errors in SweetAlert (beautiful style)
          const errorMessages = Object.values(data.errors).join('<br>');
          Swal.fire({
            icon: 'error',
            title: 'Oops! Something went wrong',
            html: `
              <div style="
                font-size: 16px; 
                color: #64748b; 
                line-height: 1.6;
                margin-top: 12px;
              ">
                ${errorMessages}
              </div>
            `,
            background: '#ffffff',
            color: '#1e293b',
            iconColor: '#ef4444',
            showConfirmButton: true,
            confirmButtonText: 'Try Again',
            confirmButtonColor: '#3b82f6',
            buttonsStyling: true,
            customClass: {
              popup: 'beautiful-error-popup',
              title: 'beautiful-title',
              confirmButton: 'beautiful-confirm-btn'
            },
            backdrop: 'rgba(15, 23, 42, 0.4)',
            width: 420,
            padding: '2rem',
            showClass: {
              popup: 'animate__animated animate__fadeInDown animate__faster'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp animate__faster'
            }
          });
        } else {
          setError(data.message || "Login failed");
          // Show general error in SweetAlert (beautiful style)
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: data.message || 'Invalid credentials. Please check your email and password.',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            color: '#334155',
            iconColor: '#f87171',
            confirmButtonText: 'Retry',
            confirmButtonColor: '#6366f1',
            buttonsStyling: true,
            customClass: {
              popup: 'beautiful-error-popup',
              title: 'beautiful-title',
              confirmButton: 'beautiful-confirm-btn'
            },
            backdrop: 'rgba(100, 116, 139, 0.3)',
            width: 400,
            padding: '1.5rem',
            showClass: {
              popup: 'animate__animated animate__bounceIn animate__faster'
            }
          });
        }

        // console.log("❌ Sign-in failed, error message:", data.message); Now data.message shows in UI just above RememberMe
      }
    } catch (err) {
      setError("Network error");
      console.log("🌐 Network error during sign-in:", err);
      // Show network error in SweetAlert (beautiful style)
      Swal.fire({
        icon: 'error',
        title: 'Connection Issue',
        html: `
          <div style="color: #64748b; font-size: 15px; margin-top: 8px;">
            Unable to reach our servers.<br>
            <span style="color: #94a3b8; font-size: 14px;">Please check your connection and try again.</span>
          </div>
        `,
        background: '#ffffff',
        color: '#1e293b',
        iconColor: '#fb7185',
        confirmButtonText: 'Retry',
        confirmButtonColor: '#06b6d4',
        buttonsStyling: true,
        customClass: {
          popup: 'network-error-popup'
        },
        backdrop: 'rgba(14, 165, 233, 0.1)',
        width: 380,
        padding: '2rem',
        showClass: {
          popup: 'animate__animated animate__fadeIn'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In handlers
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("🎉 Google Sign-In success callback triggered");
    setGoogleLoading(true);
    setError("");

    try {
      const { credential } = credentialResponse;

      if (!credential) {
        console.error("❌ No credential in response");
        setError("Google Sign-In failed - no credential received");
        // Show Google sign-in error in SweetAlert (beautiful style)
        Swal.fire({
          icon: 'warning',
          title: 'Sign-in Issue',
          text: 'No credential received from Google. Please try again.',
          background: '#ffffff',
          color: '#78716c',
          iconColor: '#f59e0b',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#8b5cf6',
          buttonsStyling: true,
          customClass: {
            popup: 'warning-popup'
          },
          backdrop: 'rgba(245, 158, 11, 0.1)',
          width: 380,
          padding: '1.75rem',
          showClass: {
            popup: 'animate__animated animate__headShake'
          }
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
        credential: credential,
      };

      console.log("👤 User data extracted:", userData);

      // For testing - simulate successful authentication
      console.log("🎯 Simulating backend authentication...");

      const mockResponse = {
        status: true,
        token: "mock_jwt_token_" + Date.now(),
        user: {
          id: 1,
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
        },
      };

      // Store in localStorage
      localStorage.setItem("token", mockResponse.token);
      localStorage.setItem("name", mockResponse.user.name);
      localStorage.setItem("user", JSON.stringify(mockResponse.user));

      console.log("✅ Authentication successful, data stored in localStorage");
      console.log("📦 Stored token:", mockResponse.token);
      console.log("👤 Stored user:", mockResponse.user);

      // Show success message in SweetAlert (beautiful style)
      Swal.fire({
        icon: 'success',
        title: 'Welcome back!',
        html: `
          <div style="
            font-size: 16px; 
            color: #059669; 
            margin-top: 8px;
            font-weight: 500;
          ">
            Successfully signed in as <strong>${userData.name}</strong>
          </div>
        `,
        background: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
        color: '#065f46',
        iconColor: '#10b981',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'success-popup',
          timerProgressBar: 'success-progress-bar'
        },
        backdrop: 'rgba(16, 185, 129, 0.1)',
        width: 400,
        padding: '2rem',
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        didOpen: () => {
          // Add a subtle celebration effect
          const popup = Swal.getPopup();
          popup.style.boxShadow = '0 25px 50px -12px rgba(16, 185, 129, 0.25)';
        }
      }).then(() => {
        // console.log("✅ Google Sign-In successful, navigating to home..."); not working
        // console.log("🏠 Navigating to home page");
        // Force navigation to home page
        window.location.href = "/";
      });
    } catch (err) {
      console.error("❌ Google Sign-In error:", err);
      setError("Google Sign-In failed");
      // Show Google sign-in error in SweetAlert (beautiful style)
      Swal.fire({
        icon: 'warning',
        title: 'Sign-in Cancelled',
        text: 'Google sign-in was cancelled or failed. Please try again.',
        background: '#ffffff',
        color: '#78716c',
        iconColor: '#f59e0b',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#8b5cf6',
        buttonsStyling: true,
        customClass: {
          popup: 'warning-popup'
        },
        backdrop: 'rgba(245, 158, 11, 0.1)',
        width: 380,
        padding: '1.75rem',
        showClass: {
          popup: 'animate__animated animate__headShake'
        }
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("❌ Google Sign-In error");
    setError("Google Sign-In failed");
    setGoogleLoading(false);
    // Show Google sign-in error in SweetAlert (beautiful style)
    Swal.fire({
      icon: 'warning',
      title: 'Sign-in Cancelled',
      text: 'Google sign-in was cancelled or failed. Please try again.',
      background: '#ffffff',
      color: '#78716c',
      iconColor: '#f59e0b',
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#8b5cf6',
      buttonsStyling: true,
      customClass: {
        popup: 'warning-popup'
      },
      backdrop: 'rgba(245, 158, 11, 0.1)',
      width: 380,
      padding: '1.75rem',
      showClass: {
        popup: 'animate__animated animate__headShake'
      }
    });
  };

  // Track screen width for responsive image rendering
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 700);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Custom CSS for Beautiful SweetAlert */}
      <style>
        {`
          .beautiful-error-popup {
            border-radius: 20px !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          }
          
          .beautiful-title {
            font-weight: 700 !important;
            font-size: 1.5rem !important;
          }
          
          .beautiful-confirm-btn {
            border-radius: 12px !important;
            padding: 12px 24px !important;
            font-weight: 600 !important;
            transition: all 0.2s ease !important;
          }
          
          .beautiful-confirm-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3) !important;
          }
          
          .success-popup {
            border-radius: 16px !important;
            border: 1px solid rgba(16, 185, 129, 0.2) !important;
          }
          
          .success-progress-bar {
            background: linear-gradient(90deg, #10b981, #059669) !important;
          }
          
          .network-error-popup {
            border-radius: 16px !important;
            border: 1px solid rgba(251, 113, 133, 0.2) !important;
          }
          
          .warning-popup {
            border-radius: 16px !important;
            border: 1px solid rgba(245, 158, 11, 0.2) !important;
          }
        `}
      </style>

      <section className="auth d-flex flex-wrap">
        {isLargeScreen && (
          <div className="auth-left">
            <div
              className="d-flex align-items-center flex-column h-100 justify-content-center p-0 m-0 w-100"
              style={{ position: "relative" }}
            >
              <img src="/login.jpg" alt="main-website-logo" />
              <div className="auth-left-overlay"></div>
            </div>
          </div>
        )}
        <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
          <div className="max-w-464-px mx-auto w-100">
            <img
              src="/main-logo.png"
              alt="main-website-logo"
              className="auth-logo"
            />
            <h4 className="mb-12 auth-title">Sign In to your Account</h4>
            <p className="mb-32 text-lg auth-desc">
              Welcome back! Please enter your details to sign in.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="icon-field mb-16">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="mage:email" />
                </span>
                <input
                  type="email"
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(""); // ✅ Clear error on input
                  }}
                  required
                />
                {/* {fieldErrors.email && (
                  <div className="text-danger mt-1">{fieldErrors.email}</div>
                )} */}
              </div>

              <div className="position-relative mb-20">
                <div className="icon-field">
                  <span className="icon top-50 translate-middle-y">
                    <Icon icon="solar:lock-password-outline" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control h-56-px bg-neutral-50 radius-12"
                    id="your-password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(""); // ✅ Clear error on input
                    }}
                    required
                  />
                  {/* {fieldErrors.password && (
                    <div className="text-danger mt-1">{fieldErrors.password}</div>
                  )} */}
                </div>
                <span
                  className={`toggle-password ${
                    showPassword ? "ri-eye-off-line" : "ri-eye-line"
                  } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                  onClick={() => setShowPassword((prev) => !prev)}
                  data-toggle="#your-password"
                />
              </div>

              {error && (
                <div className="text-danger mb-2">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div className="">
                <div className="d-flex justify-content-between gap-2">
                  <div className="form-check style-check d-flex align-items-center">
                    <input
                      className="form-check-input border border-neutral-300"
                      type="checkbox"
                      defaultValue=""
                      id="remeber"
                    />
                    <label className="form-check-label" htmlFor="remeber">
                      Remember me{" "}
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-primary-600 fw-semibold"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-3"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              {/* <div className=" center-border-horizontal text-center">
                <span className="bg-base z-1 px-4">Or sign in with</span>
              </div> */}

              <div className="mt-3 d-flex align-items-center justify-content-center gap-4 flex-wrap">
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
                    <small className="text-secondary">Signing in with Google...</small>
                  </div>
                )} */}

                <div className="text-sm">
                  <span>Don't have an account? </span>
                  <Link to="/sign-up" className="text-primary-600 fw-semibold">
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignInLayer;