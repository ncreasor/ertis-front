"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { useState } from "react";
import { Camera, ChevronRight, Send, ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { Zap, Droplet, Construction, Trash2, Sparkles, TreeDeciduous } from "lucide-react";

interface Problem {
  id: string;
  label: string;
}

const categories: Record<string, { name: string; icon: typeof Zap; color: string; problems: Problem[] }> = {
  electricity: {
    name: "Электричество",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    problems: [
      { id: "no_light", label: "Не работает освещение" },
      { id: "broken_wire", label: "Оборванный провод" },
      { id: "broken_switch", label: "Сломанный выключатель" },
      { id: "short_circuit", label: "Короткое замыкание" },
      { id: "no_power", label: "Отсутствует электричество" },
      { id: "damaged_pole", label: "Поврежденный столб" },
    ],
  },
  water: {
    name: "Водопровод",
    icon: Droplet,
    color: "from-blue-500 to-cyan-500",
    problems: [
      { id: "no_water", label: "Нет воды" },
      { id: "leak", label: "Протечка" },
      { id: "broken_pipe", label: "Прорыв трубы" },
      { id: "dirty_water", label: "Грязная вода" },
      { id: "low_pressure", label: "Низкое давление" },
    ],
  },
  roads: {
    name: "Дороги",
    icon: Construction,
    color: "from-gray-500 to-slate-600",
    problems: [
      { id: "pothole", label: "Яма на дороге" },
      { id: "crack", label: "Трещина в покрытии" },
      { id: "no_signs", label: "Отсутствуют знаки" },
      { id: "broken_curb", label: "Разрушенный бордюр" },
    ],
  },
  garbage: {
    name: "Мусор",
    icon: Trash2,
    color: "from-green-500 to-emerald-600",
    problems: [
      { id: "overflowing", label: "Переполненный контейнер" },
      { id: "no_collection", label: "Не вывозят мусор" },
      { id: "illegal_dump", label: "Стихийная свалка" },
      { id: "broken_bin", label: "Сломанный контейнер" },
    ],
  },
  cleaning: {
    name: "Уборка",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    problems: [
      { id: "no_cleaning", label: "Не убирают территорию" },
      { id: "dirty_yard", label: "Грязный двор" },
      { id: "snow", label: "Не убирают снег" },
      { id: "ice", label: "Наледь на тротуаре" },
    ],
  },
  landscaping: {
    name: "Благоустройство",
    icon: TreeDeciduous,
    color: "from-emerald-500 to-teal-500",
    problems: [
      { id: "broken_bench", label: "Сломанная скамейка" },
      { id: "playground", label: "Сломанная площадка" },
      { id: "dead_trees", label: "Сухие деревья" },
      { id: "no_lighting", label: "Нет освещения" },
    ],
  },
};

export default function CreateRequestPage() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Геолокация не поддерживается вашим браузером");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setError("Не удалось получить местоположение");
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login?redirect=/create-request';
        return;
      }

      // REAL API MODE - Connected to backend
      const requestFormData = new FormData();
      
      // Title based on category and problem type
      const categoryName = categories[selectedCategory]?.name || selectedCategory;
      const problemLabel = categories[selectedCategory]?.problems.find(p => p.id === selectedProblem)?.label || selectedProblem;
      requestFormData.append('title', `${categoryName}: ${problemLabel}`);
      requestFormData.append('description', description);
      requestFormData.append('address', address);
      
      if (coords) {
        requestFormData.append('latitude', coords.lat.toString());
        requestFormData.append('longitude', coords.lng.toString());
      }
      if (photo) {
        requestFormData.append('photo', photo);
      }

      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: requestFormData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ detail: 'Ошибка создания заявки' }));
        throw new Error(data.detail || 'Ошибка создания заявки');
      }

      // Redirect to history on success
      window.location.href = '/history?created=true';
      
      /* MOCK MODE - For testing without backend
      const { mockCreateRequest } = await import('@/lib/mockData');
      await mockCreateRequest({
        category: selectedCategory,
        problem_type: selectedProblem,
        description: description,
        address: address,
        latitude: coords?.lat,
        longitude: coords?.lng,
        photo_url: photo ? URL.createObjectURL(photo) : null,
      });

      window.location.href = '/history?created=true';
      */
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const currentCategory = categories[selectedCategory];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-12">
        <div className="card-unified w-full max-w-2xl">
          {/* Step Indicator */}
          <div className="step-indicator mb-8">
            <div className={`step-dot ${step >= 1 ? 'step-dot-active' : 'step-dot-inactive'}`} />
            <div className="step-line" />
            <div className={`step-dot ${step >= 2 ? 'step-dot-active' : 'step-dot-inactive'}`} />
            <div className="step-line" />
            <div className={`step-dot ${step >= 3 ? 'step-dot-active' : 'step-dot-inactive'}`} />
          </div>

          <h1 className="text-2xl text-center text-white font-bold mb-8">
            {step === 1 && "Выберите категорию"}
            {step === 2 && `Секция: ${currentCategory?.name}`}
            {step === 3 && "Описание и фото"}
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Category Selection */}
            {step === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in">
                {Object.entries(categories).map(([key, cat]) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(key);
                        setStep(2);
                      }}
                      className="bento-item flex flex-col items-center justify-center p-6 h-[120px] text-center group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white font-medium text-sm">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 2: Problem Selection */}
            {step === 2 && currentCategory && (
              <div className="animate-slide-in">
                <p className="text-gray-400 mb-4">Категория проблемы:</p>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                  {currentCategory.problems.map((problem) => (
                    <button
                      key={problem.id}
                      type="button"
                      onClick={() => setSelectedProblem(problem.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all flex items-center justify-between group ${
                        selectedProblem === problem.id
                          ? "bg-primary/20 border border-primary"
                          : "bg-[#1a1a1a] border border-white/5 hover:border-white/10"
                      }`}
                    >
                      <span className={selectedProblem === problem.id ? "text-white" : "text-gray-400"}>
                        {problem.label}
                      </span>
                      <ChevronRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                        selectedProblem === problem.id ? "text-primary" : "text-gray-600"
                      }`} />
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setSelectedProblem(""); }}
                    className="btn-unified btn-unified-outline flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Назад
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!selectedProblem}
                    className="btn-unified btn-unified-accent flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Далее
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Description & Photo */}
            {step === 3 && (
              <div className="space-y-6 animate-slide-in">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Адрес</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Введите адрес"
                      className="input-unified pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-primary transition-colors"
                      title="Определить местоположение"
                    >
                      {isLocating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <MapPin className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {coords && (
                    <p className="text-xs text-gray-500 mt-1">
                      📍 Координаты: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Опишите проблему</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Опишите проблему подробнее..."
                    rows={4}
                    className="input-unified resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Прикрепите фото</label>
                  {!photoPreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-52 bg-[#1a1a1a] border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mb-3">
                        <Camera className="w-8 h-8 text-gray-500" />
                      </div>
                      <span className="text-gray-500 text-sm">Нажмите для загрузки</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={photoPreview} alt="Preview" className="w-full h-52 object-cover" />
                      <button
                        type="button"
                        onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                        className="absolute top-3 right-3 p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-unified btn-unified-outline flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Назад
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !description || !address}
                    className="btn-unified btn-unified-accent flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Отправить
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
