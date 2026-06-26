'use client';
import { useEffect, useState } from 'react';
import { listarFazendas, listarPontos, listarRegrasAlertas } from '@/lib/api';
import Link from 'next/link';

export default function ResumoAgricultor() {
  const [numFazendas, setNumFazendas] = useState(0);
  const [numPontos, setNumPontos] = useState(0);
  const [numAlertas, setNumAlertas] = useState(0);

  useEffect(() => {
    listarFazendas(1, 100).then(data => setNumFazendas(data.total));
    listarPontos().then(pontos => setNumPontos(pontos.length));
    listarRegrasAlertas().then(regras => setNumAlertas(regras.length));
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-3xl font-bold text-green-700">{numFazendas}</p>
        <p>Fazendas</p>
        <Link href="/fazendas" className="text-sm text-blue-600">Ver todas</Link>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-3xl font-bold text-blue-700">{numPontos}</p>
        <p>Pontos de monitorização</p>
        <Link href="/pontos" className="text-sm text-blue-600">Ver todos</Link>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <p className="text-3xl font-bold text-yellow-700">{numAlertas}</p>
        <p>Regras de alerta</p>
        <Link href="/alertas" className="text-sm text-blue-600">Gerir alertas</Link>
      </div>
    </div>
  );
}