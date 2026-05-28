import { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

const MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const YEARS = [1405, 1406, 1407];

export default function JalaliDatePicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(1405);
  const ref = useRef(null);

  useEffect(() => {
    if (value) {
      const parts = value.split('/');
      if (parts.length === 3) {
        setYear(Number(parts[0]));
        setMonth(Number(parts[1]) - 1);
        setDay(Number(parts[2]));
      }
    }
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const apply = (y, m, d) => {
    const str = `${y}/${String(m+1).padStart(2,'0')}/${String(d).padStart(2,'0')}`;
    onChange(str);
    setOpen(false);
  };

  const formatted = value || `${year}/${String(month+1).padStart(2,'0')}/${String(day).padStart(2,'0')}`;

  return (
    <div className="fg relative" ref={ref}>
      {label && <label className="fl">{label}</label>}
      <button type="button" className="fi text-left flex justify-between items-center" onClick={() => setOpen(!open)}>
        <span>{formatted}</span>
        <Icon name="cal" size={18} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 bg-white border border-[var(--border)] rounded-xl shadow-lg p-3 flex gap-2 z-50 animate-[fadeSlideDown_.25s_ease]">
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