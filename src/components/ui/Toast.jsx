import { useEffect, useState } from 'react';

export default function Toast({ msg, type = '', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`toast ${type === 'error' ? 'er' : ''}`}
      style={{ opacity: visible ? 1 : 0, transition: 'opacity .3s' }}
    >
      {type === 'error' ? '⚠️' : '✅'} {msg}
    </div>
  );
}