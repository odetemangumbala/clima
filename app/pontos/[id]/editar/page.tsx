'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { obterPonto, atualizarPonto, listarFazendas } from '@/lib/api';
import { Ponto, Fazenda } from '@/lib/tipos';
import RotaProtegida from '@/app/componentes/RotaProtegida';
import { Save, ArrowLeft } from 'lucide-react';

export default function EditarPonto() {
  const { id } = useParams();
  const router = useRouter();
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [form, setForm] = useState({
    nome_ponto: '',
    latitude: 0,
    longitude: 0,
    altitude: '',
    descricao: '',
    id_fazenda: '',
    status: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [pontoData, fazendasData] = await Promise.all([
          obterPonto(id as string),
          listarFazendas(1, 100)
        ]);
        setFazendas(fazendasData.fazendas);
        setForm({
          nome_ponto: pontoData.nome_ponto,
          latitude: pontoData.latitude,
          longitude: pontoData.longitude,
          altitude: pontoData.altitude?.toString() || '',
          descricao: pontoData.descricao || '',
          id_fazenda: pontoData.id_fazenda,
          status: pontoData.status,
        });
      } catch (err) {
        setError('Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id]);

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validação local
    if (!form.nome_ponto.trim()) {
      setError('O nome do ponto é obrigatório.');
      setSubmitting(false);
      return;
    }
    if (!form.id_fazenda) {
      setError('Selecione uma fazenda.');
      setSubmitting(false);
      return;
    }
    const lat = parseFloat(String(form.latitude));
    const lon = parseFloat(String(form.longitude));
    if (isNaN(lat) || isNaN(lon)) {
      setError('Latitude e longitude devem ser números válidos.');
      setSubmitting(false);
      return;
    }

    try {
      const dados = {
        nome_ponto: form.nome_ponto.trim(),
        latitude: lat,
        longitude: lon,
        altitude: form.altitude ? parseFloat(form.altitude) : undefined,
        descricao: form.descricao?.trim() || undefined,
        id_fazenda: form.id_fazenda,
        status: form.status,
      };
      await atualizarPonto(id as string, dados);
      
      // ⭐ MENSAGEM DE SUCESSO
      alert('✅ Dados actualizados com sucesso!');

      router.push('/pontos');
    } catch (err: any) {
      const data = err.response?.data;
      let mensagem = 'Erro ao actualizar ponto.';
      if (data?.error) {
        if (Array.isArray(data.error)) {
          mensagem = data.error.map((e: any) => e.message).join(', ');
        } else if (typeof data.error === 'string') {
          mensagem = data.error;
        } else {
          mensagem = JSON.stringify(data.error);
        }
      } else if (data?.message) {
        mensagem = data.message;
      }
      setError(mensagem);
      console.error('Erro detalhado:', err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <RotaProtegida>
        <div className="flex items-center justify-center h-48">
          <div className="animate-pulse text-green-600 text-lg font-light">Carregando...</div>
        </div>
      </RotaProtegida>
    );
  }

  return (
    <RotaProtegida>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          {/* Cabeçalho */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Editar Ponto</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-lg text-xs mb-3">
              {error}
            </div>
          )}

          <form onSubmit={submeter} className="space-y-3">
            {/* Nome */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Nome *</label>
              <input
                type="text"
                value={form.nome_ponto}
                onChange={(e) => setForm({ ...form, nome_ponto: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm"
                required
              />
            </div>

            {/* Fazenda */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Fazenda *</label>
              <select
                value={form.id_fazenda}
                onChange={(e) => setForm({ ...form, id_fazenda: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm bg-white"
                required
              >
                <option value="">Selecione a fazenda</option>
                {fazendas.map(f => (
                  <option key={f.id_fazenda} value={f.id_fazenda}>
                    {f.nome_fazenda}
                  </option>
                ))}
              </select>
            </div>

            {/* Coordenadas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm"
                  required
                />
              </div>
            </div>

            {/* Altitude + Descrição */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Altitude (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.altitude}
                  onChange={(e) => setForm({ ...form, altitude: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Descrição</label>
                <input
                  type="text"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm"
                  placeholder="Breve descrição"
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.checked })}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
              />
              <label className="text-xs text-gray-600">Activo</label>
            </div>

            {/* Botão guardar */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition disabled:opacity-50 text-sm font-medium"
              >
                <Save size={15} />
                {submitting ? 'A guardar...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RotaProtegida>
  );
}