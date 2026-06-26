import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProvedorAuth } from '@/contextos/ContextoAuth';
import BarraNavegacao from '@/app/componentes/BarraNavegacao';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Clima Fazenda - Monitoramento Climático',
  description: 'Sistema de monitoramento climático para fazendas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <ProvedorAuth>
          <BarraNavegacao />
          <main className="w-full min-h-screen">{children}</main>
        </ProvedorAuth>
      </body>
    </html>
  );
}