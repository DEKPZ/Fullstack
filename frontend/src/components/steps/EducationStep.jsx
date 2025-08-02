import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FormInput } from '../FormInput'; // Make sure this path is correct

export const EducationStep = ({ data, onUpdate, onNext, onPrev }) => {
  const [educations, setEducations] = useState(data);
  const [errors, setErrors] = useState({});
  const [gradeTypes, setGradeTypes] = useState({});

  useEffect(() => {
    onUpdate(educations);
  }, [educations, onUpdate]);

  const validateForm = () => {
    const newErrors = {};
    educations.forEach((formData, idx) => {
      const gradeType = gradeTypes[idx] || 'CGPA';
      const err = {};
      if (!formData.degree.trim()) err.degree = 'Degree is required';
      if (!formData.college.trim()) err.college = 'College/University is required';
      if (!formData.cgpa.trim()) {
        err.cgpa = gradeType + ' is required';
      } else if (gradeType === 'CGPA' && (isNaN(Number(formData.cgpa)) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10)) {
        err.cgpa = 'Please enter a valid CGPA (0-10)';
      } else if (gradeType === 'GPA' && (isNaN(Number(formData.cgpa)) || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 4)) {
        err.cgpa = 'Please enter a valid GPA (0-4)';
      }
      if (!formData.startDate) err.startDate = 'Start date is required';
      if (!formData.endDate) err.endDate = 'End date is required';
      if (Object.keys(err).length > 0) newErrors[idx] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const addEducation = () => {
    setEducations(prev => ([...prev, { degree: '', college: '', cgpa: '', startDate: '', endDate: '' }]));
  };

  const removeEducation = (idx) => {
    setEducations(prev => prev.filter((_, i) => i !== idx));
    setGradeTypes(prev => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Education</h2>
        <p className="text-gray-600">Tell us about your educational background</p>
      </div>
      {educations.map((formData, idx) => (
        <div key={idx} className="border-2 border-gray-200 rounded-lg p-4 mb-4 bg-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Degree {idx + 1}</h3>
            {educations.length > 1 && (
              <button onClick={() => removeEducation(idx)} className="text-red-500 hover:text-red-600 transition-colors">Remove</button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Degree"
              value={formData.degree}
              onChange={(value) => setEducations(prev => prev.map((e, i) => i === idx ? { ...e, degree: value } : e))}
              error={errors[idx]?.degree}
              placeholder="B.Tech in Computer Science"
              required
            />
            <FormInput
              label="College/University"
              value={formData.college}
              onChange={(value) => setEducations(prev => prev.map((e, i) => i === idx ? { ...e, college: value } : e))}
              error={errors[idx]?.college}
              placeholder="ABC University"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={gradeTypes[idx] || 'CGPA'}
                onChange={e => setGradeTypes(prev => ({ ...prev, [idx]: e.target.value }))}
              >
                <option value="CGPA">CGPA (0-10)</option>
                <option value="GPA">GPA (0-4)</option>
              </select>
            </div>
            <FormInput
              label={gradeTypes[idx] || 'CGPA'}
              value={formData.cgpa}
              onChange={(value) => setEducations(prev => prev.map((e, i) => i === idx ? { ...e, cgpa: value } : e))}
              error={errors[idx]?.cgpa}
              placeholder={(gradeTypes[idx] || 'CGPA') === 'CGPA' ? '8.5' : '3.7'}
              required
            />
            <FormInput
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(value) => setEducations(prev => prev.map((e, i) => i === idx ? { ...e, startDate: value } : e))}
              error={errors[idx]?.startDate}
              required
            />
            <FormInput
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(value) => setEducations(prev => prev.map((e, i) => i === idx ? { ...e, endDate: value } : e))}
              error={errors[idx]?.endDate}
              required
            />
          </div>
        </div>
      ))}
      <button
        onClick={addEducation}
        className="w-full py-2 border-2 border-dashed border-accentTeal rounded-lg text-primaryTeal hover:border-primaryTeal hover:text-darkTeal transition-colors duration-200 flex items-center justify-center gap-2 mb-4"
      >
        Add Another Degree
      </button>
      <div className="flex justify-between">
        <motion.button
          onClick={onPrev}
          className="px-6 py-3 border border-accentTeal text-primaryTeal rounded-lg hover:bg-aqua hover:text-darkTeal transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Previous
        </motion.button>
        <motion.button
          onClick={handleNext}
          className="px-6 py-3 bg-primaryTeal text-white rounded-lg hover:bg-darkTeal transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next Step
        </motion.button>
      </div>
    </motion.div>
  );
};