import React, { useState, useEffect } from 'react';
import { useFormContext } from '../../context/FormContext.jsx';
import InputWrapper from '../common/InputWrapper.jsx';

const HSCForm = ({ setParentValid }) => {
  const { formData, updateSection } = useFormContext();
  const [fields, setFields] = useState({
    physics: formData.hsc.physics || '',
    chemistry: formData.hsc.chemistry || '',
    maths: formData.hsc.maths || '',
    biology: formData.hsc.biology || '',
    total: formData.hsc.total || '',
    percent: formData.hsc.percent || '',
    cetPercentile: formData.hsc.cetPercentile || '',
    stateMerit: formData.hsc.stateMerit || '',
    jeePercentile: formData.hsc.jeePercentile || '',
    allIndiaMerit: formData.hsc.allIndiaMerit || '',
  });
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const errs = {};
    if (!fields.physics || isNaN(fields.physics) || Number(fields.physics) < 0) errs.physics = 'Enter valid marks.';
    if (!fields.chemistry || isNaN(fields.chemistry) || Number(fields.chemistry) < 0) errs.chemistry = 'Enter valid marks.';
    if (!fields.maths || isNaN(fields.maths) || Number(fields.maths) < 0) errs.maths = 'Enter valid marks.';
    if (!fields.total || isNaN(fields.total) || Number(fields.total) < 0) errs.total = 'Enter valid total.';
    if (!fields.percent || isNaN(fields.percent) || Number(fields.percent) < 0 || Number(fields.percent) > 100) errs.percent = 'Enter valid percentage (0-100).';
    if (!fields.cetPercentile || isNaN(fields.cetPercentile) || Number(fields.cetPercentile) < 0 || Number(fields.cetPercentile) > 100) errs.cetPercentile = 'Enter valid percentile (0-100).';
    if (!fields.stateMerit) errs.stateMerit = 'Required.';
    if (!fields.jeePercentile || isNaN(fields.jeePercentile) || Number(fields.jeePercentile) < 0 || Number(fields.jeePercentile) > 100) errs.jeePercentile = 'Enter valid percentile (0-100).';
    if (!fields.allIndiaMerit) errs.allIndiaMerit = 'Required.';
    setErrors(errs);
    setParentValid(Object.keys(errs).length === 0);
    return Object.keys(errs).length === 0;
  };

  // On field change
  const handleChange = key => e => {
    const value = e.target.value;
    setFields(prev => ({ ...prev, [key]: value }));
    updateSection('hsc', { [key]: value });
    setTimeout(validate, 0);
  };

  useEffect(() => {
    validate();
    formData.hsc.physics = fields.physics;
    formData.hsc.chemistry = fields.chemistry;
    formData.hsc.maths = fields.maths;
    formData.hsc.biology = fields.biology;
    formData.hsc.total = fields.total;
    formData.hsc.percent = fields.percent;
    formData.hsc.cetPercentile = fields.cetPercentile;
    formData.hsc.stateMerit = fields.stateMerit;
    formData.hsc.jeePercentile = fields.jeePercentile;
    formData.hsc.allIndiaMerit = fields.allIndiaMerit;
    // eslint-disable-next-line
  }, [fields]);

  return (
    <div className="bg-blue-50 rounded p-4 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputWrapper label="Physics Marks" error={errors.physics} required>
          <input type="number" min={0} value={fields.physics} onChange={handleChange('physics')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="Chemistry Marks" error={errors.chemistry} required>
          <input type="number" min={0} value={fields.chemistry} onChange={handleChange('chemistry')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="Mathematics Marks" error={errors.maths} required>
          <input type="number" min={0} value={fields.maths} onChange={handleChange('maths')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="Biology/Other (optional)">
          <input type="text" value={fields.biology} onChange={handleChange('biology')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="HSC Total Marks" error={errors.total} required>
          <input type="number" min={0} value={fields.total} onChange={handleChange('total')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="HSC Percentage" error={errors.percent} required>
          <input type="number" min={0} max={100} value={fields.percent} onChange={handleChange('percent')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="MH-CET 2025 Percentile Score" error={errors.cetPercentile} required>
          <input type="number" min={0} max={100} value={fields.cetPercentile} onChange={handleChange('cetPercentile')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="State General Merit Number" error={errors.stateMerit} required>
          <input type="text" value={fields.stateMerit} onChange={handleChange('stateMerit')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="JEE Main 2025 Percentile Score" error={errors.jeePercentile} required>
          <input type="number" min={0} max={100} value={fields.jeePercentile} onChange={handleChange('jeePercentile')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
        <InputWrapper label="All India Merit Number" error={errors.allIndiaMerit} required>
          <input type="text" value={fields.allIndiaMerit} onChange={handleChange('allIndiaMerit')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </InputWrapper>
      </div>
    </div>
  );
};

export default HSCForm; 