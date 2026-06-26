'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contextos/ContextoAuth';
import { listarTodosPontos } from '@/lib/api';
import Link from 'next/link';
import RotaAdmin from '@/app/componentes/RotaAdmin';

interface Ponto {
  id_ponto: string;
  nome_ponto: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  descricao?: string;
  status: boolean;
  fazenda: {
    nome_fazenda: string;
    usuario: { nome: string };
  };
}

export default function AdminPontos() {
  const { utilizador } = useAuth();
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await listarTodosPontos();
        setPontos(data);
      } catch (err) {
        setError('Erro ao carregar pontos.');
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
          <h1 className="text-2xl font-bold text-gray-800">Todos os Pontos de Monitorização</h1>
          <Link href="/admin/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Voltar
          </Link>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        {pontos.length === 0 ? (
          <p className="text-gray-500">Nenhum ponto cadastrado no sistema.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fazenda</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordenadas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proprietário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pontos.map((p) => (
                  <tr key={p.id_ponto} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nome_ponto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.fazenda?.nome_fazenda || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.latitude}, {p.longitude}
                      {p.altitude && ` • ${p.altitude}m`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.fazenda?.usuario?.nome || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${p.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.status ? 'Ativo' : 'Inativo'}
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