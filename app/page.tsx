'use client';
import Link from 'next/link';
import { useAuth } from '@/contextos/ContextoAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CloudSun, Bell, BarChart3, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { utilizador, aCarregar } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!aCarregar && utilizador) {
      router.push('/painel');
    }
  }, [utilizador, aCarregar, router]);

  if (aCarregar) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="animate-pulse text-green-700 text-2xl font-light">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-teal-800 flex flex-col relative overflow-hidden">
      {/* Formas decorativas */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-12 text-center text-white">
        <div className="max-w-4xl w-full">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full mb-6 shadow-xl border border-white/20">
            <CloudSun size={30} className="text-white" strokeWidth={1.5} />
          </div>

          <h1 className="text-5xl md:text-4xl font-extralight tracking-tight mb-3 drop-shadow-lg">
            Clima <span className="font-semibold text-green-100">Fazenda</span>
          </h1>
         

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 bg-white text-green-700 hover:bg-green-40 font-semibold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Entrar
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/registar"
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/10 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Criar Conta
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl transition hover:bg-white/10">
              <CloudSun size={36} className="text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white">Previsão 7 dias</h3>
              <p className="text-sm text-white/70 mt-1">Dados meteorológicos actualizados para cada ponto da sua fazenda.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl transition hover:bg-white/10">
              <Bell size={36} className="text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white">Alertas Personalizados</h3>
              <p className="text-sm text-white/70 mt-1">Receba notificações sobre geada, calor extremo, ventos fortes e chuva intensa.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl transition hover:bg-white/10">
              <BarChart3 size={36} className="text-green-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white">Relatórios Históricos</h3>
              <p className="text-sm text-white/70 mt-1">Gráficos interativos para acompanhar tendências de temperatura, humidade e vento.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-center text-white/50 text-sm py-6 border-t border-white/10">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Clima Fazenda – Sistema de Monitoramento Climático</p>
        </div>
      </footer>
    </div>
  );
}