
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, WalletIcon, PiggyBank, ChartBar, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { icon: Home, label: t('dashboard'), path: '/' },
    { icon: WalletIcon, label: t('net_worth'), path: '/net-worth' },
    { icon: ChartBar, label: t('cashflow'), path: '/cashflow' },
    { icon: PiggyBank, label: t('emergency'), path: '/emergency' },
    { icon: HelpCircle, label: t('help'), path: '/help' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background flex justify-around items-center px-2 z-10">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
