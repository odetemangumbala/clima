'use client';
import { useEffect, useState } from 'react';
import {
  listarRegrasAlertas,
  eliminarRegraAlerta,
  verificarAlertas,
  listarAlertasDisparados,
} from '@/lib/api';
import { RegraAlerta } from '@/lib/tipos';
import RotaProtegida from '@/app/componentes/RotaProtegida';
import { Bell, RefreshCw, Trash2, AlertCircle, CheckCircle2, Thermometer, CloudRain, Wind } from 'lucide-react';
import Link from 'next/link';

interface AlertaDisparado {
  id_alerta: string;
  mensagem: string;
  nivel_risco: string;
  data_emissao: string;
  status: string;
  tipo_alerta: string;
}

export default function ListaAlertas() {
  const [regras, setRegras] = useState<RegraAlerta[]>([]);
  const [alertasDisparados, setAlertasDisparados] = useState<AlertaDisparado[]>([]);
  const [loading, setLoading] = useState(true);
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    setLoading(true);
    try {
      const [regrasData, alertasData] = await Promise.all([
        listarRegrasAlertas(),
        listarAlertasDisparados(),
      ]);
      setRegras(regrasData);
      setAlertasDisparados(alertasData.slice(0, 4));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function eliminarRegra(id: string) {
    if (!confirm('Tem a certeza que pretende eliminar esta regra?')) return;
    try {
      await eliminarRegraAlerta(id);
      carregarTudo();
    } catch (error) {
      alert('Erro ao eliminar regra.');
    }
  }

  async function verificar() {
    setVerificando(true);
    try {
      await verificarAlertas();
      await carregarTudo();
    } catch (error) {
      alert('Erro ao verificar alertas.');
    } finally {
      setVerificando(false);
    }
  }

  if (loading) {
    return (
      <RotaProtegida>
        <div className="flex items-center justify-center h-48">
          <div className="animate-pulse text-emerald-600 text-lg font-light">A carregar...</div>
        </div>
      </RotaProtegida>
    );
  }

  const alertasAtivos = alertasDisparados.filter((a) => a.status === 'ATIVO').length;

  return (
    <RotaProtegida>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 rounded-xl shadow-sm">
                <Bell size={22} className="text-emerald-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
                  Alertas
                </h1>
                <p className="text-sm text-slate-500">
                  {regras.length} regras
                  {alertasAtivos > 0 && (
                    <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      {alertasAtivos} novo{alertasAtivos > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
             

              <button
                onClick={verificar}
                disabled={verificando}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm disabled:opacity-50"
              >
                <RefreshCw size={16} className={verificando ? 'animate-spin' : ''} />
                {verificando ? 'A verificar...' : 'Verificar'}
              </button>
            </div>
          </div>

          {/* Alertas recentes (cards horizontais com borda colorida) */}
          {alertasDisparados.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Últimos alertas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {alertasDisparados.slice(0, 4).map((a) => {
                  const riscoCor =
                    a.nivel_risco === 'CRITICO'
                      ? 'border-red-500 bg-red-50/50'
                      : a.nivel_risco === 'ALTO'
                      ? 'border-orange-400 bg-orange-50/50'
                      : a.nivel_risco === 'MEDIO'
                      ? 'border-yellow-400 bg-yellow-50/50'
                      : 'border-blue-400 bg-blue-50/50';
                  return (
                    <div
                      key={a.id_alerta}
                      className={`flex items-start gap-3 p-3 rounded-xl border-l-4 shadow-sm ${riscoCor} bg-white/80 backdrop-blur-sm transition hover:shadow-md`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 font-medium leading-snug">
                          {a.mensagem}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {new Date(a.data_emissao).toLocaleString('pt', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
                          a.status === 'ATIVO'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {a.status === 'ATIVO' ? 'Ativo' : 'Lido'}
                      </span>
                    </div>
                  );
                })}
              </div>
              {alertasDisparados.length > 4 && (
                <Link
                  href="/alertas/disparados"
                  className="inline-block mt-3 text-sm text-emerald-600 hover:text-emerald-800 font-medium transition"
                >
                  Ver todos →
                </Link>
              )}
            </section>
          )}

          {/* Regras de alerta – GRID com ícones */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Regras ativas
              </h2>
              <Link
                href="/alertas/criar"
                className="text-sm text-emerald-500 hover:text-emerald-800 font-medium transition"
              >
                + Criar regra
              </Link>
            </div>

            {regras.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 p-10 text-center shadow-sm">
                <Bell size={40} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">Nenhuma regra de alerta</p>
                <p className="text-sm text-slate-400 mt-1">Cria a primeira regra para monitorizar o clima</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                {regras.map((r) => {
                  const condicoes = [];
                  if (r.min_temp !== undefined && r.min_temp !== null)
                    condicoes.push({ label: `< ${r.min_temp}°C`, icon: Thermometer, color: 'text-blue-500' });
                  if (r.max_temp !== undefined && r.max_temp !== null)
                    condicoes.push({ label: `> ${r.max_temp}°C`, icon: Thermometer, color: 'text-red-500' });
                  if (r.chuva_prob_min !== undefined && r.chuva_prob_min !== null)
                    condicoes.push({ label: `Chuva > ${r.chuva_prob_min}%`, icon: CloudRain, color: 'text-indigo-500' });
                  if (r.vento_max !== undefined && r.vento_max !== null)
                    condicoes.push({ label: `Vento > ${r.vento_max} m/s`, icon: Wind, color: 'text-teal-500' });

                  return (
                    <div
                      key={r.id_config}
                      className="group flex flex-col justify-between p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm font-medium text-slate-800 truncate">
                              {r.nome}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                r.ativo
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {r.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                          <button
                            onClick={() => eliminarRegra(r.id_config)}
                            className="text-slate-300 hover:text-red-500 transition p-1"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {r.descricao && (
                          <p className="text-xs text-slate-400 mt-1 truncate">{r.descricao}</p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                          {condicoes.length > 0 ? (
                            condicoes.map((c, i) => (
                              <span
                                key={i}
                                className={`inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 ${c.color}`}
                              >
                                <c.icon size={12} />
                                {c.label}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">Sem condições</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </RotaProtegida>
  );
}