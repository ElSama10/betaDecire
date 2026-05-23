import { Trash2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function DeleteButton({ onClick, className = '' }) {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== 'admin') {
    return null;
  }

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      onClick(e);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className={`p-1.5 text-red-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors ${className}`}
      title="Eliminar"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}