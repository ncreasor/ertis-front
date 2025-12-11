// Mock data for testing without backend

export const mockUsers = {
  citizen: {
    id: 1,
    email: "citizen@test.kz",
    username: "citizen_user",
    password: "test123",
    first_name: "Асет",
    last_name: "Нурсултанов",
    middle_name: "Ерболович",
    phone: "+7 (702) 123-45-67",
    role: "citizen" as const,
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
  },
  employee: {
    id: 2,
    email: "employee@test.kz",
    username: "employee_user",
    password: "test123",
    first_name: "Болат",
    last_name: "Сарсенбаев",
    middle_name: "Маратович",
    phone: "+7 (701) 234-56-78",
    role: "employee" as const,
    is_active: true,
    created_at: "2024-01-10T09:00:00Z",
    specialization: "electricity",
  },
  admin: {
    id: 3,
    email: "admin@test.kz",
    username: "admin_user",
    password: "admin123",
    first_name: "Айгуль",
    last_name: "Абдрахманова",
    middle_name: "Серикқызы",
    phone: "+7 (700) 345-67-89",
    role: "admin" as const,
    is_active: true,
    created_at: "2024-01-01T08:00:00Z",
  },
};

export const mockRequests = [
  {
    id: 1,
    user_id: 1,
    category: "electricity",
    problem_type: "no_light",
    description: "Во дворе не работает уличное освещение уже 3 дня. Темно, небезопасно.",
    address: "ул. Торайгырова 64, двор",
    latitude: 52.287054,
    longitude: 76.947239,
    photo_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    status: "in_progress" as const,
    assigned_worker_id: 2,
    ai_analysis: "Обнаружена проблема с уличным освещением. Требуется работа электрика. Приоритет: средний.",
    created_at: "2024-12-09T14:30:00Z",
    updated_at: "2024-12-10T09:15:00Z",
  },
  {
    id: 2,
    user_id: 1,
    category: "roads",
    problem_type: "pothole",
    description: "Большая яма на дороге, опасно для машин",
    address: "пр. Кутузова, возле д. 123",
    latitude: 52.297504,
    longitude: 76.957589,
    photo_url: "https://images.unsplash.com/photo-1625935078363-e862d32a8e28?w=800",
    status: "pending" as const,
    ai_analysis: "Обнаружена яма на дорожном покрытии. Требуется дорожный рабочий. Приоритет: высокий.",
    created_at: "2024-12-10T08:20:00Z",
    updated_at: "2024-12-10T08:20:00Z",
  },
  {
    id: 3,
    user_id: 1,
    category: "garbage",
    problem_type: "overflowing",
    description: "Переполнен мусорный контейнер, мусор разбросан вокруг",
    address: "ул. Ломова 23, корп. 2",
    latitude: 52.283411,
    longitude: 76.965441,
    photo_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800",
    status: "completed" as const,
    assigned_worker_id: 4,
    ai_analysis: "Переполненный контейнер для мусора. Требуется уборщик/дворник. Приоритет: средний.",
    created_at: "2024-12-08T11:45:00Z",
    updated_at: "2024-12-09T16:30:00Z",
    completion_photo_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
  },
  {
    id: 4,
    user_id: 1,
    category: "water",
    problem_type: "leak",
    description: "Протечка воды в подъезде на 3 этаже",
    address: "ул. Академика Сатпаева 28, подъезд 4",
    latitude: 52.278963,
    longitude: 76.971234,
    status: "rejected" as const,
    ai_analysis: "Протечка водопровода. Требуется сантехник. Приоритет: высокий.",
    created_at: "2024-12-07T15:10:00Z",
    updated_at: "2024-12-08T10:00:00Z",
    rejection_reason: "Проблема во внутренней системе здания, обратитесь в управляющую компанию",
  },
  {
    id: 5,
    user_id: 2,
    category: "electricity",
    problem_type: "broken_wire",
    description: "Оборванный провод на столбе",
    address: "пр. Назарбаева 156",
    latitude: 52.289234,
    longitude: 76.953678,
    photo_url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
    status: "assigned" as const,
    assigned_worker_id: 2,
    ai_analysis: "Оборванный электропровод. КРИТИЧЕСКИЙ приоритет! Требуется немедленная работа электрика.",
    created_at: "2024-12-11T07:30:00Z",
    updated_at: "2024-12-11T07:45:00Z",
  },
];

export const mockNotifications = [
  {
    id: 1,
    user_id: 1,
    title: "Заявка принята",
    message: "Ваша заявка #1 принята в обработку. Ожидайте назначения исполнителя.",
    type: "info" as const,
    is_read: true,
    created_at: "2024-12-09T14:30:00Z",
  },
  {
    id: 2,
    user_id: 1,
    title: "Назначен исполнитель",
    message: "Ваша заявка #1 назначена исполнителю: Болат С. (электрик)",
    type: "success" as const,
    is_read: true,
    created_at: "2024-12-10T09:15:00Z",
  },
  {
    id: 3,
    user_id: 1,
    title: "Работа завершена",
    message: "Заявка #3 выполнена. Пожалуйста, оцените работу исполнителя.",
    type: "success" as const,
    is_read: false,
    created_at: "2024-12-09T16:30:00Z",
  },
  {
    id: 4,
    user_id: 1,
    title: "Заявка отклонена",
    message: "Заявка #4 отклонена. Причина: проблема во внутренней системе здания.",
    type: "warning" as const,
    is_read: false,
    created_at: "2024-12-08T10:00:00Z",
  },
  {
    id: 5,
    user_id: 1,
    title: "Новая заявка создана",
    message: "Ваша заявка #2 успешно создана и ожидает обработки.",
    type: "info" as const,
    is_read: false,
    created_at: "2024-12-10T08:20:00Z",
  },
];

export const mockWorkerTasks = [
  {
    id: 1,
    user_id: 1,
    category: "electricity",
    problem_type: "no_light",
    description: "Во дворе не работает уличное освещение уже 3 дня. Темно, небезопасно.",
    address: "ул. Торайгырова 64, двор",
    latitude: 52.287054,
    longitude: 76.947239,
    photo_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    status: "in_progress" as const,
    assigned_worker_id: 2,
    created_at: "2024-12-09T14:30:00Z",
    updated_at: "2024-12-10T09:15:00Z",
    distance: 1.2,
  },
  {
    id: 5,
    user_id: 2,
    category: "electricity",
    problem_type: "broken_wire",
    description: "Оборванный провод на столбе",
    address: "пр. Назарбаева 156",
    latitude: 52.289234,
    longitude: 76.953678,
    photo_url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
    status: "assigned" as const,
    assigned_worker_id: 2,
    created_at: "2024-12-11T07:30:00Z",
    updated_at: "2024-12-11T07:45:00Z",
    distance: 0.8,
  },
];

export const mockStats = {
  total_completed: 127,
  total_in_progress: 3,
  total_assigned: 5,
  rating: 4.8,
  reviews_count: 89,
  completion_rate: 96.2,
  avg_completion_time: "4.2 часа",
  this_month: {
    completed: 18,
    in_progress: 3,
    earnings: 145000,
  },
  recent_completions: [
    {
      date: "2024-12-09",
      count: 3,
      category: "electricity",
    },
    {
      date: "2024-12-08",
      count: 2,
      category: "electricity",
    },
    {
      date: "2024-12-07",
      count: 4,
      category: "electricity",
    },
  ],
};

// Helper function to simulate API delay
export const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication
export const mockLogin = async (email: string, password: string) => {
  await mockDelay(800);
  
  const user = Object.values(mockUsers).find(
    u => u.email === email && u.password === password
  );
  
  if (!user) {
    throw new Error("Неверный email или пароль");
  }
  
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    access_token: `mock_token_${user.id}_${Date.now()}`,
    token_type: "Bearer",
    user: userWithoutPassword,
  };
};

// Mock registration
export const mockRegister = async (data: any) => {
  await mockDelay(1000);
  
  const newUser = {
    id: Math.floor(Math.random() * 10000),
    ...data,
    role: "citizen" as const,
    is_active: true,
    created_at: new Date().toISOString(),
  };
  
  const { password: _, ...userWithoutPassword } = newUser;
  
  return {
    access_token: `mock_token_${newUser.id}_${Date.now()}`,
    token_type: "Bearer",
    user: userWithoutPassword,
  };
};

// Mock create request
export const mockCreateRequest = async (data: any) => {
  await mockDelay(1200);
  
  const newRequest = {
    id: Math.floor(Math.random() * 10000),
    user_id: 1,
    ...data,
    status: "pending" as const,
    ai_analysis: "Запрос обработан искусственным интеллектом. Категоризация выполнена.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  return newRequest;
};

export default {
  mockUsers,
  mockRequests,
  mockNotifications,
  mockWorkerTasks,
  mockStats,
  mockLogin,
  mockRegister,
  mockCreateRequest,
};

