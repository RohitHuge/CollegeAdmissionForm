import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../context/FormContext.jsx';
import InputWrapper from '../common/InputWrapper.jsx';

const DiplomaForm = ({ setParentValid }) => {
  const { formData, updateSection } = useFormContext();
  const [fields, setFields] = useState({
    aggregate: formData.diploma.aggregate || '',
    percent: formData.diploma.percent || '',
    cetPercentile: formData.diploma.cetPercentile || '',
    jeePercentile: formData.diploma.jeePercentile || '',
  });
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const errs = {};
    if (!fields.aggregate || isNaN(fields.aggregate) || Number(fields.aggregate) < 0) errs.aggregate = 'Enter valid aggregate marks.';
    if (!fields.percent || isNaN(fields.percent) || Number(fields.percent) < 0 || Number(fields.percent) > 100) errs.percent = 'Enter valid percentage (0-100).';
    if (!fields.cetPercentile || isNaN(fields.cetPercentile) || Number(fields.cetPercentile) < 0 || Number(fields.cetPercentile) > 100) errs.cetPercentile = 'Enter valid percentile (0-100).';
    if (!fields.jeePercentile || isNaN(fields.jeePercentile) || Number(fields.jeePercentile) < 0 || Number(fields.jeePercentile) > 100) errs.jeePercentile = 'Enter valid percentile (0-100).';
    setErrors(errs);
    setParentValid(Object.keys(errs).length === 0);
    return Object.keys(errs).length === 0;
  };

  // On field change
  const handleChange = key => e => {
    const value = e.target.value;
    setFields(prev => ({ ...prev, [key]: value }));
    updateSection('diploma', { [key]: value });
    setTimeout(validate, 0);
  };

  useEffect(() => {
    validate();
    formData.diploma.aggregate = fields.aggregate;
    formData.diploma.percent = fields.percent;
    formData.diploma.cetPercentile = fields.cetPercentile;
    formData.diploma.jeePercentile = fields.jeePercentile;
    // eslint-disable-next-line
  }, [fields]);

  return (
    <div className="bg-blue-50 rounded p-4 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputWrapper label="Total Aggregate Marks" error={errors.aggregate} required>
          <input type="number" min={0} value={fields.aggregate} onChange={handleChange('aggregate')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="Percentage" error={errors.percent} required>
          <input type="number" min={0} max={100} value={fields.percent} onChange={handleChange('percent')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="MH-CET 2025 Percentile Score" error={errors.cetPercentile} required>
          <input type="number" min={0} max={100} value={fields.cetPercentile} onChange={handleChange('cetPercentile')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="JEE Main 2025 Percentile Score" error={errors.jeePercentile} required>
          <input type="number" min={0} max={100} value={fields.jeePercentile} onChange={handleChange('jeePercentile')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
      </div>
    </div>
  );
};

export default DiplomaForm; 