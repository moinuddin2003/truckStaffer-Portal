import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const initialForm = {
  fullName: "",
  companyName: "",
  companyAddress: "",
  ownerName: "",
  businessEIN: "",
  phone: "",
  email: "",
  website: "",
  businessStructure: "",
  mcDotNumber: "",
  referralSource: "",
  // Step 2 fields
  ownership: "",
  equipmentType: "",
  yearMakeModel: "",
  vin: "",
  vins: [], // New array to store multiple VINs
  gvwr: "",
  tarp: "",
  additionalTrucks: "",
  dotInspection: "",
  backupTrucks: "",
  truckPhotos: [],
  // Step 3 fields
  cdlStatus: "",
  cdlSuspended: "",
  yearsExperience: "",
  materialsHauled: [],
  govContracts: "",
  cdlUpload: null,
  medCardUpload: null,
  // Step 4 fields
  numEmployees: "",
  workRadius: "",
  shiftWillingness: "",
  regions: "",
  startDate: "",
  weeklyAvailability: "",
  // Step 5 fields
  insuranceCoverage: "",
  cargoCoverage: "",
  insuranceExpiration: "",
  workmansComp: "",
  addTruckStaffer: "",
  coiUpload: null,
  businessDocs: [],
  // Step 6 fields
  felony: "",
  drugTesting: "",
  enrolledTesting: "",
  safetyViolations: "",
  pendingLawsuits: "",
  // Step 7 fields
  currentContracts: "",
  dispatchServices: "",
  telematics: "",
  maintenanceInterest: "",
  additionalComments: "",
};

const OrderByFollowingStep = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Keep for logic, but don't show in UI
  const [completedSteps, setCompletedSteps] = useState([]);
  const [applicationId, setApplicationId] = useState(null);
  const [showFinalValidation, setShowFinalValidation] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const navigate = useNavigate();

  // Effect to handle currentStep being greater than 7
  useEffect(() => {
    if (currentStep > 7) {
      console.warn("Current step is greater than 7, redirecting to summary");
      navigate("/application-summary");
      return;
    }
  }, [currentStep, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }
    // Optionally: check token expiration if your token is a JWT
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        localStorage.removeItem("token");
        navigate("/sign-in");
      }
    } catch (e) {
      // If token is malformed, force logout
      localStorage.removeItem("token");
      navigate("/sign-in");
    }

    // Get logged-in user's email from localStorage
    // Get email from localStorage (set during login)
    const storedEmail = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email
      : null;

    // Load saved progress from localStorage - make it user-specific
    const progressKey = storedEmail ? `applicationProgress_${storedEmail}` : "applicationProgress";
    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setForm({
          ...progress.form,
          email: storedEmail || progress.form.email || initialForm.email,
        });
        setCompletedSteps(progress.completedSteps || []);

        // Ensure currentStep is never greater than 7
        const savedStep = progress.currentStep || 1;
        if (savedStep > 7) {
          console.warn("Saved step was greater than 7, redirecting to summary");
          navigate("/application-summary");
          return;
        }
        setCurrentStep(savedStep);
        setApplicationId(progress.applicationId || null);
      } catch (e) {
        console.error("Error loading saved progress:", e);
      }
    } else if (storedEmail) {
      // If no saved progress, set email from localStorage
      setForm((prev) => ({
        ...prev,
        email: storedEmail,
      }));
    }
  }, [navigate]);

  // Save progress to localStorage whenever form or completedSteps change
  useEffect(() => {
    const progress = {
      form,
      completedSteps,
      currentStep,
      applicationId,
      timestamp: Date.now(),
    };
    const storedEmail = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email
      : null;
    const progressKey = storedEmail ? `applicationProgress_${storedEmail}` : "applicationProgress";
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }, [form, completedSteps, currentStep, applicationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Apply specific validations based on field type
    let validatedValue = value;

    switch (name) {
      case "phone":
        // Only allow numbers, spaces, dashes, and parentheses for phone
        validatedValue = value.replace(/[^0-9\s\-\(\)]/g, "");
        break;
      case "ownerName":
      case "fullName":
        // Only allow letters, spaces, and common name characters
        validatedValue = value.replace(/[^a-zA-Z\s\-'\.]/g, "");
        break;
      case "businessEIN":
        // Only allow numbers and dashes for EIN
        validatedValue = value.replace(/[^0-9\-]/g, "");
        break;
      case "mcDotNumber":
        // Only allow numbers and letters for MC/DOT number
        validatedValue = value.replace(/[^a-zA-Z0-9]/g, "");
        break;
      case "yearsExperience":
      case "numEmployees":
        // Only allow numbers
        validatedValue = value.replace(/[^0-9]/g, "");
        break;
      default:
        validatedValue = value;
    }

    setForm((prev) => ({ ...prev, [name]: validatedValue }));
  };

  // Handle adding a new VIN
  const handleAddVin = () => {
    if (form.vin.trim()) {
      setForm((prev) => ({
        ...prev,
        vins: [...prev.vins, form.vin.trim()],
        vin: "", // Clear the input field
      }));
    }
  };

  // Handle removing a VIN
  const handleRemoveVin = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      vins: prev.vins.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Handle VIN input key press (Enter to add)
  const handleVinKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddVin();
    }
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      truckPhotos: Array.from(e.target.files),
    }));
  };

  const handleMaterialsChange = (e) => {
    const { value } = e.target;
    setForm((prev) => {
      // For radio buttons, just set the selected value
      return { ...prev, materialsHauled: [value] };
    });
  };

  const handleCDLFile = (e) => {
    setForm((prev) => ({ ...prev, cdlUpload: e.target.files[0] }));
  };

  const handleMedCardFile = (e) => {
    setForm((prev) => ({ ...prev, medCardUpload: e.target.files[0] }));
  };

  const handleCOIFile = (e) => {
    setForm((prev) => ({ ...prev, coiUpload: e.target.files[0] }));
  };

  const handleBusinessDocs = (e) => {
    setForm((prev) => ({ ...prev, businessDocs: Array.from(e.target.files) }));
  };

  // Validation functions
  const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const validateName = (name) => {
    // Must contain at least 2 characters and only letters, spaces, hyphens, apostrophes, and periods
    const nameRegex = /^[a-zA-Z\s\-'\.]{2,}$/;
    return nameRegex.test(name.trim());
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showValidationError = (title, message) => {
    Swal.fire({
      icon: "error",
      title: `<span style="font-size: 20px; font-weight: 600; color: #1e293b;">${title}</span>`,
      html: `<div style="font-size: 14px; color: #64748b;">${message}</div>`,
      background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
      color: "#334155",
      iconColor: "#f87171",
      confirmButtonText: "Retry",
      confirmButtonColor: "#6366f1",
      buttonsStyling: true,
      width: 400, // tighter width
      padding: "1rem",
      customClass: {
        popup: "beautiful-error-popup",
        title: "beautiful-title",
        confirmButton: "beautiful-confirm-btn",
      },
      backdrop: "rgba(100, 116, 139, 0.3)",

      showClass: {
        popup: "animate__animated animate__bounceIn animate__faster",
      }
    });
  };

  const validateCurrentStep = () => {
    return validateFormStep(form, currentStep); // form must be available in your component state
  };

  // Validate current step
  const validateFormStep = (form, step) => {
    if (step === 1) {
      if (
        !form.fullName ||
        form.fullName.trim().length < 2 ||
        !validateName(form.fullName)
      ) {
        showValidationError(
          "Invalid Full Name",
          "Please enter a valid full name (letters only, minimum 2 characters)."
        );
        return false;
      }
      if (!form.companyAddress || form.companyAddress.trim().length < 3) {
        showValidationError(
          "Company Address Required",
          "Please enter your company address."
        );
        return false;
      }
      if (!form.businessEIN || form.businessEIN.trim().length < 6) {
        showValidationError(
          "Business EIN Required",
          "Please enter your Business EIN."
        );
        return false;
      }
      if (!form.phone || !validatePhoneNumber(form.phone)) {
        showValidationError(
          "Invalid Phone Number",
          "Please enter a valid phone number (minimum 10 digits)."
        );
        return false;
      }
      // Skip email validation for existing users - email is already verified during login
      // if (!form.email || !validateEmail(form.email)) {
      //   showValidationError(
      //     "Invalid Email",
      //     "Please enter a valid email address."
      //   );
      //   return false;
      // }
      if (!form.businessStructure || form.businessStructure.trim().length < 2) {
        showValidationError(
          "Business Structure Required",
          "Please select your business structure."
        );
        return false;
      }
    }

    if (step === 2) {
      if (!form.ownership) {
        showValidationError(
          "Ownership Status Required",
          "Please select whether you currently own or lease a dump truck."
        );
        return false;
      }
      if (!form.equipmentType) {
        showValidationError(
          "Equipment Type Missing",
          "Please enter your equipment type (e.g., Tri-Axle, Quad-Axle, etc.)."
        );
        return false;
      }
      if (!form.yearMakeModel) {
        showValidationError(
          "Truck Details Missing",
          "Please enter your truck year/make/model."
        );
        return false;
      }
      if (!form.vin) {
        showValidationError(
          "VIN Required",
          "Please enter your truck VIN number."
        );
        return false;
      }
      if (!form.tarp) {
        showValidationError(
          "Tarp System Info Missing",
          "Please indicate if your truck is equipped with a tarp system."
        );
        return false;
      }
      if (!form.additionalTrucks) {
        showValidationError(
          "Additional Trucks Info Missing",
          "Please indicate if you have additional trucks available."
        );
        return false;
      }
      if (!form.dotInspection) {
        showValidationError(
          "DOT Certificate Info Missing",
          "Please indicate if you have a current DOT inspection certificate."
        );
        return false;
      }
      if (!form.backupTrucks) {
        showValidationError(
          "Backup Trucks Info Missing",
          "Please indicate if you have backup trucks or access to rentals."
        );
        return false;
      }
    }

  if (step === 3) {
    if (!form.cdlStatus) {
      showValidationError('CDL Status Required', 'Please select your CDL status.');
      return false;
    }
    if (!form.cdlSuspended) {
      showValidationError('CDL Suspension Info Required', 'Please indicate if your CDL was ever suspended or revoked.');
      return false;
    }
    if (!form.yearsExperience || isNaN(form.yearsExperience) || Number(form.yearsExperience) < 0) {
      showValidationError('Years of Experience Required', 'Please enter your years in trucking/dump hauling business (numbers only).');
      return false;
    }
    if (!form.materialsHauled || form.materialsHauled.length === 0) {
      showValidationError('Materials Hauled Required', 'Please select the types of materials you have hauled.');
      return false;
    }
    if (!form.govContracts) {
      showValidationError('Government Contracts Info Required', 'Please indicate if you have worked on government or DOT contracts.');
      return false;
    }
  }

  if (step === 4) {
    if (!form.numEmployees || isNaN(form.numEmployees) || Number(form.numEmployees) < 1) {
      showValidationError('Number of Employees Required', 'Please enter the number of employees/drivers (including yourself, numbers only).');
      return false;
    }
    if (!form.workRadius) {
      showValidationError('Work Radius Required', 'Please select your preferred work radius.');
      return false;
    }
    if (!form.shiftWillingness) {
      showValidationError('Shift Flexibility Required', 'Please indicate your willingness to work 10–12 hour shifts.');
      return false;
    }
    if (!form.regions) {
      showValidationError('Preferred States/Regions Required', 'Please list the regions or states you are willing to work in.');
      return false;
    }
    if (!form.startDate) {
      showValidationError('Start Availability Required', 'Please select when you would be ready to start.');
      return false;
    }
    if (!form.weeklyAvailability) {
      showValidationError('Weekly Availability Required', 'Please select your expected weekly availability.');
      return false;
    }
  }

  if (step === 5) {
    if (!form.insuranceCoverage) {
      showValidationError('Insurance Coverage Required', 'Please select your current insurance coverage.');
      return false;
    }
    if (!form.cargoCoverage) {
      showValidationError('Cargo Coverage Required', 'Please indicate if you also have cargo coverage.');
      return false;
    }
    if (!form.insuranceExpiration) {
      showValidationError('Insurance Expiry Required', 'Please enter your insurance policy expiration date.');
      return false;
    }
    if (!form.workmansComp) {
      showValidationError('Workman\'s Comp Required', 'Please indicate if you carry Workman\'s Comp or Occupational Accident Policy.');
      return false;
    }
    if (!form.addTruckStaffer) {
      showValidationError('Certificate Holder Required', 'Please indicate if you are willing to add TruckStaffer as Certificate Holder.');
      return false;
    }
  }

  if (step === 6) {
    if (!form.felony) {
      showValidationError(
        'Felony Conviction Status Required',
        'Please indicate whether you have ever been convicted of a felony or major traffic violation.'
      );
      return false;
    }
    if (!form.drugTesting) {
      showValidationError(
        'Drug Testing Willingness Required',
        'Please indicate whether you are willing to undergo drug testing if required.'
      );
      return false;
    }
    if (!form.enrolledTesting) {
      showValidationError(
        'Random Testing Enrollment Required',
        'Please indicate if you are enrolled in a random drug/alcohol testing program.'
      );
      return false;
    }
    if (!form.safetyViolations) {
      showValidationError(
        'Safety Violations Info Required',
        'Please indicate if you have any current safety violations or outstanding compliance issues.'
      );
      return false;
    }
    if (!form.pendingLawsuits) {
      showValidationError(
        'Legal Issues Info Required',
        'Please indicate if you have any pending lawsuits, liens, or judgments.'
      );
      return false;
    }
  }

  if (step === 7) {
    if (!form.currentContracts) {
      showValidationError(
        'Current Contract Status Required',
        'Please indicate your current contract status with another project/company.'
      );
      return false;
    }
    if (!form.dispatchServices) {
      showValidationError(
        'Dispatch Services Info Required',
        'Please indicate if you currently work with dispatch services or brokers.'
      );
      return false;
    }
    if (!form.telematics) {
      showValidationError(
        'Telematics/GPS Info Required',
        'Please indicate if you use telematics or GPS tracking.'
      );
      return false;
    }
    if (!form.maintenanceInterest) {
      showValidationError(
        'Maintenance Discount Interest Required',
        'Please indicate if you are interested in priority maintenance discounts.'
      );
      return false;
    }
  }
    return true;
};


  // Check for missing important information at the end
  const getMissingImportantFields = () => {
    const missingFields = [];

    // Company Information
    if (!form.companyName) missingFields.push("Company Name");
    if (!form.businessEIN) missingFields.push("Business EIN");
    if (!form.mcDotNumber) missingFields.push("MC/DOT Number");

    // Equipment Details
    if (!form.yearMakeModel) missingFields.push("Year/Make/Model");
    if (!form.vins.length === 0) missingFields.push("Truck VIN Number(s)");
    if (!form.gvwr) missingFields.push("Truck GVWR");

    // CDL & Credentials
    if (!form.cdlUpload) missingFields.push("CDL Upload");
    if (!form.medCardUpload) missingFields.push("DOT Medical Card");

    // Insurance & Documents
    if (!form.coiUpload) missingFields.push("Certificate of Insurance");
    if (!form.businessDocs.length === 0)
      missingFields.push("Business Documents");

    return missingFields;
  };

  // Get step data for API call
  const getStepData = (step) => {
    switch (step) {
      case 1:
        return {
          full_name: form.fullName,
          company_name: form.companyName,
          company_address: form.companyAddress,
          owner_name: form.ownerName,
          ein: form.businessEIN,
          phone: form.phone,
          email: form.email,
          website: form.website,
          business_structure: form.businessStructure,
          mc_dot_number: form.mcDotNumber,
          referral_source: form.referralSource,
        };
      case 2:
        return {
          ownership_status: form.ownership,
          equipment_type: form.equipmentType,
          truck_year: form.yearMakeModel,
          truck_make_model: form.yearMakeModel,
          truck_vin: form.vin,
          gvwr: form.gvwr,
          has_tarp: form.tarp === "Yes",
          has_additional_trucks: form.additionalTrucks === "Yes",
          has_dot_certificate: form.dotInspection === "Yes",
          has_backup_plan: form.backupTrucks === "Yes",
        };
      case 3:
        return {
          cdl_class: form.cdlStatus,
          cdl_suspended: form.cdlSuspended === "Yes",
          experience_years: form.yearsExperience,
          has_highway_experience: form.highwayExperience === "Yes",
          materials_hauled: form.materialsHauled.join(", "),
          has_gov_contracts: form.govContracts === "Yes",
        };
      case 4:
        return {
          employee_count: form.numEmployees,
          work_radius: form.workRadius,
          shift_flexibility: form.shiftWillingness,
          preferred_states: form.regions,
          start_availability: form.startDate,
          weekly_availability: form.weeklyAvailability,
        };
      case 5:
        return {
          liability_coverage: form.insuranceCoverage,
          cargo_coverage: form.cargoCoverage === "Yes",
          insurance_expiry: form.insuranceExpiration,
          has_worker_comp: form.workmansComp === "Yes",
          allow_cert_holder: form.addTruckStaffer === "Yes",
        };
      case 6:
        return {
          has_felony: form.felony === "Yes",
          willing_drug_test: form.drugTesting === "Yes",
          enrolled_random_testing: form.enrolledTesting === "Yes",
          has_safety_violations: form.safetyViolations === "Yes",
          has_legal_issues: form.pendingLawsuits === "Yes",
        };
      case 7:
        return {
          current_contract_status: form.currentContracts,
          using_dispatch_services: form.dispatchServices === "Yes",
          using_telematics: form.telematics === "Yes",
          interested_in_maintenance_discount:
            form.maintenanceInterest === "Yes",
          additional_comments: form.additionalComments,
        };
      default:
        return {};
    }
  };

  // Submit step to API
  const submitStep = async (step) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to continue.",
      });
      setError("Authentication required");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const stepData = getStepData(step);
      // console.log(`Submitting step ${step} data:`, stepData);
      // returning complete data object from getStepData() filled in step1
      // console.log(`Current applicationId:`, applicationId);
      //currently it is null

      // For step 1, we don't have applicationId yet, so use a different endpoint
      const url =
        step === 1
          ? `https://admin.truckstaffer.com/api/application/step${step}`
          : `https://admin.truckstaffer.com/api/application/${applicationId}/step${step}`;

      // console.log(`Making request to:`, url);
      // Making request to: https://admin.truckstaffer.com/api/application/step1 running at step 1 with error

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(stepData),
      });

      //console.log(`Step ${step} response status:`, response.status);
      //  return 422 or 200 depens on the step
      // console.log(`Step ${step} response headers:`, response.headers);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Handle non-JSON response (like HTML error pages)
        const textResponse = await response.text();
        let errorMsg = `Server error (${response.status}). Please try again.`;
        if (response.status === 500) {
          errorMsg =
            "Server error: ApplicationController not found. Please contact the backend team to create the missing controller.";
        } else if (response.status === 401) {
          errorMsg = "Authentication failed. Please log in again.";
          localStorage.removeItem("token");
          navigate("/sign-in");
        } else if (response.status === 403) {
          errorMsg =
            "Access denied. You don't have permission to perform this action.";
        }
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: errorMsg,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
        setError(errorMsg);
        return false;
      }

      const data = await response.json();
      // console.log(`Step ${step} API response:`, data);

      if (response.ok && (data.status || data.success)) {
        // If this is step 1 and we get a successful response, extract the application ID
        if (step === 1) {
          // Check multiple possible locations for application_id
          const applicationId =
            data.application_id ||
            data.data?.application_id ||
            data.id ||
            data.applicationId;
          if (applicationId) {
            setApplicationId(applicationId);
            console.log(`Application ID received: ${applicationId}`);
          } else {
            console.warn(
              "Step 1 successful but no application_id found in response:",
              data
            );
            // For now, we'll continue but this will cause issues with subsequent steps
            // The backend needs to return the application_id
          }
        }

        // Only add step to completedSteps if it's not already there
        setCompletedSteps((prev) => {
          if (!prev.includes(step)) {
            return [...prev, step];
          }
          return prev;
        });
        return true;
      } else {
        // Show exact error message from API, including validation errors
        let errorMsg =
          data.message || data.error || `Failed to submit step ${step}`;
        // If validation errors exist, show them in detail
        if (data.errors && typeof data.errors === "object") {
          errorMsg = "Please fix the following errors:";
          errorMsg += "<ul style='text-align:left; margin-top: 10px;'>";
          Object.entries(data.errors).forEach(([field, msgs]) => {
            const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const message = Array.isArray(msgs) ? msgs.join(', ') : msgs;
            errorMsg += `<li><strong>${fieldName}:</strong> ${message}</li>`;
          });
          errorMsg += "</ul>";
        }
        // Swal.fire({
        //   icon: "error",
        //   title: "Error",
        //   html: errorMsg,
        //   confirmButtonColor: "#3085d6",
        //   confirmButtonText: "OK",
        // });
        // setError(errorMsg);
        // return true;
      }
    } catch (err) {
      console.error(`Error submitting step ${step}:`, err);

      let errorMsg = "An unexpected error occurred. Please try again.";
      if (err.name === "SyntaxError") {
        errorMsg = "Server returned invalid response. Please try again later.";
      } else if (err.name === "TypeError" && err.message.includes("fetch")) {
        errorMsg = "Network error. Please check your internet connection.";
      }
      Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: errorMsg,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) {
      setError("Please fill in all required fields before proceeding.");
      return;
    }

    setError("");

    // Submit current step
    const stepSubmitted = await submitStep(currentStep);
    if (!stepSubmitted) {
      return;
    }

    // If this is the last step, show final validation
    if (currentStep === 7) {
      const missing = getMissingImportantFields();
      if (missing.length > 0) {
        setMissingFields(missing);
        setShowFinalValidation(true);
        return;
      }

      // All good, proceed to summary
      navigate("/application-summary");
      return;
    }

    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setError("");
  };

  const goToStep = (step) => {
    if (completedSteps.includes(step - 1) || step === 1) {
      setCurrentStep(step);
      setError("");
    }
  };

  return (
    <>
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <h6 className="mb-4 text-xl">Owner-Operator Application</h6>
            <p className="text-neutral-500">
              Please fill out all required information to begin your
              application.
            </p>

            <div className="form-wizard">
              <form>
                {/* Enhanced step indicator */}
                <div className="mb-6">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="text-lg fw-semibold text-primary-light mb-0">
                      Step {Math.min(currentStep, 7)} of 7
                    </h6>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-sm text-success-600 fw-medium">
                        {completedSteps.length} completed
                      </span>
                      <div className="bg-success-100 px-3 py-2 rounded-pill">
                        <span className="text-xs text-success-700 fw-bold">
                          {Math.round((completedSteps.length / 7) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="progress mb-3" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${(completedSteps.length / 7) * 100}%` }}
                      aria-valuenow={completedSteps.length}
                      aria-valuemin="0"
                      aria-valuemax="7"
                    ></div>
                  </div>

                  {/* Step names */}
                  <div className="d-flex justify-content-between align-items-center">
                    {[
                      { num: 1, name: "Contact Info" },
                      { num: 2, name: "Equipment" },
                      { num: 3, name: "CDL & Credentials" },
                      { num: 4, name: "Operations" },
                      { num: 5, name: "Insurance" },
                      { num: 6, name: "Screening" },
                      { num: 7, name: "Additional" },
                    ].map((step, index) => (
                      <div key={step.num} className="text-center flex-fill">
                        <div
                          className={`d-inline-flex align-items-center justify-content-center mb-2 ${
                            currentStep === step.num
                              ? "text-primary-600"
                              : completedSteps.includes(step.num)
                              ? "text-success-600"
                              : "text-neutral-400"
                          }`}
                        >
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center me-2 ${
                              currentStep === step.num
                                ? "bg-primary-600 text-white"
                                : completedSteps.includes(step.num)
                                ? "bg-success-600 text-white"
                                : "bg-neutral-200 text-neutral-500"
                            }`}
                            style={{
                              width: "24px",
                              height: "24px",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {completedSteps.includes(step.num) ? "✓" : step.num}
                          </div>
                          <span className="text-xs fw-medium d-none d-md-inline">
                            {step.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 1: Contact & Business Info */}
                {currentStep === 1 && (
                  <fieldset className="wizard-fieldset show">
                    <h6 className="text-md text-neutral-500 mb-3">
                      Basic Contact & Business Info
                    </h6>
                    <div className="mb-2">
                      <span className="text-danger text-sm">
                        All fields marked with * are compulsory.
                      </span>
                    </div>
                    <div className="row gy-3">
                      <div className="col-sm-6">
                        <label className="form-label">Full Name*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="Enter full name (letters only)"
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Business/Company Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="companyName"
                          value={form.companyName}
                          onChange={handleChange}
                          placeholder="Enter company name"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Company Address*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="companyAddress"
                          value={form.companyAddress}
                          onChange={handleChange}
                          placeholder="Enter company address"
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">Owner's Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ownerName"
                          value={form.ownerName}
                          onChange={handleChange}
                          placeholder="Enter owner name (letters only)"
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">Business EIN*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="businessEIN"
                          value={form.businessEIN}
                          onChange={handleChange}
                          placeholder="Enter EIN (numbers and dashes only)"
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">Phone*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number (minimum 10 digits)"
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">Email*</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={
                            form.email ||
                            (localStorage.getItem("user")
                              ? JSON.parse(localStorage.getItem("user")).email
                              : "")
                          }
                          readOnly
                          disabled
                          style={{
                            background: "#f5f5f5",
                            color: "#888",
                            cursor: "not-allowed",
                          }}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Company Website</label>
                        <input
                          type="text"
                          className="form-control"
                          name="website"
                          value={form.website}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">Business Structure*</label>
                        <select
                          className="form-control"
                          name="businessStructure"
                          value={form.businessStructure}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="LLC">LLC</option>
                          <option value="Sole Proprietor">
                            Sole Proprietor
                          </option>
                          <option value="Corporation">Corporation</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">MC or DOT Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="mcDotNumber"
                          value={form.mcDotNumber}
                          onChange={handleChange}
                          placeholder="Enter MC/DOT number (letters and numbers only)"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">
                          How did you hear about TruckStaffer?
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="referralSource"
                          value={form.referralSource}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group text-end mt-4">
                      <button
                        type="button"
                        className="btn btn-primary-600 px-32"
                        onClick={nextStep}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Next"}
                      </button>
                    </div>
                  </fieldset>
                )}

                {/* Step 2: Equipment Details */}
                {currentStep === 2 && (
                  <fieldset className="wizard-fieldset show">
                    <h6 className="text-md text-neutral-500 mb-3">
                      Equipment Details
                    </h6>
                    <div className="mb-2">
                      <span className="text-danger text-sm">
                        All fields marked with * are compulsory.
                      </span>
                    </div>
                    <div className="row gy-3">
                      <div className="col-sm-6">
                        <label className="form-label">
                          Do you currently own or lease a dump truck?*
                        </label>
                        <select
                          className="form-control"
                          name="ownership"
                          value={form.ownership}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Own">Own</option>
                          <option value="Lease">Lease</option>
                          <option value="Looking to Purchase/Lease">
                            Looking to Purchase/Lease
                          </option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">Equipment Type*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="equipmentType"
                          value={form.equipmentType}
                          onChange={handleChange}
                          placeholder="Tri-Axle, Quad-Axle, etc."
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">Year/Make/Model*</label>
                        <input
                          type="text"
                          className="form-control"
                          name="yearMakeModel"
                          value={form.yearMakeModel}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Truck VIN Number(s)*
                        </label>
                        <div className="d-flex gap-2 mb-2">
                          <input
                            type="text"
                            className="form-control"
                            name="vin"
                            value={form.vin}
                            onChange={handleChange}
                            onKeyPress={handleVinKeyPress}
                            placeholder="Enter VIN number"
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={handleAddVin}
                            disabled={!form.vin.trim()}
                          >
                            Add
                          </button>
                        </div>
                        {form.vins.length > 0 && (
                          <div className="mt-2">
                            <label className="form-label text-sm">
                              Added VINs:
                            </label>
                            <div className="d-flex flex-wrap gap-2">
                              {form.vins.map((vin, index) => (
                                <div
                                  key={index}
                                  className="badge bg-primary d-flex align-items-center gap-2"
                                >
                                  {vin}
                                  <button
                                    type="button"
                                    className="btn-close btn-close-white btn-sm"
                                    onClick={() => handleRemoveVin(index)}
                                    aria-label="Remove VIN"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">Truck GVWR</label>
                        <input
                          type="text"
                          className="form-control"
                          name="gvwr"
                          value={form.gvwr}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Is your truck equipped with a tarp system?*
                        </label>
                        <select
                          className="form-control"
                          name="tarp"
                          value={form.tarp}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Do you have additional trucks available?*
                        </label>
                        <select
                          className="form-control"
                          name="additionalTrucks"
                          value={form.additionalTrucks}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Do you have a current DOT inspection certificate?*
                        </label>
                        <select
                          className="form-control"
                          name="dotInspection"
                          value={form.dotInspection}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Do you have backup trucks or access to rentals?*
                        </label>
                        <select
                          className="form-control"
                          name="backupTrucks"
                          value={form.backupTrucks}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">
                          Upload photos of your truck (optional)
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          multiple
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                    <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                      <button
                        type="button"
                        className="btn btn-neutral-500 border-neutral-100 px-32"
                        onClick={prevStep}
                        disabled={loading}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary-600 px-32"
                        onClick={nextStep}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Next"}
                      </button>
                    </div>
                  </fieldset>
                )}

                {/* Step 3: CDL & Credentials */}
                {currentStep === 3 && (
                  <fieldset className="wizard-fieldset show">
                    <h6 className="text-md text-neutral-500 mb-3">
                      CDL & Driver Credentials
                    </h6>
                    <div className="mb-2">
                      <span className="text-danger text-sm">
                        All fields marked with * are compulsory.
                      </span>
                    </div>
                    <div className="row gy-3">
                      <div className="col-sm-6">
                        <label className="form-label">
                          Do you have a valid CDL?*
                        </label>
                        <select
                          className="form-control"
                          name="cdlStatus"
                          value={form.cdlStatus}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Class A">Class A</option>
                          <option value="Class B">Class B</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Ever had your CDL suspended or revoked?*
                        </label>
                        <select
                          className="form-control"
                          name="cdlSuspended"
                          value={form.cdlSuspended}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Years in trucking/dump hauling business*
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="yearsExperience"
                          value={form.yearsExperience}
                          onChange={handleChange}
                          min="0"
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">
                          What types of materials have you hauled?
                        </label>
                        <div className="d-flex flex-wrap gap-3">
                          {["Dirt", "Stone", "Asphalt", "Sand", "Other"].map(
                            (mat) => (
                              <div key={mat} className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="materialsHauled"
                                  id={`mat-${mat}`}
                                  value={mat}
                                  checked={
                                    form.materialsHauled.length === 1 &&
                                    form.materialsHauled[0] === mat
                                  }
                                  onChange={handleMaterialsChange}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`mat-${mat}`}
                                >
                                  {mat}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Worked on government or DOT contracts?*
                        </label>
                        <select
                          className="form-control"
                          name="govContracts"
                          value={form.govContracts}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">Upload CDL</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleCDLFile}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Upload DOT Medical Card
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleMedCardFile}
                        />
                      </div>
                    </div>
                    <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                      <button
                        type="button"
                        className="btn btn-neutral-500 border-neutral-100 px-32"
                        onClick={prevStep}
                        disabled={loading}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary-600 px-32"
                        onClick={nextStep}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Next"}
                      </button>
                    </div>
                  </fieldset>
                )}

                {/* Step 4: Operational Capacity */}
                {currentStep === 4 && (
                  <fieldset className="wizard-fieldset show">
                    <h6 className="text-md text-neutral-500 mb-3">
                      Operational Capacity
                    </h6>
                    <div className="mb-2">
                      <span className="text-danger text-sm">
                        All fields marked with * are compulsory.
                      </span>
                    </div>
                    <div className="row gy-3">
                      <div className="col-sm-6">
                        <label className="form-label">
                          Number of employees/drivers (including yourself)*
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="numEmployees"
                          value={form.numEmployees}
                          onChange={handleChange}
                          min="1"
                          required
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Preferred Work Radius*
                        </label>
                        <select
                          className="form-control"
                          name="workRadius"
                          value={form.workRadius}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Local">Local</option>
                          <option value="Regional">Regional</option>
                          <option value="OTR">OTR</option>
                          <option value="Willing to travel">
                            Willing to travel
                          </option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Willing to work 10–12 hour shifts?
                        </label>
                        <select
                          className="form-control"
                          name="shiftWillingness"
                          value={form.shiftWillingness}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Maybe">Maybe</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Regions/states you are willing to work in
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="regions"
                          value={form.regions}
                          onChange={handleChange}
                          placeholder="List regions or states"
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          When would you be ready to start?
                        </label>
                        <select
                          className="form-control"
                          name="startDate"
                          value={form.startDate}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Immediately">Immediately</option>
                          <option value="1–2 weeks">1–2 weeks</option>
                          <option value="30 days">30 days</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Expected weekly availability
                        </label>
                        <select
                          className="form-control"
                          name="weeklyAvailability"
                          value={form.weeklyAvailability}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="3–4 days">3–4 days</option>
                          <option value="5–6 days">5–6 days</option>
                          <option value="Full-time">Full-time</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                      <button
                        type="button"
                        className="btn btn-neutral-500 border-neutral-100 px-32"
                        onClick={prevStep}
                        disabled={loading}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary-600 px-32"
                        onClick={nextStep}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Next"}
                      </button>
                    </div>
                  </fieldset>
                )}

                {/* Step 5: Insurance & Compliance */}
                {currentStep === 5 && (
                  <fieldset className="wizard-fieldset show">
                    <h6 className="text-md text-neutral-500 mb-3">
                      Insurance & Compliance
                    </h6>
                    <div className="mb-2">
                      <span className="text-danger text-sm">
                        All fields marked with * are compulsory.
                      </span>
                    </div>
                    <div className="row gy-3">
                      <div className="col-sm-6">
                        <label className="form-label">
                          Current insurance coverage*
                        </label>
                        <select
                          className="form-control"
                          name="insuranceCoverage"
                          value={form.insuranceCoverage}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="$1M Liability">
                            Yes – $1M Liability
                          </option>
                          <option value="Less than $1M">Less than $1M</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Do you also have cargo coverage?*
                        </label>
                        <select
                          className="form-control"
                          name="cargoCoverage"
                          value={form.cargoCoverage}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Insurance policy expiration date*
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="insuranceExpiration"
                          value={form.insuranceExpiration}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Do you carry Workman's Comp or Occupational Accident
                          Policy?*
                        </label>
                        <select
                          className="form-control"
                          name="workmansComp"
                          value={form.workmansComp}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Not sure">Not sure</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Willing to add TruckStaffer as Certificate Holder?*
                        </label>
                        <select
                          className="form-control"
                          name="addTruckStaffer"
                          value={form.addTruckStaffer}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Upload Certificate of Insurance (COI)
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleCOIFile}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">
                          Upload Required Business Documents (W9, LLC, EIN,
                          etc.)
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          multiple
                          onChange={handleBusinessDocs}
                        />
                      </div>
                    </div>
                    <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                      <button
                        type="button"
                        className="btn btn-neutral-500 border-neutral-100 px-32"
                        onClick={prevStep}
                        disabled={loading}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary-600 px-32"
                        onClick={nextStep}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Next"}
                      </button>
                    </div>
                  </fieldset>
                )}

                {/* Step 6: Screening & Safety */}
                {currentStep === 6 && (
                  <fieldset className="wizard-fieldset show">
                    <h6 className="text-md text-neutral-500 mb-3">
                      Screening & Safety*
                    </h6>
                    <div className="mb-2">
                      <span className="text-danger text-sm">
                        All fields marked with * are compulsory.
                      </span>
                    </div>
                    <div className="row gy-3">
                      <div className="col-sm-6">
                        <label className="form-label">
                          Ever convicted of a felony or major traffic
                          violation?*
                        </label>
                        <select
                          className="form-control"
                          name="felony"
                          value={form.felony}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Willing to undergo drug testing if required?*
                        </label>
                        <select
                          className="form-control"
                          name="drugTesting"
                          value={form.drugTesting}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Enrolled in random drug/alcohol testing program?*
                        </label>
                        <select
                          className="form-control"
                          name="enrolledTesting"
                          value={form.enrolledTesting}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Any current safety violations or outstanding
                          compliance issues?*
                        </label>
                        <select
                          className="form-control"
                          name="safetyViolations"
                          value={form.safetyViolations}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Any pending lawsuits, liens, or judgments?*
                        </label>
                        <select
                          className="form-control"
                          name="pendingLawsuits"
                          value={form.pendingLawsuits}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                      <button
                        type="button"
                        className="btn btn-neutral-500 border-neutral-100 px-32"
                        onClick={prevStep}
                        disabled={loading}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary-600 px-32"
                        onClick={nextStep}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Next"}
                      </button>
                    </div>
                  </fieldset>
                )}

                {/* Step 7: Additional Information */}
                {currentStep === 7 && (
                  <fieldset className="wizard-fieldset show">
                    <h6 className="text-md text-neutral-500 mb-3">
                      Additional Information
                    </h6>
                    <div className="mb-2">
                      <span className="text-danger text-sm">
                        All fields marked with * are compulsory.
                      </span>
                    </div>
                    <div className="row gy-3">
                      <div className="col-sm-6">
                        <label className="form-label">
                          Currently under contract with another
                          project/company?*
                        </label>
                        <select
                          className="form-control"
                          name="currentContracts"
                          value={form.currentContracts}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Available now">Available now</option>
                          <option value="Flexible soon">Flexible soon</option>
                          <option value="Locked in">Locked in</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Currently work with dispatch services or brokers?*
                        </label>
                        <select
                          className="form-control"
                          name="dispatchServices"
                          value={form.dispatchServices}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Use telematics or GPS tracking?*
                        </label>
                        <select
                          className="form-control"
                          name="telematics"
                          value={form.telematics}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label">
                          Interested in priority maintenance discounts?*
                        </label>
                        <select
                          className="form-control"
                          name="maintenanceInterest"
                          value={form.maintenanceInterest}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">
                          Additional comments, questions, or details
                        </label>
                        <textarea
                          className="form-control"
                          name="additionalComments"
                          value={form.additionalComments}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                      <button
                        type="button"
                        className="btn btn-neutral-500 border-neutral-100 px-32"
                        onClick={prevStep}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary-600 px-32"
                        onClick={nextStep}
                      >
                        Submit Application
                      </button>
                    </div>
                  </fieldset>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Final Validation Modal */}
      {showFinalValidation && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Important Information Missing</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFinalValidation(false)}
                />
              </div>
              <div className="modal-body">
                <p className="mb-3">
                  Before submitting your application, please provide the
                  following important information:
                </p>
                <ul className="list-group list-group-flush">
                  {missingFields.map((field, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span className="text-danger">⚠️ {field}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setShowFinalValidation(false);
                          // Navigate to the appropriate step based on the field
                          if (
                            [
                              "Company Name",
                              "Business EIN",
                              "MC/DOT Number",
                            ].includes(field)
                          ) {
                            setCurrentStep(1);
                          } else if (
                            [
                              "Year/Make/Model",
                              "Truck VIN Number(s)",
                              "Truck GVWR",
                            ].includes(field)
                          ) {
                            setCurrentStep(2);
                          } else if (
                            ["CDL Upload", "DOT Medical Card"].includes(field)
                          ) {
                            setCurrentStep(3);
                          } else if (
                            [
                              "Certificate of Insurance",
                              "Business Documents",
                            ].includes(field)
                          ) {
                            setCurrentStep(5);
                          }
                        }}
                      >
                        Fill Now
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
                  <small className="text-secondary">
                    You can submit your application without these fields, but
                    providing them will help expedite the review process.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowFinalValidation(false)}
                >
                  Go Back & Fill
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowFinalValidation(false);
                    navigate("/application-summary");
                  }}
                >
                  Submit Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderByFollowingStep;
