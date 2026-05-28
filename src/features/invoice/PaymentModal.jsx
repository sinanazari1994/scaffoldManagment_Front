import { useState, useEffect } from 'react';
import Sheet from '../../components/ui/Sheet';
import Icon from '../../components/ui/Icon';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export default function PaymentModal({ open, onClose, projectId, editingPayment = null }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingPayment) {
      setAmount(editingPayment.amount?.toString() || '');
      setDate(editingPayment.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
      setNote(editingPayment.note || '');
    } else {
      setAmount('');
      setDate(new Date().toISOString().slice(0, 10));
      setNote('');
    }
  }, [editingPayment, open]);

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    try {
      if (editingPayment) {
        // ویرایش – projectId حذف شود
        await api.put(`${ENDPOINTS.PAYMENTS}/${editingPayment.id}`, {
          amount: numAmount,
          date: new Date(date).toISOString(),  // تبدیل به ISO
          note: note.trim() || null,
        });
      } else {
        // ایجاد
        await api.post(ENDPOINTS.PAYMENTS, {
          projectId,
          amount: numAmount,
          date: new Date(date).toISOString(),
          note: note.trim() || null,
        });
      }
      onClose(true);
    } catch (err) {
      console.error('Failed to save payment', err);
      alert('خطا در ثبت پرداخت');
    }
  };

  return (
    <Sheet open={open} onClose={() => onClose(false)} title={editingPayment ? 'ویرایش پرداخت' : 'ثبت پرداخت جدید'}>
      <div className="space-y-4">
        <div className="fg">
          <label className="fl">مبلغ (تومان)</label>
          <input
            type="number"
            className="fi"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="مبلغ پرداختی"
            min="1"
          />
        </div>

        <div className="fg">
          <label className="fl">📅 تاریخ پرداخت</label>
          <input
            type="date"
            className="fi"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="fg">
          <label className="fl">توضیحات (اختیاری)</label>
          <textarea
            className="fi"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="توضیحات..."
            rows={2}
          />
        </div>

        <button
          className="btn btn-p btn-w"
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          <Icon name="check" size={18} /> {editingPayment ? 'ذخیره تغییرات' : 'ثبت پرداخت'}
        </button>
      </div>
    </Sheet>
  );
}