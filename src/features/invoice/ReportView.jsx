import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export default function ReportView() {
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'mock-token') {
      setIsLoading(true);
      api.get(ENDPOINTS.REPORTS_FINANCIAL)
        .then(res => setReport(res.data))
        .catch(err => console.warn('Failed to fetch financial report', err))
        .finally(() => setIsLoading(false));
    }
  }, []);

  if (isLoading) {
    return (
      <AppLayout title="گزارشات" onBack={() => navigate(-1)}>
        <div className="empty">در حال بارگذاری...</div>
      </AppLayout>
    );
  }

  if (!report) {
    return (
      <AppLayout title="گزارشات" onBack={() => navigate(-1)}>
        <div className="empty">داده‌ای برای نمایش وجود ندارد</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="گزارشات" onBack={() => navigate(-1)}>
      <div className="p-4 max-w-md mx-auto space-y-5">
        {/* 1. پروژه‌ها */}
        <div className="card">
          <h3 className="font-bold text-lg mb-3">🏗️ وضعیت پروژه‌ها</h3>
          <div className="flex justify-between text-sm">
            <span>فعال: {report.projectSummary?.active}</span>
            <span>پایان‌یافته: {report.projectSummary?.completed}</span>
            <span>کل: {report.projectSummary?.total}</span>
          </div>
        </div>

        {/* 2. حجم کار */}
        <div className="card">
          <h3 className="font-bold text-lg mb-3">📊 حجم کار</h3>
          <p className="text-sm font-bold text-[var(--ora)]">
            نصب‌شده: {report.workVolume?.totalInstalled} m³
          </p>
          {Object.entries(report.workVolume?.installByProject || {}).map(([proj, vol]) => (
            <div key={proj} className="flex justify-between text-sm">
              <span>{proj}</span>
              <span>{vol} m³</span>
            </div>
          ))}
          <p className="text-sm font-bold text-[var(--red)] mt-2">
            بازشده: {report.workVolume?.totalDismantled} m³
          </p>
          {Object.entries(report.workVolume?.dismantleByProject || {}).map(([proj, vol]) => (
            <div key={proj} className="flex justify-between text-sm">
              <span>{proj}</span>
              <span>{vol} m³</span>
            </div>
          ))}
        </div>

        {/* 3. موجودی */}
        <div className="card">
          <h3 className="font-bold text-lg mb-3">📦 موجودی</h3>
          <p className="text-sm font-bold text-[var(--steel)]">در انبارها:</p>
          {Object.entries(report.inventory?.inWarehouses || {}).map(([eq, qty]) => (
            <div key={eq} className="flex justify-between text-sm">
              <span>{eq}</span>
              <span>{qty}</span>
            </div>
          ))}
          <p className="text-sm font-bold text-[var(--green)] mt-2">در پروژه‌ها:</p>
          {Object.entries(report.inventory?.inProjects || {}).map(([eq, qty]) => (
            <div key={eq} className="flex justify-between text-sm">
              <span>{eq}</span>
              <span>{qty}</span>
            </div>
          ))}
          <p className="text-sm font-bold text-[var(--amber)] mt-2">در حال انتقال:</p>
          {Object.entries(report.inventory?.inTransit || {}).map(([eq, qty]) => (
            <div key={eq} className="flex justify-between text-sm">
              <span>{eq}</span>
              <span>{qty}</span>
            </div>
          ))}
        </div>

        {/* 4. پرداختی‌ها */}
        <div className="card">
          <h3 className="font-bold text-lg mb-3">💰 پرداختی‌ها</h3>
          {report.payments?.map((p, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{p.projectName}</span>
              <span>{p.totalPaid.toLocaleString()} تومان</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}