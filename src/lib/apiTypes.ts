// API Types based on backend Swagger documentation
// https://ertis-servise-ertis-service.up.railway.app/api/docs

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  phone: string;
  role: 'citizen' | 'employee' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  phone: string;
}

export interface LoginRequest {
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
  category_id?: number | null;
  title: string;
  description: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  photo_url?: string | null;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assigned_employee_id?: number | null;
  ai_category?: string | null;
  ai_description?: string | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  completion_photo_url?: string | null;
  completion_note?: string | null;
}

export interface CreateRequestRequest {
  title: string;
  description: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  photo?: File;
  category_id?: number | null;
}

export interface Employee {
  id: number;
  user_id: number;
  specialization: string;
  is_available: boolean;
  photo_url?: string | null;
  rating?: number | null;
  total_completed?: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatisticsOverview {
  total_requests: number;
  pending_requests: number;
  assigned_requests: number;
  in_progress_requests: number;
  completed_requests: number;
  closed_requests: number;
  total_employees: number;
  available_employees: number;
  total_users: number;
}

export interface EmployeeStatistics {
  employee_id: number;
  total_assigned: number;
  total_completed: number;
  total_in_progress: number;
  average_completion_time?: number | null;
  rating?: number | null;
  completion_rate?: number | null;
}

export interface RequestsByPriority {
  high: number;
  medium: number;
  low: number;
}

export interface AddressSuggestion {
  value: string;
  unrestricted_value: string;
  data: {
    postal_code?: string;
    country?: string;
    region?: string;
    city?: string;
    street?: string;
    house?: string;
  };
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  address: string;
}

