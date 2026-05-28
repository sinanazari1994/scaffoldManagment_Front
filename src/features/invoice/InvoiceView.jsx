import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StyledSelect from '../../components/ui/StyledSelect';
import Icon from '../../components/ui/Icon';
import { useProjects } from '../../contexts/ProjectContext';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import PaymentModal from './PaymentModal';

export default function InvoiceView() {
  const { projects = [] } = useProjects();
  const navigate = useNavigate();
  const [projectFilter, setProjectFilter] = useState('active');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  const filteredProjects = useMemo(() => {
    if (projectFilter === 'active') return projects.filter(p => !p.isCompleted);
    return projects.filter(p => p.isCompleted);
  }, [projects, projectFilter]);

  const projectOptions = filteredProjects.map(p => ({
    value: p.id,
    label: `${p.employerName} - ${p.address}`,
  }));

  const fetchInvoice = async (projectId) => {
    setIsLoading(true);
    try {
      const res = await api.get(ENDPOINTS.REPORTS_INVOICE(projectId));
      setInvoice(res.data);
    } catch (err) {
      console.warn('Failed to fetch invoice', err);
      setInvoice(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayments = async (projectId) => {
    setPaymentsLoading(true);
    try {
      const res = await api.get(`${ENDPOINTS.PAYMENTS}?projectId=${projectId}`);
      setPayments(res.data || []);
    } catch (err) {
      console.warn('Failed to fetch payments', err);
      setPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    if (projectId) {
      fetchInvoice(projectId);
      fetchPayments(projectId);
    } else {
      setInvoice(null);
      setPayments([]);
    }
  };

  const handlePaymentClose = (refresh) => {
    setPaymentModalOpen(false);
    setEditingPayment(null);
    if (refresh && selectedProjectId) {
      fetchInvoice(selectedProjectId);
      fetchPayments(selectedProjectId);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setPaymentModalOpen(true);
  };

  const handleDelete = async (paymentId) => {
    if (!confirm('آیا از حذف این پرداخت اطمینان دارید؟')) return;
    try {
      await api.delete(`${ENDPOINTS.PAYMENTS}/${paymentId}`);
      if (selectedProjectId) {
        fetchInvoice(selectedProjectId);
        fetchPayments(selectedProjectId);
      }
    } catch (err) {
      console.error('Failed to delete payment', err);
    }
  };

  // محاسبات
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const grandTotal = invoice?.grandTotal ?? 0;
  const remaining = grandTotal - totalPaid;

  return (
    <AppLayout title="فاکتور پروژه" onBack={() => navigate(-1)}>
      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* تب‌ها */}
        <div className="flex bg-[var(--bg2)] rounded-xl p-1">
          <button
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm ${projectFilter === 'active' ? 'bg-white shadow text-[var(--ora)]' : 'text-[var(--t3)]'}`}
            onClick={() => { setProjectFilter('active'); setSelectedProjectId(''); setInvoice(null); }}
          >
            در حال اجرا
          </button>
          <button
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm ${projectFilter === 'completed' ? 'bg-white shadow text-[var(--ora)]' : 'text-[var(--t3)]'}`}
            onClick={() => { setProjectFilter('completed'); setSelectedProjectId(''); setInvoice(null); }}
          >
            تکمیل شده
          </button>
        </div>

        <StyledSelect
          label="پروژه"
          options={projectOptions}
          value={selectedProjectId}
          onChange={handleSelectProject}
          placeholder="-- انتخاب کنید --"
          horizontal
        />

        {isLoading && (
          <div className="empty">
            <div className="empty-icon">⏳</div>
            <h3 className="empty-title">در حال دریافت فاکتور...</h3>
          </div>
        )}

        {!isLoading && invoice && (
          <div className="space-y-4">
            {/* ۱. مشخصات پروژه */}
            <div className="card">
              <h3 className="text-lg font-black mb-2">{invoice.projectName}</h3>
              <p className="text-sm text-[var(--t3)]">{invoice.address}</p>
              <p className="text-sm text-[var(--t3)] mt-1">
                درصد اجاره ماهیانه: <strong>{invoice.monthlyRentPercent ?? 0}%</strong>
              </p>
            </div>

            {/* ۲. هزینه نصب */}
            <div className="card">
              <h3 className="font-bold text-lg mb-3">💰 هزینهٔ نصب</h3>
              {invoice.installDetails?.length === 0 ? (
                <p className="text-sm">نصبی ثبت نشده</p>
              ) : (
                invoice.installDetails.map((d, i) => (
                  <div key={i} className="border-b border-[var(--border)] pb-2 mb-2 last:border-0 last:mb-0">
                    <p className="font-bold">{d.serviceType}</p>
                    <div className="flex justify-between text-sm">
                      <span>حجم کل: {d.totalVolume?.toFixed(2)} m³</span>
                      <span>قیمت واحد: {d.unitPrice?.toLocaleString()} تومان</span>
                    </div>
                    <p className="text-right text-[var(--green)] font-bold text-base mt-1">
                      {d.cost?.toLocaleString()} تومان
                    </p>
                  </div>
                ))
              )}
              <div className="flex justify-between font-black text-base mt-2 pt-2 border-t border-[var(--border)]">
                <span>جمع هزینه نصب</span>
                <span className="text-[var(--green)]">{invoice.totalInstallCost?.toLocaleString()} تومان</span>
              </div>
            </div>

            {/* ۳. هزینه اجاره */}
            {invoice.rentDetails?.length > 0 && (
              <div className="card">
                <h3 className="font-bold text-lg mb-3">🏠 هزینهٔ اجاره</h3>
                {invoice.rentDetails.map((d, i) => (
                  <div key={i} className="border-b border-[var(--border)] pb-2 mb-2 last:border-0 last:mb-0 text-sm">
                    <p className="font-bold">{d.serviceType} - {d.locationTitle}</p>
                    {d.installVolume > 0 && <p>حجم: {d.installVolume.toFixed(2)} m³</p>}
                    <p>مدت اجاره: {d.rentDays} روز ({d.extraMonths} ماه اضافه)</p>
                    <p>درصد اجاره: {d.rentPercent ?? 0}%</p>
                    <p className="text-right text-[var(--ora)] font-bold mt-1">
                      {d.rentCost?.toLocaleString()} تومان
                    </p>
                  </div>
                ))}
                <div className="flex justify-between font-black text-base mt-2 pt-2 border-t border-[var(--border)]">
                  <span>جمع هزینه اجاره</span>
                  <span className="text-[var(--ora)]">{invoice.totalRentCost?.toLocaleString()} تومان</span>
                </div>
              </div>
            )}

            {/* ۴. مبلغ کل فاکتور (جمع نصب + اجاره) */}
            <div className="card">
              <h3 className="font-bold text-lg mb-3">📋 مبلغ کل فاکتور</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm">مجموع هزینه نصب و اجاره</span>
                <span className="text-xl font-black text-[var(--tx)]">
                  {invoice.grandTotal?.toLocaleString()} تومان
                </span>
              </div>
            </div>

            {/* ۵. دکمه ثبت پرداخت جدید */}
            <button
              className="btn btn-s w-full"
              onClick={() => {
                setEditingPayment(null);
                setPaymentModalOpen(true);
              }}
            >
              <Icon name="plus" size={16} /> ثبت پرداخت جدید
            </button>

            {/* ۶. پرداختی‌ها */}
            <div className="card">
              <h3 className="font-bold text-lg mb-3">💳 پرداختی‌ها</h3>
              {paymentsLoading ? (
                <p className="text-sm text-[var(--t3)]">در حال بارگذاری...</p>
              ) : payments.length === 0 ? (
                <p className="text-sm text-[var(--t3)]">پرداختی ثبت نشده است</p>
              ) : (
                <div className="space-y-2">
                  {payments.map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-[var(--bg2)] rounded-lg p-2.5">
                      <div>
                        <span className="font-bold text-sm">{p.amount.toLocaleString()} تومان</span>
                        <p className="text-xs text-[var(--t3)]">{new Date(p.date).toLocaleDateString('fa-IR')}</p>
                        {p.note && <p className="text-xs text-[var(--t3)]">{p.note}</p>}
                      </div>
                      <div className="flex gap-1">
                        <button className="btn btn-xs btn-g" onClick={() => handleEdit(p)} title="ویرایش">
                          <Icon name="edit" size={14} />
                        </button>
                        <button className="btn btn-xs btn-g text-[var(--red)]" onClick={() => handleDelete(p.id)} title="حذف">
                          <Icon name="x" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-sm pt-2 border-t border-[var(--border)]">
                    <span>مجموع پرداختی</span>
                    <span className="text-[var(--green)]">{totalPaid.toLocaleString()} تومان</span>
                  </div>
                </div>
              )}
            </div>

            {/* ۷. مبلغ قابل پرداخت */}
            <div
              className="card text-white text-center"
              style={{ background: 'linear-gradient(135deg, var(--ora), var(--ora2))' }}
            >
              <p className="text-sm font-bold">
                {remaining > 0 ? '💰 مبلغ قابل پرداخت' : '✅ تسویه شده'}
              </p>
              <p className="text-2xl font-black mt-1">
                {remaining > 0 ? `${remaining.toLocaleString()} تومان` : '۰ تومان'}
              </p>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        open={paymentModalOpen}
        onClose={handlePaymentClose}
        projectId={selectedProjectId}
        editingPayment={editingPayment}
      />
    </AppLayout>
  );
}