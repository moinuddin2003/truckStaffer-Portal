import React from "react";
import { Link } from "react-router-dom";
import MasterLayout from "../masterLayout/MasterLayout";

const LandingPage = () => {
  return (
    <MasterLayout>
      <div className="container-fluid">
        {/* Hero Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card bg-primary text-white">
              <div className="card-body text-center py-5">
                <h1 className="display-4 mb-4">Welcome to TruckStaffer</h1>
                <p className="lead mb-4">
                  Join our network of professional dump truck owner-operators and connect with 
                  high-quality projects across the country.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/sign-up" className="btn btn-light btn-lg">
                    <i className="ri-user-add-line me-2"></i>
                    Start Application
                  </Link>
                  <Link to="/sign-in" className="btn btn-outline-light btn-lg">
                    <i className="ri-login-box-line me-2"></i>
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="text-center mb-5">How It Works</h2>
            <div className="row">
              <div className="col-md-3 text-center mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="mb-3">
                      <i className="ri-user-add-line text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">1. Create Account</h5>
                    <p className="card-text text-muted">
                      Sign up with your email and verify your account to get started.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 text-center mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="mb-3">
                      <i className="ri-file-list-line text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">2. Complete Application</h5>
                    <p className="card-text text-muted">
                      Fill out our comprehensive questionnaire about your business and equipment.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 text-center mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="mb-3">
                      <i className="ri-upload-cloud-line text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">3. Upload Documents</h5>
                    <p className="card-text text-muted">
                      Submit required documents including CDL, insurance, and business credentials.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 text-center mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="mb-3">
                      <i className="ri-calendar-check-line text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">4. Get Approved</h5>
                    <p className="card-text text-muted">
                      Complete your interview and start receiving project opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h3 className="text-center mb-4">Why Choose TruckStaffer?</h3>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="d-flex align-items-start">
                      <i className="ri-check-circle-line text-success me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
                      <div>
                        <h6>High-Quality Projects</h6>
                        <p className="text-muted mb-0">Access to premium construction and infrastructure projects with competitive rates.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="d-flex align-items-start">
                      <i className="ri-check-circle-line text-success me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
                      <div>
                        <h6>Flexible Scheduling</h6>
                        <p className="text-muted mb-0">Choose projects that fit your schedule and preferred work radius.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="d-flex align-items-start">
                      <i className="ri-check-circle-line text-success me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
                      <div>
                        <h6>Quick Payments</h6>
                        <p className="text-muted mb-0">Reliable payment processing with weekly or bi-weekly payment options.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="d-flex align-items-start">
                      <i className="ri-check-circle-line text-success me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
                      <div>
                        <h6>24/7 Support</h6>
                        <p className="text-muted mb-0">Dedicated support team available around the clock for assistance.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="d-flex align-items-start">
                      <i className="ri-check-circle-line text-success me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
                      <div>
                        <h6>Maintenance Discounts</h6>
                        <p className="text-muted mb-0">Access to preferred pricing on parts and maintenance services.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="d-flex align-items-start">
                      <i className="ri-check-circle-line text-success me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
                      <div>
                        <h6>Growth Opportunities</h6>
                        <p className="text-muted mb-0">Expand your business with consistent work and long-term contracts.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card bg-light">
              <div className="card-body">
                <h3 className="text-center mb-4">Requirements</h3>
                <div className="row">
                  <div className="col-md-4 text-center mb-4">
                    <div className="p-3">
                      <i className="ri-id-card-line text-primary mb-3" style={{ fontSize: '2.5rem' }}></i>
                      <h6>Valid CDL</h6>
                      <p className="text-muted small">Class A or Class B Commercial Driver License</p>
                    </div>
                  </div>
                  <div className="col-md-4 text-center mb-4">
                    <div className="p-3">
                      <i className="ri-shield-check-line text-primary mb-3" style={{ fontSize: '2.5rem' }}></i>
                      <h6>Insurance Coverage</h6>
                      <p className="text-muted small">Minimum $1M liability insurance with cargo coverage</p>
                    </div>
                  </div>
                  <div className="col-md-4 text-center mb-4">
                    <div className="p-3">
                      <i className="ri-truck-line text-primary mb-3" style={{ fontSize: '2.5rem' }}></i>
                      <h6>Dump Truck</h6>
                      <p className="text-muted small">Own or lease a dump truck with current DOT inspection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="row">
          <div className="col-12">
            <div className="card bg-primary text-white text-center">
              <div className="card-body py-5">
                <h3 className="mb-3">Ready to Get Started?</h3>
                <p className="lead mb-4">
                  Join hundreds of successful owner-operators who trust TruckStaffer for their business growth.
                </p>
                <Link to="/sign-up" className="btn btn-light btn-lg">
                  <i className="ri-rocket-line me-2"></i>
                  Start Your Application Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default LandingPage; 