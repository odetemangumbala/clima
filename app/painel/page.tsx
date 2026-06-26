'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contextos/ContextoAuth';
import { useRouter } from 'next/navigation';
import { listarFazendas, listarPontos, listarRegrasAlertas } from '@/lib/api';
import { Fazenda, Ponto, RegraAlerta } from '@/lib/tipos';
import Link from 'next/link';
import RotaProtegida from '@/app/componentes/RotaProtegida';
import { Cloud, MapPin, Bell } from 'lucide-react';

export default function Dashboard() {
  const { utilizador, aCarregar } = useAuth();
  const router = useRouter();

  // ============================================
  // REDIRECIONA ADMIN PARA O DASHBOARD ADMIN
  // ============================================
  useEffect(() => {
    if (!aCarregar && utilizador?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    }
  }, [utilizador, aCarregar, router]);

  // ============================================
  // DASHBOARD DO AGRICULTOR (USER)
  // ============================================
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [regras, setRegras] = useState<RegraAlerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Só carrega dados se for USER (evita chamadas desnecessárias para admin)
    if (!aCarregar && utilizador?.role === 'USER') {
      const carregar = async () => {
        try {
          const [fazendasData, pontosData, regrasData] = await Promise.all([
            listarFazendas(1, 10),
            listarPontos(),
            listarRegrasAlertas(),
          ]);
          setFazendas(fazendasData.fazendas || []);
          setPontos(pontosData || []);
          setRegras(regrasData || []);
        } catch (error) {
          console.error('Erro ao carregar dados do dashboard:', error);
        } finally {
          setLoading(false);
        }
      };
      carregar();
    } else if (!aCarregar && utilizador?.role === 'ADMIN') {
      // Se for admin, não carrega dados e aguarda redirecionamento
      setLoading(false);
    }
  }, [aCarregar, utilizador]);

  // Enquanto carrega a autenticação
  if (aCarregar) {
    return (
      <RotaProtegida>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-green-600 text-xl font-light">Carregando...</div>
        </div>
      </RotaProtegida>
    );
  }

  // Se for admin, não renderiza nada (redirecionamento já ocorreu)
  if (utilizador?.role === 'ADMIN') {
    return null;
  }

  // Se não estiver autenticado (caso de segurança)
  if (!utilizador) {
    return null;
  }

  // ============================================
  // RENDERIZAÇÃO DO DASHBOARD DO AGRICULTOR
  // ============================================
  return (
    <RotaProtegida>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">🌱</span> Bem-vindo, {utilizador?.nome}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Resumo da sua propriedade e do clima</p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{fazendas.length}</p>
              <p className="text-sm text-gray-500">Fazendas</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Cloud size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pontos.length}</p>
              <p className="text-sm text-gray-500">Pontos de monitorização</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <Bell size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{regras.length}</p>
              <p className="text-sm text-gray-500">Regras de alerta</p>
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Ações rápidas</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/fazendas/criar"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              + Nova Fazenda
            </Link>
            <Link
              href="/pontos/criar"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              + Novo Ponto
            </Link>
            <Link
              href="/alertas/criar"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              + Nova Regra de Alerta
            </Link>
          </div>
        </div>

        {/* Listas resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-emerald-600" /> Últimas fazendas
            </h3>
            {fazendas.length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhuma fazenda cadastrada.</p>
            ) : (
              <ul className="space-y-2">
                {fazendas.slice(0, 5).map((f) => (
                  <li key={f.id_fazenda} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{f.nome_fazenda}</span>
                    <Link href={`/fazendas/${f.id_fazenda}`} className="text-xs text-blue-600 hover:underline">
                      Ver
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/fazendas" className="text-sm text-blue-600 hover:underline mt-3 inline-block">
              Ver todas →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Bell size={18} className="text-amber-600" /> Alertas ativos
            </h3>
            {regras.filter((r) => r.ativo).length === 0 ? (
              <p className="text-gray-400 text-sm">Nenhum alerta ativo.</p>
            ) : (
              <ul className="space-y-2">
                {regras
                  .filter((r) => r.ativo)
                  .slice(0, 5)
                  .map((r) => (
                    <li key={r.id_config} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{r.nome}</span>
                      <span className="text-xs text-green-600">Ativo</span>
                    </li>
                  ))}
              </ul>
            )}
            <Link href="/alertas" className="text-sm text-blue-600 hover:underline mt-3 inline-block">
              Gerir alertas →
            </Link>
          </div>
        </div>
      </div>
    </RotaProtegida>
  );
}