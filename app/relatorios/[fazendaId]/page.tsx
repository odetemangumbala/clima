'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { obterRelatorioHistorico } from '@/lib/api';
import { RelatorioHistorico } from '@/lib/tipos';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import RotaProtegida from '@/app/componentes/RotaProtegida';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Relatorio() {
  const { fazendaId } = useParams();
  const [dados, setDados] = useState<RelatorioHistorico[]>([]);
  const [dias, setDias] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fazendaId) {
      obterRelatorioHistorico(fazendaId as string, dias)
        .then(setDados)
        .finally(() => setLoading(false));
    }
  }, [fazendaId, dias]);

  if (loading) {
    return (
      <RotaProtegida>
        <div className="flex items-center justify-center h-48">
          <div className="animate-pulse text-emerald-600 text-lg font-light">Carregando dados...</div>
        </div>
      </RotaProtegida>
    );
  }

  const dadosGrafico = dados.map((d) => ({
    data: new Date(d.date).toLocaleDateString('pt', { day: '2-digit', month: 'short' }),
    temp_min: d.temp_min,
    temp_max: d.temp_max,
    temp_media: d.temp_media,
    humidade: d.humidade_media,
    vento: d.vento_medio,
  }));

  return (
    <RotaProtegida>
      <div className="min-h-screen bg-gray-50 py-4 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Link href={`/fazendas/${fazendaId}`} className="p-1.5 hover:bg-gray-200 rounded-lg transition">
                <ArrowLeft size={18} className="text-gray-600" />
              </Link>
              <h1 className="text-lg font-semibold text-gray-800">Relatório Histórico</h1>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-gray-400" />
              <select
                value={dias}
                onChange={(e) => setDias(Number(e.target.value))}
                className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-400"
              >
                <option value={7}>7 dias</option>
                <option value={30}>30 dias</option>
                <option value={90}>90 dias</option>
              </select>
            </div>
          </div>

          {dados.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-500">Sem dados para o período selecionado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Gráfico 1 – Temperatura */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h2 className="text-sm font-medium text-gray-700 mb-3">🌡️ Temperatura</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="data" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line type="monotone" dataKey="temp_min" stroke="#3b82f6" name="Mínima" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="temp_max" stroke="#ef4444" name="Máxima" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="temp_media" stroke="#10b981" name="Média" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico 2 – Humidade e Vento */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h2 className="text-sm font-medium text-gray-700 mb-3">💧 Humidade e Vento</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={dadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="data" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="humidade" stroke="#8b5cf6" name="Humidade (%)" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="vento" stroke="#f97316" name="Vento (m/s)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </RotaProtegida>
  );
}