'use client';
import Link from 'next/link';
import { Fazenda } from '@/lib/tipos';

export default function CartaoFazenda({ fazenda, onEliminar }: { fazenda: Fazenda; onEliminar: (id: string) => void }) {
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-green-800">{fazenda.nome_fazenda}</h3>
            <p className="text-gray-500 text-sm mt-1">
               {fazenda.localizacao || `${fazenda.latitude}, ${fazenda.longitude}`}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${fazenda.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {fazenda.status ? 'Ativa' : 'Inativa'}
          </span>
        </div>
        {fazenda.tipo_cultura && (
          <p className="mt-2 text-sm text-gray-600">🌾 Cultura: {fazenda.tipo_cultura}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link href={`/fazendas/${fazenda.id_fazenda}`} className="text-blue-600 hover:underline">Detalhes</Link>
          <Link href={`/fazendas/${fazenda.id_fazenda}/pontos`} className="text-green-600 hover:underline">Pontos</Link>
          <Link href={`/relatorios/${fazenda.id_fazenda}`} className="text-purple-600 hover:underline">Relatório</Link>
          <button onClick={() => onEliminar(fazenda.id_fazenda)} className="text-red-600 hover:underline">Eliminar</button>
        </div>
      </div>
    </div>
  );
}