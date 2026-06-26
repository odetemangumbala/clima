'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { listarPontos, obterFazenda } from '@/lib/api';
import { Ponto, Fazenda } from '@/lib/tipos';
import Link from 'next/link';
import RotaProtegida from '@/app/componentes/RotaProtegida';
import { MapPin, Cloud, ArrowLeft, Plus } from 'lucide-react';

export default function PontosDaFazenda() {
  const { id } = useParams();
  const router = useRouter();
  const [fazenda, setFazenda] = useState<Fazenda | null>(null);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [fazendaData, pontosData] = await Promise.all([
          obterFazenda(id as string),
          listarPontos(),
        ]);
        setFazenda(fazendaData);
        // 🔧 Tipagem explícita para o parâmetro 'p'
        setPontos(pontosData.filter((p: Ponto) => p.id_fazenda === id));
      } catch (error) {
        console.error('Erro ao carregar:', error);
      } finally {
        setLoading(false);
      }
    };
    carregar();
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
      <div className="min-h-screen bg-gray-40 py-4 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => router.back()} className="p-1.5 hover:bg-gray-200 rounded-lg transition">
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Pontos de {fazenda.nome_fazenda}</h1>
              <p className="text-xs text-gray-400">{pontos.length} ponto(s) de monitorização</p>
            </div>
          </div>

          {pontos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
              <p className="text-sm text-gray-500">Nenhum ponto associado a esta fazenda.</p>
              <Link href="/pontos/criar" className="text-sm text-emerald-600 hover:underline inline-block mt-1">
                Criar primeiro ponto →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pontos.map((p) => (
                <div key={p.id_ponto} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-gray-800">{p.nome_ponto}</h3>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        p.status ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5"> {p.latitude}, {p.longitude}</p>
                  {p.altitude && <p className="text-xs text-gray-400">Altitude: {p.altitude} m</p>}
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/clima/${p.id_ponto}`}
                      className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
                    >
                      <Cloud size={14} /> Ver clima
                    </Link>
                    <Link
                      href={`/pontos/${p.id_ponto}`}
                      className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
                    >
                      Detalhes
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RotaProtegida>
  );
}