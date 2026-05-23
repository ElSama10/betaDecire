import { useState } from 'react';
import { TrendingUp, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { format } from 'date-fns';
import AddButton from '../components/AddButton';
import DeleteButton from '../components/DeleteButton';

export default function MonthlyFollowups() {
  const { monthlyFollowups, patients, addMonthlyFollowup, removeMonthlyFollowup } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [reportText, setReportText] = useState('');

  const handleGenerate = () => {
    if (!selectedPatient) return alert('Seleccione un paciente');
    
    const newFollowup = {
      id: `mf-${Date.now()}`,
      patientId: selectedPatient,
      completedObjectives: 2,
      pendingObjectives: 3,
      report: reportText || "Reporte generado automáticamente. Se observa avance constante.",
      month: format(new Date(), 'MMMM yyyy')
    };
    
    addMonthlyFollowup(newFollowup);
    setShowForm(false);
    setSelectedPatient('');
    setReportText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seguimiento Mensual</h1>
          <p className="text-gray-500 mt-1">Reportes comparativos de avances clínicos.</p>
        </div>
        <AddButton 
          onClick={() => setShowForm(!showForm)}
          label="Nuevo Reporte"
        />
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Generar Reporte Mensual</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Mes a reportar</label>
              <input type="month" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" defaultValue={format(new Date(), 'yyyy-MM')} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Resumen de avances y dificultades</label>
              <textarea 
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                rows={4} 
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" 
                placeholder="Describa la evolución mensual..."
              ></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button>
            <button onClick={handleGenerate} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 font-medium">Generar Reporte</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monthlyFollowups.map((followup) => {
          const patient = patients.find(p => p.id === followup.patientId);
          return (
            <div key={followup.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <img src={patient?.photo} alt={patient?.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  <div>
                    <h3 className="font-bold text-gray-900">{patient?.name}</h3>
                    <p className="text-sm font-medium text-[var(--color-primary)]">{followup.month}</p>
                  </div>
                </div>
                <DeleteButton onClick={() => removeMonthlyFollowup(followup.id)} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-green-700">{followup.completedObjectives}</p>
                  <p className="text-xs font-medium text-green-600">Completados</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 text-center">
                  <AlertCircle className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-yellow-700">{followup.pendingObjectives}</p>
                  <p className="text-xs font-medium text-yellow-600">Pendientes</p>
                </div>
              </div>

              <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-600">
                <p className="line-clamp-4">{followup.report}</p>
              </div>

              <button className="mt-4 w-full py-2 flex justify-center items-center text-sm font-medium text-[var(--color-primary)] hover:bg-blue-50 rounded-lg transition-colors">
                <FileText className="w-4 h-4 mr-2" />
                Ver Reporte Completo
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
