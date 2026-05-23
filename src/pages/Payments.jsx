import { useState } from 'react';
import { CreditCard, DollarSign, Download, Plus, Search, Filter, X } from 'lucide-react';
import useStore from '../store/useStore';
import { format } from 'date-fns';
import AddButton from '../components/AddButton';
import DeleteButton from '../components/DeleteButton';
import PaymentReceiptModal from '../components/PaymentReceiptModal';

export default function Payments() {
  const { payments, patients, addPayment, removePayment } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [formData, setFormData] = useState({
    patientId: '',
    amount: '',
    status: 'Pagado',
    method: 'Transferencia'
  });

  const filteredPayments = payments.filter(payment => {
    const patient = patients.find(p => p.id === payment.patientId);
    const matchesSearch = patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pagado': return 'bg-green-100 text-green-800';
      case 'Parcial': return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalIngresos = payments.filter(p => p.status === 'Pagado' || p.status === 'Parcial').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPendiente = payments.filter(p => p.status === 'Pendiente').reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.amount) return;

    const newPayment = {
      id: `pay-${Date.now()}`,
      patientId: formData.patientId,
      amount: parseFloat(formData.amount),
      status: formData.status,
      paymentDate: new Date().toISOString().split('T')[0],
      method: formData.method
    };
    addPayment(newPayment);
    setShowForm(false);
    setFormData({ patientId: '', amount: '', status: 'Pagado', method: 'Transferencia' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagos y Facturación</h1>
          <p className="text-gray-500 mt-1">Gestión financiera y estado de cuenta de pacientes.</p>
        </div>
        <AddButton onClick={() => setShowForm(true)} label="Nuevo Pago" />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Nuevo Pago</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                <select 
                  required
                  value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                >
                  <option value="">Seleccione un paciente</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                  <input 
                    type="number" required min="0" step="0.01"
                    value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método</label>
                  <select 
                    value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  >
                    <option value="Transferencia">Transferencia</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select 
                  value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                >
                  <option value="Pagado">Pagado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Parcial">Parcial</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+12% este mes</span>
          </div>
          <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">${totalIngresos.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">3 facturas</span>
          </div>
          <p className="text-sm font-medium text-gray-500">Por Cobrar</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">${totalPendiente.toFixed(2)}</p>
        </div>
        <div className="bg-[var(--color-primary)] p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center items-center text-center">
          <h3 className="font-bold text-lg mb-2">Generar Reporte Mensual</h3>
          <p className="text-blue-100 text-sm mb-4">Exporta un resumen financiero en PDF.</p>
          <button className="flex items-center px-4 py-2 bg-white text-[var(--color-primary)] rounded-lg font-medium hover:bg-blue-50 transition-colors w-full justify-center">
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar por paciente o método..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm font-medium border-b border-gray-100">
                <th className="px-6 py-4">ID Transacción</th>
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Método</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Monto</th>
                <th className="px-6 py-4 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {payments.map((payment) => {
                const patient = patients.find(p => p.id === payment.patientId);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs">{payment.id.toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={patient?.photo} alt={patient?.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                        <span className="font-semibold text-gray-900">{patient?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{format(new Date(payment.paymentDate), 'dd MMM, yyyy')}</td>
                    <td className="px-6 py-4 text-gray-600">{payment.method}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">${payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <DeleteButton onClick={() => removePayment(payment.id)} />
                          {payment.status === 'Pagado' && (
                            <button 
                              onClick={() => setSelectedReceipt({ payment, patient })}
                              className="text-[var(--color-primary)] hover:text-blue-800 font-medium px-2"
                            >
                              Ver PDF
                            </button>
                          )}
                        </div>
                      </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReceipt && (
        <PaymentReceiptModal 
          payment={selectedReceipt.payment} 
          patient={selectedReceipt.patient} 
          onClose={() => setSelectedReceipt(null)} 
        />
      )}
    </div>
  );
}
