
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };
  
  // Set the header title based on the current route
  const getHeaderTitle = () => {
    switch(location.pathname) {
      case '/':
        return t('financial_overview');
      case '/net-worth':
        return t('net_worth');
      case '/cashflow':
        return t('cashflow');
      case '/emergency':
        return t('emergency_fund');
      case '/help':
        return t('help');
      default:
        return 'Patripoly';
    }
  };
  
  return (
    <div className="py-4 px-4 border-b bg-background flex items-center justify-between">
      <div className="flex items-center">
        <img 
          src="https://infochannel.si/wp-content/uploads/2025/05/Patripoly-Logo-png.png" 
          alt="Patripoly" 
          className="h-8 mr-3" 
        />
        <h1 className="text-xl font-bold text-primary">{getHeaderTitle()}</h1>
      </div>
      {/* Botón de logout movido a MainLayout para mejor orden visual */}
    </div>
  );
};

export default Header;
