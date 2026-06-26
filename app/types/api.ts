// Adiciona ou atualiza esta interface dentro de types/api.ts:
export interface ClimaAtual {
  id_clima: string;
  temperatura: number;
  humidade: number;
  velocidade_vento: number;
  pressao: number;
  sensacao_termica: number;
  condicao_climatica: string;
  indice_uv: number;
  precipitacao: number;
  data_hora: string;
  id_ponto: string;
}

// ... mantém as outras interfaces (Usuario, Fazenda, RespostaClimatica) cá dentro