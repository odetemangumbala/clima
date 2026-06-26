'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export default function GraficoTemperatura({ dados }: { dados: any[] }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">🌡️ Temperatura</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="data" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          <Legend />
          <Line type="monotone" dataKey="temp_min" stroke="#3b82f6" name="Mínima" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="temp_max" stroke="#ef4444" name="Máxima" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}