"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { LogIn, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

function LoginForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess(t.auth.registrationSuccess);
    }
  }, [searchParams, t.auth.registrationSuccess]);

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
      const data = await api.login({
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'employee') {
        window.location.href = '/worker';
      } else if (data.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-12">
      <div className="card-unified w-full max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <LogIn className="w-7 h-7 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            {t.auth.loginTitle}
          </h1>
        </div>
        <p className="text-gray-400 mb-8">{t.auth.loginSubtitle}</p>

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">{t.auth.username}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input-unified"
              placeholder={t.auth.usernamePlaceholder}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">{t.auth.password}</label>
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
              {t.auth.forgotPassword}
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
                {t.auth.loginButton}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          {t.auth.noAccount}{" "}
          <Link href="/register" className="text-white font-medium hover:text-primary transition-colors">
            {t.auth.registerButton}
          </Link>
        </p>
      </div>
    </main>
  );
}

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

      <Footer />
      <ChatBot />
    </div>
  );
}
