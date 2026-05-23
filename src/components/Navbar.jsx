import { Bell, Search, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm transition-colors"
            placeholder="Buscar pacientes, citas..."
          />
        </div>
      </div>
      
      <div className="ml-4 flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-500 relative">
          <span className="sr-only">Notificaciones</span>
          <Bell className="h-6 w-6" />
          <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <div className="flex items-center space-x-4 border-l pl-4 border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-sm">
              <p className="text-gray-700 font-medium capitalize">{user?.username}</p>
              <p className="text-gray-500 text-xs capitalize">{user?.role === 'admin' ? 'Administrador' : 'Visualizador'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
