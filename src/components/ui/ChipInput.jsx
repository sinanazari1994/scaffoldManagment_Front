import { useState } from 'react';

export default function ChipInput({ items, onAdd, onRemove }) {
  const [val, setVal] = useState('');

  const handleKey = (e) => {
    if (e.key === 'Enter' && val.trim()) {
      onAdd(val.trim());
      setVal('');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {items.map((item, i) => (
        <span key={i} className="chip on">{item}
          <button type="button" onClick={() => onRemove(i)} className="text-xs ml-1">&times;</button>
        </span>
      ))}
      <div className="chip chip-add chip-input-wrap">
        <input
          className="chip-input bg-transparent border-none outline-none text-sm w-20"
          placeholder="جدید..."
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>
    </div>
  );
}