import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext.jsx';
import InputWrapper from '../common/InputWrapper.jsx';
import FormButton from '../common/FormButton.jsx';
import Loader from '../common/Loader.jsx';

const branches = [
  'Mechanical',
  'E&TC',
  'Computer',
  'IT',
  'Civil',
  'Computer (Regional Language)',
  'CSE-AIML'
];

const BranchAndDocsForm = () => {
  const { formData, updateSection, setSectionValid, showToast, currentTab, setCurrentTab } = useFormContext();
  const [prefs, setPrefs] = useState(formData.branch.prefs || Array(5).fill(''));
  const [ackFile, setAckFile] = useState(formData.branch.ackFile || null);
  const [ackFileError, setAckFileError] = useState('');
  const [optionalDocs, setOptionalDocs] = useState(formData.branch.optionalDocs || []);
  const [optionalDocsError, setOptionalDocsError] = useState('');
  const [checking, setChecking] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate
  const validate = () => {
    const errs = {};
    if (prefs.some(p => !p)) errs.prefs = 'All 5 preferences required.';
    if (new Set(prefs).size !== prefs.length) errs.prefs = 'Preferences must be unique.';
    if (!ackFile) errs.ackFile = 'Verified acknowledgement required.';
    setErrors(errs);
    setSectionValid('branch', Object.keys(errs).length === 0);
    return Object.keys(errs).length === 0;
  };

  // Preference change
  const handlePref = idx => e => {
    const updated = [...prefs];
    updated[idx] = e.target.value;
    setPrefs(updated);
    updateSection('branch', { prefs: updated });
    setTimeout(validate, 0);
  };

  // Ack file
  const handleAckFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 1024 * 1024) {
      setAckFileError('File must be less than 1MB.');
      setAckFile(null);
      updateSection('branch', { ackFile: null });
      return;
    }
    if (!['application/pdf', 'image/png', 'image/jpeg'].includes(f.type)) {
      setAckFileError('Only PDF, PNG, or JPG allowed.');
      setAckFile(null);
      updateSection('branch', { ackFile: null });
      return;
    }
    setAckFileError('');
    setAckFile(f);
    updateSection('branch', { ackFile: f });
    setTimeout(validate, 0);
  };

  // Optional docs
  const handleOptionalDocs = e => {
    const files = Array.from(e.target.files);
    let error = '';
    for (let f of files) {
      if (f.size > 1024 * 1024) error = 'Each file must be <1MB.';
      if (!['application/pdf', 'image/png', 'image/jpeg'].includes(f.type)) error = 'Only PDF, PNG, or JPG allowed.';
    }
    if (error) {
      setOptionalDocsError(error);
      setOptionalDocs([]);
      updateSection('branch', { optionalDocs: [] });
      return;
    }
    setOptionalDocsError('');
    setOptionalDocs(files);
    updateSection('branch', { optionalDocs: files });
  };

  // On Next
  const handleNext = e => {
    e.preventDefault();
    if (!validate()) return;
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setCurrentTab(currentTab + 1);
      showToast('Application complete! You may now submit.', 'success');
    }, 1000);
  };

  React.useEffect(() => {
    validate();
    // eslint-disable-next-line
  }, [prefs, ackFile, optionalDocs]);

  return (
    <form className="max-w-lg mx-auto" onSubmit={handleNext}>
      <div className="mb-4">
        <label className="block text-blue-700 font-medium mb-2">Branch Preferences (1-5) <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {prefs.map((p, idx) => (
            <div key={idx} className="mb-2">
              <select value={p} onChange={handlePref(idx)} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Preference {idx + 1}</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          ))}
        </div>
        {errors.prefs && <div className="text-red-500 text-sm mt-1">{errors.prefs}</div>}
      </div>
      <InputWrapper label="Upload Verified Acknowledgement (PDF/Image, max 1MB)" error={errors.ackFile || ackFileError} required>
        <input
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={handleAckFile}
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {ackFile && <div className="text-xs text-blue-600 mt-1">{ackFile.name}</div>}
      </InputWrapper>
      <InputWrapper label="Upload Optional Docs (Aadhar, Category Certificate, etc.) (PDF/Image, max 1MB each)" error={optionalDocsError}>
        <input
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          multiple
          onChange={handleOptionalDocs}
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {optionalDocs.length > 0 && <div className="text-xs text-blue-600 mt-1">{optionalDocs.map(f => f.name).join(', ')}</div>}
      </InputWrapper>
      <div className="mb-4 flex justify-end">
        <FormButton type="submit" disabled={checking}>
          {checking ? <Loader size={5} /> : 'Finish'}
        </FormButton>
      </div>
    </form>
  );
};

export default BranchAndDocsForm; 