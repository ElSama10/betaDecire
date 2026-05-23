import { useState } from 'react';
import { User, Bell, Shield, Moon, Download, Save } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('perfil');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Ajustes de la cuenta y preferencias de la aplicación.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="flex flex-col p-2 space-y-1">
              {[
                { id: 'perfil', label: 'Perfil Profesional', icon: User },
                { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
                { id: 'seguridad', label: 'Seguridad', icon: Shield },
                { id: 'apariencia', label: 'Apariencia', icon: Moon },
                { id: 'exportar', label: 'Exportar Datos', icon: Download },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {activeTab === 'perfil' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Perfil Profesional</h2>
              
              <div className="flex items-center space-x-6">
                <img 
                  src="https://i.pravatar.cc/150?u=ther-001" 
                  alt="Perfil" 
                  className="w-24 h-24 rounded-full object-cover border border-gray-200"
                />
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cambiar foto
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input type="text" defaultValue="Dra. Ana Silva" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
                  <input type="text" defaultValue="Fonoaudióloga" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input type="email" defaultValue="ana.silva@dicere.com" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" defaultValue="+56 9 1234 5678" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                <button className="flex items-center px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}

          {activeTab !== 'perfil' && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p>Opciones de {activeTab} en construcción...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
