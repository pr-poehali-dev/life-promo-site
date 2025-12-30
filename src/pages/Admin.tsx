import { useState, useEffect } from 'react';
import AdminPanel from '@/components/AdminPanel';

interface Service {
  icon: string;
  title: string;
  description: string;
}

interface BlogPost {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  icon: string;
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

const Admin = () => {
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

  const handleContentUpdate = (newContent: ContentData) => {
    setContent(newContent);
  };

  return <AdminPanel onContentUpdate={handleContentUpdate} initialData={content} />;
};

export default Admin;
