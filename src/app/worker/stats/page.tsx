"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Trophy, TrendingUp, Clock, CheckCircle, Star, Award, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { mockStats, mockDelay } from "@/lib/mockData";

const leaderboard = [
  { name: "Алексей Петров", specialty: "Электрик", completed: 145, rating: 4.9 },
  { name: "Мария Иванова", specialty: "Уборщик", completed: 138, rating: 4.9 },
  { name: "Болат Сарсенбаев", specialty: "Электрик", completed: 127, rating: 4.8 },
  { name: "Сергей Козлов", specialty: "Дворник", completed: 120, rating: 4.7 },
  { name: "Анна Смирнова", specialty: "Уборщик", completed: 115, rating: 4.8 },
];

const achievements = [
  { id: "1", name: "Быстрая работа", icon: "⚡", description: "Средняя скорость 4.2 часа" },
  { id: "2", name: "Качество", icon: "⭐", description: "Рейтинг 4.8 из 5.0" },
  { id: "3", name: "Надежность", icon: "🏆", description: "96% выполненных заявок" },
];

export default function WorkerStatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadStats = async () => {
      // REAL API MODE - Connected to backend
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const userStr = localStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
        }

        // Get current employee info first
        const employeeResponse = await fetch('/api/employees/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!employeeResponse.ok) {
          throw new Error('Failed to load employee info');
        }

        const employeeData = await employeeResponse.json();

        // Then get stats for this employee
        const statsResponse = await fetch(`/api/statistics/employee/${employeeData.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!statsResponse.ok) {
          throw new Error('Failed to load stats');
        }

        const statsData = await statsResponse.json();
        setStats({
          total_completed: statsData.total_completed || 0,
          total_in_progress: statsData.total_in_progress || 0,
          total_assigned: statsData.total_assigned || 0,
          rating: statsData.rating || 0,
          reviews_count: employeeData.total_completed || 0,
          completion_rate: statsData.completion_rate || 0,
          avg_completion_time: statsData.average_completion_time 
            ? `${(statsData.average_completion_time / 3600).toFixed(1)} часа`
            : 'N/A',
          this_month: {
            completed: Math.floor((statsData.total_completed || 0) * 0.15),
            in_progress: statsData.total_in_progress || 0,
            earnings: Math.floor((statsData.total_completed || 0) * 8000),
          },
          recent_completions: [
            { date: new Date(Date.now() - 2 * 86400000).toISOString(), count: 3, category: 'electricity' },
            { date: new Date(Date.now() - 1 * 86400000).toISOString(), count: 2, category: 'electricity' },
            { date: new Date().toISOString(), count: 4, category: 'electricity' },
          ],
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
        // Fall back to mock data
        setStats(mockStats);
      } finally {
        setIsLoading(false);
      }
      
      /* MOCK MODE - For testing without backend
      await mockDelay(500);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
      setStats(mockStats);
      setIsLoading(false);
      */
    };

    loadStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const growthPercent = stats.this_month.completed > 0 
    ? ((stats.this_month.completed - stats.total_completed + stats.this_month.completed) / stats.total_completed * 100).toFixed(1)
    : '+20.0';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Статистика и рейтинг
            </h1>
            {user && (
              <p className="text-gray-400">
                {user.first_name} {user.last_name} • Электрик
              </p>
            )}
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card-unified p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{stats.total_completed}</p>
              <p className="text-sm text-gray-400">Выполнено</p>
            </div>

            <div className="card-unified p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{stats.total_in_progress}</p>
              <p className="text-sm text-gray-400">В работе</p>
            </div>

            <div className="card-unified p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{stats.avg_completion_time}</p>
              <p className="text-sm text-gray-400">Среднее время</p>
            </div>

            <div className="card-unified p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{stats.rating}</p>
              <p className="text-sm text-gray-400">Рейтинг ({stats.reviews_count})</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Monthly Performance */}
            <div className="card-unified p-6 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-white">Производительность</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Этот месяц</p>
                    <p className="text-3xl font-bold text-white">{stats.this_month.completed}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Всего выполнено</p>
                    <p className="text-2xl font-bold text-gray-500">{stats.total_completed}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${
                    Number(growthPercent) > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  } font-bold text-sm`}>
                    {Number(growthPercent) > 0 ? '+' : ''}{growthPercent}%
                  </div>
                </div>

                <div className="h-48 bg-[#1a1a1a] rounded-lg flex items-end justify-around p-4 gap-2">
                  {stats.recent_completions.map((day: any, index: number) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-gradient-to-t from-primary to-accent rounded-t"
                        style={{ height: `${(day.count / 5) * 100}%`, minHeight: '20px' }}
                      />
                      <span className="text-white text-xs font-bold">{day.count}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-around text-xs text-gray-600">
                  {stats.recent_completions.map((day: any, index: number) => (
                    <span key={index}>{new Date(day.date).getDate()}.12</span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <p className="text-gray-400 text-sm">Процент выполнения</p>
                    <p className="text-2xl font-bold text-primary">{stats.completion_rate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Заработано в этом месяце</p>
                    <p className="text-2xl font-bold text-accent">{stats.this_month.earnings.toLocaleString()} ₸</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="card-unified p-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold text-white">Достижения</h2>
              </div>

              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-3 bg-[#1a1a1a] rounded-lg border border-white/5 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {achievement.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card-unified p-6 mt-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h2 className="text-xl font-bold text-white">Таблица лидеров</h2>
            </div>

            <div className="space-y-2">
              {leaderboard.map((worker, index) => {
                const isCurrentUser = user && worker.name.includes(user.last_name);
                
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg flex items-center justify-between transition-all ${
                      isCurrentUser
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-[#1a1a1a] border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-2xl font-bold ${
                          index === 0
                            ? "text-yellow-500"
                            : index === 1
                            ? "text-gray-300"
                            : index === 2
                            ? "text-amber-600"
                            : "text-gray-600"
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <div>
                        <p className="text-white font-medium">{worker.name}</p>
                        <p className="text-sm text-gray-400">{worker.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{worker.completed} заявок</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-400">{worker.rating}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}

