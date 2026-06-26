// frontend1/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: adiciona token JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================
//  AUTENTICAÇÃO
// ============================================================
export async function fazerLogin(email: string, senha: string) {
  const { data } = await api.post('/auth/login', { email, senha });
  return data;
}

export async function fazerRegisto(nome: string, email: string, senha: string) {
  const { data } = await api.post('/auth/register', { nome, email, senha });
  return data;
}

export async function obterUtilizadorAtual(token: string) {
  const { data } = await api.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// ============================================================
//  FAZENDAS
// ============================================================
export async function listarFazendas(pagina = 1, limite = 20) {
  const { data } = await api.get(`/fazendas?page=${pagina}&limit=${limite}`);
  return data;
}

export async function obterFazenda(id: string) {
  const { data } = await api.get(`/fazendas/${id}`);
  return data;
}

export async function criarFazenda(fazenda: any) {
  const { data } = await api.post('/fazendas', fazenda);
  return data;
}

export async function atualizarFazenda(id: string, fazenda: any) {
  const { data } = await api.put(`/fazendas/${id}`, fazenda);
  return data;
}

export async function eliminarFazenda(id: string) {
  await api.delete(`/fazendas/${id}`);
}

// ============================================================
//  PONTOS DE MONITORIZAÇÃO
// ============================================================
export async function listarPontos() {
  const { data } = await api.get('/pontos');
  return data;
}

export async function obterPonto(id: string) {
  const { data } = await api.get(`/pontos/${id}`);
  return data;
}

export async function criarPonto(ponto: any) {
  const { data } = await api.post('/pontos', ponto);
  return data;
}

export async function atualizarPonto(id: string, ponto: any) {
  const { data } = await api.put(`/pontos/${id}`, ponto);
  return data;
}

export async function eliminarPonto(id: string) {
  await api.delete(`/pontos/${id}`);
}

// ============================================================
//  CLIMA
// ============================================================
export async function obterClimaAtual(pontoId: string) {
  const { data } = await api.get(`/clima/current/${pontoId}`);
  return data;
}

export async function obterPrevisao(pontoId: string) {
  const { data } = await api.get(`/clima/forecast/${pontoId}`);
  return data;
}

// ============================================================
//  ALERTAS (REGRAS E DISPARADOS)
// ============================================================
export async function listarRegrasAlertas() {
  const { data } = await api.get('/alertas/regras');
  return data;
}

export async function obterRegraAlerta(id: string) {
  const { data } = await api.get(`/alertas/regras/${id}`);
  return data;
}

export async function criarRegraAlerta(regra: any) {
  const { data } = await api.post('/alertas/regras', regra);
  return data;
}

export async function atualizarRegraAlerta(id: string, regra: any) {
  const { data } = await api.put(`/alertas/regras/${id}`, regra);
  return data;
}

export async function eliminarRegraAlerta(id: string) {
  await api.delete(`/alertas/regras/${id}`);
}

export async function verificarAlertas() {
  const { data } = await api.post('/alertas/verificar');
  return data;
}

export async function listarAlertasDisparados() {
  const { data } = await api.get('/alertas/disparados');
  return data;
}

export async function marcarAlertaComoLido(id: string) {
  const { data } = await api.patch(`/alertas/disparados/${id}/ler`);
  return data;
}

// ============================================================
//  RELATÓRIOS
// ============================================================
export async function obterRelatorioHistorico(fazendaId: string, dias = 30) {
  const { data } = await api.get(`/relatorios/historico/${fazendaId}?dias=${dias}`);
  return data;
}

// ============================================================
//  ADMIN (rotas exclusivas para administradores)
// ============================================================
export async function listarUtilizadores() {
  const { data } = await api.get('/admin/users');
  return data;
}

export async function alterarStatusUtilizador(id: string) {
  const { data } = await api.patch(`/admin/users/${id}/toggle-status`);
  return data;
}

export async function obterEstatisticas() {
  const { data } = await api.get('/admin/stats');
  return data;
}

export async function listarTodasFazendas() {
  const { data } = await api.get('/admin/fazendas');
  return data;
}

export async function listarTodosPontos() {
  const { data } = await api.get('/admin/pontos');
  return data;
}

export async function listarTodosAlertas() {
  const { data } = await api.get('/admin/alertas');
  return data;
}