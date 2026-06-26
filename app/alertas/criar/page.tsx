'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { criarPonto, listarFazendas } from '@/lib/api';
import { Fazenda } from '@/lib/tipos';
import RotaProtegida from '@/app/componentes/RotaProtegida';
import { Save, MapPin } from 'lucide-react';

export default function CriarPonto() {
  const router = useRouter();
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [form, setForm] = useState({
    nome_ponto: '',
    latitude: 0,
    longitude: 0,
    altitude: '',
    descricao: '',
    id_fazenda: '',
  });
  const [erro, setErro] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listarFazendas(1, 100).then(data => setFazendas(data.fazendas));
  }, []);

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErro('');

    // validação local
    if (!form.nome_ponto.trim()) {
      setErro('O nome do ponto é obrigatório.');
      setSubmitting(false);
      return;
    }
    if (!form.id_fazenda) {
      setErro('Selecione uma fazenda.');
      setSubmitting(false);
      return;
    }
    const lat = parseFloat(String(form.latitude));
    const lon = parseFloat(String(form.longitude));
    if (isNaN(lat) || isNaN(lon)) {
      setErro('Latitude e longitude devem ser números válidos.');
      setSubmitting(false);
      return;
    }

    try {
      await criarPonto({
        nome_ponto: form.nome_ponto.trim(),
        latitude: lat,
        longitude: lon,
        altitude: form.altitude ? parseFloat(form.altitude) : undefined,
        descricao: form.descricao?.trim() || undefined,
        id_fazenda: form.id_fazenda,
      });
      router.push('/pontos');
    } catch (err: any) {
      const data = err.response?.data;
      let mensagem = 'Erro ao criar ponto.';
      if (data?.error) {
        if (Array.isArray(data.error)) {
          mensagem = data.error.map((e: any) => e.message).join(', ');
        } else if (typeof data.error === 'string') {
          mensagem = data.error;
        }
      }
      setErro(mensagem);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RotaProtegida>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={20} className="text-blue-600" />
            <h1 className="text-lg font-semibold text-gray-800">Novo Ponto de Monitorização</h1>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-lg text-xs mb-3">
              {erro}
            </div>
          )}

          <form onSubmit={submeter} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Nome do ponto *</label>
              <input
                type="text"
                placeholder="Ex.: Ponto principal"
                value={form.nome_ponto}
                onChange={(e) => setForm({ ...form, nome_ponto: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm"
                required
              />
            </div>

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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ex.: -23.5505"
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
                  placeholder="Ex.: -46.6333"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Altitude (metros)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ex.: 750"
                  value={form.altitude}
                  onChange={(e) => setForm({ ...form, altitude: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Descrição</label>
                <input
                  type="text"
                  placeholder="Breve descrição"
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
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