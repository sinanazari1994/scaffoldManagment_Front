import { useEffect, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { WorkProvider } from './contexts/WorkContext';
import { LocationProvider } from './contexts/LocationContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { WarehouseProvider } from './contexts/WarehouseContext';
import { TransfersProvider } from './contexts/TransfersContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { EquipmentTypeProvider } from './contexts/EquipmentTypeContext';
import { setToastHandler } from './services/api';
import Toast from './components/ui/Toast';
import AppRoutes from './routes/AppRoutes';

function AppInitializer() {
  return null;
}

export default function App() {
  const [toast, setToast] = useState(null);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const showToast = useCallback((msg, type = '') => {
    setToast({ msg, type, key: Date.now() });
  }, []);

  setToastHandler(showToast);

  const content = (
    <AuthProvider>
      <ProjectProvider>
        <WarehouseProvider>
          <TransfersProvider>
            <DataProvider>
              <WorkProvider>
                <LocationProvider>
                  <ServiceProvider>
                    <PaymentProvider>
                      <EquipmentTypeProvider>
                        <AppInitializer />
                        <AppRoutes />
                        {toast && (
                          <Toast
                            key={toast.key}
                            msg={toast.msg}
                            type={toast.type}
                            onClose={() => setToast(null)}
                          />
                        )}
                      </EquipmentTypeProvider>
                    </PaymentProvider>
                  </ServiceProvider>
                </LocationProvider>
              </WorkProvider>
            </DataProvider>
          </TransfersProvider>
        </WarehouseProvider>
      </ProjectProvider>
    </AuthProvider>
  );

  if (isAdminRoute) {
    return <div className="min-h-screen bg-[var(--bg)]">{content}</div>;
  }

  return <div className="app">{content}</div>;
}