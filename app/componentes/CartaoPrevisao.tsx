'use client';
import { PrevisaoDia } from '@/lib/tipos';

interface Props {
  previsao: PrevisaoDia;
}

export default function CartaoPrevisao({ previsao }: Props) {
  const dataFormatada = new Date(previsao.data).toLocaleDateString('pt-PT', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  return (
    <div className="border rounded-lg p-3 text-center bg-white shadow-sm">
      <p className="font-semibold text-gray-700">{dataFormatada}</p>
      <p className="text-2xl font-bold mt-1">{previsao.temp_max}°</p>
      <p className="text-sm text-gray-500">{previsao.temp_min}°</p>
      <p className="text-xs mt-2">🌧️ {previsao.probabilidade_chuva}%</p>
      <p className="text-xs">💨 {previsao.velocidade_vento} m/s</p>
      <p className="text-xs">💧 {previsao.humidade}%</p>
    </div>
  );
}