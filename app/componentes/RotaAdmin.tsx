// componentes/RotaAdmin.tsx
'use client';
import { useAuth } from '@/contextos/ContextoAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RotaAdmin({ children }: { children: React.ReactNode }) {
  const { utilizador, aCarregar } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!aCarregar && (!utilizador || utilizador.role !== 'ADMIN')) {
      router.push('/painel');
    }
  }, [utilizador, aCarregar, router]);

  if (aCarregar || !utilizador || utilizador.role !== 'ADMIN') {
    return <div className="text-center p-10">A verificar permissões...</div>;
  }
  return <>{children}</>;
}