import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Service {
  icon: string;
  title: string;
  description: string;
  image?: string;
}

interface BlogPost {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  icon: string;
  image?: string;
}

interface Contact {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ContentData {
  services: Service[];
  blog: BlogPost[];
  contact: Contact;
}

const defaultContent: ContentData = {
  services: [
    {
      icon: 'Globe',
      title: 'Корпоративные сайты',
      description: 'Разработка представительских сайтов с премиальным дизайном и продуманной структурой'
    },
    {
      icon: 'ShoppingCart',
      title: 'Интернет-магазины',
      description: 'Создание удобных e-commerce решений с высокой конверсией и современными платёжными системами'
    },
    {
      icon: 'Megaphone',
      title: 'Landing Page',
      description: 'Эффективные посадочные страницы для рекламных кампаний и продвижения продуктов'
    },
    {
      icon: 'Layout',
      title: 'Web-приложения',
      description: 'Разработка сложных интерактивных приложений и CRM-систем под ваши задачи'
    },
    {
      icon: 'Smartphone',
      title: 'Мобильная адаптация',
      description: 'Оптимизация сайтов для идеального отображения на всех устройствах'
    },
    {
      icon: 'TrendingUp',
      title: 'SEO-продвижение',
      description: 'Комплексное продвижение сайта в поисковых системах для привлечения клиентов'
    }
  ],
  blog: [
    {
      category: 'Разработка',
      title: 'Тренды веб-разработки 2024',
      excerpt: 'Какие технологии и подходы будут актуальны в новом году',
      date: '15 декабря 2024',
      icon: 'Code'
    },
    {
      category: 'Дизайн',
      title: 'Психология цвета в интерфейсах',
      excerpt: 'Как правильно выбрать цветовую схему для вашего сайта',
      date: '10 декабря 2024',
      icon: 'Palette'
    },
    {
      category: 'Маркетинг',
      title: 'Увеличение конверсии сайта',
      excerpt: '10 проверенных способов повысить продажи через веб-сайт',
      date: '5 декабря 2024',
      icon: 'TrendingUp'
    }
  ],
  contact: {
    name: 'Life-Promo',
    email: 'info@life-promo.ru',
    phone: '+7 (999) 999-99-99',
    address: 'Москва, ул. Примерная, 1'
  }
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [content, setContent] = useState<ContentData>(defaultContent);

  useEffect(() => {
    const savedContent = localStorage.getItem('site_content');
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent));
      } catch (e) {
        console.error('Error loading content:', e);
      }
    }
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Rocket" size={28} className="text-primary" />
              <span className="text-2xl font-bold text-secondary">Life-Promo</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('services')} className="text-foreground hover:text-primary transition-colors">
                Услуги
              </button>
              <button onClick={() => scrollToSection('about')} className="text-foreground hover:text-primary transition-colors">
                О студии
              </button>
              <button onClick={() => scrollToSection('process')} className="text-foreground hover:text-primary transition-colors">
                Процесс
              </button>
              <button onClick={() => scrollToSection('blog')} className="text-foreground hover:text-primary transition-colors">
                Блог
              </button>
              <button onClick={() => scrollToSection('contacts')} className="text-foreground hover:text-primary transition-colors">
                Контакты
              </button>
            </div>
            <Button onClick={() => scrollToSection('contacts')} className="hidden md:block">
              Связаться
            </Button>
          </div>
        </nav>
      </header>

      <section id="hero" className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Icon name="Sparkles" size={18} className="mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">Скоро открытие</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-secondary leading-tight">
              Разработка сайтов
              <br />
              <span className="text-primary">нового поколения</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Профессиональная интернет-студия, создающая продающие сайты и digital-решения для вашего бизнеса
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => scrollToSection('contacts')} className="text-lg px-8">
                Начать проект
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection('services')} className="text-lg px-8">
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Наши услуги</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Полный спектр digital-услуг для развития вашего бизнеса в интернете
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {content.services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {service.image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon name={service.icon} fallback="Star" size={28} className="text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="animate-slide-in-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">О студии Life-Promo</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Мы — команда профессионалов с многолетним опытом в web-разработке и digital-маркетинге. 
                Создаём не просто сайты, а эффективные инструменты для роста вашего бизнеса.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Наш подход основан на глубоком анализе потребностей клиентов, современных технологиях 
                и проверенных методиках увеличения конверсии.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="text-4xl font-bold text-primary mb-2">150+</div>
                  <div className="text-sm text-muted-foreground">Реализованных проектов</div>
                </div>
                <div className="text-center p-6 bg-accent/5 rounded-lg">
                  <div className="text-4xl font-bold text-accent mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Довольных клиентов</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <Icon name="Award" size={32} className="text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Качество</h3>
                <p className="text-sm text-muted-foreground">Премиальный дизайн и код высшего уровня</p>
              </Card>
              <Card className="p-6">
                <Icon name="Zap" size={32} className="text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Скорость</h3>
                <p className="text-sm text-muted-foreground">Быстрая разработка без потери качества</p>
              </Card>
              <Card className="p-6">
                <Icon name="Users" size={32} className="text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Команда</h3>
                <p className="text-sm text-muted-foreground">Опытные специалисты в своих областях</p>
              </Card>
              <Card className="p-6">
                <Icon name="Target" size={32} className="text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Результат</h3>
                <p className="text-sm text-muted-foreground">Фокус на достижении ваших целей</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="py-20 px-6 bg-secondary text-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Процесс работы</h2>
            <p className="text-xl text-white/80">
              Прозрачная и эффективная схема реализации проектов
            </p>
          </div>
          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Анализ и планирование',
                description: 'Изучаем ваш бизнес, целевую аудиторию и конкурентов. Формируем техническое задание и прототип.',
                icon: 'Search'
              },
              {
                step: '02',
                title: 'Дизайн и согласование',
                description: 'Создаём уникальный дизайн, отражающий ценности вашего бренда. Вносим правки до полного соответствия ожиданиям.',
                icon: 'Palette'
              },
              {
                step: '03',
                title: 'Разработка',
                description: 'Программируем функционал с использованием современных технологий. Оптимизируем скорость и безопасность.',
                icon: 'Code'
              },
              {
                step: '04',
                title: 'Тестирование',
                description: 'Проверяем работу на всех устройствах и браузерах. Исправляем ошибки и дорабатываем детали.',
                icon: 'CheckCircle'
              },
              {
                step: '05',
                title: 'Запуск и поддержка',
                description: 'Публикуем сайт, настраиваем аналитику. Обеспечиваем техническую поддержку и развитие проекта.',
                icon: 'Rocket'
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start group">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name={item.icon} size={28} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl font-bold text-white/20">{item.step}</span>
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-white/80 text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Блог</h2>
            <p className="text-xl text-muted-foreground">
              Полезные статьи о разработке, дизайне и digital-маркетинге
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {content.blog.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                {post.image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name={post.icon} fallback="FileText" size={18} className="text-primary" />
                    <span className="text-sm font-medium text-primary">{post.category}</span>
                  </div>
                  <CardTitle className="text-xl mb-3 hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-base mb-4">{post.excerpt}</CardDescription>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="Calendar" size={14} className="mr-2" />
                    {post.date}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Контакты</h2>
            <p className="text-xl text-muted-foreground">
              Готовы обсудить ваш проект? Свяжитесь с нами удобным способом
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Mail" size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a href={`mailto:${content.contact.email}`} className="text-primary hover:underline">
                {content.contact.email}
              </a>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Phone" size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Телефон</h3>
              <a href={`tel:${content.contact.phone.replace(/\D/g, '')}`} className="text-accent hover:underline">
                {content.contact.phone}
              </a>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Офис</h3>
              <p className="text-muted-foreground">{content.contact.address}</p>
            </Card>
          </div>
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Оставьте заявку</h3>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ваше имя</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Телефон</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Описание проекта</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Расскажите о вашем проекте..."
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Отправить заявку
                <Icon name="Send" size={20} className="ml-2" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <footer className="bg-secondary text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Rocket" size={24} className="text-primary" />
                <span className="text-xl font-bold">Life-Promo</span>
              </div>
              <p className="text-white/70 text-sm">
                Профессиональная интернет-студия полного цикла
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#services" className="hover:text-primary transition-colors">Разработка сайтов</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Интернет-магазины</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Web-приложения</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">SEO-продвижение</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#about" className="hover:text-primary transition-colors">О студии</a></li>
                <li><a href="#process" className="hover:text-primary transition-colors">Процесс работы</a></li>
                <li><a href="#blog" className="hover:text-primary transition-colors">Блог</a></li>
                <li><a href="#contacts" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Социальные сети</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon name="Facebook" size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon name="Instagram" size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                  <Icon name="Linkedin" size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2024 Life-Promo. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;