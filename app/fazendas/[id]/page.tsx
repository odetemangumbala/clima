'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { obterFazenda } from '@/lib/api';
import { Fazenda } from '@/lib/tipos';
import Link from 'next/link';
import RotaProtegida from '@/app/componentes/RotaProtegida';
import { MapPin, Home, Ruler, Sprout, CheckCircle, XCircle, ArrowLeft, Edit, FileText } from 'lucide-react';

export default function DetalheFazenda() {
  const { id } = useParams();
  const router = useRouter();
  const [fazenda, setFazenda] = useState<Fazenda | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obterFazenda(id as string)
      .then(setFazenda)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <RotaProtegida>
        <div className="flex items-center justify-center h-48">
          <div className="animate-pulse text-emerald-600 text-lg font-light">Carregando...</div>
        </div>
      </RotaProtegida>
    );
  }

  if (!fazenda) {
    return (
      <RotaProtegida>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-red-500">Fazenda não encontrada.</p>
          <Link href="/fazendas" className="text-emerald-600 hover:underline">← Voltar</Link>
        </div>
      </RotaProtegida>
    );
  }

  return (
    <RotaProtegida>
      <div className="min-h-screen bg-gray-50 py-4 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Cabeçalho com voltar */}
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-200 rounded-lg transition">
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">{fazenda.nome_fazenda}</h1>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ml-2 ${
                fazenda.status ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {fazenda.status ? 'Activa' : 'Inactiva'}
            </span>
          </div>

          {/* Card de informações */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
            {/* Localização */}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin size={16} className="text-emerald-500" />
              <span className="font-medium">Localização:</span>
              <span>{fazenda.localizacao || `${fazenda.latitude}, ${fazenda.longitude}`}</span>
            </div>

            {/* Cultura */}
            {fazenda.tipo_cultura && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Sprout size={16} className="text-emerald-500" />
                <span className="font-medium">Cultura:</span>
                <span>{fazenda.tipo_cultura}</span>
              </div>
            )}

            {/* Área */}
            {fazenda.tamanho_area && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Ruler size={16} className="text-emerald-500" />
                <span className="font-medium">Área:</span>
                <span>{fazenda.tamanho_area} ha</span>
              </div>
            )}

            {/* Descrição */}
            {fazenda.descricao && (
              <div className="text-sm text-gray-600 border-t border-gray-100 pt-2 mt-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Descrição</p>
                <p>{fazenda.descricao}</p>
              </div>
            )}

            {/* Coordenadas (se não houver localização) */}
            {!fazenda.localizacao && !fazenda.tipo_cultura && !fazenda.tamanho_area && (
              <div className="text-sm text-gray-500">
                <p>📍 {fazenda.latitude}, {fazenda.longitude}</p>
              </div>
            )}
          </div>

      
          
        </div>
      </div>
    </RotaProtegida>
  );
}