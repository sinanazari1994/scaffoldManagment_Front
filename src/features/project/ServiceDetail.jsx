import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useData } from '../../contexts/DataContext';

export default function ServiceDetail() {
  const { projectId, serviceId } = useParams();
  const { projects } = useData();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === projectId);
  const service = project?.services.find(s => s.id === serviceId);

  if (!service) return <AppLayout title="یافت نشد" onBack={() => navigate(-1)}><div className="p-4">خدمت پیدا نشد</div></AppLayout>;

  return (
    <AppLayout title={service.serviceType} onBack={() => navigate(-1)}>
      <div className="p-4 card max-w-md mx-auto space-y-2">
        <p><span className="fl">نوع:</span> {service.serviceType}</p>
        <p><span className="fl">محل:</span> {service.location}</p>
        <p><span className="fl">قیمت:</span> {service.agreedPricePerUnit} تومان</p>
      </div>
    </AppLayout>
  );
}