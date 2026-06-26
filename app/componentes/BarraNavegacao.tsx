'use client';
import Link from 'next/link';
import { useAuth } from '@/contextos/ContextoAuth';

export default function BarraNavegacao() {
  const { utilizador, logout } = useAuth();

  if (!utilizador) return null;

  const isAdmin = utilizador.role === 'ADMIN';

  const linksFazendas = isAdmin ? '/admin/fazendas' : '/fazendas';
  const linksPontos = isAdmin ? '/admin/pontos' : '/pontos';
  const linkDashboard = isAdmin ? '/admin/dashboard' : '/painel';

  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-2">
        {/* Logótipo */}
        <Link
          href={linkDashboard}
          className="text-xl font-bold tracking-tight hover:opacity-80 transition"
        >
           Clima Fazenda
        </Link>

        {/* Menu principal */}
        <div className="flex items-center gap-4 text-sm">
          {/* Dashboard */}
          <Link
            href={linkDashboard}
            className="relative group py-1 transition"
          >
            <span> Dashboard</span>
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Fazendas */}
          <Link
            href={linksFazendas}
            className="relative group py-1 transition"
          >
            <span>Fazendas</span>
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Pontos */}
          <Link
            href={linksPontos}
            className="relative group py-1 transition"
          >
            <span>Pontos</span>
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Alertas – link direto (sem dropdown) */}
          <Link
            href="/alertas"
            className="relative group py-1 transition"
          >
            <span>Alertas</span>
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Apenas ADMIN vê Utilizadores */}
          {isAdmin && (
            <Link
              href="/admin/utilizadores"
              className="relative group py-1 transition"
            >
              <span>Utilizadores</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-emerald-300 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}

          {/* Utilizador + Badge */}
          <div className="flex items-center gap-2 ml-2 border-l border-white/20 pl-3">
            <span className="text-sm font-medium">
              Olá, {utilizador.nome}
              {isAdmin && (
                <span className="ml-2 bg-yellow-400 text-emerald-900 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm transition shadow-sm hover:shadow"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}