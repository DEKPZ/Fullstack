import React from 'react';
import { motion } from 'framer-motion';



export const FormTextarea = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  rows = 4,
}) => {
  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-sm font-medium text-primaryTeal mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-vertical ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-accentTeal focus:ring-primaryTeal'
        } bg-cream text-neutral`}
        required={required}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </motion.div>
  );
};