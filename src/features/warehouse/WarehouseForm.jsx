import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';
import { useWarehouses } from '../../contexts/WarehouseContext'; // اصلاح import

export default function WarehouseForm() {
  const [name, setName] = useState('');
  const { addWarehouse } = useWarehouses(); // استفاده از Context صحیح
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        await addWarehouse(name.trim()); // addWarehouse اکنون async است و به API متصل می‌شود
        navigate('/manager/warehouses');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <AppLayout title="انبار جدید" onBack={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
        <div className="fg">
          <label className="fl">نام انبار</label>
          <input
            className="fi"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="مثال: انبار شماره ۱"
            required
          />
        </div>
        <button type="submit" className="btn btn-p btn-w">
          <Icon name="check" size={18} /> ذخیره
        </button>
      </form>
    </AppLayout>
  );
}