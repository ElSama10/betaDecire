import { X, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function PaymentReceiptModal({ payment, patient, onClose }) {
  if (!payment || !patient) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 print:bg-white print:p-0">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 print:shadow-none print:w-full print:max-w-none">
        
        {/* Actions - hidden when printing */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h2 className="text-xl font-bold text-gray-900">Comprobante de Pago</h2>
          <div className="flex items-center space-x-2">
            <button onClick={handlePrint} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Printer className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="space-y-6">
          <div className="text-center border-b-2 border-gray-100 pb-6">
            <div className="w-16 h-16 bg-[var(--color-primary)] text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">bC</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">betaClinic1.2</h3>
            <p className="text-gray-500 mt-1">Comprobante Oficial de Pago</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-medium">Recibo Nº</p>
              <p className="font-bold text-gray-900 font-mono">{payment.id.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 font-medium">Fecha</p>
              <p className="font-bold text-gray-900">{format(new Date(payment.paymentDate), 'dd MMMM yyyy', { locale: es })}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-gray-500 font-medium text-sm mb-1">Recibimos de:</p>
            <p className="font-bold text-gray-900 text-lg">{patient.name}</p>
            <p className="text-gray-600 text-sm mt-1">Paciente Activo - {patient.diagnosis}</p>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-900">Servicios Terapéuticos</p>
              <p className="text-sm text-gray-500">{payment.method}</p>
            </div>
            <p className="text-xl font-bold text-[var(--color-primary)]">${payment.amount.toFixed(2)}</p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Estado:</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
              PAGADO
            </span>
          </div>

          <div className="pt-8 text-center text-sm text-gray-400">
            <p>Este documento es un comprobante válido de pago.</p>
            <p>Gracias por confiar en betaClinic1.2</p>
          </div>
        </div>
      </div>
    </div>
  );
}