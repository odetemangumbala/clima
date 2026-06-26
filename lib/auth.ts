
export interface Utilizador {
  id: string;
  nome: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// Chave usada no localStorage
const TOKEN_KEY = 'token';

// Guarda o token no localStorage
export function guardarToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

// Obtém o token guardado
export function obterToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

// Remove o token (logout)
export function removerToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// (existe token)
export function estaAutenticado(): boolean {
  return !!obterToken();
}


export function guardarUtilizador(utilizador: Utilizador): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('utilizador', JSON.stringify(utilizador));
  }
}


export function obterUtilizadorGuardado(): Utilizador | null {
  if (typeof window !== 'undefined') {
    const dados = localStorage.getItem('utilizador');
    if (dados) return JSON.parse(dados);
  }
  return null;
}


export function removerUtilizadorGuardado(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('utilizador');
  }
}