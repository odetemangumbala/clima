'use client';
import { useEffect, useState } from 'react';
import { listarUtilizadores, obterEstatisticas } from '@/lib/api';
import Link from 'next/link';

interface Estatisticas {
  totalUtilizadores: number;
  totalFazendas: number;
  totalAlertas: number;
}

export default function ResumoAdmin() {
  const [numUsers, setNumUsers] = useState(0);
  const [stats, setStats] = useState<Estatisticas>({ totalUtilizadores: 0, totalFazendas: 0, totalAlertas: 0 });

  useEffect(() => {
    listarUtilizadores().then(users => setNumUsers(users.length));
    obterEstatisticas()
      .then(setStats)
      .catch(err => console.error('Erro ao obter estatísticas:', err));
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-3xl font-bold text-purple-700">{numUsers}</p>
        <p>Utilizadores registados</p>
        <Link href="/admin/utilizadores" className="text-sm text-blue-600">Gerir contas</Link>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-3xl font-bold text-green-700">{stats.totalFazendas}</p>
        <p>Fazendas (total)</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-3xl font-bold text-yellow-700">{stats.totalAlertas}</p>
        <p>Alertas configurados</p>
      </div>
    </div>
  );
}