import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext.jsx';
import InputWrapper from '../common/InputWrapper.jsx';
import FormButton from '../common/FormButton.jsx';

const religions = [
  'Hindu', 'Muslim', 'Sikh', 'Christian', 'Buddha', 'Jain', 'Parsi', 'Sindhi'
];
const categories = [
  'Open', 'SC', 'ST', 'NT', 'VJ', 'OBC', 'SBC', 'J&K', 'PMSSS', 'TFWS', 'IL', 'EBC', 'SEBC', 'EWS', 'Others'
];
const candidateTypes = ['Type A', 'Type B', 'Type C', 'Type D', 'OMS'];
const genders = ['Male', 'Female', 'Transgender'];

const PersonalDetailsForm = () => {
  const { formData, updateSection, setSectionValid, showToast, currentTab, setCurrentTab } = useFormContext();
  const [fields, setFields] = useState({
    firstName: formData.personal.firstName || '',
    middleName: formData.personal.middleName || '',
    lastName: formData.personal.lastName || '',
    motherName: formData.personal.motherName || '',
    studentMobile: formData.personal.studentMobile || '',
    parentMobile: formData.personal.parentMobile || '',
    gender: formData.personal.gender || '',
    address: formData.personal.address || '',
    religion: formData.personal.religion || '',
    category: formData.personal.category || '',
    candidateType: formData.personal.candidateType || '',
  });
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const errs = {};
    if (!fields.firstName) errs.firstName = 'First name is required.';
    if (!fields.lastName) errs.lastName = 'Last name is required.';
    if (!fields.motherName) errs.motherName = "Mother's name is required.";
    if (!/^\d{10}$/.test(fields.studentMobile)) errs.studentMobile = 'Enter valid 10-digit mobile number.';
    if (!/^\d{10}$/.test(fields.parentMobile)) errs.parentMobile = 'Enter valid 10-digit mobile number.';
    if (!fields.gender) errs.gender = 'Select gender.';
    if (!fields.address) errs.address = 'Address is required.';
    if (!fields.religion) errs.religion = 'Select religion.';
    if (!fields.category) errs.category = 'Select category.';
    if (!fields.candidateType) errs.candidateType = 'Select candidate type.';
    setErrors(errs);
    setSectionValid('personal', Object.keys(errs).length === 0);
    return Object.keys(errs).length === 0;
  };

  // On field change
  const handleChange = key => e => {
    const value = e.target.value;
    setFields(prev => ({ ...prev, [key]: value }));
    updateSection('personal', { [key]: value });
    setTimeout(validate, 0);
  };

  // On Next
  const handleNext = e => {
    e.preventDefault();
    if (!validate()) return;
    setCurrentTab(currentTab + 1);
    showToast('Personal details saved!', 'success');
  };

  React.useEffect(() => {
    validate();
    // eslint-disable-next-line
  }, [fields]);

  return (
    <form className="max-w-lg mx-auto" onSubmit={handleNext}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputWrapper label="First Name" error={errors.firstName} required>
          <input type="text" value={fields.firstName} onChange={handleChange('firstName')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="Middle Name">
          <input type="text" value={fields.middleName} onChange={handleChange('middleName')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="Last Name" error={errors.lastName} required>
          <input type="text" value={fields.lastName} onChange={handleChange('lastName')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="Mother's Name" error={errors.motherName} required>
          <input type="text" value={fields.motherName} onChange={handleChange('motherName')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="Student Mobile Number" error={errors.studentMobile} required>
          <input type="tel" value={fields.studentMobile} onChange={handleChange('studentMobile')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" maxLength={10} />
        </InputWrapper>
        <InputWrapper label="Parent Mobile Number" error={errors.parentMobile} required>
          <input type="tel" value={fields.parentMobile} onChange={handleChange('parentMobile')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" maxLength={10} />
        </InputWrapper>
        <InputWrapper label="Gender" error={errors.gender} required>
          <div className="flex gap-4 mt-2">
            {genders.map(g => (
              <label key={g} className="flex items-center">
                <input type="radio" name="gender" value={g} checked={fields.gender === g} onChange={handleChange('gender')} className="accent-blue-500 mr-1" />
                <span className="text-gray-700 text-sm">{g}</span>
              </label>
            ))}
          </div>
        </InputWrapper>
        <InputWrapper label="Address for Correspondence" error={errors.address} required>
          <textarea value={fields.address} onChange={handleChange('address')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" rows={2} />
        </InputWrapper>
        <InputWrapper label="Religion" error={errors.religion} required>
          <select value={fields.religion} onChange={handleChange('religion')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Select</option>
            {religions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </InputWrapper>
        <InputWrapper label="Category" error={errors.category} required>
          <select value={fields.category} onChange={handleChange('category')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Select</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </InputWrapper>
        <InputWrapper label="Candidate Type" error={errors.candidateType} required>
          <div className="flex gap-4 mt-2 flex-wrap">
            {candidateTypes.map(type => (
              <label key={type} className="flex items-center">
                <input type="radio" name="candidateType" value={type} checked={fields.candidateType === type} onChange={handleChange('candidateType')} className="accent-blue-500 mr-1" />
                <span className="text-gray-700 text-sm">{type}</span>
              </label>
            ))}
          </div>
        </InputWrapper>
      </div>
      <div className="mb-4 flex justify-end">
        <FormButton type="submit">Next</FormButton>
      </div>
    </form>
  );
};

export default PersonalDetailsForm; 