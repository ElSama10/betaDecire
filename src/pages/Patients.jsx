import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List as ListIcon,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import AddButton from '../components/AddButton';
import DeleteButton from '../components/DeleteButton';

export default function Patients() {
  const navigate = useNavigate();
  const { patients, therapists, addPatient, removePatient } = useStore();
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    diagnosis: '',
    frequency: '1 vez/semana',
    status: 'Activo'
  });

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Activo': return 'bg-green-100 text-green-800';
      case 'Reevaluación': return 'bg-blue-100 text-blue-800';
      case 'Suspendido': return 'bg-red-100 text-red-800';
      case 'Alta terapéutica': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newPatient = {
      id: `p-${Date.now()}`,
      name: formData.name,
      age: parseInt(formData.age) || 0,
      diagnosis: formData.diagnosis || 'Por evaluar',
      therapistId: therapists[0]?.id || "t-001",
      frequency: formData.frequency,
      status: formData.status,
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
      createdAt: new Date().toISOString()
    };
    addPatient(newPatient);
    setShowForm(false);
    setFormData({ name: '', age: '', diagnosis: '', frequency: '1 vez/semana', status: 'Activo' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-500 mt-1">Gestiona el expediente clínico de tus pacientes.</p>
        </div>
        <AddButton onClick={() => setShowForm(true)} label="Nuevo Paciente" />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Nuevo Paciente</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                  <input 
                    type="number" required
                    value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Reevaluación">Reevaluación</option>
                    <option value="Suspendido">Suspendido</option>
                    <option value="Alta terapéutica">Alta terapéutica</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico (Opcional)</label>
                <input 
                  type="text"
                  value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" 
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-1 w-full gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Reevaluación">Reevaluación</option>
              <option value="Suspendido">Suspendido</option>
              <option value="Alta terapéutica">Alta terapéutica</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ListIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm font-medium border-b border-gray-100">
                  <th className="px-6 py-4">Paciente</th>
                  <th className="px-6 py-4">Edad</th>
                  <th className="px-6 py-4">Diagnóstico</th>
                  <th className="px-6 py-4">Terapeuta</th>
                  <th className="px-6 py-4">Frecuencia</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredPatients.map((patient) => {
                  const therapist = therapists.find(t => t.id === patient.therapistId);
                  return (
                    <tr 
                      key={patient.id} 
                      onClick={() => navigate(`/patients/${patient.id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img src={patient.photo} alt={patient.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          <span className="font-semibold text-gray-900">{patient.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{patient.age} años</td>
                      <td className="px-6 py-4 text-gray-600">{patient.diagnosis}</td>
                      <td className="px-6 py-4 text-gray-600">{therapist?.name}</td>
                      <td className="px-6 py-4 text-gray-600">{patient.frequency}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <DeleteButton onClick={(e) => { e.stopPropagation(); removePatient(patient.id); }} />
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Mostrando {filteredPatients.length} pacientes</span>
            <div className="flex items-center space-x-2">
              <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 disabled:opacity-50" disabled>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPatients.map((patient, i) => {
            const therapist = therapists.find(t => t.id === patient.therapistId);
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                key={patient.id}
                onClick={() => navigate(`/patients/${patient.id}`)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow relative group"
              >
                <div className="absolute top-4 right-4 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DeleteButton onClick={(e) => { e.stopPropagation(); removePatient(patient.id); }} />
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-col items-center text-center mt-2">
                  <img src={patient.photo} alt={patient.name} className="w-20 h-20 rounded-full object-cover border-2 border-gray-100 mb-4" />
                  <h3 className="font-bold text-gray-900 text-lg">{patient.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{patient.age} años • {patient.diagnosis}</p>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Terapeuta</span>
                    <span className="text-gray-900 font-medium truncate ml-2">{therapist?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Frecuencia</span>
                    <span className="text-gray-900 font-medium">{patient.frequency}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
