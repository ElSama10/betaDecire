import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import useStore from '../store/useStore';
import { format, addDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import AddButton from '../components/AddButton';
import DeleteButton from '../components/DeleteButton';

export default function Schedule() {
  const { schedules, patients, addSchedule, removeSchedule } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentDate: format(new Date(), "yyyy-MM-dd'T'10:00"),
    status: 'Confirmada',
    notes: ''
  });

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 5 }).map((_, i) => addDays(startDate, i));

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmada': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelada': return 'bg-red-100 text-red-800 border-red-200';
      case 'Reprogramada': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();
    if (!formData.patientId) return;

    const newSchedule = {
      id: `sch-${Date.now()}`,
      patientId: formData.patientId,
      therapistId: "t-001",
      appointmentDate: new Date(formData.appointmentDate).toISOString(),
      status: formData.status,
      notes: formData.notes || "Cita agendada manualmente"
    };
    addSchedule(newSchedule);
    setShowForm(false);
    setFormData({ ...formData, patientId: '', notes: '' });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda Terapéutica</h1>
          <p className="text-gray-500 mt-1">Gestión de citas y horarios.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            <button className="p-1.5 hover:bg-gray-100 rounded-md" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="px-4 font-medium text-gray-700">
              {format(startDate, 'MMMM yyyy', { locale: es })}
            </span>
            <button className="p-1.5 hover:bg-gray-100 rounded-md" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <AddButton onClick={() => setShowForm(true)} label="Nueva Cita" />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Nueva Cita</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddSchedule} className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
                  <input 
                    type="datetime-local" required
                    value={formData.appointmentDate} onChange={e => setFormData({...formData, appointmentDate: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  >
                    <option value="Confirmada">Confirmada</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Reprogramada">Reprogramada</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea 
                  rows={2}
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
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

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="grid grid-cols-5 border-b border-gray-200 flex-shrink-0">
          {weekDays.map((day, i) => (
            <div key={i} className="p-4 text-center border-r border-gray-100 last:border-r-0">
              <p className="text-sm font-medium text-gray-500 capitalize">{format(day, 'EEEE', { locale: es })}</p>
              <p className={`text-2xl font-bold mt-1 ${format(day, 'dd/MM/yyyy') === format(new Date(), 'dd/MM/yyyy') ? 'text-[var(--color-primary)]' : 'text-gray-900'}`}>
                {format(day, 'dd')}
              </p>
            </div>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-5 gap-4 min-h-full">
            {weekDays.map((day, i) => {
              const daySchedules = schedules.filter(s => format(new Date(s.appointmentDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
              
              return (
                <div key={i} className="space-y-3">
                  {daySchedules.length === 0 ? (
                    <div className="h-24 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                      Sin citas
                    </div>
                  ) : (
                    daySchedules.sort((a,b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)).map(schedule => {
                      const patient = patients.find(p => p.id === schedule.patientId);
                      return (
                        <div key={schedule.id} className={`p-3 rounded-xl border ${getStatusColor(schedule.status)} bg-opacity-50 relative group`}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center text-xs font-bold">
                              <Clock className="w-3 h-3 mr-1" />
                              {format(new Date(schedule.appointmentDate), 'HH:mm')}
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                              <DeleteButton onClick={() => removeSchedule(schedule.id)} className="!p-0.5" />
                            </div>
                          </div>
                          <p className="font-semibold text-sm truncate">{patient?.name}</p>
                          <p className="text-xs mt-1 truncate opacity-80">{schedule.notes}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
