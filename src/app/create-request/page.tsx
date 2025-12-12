"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { YandexMap } from "@/components/YandexMap";
import { useState } from "react";
import { Camera, ChevronRight, Send, ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { Zap, Droplet, Construction, Trash2, Sparkles, TreeDeciduous } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CreateRequestPage() {
  const { t } = useLanguage();
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
  const [showMap, setShowMap] = useState(false);

  const categories: Record<string, { name: string; icon: typeof Zap; color: string; problems: { id: string; label: string }[] }> = {
    electricity: {
      name: t.categories.electricity,
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      problems: [
        { id: "no_light", label: "Не работает освещение" },
        { id: "broken_wire", label: "Оборванный провод" },
        { id: "no_power", label: "Отсутствует электричество" },
      ],
    },
    water: {
      name: t.categories.water,
      icon: Droplet,
      color: "from-blue-500 to-cyan-500",
      problems: [
        { id: "no_water", label: "Нет воды" },
        { id: "leak", label: "Протечка" },
        { id: "broken_pipe", label: "Прорыв трубы" },
      ],
    },
    roads: {
      name: t.categories.roads,
      icon: Construction,
      color: "from-gray-500 to-slate-600",
      problems: [
        { id: "pothole", label: "Яма на дороге" },
        { id: "crack", label: "Трещина в покрытии" },
      ],
    },
    garbage: {
      name: t.categories.garbage,
      icon: Trash2,
      color: "from-green-500 to-emerald-600",
      problems: [
        { id: "overflowing", label: "Переполненный контейнер" },
        { id: "no_collection", label: "Не вывозят мусор" },
      ],
    },
    cleaning: {
      name: t.categories.cleaning,
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      problems: [
        { id: "no_cleaning", label: "Не убирают территорию" },
        { id: "snow", label: "Не убирают снег" },
      ],
    },
    landscaping: {
      name: t.categories.landscaping,
      icon: TreeDeciduous,
      color: "from-emerald-500 to-teal-500",
      problems: [
        { id: "broken_bench", label: "Сломанная скамейка" },
        { id: "playground", label: "Сломанная площадка" },
      ],
    },
  };

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

  const handleMapClick = async (clickedCoords: [number, number]) => {
    setCoords({ lat: clickedCoords[0], lng: clickedCoords[1] });

    // Reverse geocode to get address
    if (window.ymaps) {
      try {
        const res = await window.ymaps.geocode(clickedCoords);
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject) {
          setAddress(firstGeoObject.getAddressLine());
        }
      } catch (err) {
        console.error('Reverse geocode error:', err);
      }
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Геолокация не поддерживается вашим браузером");
      return;
    }

    setIsLocating(true);
    setError(""); // Clear previous errors

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);

        // Optionally reverse geocode to get address
        if (window.ymaps) {
          window.ymaps.geocode([position.coords.latitude, position.coords.longitude])
            .then((res: any) => {
              const firstGeoObject = res.geoObjects.get(0);
              if (firstGeoObject) {
                setAddress(firstGeoObject.getAddressLine());
              }
            })
            .catch((err: any) => console.error('Reverse geocode error:', err));
        }
      },
      (error) => {
        setIsLocating(false);
        let errorMessage = "Не удалось получить местоположение. ";

        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Вы запретили доступ к геолокации.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Информация о местоположении недоступна.";
            break;
          case error.TIMEOUT:
            errorMessage += "Превышено время ожидания.";
            break;
          default:
            errorMessage += "Попробуйте ввести адрес вручную.";
        }

        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
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

      // Get category and problem type
      const categoryName = categories[selectedCategory]?.name || selectedCategory;
      const problemLabel = categories[selectedCategory]?.problems.find(p => p.id === selectedProblem)?.label || selectedProblem;

      // Backend expects these exact field names
      requestFormData.append('category', categoryName);
      requestFormData.append('problem_type', problemLabel);
      requestFormData.append('description', description);
      requestFormData.append('address', address);

      if (coords) {
        requestFormData.append('latitude', coords.lat.toString());
        requestFormData.append('longitude', coords.lng.toString());
      }
      if (photo) {
        requestFormData.append('photo', photo);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiUrl}/requests`, {
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
            {step === 1 && t.request.selectCategory}
            {step === 2 && `${t.request.section}: ${currentCategory?.name}`}
            {step === 3 && t.request.descriptionAndPhoto}
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
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm text-gray-400">Адрес и местоположение</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowMap(false)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                          !showMap
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        Ввод адреса
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMap(true)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                          showMap
                            ? 'bg-primary text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        Карта
                      </button>
                    </div>
                  </div>

                  {!showMap ? (
                    <>
                      <AddressAutocomplete
                        value={address}
                        onChange={setAddress}
                        onCoordinatesChange={(lat, lng) => setCoords({ lat, lng })}
                        placeholder="Начните вводить адрес..."
                        className="input-unified"
                      />
                      <div className="flex gap-3 mt-2">
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={isLocating}
                          className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                        >
                          {isLocating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Определяем...
                            </>
                          ) : (
                            <>
                              <MapPin className="w-4 h-4" />
                              Мое местоположение
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowMap(true)}
                          className="text-sm text-gray-500 hover:text-primary transition-colors"
                        >
                          или выбрать на карте
                        </button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <YandexMap
                        markers={coords ? [{
                          id: 'selected',
                          lat: coords.lat,
                          lng: coords.lng,
                          title: address || 'Выбранное место',
                          status: 'selected'
                        }] : []}
                        center={coords ? [coords.lat, coords.lng] : [52.2873, 76.9653]}
                        zoom={coords ? 16 : 12}
                        onMapClick={handleMapClick}
                        height="400px"
                        selectedMarkerId="selected"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        💡 Кликните на карту для выбора места
                      </p>
                    </div>
                  )}

                  {address && (
                    <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-sm text-white mb-1">{address}</p>
                      {coords && (
                        <p className="text-xs text-gray-500">
                          📍 {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                        </p>
                      )}
                    </div>
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

      <Footer />
      <ChatBot />
    </div>
  );
}
