import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../contexts/ProjectContext';
import { useWork } from '../../contexts/WorkContext';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import { toJalali } from '../../lib/dateHelpers';

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const { projects = [], isLoading: projectsLoading } = useProjects();
  const { installEntries = [], dismantleEntries = [], deliveryEntries = [] } = useWork();
  const navigate = useNavigate();

  const [financialReport, setFinancialReport] = useState(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // واکشی گزارش مالی برای گرفتن پرداختی‌ها
  useEffect(() => {
    const fetchReport = async () => {
      setIsLoadingReport(true);
      try {
        const res = await api.get(ENDPOINTS.REPORTS_FINANCIAL);
        setFinancialReport(res.data);
      } catch (err) {
        console.warn('Failed to fetch financial report', err);
      } finally {
        setIsLoadingReport(false);
      }
    };
    fetchReport();
  }, []);

  // استخراج پرداختی‌ها از گزارش
  const paymentsFromReport = financialReport?.payments || [];

  // محاسبهٔ مالی هر پروژهٔ فعال (کل مبلغ فاکتور)
  const projectFinancials = useMemo(() => {
    return projects
      .filter(p => !p.isCompleted)
      .map(proj => {
        // پرداختی‌های این پروژه (از گزارش مالی)
        const paidEntry = paymentsFromReport.find(p => p.projectName === proj.employerName);
        const totalPaid = paidEntry ? paidEntry.totalPaid : 0;

        // هزینهٔ نصب
        const projInstalls = installEntries.filter(e => e.projectId === proj.id);
        let totalInstallCost = 0;
        projInstalls.forEach(e => {
          const priceEntry = (proj.servicePrices || []).find(sp => sp.serviceTypeName === (e.serviceTypeName || e.serviceType));
          const unitPrice = priceEntry?.price ?? 0;
          totalInstallCost += (e.volume || 0) * unitPrice;
        });

        // هزینهٔ اجاره (ساده‌شده مانند Invoice)
        let totalRentCost = 0;
        const projDeliveries = deliveryEntries.filter(e => e.projectId === proj.id);
        const projDismantles = dismantleEntries.filter(e => e.projectId === proj.id);
        projDeliveries.forEach(del => {
          const related = projDismantles.filter(
            d => d.serviceTypeName === del.serviceTypeName && d.locationTitle === del.locationTitle
          );
          if (!related.length) return;
          const lastDate = related.reduce((latest, d) => (new Date(d.date) > new Date(latest) ? d.date : latest), related[0].date);
          const days = Math.ceil((new Date(lastDate) - new Date(del.date)) / (1000 * 60 * 60 * 24));
          if (days > 30) {
            const installedVol = projInstalls
              .filter(e => e.serviceTypeName === del.serviceTypeName && e.locationTitle === del.locationTitle)
              .reduce((sum, e) => sum + (e.volume || 0), 0);
            const priceEntry = (proj.servicePrices || []).find(sp => sp.serviceTypeName === del.serviceTypeName);
            const unitPrice = priceEntry?.price ?? 0;
            const locCost = installedVol * unitPrice;
            const extraMonths = Math.ceil((days - 30) / 30);
            const rentCost = extraMonths * (locCost * (proj.monthlyRentPercent || 0) / 100);
            totalRentCost += rentCost;
          }
        });

        const grandTotal = totalInstallCost + totalRentCost;

        return {
          id: proj.id,
          employerName: proj.employerName,
          totalPaid,
          grandTotal,        // ← کل مبلغ فاکتور
        };
      });
  }, [projects, paymentsFromReport, installEntries, dismantleEntries, deliveryEntries]);

  const activeProjectsCount = projectFinancials.length;
  const totalInstalledVolume = installEntries.reduce((sum, e) => sum + (e.volume || 0), 0);

  const isLoading = projectsLoading || isLoadingReport;

  return (
    <AppLayout title={`سلام ${user.fullName} 👋`} showNav={true}>
      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* تاریخ و خروج */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--t3)]">{toJalali(new Date())}</span>
          <button className="avatar-btn" onClick={logout} title="خروج">
            {user.fullName[0]}
          </button>
        </div>

        {isLoading ? (
          <div className="empty">
            <div className="empty-icon">⏳</div>
            <h3 className="empty-title">در حال بارگذاری...</h3>
          </div>
        ) : (
          <>
            {/* Hero Card */}
            <div
              className="rounded-2xl p-5 text-white"
              style={{ background: 'linear-gradient(135deg, var(--ora), var(--ora2))' }}
            >
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-3xl font-black">{activeProjectsCount}</p>
                  <p className="text-sm opacity-90">پروژه فعال</p>
                </div>
                <div>
                  <p className="text-3xl font-black">{totalInstalledVolume}</p>
                  <p className="text-sm opacity-90">مترمکعب نصب</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full" />
              </div>
            </div>

            {/* پروژه‌های فعال با وضعیت مالی */}
            <div className="card">
              <h3 className="font-bold text-lg mb-3">💰 وضعیت مالی پروژه‌ها</h3>
              {projectFinancials.length === 0 ? (
                <p className="text-sm text-[var(--t3)]">پروژهٔ فعالی وجود ندارد</p>
              ) : (
                <div className="space-y-2">
                  {projectFinancials.map(pf => (
                    <div key={pf.id} className="bg-[var(--bg2)] rounded-xl p-3">
                      <h4 className="font-bold text-base mb-2">{pf.employerName}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-left">
                          <span className="text-[var(--t3)]">پرداختی:</span>
                          <span className="font-bold text-[var(--green)] mr-1">
                            {pf.totalPaid.toLocaleString()} تومان
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="text-[var(--t3)]">کل مبلغ فاکتور:</span>
                          <span className="font-bold text-[var(--ora)]">
                            {pf.grandTotal.toLocaleString()} تومان
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* آخرین فعالیت‌ها */}
            <div className="card">
              <h3 className="text-sm font-bold mb-3">🕒 آخرین فعالیت‌ها</h3>
              {[...installEntries, ...dismantleEntries]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map((act, idx) => (
                  <div
                    key={act.id || idx}
                    className={`flex justify-between py-1.5 text-xs ${
                      idx % 2 === 0 ? 'bg-[var(--bg2)]' : ''
                    } rounded px-2`}
                  >
                    <span>
                      {act.type === 'Install' ? 'نصب' : 'بازکردن'} {act.serviceTypeName || act.serviceType} -{' '}
                      {act.locationTitle || ''}
                    </span>
                    <span className="font-bold">{act.volume || 0} m³</span>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}