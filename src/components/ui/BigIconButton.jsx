import React from 'react';

/**
 * دکمه بزرگ با آیکن مرکزی، مناسب برای تسک‌ها یا اعمال اصلی
 * @param {string} icon - ایموجی بزرگ
 * @param {string} label - متن زیر آیکن
 * @param {string} colorClass - کلاس رنگ پس‌زمینه (مثلاً 'bg-orange-50 text-orange-700')
 * @param {function} onClick
 */
export default function BigIconButton({ icon, label, colorClass = 'bg-blue-50 text-blue-700', onClick }) {
  return (
    <button
      className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-sm active:scale-[0.97] transition-all ${colorClass} w-full min-h-[120px]`}
      onClick={onClick}
    >
      <span className="text-5xl mb-2">{icon}</span>
      <span className="text-lg font-bold text-center">{label}</span>
    </button>
  );
}