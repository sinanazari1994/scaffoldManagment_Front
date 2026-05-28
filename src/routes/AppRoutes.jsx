import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { ROLES } from '../lib/constants';

// Worker
import WorkerProjectList from '../features/worker/WorkerProjectList';
import OperationsPage from '../features/operations/OperationsPage';

// Manager
import ManagerDashboard from '../features/dashboard/ManagerDashboard';
import ProjectList from '../features/project/ProjectList';
import ProjectForm from '../features/project/ProjectForm';

import ServiceDetail from '../features/project/ServiceDetail';
import WarehouseList from '../features/warehouse/WarehouseList';
import WarehouseForm from '../features/warehouse/WarehouseForm';
import InventoryView from '../features/warehouse/InventoryView';
import TransactionHistory from '../features/inventory/TransactionHistory';
import SaleForm from '../features/inventory/SaleForm';
import ScrapForm from '../features/inventory/ScrapForm';
import WorkerList from '../features/workers/WorkerList';
import WorkerForm from '../features/workers/WorkerForm';
import InvoiceView from '../features/invoice/InvoiceView';
import ReportView from '../features/invoice/ReportView';
import ServicesPage from '../features/services/ServicesPage';
import EquipmentTypesPage from '../features/equipmentTypes/EquipmentTypesPage';
import MorePage from '../features/more/MorePage';
import PlanLimitReachedPage from '../features/plan/PlanLimitReachedPage';
// Admin
import TenantListPage from '../features/admin/TenantListPage';
import TenantDetailPage from '../features/admin/TenantDetailPage';
import AdminDashboard from '../features/admin/AdminDashboard';
import AdminReports from '../features/admin/AdminReports';
import SupportUsersPage from '../features/admin/SupportUsersPage';
import SubscriptionPlansPage from '../features/admin/SubscriptionPlansPage';
import ReceiptsPage from '../features/admin/ReceiptsPage';
import AdminTenantReport from '../features/admin/AdminTenantReport';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
<Route path="/plan-limit" element={<PlanLimitReachedPage />} />
      {/* ========== Worker ========== */}
      <Route
        path="/worker/dashboard"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.WORKER]}>
              <WorkerProjectList />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/worker/projects/:projectId/operations"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.WORKER]}>
              <OperationsPage />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      {/* مسیرهای قدیمی تسک (redirect) */}
      <Route path="/worker/tasks" element={<Navigate to="/worker/dashboard" replace />} />
      <Route path="/worker/tasks/:taskId" element={<Navigate to="/worker/dashboard" replace />} />
      <Route path="/worker/tasks/:taskId/worklog" element={<Navigate to="/worker/dashboard" replace />} />
      <Route path="/worker/more" element={<div className="p-6 text-center">تنظیمات</div>} />

      {/* ========== Manager ========== */}
      <Route
        path="/manager/dashboard"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <ManagerDashboard />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/projects"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <ProjectList />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/projects/new"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <ProjectForm />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/projects/:projectId"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <ServiceDetail />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
     
      <Route
        path="/manager/warehouses"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <WarehouseList />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/warehouses/new"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <WarehouseForm />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/warehouses/:whId"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <InventoryView />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/warehouses/:whId/history"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <TransactionHistory />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/warehouses/:whId/sale"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <SaleForm />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/warehouses/:whId/scrap"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <ScrapForm />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/workers"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <WorkerList />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/workers/new"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <WorkerForm />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/operations"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <WorkerProjectList />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/operations/:projectId"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <OperationsPage />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/invoice"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <InvoiceView />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/reports"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <ReportView />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/services"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <ServicesPage />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/equipment-types"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <EquipmentTypesPage />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/transactions"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <TransactionHistory />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/more"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.CONTRACTOR, ROLES.OFFICE_MANAGER]}>
              <MorePage />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      {/* ========== Admin ========== */}
     <Route
  path="/admin/dashboard"
  element={
    <PrivateRoute>
      <RoleBasedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT]}>
        <AdminDashboard />
      </RoleBasedRoute>
    </PrivateRoute>
  }
/>
      <Route
        path="/admin/tenants"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT]}>
              <TenantListPage />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/tenants/:tenantId"
        element={
          <PrivateRoute>
            <RoleBasedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT]}>
              <TenantDetailPage />
            </RoleBasedRoute>
          </PrivateRoute>
        }
      />

      <Route path="/admin/dashboard" element={<PrivateRoute><RoleBasedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT]}><AdminDashboard /></RoleBasedRoute></PrivateRoute>} />
<Route path="/admin/tenants" element={<PrivateRoute><RoleBasedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT]}><TenantListPage /></RoleBasedRoute></PrivateRoute>} />
<Route path="/admin/tenants/:tenantId" element={<PrivateRoute><RoleBasedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT]}><TenantDetailPage /></RoleBasedRoute></PrivateRoute>} />
<Route path="/admin/reports" element={<PrivateRoute><RoleBasedRoute roles={[ROLES.SUPER_ADMIN]}><AdminReports /></RoleBasedRoute></PrivateRoute>} />
<Route path="/admin/support" element={<PrivateRoute><RoleBasedRoute roles={[ROLES.SUPER_ADMIN]}><SupportUsersPage /></RoleBasedRoute></PrivateRoute>} />
<Route path="/admin/subscription-plans" element={<PrivateRoute><RoleBasedRoute roles={[ROLES.SUPER_ADMIN]}><SubscriptionPlansPage /></RoleBasedRoute></PrivateRoute>} />
<Route path="/admin/receipts" element={<PrivateRoute><RoleBasedRoute roles={[ROLES.SUPER_ADMIN, ROLES.SUPPORT_AGENT]}><ReceiptsPage /></RoleBasedRoute></PrivateRoute>} />
     <Route
  path="/admin/tenant-reports"
  element={
    <PrivateRoute>
      <RoleBasedRoute roles={[ROLES.SUPER_ADMIN]}>
        <AdminTenantReport />
      </RoleBasedRoute>
    </PrivateRoute>
  }
/>
     
     
      {/* Fallback */}
      <Route path="/unauthorized" element={<div className="p-10 text-center">⛔ دسترسی غیرمجاز</div>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}