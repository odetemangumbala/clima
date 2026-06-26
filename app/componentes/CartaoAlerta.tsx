'use client';
import { RegraAlerta } from '@/lib/tipos';
import Link from 'next/link';

interface Props {
  regra: RegraAlerta;
  onEliminar: (id: string) => void;
}

export default function CartaoAlerta({ regra, onEliminar }: Props) {
  const condicoes = [
    regra.min_temp && `🌡️ Mín < ${regra.min_temp}°C`,
    regra.max_temp && `🌡️ Máx > ${regra.max_temp}°C`,
    regra.chuva_prob_min && `🌧️ Chuva > ${regra.chuva_prob_min}%`,
    regra.vento_max && `💨 Vento > ${regra.vento_max} m/s`,
  ].filter(Boolean).join(' • ');

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-yellow-800">{regra.nome}</h3>
          {regra.descricao && <p className="text-gray-600 text-sm">{regra.descricao}</p>}
          <p className="text-xs text-gray-500 mt-1">{condicoes || 'Nenhuma condição definida'}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${regra.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
          {regra.ativo ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      <div className="mt-3 flex justify-end space-x-2 text-sm">
        <Link href={`/alertas/${regra.id_config}/editar`} className="text-blue-600">Editar</Link>
        <button onClick={() => onEliminar(regra.id_config)} className="text-red-600">Eliminar</button>
      </div>
    </div>
  );
}