"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Clock, CheckCircle, AlertCircle, XCircle, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { mockRequests, mockDelay } from "@/lib/mockData";

const statusConfig = {
  pending: { label: "Ожидает", color: "text-yellow-500 bg-yellow-500/10", icon: Clock },
  in_progress: { label: "В работе", color: "text-primary bg-primary/10", icon: AlertCircle },
  completed: { label: "Выполнено", color: "text-green-500 bg-green-500/10", icon: CheckCircle },
  rejected: { label: "Отклонено", color: "text-red-500 bg-red-500/10", icon: XCircle },
  assigned: { label: "Назначено", color: "text-blue-500 bg-blue-500/10", icon: AlertCircle },
};

const categoryNames: Record<string, string> = {
  electricity: "Электричество",
  water: "Водопровод",
  roads: "Дороги",
  garbage: "Мусор",
  cleaning: "Уборка",
  landscaping: "Благоустройство",
};

const statusLabels: Record<string, string> = {
  pending: "Ожидает",
  assigned: "Назначено",
  in_progress: "В работе",
  completed: "Выполнено",
  closed: "Закрыто",
};

export default function HistoryPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      // REAL API MODE - Connected to backend
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';
        const response = await fetch(`${apiUrl}/requests/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to load requests');
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Failed to load requests:', error);
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
      
      /* MOCK MODE - For testing without backend
      await mockDelay(600);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const userRequests = mockRequests.filter(r => r.user_id === user.id);
        setRequests(userRequests);
      }
      setIsLoading(false);
      */
    };

    loadRequests();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">История заявок</h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="card-unified p-12 text-center">
              <p className="text-gray-500 text-lg">У вас пока нет заявок</p>
              <a 
                href="/create-request" 
                className="inline-block mt-4 text-primary hover:underline"
              >
                Создать первую заявку →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const status = statusConfig[request.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

                return (
                  <div key={request.id} className="card-unified p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {request.title || categoryNames[request.category] || 'Заявка'}
                          </h3>
                          <span className="text-xs text-gray-600">#{request.id}</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{request.description}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm whitespace-nowrap ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </div>
                    </div>
                    
                    {request.photo_url && (
                      <div className="my-3">
                        <img 
                          src={request.photo_url} 
                          alt="Фото проблемы"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {request.ai_recommendation && (
                      <div className="my-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-xs text-primary mb-1">🤖 Рекомендация ИИ:</p>
                        <p className="text-sm text-gray-300">{request.ai_recommendation}</p>
                      </div>
                    )}
                    
                    {request.ai_category && !request.ai_recommendation && (
                      <div className="my-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">📋 Категория:</p>
                        <p className="text-sm text-gray-300">{request.ai_category}</p>
                      </div>
                    )}

                    {request.status === 'closed' && request.completion_note && (
                      <div className="my-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Причина закрытия:</p>
                        <p className="text-sm text-red-300">{request.completion_note}</p>
                      </div>
                    )}

                    {request.status === 'completed' && request.completion_photo_url && (
                      <div className="my-3">
                        <p className="text-xs text-gray-400 mb-2">Фото после выполнения:</p>
                        <img 
                          src={request.completion_photo_url} 
                          alt="Фото после выполнения"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm pt-3 border-t border-white/5">
                      <span className="text-gray-500">📍 {request.address}</span>
                      <span className="text-gray-600">{formatDate(request.created_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
