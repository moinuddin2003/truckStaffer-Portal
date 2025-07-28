import React, { useEffect, useRef, useState } from 'react'
import Calendar from './child/Calendar'
import { Icon } from '@iconify/react/dist/iconify.js'
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DatePicker = ({ id, placeholder }) => {
    const datePickerRef = useRef(null);

    useEffect(() => {
        flatpickr(datePickerRef.current, {
            enableTime: true,
            dateFormat: 'd/m/Y H:i',
        });
    }, []);

    return (
        <input
            ref={datePickerRef}
            id={id}
            type="text"
            className="form-control radius-8 bg-base"
            placeholder={placeholder}
        />
    );
};

const CalendarMainLayer = () => {
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch calendar data from API
    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://admin.truckstaffer.com/api/calendar/get', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.success) {
                    setCalendarEvents(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch calendar data');
                }
            } catch (err) {
                console.error('Error fetching calendar data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendarData();
    }, []);

    // Helper function to get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-danger-600';
            case 'medium':
                return 'bg-warning-600';
            case 'low':
                return 'bg-info-600';
            default:
                return 'bg-success-600';
        }
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === now.toDateString()) {
            return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
    };

    // Helper function to get time range
    const getTimeRange = (start, end) => {
        const startTime = new Date(start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const endTime = new Date(end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return `${startTime} - ${endTime}`;
    };

    if (loading) {
        return (
            <div className="row gy-4">
                <div className="col-12">
                    <div className="card h-100 p-0">
                        <div className="card-body p-24 text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading calendar events...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="row gy-4">
                <div className="col-12">
                    <div className="card h-100 p-0">
                        <div className="card-body p-24 text-center">
                            <div className="alert alert-danger" role="alert">
                                <Icon icon="fluent:error-circle-24-regular" className="icon text-lg me-2" />
                                Error loading calendar events: {error}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="row gy-4">
                <div className="col-xxl-3 col-lg-4">
                    <div className="card h-100 p-0">
                        <div className="card-body p-24">
                            <div className="mt-32">
                                {calendarEvents.length === 0 ? (
                                    <div className="text-center text-secondary-light">
                                        <Icon icon="solar:calendar-linear" className="icon text-3xl mb-3" />
                                        <p>No upcoming interviews scheduled</p>
                                    </div>
                                ) : (
                                    calendarEvents.map((event) => (
                                        <div key={event.id} className="event-item d-flex align-items-center justify-content-between gap-4 pb-16 mb-16 border border-start-0 border-end-0 border-top-0">
                                    <div className="">
                                        <div className="d-flex align-items-center gap-10">
                                                    <span className={`w-12-px h-12-px ${getPriorityColor(event.priority)} rounded-circle fw-medium`} />
                                            <span className="text-secondary-light">
                                                        {getTimeRange(event.start, event.end)}
                                            </span>
                                        </div>
                                        <span className="text-primary-light fw-semibold text-md mt-4">
                                                    {event.title}
                                        </span>
                                                {event.description && (
                                                    <p className="text-secondary-light text-sm mt-2 mb-0">
                                                        {event.description}
                                                    </p>
                                                )}
                                    </div>
                                    <div className="dropdown">
                                        <button
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <Icon
                                                icon="entypo:dots-three-vertical"
                                                className="icon text-secondary-light"
                                            />
                                        </button>
                                        <ul className="dropdown-menu p-12 border bg-base shadow">
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalView"
                                                >
                                                    <Icon
                                                        icon="hugeicons:view"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    View
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalEdit"
                                                >
                                                    <Icon
                                                        icon="lucide:edit"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="delete-item dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-danger-100 text-hover-danger-600 d-flex align-items-center gap-10"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#exampleModalDelete"
                                                >
                                                    <Icon
                                                        icon="fluent:delete-24-regular"
                                                        className="icon text-lg line-height-1"
                                                    />
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-9 col-lg-8">
                    <div className="card h-100 p-0">
                        <div className="card-body p-24">
                            <div id="wrap">
                                <div id="calendar" />
                                <div style={{ clear: "both" }} />
                                <Calendar events={calendarEvents} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Add Event */}
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Schedule Interview
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            <form action="#">
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Candidate Name :{" "}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            placeholder="Enter candidate name"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            CDL Type
                                        </label>
                                        <select className="form-control radius-8">
                                            <option value="">Select CDL Type</option>
                                            <option value="CDL-A">CDL-A</option>
                                            <option value="CDL-B">CDL-B</option>
                                            <option value="Owner-Operator">Owner-Operator</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Interview Type
                                        </label>
                                        <select className="form-control radius-8">
                                            <option value="">Select Interview Type</option>
                                            <option value="Initial">Initial Interview</option>
                                            <option value="Follow-up">Follow-up Interview</option>
                                            <option value="Final">Final Interview</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label
                                            htmlFor="startDate"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Interview Date & Time
                                        </label>
                                        <div className="position-relative">

                                            <DatePicker className="form-control radius-8 bg-base" id="startDate" placeholder="03/12/2024, 10:30 AM" />
                                            <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1">
                                                <Icon icon="solar:calendar-linear" className="icon text-lg"></Icon>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label
                                            htmlFor="endDate"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Duration
                                        </label>
                                        <select className="form-control radius-8">
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="90">1.5 hours</option>
                                            <option value="120">2 hours</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label
                                            htmlFor="endDate"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Interview Status{" "}
                                        </label>
                                        <div className="d-flex align-items-center flex-wrap gap-28">
                                            <div className="form-check checked-success d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="status"
                                                    id="Scheduled"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="Scheduled"
                                                >
                                                    <span className="w-8-px h-8-px bg-success-600 rounded-circle" />
                                                    Scheduled
                                                </label>
                                            </div>
                                            <div className="form-check checked-warning d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="status"
                                                    id="Pending"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="Pending"
                                                >
                                                    <span className="w-8-px h-8-px bg-warning-600 rounded-circle" />
                                                    Pending
                                                </label>
                                            </div>
                                            <div className="form-check checked-info d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="status"
                                                    id="Completed"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="Completed"
                                                >
                                                    <span className="w-8-px h-8-px bg-info-600 rounded-circle" />
                                                    Completed
                                                </label>
                                            </div>
                                            <div className="form-check checked-danger d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="status"
                                                    id="Cancelled"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="Cancelled"
                                                >
                                                    <span className="w-8-px h-8-px bg-danger-600 rounded-circle" />
                                                    Cancelled
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label
                                            htmlFor="desc"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Interview Notes
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="desc"
                                            rows={4}
                                            cols={50}
                                            placeholder="Enter interview notes or special requirements"
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                        <button
                                            type="reset"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                                        >
                                            Schedule Interview
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal View Event */}
            <div
                className="modal fade"
                id="exampleModalView"
                tabIndex={-1}
                aria-labelledby="exampleModalViewLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalViewLabel">
                                Interview Details
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            <div className="mb-12">
                                <span className="text-secondary-light txt-sm fw-medium">Candidate Name</span>
                                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                    John Smith
                                </h6>
                            </div>
                            <div className="mb-12">
                                <span className="text-secondary-light txt-sm fw-medium">
                                    CDL Type
                                </span>
                                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                    CDL-A
                                </h6>
                            </div>
                            <div className="mb-12">
                                <span className="text-secondary-light txt-sm fw-medium">
                                    Interview Date & Time
                                </span>
                                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                    25 Jan 2024, 10:30 AM
                                </h6>
                            </div>
                            <div className="mb-12">
                                <span className="text-secondary-light txt-sm fw-medium">
                                    Duration
                                </span>
                                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                    1 hour
                                </h6>
                            </div>
                            <div className="mb-12">
                                <span className="text-secondary-light txt-sm fw-medium">
                                    Interview Notes
                                </span>
                                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4">
                                    Initial interview for dump truck operator position
                                </h6>
                            </div>
                            <div className="mb-12">
                                <span className="text-secondary-light txt-sm fw-medium">Status</span>
                                <h6 className="text-primary-light fw-semibold text-md mb-0 mt-4 d-flex align-items-center gap-2">
                                    <span className="w-8-px h-8-px bg-success-600 rounded-circle" />
                                    Scheduled
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Edit Event */}
            <div
                className="modal fade"
                id="exampleModalEdit"
                tabIndex={-1}
                aria-labelledby="exampleModalEditLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                                Edit Interview
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body p-24">
                            <form action="#">
                                <div className="row">
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Candidate Name :{" "}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            placeholder="Enter candidate name"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            CDL Type
                                        </label>
                                        <select className="form-control radius-8">
                                            <option value="">Select CDL Type</option>
                                            <option value="CDL-A">CDL-A</option>
                                            <option value="CDL-B">CDL-B</option>
                                            <option value="Owner-Operator">Owner-Operator</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Interview Type
                                        </label>
                                        <select className="form-control radius-8">
                                            <option value="">Select Interview Type</option>
                                            <option value="Initial">Initial Interview</option>
                                            <option value="Follow-up">Follow-up Interview</option>
                                            <option value="Final">Final Interview</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label
                                            htmlFor="editstartDate"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Interview Date & Time
                                        </label>
                                        <div className=" position-relative">

                                            <DatePicker className="form-control radius-8 bg-base" id="startDate" placeholder="03/12/2024, 10:30 AM" />
                                            <span className="position-absolute end-0 top-50 translate-middle-y me-12 line-height-1">
                                                <Icon
                                                    icon="solar:calendar-linear"
                                                    className="icon text-lg"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-20">
                                        <label
                                            htmlFor="editendDate"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Duration
                                        </label>
                                        <select className="form-control radius-8">
                                            <option value="30">30 minutes</option>
                                            <option value="60">1 hour</option>
                                            <option value="90">1.5 hours</option>
                                            <option value="120">2 hours</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Interview Status{" "}
                                        </label>
                                        <div className="d-flex align-items-center flex-wrap gap-28">
                                            <div className="form-check checked-success d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="editstatus"
                                                    id="editScheduled"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="editScheduled"
                                                >
                                                    <span className="w-8-px h-8-px bg-success-600 rounded-circle" />
                                                    Scheduled
                                                </label>
                                            </div>
                                            <div className="form-check checked-warning d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="editstatus"
                                                    id="editPending"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="editPending"
                                                >
                                                    <span className="w-8-px h-8-px bg-warning-600 rounded-circle" />
                                                    Pending
                                                </label>
                                            </div>
                                            <div className="form-check checked-info d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="editstatus"
                                                    id="editCompleted"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="editCompleted"
                                                >
                                                    <span className="w-8-px h-8-px bg-info-600 rounded-circle" />
                                                    Completed
                                                </label>
                                            </div>
                                            <div className="form-check checked-danger d-flex align-items-center gap-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="editstatus"
                                                    id="editCancelled"
                                                />
                                                <label
                                                    className="form-check-label line-height-1 fw-medium text-secondary-light text-sm d-flex align-items-center gap-1"
                                                    htmlFor="editCancelled"
                                                >
                                                    <span className="w-8-px h-8-px bg-danger-600 rounded-circle" />
                                                    Cancelled
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 mb-20">
                                        <label
                                            htmlFor="desc"
                                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                                        >
                                            Interview Notes
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="editdesc"
                                            rows={4}
                                            cols={50}
                                            placeholder="Enter interview notes or special requirements"
                                            defaultValue={""}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                        <button
                                            type="reset"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                                        >
                                            Update Interview
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Delete Event */}
            <div
                className="modal fade"
                id="exampleModalDelete"
                tabIndex={-1}
                aria-hidden="true"
            >
                <div className="modal-dialog modal-sm modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-body p-24 text-center">
                            <span className="mb-16 fs-1 line-height-1 text-danger">
                                <Icon
                                    icon="fluent:delete-24-regular"
                                    className="menu-icon"
                                />
                            </span>
                            <h6 className="text-lg fw-semibold text-primary-light mb-0">
                                Are you sure you want to cancel this interview?
                            </h6>
                            <div className="d-flex align-items-center justify-content-center gap-3 mt-24">
                                <button
                                    type="reset"
                                    className="w-50 border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-40 py-11 radius-8"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="w-50 btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CalendarMainLayer