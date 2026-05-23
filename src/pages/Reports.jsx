import { BarChart3, Download, TrendingUp, Users } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const diagnosisData = [
  { name: 'Trastorno Lenguaje', value: 35 },
  { name: 'TEA', value: 25 },
  { name: 'Retraso Simple', value: 20 },
  { name: 'Apraxia', value: 10 },
  { name: 'Otros', value: 10 },
];

const COLORS = ['#165DFF', '#36D399', '#F59E0B', '#EF4444', '#8B5CF6'];

const sessionsData = [
  { name: 'Ene', completadas: 120, canceladas: 15 },
  { name: 'Feb', completadas: 135, canceladas: 10 },
  { name: 'Mar', completadas: 140, canceladas: 12 },
  { name: 'Abr', completadas: 160, canceladas: 8 },
  { name: 'May', completadas: 155, canceladas: 20 },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="text-gray-500 mt-1">Análisis general del consultorio terapéutico.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium">
          <Download className="w-5 h-5 mr-2" />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-[var(--color-primary)]" />
              Pacientes por Diagnóstico
            </h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diagnosisData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {diagnosisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-[var(--color-primary)]" />
              Asistencia a Sesiones
            </h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="completadas" name="Completadas" stackId="a" fill="var(--color-primary)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="canceladas" name="Canceladas" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-gradient-to-r from-[var(--color-primary)] to-blue-500 rounded-2xl p-8 text-white shadow-sm flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 max-w-2xl mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Evolución Terapéutica Global
            </h2>
            <p className="text-blue-100">
              El 85% de los pacientes activos han alcanzado al menos 2 objetivos de su plan de intervención en el último trimestre.
            </p>
          </div>
          <button className="relative z-10 px-6 py-3 bg-white text-[var(--color-primary)] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
            Ver Detalles de Progreso
          </button>
        </div>
      </div>
    </div>
  );
}
