'use client';
import { useEffect, useState } from 'react';
import { listarAlertasDisparados, marcarAlertaComoLido } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import RotaProtegida from '@/app/componentes/RotaProtegida';
import { format } from 'date-fns';

interface AlertaDisparado {
  id_alerta: string;
  tipo_alerta: string;
  mensagem: string;
  nivel_risco: string;
  status: string;
  data_emissao: string;
  data_leitura: string | null;
  fazenda: { nome_fazenda: string };
  ponto: { nome_ponto: string } | null;
  regra: { nome: string } | null;
}

export default function AlertasDisparados() {
  const { utilizador } = useAuth();
  const [alertas, setAlertas] = useState<AlertaDisparado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'ativos', 'lidos'
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const data = await listarAlertasDisparados();
      setAlertas(data);
    } catch (error) {
      setErro('Erro ao carregar alertas.');
    } finally {
      setCarregando(false);
    }
  }

  async function marcarLido(id: string) {
    try {
      await marcarAlertaComoLido(id);
      carregar(); // recarregar
    } catch (error) {
      alert('Erro ao marcar alerta como lido.');
    }
  }

  const alertasFiltrados = alertas.filter(a => {
    if (filtro === 'ativos') return a.status === 'ATIVO';
    if (filtro === 'lidos') return a.status === 'LIDO';
    return true;
  });

  return (
    <RotaProtegida>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Alertas Gerados</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('todos')}
              className={`px-3 py-1 rounded ${filtro === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltro('ativos')}
              className={`px-3 py-1 rounded ${filtro === 'ativos' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            >
              Ativos
            </button>
            <button
              onClick={() => setFiltro('lidos')}
              className={`px-3 py-1 rounded ${filtro === 'lidos' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              Lidos
            </button>
          </div>
        </div>

        {erro && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{erro}</div>}

        {carregando ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : alertasFiltrados.length === 0 ? (
          <p className="text-gray-500">Nenhum alerta encontrado com o filtro selecionado.</p>
        ) : (
          <div className="space-y-4">
            {alertasFiltrados.map((alerta) => (
              <div
                key={alerta.id_alerta}
                className={`border-l-4 p-4 rounded shadow bg-white ${
                  alerta.status === 'ATIVO' ? 'border-yellow-500' : 'border-green-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{alerta.mensagem}</h3>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Tipo:</span> {alerta.tipo_alerta} &nbsp;|&nbsp;
                      <span className="font-semibold">Nível:</span>
                      <span className={`ml-1 px-2 py-0.5 rounded text-xs font-bold ${
                        alerta.nivel_risco === 'CRITICO' ? 'bg-red-600 text-white' :
                        alerta.nivel_risco === 'ALTO' ? 'bg-orange-500 text-white' :
                        alerta.nivel_risco === 'MEDIO' ? 'bg-yellow-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {alerta.nivel_risco}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Fazenda: {alerta.fazenda?.nome_fazenda || '—'}
                      {alerta.ponto && ` | Ponto: ${alerta.ponto.nome_ponto}`}
                      {alerta.regra && ` | Regra: ${alerta.regra.nome}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Emitido em: {format(new Date(alerta.data_emissao), 'dd/MM/yyyy HH:mm')}
                      {alerta.data_leitura && ` | Lido em: ${format(new Date(alerta.data_leitura), 'dd/MM/yyyy HH:mm')}`}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      alerta.status === 'ATIVO' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                    }`}>
                      {alerta.status}
                    </span>
                    {alerta.status === 'ATIVO' && (
                      <button
                        onClick={() => marcarLido(alerta.id_alerta)}
                        className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700"
                      >
                        Marcar lido
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RotaProtegida>
  );
}