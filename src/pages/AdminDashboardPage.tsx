import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LoaderCircle, User, Trash2, CheckCircle, XCircle, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  full_name: string;
  email: string; // Assuming email can be fetched or is part of profile
  role: string;
  is_deleted: boolean;
  avatar_url: string;
  created_at: string; // Assuming created_at exists
}

const AdminDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers();
    } else {
      setLoading(false);
      setError('No tienes permisos para acceder a esta página.');
    }
  }, [profile]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, is_deleted, created_at, auth_users:auth.users(email)'); // Fetch email from auth.users

    if (error) {
      console.error('Error fetching users:', error.message);
      setError('Error al cargar usuarios.');
      setUsers([]);
    } else {
      const usersWithEmail = data.map(p => ({
        ...p,
        email: p.auth_users?.email || 'N/A',
      }));
      setUsers(usersWithEmail as UserProfile[]);
    }
    setLoading(false);
  };

  const handleSoftDelete = async (userId: string, isDeleted: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_deleted: isDeleted })
      .eq('id', userId);

    if (error) {
      toast.error(`Error al ${isDeleted ? 'eliminar' : 'restaurar'} usuario: ${error.message}`);
    } else {
      toast.success(`Usuario ${isDeleted ? 'eliminado' : 'restaurado'} correctamente.`);
      fetchUsers(); // Re-fetch users to update the list
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      toast.error(`Error al cambiar el rol: ${error.message}`);
    } else {
      toast.success('Rol de usuario actualizado.');
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-error text-lg">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 lg:p-10"
    >
      <h1 className="text-4xl font-extrabold text-text mb-8 text-center">Panel de Administración</h1>

      <div className="bg-background rounded-xl border border-border shadow-lg p-6">
        <h2 className="text-2xl font-bold text-text mb-6 flex items-center">
          <User className="mr-3 text-primary" /> Gestión de Usuarios
        </h2>

        {users.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No hay usuarios registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-surface">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Avatar
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Nombre Completo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Rol
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className={user.is_deleted ? 'opacity-60 bg-red-900/10' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img className="h-10 w-10 rounded-full object-cover" src={user.avatar_url} alt={user.full_name} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-surface border border-border rounded-md py-1 px-2 text-text focus:ring-primary focus:border-primary"
                      >
                        <option value="volunteer">Voluntario</option>
                        <option value="ong">ONG</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.is_deleted ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error/20 text-error">
                          <XCircle className="w-3 h-3 mr-1" /> Eliminado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success">
                          <CheckCircle className="w-3 h-3 mr-1" /> Activo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleSoftDelete(user.id, !user.is_deleted)}
                        className={`ml-3 p-2 rounded-full ${user.is_deleted ? 'bg-success/20 text-success hover:bg-success/30' : 'bg-error/20 text-error hover:bg-error/30'} transition-colors duration-200`}
                        title={user.is_deleted ? 'Restaurar usuario' : 'Eliminar usuario'}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;
