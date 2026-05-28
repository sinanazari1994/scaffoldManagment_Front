import { useEffect } from 'react';
import Icon from './Icon';

export default function Sheet({ open, onClose, title, children, footer }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-grip" />
        <div className="sheet-hd">
          <h3 className="font-bold text-lg">{title}</h3>
          <button className="btn btn-g btn-xs" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-ft">{footer}</div>}
      </div>
    </div>
  );
}