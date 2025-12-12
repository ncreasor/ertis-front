"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Users, FileText, Clock, CheckCircle, 
  AlertCircle, Loader2, UserPlus, Shield, X, Trash2,
  Play, RotateCcw, MoreVertical, Eye
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
  photo_url?: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  specialty?: { name: string };
  average_rating: number;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
}

interface Stats {
  total_requests: number;
  pending_requests: number;
  in_progress_requests: number;
  completed_requests: number;
  total_employees: number;
}

const API_BASE = 'https://ertis-servise-ertis-service.up.railway.app/api/v1';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<Request[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [citizens, setCitizens] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [assigningEmployee, setAssigningEmployee] = useState<number | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [promotingUser, setPromotingUser] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [viewRequest, setViewRequest] = useState<Request | null>(null);

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

      const [requestsRes, employeesRes, statsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/requests`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/employees`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/statistics/overview`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/users`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (requestsRes.ok) setRequests(await requestsRes.json());
      if (employeesRes.ok) setEmployees(await employeesRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) {
        const allUsers = await usersRes.json();
        setCitizens(allUsers.filter((u: User) => u.role === 'citizen'));
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
      const response = await fetch(`${API_BASE}/requests/${requestId}/assign`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: employeeId })
      });
      
      if (response.ok) {
        // Перезагружаем данные с сервера для синхронизации
        await loadData();
      }
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setAssigningEmployee(null);
    }
  };

  const changeStatus = async (requestId: number, newStatus: string) => {
    setActionLoading(requestId);
    try {
      const token = localStorage.getItem('access_token');
      let response;
      
      if (newStatus === 'in_progress') {
        response = await fetch(`${API_BASE}/requests/${requestId}/start`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else if (newStatus === 'completed') {
        // Используем новый endpoint для смены статуса
        response = await fetch(`${API_BASE}/requests/${requestId}/status?new_status=completed`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else if (newStatus === 'closed') {
        response = await fetch(`${API_BASE}/requests/${requestId}/status?new_status=closed`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else if (newStatus === 'pending') {
        response = await fetch(`${API_BASE}/requests/${requestId}/status?new_status=pending`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      
      // Перезагружаем данные с сервера для синхронизации
      await loadData();
      setActionMenuId(null);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteRequest = async (requestId: number) => {
    if (!confirm('Вы уверены что хотите удалить эту заявку?')) return;
    
    setActionLoading(requestId);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/requests/${requestId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        // Перезагружаем данные с сервера для синхронизации
        await loadData();
      }
      setActionMenuId(null);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const promoteToEmployee = async (userId: number) => {
    setPromotingUser(userId);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE}/users/${userId}/role?new_role=employee`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setCitizens(prev => prev.filter(c => c.id !== userId));
        setShowAddEmployee(false);
        loadData();
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setPromotingUser(null);
    }
  };

  const getStatusActions = (status: string) => {
    switch (status) {
      case 'pending':
        return [
          { label: 'Начать работу', status: 'in_progress', icon: Play },
          { label: 'Закрыть', status: 'closed', icon: X },
        ];
      case 'assigned':
        return [
          { label: 'Начать работу', status: 'in_progress', icon: Play },
          { label: 'Вернуть в ожидание', status: 'pending', icon: RotateCcw },
          { label: 'Закрыть', status: 'closed', icon: X },
        ];
      case 'in_progress':
        return [
          { label: 'Завершить', status: 'completed', icon: CheckCircle },
          { label: 'Закрыть', status: 'closed', icon: X },
        ];
      case 'completed':
        return [
          { label: 'Вернуть в работу', status: 'in_progress', icon: RotateCcw },
        ];
      default:
        return [
          { label: 'Вернуть в ожидание', status: 'pending', icon: RotateCcw },
        ];
    }
  };

  if (!mounted) return null;

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const displayRequests = activeTab === 'pending' ? pendingRequests : requests;

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
              <h1 className="text-2xl md:text-3xl font-bold text-white">{t.admin.title}</h1>
              <p className="text-gray-400">{t.admin.overview}</p>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bento-item p-4 text-center">
                <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stats.total_requests}</p>
                <p className="text-gray-500 text-xs">{t.admin.totalRequests}</p>
              </div>
              <div className="bento-item p-4 text-center">
                <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-500">{stats.pending_requests}</p>
                <p className="text-gray-500 text-xs">{t.admin.pendingRequests}</p>
              </div>
              <div className="bento-item p-4 text-center">
                <AlertCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-500">{stats.in_progress_requests}</p>
                <p className="text-gray-500 text-xs">{t.admin.inProgress}</p>
              </div>
              <div className="bento-item p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-500">{stats.completed_requests}</p>
                <p className="text-gray-500 text-xs">{t.admin.completed}</p>
              </div>
              <div className="bento-item p-4 text-center">
                <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-accent">{stats.total_employees}</p>
                <p className="text-gray-500 text-xs">{t.admin.employees}</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Requests Panel */}
            <div className="lg:col-span-2 bento-item p-6">
              {/* Tabs */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'pending' 
                        ? 'bg-primary text-black' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {t.admin.pendingRequests} ({pendingRequests.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'all' 
                        ? 'bg-primary text-black' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {t.admin.requests} ({requests.length})
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : displayRequests.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-400">{t.worker.noTasks}</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {displayRequests.map((request) => (
                    <div 
                      key={request.id}
                      className={`p-4 bg-white/5 rounded-xl border transition-all ${
                        selectedRequest === request.id 
                          ? 'border-primary' 
                          : 'border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                        >
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-white font-medium">
                              {request.ai_category || t.admin.requests}
                            </span>
                            <span className="text-gray-600 text-sm">#{request.id}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              request.status === 'pending' ? 'bg-yellow-500' :
                              request.status === 'assigned' ? 'bg-orange-500' :
                              request.status === 'in_progress' ? 'bg-blue-500' :
                              request.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                            } text-white`}>
                              {t.status[request.status as keyof typeof t.status] || request.status}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm truncate">{request.description}</p>
                          <p className="text-gray-600 text-xs mt-1">📍 {request.address}</p>
                        </div>
                        
                        {/* Actions Menu */}
                        <div className="relative">
                          <button
                            onClick={() => setActionMenuId(actionMenuId === request.id ? null : request.id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {actionLoading === request.id ? (
                              <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            ) : (
                              <MoreVertical className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          
                          {actionMenuId === request.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setActionMenuId(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                <button
                                  onClick={() => setViewRequest(request)}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:bg-white/5 transition-colors text-left"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span className="text-sm">Просмотр</span>
                                </button>
                                
                                {getStatusActions(request.status).map((action) => {
                                  const Icon = action.icon;
                                  return (
                                    <button
                                      key={action.status}
                                      onClick={() => changeStatus(request.id, action.status)}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:bg-white/5 transition-colors text-left"
                                    >
                                      <Icon className="w-4 h-4" />
                                      <span className="text-sm">{action.label}</span>
                                    </button>
                                  );
                                })}
                                
                                <div className="border-t border-white/5">
                                  <button
                                    onClick={() => deleteRequest(request.id)}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-left"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm">Удалить</span>
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Assign Employee Panel */}
                      {selectedRequest === request.id && request.status === 'pending' && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-sm text-gray-400 mb-3">{t.admin.assignEmployee}:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {employees.slice(0, 6).map((employee) => (
                              <button
                                key={employee.id}
                                onClick={() => assignEmployee(request.id, employee.id)}
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

            {/* Employees Panel */}
            <div className="bento-item p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{t.admin.employees}</h2>
                <button
                  onClick={() => setShowAddEmployee(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  {t.admin.addEmployee}
                </button>
              </div>

              {employees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">{t.worker.noTasks}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
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
                          {employee.specialty?.name || t.admin.employee}
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
        </div>
      </main>

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAddEmployee(false)} />
          <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{t.admin.addEmployee}</h3>
              <button onClick={() => setShowAddEmployee(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-4">{t.admin.selectCitizen}:</p>

            {citizens.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t.worker.noTasks}</p>
            ) : (
              <div className="space-y-2">
                {citizens.map((citizen) => (
                  <div key={citizen.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {citizen.first_name[0]}{citizen.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{citizen.first_name} {citizen.last_name}</p>
                        <p className="text-gray-500 text-xs">@{citizen.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => promoteToEmployee(citizen.id)}
                      disabled={promotingUser === citizen.id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors text-sm disabled:opacity-50"
                    >
                      {promotingUser === citizen.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          {t.admin.makeEmployee}
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Request Modal */}
      {viewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewRequest(null)} />
          <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {t.map.details} #{viewRequest.id}
              </h3>
              <button onClick={() => setViewRequest(null)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-xs mb-1">{t.map.category}</p>
                <p className="text-white">{viewRequest.ai_category || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">{t.map.description}</p>
                <p className="text-white">{viewRequest.description}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">{t.map.address}</p>
                <p className="text-white">{viewRequest.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">{t.map.status}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    viewRequest.status === 'pending' ? 'bg-yellow-500' :
                    viewRequest.status === 'assigned' ? 'bg-orange-500' :
                    viewRequest.status === 'in_progress' ? 'bg-blue-500' :
                    viewRequest.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'
                  } text-white`}>
                    {t.status[viewRequest.status as keyof typeof t.status] || viewRequest.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">{t.map.priority}</p>
                  <span className={`text-sm ${
                    viewRequest.priority === 'high' ? 'text-red-400' :
                    viewRequest.priority === 'medium' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {t.priority[viewRequest.priority as keyof typeof t.priority] || viewRequest.priority}
                  </span>
                </div>
              </div>
              {viewRequest.photo_url && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Фото</p>
                  <img 
                    src={viewRequest.photo_url.startsWith('http') ? viewRequest.photo_url : `https://ertis-servise-ertis-service.up.railway.app${viewRequest.photo_url}`}
                    alt="Photo"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              {getStatusActions(viewRequest.status).map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.status}
                    onClick={() => {
                      changeStatus(viewRequest.id, action.status);
                      setViewRequest(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ChatBot />
    </div>
  );
}
