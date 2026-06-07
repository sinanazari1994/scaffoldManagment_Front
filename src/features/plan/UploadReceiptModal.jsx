import { useState } from 'react';
import Sheet from '../../components/ui/Sheet';
import Icon from '../../components/ui/Icon';
import ImageUploader from '../../components/ui/ImageUploader';
import JalaliDatePicker from '../../components/ui/JalaliDatePicker';
import { fromJalali, getJalaliToday } from '../../lib/dateHelpers';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';

export default function UploadReceiptModal({ open, onClose }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getJalaliToday());
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0 || images.length === 0) return;
    setLoading(true);
    try {
      await api.post(ENDPOINTS.RECEIPTS || '/receipts', {
        amount: amt,
        date: fromJalali(date),
        imageUrl: images[0],   // اولین عکس به‌عنوان فیش
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setAmount('');
        setDate(getJalaliToday());
        setImages([]);
      }, 2000);
    } catch (err) {
      alert('خطا در ارسال فیش. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="آپلود فیش واریزی">
      <div className="space-y-4">
        {success ? (
          <div className="text-center text-[var(--green)] font-bold">✅ فیش با موفقیت ارسال شد</div>
        ) : (
          <>
            <div className="fg">
              <label className="fl">مبلغ واریزی (تومان)</label>
              <input
                type="number"
                className="fi"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="مبلغ واریزی"
                min="1"
              />
            </div>
            <JalaliDatePicker label="📅 تاریخ واریز" value={date} onChange={setDate} />
            <ImageUploader images={images} onChange={setImages} />
            <button
              className="btn btn-p btn-w"
              onClick={handleSubmit}
              disabled={loading || !amount || images.length === 0}
            >
              {loading ? 'در حال ارسال...' : 'ارسال فیش'}
            </button>
          </>
        )}
      </div>
    </Sheet>
  );
}