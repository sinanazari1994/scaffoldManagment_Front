import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useWarehouses } from '../../contexts/WarehouseContext';
import { useProjects } from '../../contexts/ProjectContext';
import { useTransfers } from '../../contexts/TransfersContext';
import { ROLES } from '../../lib/constants';
import WarehouseTab from './components/WarehouseTab';
import ProjectTab from './components/ProjectTab';
import InModal from './components/InModal';
import OutModal from './components/OutModal';
import AddEquipmentModal from './components/AddEquipmentModal';
import AddEquipmentTypeModal from './components/AddEquipmentTypeModal';

export default function WarehouseList() {
  const { warehouses = [], isLoading, fetchWarehouses, fetchAggregatedInventory } = useWarehouses();
  const { projects = [], fetchProjects } = useProjects();
  const {
    pendingTransfers = [],
    createOutgoingTransfer,
    createProjectToPendingTransfer,
    resolveItemsFromPending,
    fetchPendingTransfers,
  } = useTransfers();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === ROLES.CONTRACTOR;

  // واکشی اولیه
  useEffect(() => {
    fetchWarehouses();
    fetchPendingTransfers();
  }, [fetchWarehouses, fetchPendingTransfers]);

  const [tab, setTab] = useState('warehouses');

  // stateهای مودال‌ها (بالا نگه داشته می‌شوند تا بین فرزندان به اشتراک گذاشته شوند)
  const [showInModal, setShowInModal] = useState(false);
  const [inEntityType, setInEntityType] = useState(null);
  const [inEntityId, setInEntityId] = useState(null);

  const [showOutModal, setShowOutModal] = useState(false);
  const [outEntityType, setOutEntityType] = useState(null);
  const [outEntityId, setOutEntityId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addWhId, setAddWhId] = useState(null);

  const [showNewEquipModal, setShowNewEquipModal] = useState(false);

  // توابعی که مودال‌ها نیاز دارند
  const openInModal = (type, id) => {
    setInEntityType(type);
    setInEntityId(id);
    setShowInModal(true);
  };

  const openOutModal = (type, id) => {
    setOutEntityType(type);
    setOutEntityId(id);
    setShowOutModal(true);
  };

  const openAddModal = (whId) => {
    setAddWhId(whId);
    setShowAddModal(true);
  };

  const handleInSuccess = async (itemsArray) => {
    await resolveItemsFromPending(inEntityType, inEntityId, user?.id || 'unknown', itemsArray);
    setShowInModal(false);
    fetchPendingTransfers();
    
    // به‌روزرسانی موجودی مقصد
    if (inEntityType === 'warehouse') {
      await fetchWarehouses();
    } else {
      await fetchProjects();
    }
  };

  const handleOutSuccess = async (itemsArray) => {
    if (outEntityType === 'warehouse') {
      await createOutgoingTransfer(outEntityId, itemsArray, user?.id || 'unknown');
      await fetchWarehouses();
    } else {
      await createProjectToPendingTransfer(outEntityId, itemsArray, user?.id || 'unknown');
      await fetchProjects();
    }
    setShowOutModal(false);
    fetchPendingTransfers();
  };

  return (
    <AppLayout title="دارایی‌ها" onBack={() => navigate(-1)}>
      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* تب‌ها */}
        <div className="flex bg-[var(--bg2)] rounded-xl p-1">
          <button
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm ${tab === 'warehouses' ? 'bg-white shadow text-[var(--ora)]' : 'text-[var(--t3)]'}`}
            onClick={() => setTab('warehouses')}
          >
            🏗️ انبارها
          </button>
          <button
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm ${tab === 'projects' ? 'bg-white shadow text-[var(--ora)]' : 'text-[var(--t3)]'}`}
            onClick={() => setTab('projects')}
          >
            📋 پروژه‌ها
          </button>
        </div>

        <WarehouseTab
  warehouses={warehouses}
  isAdmin={isAdmin}
  onNewWarehouse={() => navigate('/manager/warehouses/new')}
  onIn={openInModal}
  onOut={openOutModal}
  onAdd={openAddModal}
  fetchAggregatedInventory={fetchAggregatedInventory}   // ← این خط را اضافه کنید
/>

        {tab === 'projects' && (
          <ProjectTab
            projects={projects}
            onIn={openInModal}
            onOut={openOutModal}
          />
        )}
      </div>

      {/* مودال‌ها */}
      <InModal
        open={showInModal}
        onClose={() => setShowInModal(false)}
        onSuccess={handleInSuccess}
        pendingTransfers={pendingTransfers}
        warehouses={warehouses}
        projects={projects}
        entityType={inEntityType}
        entityId={inEntityId}
      />

      <OutModal
        open={showOutModal}
        onClose={() => setShowOutModal(false)}
        onSuccess={handleOutSuccess}
        warehouses={warehouses}
        projects={projects}
        entityType={outEntityType}
        entityId={outEntityId}
        fetchAggregatedInventory={fetchAggregatedInventory}
      />

      {isAdmin && (
        <>
          <AddEquipmentModal
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            warehouseId={addWhId}
            onAddSuccess={() => {
              setShowAddModal(false);
              fetchWarehouses();
            }}
            onNewTypeRequest={() => setShowNewEquipModal(true)}
          />
          <AddEquipmentTypeModal
            open={showNewEquipModal}
            onClose={() => setShowNewEquipModal(false)}
          />
        </>
      )}
    </AppLayout>
  );
}