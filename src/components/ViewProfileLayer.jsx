import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewProfileLayer = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    const [imagePreview, setImagePreview] = useState('assets/images/user-grid/user-grid-img13.png');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    
    // Profile form state
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        postal_code: '',
        city: '',
        country: '',
        company: '',
        image: null
    });
    
    // Password form state
    const [passwordData, setPasswordData] = useState({
        new_password: '',
        confirm_password: ''
    });
    
    // Notification settings state
    const [notificationSettings, setNotificationSettings] = useState({
        companyNews: false,
        pushNotification: true,
        weeklyNewsLetters: true,
        meetupsNearYou: false,
        ordersNotifications: true
    });

    // Force re-render state
    const [formKey, setFormKey] = useState(0);

    // Get profile data on component mount
    useEffect(() => {
        getProfileData();
    }, []);

    // Cleanup effect
    useEffect(() => {
        return () => {
            // Cleanup any pending operations if component unmounts
            setLoading(false);
            setUpdateLoading(false);
            setPasswordLoading(false);
        };
    }, []);

    const getProfileData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/sign-in");
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch('https://admin.truckstaffer.com/api/profile/get', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (response.ok && data.success) {
                const userData = data.data || data.user;
                setProfileData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    postal_code: userData.postal_code || '',
                    city: userData.city || '',
                    country: userData.country || '',
                    company: userData.company || '',
                    image: userData.image || null
                });
                
                if (userData.image) {
                    setImagePreview(userData.image);
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to load profile data' });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.name === 'AbortError') {
                setMessage({ type: 'error', text: 'Request timeout. Please try again.' });
            } else {
                setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/sign-in");
            return;
        }

        // Basic validation
        if (!profileData.name.trim() || !profileData.email.trim()) {
            setMessage({ type: 'error', text: 'Name and email are required fields.' });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profileData.email)) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        setUpdateLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('name', profileData.name.trim());
            formData.append('email', profileData.email.trim());
            formData.append('phone', profileData.phone || '');
            formData.append('address', profileData.address || '');
            formData.append('postal_code', profileData.postal_code || '');
            formData.append('city', profileData.city || '');
            formData.append('country', profileData.country || '');
            formData.append('company', profileData.company || '');
            
            if (profileData.image instanceof File) {
                formData.append('image', profileData.image);
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for file upload

            const response = await fetch('https://admin.truckstaffer.com/api/profile/update', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (response.ok && data.success) {
                setMessage({ type: 'success', text: data.message || 'Profile updated successfully!' });
                
                // Update profile data with the response data if available
                if (data.data) {
                    const updatedData = data.data;
                    
                    const newProfileData = {
                        name: updatedData.name || profileData.name,
                        email: updatedData.email || profileData.email,
                        phone: updatedData.phone || profileData.phone,
                        address: updatedData.address || profileData.address,
                        postal_code: updatedData.postal_code !== undefined ? updatedData.postal_code : profileData.postal_code,
                        city: updatedData.city !== undefined ? updatedData.city : profileData.city,
                        country: updatedData.country !== undefined ? updatedData.country : profileData.country,
                        company: updatedData.company !== undefined ? updatedData.company : profileData.company,
                        image: updatedData.image || profileData.image
                    };
                    
                    setProfileData(newProfileData);
                    
                    if (updatedData.image) {
                        setImagePreview(updatedData.image);
                    }
                    
                    // Force form re-render
                    setFormKey(prev => prev + 1);
                    
                    // Update localStorage immediately with the new data
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    const updatedUser = { ...currentUser, ...newProfileData };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                } else {
                    // If no data in response, refresh from server
                    setTimeout(() => {
                        getProfileData();
                    }, 1000);
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile. Please try again.' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.name === 'AbortError') {
                setMessage({ type: 'error', text: 'Request timeout. Please try again.' });
            } else {
                setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
            }
        } finally {
            setUpdateLoading(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/sign-in");
            return;
        }

        // Enhanced validation
        if (!passwordData.new_password.trim()) {
            setMessage({ type: 'error', text: 'New password is required.' });
            return;
        }

        if (passwordData.new_password.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
            return;
        }

        if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage({ type: 'error', text: 'New password and confirm password do not match.' });
            return;
        }

        setPasswordLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch('https://admin.truckstaffer.com/api/profile/updatePassword', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: passwordData.new_password,
                    password_confirmation: passwordData.confirm_password
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const data = await response.json();

            if (response.ok && data.success) {
                setMessage({ type: 'success', text: data.message || 'Password changed successfully!' });
                setPasswordData({
                    new_password: '',
                    confirm_password: ''
                });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to change password. Please try again.' });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            if (error.name === 'AbortError') {
                setMessage({ type: 'error', text: 'Request timeout. Please try again.' });
            } else {
                setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
            }
        } finally {
            setPasswordLoading(false);
        }
    };

    // Toggle functions for password fields
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };



    const readURL = (input) => {
        if (input.target.files && input.target.files[0]) {
            const file = input.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                setProfileData(prev => ({ ...prev, image: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (setting) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="row gy-4">
            <div className="col-lg-4">
                <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                    <img
                        src="assets/images/user-grid/user-grid-bg1.png"
                        alt=""
                        className="w-100 object-fit-cover"
                    />
                    <div className="pb-24 ms-16 mb-24 me-16  mt--100">
                        <div className="text-center border border-top-0 border-start-0 border-end-0">
                            <img
                                src={imagePreview}
                                alt="Profile"
                                className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover"
                            />
                            <h6 className="mb-0 mt-16">{profileData.name || 'User'}</h6>
                            <span className="text-secondary-light mb-16">{profileData.email || ''}</span>
                        </div>
                        <div className="mt-24">
                            <h6 className="text-xl mb-16">Personal Info</h6>
                            <ul>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">Full Name</span>
                                    <span className="w-70 text-secondary-light fw-medium">: {profileData.name || '-'}</span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">Email</span>
                                    <span className="w-70 text-secondary-light fw-medium">: {profileData.email || '-'}</span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">Phone</span>
                                    <span className="w-70 text-secondary-light fw-medium">: {profileData.phone || '-'}</span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">Address</span>
                                    <span className="w-70 text-secondary-light fw-medium">: {profileData.address || '-'}</span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">Postal Code</span>
                                    <span className="w-70 text-secondary-light fw-medium">: {profileData.postal_code || '-'}</span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">City</span>
                                    <span className="w-70 text-secondary-light fw-medium">: {profileData.city || '-'}</span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">Country</span>
                                    <span className="w-70 text-secondary-light fw-medium">: {profileData.country || '-'}</span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">Company</span>
                                    <span className="w-70 text-secondary-light fw-medium">: {profileData.company || '-'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-8">
                <div className="card h-100">
                    <div className="card-body p-24">
                        {/* Message Display */}
                        {message.text && (
                            <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} border-0 shadow-sm mb-4`} role="alert">
                                <div className="d-flex align-items-center">
                                    <i className={`ri-${message.type === 'success' ? 'check' : 'alert'}-line me-3`}></i>
                                    <div>{message.text}</div>
                                </div>
                            </div>
                        )}

                        <ul
                            className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24 active"
                                    id="pills-edit-profile-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-edit-profile"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-edit-profile"
                                    aria-selected="true"
                                >
                                    Edit Profile
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24"
                                    id="pills-change-passwork-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-change-passwork"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-change-passwork"
                                    aria-selected="false"
                                    tabIndex={-1}
                                >
                                    Change Password
                                </button>
                            </li>
                            
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-edit-profile"
                                role="tabpanel"
                                aria-labelledby="pills-edit-profile-tab"
                                tabIndex={0}
                            >
                                <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
                                {/* Upload Image Start */}
                                <div className="mb-24 mt-16">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                            <input
                                                type="file"
                                                id="imageUpload"
                                                accept=".png, .jpg, .jpeg"
                                                hidden
                                                onChange={readURL}
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                                            >
                                                <Icon icon="solar:camera-outline" className="icon"></Icon>
                                            </label>
                                        </div>
                                        <div className="avatar-preview">
                                            <div
                                                id="imagePreview"
                                                style={{
                                                    backgroundImage: `url(${imagePreview})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Upload Image End */}
                                <form onSubmit={updateProfile} key={formKey}>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="name"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Full Name
                                                    <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="name"
                                                    name="name"
                                                    value={profileData.name}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter Full Name"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="email"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Email <span className="text-danger-600">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control radius-8"
                                                    id="email"
                                                    name="email"
                                                    value={profileData.email}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter email address"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="phone"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="phone"
                                                    name="phone"
                                                    value={profileData.phone}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="company"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Company
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="company"
                                                    name="company"
                                                    value={profileData.company}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter company name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="address"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="address"
                                                    name="address"
                                                    value={profileData.address}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter address"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="postal_code"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="postal_code"
                                                    name="postal_code"
                                                    value={profileData.postal_code}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter postal code"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="city"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="city"
                                                    name="city"
                                                    value={profileData.city}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter city"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="country"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="country"
                                                    name="country"
                                                    value={profileData.country}
                                                    onChange={handleProfileChange}
                                                    placeholder="Enter country"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <button
                                            type="button"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                            onClick={() => getProfileData()}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                            disabled={updateLoading}
                                        >
                                            {updateLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="tab-pane fade" id="pills-change-passwork" role="tabpanel" aria-labelledby="pills-change-passwork-tab" tabIndex="0">
                                <form onSubmit={changePassword}>
                                    <div className="mb-20">
                                        <label htmlFor="new_password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            New Password <span className="text-danger-600">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={passwordVisible ? "text" : "password"}
                                                className="form-control radius-8"
                                                id="new_password"
                                                name="new_password"
                                                value={passwordData.new_password}
                                                onChange={handlePasswordChange}
                                                placeholder="Enter New Password"
                                                required
                                            />
                                            <span
                                                className={`toggle-password ${passwordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                                onClick={togglePasswordVisibility}
                                            ></span>
                                        </div>
                                    </div>

                                    <div className="mb-20">
                                        <label htmlFor="confirm_password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Confirm Password <span className="text-danger-600">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={confirmPasswordVisible ? "text" : "password"}
                                                className="form-control radius-8"
                                                id="confirm_password"
                                                name="confirm_password"
                                                value={passwordData.confirm_password}
                                                onChange={handlePasswordChange}
                                                placeholder="Confirm Password"
                                                required
                                            />
                                            <span
                                                className={`toggle-password ${confirmPasswordVisible ? "ri-eye-off-line" : "ri-eye-line"} cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                                                onClick={toggleConfirmPasswordVisibility}
                                            ></span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                                            disabled={passwordLoading}
                                        >
                                            {passwordLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Changing Password...
                                                </>
                                            ) : (
                                                'Change Password'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="pills-notification"
                                role="tabpanel"
                                aria-labelledby="pills-notification-tab"
                                tabIndex={0}
                            >
                                <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                                    <label
                                        htmlFor="companyNews"
                                        className="position-absolute w-100 h-100 start-0 top-0"
                                    />
                                    <div className="d-flex align-items-center gap-3 justify-content-between">
                                        <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                                            Company News
                                        </span>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="companyNews"
                                            checked={notificationSettings.companyNews}
                                            onChange={() => handleNotificationChange('companyNews')}
                                        />
                                    </div>
                                </div>
                                <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                                    <label
                                        htmlFor="pushNotification"
                                        className="position-absolute w-100 h-100 start-0 top-0"
                                    />
                                    <div className="d-flex align-items-center gap-3 justify-content-between">
                                        <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                                            Push Notification
                                        </span>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="pushNotification"
                                            checked={notificationSettings.pushNotification}
                                            onChange={() => handleNotificationChange('pushNotification')}
                                        />
                                    </div>
                                </div>
                                <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                                    <label
                                        htmlFor="weeklyNewsLetters"
                                        className="position-absolute w-100 h-100 start-0 top-0"
                                    />
                                    <div className="d-flex align-items-center gap-3 justify-content-between">
                                        <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                                            Weekly News Letters
                                        </span>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="weeklyNewsLetters"
                                            checked={notificationSettings.weeklyNewsLetters}
                                            onChange={() => handleNotificationChange('weeklyNewsLetters')}
                                        />
                                    </div>
                                </div>
                                <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                                    <label
                                        htmlFor="meetupsNearYou"
                                        className="position-absolute w-100 h-100 start-0 top-0"
                                    />
                                    <div className="d-flex align-items-center gap-3 justify-content-between">
                                        <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                                            Meetups Near you
                                        </span>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="meetupsNearYou"
                                            checked={notificationSettings.meetupsNearYou}
                                            onChange={() => handleNotificationChange('meetupsNearYou')}
                                        />
                                    </div>
                                </div>
                                <div className="form-switch switch-primary py-12 px-16 border radius-8 position-relative mb-16">
                                    <label
                                        htmlFor="ordersNotifications"
                                        className="position-absolute w-100 h-100 start-0 top-0"
                                    />
                                    <div className="d-flex align-items-center gap-3 justify-content-between">
                                        <span className="form-check-label line-height-1 fw-medium text-secondary-light">
                                            Orders Notifications
                                        </span>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="ordersNotifications"
                                            checked={notificationSettings.ordersNotifications}
                                            onChange={() => handleNotificationChange('ordersNotifications')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProfileLayer;