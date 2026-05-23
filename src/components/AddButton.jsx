import { Plus } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function AddButton({ onClick, label }) {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== 'admin') {
    return null; // Don't render anything if not admin
  }

  return (
    <button 
      onClick={onClick}
      className="flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
    >
      <Plus className="w-5 h-5 mr-2" />
      {label}
    </button>
  );
}