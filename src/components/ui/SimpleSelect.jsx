export default function SimpleSelect({ label, options, value, onChange, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="label-large">{label}</label>}
      <select
        className="input-large appearance-none bg-white pr-10"
        value={value}
        onChange={(e) => {
          // همیشه مقدار رشته‌ای را به والد ارسال کن
          onChange(e.target.value);
        }}
      >
        <option value="" disabled>
          -- انتخاب کنید --
        </option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}