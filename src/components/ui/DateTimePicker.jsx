import JalaliDatePicker from './JalaliDatePicker';

export default function DateTimePicker({ label, value, onChange, className = '' }) {
  return (
    <div className={className}>
      <JalaliDatePicker label={label} value={value} onChange={onChange} />
    </div>
  );
}
