import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const ForgotPasswordLayer = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if there's a token in the URL (from email link)
        let token = searchParams.get('token');
        
        // If no token found with equals sign, try to extract from URL directly
        if (!token) {
            const url = window.location.href;
            const tokenMatch = url.match(/token([a-zA-Z0-9]+)/);
            if (tokenMatch) {
                token = tokenMatch[1];
            }
        }
        
        console.log('ForgotPasswordLayer: Token found in URL:', token);
        if (token) {
            // Redirect to reset password page with the token
            console.log('ForgotPasswordLayer: Redirecting to reset-password with token');
            // Use window.location.replace for more reliable redirection
            window.location.replace(`/reset-password?token=${token}`);
        }
    }, [searchParams, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('https://admin.truckstaffer.com/api/forget/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            console.log('Forgot password API response:', data);

            if (response.ok && (data.status || data.success)) {
                // Store email for password reset
                localStorage.setItem('resetEmail', email);
                setSuccess(true);
                setSuccessMessage(data.message || 'Password reset instructions sent to your email.');
            } else {
                setError(data.message || 'Failed to send reset email. Please try again.');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="auth forgot-password-page bg-base d-flex flex-wrap min-vh-100">
                <div className="auth-left d-lg-block d-none">
                    <div className="d-flex align-items-center flex-column h-100 justify-content-center">
                        <img src="/login.jpg" alt="Forgot Password" />
                    </div>
                </div>
                <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center min-vh-100">
                    <div className="max-w-464-px mx-auto w-100">
                        <div className="mb-40">
                            <h4 className="mb-12 fw-bold">Forgot Password</h4>
                            <p className="mb-0 text-secondary-light text-lg">
                                Enter the email address associated with your account and we will
                                send you a link to reset your password.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="icon-field mb-24">
                                <span className="icon top-50 translate-middle-y">
                                    <Icon icon="mage:email" />
                                </span>
                                <input
                                    type="email"
                                    className="form-control h-56-px bg-neutral-50 radius-12"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {error && (
                                <div className="alert alert-danger mb-24" role="alert">
                                    <strong>Error:</strong> {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mb-24"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Sending...
                                    </>
                                ) : (
                                    'Continue'
                                )}
                            </button>
                            <div className="text-center mb-32">
                                <Link to="/sign-in" className="text-primary-600 fw-bold d-inline-flex align-items-center gap-2">
                                    <Icon icon="ri:arrow-left-line" className="text-base" />
                                    Back to Sign In
                                </Link>
                            </div>
                            <div className="text-center text-sm border-top pt-32">
                                <p className="mb-0">
                                    Already have an account?{" "}
                                    <Link to="/sign-in" className="text-primary-600 fw-semibold">
                                        Sign In
                                    </Link>
                                </p>
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
                                <h6 className="mb-12">Check your Email</h6>
                                <p className="text-secondary-light text-sm mb-32">
                                    {successMessage || `We've sent password reset instructions to ${email}`}
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mb-32"
                                    onClick={() => window.location.href = '/sign-in'}
                                >
                                    Back to Sign In
                                </button>
                                <div className="text-sm">
                                    <p className="mb-0">
                                        Don't receive an email?{" "}
                                        <button 
                                            type="button" 
                                            className="text-primary-600 fw-semibold border-0 bg-transparent"
                                            onClick={() => {
                                                setSuccess(false);
                                                setEmail('');
                                            }}
                                        >
                                            Try again
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ForgotPasswordLayer