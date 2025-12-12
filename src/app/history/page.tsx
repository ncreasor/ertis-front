"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const API_BASE = 'https://ertis-servise-ertis-service.up.railway.app';

function getImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function HistoryPage() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const statusConfig = {
    pending: { label: t.status.pending, color: "text-yellow-500 bg-yellow-500/10", icon: Clock },
    in_progress: { label: t.status.in_progress, color: "text-primary bg-primary/10", icon: AlertCircle },
    completed: { label: t.status.completed, color: "text-green-500 bg-green-500/10", icon: CheckCircle },
    rejected: { label: t.status.rejected, color: "text-red-500 bg-red-500/10", icon: XCircle },
    assigned: { label: t.status.assigned, color: "text-blue-500 bg-blue-500/10", icon: AlertCircle },
    closed: { label: t.status.closed, color: "text-gray-500 bg-gray-500/10", icon: XCircle },
  };

  useEffect(() => {
    const loadRequests = async () => {
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
          <h1 className="text-3xl font-bold text-white mb-8">{t.history.title}</h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="card-unified p-12 text-center">
              <p className="text-gray-500 text-lg">{t.history.noRequests}</p>
              <a 
                href="/create-request" 
                className="inline-block mt-4 text-primary hover:underline"
              >
                {t.history.createFirst} →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <div key={request.id} className="card-unified p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {request.ai_category || request.title || t.admin.requests}
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
                          src={getImageUrl(request.photo_url) || ''} 
                          alt="Photo"
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                    )}

                    {request.ai_recommendation && (
                      <div className="my-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-xs text-primary mb-1">🤖 {t.history.aiRecommendation}:</p>
                        <p className="text-sm text-gray-300">{request.ai_recommendation}</p>
                      </div>
                    )}
                    
                    {request.ai_category && !request.ai_recommendation && (
                      <div className="my-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">📋 {t.map.category}:</p>
                        <p className="text-sm text-gray-300">{request.ai_category}</p>
                      </div>
                    )}

                    {request.status === 'closed' && request.completion_note && (
                      <div className="my-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">{t.history.closureReason}:</p>
                        <p className="text-sm text-red-300">{request.completion_note}</p>
                      </div>
                    )}

                    {request.status === 'completed' && request.completion_photo_url && (
                      <div className="my-3">
                        <p className="text-xs text-gray-400 mb-2">{t.history.afterPhoto}:</p>
                        <img 
                          src={getImageUrl(request.completion_photo_url) || ''} 
                          alt="Completion photo"
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
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

      <Footer />
      <ChatBot />
    </div>
  );
}
