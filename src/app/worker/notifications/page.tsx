"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Briefcase, MapPin, Star, AlertTriangle } from "lucide-react";

interface WorkerNotification {
  id: string;
  type: "new_task" | "task_nearby" | "review" | "urgent";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: typeof Bell;
  color: string;
}

const mockNotifications: WorkerNotification[] = [
  {
    id: "1",
    type: "urgent",
    title: "Срочная заявка!",
    message: "Прорыв трубы в жилом доме. Требуется немедленное вмешательство.",
    time: "2 минуты назад",
    read: false,
    icon: AlertTriangle,
    color: "text-red-500",
  },
  {
    id: "2",
    type: "new_task",
    title: "Новая заявка назначена",
    message: "Вам назначена заявка #1245 'Ремонт крана' на ул. Абая, 45",
    time: "30 минут назад",
    read: false,
    icon: Briefcase,
    color: "text-primary",
  },
  {
    id: "3",
    type: "task_nearby",
    title: "Заявка рядом с вами",
    message: "Новая заявка в 500 метрах от вашего местоположения",
    time: "1 час назад",
    read: false,
    icon: MapPin,
    color: "text-accent",
  },
  {
    id: "4",
    type: "review",
    title: "Новый отзыв",
    message: "Клиент оставил отзыв 5★ за выполненную заявку #1240",
    time: "2 часа назад",
    read: true,
    icon: Star,
    color: "text-yellow-500",
  },
  {
    id: "5",
    type: "new_task",
    title: "Заявка выполнена",
    message: "Заявка #1238 успешно завершена. +10 баллов к рейтингу",
    time: "3 часа назад",
    read: true,
    icon: Briefcase,
    color: "text-green-500",
  },
];

export default function WorkerNotificationsPage() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Уведомления
              </h1>
              {unreadCount > 0 && (
                <p className="text-text-secondary mt-2">
                  У вас {unreadCount} новых уведомлений
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <button className="text-primary hover:text-primary-dark text-sm transition-colors">
                Отметить все как прочитанные
              </button>
            )}
          </div>

          <div className="space-y-3">
            {mockNotifications.map((notification) => {
              const Icon = notification.icon;
              const isUrgent = notification.type === "urgent";

              return (
                <Card
                  key={notification.id}
                  className={`glass-card transition-all ${
                    notification.read
                      ? "border-white/10 opacity-75"
                      : isUrgent
                      ? "border-red-500/50 shadow-lg shadow-red-500/20 animate-pulse"
                      : "border-primary/30 shadow-lg shadow-primary/10"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          isUrgent
                            ? "bg-red-500/20"
                            : notification.read
                            ? "bg-card"
                            : "bg-primary/20"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${notification.color}`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h3
                            className={`font-semibold ${
                              notification.read ? "text-text-secondary" : "text-white"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <span className="text-xs text-text-secondary whitespace-nowrap">
                            {notification.time}
                          </span>
                        </div>

                        <p className="text-sm text-text-secondary mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              notification.type === "urgent"
                                ? "border-red-500/50 text-red-500"
                                : notification.type === "new_task"
                                ? "border-primary/50 text-primary"
                                : notification.type === "task_nearby"
                                ? "border-accent/50 text-accent"
                                : notification.type === "review"
                                ? "border-yellow-500/50 text-yellow-500"
                                : "border-white/30 text-text-secondary"
                            }`}
                          >
                            {notification.type === "urgent"
                              ? "Срочно"
                              : notification.type === "new_task"
                              ? "Новая заявка"
                              : notification.type === "task_nearby"
                              ? "Рядом"
                              : notification.type === "review"
                              ? "Отзыв"
                              : "Система"}
                          </Badge>
                          {!notification.read && (
                            <Badge className="text-xs bg-primary text-white">
                              Новое
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}

