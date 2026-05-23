import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Target, 
  Activity, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings,
  Baby
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/patients', icon: Users, label: 'Pacientes' },
  { path: '/evaluations', icon: ClipboardList, label: 'Evaluaciones' },
  { path: '/intervention-plans', icon: Target, label: 'Planes' },
  { path: '/daily-evolution', icon: Activity, label: 'Evolución Diaria' },
  { path: '/monthly-followups', icon: TrendingUp, label: 'Seguimiento' },
  { path: '/schedule', icon: Calendar, label: 'Agenda' },
  { path: '/payments', icon: CreditCard, label: 'Pagos' },
  { path: '/reports', icon: BarChart3, label: 'Reportes' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Baby className="w-8 h-8 text-[var(--color-primary)] mr-2" />
        <span className="text-xl font-bold text-gray-900 tracking-tight">betaClinic1.2</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => twMerge(
              clsx(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]" 
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )
            )}
          >
            <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <NavLink
          to="/settings"
          className={({ isActive }) => twMerge(
            clsx(
              "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]" 
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )
          )}
        >
          <Settings className="w-5 h-5 mr-3 flex-shrink-0" />
          Configuración
        </NavLink>
      </div>
    </aside>
  );
}
