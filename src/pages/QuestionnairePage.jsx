import React, { useState, useEffect } from "react";
import MasterLayout from "../masterLayout/MasterLayout";

const QuestionnairePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Contact & Business Info
    fullName: "",
    businessName: "",
    companyAddress: "",
    ownerName: "",
    ownerContact: "",
    businessEIN: "",
    contactPhone: "",
    email: "",
    companyWebsite: "",
    businessStructure: "",
    mcDotNumber: "",
    howDidYouHear: "",
    
    // Step 2: Equipment Details
    truckOwnership: "",
    equipmentType: "",
    truckYear: "",
    truckMake: "",
    truckModel: "",
    truckVIN: "",
    truckGVWR: "",
    tarpSystem: "",
    additionalTrucks: "",
    dotInspection: "",
    backupTrucks: "",
    
    // Step 3: CDL & Driver Credentials
    cdlClass: "",
    cdlSuspended: "",
    yearsExperience: "",
    hauledMaterials: "",
    materialsHauled: [],
    governmentContracts: "",
    
    // Step 4: Operational Capacity
    employeesCount: "",
    workRadius: "",
    willingToWorkShifts: "",
    regionsWilling: [],
    readyToStart: "",
    weeklyAvailability: "",
    
    // Step 5: Insurance & Compliance
    insuranceCoverage: "",
    cargoCoverage: "",
    insuranceExpiry: "",
    workmansComp: "",
    addTruckStaffer: "",
    
    // Step 6: Screening & Safety
    felonyConviction: "",
    drugTesting: "",
    randomDrugProgram: "",
    safetyViolations: "",
    pendingLawsuits: "",
    
    // Step 7: Additional Information
    currentContract: "",
    dispatchServices: "",
    telematics: "",
    maintenanceDiscounts: "",
    additionalComments: "",
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((currentStep / 8) * 100);
  }, [currentStep]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Save to localStorage for now (will be replaced with API call later)
    localStorage.setItem('truckStafferApplication', JSON.stringify(formData));
    alert('Application submitted successfully!');
  };

  const renderStep1 = () => (
    <div className="row gy-3">
      <div className="col-12">
        <h6 className="text-md text-neutral-500 mb-4">Basic Contact & Business Information</h6>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Full Name (First & Last)*</label>
        <input
          type="text"
          className="form-control"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>
      <div className="col-sm-6">
        <label className="form-label">Business/Company Name</label>
        <input
          type="text"
          className="form-control"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          placeholder="Enter business name (optional)"
        />
      </div>
      <div className="col-12">
        <label className="form-label">Company Address*</label>
        <textarea
          className="form-control"
          value={formData.companyAddress}
          onChange={(e) => handleInputChange('companyAddress', e.target.value)}
          placeholder="Enter complete company address"
          rows="3"
          required
        />
      </div>
      <div className="col-sm-6">
        <label className="form-label">Owner's Full Name & Contact</label>
        <input
          type="text"
          className="form-control"
          value={formData.ownerName}
          onChange={(e) => handleInputChange('ownerName', e.target.value)}
          placeholder="If different from applicant"
        />
      </div>
      <div className="col-sm-6">
        <label className="form-label">Business EIN*</label>
        <input
          type="text"
          className="form-control"
          value={formData.businessEIN}
          onChange={(e) => handleInputChange('businessEIN', e.target.value)}
          placeholder="Employer Identification Number"
          required
        />
      </div>
      <div className="col-sm-6">
        <label className="form-label">Best Contact Phone*</label>
        <input
          type="tel"
          className="form-control"
          value={formData.contactPhone}
          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
          placeholder="Enter phone number"
          required
        />
      </div>
      <div className="col-sm-6">
        <label className="form-label">Email Address*</label>
        <input
          type="email"
          className="form-control"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Used for portal login & notifications"
          required
        />
      </div>
      <div className="col-sm-6">
        <label className="form-label">Company Website</label>
        <input
          type="url"
          className="form-control"
          value={formData.companyWebsite}
          onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
          placeholder="If available"
        />
      </div>
      <div className="col-sm-6">
        <label className="form-label">Business Structure*</label>
        <select
          className="form-control form-select"
          value={formData.businessStructure}
          onChange={(e) => handleInputChange('businessStructure', e.target.value)}
          required
        >
          <option value="">Select business structure</option>
          <option value="LLC">LLC</option>
          <option value="Sole Proprietor">Sole Proprietor</option>
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
          value={formData.mcDotNumber}
          onChange={(e) => handleInputChange('mcDotNumber', e.target.value)}
          placeholder="If applicable"
        />
      </div>
      <div className="col-sm-6">
        <label className="form-label">How did you hear about TruckStaffer?*</label>
        <select
          className="form-control form-select"
          value={formData.howDidYouHear}
          onChange={(e) => handleInputChange('howDidYouHear', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Dealership/Leasing Partner">Dealership/Leasing Partner</option>
          <option value="Referral">Referral</option>
          <option value="Social Media">Social Media</option>
          <option value="Indeed">Indeed</option>
          <option value="Network">Network</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="row gy-3">
      <div className="col-12">
        <h6 className="text-md text-neutral-500 mb-4">Equipment Details</h6>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Do you currently own or lease a dump truck?*</label>
        <select
          className="form-control form-select"
          value={formData.truckOwnership}
          onChange={(e) => handleInputChange('truckOwnership', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Own">Own</option>
          <option value="Lease">Lease</option>
          <option value="Looking to Purchase/Lease">Looking to Purchase/Lease</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Equipment Type*</label>
        <select
          className="form-control form-select"
          value={formData.equipmentType}
          onChange={(e) => handleInputChange('equipmentType', e.target.value)}
          required
        >
          <option value="">Select equipment type</option>
          <option value="Tri-Axle">Tri-Axle</option>
          <option value="Quad-Axle">Quad-Axle</option>
          <option value="Tandem">Tandem</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="col-sm-4">
        <label className="form-label">Truck Year*</label>
        <input
          type="number"
          className="form-control"
          value={formData.truckYear}
          onChange={(e) => handleInputChange('truckYear', e.target.value)}
          placeholder="Year"
          min="1990"
          max="2024"
          required
        />
      </div>
      <div className="col-sm-4">
        <label className="form-label">Truck Make*</label>
        <input
          type="text"
          className="form-control"
          value={formData.truckMake}
          onChange={(e) => handleInputChange('truckMake', e.target.value)}
          placeholder="Make"
          required
        />
      </div>
      <div className="col-sm-4">
        <label className="form-label">Truck Model*</label>
        <input
          type="text"
          className="form-control"
          value={formData.truckModel}
          onChange={(e) => handleInputChange('truckModel', e.target.value)}
          placeholder="Model"
          required
        />
      </div>
      <div className="col-12">
        <label className="form-label">Truck VIN Number(s)*</label>
        <textarea
          className="form-control"
          value={formData.truckVIN}
          onChange={(e) => handleInputChange('truckVIN', e.target.value)}
          placeholder="If multiple trucks, list all VINs"
          rows="2"
          required
        />
      </div>
      <div className="col-sm-6">
        <label className="form-label">Truck GVWR*</label>
        <input
          type="text"
          className="form-control"
          value={formData.truckGVWR}
          onChange={(e) => handleInputChange('truckGVWR', e.target.value)}
          placeholder="Gross Vehicle Weight Rating"
          required
        />
      </div>
      <div className="col-sm-6">
        <label className="form-label">Is your truck equipped with a tarp system?*</label>
        <select
          className="form-control form-select"
          value={formData.tarpSystem}
          onChange={(e) => handleInputChange('tarpSystem', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Do you have additional trucks available?*</label>
        <select
          className="form-control form-select"
          value={formData.additionalTrucks}
          onChange={(e) => handleInputChange('additionalTrucks', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Do you have a current DOT inspection certificate?*</label>
        <select
          className="form-control form-select"
          value={formData.dotInspection}
          onChange={(e) => handleInputChange('dotInspection', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-12">
        <label className="form-label">Do you have backup trucks or access to rentals if your primary truck breaks down?*</label>
        <select
          className="form-control form-select"
          value={formData.backupTrucks}
          onChange={(e) => handleInputChange('backupTrucks', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="row gy-3">
      <div className="col-12">
        <h6 className="text-md text-neutral-500 mb-4">CDL & Driver Credentials</h6>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Do you have a valid CDL?*</label>
        <select
          className="form-control form-select"
          value={formData.cdlClass}
          onChange={(e) => handleInputChange('cdlClass', e.target.value)}
          required
        >
          <option value="">Select CDL class</option>
          <option value="Class A">Class A</option>
          <option value="Class B">Class B</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Have you ever had your CDL suspended or revoked?*</label>
        <select
          className="form-control form-select"
          value={formData.cdlSuspended}
          onChange={(e) => handleInputChange('cdlSuspended', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">How many years have you been in the trucking/dump hauling business?*</label>
        <select
          className="form-control form-select"
          value={formData.yearsExperience}
          onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
          required
        >
          <option value="">Select years</option>
          <option value="Less than 1 year">Less than 1 year</option>
          <option value="1-2 years">1-2 years</option>
          <option value="3-5 years">3-5 years</option>
          <option value="6-10 years">6-10 years</option>
          <option value="More than 10 years">More than 10 years</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Have you hauled materials for highway or construction projects before?*</label>
        <select
          className="form-control form-select"
          value={formData.hauledMaterials}
          onChange={(e) => handleInputChange('hauledMaterials', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-12">
        <label className="form-label">What types of materials have you hauled? (Select all that apply)</label>
        <div className="row">
          {['Dirt', 'Stone', 'Asphalt', 'Sand', 'Other'].map((material) => (
            <div key={material} className="col-sm-6">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={material}
                  checked={formData.materialsHauled.includes(material)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...formData.materialsHauled, material]
                      : formData.materialsHauled.filter(m => m !== material);
                    handleInputChange('materialsHauled', updated);
                  }}
                />
                <label className="form-check-label" htmlFor={material}>
                  {material}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-12">
        <label className="form-label">Have you worked on government or DOT contracts before?*</label>
        <select
          className="form-control form-select"
          value={formData.governmentContracts}
          onChange={(e) => handleInputChange('governmentContracts', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="row gy-3">
      <div className="col-12">
        <h6 className="text-md text-neutral-500 mb-4">Operational Capacity</h6>
      </div>
      <div className="col-sm-6">
        <label className="form-label">How many employees or drivers (including yourself) are in your company?*</label>
        <select
          className="form-control form-select"
          value={formData.employeesCount}
          onChange={(e) => handleInputChange('employeesCount', e.target.value)}
          required
        >
          <option value="">Select number</option>
          <option value="1">1 (Just me)</option>
          <option value="2-5">2-5</option>
          <option value="6-10">6-10</option>
          <option value="11-20">11-20</option>
          <option value="More than 20">More than 20</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Preferred Work Radius*</label>
        <select
          className="form-control form-select"
          value={formData.workRadius}
          onChange={(e) => handleInputChange('workRadius', e.target.value)}
          required
        >
          <option value="">Select radius</option>
          <option value="Local">Local</option>
          <option value="Regional">Regional</option>
          <option value="OTR">OTR</option>
          <option value="Willing to travel">Willing to travel</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Are you willing to work 10–12 hour shifts?*</label>
        <select
          className="form-control form-select"
          value={formData.willingToWorkShifts}
          onChange={(e) => handleInputChange('willingToWorkShifts', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Maybe">Maybe</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">When would you be ready to start?*</label>
        <select
          className="form-control form-select"
          value={formData.readyToStart}
          onChange={(e) => handleInputChange('readyToStart', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Immediately">Immediately</option>
          <option value="1–2 weeks">1–2 weeks</option>
          <option value="30 days">30 days</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="col-12">
        <label className="form-label">What is your expected weekly availability?*</label>
        <select
          className="form-control form-select"
          value={formData.weeklyAvailability}
          onChange={(e) => handleInputChange('weeklyAvailability', e.target.value)}
          required
        >
          <option value="">Select availability</option>
          <option value="3–4 days">3–4 days</option>
          <option value="5–6 days">5–6 days</option>
          <option value="Full-time">Full-time</option>
        </select>
      </div>
      <div className="col-12">
        <label className="form-label">What regions/states are you currently working in or willing to work in?</label>
        <textarea
          className="form-control"
          value={formData.regionsWilling.join(', ')}
          onChange={(e) => handleInputChange('regionsWilling', e.target.value.split(',').map(r => r.trim()))}
          placeholder="List states or regions (e.g., Texas, Louisiana, Oklahoma)"
          rows="3"
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="row gy-3">
      <div className="col-12">
        <h6 className="text-md text-neutral-500 mb-4">Insurance & Compliance</h6>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Do you have current insurance coverage?*</label>
        <select
          className="form-control form-select"
          value={formData.insuranceCoverage}
          onChange={(e) => handleInputChange('insuranceCoverage', e.target.value)}
          required
        >
          <option value="">Select coverage</option>
          <option value="Yes – $1M Liability">Yes – $1M Liability</option>
          <option value="Less than $1M">Less than $1M</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Do you also have cargo coverage in addition to liability?*</label>
        <select
          className="form-control form-select"
          value={formData.cargoCoverage}
          onChange={(e) => handleInputChange('cargoCoverage', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Expiration date of current insurance policy*</label>
        <input
          type="date"
          className="form-control"
          value={formData.insuranceExpiry}
          onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
          required
        />
      </div>
      <div className="col-sm-6">
        <label className="form-label">Do you carry Workman's Comp or Occupational Accident Policy?*</label>
        <select
          className="form-control form-select"
          value={formData.workmansComp}
          onChange={(e) => handleInputChange('workmansComp', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Not sure">Not sure</option>
        </select>
      </div>
      <div className="col-12">
        <label className="form-label">Would you be willing to add TruckStaffer as a Certificate Holder on your policy?*</label>
        <select
          className="form-control form-select"
          value={formData.addTruckStaffer}
          onChange={(e) => handleInputChange('addTruckStaffer', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="row gy-3">
      <div className="col-12">
        <h6 className="text-md text-neutral-500 mb-4">Screening & Safety</h6>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Have you ever been convicted of a felony or major traffic violation?*</label>
        <select
          className="form-control form-select"
          value={formData.felonyConviction}
          onChange={(e) => handleInputChange('felonyConviction', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Are you willing to undergo drug testing if required?*</label>
        <select
          className="form-control form-select"
          value={formData.drugTesting}
          onChange={(e) => handleInputChange('drugTesting', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Are you enrolled in a random drug/alcohol testing program?*</label>
        <select
          className="form-control form-select"
          value={formData.randomDrugProgram}
          onChange={(e) => handleInputChange('randomDrugProgram', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Do you have any current safety violations or outstanding compliance issues?*</label>
        <select
          className="form-control form-select"
          value={formData.safetyViolations}
          onChange={(e) => handleInputChange('safetyViolations', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-12">
        <label className="form-label">Do you have any pending lawsuits, liens, or judgments against your company?*</label>
        <select
          className="form-control form-select"
          value={formData.pendingLawsuits}
          onChange={(e) => handleInputChange('pendingLawsuits', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="row gy-3">
      <div className="col-12">
        <h6 className="text-md text-neutral-500 mb-4">Additional Information</h6>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Are you currently under contract with another project or company?*</label>
        <select
          className="form-control form-select"
          value={formData.currentContract}
          onChange={(e) => handleInputChange('currentContract', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Available now">Available now</option>
          <option value="Flexible soon">Flexible soon</option>
          <option value="Locked in">Locked in</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Do you currently work with any dispatch services or brokers?*</label>
        <select
          className="form-control form-select"
          value={formData.dispatchServices}
          onChange={(e) => handleInputChange('dispatchServices', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Do you use any telematics or GPS tracking on your truck?*</label>
        <select
          className="form-control form-select"
          value={formData.telematics}
          onChange={(e) => handleInputChange('telematics', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-sm-6">
        <label className="form-label">Would you be interested in priority maintenance discounts as part of the TruckStaffer network?*</label>
        <select
          className="form-control form-select"
          value={formData.maintenanceDiscounts}
          onChange={(e) => handleInputChange('maintenanceDiscounts', e.target.value)}
          required
        >
          <option value="">Select option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="col-12">
        <label className="form-label">Any additional comments, questions, or details you'd like to share?</label>
        <textarea
          className="form-control"
          value={formData.additionalComments}
          onChange={(e) => handleInputChange('additionalComments', e.target.value)}
          placeholder="Additional information or questions"
          rows="4"
        />
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="text-center">
      <div className="mb-4">
        <img
          src="assets/images/gif/success-img3.gif"
          alt="Success"
          className="gif-image mb-24"
          style={{ width: '100px', height: '100px' }}
        />
        <h6 className="text-md text-neutral-600">Application Complete!</h6>
        <p className="text-neutral-400 text-sm mb-0">
          Thank you for completing the TruckStaffer application. We will review your information and contact you soon.
        </p>
      </div>
      <div className="alert alert-info">
        <strong>Next Steps:</strong>
        <ul className="mb-0 mt-2">
          <li>Upload required documents (CDL, Med Card, W9, Insurance, etc.)</li>
          <li>Schedule an interview via our integrated calendar</li>
          <li>Receive status updates and notifications</li>
        </ul>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      case 8: return renderStep8();
      default: return renderStep1();
    }
  };

  const stepTitles = [
    "Basic Contact & Business Info",
    "Equipment Details", 
    "CDL & Driver Credentials",
    "Operational Capacity",
    "Insurance & Compliance",
    "Screening & Safety",
    "Additional Information",
    "Confirmation & Next Steps"
  ];

  return (
    <MasterLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-4">TruckStaffer Owner-Operator Application</h4>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-sm">Progress: {Math.round(progress)}%</span>
                    <span className="text-sm">Step {currentStep} of 8</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Step Indicator */}
                <div className="form-wizard-header overflow-x-auto scroll-sm pb-8 my-32">
                  <ul className="list-unstyled form-wizard-list d-flex">
                    {stepTitles.map((title, index) => (
                      <li
                        key={index}
                        className={`form-wizard-list__item ${
                          currentStep > index + 1 ? "activated" : ""
                        } ${currentStep === index + 1 ? "active" : ""}`}
                      >
                        <div className="form-wizard-list__line">
                          <span className="count">{index + 1}</span>
                        </div>
                        <span className="text text-xs fw-semibold d-none d-md-block">
                          {title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Form Content */}
                <div className="form-wizard">
                  <form>
                    <fieldset className="wizard-fieldset show">
                      <h6 className="text-md text-neutral-500 mb-4">
                        {stepTitles[currentStep - 1]}
                      </h6>
                      {renderCurrentStep()}
                      
                      {/* Navigation Buttons */}
                      <div className="form-group d-flex align-items-center justify-content-between mt-4">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handlePrev}
                          disabled={currentStep === 1}
                        >
                          Previous
                        </button>
                        
                        <div>
                          {currentStep < 8 ? (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleNext}
                            >
                              Next
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={handleSubmit}
                            >
                              Submit Application
                            </button>
                          )}
                        </div>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default QuestionnairePage; 