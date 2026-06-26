'use client';
import Link from 'next/link';
import { Ponto } from '@/lib/tipos';

export default function CartaoPonto({ ponto, onEliminar }: { ponto: Ponto; onEliminar: (id: string) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-5 border border-gray-100">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold text-blue-800">{ponto.nome_ponto}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${ponto.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {ponto.status ? 'Ativo' : 'Inativo'}
        </span>
      </div>
      <p className="text-sm text-gray-500">{ponto.fazenda?.nome_fazenda || 'Sem fazenda'}</p>
      <p className="text-xs text-gray-400 mt-1">📍 {ponto.latitude}, {ponto.longitude}</p>
      <div className="mt-3 flex gap-3 text-sm">
        <Link href={`/clima/${ponto.id_ponto}`} className="text-blue-600 hover:underline">Ver clima</Link>
        <Link href={`/pontos/${ponto.id_ponto}`} className="text-green-600 hover:underline">Editar</Link>
        <button onClick={() => onEliminar(ponto.id_ponto)} className="text-red-600 hover:underline">Eliminar</button>
      </div>
    </div>
  );
}