'use client';
import { useEffect, useState } from 'react';
import { listarFazendas, eliminarFazenda } from '@/lib/api';
import { Fazenda } from '@/lib/tipos';
import Link from 'next/link';
import RotaProtegida from '@/app/componentes/RotaProtegida';
import { MapPin, Eye, Activity, FileText, Trash2, Plus } from 'lucide-react';

export default function ListaFazendas() {
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const data = await listarFazendas();
      setFazendas(data.fazendas || []);
    } catch (error) {
      console.error('Erro ao carregar fazendas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function eliminar(id: string) {
    if (!confirm('Tem a certeza que pretende eliminar esta fazenda?')) return;
    try {
      await eliminarFazenda(id);
      carregar();
    } catch (error) {
      alert('Erro ao eliminar fazenda.');
    }
  }

  if (loading) {
    return (
      <RotaProtegida>
        <div className="flex items-center justify-center h-48">
          <div className="animate-pulse text-emerald-600 text-lg font-light">Carregando...</div>
        </div>
      </RotaProtegida>
    );
  }

  return (
    <RotaProtegida>
      <div className="min-h-screen bg-gray-40 py-4 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-emerald-600" />
              <h1 className="text-lg font-semibold text-gray-800">Minhas Fazendas</h1>
              <span className="text-xs text-gray-400 font-normal">{fazendas.length}</span>
            </div>
            <Link
              href="/fazendas/criar"
              className="inline-flex items-center gap-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition shadow-sm"
            >
              <Plus size={14} /> Nova
            </Link>
          </div>

          {/* Cards estilo pontos */}
          {fazendas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <p className="text-sm text-gray-500">Nenhuma fazenda cadastrada.</p>
              <Link href="/fazendas/criar" className="text-sm text-emerald-600 hover:underline inline-block mt-1">
                Criar primeira fazenda →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {fazendas.map((f) => (
                <div
                  key={f.id_fazenda}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                >
                  {/* Título */}
                  <h3 className="text-base font-semibold text-gray-800">{f.nome_fazenda}</h3>

                  {/* Informações */}
                  <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                    {f.localizacao && <p> {f.localizacao}</p>}
                    {f.tipo_cultura && <p>Cultura: {f.tipo_cultura}</p>}
                    {f.tamanho_area && <p> Área: {f.tamanho_area} ha</p>}
                    {!f.localizacao && !f.tipo_cultura && !f.tamanho_area && (
                      <p className="text-xs text-gray-400">{f.latitude}, {f.longitude}</p>
                    )}
                  </div>

                  {/* Botões de ação */}
                  <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    <Link
                      href={`/fazendas/${f.id_fazenda}`}
                      className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
                    >
                      <Eye size={14} /> Ver detalhes
                    </Link>
                    <Link
                      href={`/fazendas/${f.id_fazenda}/pontos`}
                      className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 px-3 py-1 rounded-lg hover:bg-green-100 transition"
                    >
                      <Activity size={14} /> Ver pontos
                    </Link>
                    <Link
                      href={`/relatorios/${f.id_fazenda}`}
                      className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-lg hover:bg-purple-100 transition"
                    >
                      <FileText size={14} /> Relatório
                    </Link>
                    <button
                      onClick={() => eliminar(f.id_fazenda)}
                      className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition ml-auto"
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
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