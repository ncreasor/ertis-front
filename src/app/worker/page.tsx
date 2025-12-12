"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle, Clock, MapPin, AlertCircle, 
  TrendingUp, Camera, Loader2, Play
} from "lucide-react";

interface Task {
  id: number;
  description: string;
  address: string;
  status: string;
  priority: string;
  ai_category?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  assigned: { label: "Назначена", color: "bg-orange-500" },
  in_progress: { label: "В работе", color: "bg-blue-500" },
  completed: { label: "Выполнена", color: "bg-green-500" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Низкий", color: "text-gray-400" },
  medium: { label: "Средний", color: "text-yellow-400" },
  high: { label: "Высокий", color: "text-red-400" },
};

export default function WorkerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        if (userData.role !== 'employee') {
          window.location.href = '/dashboard';
          return;
        }
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';
      const response = await fetch(`${apiUrl}/requests/assigned`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to load tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startTask = async (taskId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';
      
      await fetch(`${apiUrl}/requests/${taskId}/start`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'in_progress' } : t
      ));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const completeTask = async (taskId: number) => {
    setCompletingId(taskId);
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';
      
      const formData = new FormData();
      formData.append('completion_note', 'Выполнено');

      await fetch(`${apiUrl}/requests/${taskId}/complete`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'completed' } : t
      ));
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setCompletingId(null);
    }
  };

  const stats = {
    assigned: tasks.filter(t => t.status === 'assigned').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Мои задачи
              </h1>
              <p className="text-gray-400">
                {user?.first_name} {user?.last_name}
              </p>
            </div>
            <Link
              href="/worker/stats"
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Статистика</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bento-item p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-orange-500">{stats.assigned}</p>
              <p className="text-gray-500 text-sm">Назначено</p>
            </div>
            <div className="bento-item p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-blue-500">{stats.inProgress}</p>
              <p className="text-gray-500 text-sm">В работе</p>
            </div>
            <div className="bento-item p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-green-500">{stats.completed}</p>
              <p className="text-gray-500 text-sm">Выполнено</p>
            </div>
          </div>

          {/* Tasks List */}
          <div className="bento-item p-6">
            <h2 className="text-xl font-bold text-white mb-6">Активные задачи</h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : tasks.filter(t => t.status !== 'completed').length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-400">Нет активных задач</p>
                <p className="text-gray-600 text-sm mt-1">Все заявки выполнены!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.filter(t => t.status !== 'completed').map((task) => {
                  const status = statusConfig[task.status] || statusConfig.assigned;
                  const priority = priorityConfig[task.priority] || priorityConfig.medium;

                  return (
                    <div 
                      key={task.id}
                      className="p-5 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-white font-semibold">
                              {task.ai_category || 'Заявка'}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${status.color} text-white`}>
                              {status.label}
                            </span>
                            <span className={`text-xs ${priority.color}`}>
                              {priority.label}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{task.description}</p>
                        </div>
                        <span className="text-gray-600 text-sm">#{task.id}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{task.address}</span>
                        </div>

                        <div className="flex gap-2">
                          {task.status === 'assigned' && (
                            <button
                              onClick={() => startTask(task.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                              <Play className="w-4 h-4" />
                              Начать
                            </button>
                          )}
                          {task.status === 'in_progress' && (
                            <button
                              onClick={() => completeTask(task.id)}
                              disabled={completingId === task.id}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:opacity-50"
                            >
                              {completingId === task.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              Завершить
                            </button>
                          )}
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

