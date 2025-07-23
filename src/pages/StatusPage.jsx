import React, { useState } from "react";
import MasterLayout from "../masterLayout/MasterLayout";

const StatusPage = () => {
  const [applicationStatus] = useState({
    currentStep: 'questionnaire_completed',
    overallStatus: 'in_progress',
    progress: 75,
    lastUpdated: '2024-01-22T10:30:00Z'
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Application Received',
      message: 'Your TruckStaffer application has been received and is under review.',
      timestamp: '2024-01-20T14:30:00Z',
      read: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Documents Uploaded',
      message: 'All required documents have been successfully uploaded.',
      timestamp: '2024-01-21T09:15:00Z',
      read: true
    },
    {
      id: 3,
      type: 'warning',
      title: 'Document Review Required',
      message: 'Your insurance certificate needs to be updated. Please upload the current version.',
      timestamp: '2024-01-22T10:30:00Z',
      read: false
    },
    {
      id: 4,
      type: 'info',
      title: 'Interview Scheduled',
      message: 'Your interview has been scheduled for January 25th, 2024 at 2:00 PM.',
      timestamp: '2024-01-22T11:00:00Z',
      read: false
    }
  ]);

  const [applicationData] = useState({
    personalInfo: {
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      applicationDate: '2024-01-15'
    },
    documents: {
      cdl: { status: 'verified', uploaded: '2024-01-20' },
      w9: { status: 'verified', uploaded: '2024-01-20' },
      insurance: { status: 'pending_review', uploaded: '2024-01-21' },
      dotInspection: { status: 'verified', uploaded: '2024-01-20' },
      businessDocuments: { status: 'verified', uploaded: '2024-01-20' }
    },
    interview: {
      scheduled: true,
      date: '2024-01-25',
      time: '2:00 PM',
      type: 'Video Call',
      link: 'https://meet.google.com/abc-defg-hij'
    }
  });

  const applicationSteps = [
    {
      id: 'profile_created',
      title: 'Profile Created',
      description: 'Account created and email verified',
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: 'questionnaire_completed',
      title: 'Questionnaire Completed',
      description: 'Application questionnaire submitted',
      status: 'completed',
      date: '2024-01-18'
    },
    {
      id: 'documents_uploaded',
      title: 'Documents Uploaded',
      description: 'Required documents submitted',
      status: 'completed',
      date: '2024-01-20'
    },
    {
      id: 'documents_reviewed',
      title: 'Documents Under Review',
      description: 'Documents being reviewed by our team',
      status: 'in_progress',
      date: '2024-01-22'
    },
    {
      id: 'interview_scheduled',
      title: 'Interview Scheduled',
      description: 'Interview scheduled with TruckStaffer team',
      status: 'upcoming',
      date: '2024-01-25'
    },
    {
      id: 'final_decision',
      title: 'Final Decision',
      description: 'Application approved or rejected',
      status: 'pending',
      date: null
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <i className="ri-check-line text-success"></i>;
      case 'in_progress':
        return <i className="ri-loader-4-line text-primary"></i>;
      case 'upcoming':
        return <i className="ri-time-line text-warning"></i>;
      case 'pending':
        return <i className="ri-circle-line text-muted"></i>;
      default:
        return <i className="ri-circle-line text-muted"></i>;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { class: 'bg-success', text: 'Completed' },
      in_progress: { class: 'bg-primary', text: 'In Progress' },
      upcoming: { class: 'bg-warning', text: 'Upcoming' },
      pending: { class: 'bg-secondary', text: 'Pending' },
      verified: { class: 'bg-success', text: 'Verified' },
      pending_review: { class: 'bg-warning', text: 'Under Review' },
      missing: { class: 'bg-danger', text: 'Missing' }
    };

    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <i className="ri-check-line text-success"></i>;
      case 'warning':
        return <i className="ri-error-warning-line text-warning"></i>;
      case 'error':
        return <i className="ri-close-line text-danger"></i>;
      default:
        return <i className="ri-information-line text-info"></i>;
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <MasterLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">Application Status</h4>
                <p className="text-muted mb-0">Track your TruckStaffer application progress</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="ri-download-line me-2"></i>
                  Download Application
                </button>
                <button className="btn btn-primary">
                  <i className="ri-edit-line me-2"></i>
                  Update Information
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Application Progress */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Application Progress</h5>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-sm">Overall Progress: {applicationStatus.progress}%</span>
                    <span className="text-sm">Last Updated: {new Date(applicationStatus.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      style={{ width: `${applicationStatus.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Application Steps */}
                <div className="application-steps">
                  {applicationSteps.map((step, index) => (
                    <div key={step.id} className="d-flex align-items-start mb-4">
                      <div className="me-3 mt-1">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="mb-0">{step.title}</h6>
                          {step.date && (
                            <small className="text-muted">{step.date}</small>
                          )}
                        </div>
                        <p className="text-muted small mb-0">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Document Status */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Document Status</h5>
                <div className="row">
                  {Object.entries(applicationData.documents).map(([docType, docInfo]) => (
                    <div key={docType} className="col-md-6 mb-3">
                      <div className="d-flex align-items-center p-3 border rounded">
                        <div className="me-3">
                          <i className="ri-file-text-line text-primary fs-4"></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold text-capitalize">
                            {docType.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="small text-muted">
                            Uploaded: {docInfo.uploaded}
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(docInfo.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interview Information */}
            {applicationData.interview.scheduled && (
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">Interview Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Date & Time</label>
                        <p className="mb-0">{applicationData.interview.date} at {applicationData.interview.time}</p>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Type</label>
                        <p className="mb-0">{applicationData.interview.type}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Meeting Link</label>
                        <a href={applicationData.interview.link} className="btn btn-outline-primary btn-sm" target="_blank" rel="noopener noreferrer">
                          Join Meeting
                        </a>
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Preparation</label>
                        <p className="mb-0 small">Please have your documents ready and be prepared to discuss your experience.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Sidebar */}
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">Notifications</h5>
                  {unreadCount > 0 && (
                    <span className="badge bg-danger">{unreadCount}</span>
                  )}
                </div>
                
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item p-3 border rounded mb-3 ${!notification.read ? 'bg-light' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-start">
                        <div className="me-3 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0">{notification.title}</h6>
                            {!notification.read && (
                              <span className="badge bg-primary">New</span>
                            )}
                          </div>
                          <p className="text-muted small mb-1">{notification.message}</p>
                          <small className="text-muted">
                            {new Date(notification.timestamp).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {notifications.length === 0 && (
                  <div className="text-center py-4">
                    <i className="ri-notification-line fs-1 text-muted mb-3"></i>
                    <p className="text-muted mb-0">No notifications</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">Quick Actions</h5>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary">
                    <i className="ri-upload-line me-2"></i>
                    Upload Additional Documents
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="ri-calendar-line me-2"></i>
                    Reschedule Interview
                  </button>
                  <button className="btn btn-outline-info">
                    <i className="ri-question-line me-2"></i>
                    Contact Support
                  </button>
                  <button className="btn btn-outline-success">
                    <i className="ri-download-line me-2"></i>
                    Download Application Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Next Steps</h5>
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center p-3">
                      <i className="ri-file-check-line text-primary fs-1 mb-3"></i>
                      <h6>Document Review</h6>
                      <p className="text-muted small">Our team is reviewing your uploaded documents</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3">
                      <i className="ri-calendar-check-line text-warning fs-1 mb-3"></i>
                      <h6>Interview Preparation</h6>
                      <p className="text-muted small">Prepare for your scheduled interview</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3">
                      <i className="ri-check-double-line text-success fs-1 mb-3"></i>
                      <h6>Final Decision</h6>
                      <p className="text-muted small">Receive approval and onboarding instructions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default StatusPage; 