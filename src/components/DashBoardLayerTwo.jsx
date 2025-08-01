import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useNavigate } from 'react-router-dom'

const DashBoardLayerTwo = () => {
  const [applicationProgress, setApplicationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCandidateDashboard();
  }, []);

  const loadCandidateDashboard = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    try {
      // Load application progress
      const savedProgress = localStorage.getItem("applicationProgress");
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCurrentStep(progress.currentStep || 1);
        setApplicationProgress(((progress.currentStep - 1) / 7) * 100);
      }

      // Load messages from API
      const response = await fetch('https://admin.truckstaffer.com/api/candidate/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepName = (step) => {
    const steps = {
      1: "Company Information",
      2: "Equipment Details", 
      3: "CDL & Credentials",
      4: "Operational Capacity",
      5: "Insurance & Documents",
      6: "Background & Compliance",
      7: "Additional Information"
    };
    return steps[step] || "Unknown Step";
  };

  const getStepStatus = (step) => {
    if (step < currentStep) return "completed";
    if (step === currentStep) return "current";
    return "pending";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="row gy-4">
      {/* Welcome Section */}
      <div className="col-12">
        <div className="card h-100 p-0 radius-12">
          <div className="card-body p-24">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h4 className="mb-2">Welcome back, {localStorage.getItem('name') || 'Candidate'}!</h4>
                <p className="text-secondary-light mb-0">Track your application progress and stay updated with important messages.</p>
              </div>
              <div className="text-end">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/application')}
                >
                  Continue Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Progress */}
      <div className="col-lg-8">
        <div className="card h-100 p-0 radius-12">
          <div className="card-header border-bottom bg-base py-16 px-24">
            <h6 className="text-lg fw-semibold mb-0">Application Progress</h6>
          </div>
          <div className="card-body p-24">
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">Overall Progress</span>
                <span className="text-primary fw-bold">{Math.round(applicationProgress)}%</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div 
                  className="progress-bar bg-primary" 
                  style={{ width: `${applicationProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="row">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <div key={step} className="col-md-6 mb-3">
                  <div className={`d-flex align-items-center p-3 rounded ${getStepStatus(step) === 'completed' ? 'bg-success-light' : getStepStatus(step) === 'current' ? 'bg-primary-light' : 'bg-light'}`}>
                    <div className={`w-32-px h-32-px rounded-circle d-flex align-items-center justify-content-center me-3 ${
                      getStepStatus(step) === 'completed' ? 'bg-success text-white' : 
                      getStepStatus(step) === 'current' ? 'bg-primary text-white' : 
                      'bg-secondary text-white'
                    }`}>
                      {getStepStatus(step) === 'completed' ? (
                        <Icon icon="ri:check-line" />
                      ) : (
                        <span className="fw-bold">{step}</span>
                      )}
                    </div>
                    <div>
                      <div className="fw-semibold text-sm">{getStepName(step)}</div>
                      <div className="text-secondary-light text-xs">
                        {getStepStatus(step) === 'completed' ? 'Completed' : 
                         getStepStatus(step) === 'current' ? 'In Progress' : 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages & Updates */}
      <div className="col-lg-4">
        <div className="card h-100 p-0 radius-12">
          <div className="card-header border-bottom bg-base py-16 px-24">
            <h6 className="text-lg fw-semibold mb-0">Messages & Updates</h6>
          </div>
          <div className="card-body p-24">
            {messages.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {messages.slice(0, 5).map((message, index) => (
                  <div key={index} className="border-bottom pb-3">
                    <div className="d-flex align-items-start gap-3">
                      <div className="w-40-px h-40-px bg-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                        <Icon icon="ri:message-3-line" className="text-white" />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-sm">{message.title}</div>
                        <div className="text-secondary-light text-xs mb-1">{message.date}</div>
                        <div className="text-sm">{message.content}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Icon icon="ri:message-3-line" className="text-secondary-light mb-3" style={{ fontSize: '3rem' }} />
                <p className="text-secondary-light mb-0">No messages yet</p>
                <p className="text-secondary-light text-sm">We'll notify you here when there are updates about your application.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="col-12">
        <div className="card h-100 p-0 radius-12">
          <div className="card-header border-bottom bg-base py-16 px-24">
            <h6 className="text-lg fw-semibold mb-0">Quick Actions</h6>
          </div>
          <div className="card-body p-24">
            <div className="row g-3">
              <div className="col-md-3">
                <button 
                  className="btn btn-outline-primary w-100 p-3"
                  onClick={() => navigate('/application')}
                >
                  <Icon icon="ri:edit-line" className="mb-2" style={{ fontSize: '1.5rem' }} />
                  <div className="fw-semibold">Continue Application</div>
                  <div className="text-secondary-light text-xs">Resume where you left off</div>
                </button>
              </div>
              <div className="col-md-3">
                <button 
                  className="btn btn-outline-success w-100 p-3"
                  onClick={() => navigate('/application-summary')}
                >
                  <Icon icon="ri:file-list-line" className="mb-2" style={{ fontSize: '1.5rem' }} />
                  <div className="fw-semibold">View Summary</div>
                  <div className="text-secondary-light text-xs">Review your application</div>
                </button>
              </div>
              <div className="col-md-3">
                <button 
                  className="btn btn-outline-info w-100 p-3"
                  onClick={() => navigate('/my-profile')}
                >
                  <Icon icon="ri:user-settings-line" className="mb-2" style={{ fontSize: '1.5rem' }} />
                  <div className="fw-semibold">Update Profile</div>
                  <div className="text-secondary-light text-xs">Manage your information</div>
                </button>
              </div>
              <div className="col-md-3">
                <button 
                  className="btn btn-outline-warning w-100 p-3"
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/sign-in');
                  }}
                >
                  <Icon icon="ri:logout-box-line" className="mb-2" style={{ fontSize: '1.5rem' }} />
                  <div className="fw-semibold">Sign Out</div>
                  <div className="text-secondary-light text-xs">Logout from portal</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashBoardLayerTwo