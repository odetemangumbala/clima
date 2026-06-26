'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { fazerLogin, fazerRegisto, obterUtilizadorAtual } from '@/lib/api';

interface Utilizador {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface ContextoAuthType {
  utilizador: Utilizador | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  registar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
  aCarregar: boolean;
}

export const ContextoAuth = createContext<ContextoAuthType | undefined>(undefined);

export function ProvedorAuth({ children }: { children: ReactNode }) {
  const [utilizador, setUtilizador] = useState<Utilizador | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [aCarregar, setACarregar] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const tokenGuardado = localStorage.getItem('token');

    if (tokenGuardado) {
      // SEMPRE valida o token com o backend, mesmo que exista utilizador guardado
      obterUtilizadorAtual(tokenGuardado)
        .then((user) => {
          setUtilizador(user);
          setToken(tokenGuardado);
          localStorage.setItem('utilizador', JSON.stringify(user));
        })
        .catch(() => {
          // Token inválido/expirado – limpa tudo
          localStorage.removeItem('token');
          localStorage.removeItem('utilizador');
          setUtilizador(null);
          setToken(null);
        })
        .finally(() => setACarregar(false));
    } else {
      // Não há token – limpa utilizador guardado (por segurança)
      localStorage.removeItem('utilizador');
      setUtilizador(null);
      setToken(null);
      setACarregar(false);
    }
  }, []);

  const login = async (email: string, senha: string) => {
    const { token, user } = await fazerLogin(email, senha);
    localStorage.setItem('token', token);
    localStorage.setItem('utilizador', JSON.stringify(user));
    setToken(token);
    setUtilizador(user);
    router.push('/painel');
  };

  const registar = async (nome: string, email: string, senha: string) => {
    await fazerRegisto(nome, email, senha);
    await login(email, senha);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('utilizador');
    setToken(null);
    setUtilizador(null);
    router.push('/login');
  };

  return (
    <ContextoAuth.Provider value={{ utilizador, token, login, registar, logout, aCarregar }}>
      {children}
    </ContextoAuth.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(ContextoAuth);
  if (!contexto) throw new Error('useAuth deve ser usado dentro de ProvedorAuth');
  return contexto;
}