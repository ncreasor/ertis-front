"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, MessageSquare, Phone, Mail } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Как подать заявку на устранение проблемы?",
    answer: "Нажмите кнопку 'Подать заявку', сделайте фото проблемы, выберите категорию и добавьте описание с адресом.",
  },
  {
    question: "Сколько времени займет решение проблемы?",
    answer: "В зависимости от сложности: простые проблемы - 1-3 дня, сложные - до 7 дней. Вы получите уведомление о статусе.",
  },
  {
    question: "Могу ли я отслеживать статус заявки?",
    answer: "Да, в разделе 'История заявок' вы можете видеть все свои заявки и их текущий статус.",
  },
  {
    question: "Что делать в экстренной ситуации?",
    answer: "При аварии звоните на номер 109 или используйте контакты экстренных служб в разделе 'Связаться с КСК'.",
  },
  {
    question: "Могу ли я отменить заявку?",
    answer: "Да, пока заявка в статусе 'Ожидает'. После начала работ отменить нельзя, но можно добавить комментарий.",
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Техническая поддержка
          </h1>

          {/* Search */}
          <Card className="glass-card border-primary/20 mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <Input
                  placeholder="Поиск по вопросам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <a href="tel:+77182123456">
                <Phone className="h-6 w-6 text-primary" />
                <span>Позвонить</span>
                <span className="text-xs text-text-secondary">+7 (7182) 123-456</span>
              </a>
            </Button>

            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <a href="mailto:support@ertis-service.kz">
                <Mail className="h-6 w-6 text-primary" />
                <span>Email</span>
                <span className="text-xs text-text-secondary">support@ertis-service.kz</span>
              </a>
            </Button>

            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span>Онлайн чат</span>
              <span className="text-xs text-text-secondary">Ответим за 5 минут</span>
            </Button>
          </div>

          {/* FAQs */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Часто задаваемые вопросы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-card/50 rounded-lg p-4 border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <summary className="cursor-pointer text-white font-medium flex items-start gap-2 list-none">
                    <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{faq.question}</span>
                  </summary>
                  <p className="text-text-secondary mt-3 ml-7">{faq.answer}</p>
                </details>
              ))}

              {filteredFaqs.length === 0 && (
                <p className="text-center text-text-secondary py-8">
                  Вопросы не найдены. Попробуйте другой запрос.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}

