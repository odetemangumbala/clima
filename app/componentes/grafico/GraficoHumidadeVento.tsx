'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { RelatorioHistorico } from '@/lib/tipos';

interface Props {
  dados: RelatorioHistorico[];
}

export default function GraficoHumidadeVento({ dados }: Props) {
  const dadosGrafico = dados.map((d) => ({
    data: new Date(d.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
    humidade: d.humidade_media,
    vento: d.vento_medio,
  }));

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-3">Humidade (%) e Vento (m/s)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dadosGrafico}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis yAxisId="left" domain={[0, 100]} label={{ value: 'Humidade (%)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 'auto']} label={{ value: 'Vento (m/s)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="humidade" stroke="#8b5cf6" name="Humidade" strokeWidth={2} />
          <Line yAxisId="right" type="monotone" dataKey="vento" stroke="#f97316" name="Vento" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}