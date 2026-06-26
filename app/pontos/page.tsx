'use client';
import { useEffect, useState } from 'react';
import { listarPontos, eliminarPonto } from '@/lib/api';
import { Ponto } from '@/lib/tipos';
import Link from 'next/link';
import RotaProtegida from '@/app/componentes/RotaProtegida';
import { MapPin, Eye, Edit, Trash2, Cloud, CheckCircle, XCircle } from 'lucide-react';

export default function ListaPontos() {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const data = await listarPontos();
      setPontos(data);
    } catch (error) {
      console.error('Erro ao carregar pontos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function eliminar(id: string) {
    if (!confirm('Tem a certeza que pretende eliminar este ponto?')) return;
    try {
      await eliminarPonto(id);
      carregar();
    } catch (error) {
      alert('Erro ao eliminar ponto.');
    }
  }

  if (loading) {
    return (
      <RotaProtegida>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-green-600 text-xl font-light">Carregando...</div>
        </div>
      </RotaProtegida>
    );
  }

  return (
    <RotaProtegida>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MapPin size={28} className="text-blue-600" />
            Pontos de Monitorização
          </h1>
          <Link
            href="/pontos/criar"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition shadow-sm"
          >
            + Novo Ponto
          </Link>
        </div>

        {pontos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <MapPin size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum ponto cadastrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pontos.map((p) => (
              <div
                key={p.id_ponto}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-800">{p.nome_ponto}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                      p.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {p.status ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {p.status ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">Fazenda:</span> {p.fazenda?.nome_fazenda || 'N/A'}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">Coordenadas:</span> {p.latitude}, {p.longitude}
                  </p>
                  {p.altitude && (
                    <p className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">Altitude:</span> {p.altitude} m
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                  <Link
                    href={`/clima/${p.id_ponto}`}
                    className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Cloud size={14} /> Ver clima
                  </Link>
                  
                  <Link
                    href={`/pontos/${p.id_ponto}/editar`}
                    className="inline-flex items-center gap-1 text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-lg hover:bg-yellow-100 transition"
                  >
                    <Edit size={14} /> Editar
                  </Link>
                  <button
                    onClick={() => eliminar(p.id_ponto)}
                    className="inline-flex items-center gap-1 text-sm bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RotaProtegida>
  );
}