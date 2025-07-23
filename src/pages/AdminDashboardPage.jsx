import React, { useState, useEffect } from "react";
import MasterLayout from "../masterLayout/MasterLayout";

const AdminDashboardPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    cdlClass: '',
    equipmentType: '',
    insuranceStatus: '',
    searchTerm: ''
  });
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Mock data - will be replaced with API calls
  useEffect(() => {
    const mockCandidates = [
      {
        id: 1,
        fullName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        status: 'pending',
        cdlClass: 'Class A',
        equipmentType: 'Tri-Axle',
        insuranceStatus: 'verified',
        applicationDate: '2024-01-15',
        lastUpdated: '2024-01-20',
        documents: {
          cdl: true,
          w9: true,
          insurance: false,
          dotInspection: true
        },
        tags: ['Ready to Deploy', 'Experienced'],
        notes: 'Experienced driver with 8 years in dump hauling'
      },
      {
        id: 2,
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 234-5678',
        status: 'approved',
        cdlClass: 'Class B',
        equipmentType: 'Quad-Axle',
        insuranceStatus: 'verified',
        applicationDate: '2024-01-10',
        lastUpdated: '2024-01-18',
        documents: {
          cdl: true,
          w9: true,
          insurance: true,
          dotInspection: true
        },
        tags: ['Approved', 'High Priority'],
        notes: 'Excellent safety record, ready for immediate deployment'
      },
      {
        id: 3,
        fullName: 'Mike Davis',
        email: 'mike.davis@email.com',
        phone: '(555) 345-6789',
        status: 'rejected',
        cdlClass: 'Class A',
        equipmentType: 'Tandem',
        insuranceStatus: 'missing',
        applicationDate: '2024-01-12',
        lastUpdated: '2024-01-19',
        documents: {
          cdl: true,
          w9: false,
          insurance: false,
          dotInspection: false
        },
        tags: ['Rejected', 'Missing Documents'],
        notes: 'Multiple document issues, needs follow-up'
      },
      {
        id: 4,
        fullName: 'Lisa Wilson',
        email: 'lisa.wilson@email.com',
        phone: '(555) 456-7890',
        status: 'interview_scheduled',
        cdlClass: 'Class A',
        equipmentType: 'Tri-Axle',
        insuranceStatus: 'pending',
        applicationDate: '2024-01-14',
        lastUpdated: '2024-01-21',
        documents: {
          cdl: true,
          w9: true,
          insurance: true,
          dotInspection: true
        },
        tags: ['Interview Scheduled', 'Promising'],
        notes: 'Interview scheduled for Jan 25th, 2:00 PM'
      },
      {
        id: 5,
        fullName: 'Robert Brown',
        email: 'robert.brown@email.com',
        phone: '(555) 567-8901',
        status: 'pending',
        cdlClass: 'Class B',
        equipmentType: 'Quad-Axle',
        insuranceStatus: 'verified',
        applicationDate: '2024-01-16',
        lastUpdated: '2024-01-22',
        documents: {
          cdl: true,
          w9: true,
          insurance: true,
          dotInspection: false
        },
        tags: ['Needs Follow-Up', 'Almost Complete'],
        notes: 'Waiting for DOT inspection certificate'
      }
    ];

    setCandidates(mockCandidates);
    setFilteredCandidates(mockCandidates);
  }, []);

  // Filter candidates based on current filters
  useEffect(() => {
    let filtered = candidates;

    if (filters.status) {
      filtered = filtered.filter(candidate => candidate.status === filters.status);
    }

    if (filters.cdlClass) {
      filtered = filtered.filter(candidate => candidate.cdlClass === filters.cdlClass);
    }

    if (filters.equipmentType) {
      filtered = filtered.filter(candidate => candidate.equipmentType === filters.equipmentType);
    }

    if (filters.insuranceStatus) {
      filtered = filtered.filter(candidate => candidate.insuranceStatus === filters.insuranceStatus);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(candidate => 
        candidate.fullName.toLowerCase().includes(searchLower) ||
        candidate.email.toLowerCase().includes(searchLower) ||
        candidate.phone.includes(searchLower)
      );
    }

    setFilteredCandidates(filtered);
  }, [candidates, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      } else {
        return [...prev, candidateId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Pending' },
      approved: { class: 'bg-success', text: 'Approved' },
      rejected: { class: 'bg-danger', text: 'Rejected' },
      interview_scheduled: { class: 'bg-info', text: 'Interview Scheduled' }
    };

    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getDocumentStatus = (documents) => {
    const total = Object.keys(documents).length;
    const completed = Object.values(documents).filter(Boolean).length;
    return `${completed}/${total}`;
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'CDL Class', 'Equipment Type', 'Insurance Status', 'Application Date'];
    const csvData = filteredCandidates.map(candidate => [
      candidate.fullName,
      candidate.email,
      candidate.phone,
      candidate.status,
      candidate.cdlClass,
      candidate.equipmentType,
      candidate.insuranceStatus,
      candidate.applicationDate
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truckstaffer-candidates-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const total = candidates.length;
    const pending = candidates.filter(c => c.status === 'pending').length;
    const approved = candidates.filter(c => c.status === 'approved').length;
    const rejected = candidates.filter(c => c.status === 'rejected').length;
    const interviewScheduled = candidates.filter(c => c.status === 'interview_scheduled').length;

    return { total, pending, approved, rejected, interviewScheduled };
  };

  const stats = getStats();

  return (
    <MasterLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">Candidate Management Dashboard</h4>
                <p className="text-muted mb-0">Manage and track TruckStaffer applications</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary" onClick={exportToCSV}>
                  <i className="ri-download-line me-2"></i>
                  Export CSV
                </button>
                <button className="btn btn-primary">
                  <i className="ri-add-line me-2"></i>
                  Add Candidate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-2">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h3 className="mb-0">{stats.total}</h3>
                    <p className="mb-0 small">Total Candidates</p>
                  </div>
                  <i className="ri-user-line fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h3 className="mb-0">{stats.pending}</h3>
                    <p className="mb-0 small">Pending Review</p>
                  </div>
                  <i className="ri-time-line fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h3 className="mb-0">{stats.approved}</h3>
                    <p className="mb-0 small">Approved</p>
                  </div>
                  <i className="ri-check-line fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h3 className="mb-0">{stats.interviewScheduled}</h3>
                    <p className="mb-0 small">Interview Scheduled</p>
                  </div>
                  <i className="ri-calendar-line fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card bg-danger text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h3 className="mb-0">{stats.rejected}</h3>
                    <p className="mb-0 small">Rejected</p>
                  </div>
                  <i className="ri-close-line fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card bg-secondary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h3 className="mb-0">{filteredCandidates.length}</h3>
                    <p className="mb-0 small">Filtered Results</p>
                  </div>
                  <i className="ri-filter-line fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title mb-3">Filters</h6>
                <div className="row">
                  <div className="col-md-2">
                    <label className="form-label">Search</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name, email, phone..."
                      value={filters.searchTerm}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control form-select"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="interview_scheduled">Interview Scheduled</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">CDL Class</label>
                    <select
                      className="form-control form-select"
                      value={filters.cdlClass}
                      onChange={(e) => handleFilterChange('cdlClass', e.target.value)}
                    >
                      <option value="">All Classes</option>
                      <option value="Class A">Class A</option>
                      <option value="Class B">Class B</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Equipment Type</label>
                    <select
                      className="form-control form-select"
                      value={filters.equipmentType}
                      onChange={(e) => handleFilterChange('equipmentType', e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="Tri-Axle">Tri-Axle</option>
                      <option value="Quad-Axle">Quad-Axle</option>
                      <option value="Tandem">Tandem</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Insurance Status</label>
                    <select
                      className="form-control form-select"
                      value={filters.insuranceStatus}
                      onChange={(e) => handleFilterChange('insuranceStatus', e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="missing">Missing</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">View Mode</label>
                    <div className="btn-group w-100">
                      <button
                        type="button"
                        className={`btn btn-outline-primary ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                      >
                        <i className="ri-list-check"></i>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-outline-primary ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <i className="ri-grid-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Candidates List/Grid */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="card-title mb-0">
                    Candidates ({filteredCandidates.length})
                  </h6>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleSelectAll}
                    >
                      {selectedCandidates.length === filteredCandidates.length ? 'Deselect All' : 'Select All'}
                    </button>
                    {selectedCandidates.length > 0 && (
                      <button className="btn btn-sm btn-primary">
                        Bulk Actions ({selectedCandidates.length})
                      </button>
                    )}
                  </div>
                </div>

                {viewMode === 'list' ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedCandidates.length === filteredCandidates.length}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th>Name</th>
                          <th>Contact</th>
                          <th>Status</th>
                          <th>CDL Class</th>
                          <th>Equipment</th>
                          <th>Documents</th>
                          <th>Tags</th>
                          <th>Last Updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCandidates.map((candidate) => (
                          <tr key={candidate.id}>
                            <td>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedCandidates.includes(candidate.id)}
                                onChange={() => handleSelectCandidate(candidate.id)}
                              />
                            </td>
                            <td>
                              <div>
                                <div className="fw-semibold">{candidate.fullName}</div>
                                <div className="small text-muted">{candidate.email}</div>
                              </div>
                            </td>
                            <td>{candidate.phone}</td>
                            <td>{getStatusBadge(candidate.status)}</td>
                            <td>{candidate.cdlClass}</td>
                            <td>{candidate.equipmentType}</td>
                            <td>
                              <span className="badge bg-light text-dark">
                                {getDocumentStatus(candidate.documents)}
                              </span>
                            </td>
                            <td>
                              {candidate.tags.map((tag, index) => (
                                <span key={index} className="badge bg-secondary me-1">
                                  {tag}
                                </span>
                              ))}
                            </td>
                            <td>{new Date(candidate.lastUpdated).toLocaleDateString()}</td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary">
                                  <i className="ri-eye-line"></i>
                                </button>
                                <button className="btn btn-outline-secondary">
                                  <i className="ri-edit-line"></i>
                                </button>
                                <button className="btn btn-outline-danger">
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="row">
                    {filteredCandidates.map((candidate) => (
                      <div key={candidate.id} className="col-md-6 col-lg-4 mb-3">
                        <div className="card border">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h6 className="card-title mb-1">{candidate.fullName}</h6>
                                <p className="text-muted small mb-0">{candidate.email}</p>
                              </div>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedCandidates.includes(candidate.id)}
                                onChange={() => handleSelectCandidate(candidate.id)}
                              />
                            </div>
                            
                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-2">
                                <span className="small text-muted">Status:</span>
                                {getStatusBadge(candidate.status)}
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span className="small text-muted">CDL Class:</span>
                                <span className="small">{candidate.cdlClass}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span className="small text-muted">Equipment:</span>
                                <span className="small">{candidate.equipmentType}</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span className="small text-muted">Documents:</span>
                                <span className="badge bg-light text-dark">
                                  {getDocumentStatus(candidate.documents)}
                                </span>
                              </div>
                            </div>

                            <div className="mb-3">
                              {candidate.tags.map((tag, index) => (
                                <span key={index} className="badge bg-secondary me-1 mb-1">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">
                                {new Date(candidate.lastUpdated).toLocaleDateString()}
                              </small>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary">
                                  <i className="ri-eye-line"></i>
                                </button>
                                <button className="btn btn-outline-secondary">
                                  <i className="ri-edit-line"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredCandidates.length === 0 && (
                  <div className="text-center py-5">
                    <i className="ri-user-line fs-1 text-muted mb-3"></i>
                    <h6 className="text-muted">No candidates found</h6>
                    <p className="text-muted">Try adjusting your filters or search terms</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default AdminDashboardPage; 