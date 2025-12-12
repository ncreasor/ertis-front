"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, Clock, CheckCircle, AlertCircle, MapPin, 
  FileText, Bell, ArrowRight, Loader2, XCircle
} from "lucide-react";

interface Request {
  id: number;
  description: string;
  address: string;
  status: string;
  priority: string;
  ai_category?: string;
  ai_recommendation?: string;
  created_at: string;
}

interface UserData {
  first_name: string;
  last_name: string;
  username: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Ожидает", color: "bg-yellow-500", icon: Clock },
  assigned: { label: "Назначена", color: "bg-orange-500", icon: AlertCircle },
  in_progress: { label: "В работе", color: "bg-blue-500", icon: AlertCircle },
  completed: { label: "Выполнена", color: "bg-green-500", icon: CheckCircle },
  closed: { label: "Закрыта", color: "bg-gray-500", icon: XCircle },
};

export default function DashboardPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';
      const response = await fetch(`${apiUrl}/requests/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
          return;
        }
        throw new Error('Failed to load');
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending' || r.status === 'assigned').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed' || r.status === 'closed').length,
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Добро пожаловать{user ? `, ${user.first_name}` : ''}!
            </h1>
            <p className="text-gray-400">Управляйте своими заявками и следите за их статусом</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link 
              href="/create-request"
              className="bento-item p-6 flex items-center gap-4 group hover:border-primary/40"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shrink-0">
                <Plus className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">Новая заявка</p>
                <p className="text-gray-500 text-sm">Сообщить о проблеме</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/history"
              className="bento-item p-6 flex items-center gap-4 group hover:border-accent/40"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">Мои заявки</p>
                <p className="text-gray-500 text-sm">{stats.total} заявок</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/map"
              className="bento-item p-6 flex items-center gap-4 group hover:border-green-500/40"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-black" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">Карта</p>
                <p className="text-gray-500 text-sm">Заявки на карте</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bento-item p-5 text-center">
              <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
              <p className="text-gray-500 text-sm">Всего заявок</p>
            </div>
            <div className="bento-item p-5 text-center">
              <p className="text-3xl font-bold text-yellow-500 mb-1">{stats.pending}</p>
              <p className="text-gray-500 text-sm">Ожидают</p>
            </div>
            <div className="bento-item p-5 text-center">
              <p className="text-3xl font-bold text-blue-500 mb-1">{stats.inProgress}</p>
              <p className="text-gray-500 text-sm">В работе</p>
            </div>
            <div className="bento-item p-5 text-center">
              <p className="text-3xl font-bold text-green-500 mb-1">{stats.completed}</p>
              <p className="text-gray-500 text-sm">Завершены</p>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bento-item p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Последние заявки</h2>
              <Link href="/history" className="text-primary text-sm hover:underline">
                Все заявки →
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">У вас пока нет заявок</p>
                <Link 
                  href="/create-request"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Создать заявку
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.slice(0, 5).map((request) => {
                  const status = statusConfig[request.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <div 
                      key={request.id} 
                      className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium truncate">
                              {request.ai_category || 'Заявка'}
                            </span>
                            <span className="text-gray-600 text-sm">#{request.id}</span>
                          </div>
                          <p className="text-gray-400 text-sm truncate">{request.description}</p>
                          <p className="text-gray-600 text-xs mt-1">📍 {request.address}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}
