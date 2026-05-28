import { useRef, useState } from 'react';
import Icon from './Icon';

export default function ImageUploader({ images = [], onChange }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(newImages => {
      onChange([...images, ...newImages]);
    });

    // ریست input برای امکان انتخاب مجدد همان فایل
    fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <label className="fl">📷 عکس‌های پروژه</label>
      <div className="flex flex-wrap gap-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[var(--border)]">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-[var(--red)] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              onClick={() => removeImage(idx)}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="w-20 h-20 rounded-lg border-2 border-dashed border-[var(--border)] flex items-center justify-center text-[var(--t3)] hover:border-[var(--ora)] transition-colors"
          onClick={() => fileInputRef.current.click()}
        >
          <Icon name="plus" size={24} />
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}