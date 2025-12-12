"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

const typeConfig = {
  info: { icon: Info, color: "text-blue-500 bg-blue-500/10" },
  success: { icon: CheckCircle, color: "text-green-500 bg-green-500/10" },
  warning: { icon: AlertTriangle, color: "text-yellow-500 bg-yellow-500/10" },
  error: { icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
};

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';
      const response = await fetch(`${apiUrl}/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
          return;
        }
        throw new Error('Не удалось загрузить уведомления');
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';
      await fetch(`${apiUrl}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин`;
    if (diffHours < 24) return `${diffHours} час${diffHours === 1 ? '' : (diffHours < 5 ? 'а' : 'ов')}`;
    if (diffDays < 7) return `${diffDays} д${diffDays === 1 ? 'ень' : (diffDays < 5 ? 'ня' : 'ней')}`;
    
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card-unified p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold text-white">Уведомления</h1>
                {unreadCount > 0 && (
                  <span className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-black">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={loadNotifications}
                disabled={isLoading}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                title="Обновить"
              >
                <RefreshCw className={`w-5 h-5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={loadNotifications}
                  className="text-primary hover:underline"
                >
                  Попробовать снова
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">У вас пока нет уведомлений</p>
                <p className="text-gray-600 text-sm mt-2">
                  Здесь будут появляться уведомления о статусе ваших заявок
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const config = typeConfig[notification.type as keyof typeof typeConfig] || typeConfig.info;
                  const Icon = config.icon;

                  return (
                    <div
                      key={notification.id}
                      onClick={() => !notification.is_read && markAsRead(notification.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        notification.is_read
                          ? 'bg-[#1a1a1a] border-white/5'
                          : 'bg-primary/5 border-primary/20 hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${config.color} mt-1`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className={`font-semibold ${notification.is_read ? 'text-gray-400' : 'text-white'}`}>
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-600 whitespace-nowrap">
                              {formatTime(notification.created_at)}
                            </span>
                          </div>
                          <p className={`text-sm ${notification.is_read ? 'text-gray-600' : 'text-gray-400'}`}>
                            {notification.message}
                          </p>
                        </div>

                        {!notification.is_read && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        )}
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
