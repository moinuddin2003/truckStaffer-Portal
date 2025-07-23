import React, { useState } from "react";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      truckPhotos: Array.from(e.target.files),
    }));
  };

  const handleMaterialsChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const materials = new Set(prev.materialsHauled);
      if (checked) {
        materials.add(value);
      } else {
        materials.delete(value);
      }
      return { ...prev, materialsHauled: Array.from(materials) };
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

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-body">
          <h6 className="mb-4 text-xl">Owner-Operator Application</h6>
          <p className="text-neutral-500">
            Please fill out all required information to begin your application.
          </p>
          <div className="form-wizard">
            <form>
              <div className="form-wizard-header overflow-x-auto scroll-sm pb-8 my-32">
                <ul className="list-unstyled form-wizard-list style-two">
                  <li className={`form-wizard-list__item ${currentStep === 1 ? "active" : ""}`}> <div className="form-wizard-list__line"><span className="count">1</span></div><span className="text text-xs fw-semibold">Contact & Business Info</span></li>
                  <li className={`form-wizard-list__item ${currentStep === 2 ? "active" : ""}`}> <div className="form-wizard-list__line"><span className="count">2</span></div><span className="text text-xs fw-semibold">Equipment Details</span></li>
                  <li className={`form-wizard-list__item ${currentStep === 3 ? "active" : ""}`}> <div className="form-wizard-list__line"><span className="count">3</span></div><span className="text text-xs fw-semibold">CDL & Credentials</span></li>
                  <li className={`form-wizard-list__item ${currentStep === 4 ? "active" : ""}`}> <div className="form-wizard-list__line"><span className="count">4</span></div><span className="text text-xs fw-semibold">Operational Capacity</span></li>
                  <li className={`form-wizard-list__item ${currentStep === 5 ? "active" : ""}`}> <div className="form-wizard-list__line"><span className="count">5</span></div><span className="text text-xs fw-semibold">Insurance & Compliance</span></li>
                  <li className={`form-wizard-list__item ${currentStep === 6 ? "active" : ""}`}> <div className="form-wizard-list__line"><span className="count">6</span></div><span className="text text-xs fw-semibold">Screening & Safety</span></li>
                  <li className={`form-wizard-list__item ${currentStep === 7 ? "active" : ""}`}> <div className="form-wizard-list__line"><span className="count">7</span></div><span className="text text-xs fw-semibold">Additional Info</span></li>
                  <li className={`form-wizard-list__item ${currentStep === 8 ? "active" : ""}`}> <div className="form-wizard-list__line"><span className="count">8</span></div><span className="text text-xs fw-semibold">Confirmation</span></li>
                </ul>
              </div>
              {currentStep === 1 && (
                <fieldset className="wizard-fieldset show">
                  <h6 className="text-md text-neutral-500 mb-3">Basic Contact & Business Info</h6>
                  <div className="row gy-3">
                    <div className="col-sm-6">
                      <label className="form-label">Full Name*</label>
                      <input type="text" className="form-control" name="fullName" value={form.fullName} onChange={handleChange} required />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Business/Company Name</label>
                      <input type="text" className="form-control" name="companyName" value={form.companyName} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Company Address</label>
                      <input type="text" className="form-control" name="companyAddress" value={form.companyAddress} onChange={handleChange} />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Owner’s Name</label>
                      <input type="text" className="form-control" name="ownerName" value={form.ownerName} onChange={handleChange} />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Business EIN</label>
                      <input type="text" className="form-control" name="businessEIN" value={form.businessEIN} onChange={handleChange} />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Phone*</label>
                      <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Email*</label>
                      <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Company Website</label>
                      <input type="text" className="form-control" name="website" value={form.website} onChange={handleChange} />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Business Structure</label>
                      <select className="form-control" name="businessStructure" value={form.businessStructure} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="LLC">LLC</option>
                        <option value="Sole Proprietor">Sole Proprietor</option>
                        <option value="Corporation">Corporation</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">MC or DOT Number</label>
                      <input type="text" className="form-control" name="mcDotNumber" value={form.mcDotNumber} onChange={handleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">How did you hear about TruckStaffer?</label>
                      <input type="text" className="form-control" name="referralSource" value={form.referralSource} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group text-end mt-4">
                    <button type="button" className="btn btn-primary-600 px-32" onClick={nextStep}>
                      Next
                    </button>
                  </div>
                </fieldset>
              )}
              {currentStep === 2 && (
                <fieldset className="wizard-fieldset show">
                  <h6 className="text-md text-neutral-500 mb-3">Equipment Details</h6>
                  <div className="row gy-3">
                    <div className="col-sm-6">
                      <label className="form-label">Do you currently own or lease a dump truck?</label>
                      <select className="form-control" name="ownership" value={form.ownership} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Own">Own</option>
                        <option value="Lease">Lease</option>
                        <option value="Looking to Purchase/Lease">Looking to Purchase/Lease</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Equipment Type</label>
                      <input type="text" className="form-control" name="equipmentType" value={form.equipmentType} onChange={handleChange} placeholder="Tri-Axle, Quad-Axle, etc." />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Year/Make/Model</label>
                      <input type="text" className="form-control" name="yearMakeModel" value={form.yearMakeModel} onChange={handleChange} />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Truck VIN Number(s)</label>
                      <input type="text" className="form-control" name="vin" value={form.vin} onChange={handleChange} />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Truck GVWR</label>
                      <input type="text" className="form-control" name="gvwr" value={form.gvwr} onChange={handleChange} />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Is your truck equipped with a tarp system?</label>
                      <select className="form-control" name="tarp" value={form.tarp} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Do you have additional trucks available?</label>
                      <select className="form-control" name="additionalTrucks" value={form.additionalTrucks} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Do you have a current DOT inspection certificate?</label>
                      <select className="form-control" name="dotInspection" value={form.dotInspection} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Do you have backup trucks or access to rentals?</label>
                      <select className="form-control" name="backupTrucks" value={form.backupTrucks} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Upload photos of your truck (optional)</label>
                      <input type="file" className="form-control" multiple onChange={handleFileChange} />
                    </div>
                  </div>
                  <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                    <button type="button" className="btn btn-neutral-500 border-neutral-100 px-32" onClick={prevStep}>Back</button>
                    <button type="button" className="btn btn-primary-600 px-32" onClick={nextStep}>Next</button>
                  </div>
                </fieldset>
              )}
              {currentStep === 3 && (
                <fieldset className="wizard-fieldset show">
                  <h6 className="text-md text-neutral-500 mb-3">CDL & Driver Credentials</h6>
                  <div className="row gy-3">
                    <div className="col-sm-6">
                      <label className="form-label">Do you have a valid CDL?</label>
                      <select className="form-control" name="cdlStatus" value={form.cdlStatus} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Class A">Class A</option>
                        <option value="Class B">Class B</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Ever had your CDL suspended or revoked?</label>
                      <select className="form-control" name="cdlSuspended" value={form.cdlSuspended} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Years in trucking/dump hauling business</label>
                      <input type="number" className="form-control" name="yearsExperience" value={form.yearsExperience} onChange={handleChange} min="0" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">What types of materials have you hauled?</label>
                      <div className="d-flex flex-wrap gap-3">
                        {['Dirt', 'Stone', 'Asphalt', 'Sand', 'Other'].map((mat) => (
                          <div key={mat} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`mat-${mat}`}
                              value={mat}
                              checked={form.materialsHauled.includes(mat)}
                              onChange={handleMaterialsChange}
                            />
                            <label className="form-check-label" htmlFor={`mat-${mat}`}>{mat}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Worked on government or DOT contracts?</label>
                      <select className="form-control" name="govContracts" value={form.govContracts} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Upload CDL</label>
                      <input type="file" className="form-control" onChange={handleCDLFile} />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Upload DOT Medical Card</label>
                      <input type="file" className="form-control" onChange={handleMedCardFile} />
                    </div>
                  </div>
                  <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                    <button type="button" className="btn btn-neutral-500 border-neutral-100 px-32" onClick={prevStep}>Back</button>
                    <button type="button" className="btn btn-primary-600 px-32" onClick={nextStep}>Next</button>
                  </div>
                </fieldset>
              )}
              {currentStep === 4 && (
                <fieldset className="wizard-fieldset show">
                  <h6 className="text-md text-neutral-500 mb-3">Operational Capacity</h6>
                  <div className="row gy-3">
                    <div className="col-sm-6">
                      <label className="form-label">Number of employees/drivers (including yourself)</label>
                      <input type="number" className="form-control" name="numEmployees" value={form.numEmployees} onChange={handleChange} min="1" />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Preferred Work Radius</label>
                      <select className="form-control" name="workRadius" value={form.workRadius} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Local">Local</option>
                        <option value="Regional">Regional</option>
                        <option value="OTR">OTR</option>
                        <option value="Willing to travel">Willing to travel</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Willing to work 10–12 hour shifts?</label>
                      <select className="form-control" name="shiftWillingness" value={form.shiftWillingness} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Maybe">Maybe</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Regions/states you are willing to work in</label>
                      <input type="text" className="form-control" name="regions" value={form.regions} onChange={handleChange} placeholder="List regions or states" />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">When would you be ready to start?</label>
                      <select className="form-control" name="startDate" value={form.startDate} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Immediately">Immediately</option>
                        <option value="1–2 weeks">1–2 weeks</option>
                        <option value="30 days">30 days</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Expected weekly availability</label>
                      <select className="form-control" name="weeklyAvailability" value={form.weeklyAvailability} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="3–4 days">3–4 days</option>
                        <option value="5–6 days">5–6 days</option>
                        <option value="Full-time">Full-time</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                    <button type="button" className="btn btn-neutral-500 border-neutral-100 px-32" onClick={prevStep}>Back</button>
                    <button type="button" className="btn btn-primary-600 px-32" onClick={nextStep}>Next</button>
                  </div>
                </fieldset>
              )}
              {currentStep === 5 && (
                <fieldset className="wizard-fieldset show">
                  <h6 className="text-md text-neutral-500 mb-3">Insurance & Compliance</h6>
                  <div className="row gy-3">
                    <div className="col-sm-6">
                      <label className="form-label">Current insurance coverage</label>
                      <select className="form-control" name="insuranceCoverage" value={form.insuranceCoverage} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="$1M Liability">Yes – $1M Liability</option>
                        <option value="Less than $1M">Less than $1M</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Do you also have cargo coverage?</label>
                      <select className="form-control" name="cargoCoverage" value={form.cargoCoverage} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Insurance policy expiration date</label>
                      <input type="date" className="form-control" name="insuranceExpiration" value={form.insuranceExpiration} onChange={handleChange} />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Do you carry Workman's Comp or Occupational Accident Policy?</label>
                      <select className="form-control" name="workmansComp" value={form.workmansComp} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Not sure">Not sure</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Willing to add TruckStaffer as Certificate Holder?</label>
                      <select className="form-control" name="addTruckStaffer" value={form.addTruckStaffer} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Upload Certificate of Insurance (COI)</label>
                      <input type="file" className="form-control" onChange={handleCOIFile} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Upload Required Business Documents (W9, LLC, EIN, etc.)</label>
                      <input type="file" className="form-control" multiple onChange={handleBusinessDocs} />
                    </div>
                  </div>
                  <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                    <button type="button" className="btn btn-neutral-500 border-neutral-100 px-32" onClick={prevStep}>Back</button>
                    <button type="button" className="btn btn-primary-600 px-32" onClick={nextStep}>Next</button>
                  </div>
                </fieldset>
              )}
              {currentStep === 6 && (
                <fieldset className="wizard-fieldset show">
                  <h6 className="text-md text-neutral-500 mb-3">Screening & Safety</h6>
                  <div className="row gy-3">
                    <div className="col-sm-6">
                      <label className="form-label">Ever convicted of a felony or major traffic violation?</label>
                      <select className="form-control" name="felony" value={form.felony} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Willing to undergo drug testing if required?</label>
                      <select className="form-control" name="drugTesting" value={form.drugTesting} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Enrolled in random drug/alcohol testing program?</label>
                      <select className="form-control" name="enrolledTesting" value={form.enrolledTesting} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Any current safety violations or outstanding compliance issues?</label>
                      <select className="form-control" name="safetyViolations" value={form.safetyViolations} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Any pending lawsuits, liens, or judgments?</label>
                      <select className="form-control" name="pendingLawsuits" value={form.pendingLawsuits} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                    <button type="button" className="btn btn-neutral-500 border-neutral-100 px-32" onClick={prevStep}>Back</button>
                    <button type="button" className="btn btn-primary-600 px-32" onClick={nextStep}>Next</button>
                  </div>
                </fieldset>
              )}
              {currentStep === 7 && (
                <fieldset className="wizard-fieldset show">
                  <h6 className="text-md text-neutral-500 mb-3">Additional Information</h6>
                  <div className="row gy-3">
                    <div className="col-sm-6">
                      <label className="form-label">Currently under contract with another project/company?</label>
                      <select className="form-control" name="currentContracts" value={form.currentContracts} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Available now">Available now</option>
                        <option value="Flexible soon">Flexible soon</option>
                        <option value="Locked in">Locked in</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Currently work with dispatch services or brokers?</label>
                      <select className="form-control" name="dispatchServices" value={form.dispatchServices} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Use telematics or GPS tracking?</label>
                      <select className="form-control" name="telematics" value={form.telematics} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Interested in priority maintenance discounts?</label>
                      <select className="form-control" name="maintenanceInterest" value={form.maintenanceInterest} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Additional comments, questions, or details</label>
                      <textarea className="form-control" name="additionalComments" value={form.additionalComments} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                    <button type="button" className="btn btn-neutral-500 border-neutral-100 px-32" onClick={prevStep}>Back</button>
                    <button type="button" className="btn btn-primary-600 px-32" onClick={nextStep}>Next</button>
                  </div>
                </fieldset>
              )}
              {currentStep === 8 && (
                <fieldset className="wizard-fieldset show">
                  <h6 className="text-md text-neutral-500 mb-3">Confirmation</h6>
                  <div className="row gy-3">
                    <div className="bg-light confirmation-dark-bg p-4 rounded text-center">
                      <h5 className="mb-2">Thank you for submitting your application!</h5>
                      <p className="mb-0">We will review your information and contact you soon.</p>
                    </div>
                  </div>
                  <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-4">
                    <button type="button" className="btn btn-neutral-500 border-neutral-100 px-32" onClick={prevStep}>Back</button>
                    <button type="button" className="btn btn-primary-600 px-32" disabled>Submit (API coming soon)</button>
                  </div>
                </fieldset>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderByFollowingStep;
