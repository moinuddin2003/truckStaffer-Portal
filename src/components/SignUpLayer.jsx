import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUpLayer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return false;
    }
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms & Conditions and Privacy Policy');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call for email verification
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (emailSent) {
    return (
      <section className='auth bg-base d-flex flex-wrap'>
        <div className='auth-left d-lg-block d-none'>
          <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
            <img src='assets/images/auth/auth-img.png' alt='' />
          </div>
        </div>
        <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
          <div className='max-w-464-px mx-auto w-100 text-center'>
            <div className='mb-40'>
              <img src='assets/images/logo.png' alt='TruckStaffer' />
            </div>
            <div className='mb-32'>
              <i className='ri-mail-check-line text-success' style={{ fontSize: '4rem' }}></i>
            </div>
            <h4 className='mb-12'>Check Your Email</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>
            <div className='alert alert-info'>
              <p className='mb-2'>Please check your email and click the verification link to complete your registration.</p>
              <p className='mb-0 small'>If you don't see the email, check your spam folder.</p>
            </div>
            <div className='mt-32'>
              <button 
                className='btn btn-outline-primary me-2'
                onClick={() => setEmailSent(false)}
              >
                Back to Sign Up
              </button>
              <Link to='/sign-in' className='btn btn-primary'>
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='assets/images/auth/auth-img.png' alt='' />
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <Link to='/' className='mb-40 max-w-290-px'>
              <img src='assets/images/logo.png' alt='TruckStaffer' />
            </Link>
            <h4 className='mb-12'>Create Your TruckStaffer Account</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Join TruckStaffer and start your application process
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='f7:person' />
              </span>
              <input
                type='text'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Enter your full name'
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
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
                placeholder='Enter your email address'
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div className='mb-16'>
              <div className='position-relative'>
                <div className='icon-field'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='solar:lock-password-outline' />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className='form-control h-56-px bg-neutral-50 radius-12'
                    id='your-password'
                    placeholder='Create a password'
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
                <span
                  className='toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light'
                  onClick={togglePasswordVisibility}
                >
                  <Icon icon={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </span>
              </div>
              <span className='mt-12 text-sm text-secondary-light'>
                Your password must have at least 8 characters
              </span>
            </div>
            <div className='mb-20'>
              <div className='position-relative'>
                <div className='icon-field'>
                  <span className='icon top-50 translate-middle-y'>
                    <Icon icon='solar:lock-password-outline' />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className='form-control h-56-px bg-neutral-50 radius-12'
                    id='confirm-password'
                    placeholder='Confirm your password'
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
                <span
                  className='toggle-password cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light'
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <Icon icon={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </span>
              </div>
            </div>
            <div className=''>
              <div className='d-flex justify-content-between gap-2'>
                <div className='form-check style-check d-flex align-items-start'>
                  <input
                    className='form-check-input border border-neutral-300 mt-4'
                    type='checkbox'
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    id='condition'
                    required
                  />
                  <label
                    className='form-check-label text-sm'
                    htmlFor='condition'
                  >
                    By creating an account means you agree to the
                    <Link to='/terms' className='text-primary-600 fw-semibold'>
                      Terms &amp; Conditions
                    </Link>{" "}
                    and our
                    <Link to='/privacy' className='text-primary-600 fw-semibold'>
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            </div>
            <button
              type='submit'
              className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
            <div className='mt-32 center-border-horizontal text-center'>
              <span className='bg-base z-1 px-4'>Or sign up with</span>
            </div>
            <div className='mt-32 d-flex align-items-center gap-3'>
              <button
                type='button'
                className='fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50'
              >
                <Icon
                  icon='ic:baseline-facebook'
                  className='text-primary-600 text-xl line-height-1'
                />
                Facebook
              </button>
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
            </div>
            <div className='mt-32 text-center'>
              <p className='text-secondary-light mb-0'>
                Already have an account?{" "}
                <Link to='/sign-in' className='text-primary-600 fw-medium'>
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpLayer;
