"use client";

import { Header } from "@/components/Header";
import { ChatBot } from "@/components/ChatBot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export default function ContactKSKPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Связаться с КСК
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="glass-card border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Контактная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-white font-medium">Телефон</p>
                      <p className="text-text-secondary">+7 (7182) 123-456</p>
                      <p className="text-text-secondary">+7 (7182) 654-321</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <p className="text-text-secondary">info@ertis-service.kz</p>
                      <p className="text-text-secondary">support@ertis-service.kz</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-white font-medium">Адрес</p>
                      <p className="text-text-secondary">
                        г. Павлодар, ул. Ленина, 45
                        <br />
                        Здание КСК, 3 этаж
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-white font-medium">Часы работы</p>
                      <p className="text-text-secondary">Пн-Пт: 9:00 - 18:00</p>
                      <p className="text-text-secondary">Сб: 10:00 - 14:00</p>
                      <p className="text-text-secondary">Вс: Выходной</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-accent/20">
                <CardHeader>
                  <CardTitle className="text-accent">Экстренные службы</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-text-secondary">
                    <span className="text-white font-medium">Аварийная служба:</span> 109
                  </p>
                  <p className="text-text-secondary">
                    <span className="text-white font-medium">Водоканал:</span> +7 (7182) 999-000
                  </p>
                  <p className="text-text-secondary">
                    <span className="text-white font-medium">Энергосети:</span> +7 (7182) 888-000
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-white">Отправить сообщение</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Тема</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Отправить сообщение
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
}

