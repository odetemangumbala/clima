'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contextos/ContextoAuth';
import { useRouter } from 'next/navigation';
import {
  listarUtilizadores,
  listarTodasFazendas,
  listarTodosPontos,
  listarTodosAlertas,
} from '@/lib/api';
import Link from 'next/link';
import RotaAdmin from '@/app/componentes/RotaAdmin';
import { Users, MapPin, Cloud, Bell, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { utilizador, aCarregar } = useAuth();
  const router = useRouter();

  // Redireciona se não for admin
  useEffect(() => {
    if (!aCarregar && (!utilizador || utilizador.role !== 'ADMIN')) {
      router.push('/painel');
    }
  }, [utilizador, aCarregar, router]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFazendas, setTotalFazendas] = useState(0);
  const [totalPontos, setTotalPontos] = useState(0);
  const [totalAlertas, setTotalAlertas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!aCarregar && utilizador?.role === 'ADMIN') {
      const carregar = async () => {
        try {
          const [users, fazendas, pontos, alertas] = await Promise.all([
            listarUtilizadores().then((data) => data.length),
            listarTodasFazendas().then((data) => data.length),
            listarTodosPontos().then((data) => data.length),
            listarTodosAlertas().then((data) => data.length),
          ]);
          setTotalUsers(users);
          setTotalFazendas(fazendas);
          setTotalPontos(pontos);
          setTotalAlertas(alertas);
        } catch (error) {
          console.error('Erro ao carregar dados do admin:', error);
        } finally {
          setLoading(false);
        }
      };
      carregar();
    } else if (!aCarregar) {
      setLoading(false);
    }
  }, [aCarregar, utilizador]);

  if (aCarregar || loading) {
    return (
      <RotaAdmin>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-green-600 text-xl font-light">Carregando dados globais...</div>
        </div>
      </RotaAdmin>
    );
  }

  if (!utilizador || utilizador.role !== 'ADMIN') {
    return null;
  }

  return (
    <RotaAdmin>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">📊</span> Painel do Administrador
          </h1>
          <p className="text-gray-500 text-sm mt-1">Visão geral de todo o sistema</p>
        </div>

        {/* Cards de estatísticas globais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
              <p className="text-sm text-gray-500">Utilizadores</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalFazendas}</p>
              <p className="text-sm text-gray-500">Fazendas (total)</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Cloud size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalPontos}</p>
              <p className="text-sm text-gray-500">Pontos de monitorização</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Bell size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalAlertas}</p>
              <p className="text-sm text-gray-500">Regras de alerta</p>
            </div>
          </div>
        </div>

        {/* Ações administrativas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Gestão do Sistema</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/utilizadores"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <Users size={16} /> Gerir Utilizadores
            </Link>
            <Link
              href="/admin/fazendas"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <MapPin size={16} /> Ver Todas as Fazendas
            </Link>
            <Link
              href="/admin/alertas"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <Bell size={16} /> Ver Todos os Alertas
            </Link>
          </div>
        </div>

        {/* Informação adicional */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-600" /> Atividade recente
          </h3>
          <p className="text-sm text-gray-500">
            O sistema está a monitorizar <strong>{totalPontos}</strong> pontos em <strong>{totalFazendas}</strong> fazendas,
            com <strong>{totalAlertas}</strong> regras de alerta ativas.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total de utilizadores registados: <strong>{totalUsers}</strong>.
          </p>
        </div>
      </div>
    </RotaAdmin>
  );
}