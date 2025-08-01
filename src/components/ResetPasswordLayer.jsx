import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const ResetPasswordLayer = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Extract token from URL parameters
        let urlToken = searchParams.get('token');
        
        // If no token found with equals sign, try to extract from URL directly
        if (!urlToken) {
            const url = window.location.href;
            const tokenMatch = url.match(/token([a-zA-Z0-9]+)/);
            if (tokenMatch) {
                urlToken = tokenMatch[1];
            }
        }
        
        if (urlToken) {
            setToken(urlToken);
        } else {
            setError('Invalid or missing reset token. Please request a new password reset.');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Get email from localStorage (stored when forgot password was requested)
            const email = localStorage.getItem('resetEmail');
            
            // Create FormData to match the working Postman request
            const formData = new FormData();
            formData.append('email', email || '');
            formData.append('token', token);
            formData.append('password', password);

            const response = await fetch('https://admin.truckstaffer.com/api/forget/change-password', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Clear the stored email after successful reset
                localStorage.removeItem('resetEmail');
                setSuccess(true);
                setTimeout(() => {
                    navigate('/sign-in');
                }, 3000);
            } else {
                setError(data.message || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <section className="auth forgot-password-page bg-base d-flex flex-wrap">
                <div className="auth-left d-lg-block d-none">
                    <div className="d-flex align-items-center flex-column h-100 justify-content-center">
                        <img src="/assets/images/auth/forgot-pass-img.png" alt="Forgot Password" />
                    </div>
                </div>
                <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
                    <div className="max-w-464-px mx-auto w-100">
                        <div className="text-center">
                            <h4 className="mb-12">Invalid Reset Link</h4>
                            <p className="mb-32 text-secondary-light text-lg">
                                The password reset link is invalid or has expired.
                            </p>
                            <Link to="/forgot-password" className="btn btn-primary text-sm btn-sm px-12 py-16 radius-12">
                                Request New Reset Link
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="auth forgot-password-page bg-base d-flex flex-wrap">
                <div className="auth-left d-lg-block d-none">
                    <div className="d-flex align-items-center flex-column h-100 justify-content-center">
                        <img src="/assets/images/auth/forgot-pass-img.png" alt="Reset Password" />
                    </div>
                </div>
                <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
                    <div className="max-w-464-px mx-auto w-100">
                        <div>
                            <h4 className="mb-12">Reset Your Password</h4>
                            <p className="mb-32 text-secondary-light text-lg">
                                Enter your new password below.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="icon-field mb-16 position-relative">
                                <span className="icon top-50 translate-middle-y">
                                    <Icon icon="ri:lock-password-line" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control h-56-px bg-neutral-50 radius-12"
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 translate-middle-y end-0 pe-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ zIndex: 10 }}
                                >
                                    <Icon icon={showPassword ? "ri:eye-off-line" : "ri:eye-line"} className="text-secondary" />
                                </button>
                            </div>

                            <div className="icon-field mb-16 position-relative">
                                <span className="icon top-50 translate-middle-y">
                                    <Icon icon="ri:lock-password-line" />
                                </span>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="form-control h-56-px bg-neutral-50 radius-12"
                                    placeholder="Confirm New Password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 translate-middle-y end-0 pe-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{ zIndex: 10 }}
                                >
                                    <Icon icon={showConfirmPassword ? "ri:eye-off-line" : "ri:eye-line"} className="text-secondary" />
                                </button>
                            </div>

                            {error && (
                                <div className="alert alert-danger mt-2 mb-3" role="alert">
                                    <strong>Error:</strong> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                            
                            <div className="text-center">
                                <Link to="/sign-in" className="text-primary-600 fw-bold mt-24">
                                    Back to Sign In
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Success Modal */}
            {success && (
                <div
                    className="modal fade show"
                    style={{ display: 'block' }}
                    tabIndex={-1}
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content radius-16 bg-base">
                            <div className="modal-body p-40 text-center">
                                <div className="mb-32">
                                    <Icon icon="ri:check-line" className="text-success" style={{ fontSize: '3rem' }} />
                                </div>
                                <h6 className="mb-12">Password Reset Successful!</h6>
                                <p className="text-secondary-light text-sm mb-0">
                                    Your password has been successfully reset. You will be redirected to the sign-in page in a few seconds.
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                                    onClick={() => navigate('/sign-in')}
                                >
                                    Go to Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ResetPasswordLayer 