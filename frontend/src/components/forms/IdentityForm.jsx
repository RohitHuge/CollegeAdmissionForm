import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext.jsx';
import InputWrapper from '../common/InputWrapper.jsx';
import FormButton from '../common/FormButton.jsx';
import Loader from '../common/Loader.jsx';

const IdentityForm = () => {
  const { formData, updateSection, setSectionValid, showToast, currentTab, setCurrentTab } = useFormContext();
  const [enNo, setEnNo] = useState(formData.identity.enNo || '');
  const [dob, setDob] = useState(formData.identity.dob || '');
  const [checking, setChecking] = useState(false);
  const [errors, setErrors] = useState({});
  const [resumeModal, setResumeModal] = useState(false);

  // Validate fields
  const validate = () => {
    const errs = {};
    if (!enNo) errs.enNo = 'EN No. is required';
    if (!dob) errs.dob = 'Date of Birth is required';
    setErrors(errs);
    setSectionValid('identity', Object.keys(errs).length === 0);
    return Object.keys(errs).length === 0;
  };

  // On field change
  const handleChange = (setter, key) => e => {
    setter(e.target.value);
    updateSection('identity', { [key]: e.target.value });
    setTimeout(validate, 0);
  };

  // Simulate backend check on Next
  const handleNext = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      const lastDigit = enNo.trim().slice(-1);
      if (!isNaN(lastDigit) && Number(lastDigit) % 2 === 0) {
        setResumeModal(true);
      } else {
        setCurrentTab(currentTab + 1);
        showToast('Identity details saved!', 'success');
      }
    }, 1200);
  };

  // Resume handler
  const handleResume = () => {
    setResumeModal(false);
    setCurrentTab(currentTab + 1);
    showToast('Resuming your previous application!', 'info');
  };

  // Cancel handler
  const handleCancel = () => {
    setResumeModal(false);
  };

  // Validate on mount and on change
  React.useEffect(() => {
    validate();
    // eslint-disable-next-line
  }, [enNo, dob]);

  return (
    <form className="max-w-lg mx-auto" onSubmit={handleNext}>
      <InputWrapper label="EN No." error={errors.enNo} required>
        <input
          type="text"
          value={enNo}
          onChange={handleChange(setEnNo, 'enNo')}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="EN25******"
        />
      </InputWrapper>
      <InputWrapper label="Date of Birth" error={errors.dob} required>
        <input
          type="date"
          value={dob}
          onChange={handleChange(setDob, 'dob')}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </InputWrapper>
      <div className="mb-4 flex justify-end">
        <FormButton type="submit" disabled={checking}>
          {checking ? <Loader size={5} /> : 'Next'}
        </FormButton>
      </div>

      {/* Custom Resume Modal */}
      {resumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border-t-4 border-blue-500">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Resume Application</h2>
            <p className="text-gray-700 mb-6">You have an existing application. Would you like to resume?</p>
            <div className="flex justify-center gap-4 mt-6">
              <FormButton onClick={handleResume}>Yes, Resume</FormButton>
              <FormButton onClick={handleCancel} type="button">No, Stay</FormButton>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default IdentityForm; 