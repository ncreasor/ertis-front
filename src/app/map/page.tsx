"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { YandexMap } from "@/components/YandexMap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Droplet, Construction, Trash2, Sparkles, TreeDeciduous, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  "Водопровод": Droplet,
  "Дорожное покрытие": Construction,
  "Дороги": Construction,
  "Вывоз мусора": Trash2,
  "Мусор": Trash2,
  "Уборка территории": Sparkles,
  "Уборка": Sparkles,
  "Благоустройство": TreeDeciduous,
};

const API_BASE = 'https://ertis-servise-ertis-service.up.railway.app';

export default function MapPage() {
  const { t } = useLanguage();
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
      const response = await fetch(`${API_BASE}/api/v1/requests/map`);
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить заявки');
      }
      
      const data = await response.json();
      console.log('Map data received:', data);
      
      const mappedProblems: Problem[] = data
        .filter((item: any) => item.latitude && item.longitude)
        .map((item: any) => ({
          id: item.id.toString(),
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude),
          category: item.ai_category || item.problem_type || 'Другое',
          description: item.description,
          status: item.status,
          priority: item.priority || 'medium',
          address: item.address || 'Адрес не указан',
        }));
      
      console.log('Mapped problems:', mappedProblems);
      setProblems(mappedProblems);
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    return t.status[status as keyof typeof t.status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    return t.priority[priority as keyof typeof t.priority] || priority;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {t.map.title}
            </h1>
            <button
              onClick={fetchProblems}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t.common.tryAgain}</span>
            </button>
          </div>

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
                    center={problems.length > 0 ? [problems[0].lat, problems[0].lng] : [52.2873, 76.9653]}
                    zoom={problems.length > 0 ? 14 : 12}
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
                      {t.map.activeProblems}
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
                        {t.map.tryAgain}
                      </button>
                    </div>
                  ) : problems.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      {t.map.noActiveRequests}
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
                      {t.map.details} #{selectedProblem.id}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-white">
                        <span className="text-text-secondary">{t.map.category}:</span>{" "}
                        {selectedProblem.category}
                      </p>
                      <p className="text-white">
                        <span className="text-text-secondary">{t.map.description}:</span>{" "}
                        {selectedProblem.description}
                      </p>
                      <p className="text-white">
                        <span className="text-text-secondary">{t.map.address}:</span>{" "}
                        {selectedProblem.address}
                      </p>
                      <p className="text-white">
                        <span className="text-text-secondary">{t.map.status}:</span>{" "}
                        {getStatusLabel(selectedProblem.status)}
                      </p>
                      <p className="text-white">
                        <span className="text-text-secondary">{t.map.priority}:</span>{" "}
                        {getPriorityLabel(selectedProblem.priority)}
                      </p>
                      <p className="text-white">
                        <span className="text-text-secondary">{t.map.coordinates}:</span>{" "}
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

      <Footer />
      <ChatBot />
    </div>
  );
}
