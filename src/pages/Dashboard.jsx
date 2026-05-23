import { 
  Users, 
  Activity, 
  Calendar, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { format, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

const chartData = [
  { name: 'Ene', sessions: 45 },
  { name: 'Feb', sessions: 52 },
  { name: 'Mar', sessions: 48 },
  { name: 'Abr', sessions: 61 },
  { name: 'May', sessions: 55 },
  { name: 'Jun', sessions: 67 },
];

export default function Dashboard() {
  const { patients, schedules, payments } = useStore();

  const activePatients = patients.filter(p => p.status === 'Activo').length;
  const todaysAppointments = schedules.filter(s => isToday(new Date(s.appointmentDate))).length;
  const pendingPayments = payments.filter(p => p.status === 'Pendiente').reduce((acc, curr) => acc + curr.amount, 0);

  const stats = [
    { title: 'Pacientes Totales', value: patients.length, icon: Users, trend: '+12%', positive: true },
    { title: 'Pacientes Activos', value: activePatients, icon: Activity, trend: '+5%', positive: true },
    { title: 'Citas Hoy', value: todaysAppointments, icon: Calendar, trend: '-2%', positive: false },
    { title: 'Pagos Pendientes', value: `$${pendingPayments}`, icon: CreditCard, trend: '+15%', positive: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hola, Dra. Ana 👋</h1>
        <p className="text-gray-500 mt-1">Aquí tienes el resumen de tu consultorio hoy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[var(--color-primary-light)] rounded-xl">
                <stat.icon className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div className={`flex items-center text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend}
                {stat.positive ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Evolución de Sesiones</h2>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>Últimos 6 meses</option>
              <option>Este año</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sessions" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">Agenda de Hoy</h2>
          <div className="flex-1 overflow-y-auto space-y-4">
            {schedules.slice(0,4).map((schedule, i) => {
              const patient = patients.find(p => p.id === schedule.patientId);
              if(!patient) return null;
              return (
                <div key={schedule.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 w-12 h-12 rounded-lg font-semibold text-sm shrink-0">
                    {format(new Date(schedule.appointmentDate), 'HH:mm')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{patient.name}</p>
                    <p className="text-xs text-gray-500 truncate">{schedule.notes}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    schedule.status === 'Confirmada' ? 'bg-green-500' :
                    schedule.status === 'Pendiente' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              );
            })}
          </div>
          <button className="mt-4 w-full py-2.5 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary-light)] rounded-xl hover:bg-blue-100 transition-colors">
            Ver toda la agenda
          </button>
        </motion.div>
      </div>
    </div>
  );
}
