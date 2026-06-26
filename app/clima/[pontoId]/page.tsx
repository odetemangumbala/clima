'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { obterClimaAtual, obterPrevisao } from '@/lib/api';
import { ClimaAtual, PrevisaoDia } from '@/lib/tipos';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import RotaProtegida from '@/app/componentes/RotaProtegida';

export default function ClimaPage() {
  const { pontoId } = useParams();
  const [atual, setAtual] = useState<ClimaAtual | null>(null);
  const [previsao, setPrevisao] = useState<PrevisaoDia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pontoId) {
      Promise.all([
        obterClimaAtual(pontoId as string),
        obterPrevisao(pontoId as string),
      ])
        .then(([clima, prev]) => {
          setAtual(clima);
          setPrevisao(prev);
        })
        .finally(() => setLoading(false));
    }
  }, [pontoId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-700"></div>
      </div>
    );
  }
  if (!atual) return <div className="text-center text-red-500">Erro ao carregar dados.</div>;

  const dadosGrafico = previsao.map((d) => ({
    dia: new Date(d.data).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric' }),
    min: d.temp_min,
    max: d.temp_max,
  }));

  return (
    <RotaProtegida>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Título */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">{atual.ponto}</h1>
            <p className="text-gray-500 text-sm">Dados atualizados a cada hora</p>
          </div>

          {/* Card clima atual - com fundo branco e sombra elegante */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {atual.icone && <img src={atual.icone} alt="icone" className="w-14 h-14" />}
                <div>
                  <div className="text-4xl font-bold text-gray-800">{atual.temperatura}°C</div>
                  <div className="text-gray-600 text-sm">{atual.condicao_climatica}</div>
                  <div className="text-xs text-gray-400">Sensação: {atual.sensacao_termica}°C</div>
                </div>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-2xl font-semibold text-blue-600">{atual.humidade}%</div>
                  <div className="text-xs text-gray-500">Humidade</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-emerald-600">
                    {typeof atual.velocidade_vento === 'number' ? atual.velocidade_vento.toFixed(1) : atual.velocidade_vento} m/s
                  </div>
                  <div className="text-xs text-gray-500">Vento</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-purple-600">{atual.pressao} hPa</div>
                  <div className="text-xs text-gray-500">Pressão</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
            <h2 className="text-md font-medium text-gray-700 mb-3">📈 Tendência de temperatura (7 dias)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#4b5563' }} />
                <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="min" stroke="#3b82f6" name="Mínima" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="max" stroke="#ef4444" name="Máxima" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Previsão detalhada - cards com fundo levemente acinzentado */}
          <h2 className="text-md font-medium text-gray-700 mb-3">📅 Previsão detalhada</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {previsao.map((dia, idx) => {
              const data = new Date(dia.data);
              const diaSemana = data.toLocaleDateString('pt-PT', { weekday: 'short' });
              const diaNum = data.getDate();
              return (
                <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center hover:shadow-md transition-shadow">
                  <p className="font-medium text-gray-700 text-sm">{diaSemana} {diaNum}</p>
                  <p className="text-xl font-bold text-gray-800">{dia.temp_max}°</p>
                  <p className="text-xs text-gray-500">{dia.temp_min}°</p>
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <div>🌧️ {dia.probabilidade_chuva}%</div>
                    <div>💨 {dia.velocidade_vento.toFixed(1)} m/s</div>
                    <div>💧 {dia.humidade}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </RotaProtegida>
  );
}