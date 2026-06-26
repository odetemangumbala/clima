'use client';
import { useEffect, useState } from 'react';
import { listarUtilizadores, alterarStatusUtilizador } from '@/lib/api';
import RotaAdmin from '@/app/componentes/RotaAdmin';
import { Users, UserCheck, UserX, Shield, ShieldOff, RefreshCw } from 'lucide-react';

interface Utilizador {
  id_usuario: string;
  nome: string;
  email: string;
  tipo_usuario: 'USER' | 'ADMIN';
  status: boolean;
}

export default function GestaoUtilizadores() {
  const [users, setUsers] = useState<Utilizador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    setLoading(true);
    setError('');
    try {
      const data: Utilizador[] = await listarUtilizadores();
      setUsers(data);
    } catch (err) {
      setError('Erro ao carregar utilizadores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await alterarStatusUtilizador(id);
      carregar();
    } catch (err) {
      alert('Erro ao alterar status do utilizador.');
    }
  };

  // Estatísticas
  const total = users.length;
  const ativos = users.filter(u => u.status).length;
  const bloqueados = users.filter(u => !u.status).length;
  const admins = users.filter(u => u.tipo_usuario === 'ADMIN').length;

  return (
    <RotaAdmin>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Título */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users size={28} className="text-purple-600" />
              Gestão de Utilizadores
            </h1>
            <p className="text-sm text-gray-500 mt-1">Gerir contas e permissões de todos os utilizadores da plataforma</p>
          </div>
          <button
            onClick={carregar}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-full text-purple-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full text-green-600">
              <UserCheck size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{ativos}</p>
              <p className="text-xs text-gray-500">Activos</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full text-red-600">
              <UserX size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{bloqueados}</p>
              <p className="text-xs text-gray-500">Bloqueados</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full text-amber-600">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{admins}</p>
              <p className="text-xs text-gray-500">Administradores</p>
            </div>
          </div>
        </div>

        {/* Tabela */}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-green-600 text-xl font-light">Carregando...</div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-500">Nenhum utilizador encontrado.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilizador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acção</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id_usuario} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                          {u.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{u.nome}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.tipo_usuario === 'ADMIN'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.tipo_usuario === 'ADMIN' ? (
                          <><Shield size={12} className="mr-1" /> Admin</>
                        ) : (
                          'Utilizador'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.status ? '✅ Activo' : '❌ Bloqueado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleStatus(u.id_usuario)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-white transition ${
                          u.status
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {u.status ? (
                          <>
                            <ShieldOff size={14} /> Bloquear
                          </>
                        ) : (
                          <>
                            <Shield size={14} /> Activar
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RotaAdmin>
  );
}