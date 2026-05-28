import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import SimpleSelect from '../../components/ui/SimpleSelect';
import { useData } from '../../contexts/DataContext';

export default function SaleForm() {
  const { whId } = useParams();
  const { warehouses, projects, sellItem } = useData();
  const navigate = useNavigate();
  const wh = warehouses.find(w => w.id === whId);

  const [equipment, setEquipment] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [projectId, setProjectId] = useState('');

  const projectOptions = projects.map(p => ({ value: p.id, label: p.employerName }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!equipment || !quantity || !price || !projectId) return;
    sellItem(whId, equipment, parseInt(quantity), Number(price), projectId);
    navigate(-1);
  };

  if (!wh) return <AppLayout title="یافت نشد" onBack={() => navigate(-1)}><div className="p-4">انبار پیدا نشد</div></AppLayout>;

  return (
    <AppLayout title="فروش تجهیزات" onBack={() => navigate(-1)}>
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
        <div className="fg"><label className="fl">قیمت (تومان)</label><input type="number" className="fi" value={price} onChange={e => setPrice(e.target.value)} /></div>
        <SimpleSelect label="پروژه مقصد" options={projectOptions} value={projectId} onChange={setProjectId} />
        <button type="submit" className="btn btn-p btn-w" disabled={!equipment || !quantity || !price || !projectId}>ثبت فروش</button>
      </form>
    </AppLayout>
  );
}