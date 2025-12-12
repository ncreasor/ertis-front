"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Users, FileText, TrendingUp, Clock, CheckCircle, 
  AlertCircle, Loader2, UserPlus, Shield
} from "lucide-react";

interface Request {
  id: number;
  description: string;
  address: string;
  status: string;
  priority: string;
  ai_category?: string;
  assignee_id?: number;
  created_at: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  specialty?: { name: string };
  average_rating: number;
}

interface Stats {
  total_requests: number;
  pending_requests: number;
  in_progress_requests: number;
  completed_requests: number;
  total_employees: number;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [assigningEmployee, setAssigningEmployee] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
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
        if (userData.role !== 'admin') {
          window.location.href = '/dashboard';
          return;
        }
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';

      // Load all data in parallel
      const [requestsRes, employeesRes, statsRes] = await Promise.all([
        fetch(`${apiUrl}/requests`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/employees`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${apiUrl}/statistics/overview`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (requestsRes.ok) {
        setRequests(await requestsRes.json());
      }
      if (employeesRes.ok) {
        setEmployees(await employeesRes.json());
      }
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const assignEmployee = async (requestId: number, employeeId: number) => {
    setAssigningEmployee(employeeId);
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';

      await fetch(`${apiUrl}/requests/${requestId}/assign`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employee_id: employeeId })
      });

      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: 'assigned', assignee_id: employeeId } : r
      ));
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setAssigningEmployee(null);
    }
  };

  const promoteToEmployee = async (userId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';

      await fetch(`${apiUrl}/users/${userId}/promote`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      loadData();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "Ожидает", color: "bg-yellow-500" },
    assigned: { label: "Назначена", color: "bg-orange-500" },
    in_progress: { label: "В работе", color: "bg-blue-500" },
    completed: { label: "Выполнена", color: "bg-green-500" },
    closed: { label: "Закрыта", color: "bg-gray-500" },
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Панель администратора
              </h1>
              <p className="text-gray-400">Управление заявками и сотрудниками</p>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bento-item p-4 text-center">
                <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stats.total_requests}</p>
                <p className="text-gray-500 text-xs">Всего заявок</p>
              </div>
              <div className="bento-item p-4 text-center">
                <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-500">{stats.pending_requests}</p>
                <p className="text-gray-500 text-xs">Ожидают</p>
              </div>
              <div className="bento-item p-4 text-center">
                <AlertCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-500">{stats.in_progress_requests}</p>
                <p className="text-gray-500 text-xs">В работе</p>
              </div>
              <div className="bento-item p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-500">{stats.completed_requests}</p>
                <p className="text-gray-500 text-xs">Выполнено</p>
              </div>
              <div className="bento-item p-4 text-center">
                <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-accent">{stats.total_employees}</p>
                <p className="text-gray-500 text-xs">Сотрудников</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Pending Requests */}
            <div className="lg:col-span-2 bento-item p-6">
              <h2 className="text-xl font-bold text-white mb-6">Ожидающие заявки</h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : requests.filter(r => r.status === 'pending').length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-400">Нет ожидающих заявок</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {requests.filter(r => r.status === 'pending').map((request) => (
                    <div 
                      key={request.id}
                      className={`p-4 bg-white/5 rounded-xl border transition-all cursor-pointer ${
                        selectedRequest === request.id 
                          ? 'border-primary' 
                          : 'border-white/5 hover:border-white/10'
                      }`}
                      onClick={() => setSelectedRequest(
                        selectedRequest === request.id ? null : request.id
                      )}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">
                              {request.ai_category || 'Заявка'}
                            </span>
                            <span className="text-gray-600 text-sm">#{request.id}</span>
                          </div>
                          <p className="text-gray-400 text-sm truncate">{request.description}</p>
                          <p className="text-gray-600 text-xs mt-1">📍 {request.address}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          request.priority === 'high' ? 'bg-red-500' :
                          request.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                        } text-white`}>
                          {request.priority === 'high' ? 'Высокий' :
                           request.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </span>
                      </div>

                      {/* Assign Employee Panel */}
                      {selectedRequest === request.id && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-sm text-gray-400 mb-3">Назначить сотрудника:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {employees.slice(0, 4).map((employee) => (
                              <button
                                key={employee.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  assignEmployee(request.id, employee.id);
                                }}
                                disabled={assigningEmployee === employee.id}
                                className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-primary/20 transition-colors text-left disabled:opacity-50"
                              >
                                {assigningEmployee === employee.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <span className="text-primary text-xs font-bold">
                                      {employee.first_name[0]}{employee.last_name[0]}
                                    </span>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm truncate">
                                    {employee.first_name} {employee.last_name}
                                  </p>
                                  <p className="text-gray-500 text-xs">
                                    ⭐ {employee.average_rating?.toFixed(1) || '0.0'}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Employees */}
            <div className="bento-item p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Сотрудники</h2>
                <span className="text-primary text-sm">{employees.length}</span>
              </div>

              {employees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Нет сотрудников</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {employees.map((employee) => (
                    <div 
                      key={employee.id}
                      className="p-3 bg-white/5 rounded-lg flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                        <span className="text-white text-sm font-bold">
                          {employee.first_name[0]}{employee.last_name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {employee.first_name} {employee.last_name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {employee.specialty?.name || 'Специалист'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-500 text-sm font-bold">
                          ⭐ {employee.average_rating?.toFixed(1) || '0.0'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* All Requests Table */}
          <div className="bento-item p-6 mt-6">
            <h2 className="text-xl font-bold text-white mb-6">Все заявки</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">ID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Категория</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Адрес</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Статус</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Приоритет</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.slice(0, 10).map((request) => {
                    const status = statusConfig[request.status] || statusConfig.pending;
                    return (
                      <tr key={request.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-gray-400">#{request.id}</td>
                        <td className="py-3 px-4 text-white">{request.ai_category || 'N/A'}</td>
                        <td className="py-3 px-4 text-gray-400 max-w-[200px] truncate">{request.address}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded ${status.color} text-white`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-sm ${
                            request.priority === 'high' ? 'text-red-400' :
                            request.priority === 'medium' ? 'text-yellow-400' : 'text-gray-400'
                          }`}>
                            {request.priority === 'high' ? 'Высокий' :
                             request.priority === 'medium' ? 'Средний' : 'Низкий'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}

