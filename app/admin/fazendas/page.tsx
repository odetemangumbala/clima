'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contextos/ContextoAuth';
import { listarTodasFazendas } from '@/lib/api';
import Link from 'next/link';
import RotaAdmin from '@/app/componentes/RotaAdmin';

interface Fazenda {
  id_fazenda: string;
  nome_fazenda: string;
  localizacao?: string;
  latitude: number;
  longitude: number;
  tamanho_area?: number;
  tipo_cultura?: string;
  descricao?: string;
  status: boolean;
  usuario: { nome: string; email: string };
}

export default function AdminFazendas() {
  const { utilizador } = useAuth();
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await listarTodasFazendas();
        setFazendas(data);
      } catch (err) {
        setError('Erro ao carregar fazendas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  if (loading) {
    return (
      <RotaAdmin>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-green-600 text-xl font-light">Carregando...</div>
        </div>
      </RotaAdmin>
    );
  }

  return (
    <RotaAdmin>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Todas as Fazendas</h1>
          <Link href="/admin/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Voltar
          </Link>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {fazendas.length === 0 ? (
          <p className="text-gray-500">Nenhuma fazenda cadastrada no sistema.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proprietário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fazendas.map((f) => (
                  <tr key={f.id_fazenda} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {f.nome_fazenda}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {f.usuario?.nome || '—'} ({f.usuario?.email || '—'})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {f.localizacao || `${f.latitude}, ${f.longitude}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          f.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {f.status ? 'Ativa' : 'Inativa'}
                      </span>
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