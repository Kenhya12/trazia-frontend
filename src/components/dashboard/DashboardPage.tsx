import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import RecipeTabs from './RecipeTabs';
import DashboardHome from './DashboardHome';
import RawMaterialsPage from './RawMaterialsPage';
import RawMaterialBatchesPage from './RawMaterialBatchesPage';
import FinalProductsPage from './FinalProductsPage';
import RetentionFactorsPage from './RetentionFactorsPage';
import CompanyPage from './CompanyPage';
import UserProfilePage from './UserProfilePage';
import LabelsPage from './LabelsPage';
import ReportsPage from './ReportsPage';
import HelpPage from './HelpPage';
import { SIDEBAR_CONFIG } from '../../constants';
import type { User } from '../../types.ts';

interface DashboardPageProps {
  onLogout: () => void;
  user: User;
  onUserUpdate: (updatedUser: Partial<User>) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, user, onUserUpdate }) => {
  const [activeView, setActiveView] = useState('dashboard');

  const allItems = SIDEBAR_CONFIG.flatMap(s => [s, ...s.children]);
  const activeItem = allItems.find(i => i.id === activeView);
  const pageTitle = activeItem ? activeItem.name : 'Dashboard';

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardHome onNavigate={setActiveView} />;

      // Materias Primas
      case 'raw-materials-list':
        return <RawMaterialsPage initialTab="list" />;
      case 'raw-materials-add':
        return <RawMaterialsPage initialTab="add" />;
      case 'raw-material-batches':
        return <RawMaterialBatchesPage />;

      // Recetas
      case 'recipes-list':
        return <RecipeTabs openCreateModalOnLoad={false} />;
      case 'recipes-add':
        return <RecipeTabs openCreateModalOnLoad={true} />;

      // Productos Finales
      case 'products-list':
        return <FinalProductsPage initialTab="list" />;
      case 'products-add':
        return <FinalProductsPage initialTab="add" />;
      case 'production-lots':
        return <FinalProductsPage initialTab="lots" />;

      // Etiquetas
      case 'labels-list':
        return <LabelsPage openCreateModalOnLoad={false} />;
      case 'labels-add':
        return <LabelsPage openCreateModalOnLoad={true} />;

      // Reportes
      case 'reports-inventory':
      case 'reports-production':
        return <ReportsPage />;

      // Configuración
      case 'config-company':
        return <CompanyPage initialTab="info"/>;
      case 'config-users':
        return <CompanyPage initialTab="users"/>;
      case 'config-prefs':
        return <UserProfilePage user={user} onUserUpdate={onUserUpdate} />;

      // Ayuda
      case 'help':
        return <HelpPage />;

      default:
        return (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Página en Construcción</h2>
            <p className="text-gray-600">
              La funcionalidad para "{pageTitle}" estará disponible próximamente. ¡Gracias por tu paciencia!
            </p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      onLogout={onLogout}
      activeView={activeView}
      onNavigate={setActiveView}
      user={user}
      pageTitle={pageTitle}
    >
      {renderActiveView()}
    </DashboardLayout>
  );
};

export default DashboardPage;