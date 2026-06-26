'use client';
import { useContext } from 'react';
import { ContextoAuth } from '@/contextos/ContextoAuth';

// Hook personalizado para usar a autenticação
export function useAuth() {
  const contexto = useContext(ContextoAuth);
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de um ProvedorAuth');
  }
  return contexto;
}