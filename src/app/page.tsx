"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Zap, Droplet, Construction, Trash2, Sparkles, TreeDeciduous,
  Camera, FileText, CheckCircle, MapPin, ArrowRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  const categories = [
    { id: "electricity", label: t.categories.electricity, icon: Zap, color: "from-yellow-500 to-orange-500" },
    { id: "water", label: t.categories.water, icon: Droplet, color: "from-blue-500 to-cyan-500" },
    { id: "roads", label: t.categories.roads, icon: Construction, color: "from-gray-500 to-slate-600" },
    { id: "garbage", label: t.categories.garbage, icon: Trash2, color: "from-green-500 to-emerald-600" },
    { id: "cleaning", label: t.categories.cleaning, icon: Sparkles, color: "from-purple-500 to-pink-500" },
    { id: "landscaping", label: t.categories.landscaping, icon: TreeDeciduous, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 lg:px-8 py-8">
        {/* Hero Section with Bento Grid */}
        <section className="max-w-7xl mx-auto mb-16">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
                {t.home.heroTitle1}
              </span>
              <br />
              <span className="text-white">{t.home.heroTitle2}</span>
              <span className="bg-gradient-to-r from-accent to-yellow-500 bg-clip-text text-transparent">
                {t.home.heroCity}
              </span>
            </h1>
          </div>

          {/* Bento Grid - Simplified */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Main CTA - Large */}
            <div className="bento-item md:col-span-2 lg:col-span-2 flex flex-col justify-center p-6 md:p-8 group min-h-[280px]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{t.home.aiTasks}</span>
                </div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug">
                  {t.home.mainCta}
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  {t.home.mainCtaSub}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-fit bg-gradient-to-r from-primary to-cyan-400 hover:from-primary/90 hover:to-cyan-400/90 text-black font-semibold px-5 md:px-8 py-2.5 md:py-5 rounded-xl group-hover:shadow-lg group-hover:shadow-primary/30 transition-all text-sm"
                >
                  <Link href="/create-request" className="flex items-center gap-2">
                    {t.home.submitRequest}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* How it works - Steps */}
            <div className="bento-item flex flex-col p-6 md:p-7 min-h-[280px]">
              <h3 className="text-base md:text-lg font-semibold text-white mb-6">{t.home.howItWorks}</h3>
              <div className="space-y-5 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm leading-tight">1. {t.home.step1}</p>
                    <p className="text-gray-500 text-xs leading-tight">{t.home.step1sub}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm leading-tight">2. {t.home.step2}</p>
                    <p className="text-gray-500 text-xs leading-tight">{t.home.step2sub}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm leading-tight">3. {t.home.step3}</p>
                    <p className="text-gray-500 text-xs leading-tight">{t.home.step3sub}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bento-item md:col-span-2 lg:col-span-3 flex items-center justify-between p-4 md:p-6 group cursor-pointer hover:border-accent/30">
              <Link href="/map" className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-transparent flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-base md:text-lg">{t.home.mapPreview}</p>
                  <p className="text-gray-500 text-sm">{t.home.mapPreviewSub}</p>
                </div>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-gray-500 group-hover:text-accent group-hover:translate-x-2 transition-all shrink-0" />
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="max-w-7xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t.home.categoriesTitle}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t.home.categoriesSub}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    const btn = document.getElementById(`cat-${cat.id}`);
                    btn?.classList.add('animate-pulse');
                    setTimeout(() => {
                      btn?.classList.remove('animate-pulse');
                      window.location.href = `/create-request?category=${cat.id}`;
                    }, 500);
                  }}
                  id={`cat-${cat.id}`}
                  className="group relative"
                >
                  <div className="bento-item flex flex-col items-center justify-center text-center p-4 md:p-6 h-[120px] md:h-[140px] hover:border-primary/40 active:scale-95 transition-transform">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 group-hover:shadow-lg transition-all shrink-0`}>
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-white shrink-0" />
                    </div>
                    <p className="text-white font-medium text-xs md:text-sm leading-tight">{cat.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="bento-item p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t.home.ctaTitle}
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                {t.home.ctaSub}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-primary to-cyan-400 hover:from-primary/90 hover:to-cyan-400/90 text-black font-semibold px-8"
                >
                  <Link href="/create-request">{t.home.submitRequest}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-700 hover:border-gray-600 hover:bg-white/5"
                >
                  <Link href="/map">{t.home.viewMap}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}
