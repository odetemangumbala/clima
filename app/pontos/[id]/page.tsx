'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { obterPonto } from '@/lib/api';
import { Ponto } from '@/lib/tipos';
import Link from 'next/link';
import RotaProtegida from '@/app/componentes/RotaProtegida';

export default function DetalhePonto() {
  const { id } = useParams();
  const [ponto, setPonto] = useState<Ponto | null>(null);

  useEffect(() => {
    obterPonto(id as string).then(setPonto);
  }, [id]);

  if (!ponto) return <p>A carregar...</p>;

  return (
    <RotaProtegida>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">{ponto.nome_ponto}</h1>
        <p><strong>Fazenda:</strong> {ponto.fazenda?.nome_fazenda || 'N/A'}</p>
        <p><strong>Coordenadas:</strong> {ponto.latitude}, {ponto.longitude}</p>
        {ponto.altitude && <p><strong>Altitude:</strong> {ponto.altitude} m</p>}
        <p><strong>Descrição:</strong> {ponto.descricao || '—'}</p>
        <p><strong>Status:</strong> {ponto.status ? 'Activo' : 'Inactivo'}</p>
        <div className="mt-6 space-x-3">
          <Link href={`/clima/${ponto.id_ponto}`} className="bg-blue-600 text-white px-3 py-1 rounded">Ver clima</Link>
          <Link href={`/pontos/${ponto.id_ponto}/editar`} className="bg-yellow-600 text-white px-3 py-1 rounded">Editar</Link>
        </div>
      </div>
    </RotaProtegida>
  );
}