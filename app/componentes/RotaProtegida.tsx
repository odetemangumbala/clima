'use client';
import { useAuth } from '@/contextos/ContextoAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RotaProtegida({ children }: { children: React.ReactNode }) {
  const { utilizador, aCarregar } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!aCarregar && !utilizador) {
      router.push('/login');
    }
  }, [utilizador, aCarregar, router]);

  if (aCarregar || !utilizador) {
    return <div className="text-center p-10">A carregar...</div>;
  }

  return <>{children}</>;
}