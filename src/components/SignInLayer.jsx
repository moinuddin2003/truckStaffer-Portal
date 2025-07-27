import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignInLayer = () => {
  console.log("SignInLayer rendered"); // DEBUG
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted"); // DEBUG
    setError("");
    setLoading(true);
    try {
      console.log("Sending login request to API..."); // DEBUG
      const res = await fetch("https://admin.truckstaffer.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      console.log("API response status:", res.status); // DEBUG
      const data = await res.json();
      console.log("API login response:", data); // DEBUG
      if (data.status && data.token) {
        localStorage.setItem("token", data.token);
        console.log("Token saved to localStorage:", localStorage.getItem("token")); // DEBUG
        if (data.user && data.user.name) {
          localStorage.setItem("name", data.user.name);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        console.log("Navigating to home page"); // DEBUG
        navigate("/");
      } else {
        setError(data.message || "Login failed");
        console.log("Login failed, error message:", data.message); // DEBUG
      }
    } catch (err) {
      setError("Network error");
      console.log("Network error during login:", err); // DEBUG
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className='auth d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center p-0 m-0 w-100' style={{position: 'relative'}}>
          <img src='/login.jpg' alt='main-website-logo' />
          <div className='auth-left-overlay'></div>
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <img src='/main-logo.png' alt='main-website-logo' className='auth-logo' />
          <h4 className='mb-12 auth-title'>Sign In to your Account</h4>
          <p className='mb-32 text-lg auth-desc'>Welcome back! Please enter your details to sign in.</p>
          <form className='auth-form' onSubmit={handleSubmit}>
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
            <div className='position-relative mb-20'>
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
            {error && <div className='text-danger mb-2'>{error}</div>}
            <div className=''>
              <div className='d-flex justify-content-between gap-2'>
                <div className='form-check style-check d-flex align-items-center'>
                  <input
                    className='form-check-input border border-neutral-300'
                    type='checkbox'
                    defaultValue=''
                    id='remeber'
                  />
                  <label className='form-check-label' htmlFor='remeber'>
                    Remember me{" "}
                  </label>
                </div>
                <Link to='#' className='text-primary-600 fw-medium'>
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type='submit'
              className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className='mt-32 center-border-horizontal text-center'>
              <span className='bg-base z-1 px-4'>Or sign in with</span>
            </div>
            {/* <div className='mt-32 d-flex justify-content-center'>
              <button
                type='button'
                className='fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50'
              >
                <Icon
                  icon='logos:google-icon'
                  className='text-primary-600 text-xl line-height-1'
                />
                Google
              </button>
            </div> */}
            <div className='mt-32 text-center text-sm'>
              <p className='mb-0'>
                Don’t have an account?{" "}
                <Link to='/sign-up' className='text-primary-600 fw-semibold'>
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignInLayer;
