'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, CloudSun, LogOut, ShieldCheck, MapPin } from 'lucide-react';

export default function DashboardCentral() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (!usuarioSalvo) {
      router.push('/login');
    } else {
      // Nota: Em um sistema de produção, faríamos um fetch rápido ao /auth/me 
      // para validar o tipo_usuario diretamente do banco através do token.
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/login');
  };

  if (!usuario) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">A carregar painel seguro...</div>;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* BARRA LATERAL COMUNICAÇÃO GLOBAL */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <CloudSun className="text-green-500" size={28} />
            <span className="font-bold text-lg tracking-wider">AGRO-CLIMA</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl mb-6">
            <p className="text-xs text-slate-400">Utilizador Logado</p>
            <p className="font-bold text-sm text-green-400 truncate">{usuario.nome}</p>
            <span className="inline-block mt-1 text-[10px] font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
              {usuario.email === 'admin@agro.com' ? 'ADMINISTRADOR' : 'AGRICULTOR'}
            </span>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold text-sm transition-colors">
          <LogOut size={18} /> Terminar Sessão
        </button>
      </aside>

      {/* RENDERIZAÇÃO CONDICIONAL DA TELA CONFORME O PERFIL */}
      <main className="flex-1 p-8">
        {usuario.email === 'admin@agro.com' ? (
          <TelaPainelAdmin />
        ) : (
          <TelaPainelAgricultor nomeUser={usuario.nome} />
        )}
      </main>
    </div>
  );
}

// ==========================================
// 🛡️ SUB-TELA 1: VISÃO DE ADMINISTRADOR
// ==========================================
function TelaPainelAdmin() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="text-indigo-600" size={32} />
        <h1 className="text-3xl font-black text-slate-800">Painel de Administração Global</h1>
      </div>
      <p className="text-slate-600 mb-8">Gestão e auditoria de todas as propriedades agrícolas cadastradas no território estatal.</p>

      {/* Métricas de Controle de Infraestrutura */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total de Usuários</h3>
          <p className="text-4xl font-black text-slate-900 mt-2">142</p>
          <span className="text-green-600 text-xs font-bold">▲ 12% este mês</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Fazendas Monitoradas</h3>
          <p className="text-4xl font-black text-slate-900 mt-2">412</p>
          <span className="text-slate-500 text-xs">Mapeamento via OpenStreetMap</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Alertas Emitidos Hoje</h3>
          <p className="text-4xl font-black text-red-600 mt-2">3</p>
          <span className="text-red-500 text-xs font-bold">Risco de Geada Ativo</span>
        </div>
      </div>

      {/* Tabela de Monitoramento Governamental/Administrativo */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Auditoria Recente de Propriedades</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase">
                <th className="pb-3">Produtor</th>
                <th className="pb-3">Propriedade</th>
                <th className="pb-3">Localização</th>
                <th className="pb-3">Status da API</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-semibold">Carlos Manuel</td>
                <td className="py-3">Fazenda Chiloango</td>
                <td className="py-3 font-mono text-xs">Lat: -12.34 / Lon: 13.56</td>
                <td className="py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Ativo</span></td>
              </tr>
              <tr>
                <td className="py-3 font-semibold">Ana Paula Silva</td>
                <td className="py-3">Roça Vale Verde</td>
                <td className="py-3 font-mono text-xs">Lat: -8.92 / Lon: 13.23</td>
                <td className="py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Ativo</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 🚜 SUB-TELA 2: VISÃO DO AGRICULTOR
// ==========================================
function TelaPainelAgricultor({ nomeUser }: { nomeUser: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <LayoutDashboard className="text-green-600" size={32} />
        <h1 className="text-3xl font-black text-slate-800">Olá, {nomeUser} 👋</h1>
      </div>
      <p className="text-slate-600 mb-8">Acompanhe as condições meteorológicas em tempo real das suas fazendas cadastradas.</p>

      {/* Ações Rápidas do Produtor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl">Gerenciar Meus Locais</h3>
            <p className="text-green-100 text-sm mt-1">Cadastre novas coordenadas para receber alertas customizados.</p>
          </div>
          <button className="bg-white text-green-700 px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-slate-100 transition-colors">
            Acessar
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="bg-orange-100 text-orange-800 border border-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">Recomendação do dia</span>
            <p className="text-slate-700 text-sm font-semibold mt-2">Condições ideais de humidade para irrigação mecânica entre as 14h e as 18h de hoje.</p>
          </div>
        </div>
      </div>

      {/* Atalho para Minhas Fazendas */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">Minhas Propriedades</h2>
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex gap-3 items-center">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><MapPin size={24} /></div>
          <div>
            <h3 className="font-bold text-slate-800">Fazenda Principal (Milho)</h3>
            <p className="text-xs text-slate-500">Lat: -8.8340 | Lon: 13.2300</p>
          </div>
        </div>
        <button className="text-green-600 hover:text-green-700 font-bold text-sm uppercase tracking-wider">Ver Clima Atual</button>
      </div>
    </div>
  );
}