import React, { Suspense, lazy } from 'react';
import { FormProvider, useFormContext } from '../context/FormContext.jsx';
import Toast from '../components/common/Toast.jsx';
import ErrorModal from '../components/common/ErrorModal.jsx';
import Loader from '../components/common/Loader.jsx';

const tabComponents = [
  lazy(() => import('../components/forms/IdentityForm.jsx')),
  lazy(() => import('../components/forms/PaymentForm.jsx')),
  lazy(() => import('../components/forms/PersonalDetailsForm.jsx')),
  lazy(() => import('../components/forms/EducationForm.jsx')),
  lazy(() => import('../components/forms/BranchAndDocsForm.jsx')),
];

const TabNav = () => {
  const { currentTab, goToTab, validation, TABS } = useFormContext();
  return (
    <div className="flex border-b border-blue-200 bg-white rounded-t-lg overflow-x-auto">
      {TABS.map((tab, idx) => (
        <button
          key={tab}
          onClick={() => goToTab(idx)}
          disabled={idx > currentTab || (idx > 0 && !validation[TABS[idx - 1].toLowerCase().replace(/ & | /g, '')])}
          className={`px-6 py-3 font-semibold focus:outline-none transition-colors whitespace-nowrap
            ${idx === currentTab ? 'border-b-4 border-blue-500 text-blue-700 bg-blue-50' : 'text-blue-500 hover:bg-blue-100'}
            ${idx > currentTab ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const FormSection = () => {
  const { currentTab } = useFormContext();
  const Section = tabComponents[currentTab];
  return (
    <Suspense fallback={<Loader overlay />}> <Section /> </Suspense>
  );
};

const FormPageContent = () => {
  const { toast, errorModal, hideError } = useFormContext();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center py-8 px-2">
      {/* Header */}
      <header className="w-full max-w-3xl mb-8 flex flex-col items-center">
        <div className="flex items-center mb-2">
          <div className="bg-blue-500 rounded-full p-2 mr-3">
            <svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="5"/></svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700">College Admission Form</h1>
        </div>
        <p className="text-blue-600 text-sm md:text-base">Please complete all sections to submit your application.</p>
      </header>
      {/* Tabs */}
      <div className="w-full max-w-3xl shadow rounded-lg bg-white">
        <TabNav />
        <div className="p-6">
          <FormSection />
        </div>
      </div>
      {/* Toast and ErrorModal */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
      <ErrorModal show={errorModal.show} message={errorModal.message} onClose={hideError} />
    </div>
  );
};

const FormPage = () => (
  <FormProvider>
    <FormPageContent />
  </FormProvider>
);

export default FormPage; 