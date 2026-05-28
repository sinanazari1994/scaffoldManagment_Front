import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useData } from '../../contexts/DataContext';

export default function ScrapForm() {
  const { whId } = useParams();
  const { warehouses, scrapItem } = useData();
  const navigate = useNavigate();
  const wh = warehouses.find(w => w.id === whId);

  const [equipment, setEquipment] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!equipment || !quantity) return;
    scrapItem(whId, equipment, parseInt(quantity));
    navigate(-1);
  };

  if (!wh) return <AppLayout title="یافت نشد" onBack={() => navigate(-1)}><div className="p-4">انبار پیدا نشد</div></AppLayout>;

  return (
    <AppLayout title="ثبت ضایعات" onBack={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
        <h3 className="font-bold">{wh.name}</h3>
        <div className="fg">
          <label className="fl">تجهیزات</label>
          <select className="fi" value={equipment} onChange={e => setEquipment(e.target.value)}>
            <option value="">انتخاب کنید</option>
            {wh.inventory.map(item => <option key={item.equipment} value={item.equipment}>{item.equipment} ({item.quantity})</option>)}
          </select>
        </div>
        <div className="fg"><label className="fl">تعداد</label><input type="number" className="fi" value={quantity} onChange={e => setQuantity(e.target.value)} /></div>
        <button type="submit" className="btn btn-d btn-w" disabled={!equipment || !quantity}>ثبت ضایعات</button>
      </form>
    </AppLayout>
  );
}