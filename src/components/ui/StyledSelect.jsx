export default function StyledSelect({
  label,
  options,
  value,
  onChange,
  placeholder = '-- انتخاب کنید --',
  horizontal = false,   // <-- prop جدید
}) {
  if (horizontal) {
    return (
      <div className="flex items-center gap-3">
        {label && (
          <label className="text-base font-bold text-[var(--tx)] whitespace-nowrap">
            {label}
          </label>
        )}
        <select
          className="fi flex-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  // حالت عمودی (پیش‌فرض)
  return (
    <div className="fg">
      {label && <label className="fl">{label}</label>}
      <select
        className="fi"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}