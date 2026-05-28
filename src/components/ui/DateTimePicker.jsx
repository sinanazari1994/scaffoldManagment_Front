import React from 'react';

/**
 * انتخابگر تاریخ شمسی ساده (در MVP از input date استفاده می‌کنیم)
 * @param {string} label
 * @param {string} value - تاریخ شمسی YYYY-MM-DD
 * @param {function} onChange
 */
export default function DateTimePicker({ label, value, onChange, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="label-large">{label}</label>}
      <input
        type="date"
        className="input-large"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="روز / ماه / سال"
      />
    </div>
  );
}