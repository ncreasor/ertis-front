"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { YandexMap } from "@/components/YandexMap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Droplet, Construction, Trash2, Sparkles, TreeDeciduous, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Problem {
  id: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  status: "pending" | "assigned" | "in_progress" | "completed";
  priority: string;
  address: string;
}

const categoryIcons: Record<string, typeof Zap> = {
  "Электричество": Zap,
  "Водоснабжение": Droplet,
  "Дорожное покрытие": Construction,
  "Вывоз мусора": Trash2,
  "Уборка территории": Sparkles,
  "Благоустройство": TreeDeciduous,
};

export default function MapPage() {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';
      const response = await fetch(`${apiUrl}/requests/map`);
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить заявки');
      }
      
      const data = await response.json();
      
      const mappedProblems: Problem[] = data.map((item: any) => ({
        id: item.id.toString(),
        lat: item.latitude,
        lng: item.longitude,
        category: item.ai_category || item.problem_type || 'Другое',
        description: item.description,
        status: item.status,
        priority: item.priority,
        address: item.address,
      }));
      
      setProblems(mappedProblems);
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'assigned': return 'Назначена';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершена';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Низкий';
      case 'medium': return 'Средний';
      case 'high': return 'Высокий';
      default: return priority;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Карта проблем города
          </h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Yandex Map */}
            <div className="lg:col-span-2">
              <Card className="glass-card border-primary/20 h-[600px]">
                <CardContent className="p-4 h-full">
                  <YandexMap
                    markers={problems.map(problem => ({
                      id: problem.id,
                      lat: problem.lat,
                      lng: problem.lng,
                      title: problem.category,
                      description: problem.description,
                      status: problem.status,
                      onClick: () => setSelectedProblem(problem)
                    }))}
                    selectedMarkerId={selectedProblem?.id}
                    height="100%"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Problems List */}
            <div className="space-y-4">
              <Card className="glass-card border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
                      Активные проблемы
                    </h2>
                    <Badge className="bg-primary">{problems.length}</Badge>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-400 text-sm mb-2">{error}</p>
                      <button 
                        onClick={fetchProblems}
                        className="text-primary text-sm hover:underline"
                      >
                        Попробовать снова
                      </button>
                    </div>
                  ) : problems.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      Нет активных заявок
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {problems.map((problem) => {
                        const Icon = categoryIcons[problem.category] || MapPin;
                        return (
                          <button
                            key={problem.id}
                            onClick={() => setSelectedProblem(problem)}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                              selectedProblem?.id === problem.id
                                ? "bg-primary/20 border-2 border-primary"
                                : "bg-card/50 border border-white/10 hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  problem.status === "pending"
                                    ? "bg-yellow-500/20"
                                    : problem.status === "assigned"
                                    ? "bg-orange-500/20"
                                    : problem.status === "in_progress"
                                    ? "bg-primary/20"
                                    : "bg-green-500/20"
                                }`}
                              >
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm">
                                  {problem.category}
                                </p>
                                <p className="text-text-secondary text-xs truncate">
                                  {problem.description}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Badge
                                    className={`text-xs ${
                                      problem.status === "pending"
                                        ? "bg-yellow-500"
                                        : problem.status === "assigned"
                                        ? "bg-orange-500"
                                        : problem.status === "in_progress"
                                        ? "bg-primary"
                                        : "bg-green-500"
                                    }`}
                                  >
                                    {getStatusLabel(problem.status)}
                                  </Badge>
                                  <Badge
                                    className={`text-xs ${
                                      problem.priority === "high"
                                        ? "bg-red-500"
                                        : problem.priority === "medium"
                                        ? "bg-yellow-600"
                                        : "bg-gray-500"
                                    }`}
                                  >
                                    {getPriorityLabel(problem.priority)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedProblem && (
                <Card className="glass-card border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-primary mb-4">
                      Детали заявки #{selectedProblem.id}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-white">
                        <span className="text-text-secondary">Категория:</span>{" "}
                        {selectedProblem.category}
                      </p>
                      <p className="text-white">
                        <span className="text-text-secondary">Описание:</span>{" "}
                        {selectedProblem.description}
                      </p>
                      <p className="text-white">
                        <span className="text-text-secondary">Адрес:</span>{" "}
                        {selectedProblem.address}
                      </p>
                      <p className="text-white">
                        <span className="text-text-secondary">Статус:</span>{" "}
                        {getStatusLabel(selectedProblem.status)}
                      </p>
                      <p className="text-white">
                        <span className="text-text-secondary">Приоритет:</span>{" "}
                        {getPriorityLabel(selectedProblem.priority)}
                      </p>
                      <p className="text-white">
                        <span className="text-text-secondary">Координаты:</span>{" "}
                        {selectedProblem.lat.toFixed(4)}, {selectedProblem.lng.toFixed(4)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}

