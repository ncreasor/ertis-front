"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { YandexMap } from "@/components/YandexMap";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  CheckCircle, Clock, MapPin, AlertCircle, 
  TrendingUp, Loader2, Play, Map as MapIcon
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

const API_BASE = 'https://ertis-servise-ertis-service.up.railway.app/api/v1';

export default function WorkerDashboard() {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showMap, setShowMap] = useState(false);

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

      const response = await fetch(`${API_BASE}/requests/assigned`, {
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
      
      await fetch(`${API_BASE}/requests/${taskId}/start`, {
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
      
      const formData = new FormData();
      formData.append('completion_note', 'Выполнено');

      await fetch(`${API_BASE}/requests/${taskId}/complete`, {
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

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const tasksWithCoords = activeTasks.filter(t => t.latitude && t.longitude);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {t.worker.title}
              </h1>
              <p className="text-gray-400">
                {user?.first_name} {user?.last_name}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMap(!showMap)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showMap 
                    ? 'bg-primary text-black' 
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.worker.viewOnMap}</span>
              </button>
              <Link
                href="/worker/stats"
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">{t.common.loading.split('...')[0]}</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bento-item p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-orange-500">{stats.assigned}</p>
              <p className="text-gray-500 text-sm">{t.worker.assigned}</p>
            </div>
            <div className="bento-item p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-blue-500">{stats.inProgress}</p>
              <p className="text-gray-500 text-sm">{t.worker.inProgress}</p>
            </div>
            <div className="bento-item p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-green-500">{stats.completed}</p>
              <p className="text-gray-500 text-sm">{t.worker.completed}</p>
            </div>
          </div>

          {/* Map View */}
          {showMap && (
            <div className="bento-item p-4 mb-6">
              <h2 className="text-lg font-bold text-white mb-4">{t.worker.viewOnMap}</h2>
              <div className="h-[400px] rounded-xl overflow-hidden">
                <YandexMap
                  markers={tasksWithCoords.map(task => ({
                    id: task.id.toString(),
                    lat: task.latitude!,
                    lng: task.longitude!,
                    title: task.ai_category || t.admin.requests,
                    description: task.description,
                    status: task.status,
                    onClick: () => setSelectedTask(task)
                  }))}
                  selectedMarkerId={selectedTask?.id.toString()}
                  height="100%"
                  center={tasksWithCoords.length > 0 
                    ? [tasksWithCoords[0].latitude!, tasksWithCoords[0].longitude!] 
                    : [52.2873, 76.9653]
                  }
                  zoom={tasksWithCoords.length > 0 ? 14 : 12}
                />
              </div>
              {tasksWithCoords.length === 0 && (
                <p className="text-gray-500 text-center mt-4">{t.worker.noTasks}</p>
              )}
            </div>
          )}

          {/* Tasks List */}
          <div className="bento-item p-6">
            <h2 className="text-xl font-bold text-white mb-6">{t.worker.myTasks}</h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : activeTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-400">{t.worker.noTasks}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`p-5 bg-white/5 rounded-xl border transition-all ${
                      selectedTask?.id === task.id 
                        ? 'border-primary' 
                        : 'border-white/5 hover:border-white/10'
                    }`}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-semibold">
                            {task.ai_category || t.admin.requests}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            task.status === 'assigned' ? 'bg-orange-500' :
                            task.status === 'in_progress' ? 'bg-blue-500' : 'bg-green-500'
                          } text-white`}>
                            {t.status[task.status as keyof typeof t.status] || task.status}
                          </span>
                          <span className={`text-xs ${
                            task.priority === 'high' ? 'text-red-400' :
                            task.priority === 'medium' ? 'text-yellow-400' : 'text-gray-400'
                          }`}>
                            {t.priority[task.priority as keyof typeof t.priority] || task.priority}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              startTask(task.id);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            <Play className="w-4 h-4" />
                            {t.worker.start}
                          </button>
                        )}
                        {task.status === 'in_progress' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              completeTask(task.id);
                            }}
                            disabled={completingId === task.id}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm disabled:opacity-50"
                          >
                            {completingId === task.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            {t.worker.finish}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
