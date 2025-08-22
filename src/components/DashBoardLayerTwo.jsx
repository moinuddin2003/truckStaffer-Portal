import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";

// Use the orange primary color from CSS
const PRIMARY_COLOR = "#F0831C"; // --primary-600

const DashBoardLayerTwo = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(loadDashboardData, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://admin.truckstaffer.com/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
        setError(null);
      } else {
        throw new Error(result.message || "Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStepName = (stepKey) => {
    const stepNames = {
      step_1: "Company Information",
      step_2: "Equipment Details",
      step_3: "CDL & Credentials",
      step_4: "Operational Capacity",
      step_5: "Insurance & Documents",
      step_6: "Background & Compliance",
      step_7: "Additional Information",
      // finalize: "Finalize Application",
    };
    return stepNames[stepKey] || "Unknown Step";
  };

  const getStepStatus = (stepKey) => {
    if (!dashboardData?.steps) return "not_started";
    return dashboardData.steps[stepKey] || "not_started";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <Icon icon="ri:check-line" />;
      case "in_progress":
        return <Icon icon="ri:time-line" />;
      case "not_started":
        return <Icon icon="ri:circle-line" />;
      default:
        return <Icon icon="ri:question-line" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return PRIMARY_COLOR;
      case "in_progress":
        return PRIMARY_COLOR;
      case "not_started":
        return "#888"; // A neutral color for not started
      default:
        return "#888";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "not_started":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Not started";

    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const getCurrentStepNumber = () => {
    if (!dashboardData?.summary?.next_step) return 1;

    const stepMap = {
      step_1: 1,
      step_2: 2,
      step_3: 3,
      step_4: 4,
      step_5: 5,
      step_6: 6,
      step_7: 7,
      // finalize: 8,
    };

    return stepMap[dashboardData.summary.next_step] || 1;
  };

  const isApplicationComplete = () => {
    return (
      dashboardData?.summary?.percent === 100 ||
      (dashboardData?.summary?.completed_steps === 7 && dashboardData?.summary?.total_steps === 7)
    )
  }

  const getApplicationId = () => {
    return dashboardData?.application_id || localStorage.getItem("applicationId")
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div
          className="spinner-border"
          style={{ color: PRIMARY_COLOR }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-12">
        <div className="alert alert-danger" role="alert">
          <h6 className="alert-heading">Error Loading Dashboard</h6>
          <p className="mb-0">{error}</p>
          <button
            className="btn btn-outline-danger btn-sm mt-2"
            onClick={loadDashboardData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="col-12">
        <div className="alert alert-warning" role="alert">
          <h6 className="alert-heading">No Data Available</h6>
          <p className="mb-0">Unable to load dashboard information.</p>
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
                <h4 className="mb-2">
                  Welcome back, {localStorage.getItem("name") || "Candidate"}!
                </h4>
                <p className="text-secondary-light mb-0">
                  Track your application progress and stay updated with
                  important messages.
                  {dashboardData.summary && (
                    <span
                      className="ms-2 fw-semibold"
                      style={{ color: PRIMARY_COLOR }}
                    >
                      {dashboardData.summary.completed_steps} of{" "}
                      {dashboardData.summary.total_steps} steps completed
                    </span>
                  )}
                </p>
              </div>
              <div className="text-end">
                {isApplicationComplete() ? (
                  <div className="text-center">
                    <div className="mb-2">
                      <span className="--primary-600 fw-bold">
                        <Icon icon="ri:check-circle-line" className="me-1" />
                        Application Complete!
                      </span>
                    </div>
                    <div
                      className="px-3 py-2 rounded"
                      style={{
                        backgroundColor: `${PRIMARY_COLOR}20`,
                        border: `1px solid ${PRIMARY_COLOR}`,
                      }}
                    >
                      <small className="text-muted d-block">Your Application ID</small>
                      <strong style={{ color: PRIMARY_COLOR }}>TS-{getApplicationId() || "PENDING"}</strong>
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn"
                    style={{
                      backgroundColor: PRIMARY_COLOR,
                      borderColor: PRIMARY_COLOR,
                      color: "white",
                    }}
                    onClick={() => navigate("/application")}
                  >
                    {dashboardData.summary?.next_step === "step_7" ? "Finalize Application" : "Continue Application"}
                  </button>
                )}
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
            {dashboardData.summary && (
              <small className="text-secondary-light">
                Next: {getStepName(dashboardData.summary.next_step)}
              </small>
            )}
          </div>
          <div className="card-body p-24">
            {/* Overall Progress Bar */}
            {dashboardData.summary && (
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold">Overall Progress</span>
                  <span className="fw-bold" style={{ color: PRIMARY_COLOR }}>
                    {dashboardData.summary.percent}%
                  </span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${dashboardData.summary.percent}%`,
                      backgroundColor: PRIMARY_COLOR,
                    }}
                    role="progressbar"
                    aria-valuenow={dashboardData.summary.percent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            )}

            {/* Steps Grid */}
            <div className="row">
              {Object.keys(dashboardData.steps || {})
                .filter((stepKey) => stepKey.startsWith("step_") && Number.parseInt(stepKey.replace("step_", "")) <= 7)
                .map((stepKey) => {
                  const status = getStepStatus(stepKey)
                  const isCurrentStep = dashboardData.summary?.next_step === stepKey && !isApplicationComplete()

                return (
                  <div key={stepKey} className="col-md-6 mb-3">
                    <div
                      className="d-flex align-items-center p-3 rounded border"
                      style={{
                        borderColor: isCurrentStep
                          ? PRIMARY_COLOR
                          : status === "completed"
                          ? PRIMARY_COLOR
                          : "#dee2e6",
                        backgroundColor: isCurrentStep
                          ? `${PRIMARY_COLOR}20`
                          : status === "completed"
                          ? `${PRIMARY_COLOR}10`
                          : "#f8f9fa",
                      }}
                    >
                      <div
                        className="w-32-px h-32-px rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          backgroundColor:
                            status === "completed" || status === "in_progress"
                              ? PRIMARY_COLOR
                              : "#6c757d",
                          color: "white",
                        }}
                      >
                        {getStatusIcon(status)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-sm">
                          {getStepName(stepKey)}
                          {isCurrentStep && (
                            <span
                              className="badge ms-2"
                              style={{
                                backgroundColor: PRIMARY_COLOR,
                                color: "white",
                              }}
                            >
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-secondary-light text-xs">
                          {getStatusText(status)}
                        </div>
                        {/* Timestamp */}
                        {dashboardData.timestamps &&
                          dashboardData.timestamps[stepKey] && (
                            <div className="text-secondary-light text-xs mt-1">
                              {formatTimestamp(
                                dashboardData.timestamps[stepKey]
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Messages & Updates */}
      <div className="col-lg-4">
        <div className="card h-100 p-0 radius-12">
          <div className="card-header border-bottom bg-base py-16 px-24">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-lg fw-semibold mb-0">Messages & Updates</h6>
              <button
                className="btn btn-sm btn-outline"
                style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                onClick={loadDashboardData}
                title="Refresh messages"
              >
                <Icon icon="ri:refresh-line" />
              </button>
            </div>
          </div>
          <div className="card-body p-24">
            {dashboardData.messages && dashboardData.messages.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {dashboardData.messages.slice(0, 5).map((message) => (
                  <div key={message.id} className="border-bottom pb-3">
                    <div className="d-flex align-items-start gap-3">
                      <div
                        className="w-40-px h-40-px rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                      >
                        <Icon icon="ri:message-3-line" className="text-white" />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-sm">
                          Message #{message.id}
                        </div>
                        <div className="text-secondary-light text-xs mb-1">
                          {formatTimestamp(message.created_at)}
                        </div>
                        <div className="text-sm">{message.msg}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {dashboardData.messages.length > 5 && (
                  <div className="text-center pt-2">
                    <small className="text-secondary-light">
                      Showing 5 of {dashboardData.messages.length} messages
                    </small>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Icon
                  icon="ri:message-3-line"
                  className="text-secondary-light mb-3"
                  style={{ fontSize: "3rem" }}
                />
                <p className="text-secondary-light mb-0">No messages yet</p>
                <p className="text-secondary-light text-sm">
                  We'll notify you here when there are updates about your
                  application.
                </p>
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
              <div className="col-md-4">
                <button
                  className="btn w-100 p-3"
                  style={{
                    border: `1px solid ${PRIMARY_COLOR}`,
                    color: PRIMARY_COLOR,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = PRIMARY_COLOR;
                  }}
                  onClick={() => navigate("/application")}
                >
                  <Icon icon="ri:edit-line" className="mb-2" style={{ fontSize: "1.5rem" }} />
                  <div className="fw-semibold">
                    {isApplicationComplete()
                      ? "View Application"
                      : dashboardData.summary?.next_step === "step_7"
                        ? "Finalize Application"
                        : "Continue Application"}
                  </div>
                  <div className="text-secondary-light text-xs">
                    {isApplicationComplete()
                      ? "View your completed application"
                      : dashboardData.summary?.next_step === "step_7"
                        ? "Complete your application"
                        : "Resume where you left off"}
                  </div>
                </button>
              </div>

              <div className="col-md-4">
                <button
                  className="btn w-100 p-3"
                  style={{
                    border: `1px solid ${PRIMARY_COLOR}`,
                    color: PRIMARY_COLOR,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = PRIMARY_COLOR;
                  }}
                  onClick={() => navigate("/my-profile")}
                >
                  <Icon
                    icon="ri:user-settings-line"
                    className="mb-2"
                    style={{ fontSize: "1.5rem" }}
                  />
                  <div className="fw-semibold">Update Profile</div>
                  <div className="text-secondary-light text-xs">
                    Manage your information
                  </div>
                </button>
              </div>

              <div className="col-md-4">
                <button
                  className="btn w-100 p-3"
                  style={{
                    border: `1px solid ${PRIMARY_COLOR}`,
                    color: PRIMARY_COLOR,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = PRIMARY_COLOR;
                  }}
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/sign-in");
                  }}
                >
                  <Icon
                    icon="ri:logout-box-line"
                    className="mb-2"
                    style={{ fontSize: "1.5rem" }}
                  />
                  <div className="fw-semibold">Sign Out</div>
                  <div className="text-secondary-light text-xs">
                    Logout from portal
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashBoardLayerTwo;
