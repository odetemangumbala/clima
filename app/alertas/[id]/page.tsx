'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { listarFazendas, listarPontos, obterRegraAlerta, atualizarRegraAlerta } from '@/lib/api';
import { RegraAlerta, Fazenda, Ponto } from '@/lib/tipos';
import RotaProtegida from '@/app/componentes/RotaProtegida';

// NOTA: Adicione obterRegraAlerta à lib/api.ts (ver abaixo)
// export async function obterRegraAlerta(id: string) {
//   const { data } = await api.get(`/alertas/regras/${id}`);
//   return data;
// }

export default function EditarAlerta() {
  const { id } = useParams();
  const router = useRouter();
  const [regra, setRegra] = useState<RegraAlerta | null>(null);
  const [fazendas, setFazendas] = useState<Fazenda[]>([]);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    min_temp: '',
    max_temp: '',
    chuva_prob_min: '',
    vento_max: '',
    id_fazenda: '',
    id_ponto: '',
    ativo: true,
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([
      obterRegraAlerta(id as string),
      listarFazendas(1, 100),
      listarPontos(),
    ]).then(([reg, fazendasData, pontosData]) => {
      setRegra(reg);
      setFazendas(fazendasData.fazendas);
      setPontos(pontosData);
      setForm({
        nome: reg.nome,
        descricao: reg.descricao || '',
        min_temp: reg.min_temp?.toString() || '',
        max_temp: reg.max_temp?.toString() || '',
        chuva_prob_min: reg.chuva_prob_min?.toString() || '',
        vento_max: reg.vento_max?.toString() || '',
        id_fazenda: reg.id_fazenda || '',
        id_ponto: reg.id_ponto || '',
        ativo: reg.ativo,
      });
      setCarregando(false);
    });
  }, [id]);

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await atualizarRegraAlerta(id as string, {
        nome: form.nome,
        descricao: form.descricao,
        min_temp: form.min_temp ? parseFloat(form.min_temp) : undefined,
        max_temp: form.max_temp ? parseFloat(form.max_temp) : undefined,
        chuva_prob_min: form.chuva_prob_min ? parseInt(form.chuva_prob_min) : undefined,
        vento_max: form.vento_max ? parseFloat(form.vento_max) : undefined,
        id_fazenda: form.id_fazenda || undefined,
        id_ponto: form.id_ponto || undefined,
        ativo: form.ativo,
      });
      router.push('/alertas');
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao actualizar regra');
    }
  };

  if (carregando) return <p>A carregar...</p>;

  return (
    <RotaProtegida>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Editar Regra de Alerta</h1>
        {erro && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{erro}</div>}
        <form onSubmit={submeter} className="space-y-4">
          <input
            type="text"
            placeholder="Nome da regra *"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            className="w-full border p-2 rounded"
            rows={2}
          />
          <div>
            <label className="block mb-1">Aplicar a:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" checked={!!form.id_fazenda && !form.id_ponto} onChange={() => setForm({ ...form, id_fazenda: regra?.id_fazenda || '', id_ponto: '' })} />
                Fazenda
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={!!form.id_ponto} onChange={() => setForm({ ...form, id_ponto: regra?.id_ponto || '', id_fazenda: '' })} />
                Ponto
              </label>
            </div>
          </div>
          {form.id_fazenda !== undefined && !form.id_ponto ? (
            <select
              value={form.id_fazenda}
              onChange={(e) => setForm({ ...form, id_fazenda: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="">Selecione a fazenda</option>
              {fazendas.map(f => <option key={f.id_fazenda} value={f.id_fazenda}>{f.nome_fazenda}</option>)}
            </select>
          ) : (
            <select
              value={form.id_ponto}
              onChange={(e) => setForm({ ...form, id_ponto: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="">Selecione o ponto</option>
              {pontos.map(p => <option key={p.id_ponto} value={p.id_ponto}>{p.nome_ponto}</option>)}
            </select>
          )}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="0.1"
              placeholder="Temperatura mínima (°C)"
              value={form.min_temp}
              onChange={(e) => setForm({ ...form, min_temp: e.target.value })}
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Temperatura máxima (°C)"
              value={form.max_temp}
              onChange={(e) => setForm({ ...form, max_temp: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>
          <input
            type="number"
            step="1"
            placeholder="Probabilidade mínima de chuva (%)"
            value={form.chuva_prob_min}
            onChange={(e) => setForm({ ...form, chuva_prob_min: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            step="0.1"
            placeholder="Velocidade máxima do vento (m/s)"
            value={form.vento_max}
            onChange={(e) => setForm({ ...form, vento_max: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} />
              Activo
            </label>
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Actualizar</button>
        </form>
      </div>
    </RotaProtegida>
  );
}