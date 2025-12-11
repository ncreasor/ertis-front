"use client";

import Link from "next/link";
import Image from "next/image";
import { Logo, LogoText } from "./Logo";
import { usePathname } from "next/navigation";
import { Menu, X, Bell, User } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  isLoggedIn?: boolean;
}

const navItems = [
  { label: "Главная", href: "/" },
  { label: "Карта", href: "/map" },
  { label: "История", href: "/history" },
  { label: "Поддержка", href: "/support" },
];

export function Header({ isLoggedIn = false }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full py-4 px-4 md:px-6 sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 z-50">
          <Logo />
          <LogoText />
        </Link>

        {/* Language + Flag */}
        <div className="hidden md:flex items-center gap-2 ml-2 md:ml-4">
          <Image
            src="/russia-flag.svg"
            alt="RU"
            width={24}
            height={16}
            className="rounded-sm"
          />
        </div>

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

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white z-50 p-2 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Right Side - Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Link>
              <Link href="/profile" className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 transition-colors">
                <User className="h-5 w-5 text-white" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn-primary text-sm"
              >
                Вход
              </Link>
              <Link
                href="/register"
                className="btn-accent text-sm"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40"
          style={{ backgroundColor: '#000000' }}
        >
          <nav 
            className="flex flex-col gap-2 pt-24 px-6"
            onClick={(e) => e.stopPropagation()}
          >
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
          
          {/* Mobile Auth Buttons */}
          {isLoggedIn ? (
            <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
              <Link
                href="/notifications"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bell className="h-5 w-5" />
                Уведомления
              </Link>
              <Link
                href="/profile"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                Профиль
              </Link>
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
    </header>
  );
}
