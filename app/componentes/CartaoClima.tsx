'use client';
import { ClimaAtual } from '@/lib/tipos';

interface Props {
  clima: ClimaAtual;
}

export default function CartaoClima({ clima }: Props) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 shadow flex items-center justify-between">
      <div className="flex items-center gap-4">
        {clima.icone && (
          <img src={clima.icone} alt={clima.condicao_climatica} className="w-16 h-16" />
        )}
        <div>
          <p className="text-3xl font-bold">{clima.temperatura}°C</p>
          <p className="text-gray-700">{clima.condicao_climatica}</p>
          <p className="text-sm text-gray-500">Sensação térmica: {clima.sensacao_termica}°C</p>
        </div>
      </div>
      <div className="text-right text-sm">
        <p>💧 Humidade: {clima.humidade}%</p>
        <p>💨 Vento: {clima.velocidade_vento} m/s</p>
        <p>📊 Pressão: {clima.pressao} hPa</p>
      </div>
    </div>
  );
}