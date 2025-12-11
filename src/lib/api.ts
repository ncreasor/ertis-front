// API Configuration for Ertis Service Backend
// Docs: https://ertis-servise-ertis-service.up.railway.app/api/docs

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ertis-servise-ertis-service.up.railway.app/api/v1';

// Types
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone: string;
  role: 'citizen' | 'worker' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Request {
  id: number;
  user_id: number;
  category: string;
  problem_type: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  photo_url?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'rejected';
  assigned_worker_id?: number;
  ai_analysis?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRequestData {
  category: string;
  problem_type: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  photo?: File;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
}

// API Client
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Ошибка сервера' }));
      throw new Error(error.detail || `HTTP Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(response.access_token);
    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  // Requests endpoints
  async getRequests(): Promise<Request[]> {
    return this.request<Request[]>('/requests');
  }

  async getMyRequests(): Promise<Request[]> {
    return this.request<Request[]>('/requests/my');
  }

  async getRequest(id: number): Promise<Request> {
    return this.request<Request>(`/requests/${id}`);
  }

  async createRequest(data: CreateRequestData): Promise<Request> {
    const formData = new FormData();
    formData.append('category', data.category);
    formData.append('problem_type', data.problem_type);
    formData.append('description', data.description);
    formData.append('address', data.address);
    if (data.latitude) formData.append('latitude', data.latitude.toString());
    if (data.longitude) formData.append('longitude', data.longitude.toString());
    if (data.photo) formData.append('photo', data.photo);

    const response = await fetch(`${this.baseUrl}/requests`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Ошибка сервера' }));
      throw new Error(error.detail || 'Ошибка создания заявки');
    }

    return response.json();
  }

  // Notifications endpoints
  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('/notifications');
  }

  async markNotificationRead(id: number): Promise<void> {
    await this.request(`/notifications/${id}/read`, { method: 'PUT' });
  }

  // Employee/Worker endpoints
  async getAssignedTasks(): Promise<Request[]> {
    return this.request<Request[]>('/requests/assigned');
  }

  async getCurrentEmployee(): Promise<any> {
    return this.request<any>('/employees/me');
  }

  async getEmployeeStats(employeeId: number): Promise<any> {
    return this.request<any>(`/statistics/employee/${employeeId}`);
  }

  async completeRequest(
    id: number,
    completionPhoto?: File,
    completionNote?: string
  ): Promise<Request> {
    const formData = new FormData();
    if (completionNote) formData.append('completion_note', completionNote);
    if (completionPhoto) formData.append('completion_photo', completionPhoto);

    const response = await fetch(`${this.baseUrl}/requests/${id}/complete`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Ошибка сервера' }));
      throw new Error(error.detail || 'Ошибка завершения задачи');
    }

    return response.json();
  }

  async assignRequest(requestId: number, employeeId: number): Promise<Request> {
    return this.request<Request>(`/requests/${requestId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ employee_id: employeeId }),
    });
  }

  async closeRequest(requestId: number, reason?: string): Promise<Request> {
    return this.request<Request>(`/requests/${requestId}/close`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  }

  async rateRequest(requestId: number, rating: number, comment?: string): Promise<void> {
    await this.request(`/requests/${requestId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  }

  // Categories
  async getCategories(): Promise<any[]> {
    return this.request<any[]>('/categories');
  }

  // Statistics
  async getStatisticsOverview(): Promise<any> {
    return this.request<any>('/statistics/overview');
  }

  async getRequestsByPriority(): Promise<any> {
    return this.request<any>('/statistics/requests/priority');
  }

  // Addresses
  async suggestAddresses(query: string): Promise<any[]> {
    return this.request<any[]>(`/addresses/suggest?query=${encodeURIComponent(query)}`);
  }

  async geocodeAddress(address: string): Promise<any> {
    return this.request<any>(`/addresses/geocode?address=${encodeURIComponent(address)}`);
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;

