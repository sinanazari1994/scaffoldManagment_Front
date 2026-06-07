import { useState, useRef, useEffect, useMemo } from 'react';
import { toJalaliParts } from '../../lib/dateHelpers';
import Icon from './Icon';

const MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];

const todayParts = toJalaliParts(new Date());

export default function JalaliDatePicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [pickerStyle, setPickerStyle] = useState({});
  const [day, setDay] = useState(todayParts.day);
  const [month, setMonth] = useState(todayParts.month - 1);
  const [year, setYear] = useState(todayParts.year);
  const triggerRef = useRef(null);
  const pickerRef = useRef(null);
  const initialized = useRef(false);

  const YEARS = useMemo(() => {
    const cy = todayParts.year;
    return Array.from({ length: 9 }, (_, i) => cy - 3 + i);
  }, []);

  useEffect(() => {
    if (value && !initialized.current) {
      initialized.current = true;
      const parts = value.split('/');
      if (parts.length === 3) {
        setYear(Number(parts[0]));
        setMonth(Number(parts[1]) - 1);
        setDay(Number(parts[2]));
      }
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        pickerRef.current && !pickerRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleToggle = () => {
    if (!open) {
      const rect = triggerRef.current.getBoundingClientRect();
      const pickerW = 280;
      let left = rect.left;
      if (left + pickerW > window.innerWidth - 8) {
        left = window.innerWidth - pickerW - 8;
      }
      if (left < 8) left = 8;
      setPickerStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left,
        zIndex: 300,
      });
    }
    setOpen(!open);
  };

  const apply = (y, m, d) => {
    const str = `${y}/${String(m+1).padStart(2,'0')}/${String(d).padStart(2,'0')}`;
    onChange(str);
    setOpen(false);
  };

  const formatted = value || `${year}/${String(month+1).padStart(2,'0')}/${String(day).padStart(2,'0')}`;

  return (
    <div className="fg">
      {label && <label className="fl">{label}</label>}
      <button ref={triggerRef} type="button" className="fi text-left flex justify-between items-center" onClick={handleToggle}>
        <span>{formatted}</span>
        <Icon name="cal" size={18} />
      </button>
      {open && (
        <div ref={pickerRef} style={pickerStyle} className="bg-white border border-[var(--border)] rounded-xl shadow-lg p-3 flex gap-2 animate-[fadeSlideDown_.25s_ease]">
          <div className="overflow-y-auto h-36">
            {Array.from({length: 31}, (_, i) => i+1).map(d => (
              <div key={d} className={`px-3 py-1.5 cursor-pointer rounded-lg text-sm ${d === day ? 'bg-[var(--ora)] text-white' : ''}`}
                onClick={() => setDay(d)}>{d}</div>
            ))}
          </div>
          <div className="overflow-y-auto h-36">
            {MONTHS.map((m, i) => (
              <div key={m} className={`px-3 py-1.5 cursor-pointer rounded-lg text-sm ${i === month ? 'bg-[var(--ora)] text-white' : ''}`}
                onClick={() => setMonth(i)}>{m}</div>
            ))}
          </div>
          <div className="overflow-y-auto h-36">
            {YEARS.map(y => (
              <div key={y} className={`px-3 py-1.5 cursor-pointer rounded-lg text-sm ${y === year ? 'bg-[var(--ora)] text-white' : ''}`}
                onClick={() => setYear(y)}>{y}</div>
            ))}
          </div>
          <button className="btn btn-xs btn-p mt-2" onClick={() => apply(year, month, day)}>تأیید</button>
        </div>
      )}
    </div>
  );
}
