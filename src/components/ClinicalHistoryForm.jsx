import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { id: 1, title: 'Motivo de consulta' },
  { id: 2, title: 'Embarazo y parto' },
  { id: 3, title: 'Desarrollo' },
  { id: 4, title: 'Lenguaje' },
  { id: 5, title: 'Observaciones' }
];

export default function ClinicalHistoryForm({ patientId }) {
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      motivo: '',
      embarazo: '',
      desarrolloMotor: '',
      desarrolloLenguaje: '',
      observaciones: ''
    }
  });

  const onSubmit = (data) => {
    console.log("Guardado:", data);
    // En un caso real se guardaría en el store
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-primary)] rounded-full z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${
                  currentStep > step.id 
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                    : currentStep === step.id
                    ? 'bg-white border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
              </div>
              <span className={`absolute top-12 text-xs font-medium w-24 text-center ${
                currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Motivo de consulta</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Por qué asiste a la consulta?</label>
                  <textarea 
                    {...register("motivo")}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                    placeholder="Describa el motivo principal..."
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Embarazo y parto</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detalles del embarazo y nacimiento</label>
                  <textarea 
                    {...register("embarazo")}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                    placeholder="Semanas de gestación, tipo de parto, complicaciones..."
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Desarrollo Motor</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hitos del desarrollo</label>
                  <textarea 
                    {...register("desarrolloMotor")}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                    placeholder="Control cefálico, marcha independiente..."
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Desarrollo del Lenguaje</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primeras palabras y comunicación</label>
                  <textarea 
                    {...register("desarrolloLenguaje")}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                    placeholder="Balbuceo, primeras palabras, frases..."
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Observaciones Clínicas</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales del terapeuta</label>
                  <textarea 
                    {...register("observaciones")}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none"
                    placeholder="Comportamiento durante la entrevista, interacción..."
                  />
                </div>
              </div>
            )}
          </motion.div>

          <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 flex items-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Anterior
            </button>
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 flex items-center text-sm font-medium text-white bg-[var(--color-primary)] rounded-lg hover:bg-blue-700 transition-colors"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 flex items-center text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Historia
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
