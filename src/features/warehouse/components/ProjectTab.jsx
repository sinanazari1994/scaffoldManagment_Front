import { useState } from 'react';
import Icon from '../../../components/ui/Icon';

export default function ProjectTab({ projects, onIn, onOut }) {
  const [expandId, setExpandId] = useState(null);

  const toggleExpand = (id) => {
    setExpandId(prev => (prev === id ? null : id));
  };

  return (
    <>
      {(projects || []).map(proj => {
        const isOpen = expandId === proj.id;
        const inventory = proj.inventory || [];
        return (
          <div key={proj.id} className="card p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleExpand(proj.id)}>
              <div>
                <h3 className="font-bold">{proj.employerName}</h3>
                <p className="text-xs text-[var(--t3)]">{inventory.reduce((s, i) => s + i.quantity, 0)} عدد</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-xs btn-s" onClick={(e) => { e.stopPropagation(); onIn('project', proj.id); }}>📥 ورود</button>
                <button className="btn btn-xs btn-d" onClick={(e) => { e.stopPropagation(); onOut('project', proj.id); }}>📤 خروج</button>
                <Icon name="chevron" size={18} color="var(--t3)" style={{ transform: isOpen ? 'rotate(180deg)' : '' }} />
              </div>
            </div>
            {isOpen && (
              <div className="border-t border-[var(--border)] p-4 space-y-2">
                {inventory.length === 0 ? (
                  <p className="text-sm text-[var(--t3)]">تجهیزاتی موجود نیست</p>
                ) : (
                  inventory.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.equipmentName}</span>
                      <span className="font-bold">{item.quantity} عدد</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}