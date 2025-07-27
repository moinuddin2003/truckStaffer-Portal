import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUpLayer = () => {
  console.log("SignUpLayer rendered"); // DEBUG
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sign-up form submitted"); // DEBUG
    setError("");
    setLoading(true);
    try {
      console.log("Sending sign-up request to API..."); // DEBUG
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
      console.log("API response status:", res.status); // DEBUG
      const data = await res.json();
      console.log("API sign-up response:", data); // DEBUG
      if (data.status && data.token) {
        localStorage.setItem("token", data.token);
        console.log("Token saved to localStorage:", localStorage.getItem("token")); // DEBUG
        console.log("Navigating to home page"); // DEBUG
        navigate("/");
      } else {
        setError(data.message || "Registration failed");
        console.log("Sign-up failed, error message:", data.message); // DEBUG
      }
    } catch (err) {
      setError("Network error");
      console.log("Network error during sign-up:", err); // DEBUG
    } finally {
      setLoading(false);
    }
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
              <div className='position-relative '>
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
            {error && <div className='text-danger mb-2'>{error}</div>}
            <div className=''>
              <div className='d-flex justify-content-between gap-2'>
                <div className='form-check style-check d-flex align-items-start'>
                  <input
                    className='form-check-input border border-neutral-300 mt-4'
                    type='checkbox'
                    defaultValue=''
                    id='condition'
                  />
                  <label
                    className='form-check-label text-sm'
                    htmlFor='condition'
                  >
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
              <span className='bg-base z-1 px-4'>Or sign up with</span>
            </div>
            <div className='mt- d-flex align-items-center justify-content-center gap-4 flex-wrap'>
              {/* <button
                type='button'
                className='fw-semibold text-primary-light py-16 px-24 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50'
                style={{ minWidth: '180px' }}
              >
                <Icon
                  icon='logos:google-icon'
                  className='text-primary-600 text-xl line-height-1'
                />
                Google
              </button> */}
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
