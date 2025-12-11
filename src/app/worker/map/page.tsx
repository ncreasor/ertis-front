"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { MapPin, Navigation, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { mockWorkerTasks, mockDelay } from "@/lib/mockData";

const priorityConfig = {
  high: { label: "Высокий", color: "bg-red-500" },
  medium: { label: "Средний", color: "bg-yellow-500" },
  low: { label: "Низкий", color: "bg-green-500" },
};

const statusConfig = {
  assigned: { label: "Назначено", color: "text-blue-500 bg-blue-500/10" },
  in_progress: { label: "В работе", color: "text-primary bg-primary/10" },
};

const categoryNames: Record<string, string> = {
  electricity: "Электричество",
  water: "Водопровод",
  roads: "Дороги",
  garbage: "Мусор",
  cleaning: "Уборка",
  landscaping: "Благоустройство",
};

export default function WorkerMapPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      // REAL API MODE - Connected to backend
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await fetch('/api/requests/assigned', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to load tasks');
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
      
      /* MOCK MODE - For testing without backend
      await mockDelay(600);
      setTasks(mockWorkerTasks);
      setIsLoading(false);
      */
    };

    loadTasks();
  }, []);

  const getPriority = (distance: number) => {
    if (distance < 1) return "high";
    if (distance < 2) return "medium";
    return "low";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Карта заявок рядом
          </h1>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <div className="card-unified h-[600px] p-0 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                      <p className="text-gray-400">
                        Карта с заявками в радиусе 5 км
                      </p>
                      <button className="mt-4 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors flex items-center gap-2 mx-auto">
                        <Navigation className="h-4 w-4" />
                        Использовать мое местоположение
                      </button>
                    </div>
                  </div>

                  {/* Map markers */}
                  {tasks.map((task, index) => {
                    const priority = getPriority(task.distance || 0);
                    return (
                      <button
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className={`absolute w-10 h-10 rounded-full ${
                          priorityConfig[priority].color
                        } flex items-center justify-center text-white font-bold hover:scale-110 transition-transform z-10 shadow-lg`}
                        style={{
                          left: `${25 + index * 20}%`,
                          top: `${35 + index * 10}%`,
                        }}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                <div className="card-unified p-6">
                  <h2 className="text-xl font-bold text-white mb-4">
                    Заявки рядом со мной
                  </h2>
                  {tasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Нет заявок поблизости
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task, index) => {
                        const priority = getPriority(task.distance || 0);
                        const status = statusConfig[task.status as keyof typeof statusConfig];
                        
                        return (
                          <button
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                              selectedTask?.id === task.id
                                ? "bg-primary/20 border-2 border-primary"
                                : "bg-[#1a1a1a] border border-white/5 hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="text-white font-medium text-sm">
                                #{task.id} {categoryNames[task.category]}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs ${status.color}`}>
                                {status.label}
                              </span>
                            </div>
                            <p className="text-gray-400 text-xs mb-2">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <MapPin className="h-3 w-3 text-primary" />
                              <span className="text-gray-400">{task.address}</span>
                            </div>
                            <div className="mt-2 text-xs text-primary font-medium">
                              📍 {task.distance} км от вас
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {selectedTask && (
                  <div className="card-unified p-6 space-y-4">
                    <h3 className="text-lg font-bold text-primary">
                      Детали заявки
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-white">
                        <span className="text-gray-400">Категория:</span>{" "}
                        {categoryNames[selectedTask.category]}
                      </p>
                      <p className="text-white">
                        <span className="text-gray-400">Описание:</span>{" "}
                        {selectedTask.description}
                      </p>
                      <p className="text-white">
                        <span className="text-gray-400">Адрес:</span>{" "}
                        {selectedTask.address}
                      </p>
                      <p className="text-white">
                        <span className="text-gray-400">Расстояние:</span>{" "}
                        {selectedTask.distance} км
                      </p>
                    </div>
                    
                    {selectedTask.photo_url && (
                      <div>
                        <p className="text-gray-400 text-xs mb-2">Фото проблемы:</p>
                        <img 
                          src={selectedTask.photo_url} 
                          alt="Фото" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      {selectedTask.status === 'assigned' && (
                        <button className="w-full py-2.5 bg-gradient-to-r from-primary to-cyan-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium">
                          <CheckCircle className="h-4 w-4" />
                          Взять в работу
                        </button>
                      )}
                      {selectedTask.status === 'in_progress' && (
                        <button className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium">
                          <CheckCircle className="h-4 w-4" />
                          Завершить задачу
                        </button>
                      )}
                      <button className="w-full py-2.5 bg-transparent border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                        <Navigation className="h-4 w-4" />
                        Построить маршрут
                      </button>
                      <button className="w-full py-2.5 bg-transparent border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4" />
                        Связаться с клиентом
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
