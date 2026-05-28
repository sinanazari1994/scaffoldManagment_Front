import { useState, useMemo } from 'react';
import Icon from '../../../components/ui/Icon';
import { toJalali } from '../../../lib/dateHelpers';
import ProjectActivityTab from './ProjectActivityTab';
import ProjectFinanceTab from './ProjectFinanceTab';

export default function ProjectCard({
  project,
  isOpen,
  onToggle,
  innerTab,
  setInnerTab,
  isAdmin,
  onEditClick,
  onToggleCompleted,
  onTogglePaid,
  financials,
  activities,        // آرایهٔ فعالیت‌های از پیش آماده‌شده
}) {
  return (
    <div className={`card p-0 overflow-hidden transition-all duration-200 ${isOpen ? 'border-[var(--ora)] shadow-[0_0_0_3px_var(--ora-g)]' : ''}`}>
      {/* هدر */}
      <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={onToggle}>
        <div className="w-10 h-10 rounded-xl bg-[var(--bg2)] flex items-center justify-center">
          <Icon name="hardhat" size={20} color="var(--ora)" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-base">{project.employerName}</p>
          <p className="text-xs text-[var(--t3)]">{project.address}</p>
          {isAdmin && (
            <div className="flex gap-1 mt-1">
              {project.isCompleted ? <span className="bdg bdg-g text-[10px]">پایان‌یافته</span> : <span className="bdg bdg-o text-[10px]">در حال انجام</span>}
              {project.isPaid ? <span className="bdg bdg-b text-[10px]">تسویه</span> : <span className="bdg bdg-r text-[10px]">بدهکار</span>}
            </div>
          )}
        </div>
        <Icon name="chevron" size={20} color="var(--t3)" style={{ transform: isOpen ? 'rotate(180deg)' : '' }} />
      </div>

      {isOpen && (
        <div className="border-t border-[var(--border)]">
          {/* خدمات و قیمت‌ها + دکمه ویرایش */}
          <div className="p-4 space-y-3 border-b border-[var(--border)]">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm">💰 خدمات و قیمت‌ها</h4>
              <button className="btn btn-g btn-xs" onClick={(e) => onEditClick(e, project)} title="ویرایش پروژه">
                <Icon name="edit" size={18} /> ویرایش
              </button>
            </div>
            {project.servicePrices?.length > 0 ? (
              <div className="space-y-2">
                {project.servicePrices.map((sp, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[var(--bg2)] rounded-lg p-2.5 text-sm">
                    <span>{sp.serviceTypeName || sp.serviceType}</span>
                    <span className="font-bold">{sp.price.toLocaleString()} تومان</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--t3)]">هنوز خدمتی تعریف نشده است</p>
            )}
            {isAdmin && (
              <div className="pt-2">
                <button className="btn btn-sm btn-s w-full" onClick={(e) => { e.stopPropagation(); onToggleCompleted(); }}>
                  {project.isCompleted ? '🔄 بازگشایی پروژه' : '✅ تکمیل پروژه'}
                </button>
              </div>
            )}
          </div>

          {/* تب‌های داخلی */}
          <div className="flex border-b border-[var(--border)] overflow-x-auto px-2">
            {[
              { key: 'client', label: 'کارفرما', icon: 'user' },
              { key: 'activity', label: 'فعالیت‌ها', icon: 'clock' },
              { key: 'finance', label: 'مالی', icon: 'chart' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setInnerTab(tab.key)}
                className={`flex items-center gap-1 px-3 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${innerTab === tab.key ? 'border-[var(--ora)] text-[var(--ora)]' : 'border-transparent text-[var(--t3)]'}`}
              >
                <Icon name={tab.icon} size={14} /> {tab.label}
              </button>
            ))}
          </div>

          {/* محتوای تب‌ها */}
          <div className="p-4 space-y-3">
            {innerTab === 'client' && (
              <div className="space-y-2">
                <div className="flex gap-2 items-center"><Icon name="phone" size={16} color="var(--t3)" /><span className="text-sm">{project.employerPhone || '---'}</span></div>
                <div className="flex gap-2 items-center"><Icon name="loc" size={16} color="var(--t3)" /><span className="text-sm">{project.address}</span></div>
                <div className="flex gap-2 items-center"><span className="text-sm">درصد اجاره: {project.monthlyRentPercent}%</span></div>
              </div>
            )}
            {innerTab === 'activity' && <ProjectActivityTab activities={activities} />}
            {innerTab === 'finance' && (
              <ProjectFinanceTab
                financials={financials}
                isAdmin={isAdmin}
                onToggleCompleted={onToggleCompleted}
                onTogglePaid={onTogglePaid}
                project={project}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}