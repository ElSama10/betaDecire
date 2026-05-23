import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import Evaluations from './pages/Evaluations';
import InterventionPlans from './pages/InterventionPlans';
import DailyEvolution from './pages/DailyEvolution';
import MonthlyFollowups from './pages/MonthlyFollowups';
import Schedule from './pages/Schedule';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="evaluations" element={<Evaluations />} />
          <Route path="intervention-plans" element={<InterventionPlans />} />
          <Route path="daily-evolution" element={<DailyEvolution />} />
          <Route path="monthly-followups" element={<MonthlyFollowups />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
