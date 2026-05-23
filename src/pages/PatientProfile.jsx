import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Activity, 
  FileText, 
  Target, 
  TrendingUp, 
  CreditCard, 
  FolderOpen,
  ClipboardList
} from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { format } from 'date-fns';
import ClinicalHistoryForm from '../components/ClinicalHistoryForm';

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, therapists } = useStore();
  const [activeTab, setActiveTab] = useState('resumen');

  const patient = patients.find(p => p.id === id);
  
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-bold text-gray-900">Paciente no encontrado</h2>
        <button onClick={() => navigate('/patients')} className="mt-4 text-[var(--color-primary)] hover:underline">
          Volver a pacientes
        </button>
      </div>
    );
  }

  const therapist = therapists.find(t => t.id === patient.therapistId);

  const tabs = [
    { id: 'resumen', label: 'Resumen', icon: Activity },
    { id: 'historia', label: 'Historia Clínica', icon: FileText },
    { id: 'evaluacion', label: 'Evaluación', icon: ClipboardList },
    { id: 'plan', label: 'Plan de Intervención', icon: Target },
    { id: 'evolucion', label: 'Evolución Diaria', icon: TrendingUp },
    { id: 'seguimiento', label: 'Seguimiento Mensual', icon: Target },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'pagos', label: 'Pagos', icon: CreditCard },
    { id: 'archivos', label: 'Archivos', icon: FolderOpen },
  ];

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/patients')}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a Pacientes
      </button>

      <div className="bg-gradient-to-r from-[var(--color-primary)] to-blue-400 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
          <img 
            src={patient.photo} 
            alt={patient.name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{patient.name}</h1>
                <p className="text-blue-100 mt-1">{patient.age} años • {patient.diagnosis}</p>
              </div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30 self-center md:self-start">
                {patient.status}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6 text-sm">
              <div className="flex flex-col">
                <span className="text-blue-200">Terapeuta Asignado</span>
                <span className="font-medium">{therapist?.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-blue-200">Frecuencia</span>
                <span className="font-medium">{patient.frequency}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-blue-200">Fecha de Ingreso</span>
                <span className="font-medium">{format(new Date(patient.createdAt), 'dd/MM/yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 overflow-x-auto">
          <nav className="flex space-x-1 px-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'resumen' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Resumen Clínico</h3>
                <p className="text-gray-600 leading-relaxed">
                  El paciente ha mostrado un progreso favorable en las últimas semanas. 
                  Se recomienda continuar con la frecuencia actual de {patient.frequency}.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-2">Próxima Cita</h4>
                    <p className="text-sm text-gray-600">25 de Mayo, 2026 - 15:00 hrs</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-2">Última Evaluación</h4>
                    <p className="text-sm text-gray-600">20 de Enero, 2025</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'historia' && (
              <ClinicalHistoryForm patientId={patient.id} />
            )}

            {/* Other tabs placeholders */}
            {['evaluacion', 'plan', 'evolucion', 'seguimiento', 'agenda', 'pagos', 'archivos'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                <p>Contenido para {tabs.find(t => t.id === activeTab)?.label} en construcción...</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
