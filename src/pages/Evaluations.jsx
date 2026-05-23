import { useState } from 'react';
import { ClipboardList, FileText, BarChart2 } from 'lucide-react';
import useStore from '../store/useStore';
import { format } from 'date-fns';
import AddButton from '../components/AddButton';
import DeleteButton from '../components/DeleteButton';

export default function Evaluations() {
  const { evaluations, patients, addEvaluation, removeEvaluation } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Leve': return 'bg-green-100 text-green-800';
      case 'Leve a Moderado': return 'bg-yellow-100 text-yellow-800';
      case 'Moderado': return 'bg-orange-100 text-orange-800';
      case 'Severo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateResult = () => {
    if (!selectedPatient) return alert('Seleccione un paciente');
    
    const newEval = {
      id: `eval-${Date.now()}`,
      patientId: selectedPatient,
      areas: {
        lenguajeReceptivo: "Adecuado",
        lenguajeExpresivo: "En desarrollo",
        fonologia: "Comprometido",
        pragmatica: "Adecuado"
      },
      severity: "Leve a Moderado",
      clinicalSummary: "Evaluación generada automáticamente. Se observan áreas de oportunidad en fonología.",
      createdAt: new Date().toISOString()
    };
    
    addEvaluation(newEval);
    setShowForm(false);
    setSelectedPatient('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evaluaciones Clínicas</h1>
          <p className="text-gray-500 mt-1">Registro y resultados de evaluaciones terapéuticas.</p>
        </div>
        <AddButton 
          onClick={() => setShowForm(!showForm)}
          label="Nueva Evaluación"
        />
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Formulario de Evaluación</h2>
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
            {/* Formulario simulado para evaluación */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Áreas Evaluadas</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {['Lenguaje receptivo', 'Lenguaje expresivo', 'Fonología', 'Pragmática', 'Atención', 'Conducta', 'Motricidad orofacial'].map(area => (
                  <label key={area} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                    <span className="text-sm font-medium text-gray-700">{area}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
              Cancelar
            </button>
            <button onClick={handleGenerateResult} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 font-medium">
              Generar Resultado
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {evaluations.map((evalItem) => {
            const patient = patients.find(p => p.id === evalItem.patientId);
            return (
              <div key={evalItem.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 text-[var(--color-primary)] rounded-lg">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{patient?.name}</h3>
                      <p className="text-sm text-gray-500">{format(new Date(evalItem.createdAt), 'dd MMMM, yyyy')}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(evalItem.severity)}`}>
                    {evalItem.severity}
                  </span>
                  <DeleteButton onClick={() => removeEvaluation(evalItem.id)} className="ml-2" />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Resumen Clínico
                  </h4>
                  <p className="text-sm text-gray-600">{evalItem.clinicalSummary}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                    <BarChart2 className="w-4 h-4 mr-1" />
                    Áreas Evaluadas
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(evalItem.areas).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-xs p-2 bg-white border border-gray-100 rounded-lg">
                        <span className="font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className={`font-semibold ${value === 'Comprometido' ? 'text-red-500' : value === 'Adecuado' ? 'text-green-500' : 'text-yellow-500'}`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
