export interface Utilizador {
  id_usuario: string;
  nome: string;
  email: string;
  tipo_usuario: 'USER' | 'ADMIN';
}

export interface Fazenda {
  id_fazenda: string;
  nome_fazenda: string;
  localizacao?: string;
  latitude: number;
  longitude: number;
  tamanho_area?: number;
  tipo_cultura?: string;
  descricao?: string;
  status: boolean;
  created_at: string;
}

export interface Ponto {
  id_ponto: string;
  nome_ponto: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  descricao?: string;
  status: boolean;
  id_fazenda: string;
  fazenda?: Fazenda;
}

export interface ClimaAtual {
  ponto: string;
  temperatura: number;
  sensacao_termica: number;
  humidade: number;
  pressao: number;
  velocidade_vento: number;
  condicao_climatica: string;
  icone: string;
}

export interface PrevisaoDia {
  data: string;
  temp_min: number;
  temp_max: number;
  probabilidade_chuva: number;
  velocidade_vento: number;
  humidade: number;
  condicao: string;
}

export interface RegraAlerta {
  id_config: string;
  nome: string;
  descricao?: string;
  min_temp?: number;
  max_temp?: number;
  chuva_prob_min?: number;
  vento_max?: number;
  id_fazenda?: string;
  id_ponto?: string;
  ativo: boolean;
}

export interface RelatorioHistorico {
  date: string;
  temp_min: number;
  temp_max: number;
  temp_media: number;
  humidade_media: number;
  vento_medio: number;
}