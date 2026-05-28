import { useEffect } from 'react';
import Icon from './Icon';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" style={{ maxHeight: '80vh', bottom: '10%' }} onClick={e => e.stopPropagation()}>
        <div className="sheet-grip" />
        <div className="sheet-hd">
          <h3 className="font-bold">{title}</h3>
          <button className="btn btn-g btn-xs" onClick={onClose}><Icon name="x" size={20} /></button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}