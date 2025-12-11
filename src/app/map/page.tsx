"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { YandexMap } from "@/components/YandexMap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Droplet, Construction } from "lucide-react";
import { useState } from "react";

interface Problem {
  id: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  icon: typeof Zap;
  count: number;
}

const mockProblems: Problem[] = [
  {
    id: "1",
    lat: 52.2954,
    lng: 76.9573,
    category: "Электричество",
    description: "Не работают фонари",
    status: "pending",
    icon: Zap,
    count: 5,
  },
  {
    id: "2",
    lat: 52.2870,
    lng: 76.9650,
    category: "Водопровод",
    description: "Протечки труб",
    status: "in_progress",
    icon: Droplet,
    count: 3,
  },
  {
    id: "3",
    lat: 52.3000,
    lng: 76.9500,
    category: "Дороги",
    description: "Ямы на дорогах",
    status: "pending",
    icon: Construction,
    count: 8,
  },
];

export default function MapPage() {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

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
                    markers={mockProblems.map(problem => ({
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
                  <h2 className="text-xl font-bold text-white mb-4">
                    Активные проблемы
                  </h2>
                  <div className="space-y-3">
                    {mockProblems.map((problem) => {
                      const Icon = problem.icon;
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
                                  : problem.status === "in_progress"
                                  ? "bg-primary/20"
                                  : "bg-green-500/20"
                              }`}
                            >
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium text-sm">
                                {problem.category}
                              </p>
                              <p className="text-text-secondary text-xs">
                                {problem.description}
                              </p>
                              <Badge
                                className={`mt-2 text-xs ${
                                  problem.status === "pending"
                                    ? "bg-yellow-500"
                                    : problem.status === "in_progress"
                                    ? "bg-primary"
                                    : "bg-green-500"
                                }`}
                              >
                                {problem.count} заявок
                              </Badge>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {selectedProblem && (
                <Card className="glass-card border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-primary mb-4">
                      Детали проблемы
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
                        <span className="text-text-secondary">Количество:</span>{" "}
                        {selectedProblem.count} заявок
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

