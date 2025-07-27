import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ApplicationSummary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applicationId, setApplicationId] = useState(null);
  const [finalized, setFinalized] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    // Get application ID from localStorage or location state
    const savedProgress = localStorage.getItem("applicationProgress");
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        const appId = progress.applicationId;
        setApplicationId(appId);
        
        // Show summary content immediately since user completed all steps
        setShowSummary(true);
        
        // If we have an application ID, try to finalize the application
        if (appId) {
          finalizeApplication(appId);
        }
      } catch (e) {
        console.error("Error loading application ID:", e);
        // Still show summary even if there's an error loading progress
        setShowSummary(true);
      }
    } else {
      // If no saved progress, still show summary (user might have completed steps)
      setShowSummary(true);
    }
  }, [navigate]);

  const finalizeApplication = async (appId) => {
    const token = localStorage.getItem("token");
    if (!token || !appId) {
      setError("Authentication or application ID not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`https://admin.truckstaffer.com/api/application/${appId}/finalize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && (data.status || data.success)) {
        setFinalized(true);
        // Clear the application progress from localStorage
        localStorage.removeItem("applicationProgress");
      } else {
        setError(data.message || "Failed to finalize application");
        // Don't block the UI - still show summary content
      }
    } catch (err) {
      console.error("Error finalizing application:", err);
      setError("An error occurred while finalizing your application");
      // Don't block the UI - still show summary content
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, name: "Contact Info" },
    { num: 2, name: "Equipment" },
    { num: 3, name: "CDL & Credentials" },
    { num: 4, name: "Operations" },
    { num: 5, name: "Insurance" },
    { num: 6, name: "Screening" },
    { num: 7, name: "Additional" }
  ];

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="row justify-content-center w-100">
        <div className="col-lg-10 col-xl-8">
          {/* Task Progress Header */}
          <div className="mb-4 text-center">
            <h5 className="text-dark fw-bold mb-3">Task Progress</h5>
            
            {/* Progress Bar */}
            <div className="d-flex align-items-center justify-content-center mb-4">
              <div className="d-flex align-items-center" style={{ maxWidth: '800px', width: '100%' }}>
                {steps.map((step, index) => (
                  <React.Fragment key={step.num}>
                    {/* Step Circle */}
                    <div className="d-flex flex-column align-items-center">
                      <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mb-2"
                           style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                        <i className="ri-check-line"></i>
                      </div>
                      <span className="text-success fw-semibold small">{step.name}</span>
                    </div>
                    
                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div className="flex-grow-1 mx-2" style={{ height: '2px', backgroundColor: '#28a745' }}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Task Details Section */}
          <div className="mb-4 text-center">
            <h5 className="text-dark fw-bold mb-3">Task Details</h5>
            
            {/* Application Submitted Successfully */}
            <div className="text-center mb-4">
              <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                   style={{ width: '60px', height: '60px' }}>
                <i className="ri-check-line text-success" style={{ fontSize: '1.8rem' }}></i>
              </div>
              <h6 className="text-success fw-bold mb-2">Application Submitted Successfully!</h6>
              <p className="text-muted mb-0 small">Thank you for completing your owner-operator application</p>
            </div>

            {error && (
              <div className="alert alert-warning border-0 shadow-sm mb-4 text-center" role="alert">
                <div className="d-flex align-items-center justify-content-center">
                  <i className="ri-alert-line me-3"></i>
                  <div>
                    <strong>Note:</strong> {error} - Your application has been submitted and is being processed.
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center mb-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted small">Finalizing your application...</p>
              </div>
            )}

            {showSummary && (
              <>
                {/* Application ID */}
                <div className="bg-light p-4 rounded-3 mb-4 text-center">
                  <h6 className="text-muted mb-2 small">Your Application ID</h6>
                  <h4 className="text-primary fw-bold mb-0">
                    {applicationId ? `TS-${applicationId}` : 'TS-Pending'}
                  </h4>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {showSummary && (
            <div className="d-flex justify-content-center">
              <button 
                type="button" 
                className="btn btn-success px-4 me-3"
                onClick={() => navigate('/')}
              >
                <i className="ri-home-line me-2"></i>
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationSummary; 