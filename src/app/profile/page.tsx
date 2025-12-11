"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { User, Edit2 } from "lucide-react";

export default function ProfilePage() {
  const user = {
    firstName: "Джони",
    lastName: "Нурмухамитулы",
    specialty: "Сантехник",
    experience: 33,
    rating: 87,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />

      <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-12">
        <div className="card-unified w-full max-w-2xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-36 h-36 md:w-44 md:h-44 bg-[#1a1a1a] rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
              <User className="w-20 h-20 text-gray-700" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {user.lastName}
                </h1>
                <h2 className="text-xl md:text-2xl text-white mb-2">{user.firstName}</h2>
                <button className="text-primary text-sm hover:underline inline-flex items-center gap-1">
                  <Edit2 className="w-3 h-3" />
                  изменить
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span className="text-gray-500">Специальность:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{user.specialty}</span>
                    <button className="text-primary text-sm hover:underline">изменить</button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span className="text-gray-500">Опыт работы:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{user.experience} года</span>
                    <button className="text-primary text-sm hover:underline">изменить</button>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Рейтинг:</span>
                    <span className="text-2xl font-bold text-primary">{user.rating}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}
