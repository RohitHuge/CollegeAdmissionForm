import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext.jsx';
import InputWrapper from '../common/InputWrapper.jsx';
import FormButton from '../common/FormButton.jsx';
import { BACKEND_URL } from '../../../config.js';

const HSCForm = React.lazy(() => import('./HSCForm.jsx'));
const DiplomaForm = React.lazy(() => import('./DiplomaForm.jsx'));

const EducationForm = () => {
  const { formData, updateSection, setSectionValid, showToast, currentTab, setCurrentTab, validation } = useFormContext();
  const [exam, setExam] = useState(formData.education.exam || '');
  const [childValid, setChildValid] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate
  const validate = () => {
    const errs = {};
    if (!exam) errs.exam = 'Select your last qualifying exam.';
    if (!childValid) errs.child = 'Please complete the form below.';
    setErrors(errs);
    setSectionValid('education', Object.keys(errs).length === 0);
    return Object.keys(errs).length === 0;
  };

  // On exam change
  const handleExam = e => {
    setExam(e.target.value);
    updateSection('education', { exam: e.target.value });
    setTimeout(validate, 0);
  };

  // On Next
  const handleNext = async e => {
    e.preventDefault();
    if (!validate()) return;
    console.log(exam, formData.diploma , formData.hsc);
    const response = await fetch(`${BACKEND_URL}/api/forms/educationform`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({exam, enNo: formData.identity.enNo, diploma: formData.diploma, hsc: formData.hsc}),
    });
    const data = await response.json();
    if (response.ok) {
      setCurrentTab(currentTab + 1);
      showToast('Education details saved!', 'success');
    } else {
      showToast(data.message, 'error');
    }
  };

  React.useEffect(() => {
    validate();
    // eslint-disable-next-line
  }, [exam, childValid]);

  return (
    <form className="max-w-lg mx-auto" onSubmit={handleNext}>
      <InputWrapper label="Last Qualifying Exam" error={errors.exam} required>
        <div className="flex gap-6 mt-2">
          <label className="flex items-center">
            <input type="radio" name="exam" value="HSC" checked={exam === 'HSC'} onChange={handleExam} className="accent-blue-500 mr-1" />
            <span className="text-gray-700 text-sm">HSC</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="exam" value="Diploma" checked={exam === 'Diploma'} onChange={handleExam} className="accent-blue-500 mr-1" />
            <span className="text-gray-700 text-sm">Diploma</span>
          </label>
        </div>
      </InputWrapper>
      <div className="mt-4">
        {exam === 'HSC' && (
          <React.Suspense fallback={<div className='text-blue-500'>Loading HSC Form...</div>}>
            <HSCForm setParentValid={setChildValid} />
          </React.Suspense>
        )}
        {exam === 'Diploma' && (
          <React.Suspense fallback={<div className='text-blue-500'>Loading Diploma Form...</div>}>
            <DiplomaForm setParentValid={setChildValid} />
          </React.Suspense>
        )}
        {errors.child && <div className="text-red-500 text-sm mt-2">{errors.child}</div>}
      </div>
      <div className="mb-4 flex justify-end mt-6">
        <FormButton type="submit">Next</FormButton>
      </div>
    </form>
  );
};

export default EducationForm; 