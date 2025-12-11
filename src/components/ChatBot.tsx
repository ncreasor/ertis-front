"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Здравствуйте! Я виртуальный помощник Ertis Service. Чем могу помочь?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    if (msg.includes("заявк") || msg.includes("проблем")) {
      return "Чтобы подать заявку, нажмите на кнопку 'Подать заявку' на главной странице или перейдите в раздел 'Создать заявку'. Вам нужно будет сделать фото проблемы, добавить описание и указать адрес.";
    }
    
    if (msg.includes("статус") || msg.includes("отслед")) {
      return "Вы можете отслеживать статус своих заявок в разделе 'История заявок'. Там отображаются все ваши обращения с текущими статусами.";
    }
    
    if (msg.includes("категор") || msg.includes("электр") || msg.includes("вод") || msg.includes("дорог")) {
      return "Мы работаем с 6 категориями проблем: Электричество, Водопровод, Дороги, Мусор, Уборка и Благоустройство. Выберите подходящую категорию при создании заявки.";
    }
    
    if (msg.includes("время") || msg.includes("быстр") || msg.includes("долго")) {
      return "Среднее время обработки заявки составляет менее 24 часов. Наш AI автоматически назначит подходящего специалиста, который свяжется с вами в ближайшее время.";
    }
    
    if (msg.includes("регистр") || msg.includes("аккаунт")) {
      return "Для регистрации перейдите на страницу 'Регистрация', заполните форму с вашими данными. После регистрации вы сможете подавать заявки и отслеживать их статус.";
    }
    
    if (msg.includes("карт") || msg.includes("где")) {
      return "В разделе 'Карта проблем' вы можете увидеть все активные заявки по городу Павлодар. Это помогает понять, какие районы требуют внимания.";
    }
    
    if (msg.includes("привет") || msg.includes("здравств")) {
      return "Здравствуйте! Рад помочь вам с любыми вопросами по работе сервиса. Что вас интересует?";
    }
    
    if (msg.includes("спасибо") || msg.includes("благодар")) {
      return "Пожалуйста! Всегда рад помочь. Если у вас есть ещё вопросы - обращайтесь!";
    }

    return "Спасибо за ваш вопрос! Вы можете создать заявку на главной странице, проверить статус в истории заявок или связаться с нашей поддержкой. Чем ещё могу помочь?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary to-cyan-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 z-50 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
        aria-label="Открыть чат"
      >
        <Bot className="w-8 h-8 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[600px] bg-cover bg-center rounded-3xl shadow-2xl z-50 overflow-hidden transition-all duration-500 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        style={{
          backgroundImage: "url('/Free_Umbrella_Mockup_3.png')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

        {/* Content */}
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-primary/20 to-cyan-600/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Помощник Ertis</h3>
                <p className="text-xs text-gray-400">Онлайн</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.isBot ? "justify-start" : "justify-end"
                } animate-in slide-in-from-bottom-4 duration-300`}
              >
                {message.isBot && (
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-600 rounded-full flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] rounded-2xl p-3 ${
                    message.isBot
                      ? "bg-white/10 backdrop-blur-md text-white border border-white/20"
                      : "bg-gradient-to-r from-primary to-cyan-600 text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-[10px] opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {!message.isBot && (
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-orange-600 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3 animate-in slide-in-from-bottom-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-cyan-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/30 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите сообщение..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-12 h-12 bg-gradient-to-r from-primary to-cyan-600 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

