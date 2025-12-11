"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { useState } from "react";

interface Task {
  id: string;
  category: string;
  description: string;
  address: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  photo?: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    category: "Водопровод",
    description: "Прорыв трубы на улице Ленина 45",
    address: "ул. Ленина, 45",
    status: "pending",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    category: "Электричество",
    description: "Не горит фонарь возле дома",
    address: "ул. Абая, 12",
    status: "in_progress",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    category: "Дороги",
    description: "Большая яма на перекрестке",
    address: "пр. Назарбаева / ул. Толстого",
    status: "completed",
    createdAt: "2024-01-13",
  },
];

const statusLabels = {
  pending: "Ожидает",
  in_progress: "В работе",
  completed: "Выполнено",
};

const statusColors = {
  pending: "bg-yellow-500",
  in_progress: "bg-primary",
  completed: "bg-green-500",
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filter, setFilter] = useState<"all" | Task["status"]>("all");

  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter((t) => t.status === filter);

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks(tasks.map((t) => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />

      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Мои задачи</h1>

          <div className="flex gap-2 mb-6 flex-wrap">
            {(["all", "pending", "in_progress", "completed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === status
                    ? "bg-primary text-white"
                    : "bg-card text-text-secondary hover:bg-card-light"
                }`}
              >
                {status === "all" ? "Все" : statusLabels[status]}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="glass-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-primary font-medium">{task.category}</span>
                      <span className={`${statusColors[task.status]} text-white text-xs px-2 py-1 rounded-full`}>
                        {statusLabels[task.status]}
                      </span>
                    </div>
                    <p className="text-white mb-2">{task.description}</p>
                    <p className="text-text-secondary text-sm">{task.address}</p>
                    <p className="text-text-secondary text-xs mt-2">
                      Создано: {task.createdAt}
                    </p>
                  </div>

                  {task.status !== "completed" && (
                    <div className="flex flex-col gap-2">
                      {task.status === "pending" && (
                        <button
                          onClick={() => handleStatusChange(task.id, "in_progress")}
                          className="bg-primary hover:bg-primary-dark text-white text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                          Взять в работу
                        </button>
                      )}
                      {task.status === "in_progress" && (
                        <button
                          onClick={() => handleStatusChange(task.id, "completed")}
                          className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                        >
                          Завершить
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="glass-card p-8 text-center">
                <p className="text-text-secondary">Нет задач</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}

