"use client";

import Link from "next/link";
import { Logo, LogoText } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Bell, User, LogOut, Settings, History, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface HeaderProps {
  isLoggedIn?: boolean;
}

const navItems = [
  { label: "Главная", href: "/" },
  { label: "Карта", href: "/map" },
  { label: "История", href: "/history" },
  { label: "Поддержка", href: "/support" },
];

export function Header({ isLoggedIn: isLoggedInProp }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isLoggedInProp ?? false);
  const [user, setUser] = useState<{ first_name?: string; last_name?: string; username?: string } | null>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');
      setIsLoggedIn(!!token);
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
        }
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    router.push('/');
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <header className="w-full py-4 px-4 md:px-6 sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 z-50">
            <Logo />
            <LogoText />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Switcher - Desktop */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Auth Section - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  {/* Notifications */}
                  <Link 
                    href="/notifications" 
                    className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Bell className="h-5 w-5 text-gray-400" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                  </Link>

                  {/* Account Dropdown */}
                  <div className="relative" ref={accountMenuRef}>
                    <button
                      onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{getUserInitials()}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {accountMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-white font-medium text-sm">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-gray-500 text-xs">@{user?.username}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            href="/profile"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span className="text-sm">Профиль</span>
                          </Link>
                          <Link
                            href="/history"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 transition-colors"
                          >
                            <History className="w-4 h-4" />
                            <span className="text-sm">Мои заявки</span>
                          </Link>
                          <Link
                            href="/notifications"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 transition-colors"
                          >
                            <Bell className="w-4 h-4" />
                            <span className="text-sm">Уведомления</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-white/5 py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Выйти</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-primary text-sm">
                    Вход
                  </Link>
                  <Link href="/register" className="btn-accent text-sm">
                    Регистрация
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white z-50 p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/90 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-x-0 top-[73px] bottom-0 z-40 bg-[#0a0a0a] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col gap-2 p-6">
            {/* Language Switcher - Mobile */}
            <div className="mb-4 pb-4 border-b border-white/10">
              <LanguageSwitcher className="w-full" />
            </div>

            {/* Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg py-3 px-4 rounded-xl transition-colors ${
                  pathname === item.href
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            {isLoggedIn ? (
              <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/10">
                {/* User Card */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-white font-bold">{getUserInitials()}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-gray-500 text-sm">@{user?.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/notifications"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bell className="h-5 w-5" />
                    <span className="text-sm">Уведомления</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm">Профиль</span>
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Выход
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-white/10">
                <Link
                  href="/login"
                  className="btn-primary text-center py-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Вход
                </Link>
                <Link
                  href="/register"
                  className="btn-accent text-center py-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Регистрация
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
