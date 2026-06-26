'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contextos/ContextoAuth';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'A senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [erroGeral, setErroGeral] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErroGeral('');
    setIsLoading(true);
    try {
      await login(data.email, data.senha);
    } catch (err: any) {
      setErroGeral(err.response?.data?.error || 'Erro ao fazer login. Verifique as credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ minHeight: '100vh', width: '100%' }}
      className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6 transition-all duration-300">
        <div className="text-center mb-6">
      
          <h1 className="text-2xl font-bold text-gray-800">Login</h1>
        
        </div>

        {erroGeral && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
            {erroGeral}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
              placeholder="seu@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Palavra-passe</label>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                {...register('senha')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
              >
                {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-lg transition text-sm flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-5">
          Ainda não tem conta?{' '}
          <Link href="/registar" className="text-green-700 font-medium hover:underline">
            Registe-se
          </Link>
        </p>
      </div>
    </div>
  );
}