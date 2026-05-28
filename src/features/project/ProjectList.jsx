import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../contexts/ProjectContext';
import { useTransfers } from '../../contexts/TransfersContext';
import { useWork } from '../../contexts/WorkContext';
import { usePayments } from '../../contexts/PaymentContext';
import { toJalali } from '../../lib/dateHelpers';
import { ROLES } from '../../lib/constants';
import EditProjectModal from './EditProjectModal';

export default function ProjectList() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.CONTRACTOR;
  const { projects, toggleProjectCompleted, toggleProjectPaid, isLoading, fetchProjects } = useProjects();
  const { transactions } = useTransfers();
  const { installEntries, dismantleEntries, deliveryEntries } = useWork();
  const { payments } = usePayments();
  const navigate = useNavigate();

  // واکشی پروژه‌ها هنگام mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const [projectFilter, setProjectFilter] = useState('active');
  const [openId, setOpenId] = useState(null);
  const [innerTab, setInnerTab] = useState('client');
  const [editingProject, setEditingProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    if (projectFilter === 'active') return projects.filter(p => !p.isCompleted);
    return projects.filter(p => p.isCompleted);
  }, [projects, projectFilter]);

  const getFinancials = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;

    const projectPayments = (payments || []).filter(p => p.projectId === projectId);
    const totalPaid = projectPayments.reduce((s, p) => s + p.amount, 0);
    const projectInstalls = (installEntries || []).filter(e => e.projectId === projectId);
    let totalInstallCost = 0;
    projectInstalls.forEach(e => {
      const priceEntry = (project.servicePrices || []).find(sp => sp.serviceTypeName === e.serviceType);
      const unitPrice = priceEntry ? priceEntry.price : 0;
      totalInstallCost += (e.volume || 0) * unitPrice;
    });

    let totalRentCost = 0;
    const projDeliveries = (deliveryEntries || []).filter(e => e.projectId === projectId);
    const projDismantles = (dismantleEntries || []).filter(e => e.projectId === projectId);
    projDeliveries.forEach(del => {
      const rel = projDismantles.filter(
        d => d.serviceType === del.serviceType && d.locationTitle === del.locationTitle
      );
      if (rel.length === 0) return;
      const lastDate = rel.reduce((latest, d) => new Date(d.date) > new Date(latest) ? d.date : latest, rel[0].date);
      const start = new Date(del.date);
      const end = new Date(lastDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (days > 30) {
        const locInstalls = projectInstalls.filter(
          e => e.serviceType === del.serviceType && e.locationTitle === del.locationTitle
        );
        const locVol = locInstalls.reduce((sum, e) => sum + (e.volume || 0), 0);
        const priceEntry = (project.servicePrices || []).find(sp => sp.serviceTypeName === del.serviceType);
        const unitPrice = priceEntry ? priceEntry.price : 0;
        const locCost = locVol * unitPrice;
        const extraMonths = Math.ceil((days - 30) / 30);
        const rentCost = extraMonths * (locCost * (project.monthlyRentPercent || 0) / 100);
        totalRentCost += rentCost;
      }
    });

    const grandTotal = totalInstallCost + totalRentCost;
    const remaining = grandTotal - totalPaid;

    return { totalPaid, totalInstallCost, totalRentCost, grandTotal, remaining, payments: projectPayments };
  };

  const getProjectActivities = (projectId) => {
    const txs = (transactions || [])
      .filter(t => t.projectId === projectId)
      .map(t => ({ ...t, activityType: t.transactionType, color: 'var(--orange)' }));
    const installs = (installEntries || []).filter(e => e.projectId === projectId).map(e => ({ ...e, activityType: 'نصب', color: 'var(--green)' }));
    const dismantles = (dismantleEntries || []).filter(e => e.projectId === projectId).map(e => ({ ...e, activityType: 'بازکردن', color: 'var(--red)' }));
    const deliveries = (deliveryEntries || []).filter(e => e.projectId === projectId).map(e => ({ ...e, activityType: 'تحویل', color: 'var(--steel)' }));
    return [...installs, ...dismantles, ...deliveries, ...txs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 15);
  };

  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));
  const handleEditClick = (e, proj) => { e.stopPropagation(); setEditingProject(proj); setModalOpen(true); };

  if (isLoading) {
    return (
      <AppLayout title="پروژه‌ها" onBack={() => navigate(-1)}>
        <div className="empty"><div className="empty-icon">⏳</div><h3 className="empty-title">در حال بارگذاری...</h3></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="پروژه‌ها" onBack={() => navigate(-1)}>
      <div className="p-4 space-y-3 max-w-md mx-auto">
        <button className="btn btn-p btn-w" onClick={() => navigate('/manager/projects/new')}>
          <Icon name="plus" size={18} /> پروژه جدید
        </button>

        <div className="flex bg-[var(--bg2)] rounded-xl p-1">
          <button className={`flex-1 py-2.5 rounded-lg font-bold text-sm ${projectFilter === 'active' ? 'bg-white shadow text-[var(--ora)]' : 'text-[var(--t3)]'}`}
            onClick={() => { setProjectFilter('active'); setOpenId(null); }}>در حال انجام</button>
          <button className={`flex-1 py-2.5 rounded-lg font-bold text-sm ${projectFilter === 'completed' ? 'bg-white shadow text-[var(--ora)]' : 'text-[var(--t3)]'}`}
            onClick={() => { setProjectFilter('completed'); setOpenId(null); }}>تکمیل شده</button>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <h3 className="empty-title">{projectFilter === 'active' ? 'پروژه فعالی یافت نشد' : 'پروژه تکمیل شده‌ای یافت نشد'}</h3>
          </div>
        ) : (
          filteredProjects.map(proj => {
            const isOpen = openId === proj.id;
            const activities = getProjectActivities(proj.id);
            const financials = isOpen && innerTab === 'finance' ? getFinancials(proj.id) : null;

            return (
              <div key={proj.id} className={`card p-0 overflow-hidden transition-all duration-200 ${isOpen ? 'border-[var(--ora)] shadow-[0_0_0_3px_var(--ora-g)]' : ''}`}>
                <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggle(proj.id)}>
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg2)] flex items-center justify-center">
                    <Icon name="hardhat" size={20} color="var(--ora)" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base">{proj.employerName}</p>
                    <p className="text-xs text-[var(--t3)]">{proj.address}</p>
                    {isAdmin && (
                      <div className="flex gap-1 mt-1">
                        {proj.isCompleted ? <span className="bdg bdg-g text-[10px]">پایان‌یافته</span> : <span className="bdg bdg-o text-[10px]">در حال انجام</span>}
                        {proj.isPaid ? <span className="bdg bdg-b text-[10px]">تسویه</span> : <span className="bdg bdg-r text-[10px]">بدهکار</span>}
                      </div>
                    )}
                  </div>
                  <Icon name="chevron" size={20} color="var(--t3)" style={{ transform: isOpen ? 'rotate(180deg)' : '' }} />
                </div>

                {isOpen && (
                  <div className="border-t border-[var(--border)]">
                    <div className="p-4 space-y-3 border-b border-[var(--border)]">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm">💰 خدمات و قیمت‌ها</h4>
                        <button className="btn btn-g btn-xs" onClick={(e) => handleEditClick(e, proj)} title="ویرایش پروژه">
                          <Icon name="edit" size={18} /> ویرایش
                        </button>
                      </div>
                      {proj.servicePrices && proj.servicePrices.length > 0 ? (
                        <div className="space-y-2">
                          {proj.servicePrices.map((sp, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-[var(--bg2)] rounded-lg p-2.5 text-sm">
                              <span>{sp.serviceTypeName}</span>
                              <span className="font-bold">{sp.price.toLocaleString()} تومان</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--t3)]">هنوز خدمتی تعریف نشده است</p>
                      )}
                      {isAdmin && (
                        <div className="pt-2">
                          <button className="btn btn-sm btn-s w-full" onClick={(e) => { e.stopPropagation(); toggleProjectCompleted(proj.id); }}>
                            {proj.isCompleted ? '🔄 بازگشایی پروژه' : '✅ تکمیل پروژه'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex border-b border-[var(--border)] overflow-x-auto px-2">
                      {[
                        { key: 'client', label: 'کارفرما', icon: 'user' },
                        { key: 'activity', label: 'فعالیت‌ها', icon: 'clock' },
                        { key: 'finance', label: 'مالی', icon: 'chart' },
                      ].map(tab => (
                        <button key={tab.key} onClick={() => setInnerTab(tab.key)}
                          className={`flex items-center gap-1 px-3 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                            innerTab === tab.key ? 'border-[var(--ora)] text-[var(--ora)]' : 'border-transparent text-[var(--t3)]'
                          }`}>
                          <Icon name={tab.icon} size={14} /> {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-4 space-y-3">
                      {innerTab === 'client' && (
                        <div className="space-y-2">
                          <div className="flex gap-2 items-center"><Icon name="phone" size={16} color="var(--t3)" /><span className="text-sm">{proj.employerPhone || '---'}</span></div>
                          <div className="flex gap-2 items-center"><Icon name="loc" size={16} color="var(--t3)" /><span className="text-sm">{proj.address}</span></div>
                          <div className="flex gap-2 items-center"><span className="text-sm">درصد اجاره: {proj.monthlyRentPercent}%</span></div>
                        </div>
                      )}
                      {innerTab === 'activity' && (
                        <div className="relative pr-4 border-r-2 border-[var(--border)] space-y-3">
                          {activities.length === 0 ? (
                            <p className="text-xs text-[var(--t3)]">فعالیتی ثبت نشده</p>
                          ) : (
                            activities.map((act, i) => (
                              <div key={act.id || i} className="relative">
                                <span className="absolute -right-[22px] top-1 w-3 h-3 rounded-full border-2 border-white" style={{ background: act.color || 'var(--t3)' }} />
                                <div className="card text-xs">
                                  <div className="flex justify-between">
                                    <span className="font-bold">{act.activityType}</span>
                                    <span className="text-[var(--t3)]">{toJalali(new Date(act.date))}</span>
                                  </div>
                                  <p>{act.serviceType && `${act.serviceType} - `}{act.locationTitle && `${act.locationTitle} - `}{act.volume && `${act.volume.toFixed(1)} m³`}{act.equipmentType && `${act.equipmentType} (${act.quantityChange || ''})`}{act.description && act.description}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                      {innerTab === 'finance' && financials && (
                        <div className="space-y-3">
                          <div className="bg-[var(--bg2)] rounded-xl p-3 space-y-2">
                            <div className="flex justify-between text-sm"><span>هزینه نصب</span><span className="font-bold">{financials.totalInstallCost.toLocaleString()} تومان</span></div>
                            <div className="flex justify-between text-sm"><span>هزینه اجاره</span><span className="font-bold">{financials.totalRentCost.toLocaleString()} تومان</span></div>
                            <div className="flex justify-between text-sm border-t pt-2"><span className="font-bold">جمع کل</span><span className="font-bold text-[var(--ora)]">{financials.grandTotal.toLocaleString()} تومان</span></div>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm mb-2">💰 پرداختی‌ها</h4>
                            {financials.payments.length === 0 ? (
                              <p className="text-xs text-[var(--t3)]">پرداختی ثبت نشده</p>
                            ) : (
                              financials.payments.map(p => (
                                <div key={p.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                                  <span>{toJalali(new Date(p.date))}</span>
                                  <span className="font-bold">{p.amount.toLocaleString()} تومان</span>
                                </div>
                              ))
                            )}
                            <div className="flex justify-between text-sm pt-2 border-t mt-2"><span>مجموع پرداختی</span><span className="font-bold text-[var(--green)]">{financials.totalPaid.toLocaleString()} تومان</span></div>
                          </div>
                          <div className={`rounded-xl p-3 text-center ${financials.remaining > 0 ? 'bg-[var(--red-g)] text-[var(--red)]' : 'bg-[var(--green-g)] text-[var(--green)]'}`}>
                            <p className="text-sm font-bold">{financials.remaining > 0 ? 'مانده بدهی' : 'تسویه شده'}</p>
                            <p className="text-xl font-black">{Math.abs(financials.remaining).toLocaleString()} تومان</p>
                          </div>
                          {isAdmin && (
                            <div className="flex gap-2">
                              <button className="btn btn-sm btn-s flex-1" onClick={() => toggleProjectCompleted(proj.id)}>{proj.isCompleted ? '🔄 بازگشایی' : '✅ پایان پروژه'}</button>
                              <button className="btn btn-sm btn-s flex-1" onClick={() => toggleProjectPaid(proj.id)}>{proj.isPaid ? '❌ لغو تسویه' : '💰 تسویه شد'}</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <EditProjectModal project={editingProject} open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </AppLayout>
  );
}