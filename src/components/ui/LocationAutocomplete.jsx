import { useState, useEffect, useRef } from 'react';
import { useLocations } from '../../contexts/LocationContext';
import Icon from './Icon';

export default function LocationAutocomplete({
  value,
  onChange,
  suggestions = [],         // آرایه‌ای از { id, title }
  placeholder = 'محل اجرا',
}) {
  const { editLocation, removeLocation } = useLocations();

  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const wrapperRef = useRef(null);

  // بستن لیست با کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value.trim()) {
      setFiltered(suggestions.filter(s => s.title.includes(value)));
    } else {
      setFiltered(suggestions);
    }
  }, [value, suggestions]);

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
      if (!value.trim()) {
        setFiltered(suggestions);
      } else {
        setFiltered(suggestions.filter(s => s.title.includes(value)));
      }
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion.title);
    setIsOpen(false);
  };

  return (
    <div className="fg relative" ref={wrapperRef}>
      <label className="fl">📌 محل اجرا</label>
      <input
        className="fi"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={placeholder}
      />
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-[var(--border)] rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
          {filtered.map(loc => (
            <div
              key={loc.id}
              className="px-4 py-2 cursor-pointer hover:bg-[var(--bg2)] text-sm"
              onClick={() => handleSelect(loc)}
            >
              {loc.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}