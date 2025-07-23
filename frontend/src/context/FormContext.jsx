import React, { createContext, useContext, useState } from 'react';

const TABS = [
  'Identity',
  'Payment',
  'Personal Details',
  'Education',
  'Branch & Docs'
];

const initialFormData = {
  identity: {},
  payment: {},
  personal: {},
  education: {},
  hsc: {},
  diploma: {},
  branch: {},
};

const initialValidation = {
  identity: false,
  payment: false,
  personal: false,
  education: false,
  hsc: false,
  diploma: false,
  branch: false,
};

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [validation, setValidation] = useState(initialValidation);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [errorModal, setErrorModal] = useState({ show: false, message: '' });

  // Update form data for a section
  const updateSection = (section, data) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };

  // Set validation for a section
  const setSectionValid = (section, isValid) => {
    setValidation(prev => ({ ...prev, [section]: isValid }));
  };

  // Navigation logic
  const goToTab = (idx) => {
    if (idx <= currentTab + 1 && validation[TABS[currentTab].toLowerCase().replace(/ & | /g, '')]) {
      setCurrentTab(idx);
    }
  };

  // Toast logic
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 3000);
  };

  // Error modal logic
  const showError = (message) => {
    setErrorModal({ show: true, message });
  };
  const hideError = () => setErrorModal({ show: false, message: '' });

  return (
    <FormContext.Provider value={{
      currentTab, setCurrentTab, goToTab,
      formData, updateSection,
      validation, setSectionValid,
      toast, showToast,
      errorModal, showError, hideError,
      TABS
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => useContext(FormContext); 