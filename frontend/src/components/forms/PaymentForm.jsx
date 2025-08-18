import React, { useState } from 'react';
import { useFormContext } from '../../context/FormContext.jsx';
import InputWrapper from '../common/InputWrapper.jsx';
import FormButton from '../common/FormButton.jsx';
import Loader from '../common/Loader.jsx';
import ErrorModal from '../common/ErrorModal.jsx';
import { BACKEND_URL } from '../../../config.js';

const declarations = [
  'I declare that the information provided is true to the best of my knowledge.',
  'I understand that providing false information may lead to cancellation of my admission.',
  'I agree to abide by the rules and regulations of the college.'
];

const PaymentForm = () => {
  const { formData, updateSection, setSectionValid, showToast, currentTab, setCurrentTab } = useFormContext();
  const [declared, setDeclared] = useState(formData.payment.declared || [false, false, false]);
  const [accountName, setAccountName] = useState(formData.payment.accountName || '');
  const [txnId, setTxnId] = useState(formData.payment.txnId || '');
  const [file, setFile] = useState(formData.payment.file || null);
  const [fileError, setFileError] = useState('');
  const [checking, setChecking] = useState(false);
  const [ocrError, setOcrError] = useState(false);
  const [errors, setErrors] = useState({});
  const [extractedText, setExtractedText] = useState('');
  const [rawText, setRawText] = useState('');
  const [showTextModal, setShowTextModal] = useState(false);

  // Validate fields
  const validate = () => {
    const errs = {};
    if (!declared.every(Boolean)) errs.declared = 'All declarations must be checked.';
    if (!accountName) errs.accountName = 'Account holder name is required.';
    if (!txnId) errs.txnId = 'Transaction ID is required.';
    if (!file) errs.file = 'Screenshot is required.';
    setErrors(errs);
    setSectionValid('payment', Object.keys(errs).length === 0);
    return Object.keys(errs).length === 0;
  };

  // On field change
  const handleDeclaration = idx => e => {
    const updated = [...declared];
    updated[idx] = e.target.checked;
    setDeclared(updated);
    updateSection('payment', { declared: updated });
    setTimeout(validate, 0);
  };
  const handleChange = (setter, key) => e => {
    setter(e.target.value);
    updateSection('payment', { [key]: e.target.value });
    setTimeout(validate, 0);
  };
  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 1024 * 1024) {
      setFileError('File must be less than 1MB.');
      setFile(null);
      updateSection('payment', { file: null });
      return;
    }
    if (!['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'].includes(f.type)) {
      setFileError('Only PDF, PNG, or JPG allowed.');
      setFile(null);
      updateSection('payment', { file: null });
      return;
    }
    setFileError('');
    setFile(f);
    updateSection('payment', { file: f });
    setTimeout(validate, 0);
  };

  // Simulate OCR on Next
  const handleNext = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setChecking(true);
      const formDataToSend = new FormData();
      formDataToSend.append('enNo', formData.identity.enNo);
      formDataToSend.append('transactionId', txnId);
      formDataToSend.append('paymentScreenshot', file);

      const response = await fetch(`${BACKEND_URL}/api/forms/paymentform`, {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();
      setExtractedText(data.text || '');
      setRawText(data.raw || '');
      if (response.ok) {
        showToast('Payment details verified!', 'success');
        setCurrentTab(currentTab + 1);
        setChecking(false);
      } else {
        showToast(data.message, 'error');
        setChecking(false);
      }
    } catch (error) {
      console.log(error);
      showToast('Something went wrong', 'error');
      setChecking(false);
    }
  };

  // Validate on mount and on change
  React.useEffect(() => {
    validate();
    // eslint-disable-next-line
  }, [declared, accountName, txnId, file]);

  return (
    <form className="max-w-lg mx-auto" onSubmit={handleNext}>
      <div className="mb-4">
        <label className="block text-blue-700 font-medium mb-2">Declarations <span className="text-red-500">*</span></label>
        {declarations.map((text, idx) => (
          <div key={idx} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={declared[idx]}
              onChange={handleDeclaration(idx)}
              className="mr-2 accent-blue-500"
              id={`decl${idx}`}
            />
            <label htmlFor={`decl${idx}`} className="text-gray-700 text-sm">{text}</label>
          </div>
        ))}
        {errors.declared && <div className="text-red-500 text-sm mt-1">{errors.declared}</div>}
      </div>
      <InputWrapper label="Name of Account Holder who paid" error={errors.accountName} required>
        <input
          type="text"
          value={accountName}
          onChange={handleChange(setAccountName, 'accountName')}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </InputWrapper>
      <InputWrapper label="Transaction ID" error={errors.txnId} required>
        <input
          type="text"
          value={txnId}
          onChange={handleChange(setTxnId, 'txnId')}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </InputWrapper>
      <InputWrapper label="Upload Screenshot (PDF/Image, max 1MB)" error={errors.file || fileError} required>
        <input
          type="file"
          accept="application/pdf,image/png,image/jpeg,image/jpg"
          onChange={handleFile}
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {file && <div className="text-xs text-blue-600 mt-1">{file.name}</div>}
      </InputWrapper>
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          onClick={() => setShowTextModal((prev) => !prev)}
        >
          {showTextModal ? 'Hide Extracted Text' : 'Show Extracted Text'}
        </button>
        <FormButton type="submit" disabled={checking}>
          {checking ? <Loader size={5} /> : 'Next'}
        </FormButton>
      </div>
      {/* Modal for extracted and raw text */}
      {showTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center border-t-4 border-blue-500">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Extracted Text Preview</h2>
            <div className="mb-4 text-left">
              <strong>Extracted Text:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1 text-sm max-h-40 overflow-auto">{extractedText || 'No extracted text.'}</pre>
            </div>
            <div className="mb-4 text-left">
              <strong>Raw Text:</strong>
              <pre className="bg-gray-100 p-2 rounded mt-1 text-sm max-h-40 overflow-auto">{rawText ? (typeof rawText === 'object' ? JSON.stringify(rawText, null, 2) : rawText) : 'No raw text.'}</pre>
            </div>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              onClick={() => setShowTextModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <ErrorModal
        show={ocrError}
        message={"OCR validation failed. Please upload a clearer screenshot or try again."}
        onClose={() => setOcrError(false)}
      />
    </form>
  );
};

export default PaymentForm; 