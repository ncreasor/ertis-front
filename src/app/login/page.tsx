"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { LogIn, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

// Separate component for search params logic
function LoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess("Регистрация успешна! Теперь вы можете войти.");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Use API client to login
      const data = await api.login({
        email: formData.email,
        password: formData.password,
      });

      // Store token and user data (already done in api.login, but set user)
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'employee') {
        window.location.href = '/worker/map';
      } else if (data.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный email или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-12">
        <div className="card-unified w-full max-w-md">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <LogIn className="w-7 h-7 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Вход
            </h1>
          </div>
          <p className="text-gray-400 mb-8">Войдите в свой аккаунт</p>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-4 text-sm">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-unified"
                placeholder="example@gmail.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-unified"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                Забыли пароль?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-unified btn-unified-primary flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  Войти
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-white font-medium hover:text-primary transition-colors">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <Suspense fallback={
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin text-primary">⏳</div>
        </main>
      }>
        <LoginForm />
      </Suspense>

      <ChatBot />
    </div>
  );
}
