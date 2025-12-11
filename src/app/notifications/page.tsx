"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { mockNotifications, mockDelay } from "@/lib/mockData";

const typeConfig = {
  info: { icon: Info, color: "text-blue-500 bg-blue-500/10" },
  success: { icon: CheckCircle, color: "text-green-500 bg-green-500/10" },
  warning: { icon: AlertTriangle, color: "text-yellow-500 bg-yellow-500/10" },
  error: { icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      // For now, use mock data since notifications endpoint may not be implemented yet
      // TODO: Switch to real API when backend notifications are ready
      await mockDelay(400);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const userNotifs = mockNotifications.filter(n => n.user_id === user.id);
        setNotifications(userNotifs);
      }
      setIsLoading(false);
      
      /* REAL API MODE - Uncomment when backend notifications endpoint is ready
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await fetch('/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to load notifications');
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to load notifications:', error);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
      */
    };

    loadNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    
    /* REAL API MODE - Uncomment when backend is ready
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
    */
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
            <div className="flex items-center justify-center gap-3 mb-8">
              <Bell className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-white">Уведомления</h1>
              {unreadCount > 0 && (
                <span className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-black">
                  {unreadCount}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">У вас пока нет уведомлений</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const config = typeConfig[notification.type as keyof typeof typeConfig];
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

      <ChatBot />
    </div>
  );
}
