import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Icon from '../../components/ui/Icon';
import ImageUploader from '../../components/ui/ImageUploader';
import { useProjects } from '../../contexts/ProjectContext';
import ServicePriceSection from './components/ServicePriceSection';

export default function ProjectForm() {
  const { addProject } = useProjects();
  const navigate = useNavigate();

  const [employerName, setEmployerName] = useState('');
  const [employerPhone, setEmployerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyRentPercent, setMonthlyRentPercent] = useState(10);
  const [images, setImages] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employerName.trim() || !address.trim()) return;
    if (selectedServices.length === 0) return;

    try {
      await addProject({
        employerName: employerName.trim(),
        employerPhone: employerPhone.trim(),
        address: address.trim(),
        monthlyRentPercent: Number(monthlyRentPercent),
        servicePrices: selectedServices,
        images,
      });
      navigate('/manager/projects');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout title="پروژه جدید" onBack={() => navigate(-1)}>
      <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-5">
        <div className="card space-y-4">
          <h3 className="font-bold text-lg">اطلاعات کارفرما</h3>
          <div className="fg">
            <label className="fl">نام کارفرما *</label>
            <input className="fi" value={employerName} onChange={e => setEmployerName(e.target.value)} placeholder="نام کامل" required />
          </div>
          <div className="fg">
            <label className="fl">شماره موبایل</label>
            <input className="fi" value={employerPhone} onChange={e => setEmployerPhone(e.target.value)} placeholder="۰۹۱۲xxxxxxx" />
          </div>
          <div className="fg">
            <label className="fl">آدرس پروژه *</label>
            <input className="fi" value={address} onChange={e => setAddress(e.target.value)} placeholder="آدرس دقیق" required />
          </div>
          <div className="fg">
            <label className="fl">درصد اجاره ماهیانه</label>
            <input type="number" className="fi" value={monthlyRentPercent} onChange={e => setMonthlyRentPercent(e.target.value)} min="0" max="100" />
          </div>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <ServicePriceSection
          selectedServices={selectedServices}
          onServicesChange={setSelectedServices}
        />

        <button type="submit" className="btn btn-p btn-w" disabled={selectedServices.length === 0}>
          <Icon name="check" size={18} /> ذخیره پروژه
        </button>
      </form>
    </AppLayout>
  );
}