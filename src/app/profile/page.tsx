"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { User, Edit2, Mail, Phone, Calendar, Shield, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface UserData {
  id: number;
  username: string;
  email?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  created_at: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';
      const response = await fetch(`${apiUrl}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        throw new Error('Не удалось загрузить данные');
      }

      const data = await response.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      console.error('Error loading user:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'citizen': return 'Житель';
      case 'employee': return 'Сотрудник';
      case 'admin': return 'Администратор';
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-12">
        <div className="card-unified w-full max-w-2xl p-8 md:p-10">
          {error && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}. Показаны кэшированные данные.
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-36 h-36 md:w-44 md:h-44 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <span className="text-5xl md:text-6xl font-bold text-white">{getUserInitials()}</span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-gray-400 text-lg">@{user?.username}</p>
              </div>

              <div className="space-y-4">
                {user?.email && (
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="w-4 h-4" />
                      <span>Email:</span>
                    </div>
                    <span className="text-white">{user.email}</span>
                  </div>
                )}

                {user?.phone && (
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Phone className="w-4 h-4" />
                      <span>Телефон:</span>
                    </div>
                    <span className="text-white">{user.phone}</span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>Роль:</span>
                  </div>
                  <span className="inline-flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {getRoleName(user?.role || 'citizen')}
                    </span>
                  </span>
                </div>

                {user?.created_at && (
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Регистрация:</span>
                    </div>
                    <span className="text-white">{formatDate(user.created_at)}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  className="w-full md:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Редактировать профиль
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}
