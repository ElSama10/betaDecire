import { useState } from 'react';
import { Target, Plus, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import useStore from '../store/useStore';
import { format } from 'date-fns';
import AddButton from '../components/AddButton';
import DeleteButton from '../components/DeleteButton';

export default function InterventionPlans() {
  const { interventionPlans, patients, addInterventionPlan, removeInterventionPlan } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [objective, setObjective] = useState('');

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completado': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'En progreso': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'Pendiente': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleAddPlan = (e) => {
    e.preventDefault();
    if (!selectedPatient || !objective) return;

    const newPlan = {
      id: `plan-${Date.now()}`,
      patientId: selectedPatient,
      objectives: [
        {
          id: `obj-${Date.now()}-1`,
          description: objective,
          status: "Pendiente",
          priority: "Alta"
        }
      ],
      progress: 0,
      status: "Activo",
      updatedAt: new Date().toISOString()
    };
    addInterventionPlan(newPlan);
    setShowForm(false);
    setSelectedPatient('');
    setObjective('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planes de Intervención</h1>
          <p className="text-gray-500 mt-1">Gestión de objetivos y seguimiento terapéutico.</p>
        </div>
        <AddButton onClick={() => setShowForm(true)} label="Nuevo Plan" />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Nuevo Plan</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddPlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                <select 
                  required
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                >
                  <option value="">Seleccione un paciente</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primer Objetivo</label>
                <textarea 
                  required
                  rows={3}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" 
                  placeholder="Ej. Mejorar articulación de fonemas..."
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700">Crear Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {interventionPlans.map((plan) => {
          const patient = patients.find(p => p.id === plan.patientId);
          return (
            <div key={plan.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-4">
                  <img src={patient?.photo} alt={patient?.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{patient?.name}</h3>
                    <p className="text-sm text-gray-500">Actualizado: {format(new Date(plan.updatedAt), 'dd MMM yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[var(--color-primary)]">{plan.progress}%</span>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Progreso</p>
                  </div>
                  <DeleteButton onClick={() => removeInterventionPlan(plan.id)} />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <h4 className="font-bold text-gray-700 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-[var(--color-primary)]" />
                  Objetivos
                </h4>
                
                <div className="space-y-3">
                  {plan.objectives.map((obj) => (
                    <div key={obj.id} className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="mt-0.5 mr-3 flex-shrink-0">
                        {getStatusIcon(obj.status)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${obj.status === 'Completado' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {obj.description}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            obj.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                            obj.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            Prioridad {obj.priority}
                          </span>
                          <span className="text-xs text-gray-500">{obj.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
