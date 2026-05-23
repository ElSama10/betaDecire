import { useState } from 'react';
import { Activity, Clock, ThumbsUp } from 'lucide-react';
import useStore from '../store/useStore';
import { format } from 'date-fns';
import AddButton from '../components/AddButton';
import DeleteButton from '../components/DeleteButton';

export default function DailyEvolution() {
  const { dailyEvolutions, patients, addDailyEvolution, removeDailyEvolution } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [notes, setNotes] = useState('');
  const [responseType, setResponseType] = useState('Buena');

  const getResponseColor = (response) => {
    switch(response) {
      case 'Excelente': return 'bg-green-100 text-green-800';
      case 'Buena': return 'bg-blue-100 text-blue-800';
      case 'Requirió apoyo': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = () => {
    if (!selectedPatient) return alert('Seleccione un paciente');
    
    const newEvolution = {
      id: `evo-${Date.now()}`,
      patientId: selectedPatient,
      sessionNotes: notes || "Sesión de rutina sin observaciones específicas.",
      achievement: "Completó la actividad propuesta satisfactoriamente.",
      response: responseType,
      sessionDate: new Date().toISOString()
    };
    
    addDailyEvolution(newEvolution);
    setShowForm(false);
    setSelectedPatient('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evolución Diaria</h1>
          <p className="text-gray-500 mt-1">Registro rápido de sesiones terapéuticas.</p>
        </div>
        <AddButton 
          onClick={() => setShowForm(!showForm)}
          label="Registrar Sesión"
        />
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Nueva Sesión</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <select 
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              >
                <option value="">Seleccione un paciente</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input type="date" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Actividad y Objetivo</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3} 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" 
                placeholder="Describa la actividad realizada..."
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Respuesta del niño</label>
              <div className="flex space-x-4">
                {['Excelente', 'Buena', 'Requirió apoyo'].map(res => (
                  <label key={res} className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name="response" 
                      value={res}
                      checked={responseType === res}
                      onChange={(e) => setResponseType(e.target.value)}
                      className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
                    />
                    <span className="text-sm text-gray-700">{res}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button>
            <button onClick={handleSave} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 font-medium">Guardar Registro</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Historial de Sesiones</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {dailyEvolutions.map((evo) => {
            const patient = patients.find(p => p.id === evo.patientId);
            return (
              <div key={evo.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <img src={patient?.photo} alt={patient?.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 mt-1" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-900">{patient?.name}</h3>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {format(new Date(evo.sessionDate), 'dd MMM yyyy, HH:mm')}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-2 text-sm">{evo.sessionNotes}</p>
                      <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-sm font-medium text-blue-900 flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Logro: {evo.achievement}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getResponseColor(evo.response)}`}>
                      {evo.response}
                    </span>
                    <DeleteButton onClick={() => removeDailyEvolution(evo.id)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
