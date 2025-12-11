"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import Link from "next/link";
import { useState } from "react";
import { UserPlus, ArrowRight, ArrowLeft, Check } from "lucide-react";
import api from "@/lib/api";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    // bcrypt limit - max 72 bytes
    if (new Blob([formData.password]).size > 72) {
      setError("Пароль слишком длинный (максимум 72 символа)");
      return;
    }
    
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Prepare request data
      const requestData = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName || undefined,
        phone: formData.phone,
      };

      // Use API client to register
      await api.register(requestData);

      // Redirect to login on success
      window.location.href = '/login?registered=true';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = formData.email && formData.password && formData.confirmPassword && formData.username;
  const isStep2Valid = formData.firstName && formData.lastName && formData.phone;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-12">
        <div className="card-unified w-full max-w-md">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <UserPlus className="w-7 h-7 text-accent" />
            <h1 className="text-2xl md:text-3xl font-bold text-accent">
              Регистрация
            </h1>
          </div>
          <p className="text-gray-400 mb-6">Создайте аккаунт гражданина</p>

          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? 'step-dot-active' : 'step-dot-inactive'}`} />
            <div className="step-line" />
            <div className={`step-dot ${step >= 2 ? 'step-dot-active' : 'step-dot-inactive'}`} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Account Details */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4 animate-in">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Логин (username)</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-unified"
                  placeholder="Введите логин"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-unified"
                  placeholder="example@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Пароль</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-unified"
                  placeholder="Минимум 6 символов"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Подтвердите пароль</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-unified"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!isStep1Valid}
                className="btn-unified btn-unified-accent flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Далее
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-slide-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Имя</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-unified"
                    placeholder="Имя"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Фамилия</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input-unified"
                    placeholder="Фамилия"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Отчество</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="input-unified"
                  placeholder="Отчество (необязательно)"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-unified"
                  placeholder="+7 (___) ___-__-__"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn-unified btn-unified-outline flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Назад
                </button>
                <button
                  type="submit"
                  disabled={!isStep2Valid || isLoading}
                  className="btn-unified btn-unified-accent flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <>
                      Зарегистрироваться
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-white font-medium hover:text-primary transition-colors">
              Войти
            </Link>
          </p>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
