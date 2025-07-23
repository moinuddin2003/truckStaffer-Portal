import React, { useState } from "react";
import MasterLayout from "../masterLayout/MasterLayout";

const DocumentUploadPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState({
    cdl: null,
    medCard: null,
    w9: null,
    insurance: null,
    dotInspection: null,
    businessDocuments: null,
    truckPhotos: null,
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});

  const requiredDocuments = [
    {
      id: 'cdl',
      name: 'CDL & DOT Medical Card',
      description: 'Upload your Commercial Driver License and DOT Medical Card',
      required: true,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '5MB'
    },
    {
      id: 'w9',
      name: 'W9 Form',
      description: 'Upload your completed W9 tax form',
      required: true,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '5MB'
    },
    {
      id: 'insurance',
      name: 'Certificate of Insurance (COI)',
      description: 'Upload your current Certificate of Insurance',
      required: true,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '5MB'
    },
    {
      id: 'dotInspection',
      name: 'DOT Inspection Certificate',
      description: 'Upload your current DOT inspection certificate',
      required: true,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '5MB'
    },
    {
      id: 'businessDocuments',
      name: 'Business Documents',
      description: 'Upload LLC documents, EIN verification, or other business formation documents',
      required: true,
      acceptedTypes: '.pdf,.jpg,.jpeg,.png',
      maxSize: '10MB'
    },
    {
      id: 'truckPhotos',
      name: 'Truck Photos (Optional)',
      description: 'Upload photos of your truck(s) - front, side, and rear views',
      required: false,
      acceptedTypes: '.jpg,.jpeg,.png',
      maxSize: '10MB'
    }
  ];

  const handleFileUpload = (documentId, files) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    const document = requiredDocuments.find(doc => doc.id === documentId);
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const acceptedTypes = document.acceptedTypes.replace(/\./g, '').split(',');
    
    if (!acceptedTypes.includes(fileExtension)) {
      alert(`Please upload a file with one of these formats: ${document.acceptedTypes}`);
      return;
    }

    // Validate file size
    const maxSizeInBytes = parseInt(document.maxSize) * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSizeInBytes) {
      alert(`File size must be less than ${document.maxSize}`);
      return;
    }

    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [documentId]: 0 }));
    setUploadStatus(prev => ({ ...prev, [documentId]: 'uploading' }));

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev[documentId] + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setUploadStatus(prev => ({ ...prev, [documentId]: 'completed' }));
          setUploadedFiles(prev => ({ ...prev, [documentId]: file }));
        }
        return { ...prev, [documentId]: newProgress };
      });
    }, 200);
  };

  const removeFile = (documentId) => {
    setUploadedFiles(prev => ({ ...prev, [documentId]: null }));
    setUploadProgress(prev => ({ ...prev, [documentId]: 0 }));
    setUploadStatus(prev => ({ ...prev, [documentId]: '' }));
  };

  const handleSubmit = () => {
    const missingRequired = requiredDocuments
      .filter(doc => doc.required && !uploadedFiles[doc.id])
      .map(doc => doc.name);

    if (missingRequired.length > 0) {
      alert(`Please upload the following required documents:\n${missingRequired.join('\n')}`);
      return;
    }

    // Save to localStorage for now (will be replaced with API call later)
    const uploadData = {
      files: uploadedFiles,
      timestamp: new Date().toISOString(),
      status: 'pending_review'
    };
    localStorage.setItem('truckStafferDocuments', JSON.stringify(uploadData));
    alert('Documents uploaded successfully! Your application will be reviewed.');
  };

  const getUploadStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <i className="ri-loader-4-line text-primary"></i>;
      case 'completed':
        return <i className="ri-check-line text-success"></i>;
      case 'error':
        return <i className="ri-close-line text-danger"></i>;
      default:
        return <i className="ri-upload-line text-muted"></i>;
    }
  };

  const getUploadStatusText = (status) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'completed':
        return 'Uploaded';
      case 'error':
        return 'Error';
      default:
        return 'Not uploaded';
    }
  };

  return (
    <MasterLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-4">Upload Required Documents</h4>
                <p className="text-muted mb-4">
                  Please upload all required documents to complete your TruckStaffer application. 
                  All documents will be securely stored and reviewed by our team.
                </p>

                <div className="row">
                  {requiredDocuments.map((document) => (
                    <div key={document.id} className="col-md-6 mb-4">
                      <div className="card border">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="card-title mb-1">
                                {document.name}
                                {document.required && <span className="text-danger ms-1">*</span>}
                              </h6>
                              <p className="text-muted small mb-2">{document.description}</p>
                              <p className="text-muted small mb-0">
                                Accepted: {document.acceptedTypes} | Max: {document.maxSize}
                              </p>
                            </div>
                            <div className="text-end">
                              {getUploadStatusIcon(uploadStatus[document.id])}
                              <div className="small text-muted">
                                {getUploadStatusText(uploadStatus[document.id])}
                              </div>
                            </div>
                          </div>

                          {uploadedFiles[document.id] ? (
                            <div className="uploaded-file">
                              <div className="d-flex align-items-center p-3 bg-light rounded">
                                <i className="ri-file-text-line text-primary me-3 fs-4"></i>
                                <div className="flex-grow-1">
                                  <div className="fw-semibold">{uploadedFiles[document.id].name}</div>
                                  <div className="small text-muted">
                                    {(uploadedFiles[document.id].size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeFile(document.id)}
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="upload-area">
                              <div className="border-2 border-dashed border-muted rounded p-4 text-center">
                                <i className="ri-upload-cloud-line text-muted fs-1 mb-3"></i>
                                <p className="mb-2">Drag and drop your file here, or</p>
                                <label className="btn btn-outline-primary btn-sm">
                                  Choose File
                                  <input
                                    type="file"
                                    className="d-none"
                                    accept={document.acceptedTypes}
                                    onChange={(e) => handleFileUpload(document.id, e.target.files)}
                                  />
                                </label>
                              </div>
                            </div>
                          )}

                          {uploadStatus[document.id] === 'uploading' && (
                            <div className="mt-3">
                              <div className="progress" style={{ height: '6px' }}>
                                <div
                                  className="progress-bar"
                                  style={{ width: `${uploadProgress[document.id]}%` }}
                                ></div>
                              </div>
                              <div className="small text-muted mt-1">
                                {uploadProgress[document.id]}% complete
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <div className="alert alert-info">
                      <h6 className="alert-heading">
                        <i className="ri-information-line me-2"></i>
                        Document Upload Guidelines
                      </h6>
                      <ul className="mb-0">
                        <li>All documents must be clear and legible</li>
                        <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
                        <li>Maximum file size: 5MB for individual documents, 10MB for business documents</li>
                        <li>Ensure all information is current and not expired</li>
                        <li>Documents will be reviewed within 24-48 hours</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12 text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => window.history.back()}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit Documents
                    </button>
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

export default DocumentUploadPage; 