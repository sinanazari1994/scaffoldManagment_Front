import { toJalali } from '../../../lib/dateHelpers';

export default function ProjectFinanceTab({ financials, isAdmin, onToggleCompleted, onTogglePaid, project }) {
  if (!financials) {
    return <p className="text-sm text-[var(--t3)]">در حال بارگذاری...</p>;
  }

  return (
    <div className="space-y-3">
      {/* کارت جمع هزینه‌ها */}
      <div className="bg-[var(--bg2)] rounded-xl p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span>هزینه نصب</span>
          <span className="font-bold">{financials.totalInstallCost?.toLocaleString()} تومان</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>هزینه اجاره</span>
          <span className="font-bold">{financials.totalRentCost?.toLocaleString()} تومان</span>
        </div>
        <div className="flex justify-between text-sm border-t pt-2">
          <span className="font-bold">جمع کل</span>
          <span className="font-bold text-[var(--ora)]">{financials.grandTotal?.toLocaleString()} تومان</span>
        </div>
      </div>

      {/* پرداختی‌ها */}
      <div>
        <h4 className="font-bold text-sm mb-2">💰 پرداختی‌ها</h4>
        {financials.payments?.length === 0 ? (
          <p className="text-xs text-[var(--t3)]">پرداختی ثبت نشده</p>
        ) : (
          financials.payments?.map(p => (
            <div key={p.id} className="flex justify-between text-sm py-1 border-b last:border-0">
              <span>{toJalali(new Date(p.date))}</span>
              <span className="font-bold">{p.amount.toLocaleString()} تومان</span>
            </div>
          ))
        )}
        <div className="flex justify-between text-sm pt-2 border-t mt-2">
          <span>مجموع پرداختی</span>
          <span className="font-bold text-[var(--green)]">{financials.totalPaid?.toLocaleString()} تومان</span>
        </div>
      </div>

      {/* مانده */}
      <div className={`rounded-xl p-3 text-center ${financials.remaining > 0 ? 'bg-[var(--red-g)] text-[var(--red)]' : 'bg-[var(--green-g)] text-[var(--green)]'}`}>
        <p className="text-sm font-bold">{financials.remaining > 0 ? 'مانده بدهی' : 'تسویه شده'}</p>
        <p className="text-xl font-black">{Math.abs(financials.remaining).toLocaleString()} تومان</p>
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          <button className="btn btn-sm btn-s flex-1" onClick={onToggleCompleted}>
            {project.isCompleted ? '🔄 بازگشایی' : '✅ پایان پروژه'}
          </button>
          <button className="btn btn-sm btn-s flex-1" onClick={onTogglePaid}>
            {project.isPaid ? '❌ لغو تسویه' : '💰 تسویه شد'}
          </button>
        </div>
      )}
    </div>
  );
}