import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import UploadReceiptModal from './UploadReceiptModal';

const REASON_MAP = {
  projects: 'پروژه',
  warehouses: 'انبار',
  users: 'کاربر',
};

export default function PlanLimitReachedPage() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'projects';
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    api.get(ENDPOINTS.SUBSCRIPTION_PLANS)
      .then(res => setPlans(res.data))
      .catch(console.error);
  }, []);

  return (
    <AppLayout title="محدودیت اشتراک" onBack={() => navigate(-1)}>
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="empty-icon text-7xl">⚠️</div>
          <h2 className="text-2xl font-black text-[var(--tx)]">
            سقف {REASON_MAP[reason] || 'پروژه'}‌های فعال پر شده است
          </h2>
          <p className="text-[var(--t3)]">
            پلن فعلی شما اجازهٔ افزودن {REASON_MAP[reason] || 'پروژه'} جدید را نمی‌دهد.
            برای ادامه، لطفاً اشتراک خود را ارتقاء دهید.
          </p>
        </div>

        {/* لیست پلن‌های اشتراک */}
        <div className="card">
          <h3 className="font-bold text-lg mb-4">📦 پلن‌های اشتراک</h3>
          <div className="space-y-3">
            {plans.length === 0 ? (
              <p className="text-sm text-[var(--t3)]">در حال بارگذاری...</p>
            ) : (
              plans.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-[var(--bg2)] rounded-lg p-3">
                  <div>
                    <span className="font-bold">{p.name}</span>
                    <p className="text-xs text-[var(--t3)]">
                      {REASON_MAP[reason] || 'پروژه'}: {p.maxProjects} | کاربران: {p.maxUsers} | انبارها: {p.maxWarehouses}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--ora)]">{p.monthlyPrice?.toLocaleString()} تومان</p>
                    <p className="text-xs text-[var(--t3)]">ماهانه</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* دکمهٔ آپلود فیش */}
        <button className="btn btn-p btn-w w-full" onClick={() => setShowUploadModal(true)}>
          <Icon name="invoice" size={18} /> آپلود فیش واریزی
        </button>

        <UploadReceiptModal open={showUploadModal} onClose={() => setShowUploadModal(false)} />
      </div>
    </AppLayout>
  );
}