'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { criarFazenda } from '@/lib/api';
import RotaProtegida from '@/app/componentes/RotaProtegida';
import { Save, MapPin } from 'lucide-react';

export default function CriarFazenda() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome_fazenda: '',
    localizacao: '',
    latitude: 0,
    longitude: 0,
    tamanho_area: '',
    tipo_cultura: '',
    descricao: '',
  });
  const [erro, setErro] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErro('');

    if (!form.nome_fazenda.trim()) {
      setErro('O nome da fazenda é obrigatório.');
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
      await criarFazenda({
        nome_fazenda: form.nome_fazenda.trim(),
        localizacao: form.localizacao?.trim() || undefined,
        latitude: lat,
        longitude: lon,
        tamanho_area: form.tamanho_area ? parseFloat(form.tamanho_area) : undefined,
        tipo_cultura: form.tipo_cultura?.trim() || undefined,
        descricao: form.descricao?.trim() || undefined,
      });
      router.push('/fazendas');
    } catch (err: any) {
      const data = err.response?.data;
      let mensagem = 'Erro ao criar fazenda.';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          {/* Cabeçalho */}
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
              <MapPin size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Nova Fazenda</h1>
              <p className="text-xs text-gray-400">Preencha os dados da propriedade</p>
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded-lg text-xs mb-4">
              {erro}
            </div>
          )}

          <form onSubmit={submeter} className="space-y-3">
            {/* Nome da fazenda */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Nome da fazenda *</label>
              <input
                type="text"
                placeholder="Ex.: Fazenda Sol"
                value={form.nome_fazenda}
                onChange={(e) => setForm({ ...form, nome_fazenda: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-sm"
                required
              />
            </div>

            {/* Localização */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Localização (opcional)</label>
              <input
                type="text"
                placeholder="Ex.: Zona rural, Uíge"
                value={form.localizacao}
                onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-sm"
              />
            </div>

            {/* Latitude + Longitude */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="-23.5505"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="-46.6333"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-sm"
                  required
                />
              </div>
            </div>

            {/* Área + Cultura */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Área (hectares)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.tamanho_area}
                  onChange={(e) => setForm({ ...form, tamanho_area: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">Tipo de cultura</label>
                <input
                  type="text"
                  placeholder="Ex.: Milho"
                  value={form.tipo_cultura}
                  onChange={(e) => setForm({ ...form, tipo_cultura: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-sm"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-0.5">Descrição</label>
              <textarea
                placeholder="Informações adicionais sobre a fazenda"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                rows={2}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-sm resize-none"
              />
            </div>

            {/* Botão guardar */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-1.5 rounded-lg transition disabled:opacity-50 text-sm font-medium"
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