import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';

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

interface AdminPanelProps {
  onContentUpdate: (data: ContentData) => void;
  initialData: ContentData;
}

const AdminPanel = ({ onContentUpdate, initialData }: AdminPanelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<ContentData>(initialData);
  const [activeTab, setActiveTab] = useState('services');
  const { toast } = useToast();

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      toast({
        title: 'Вход выполнен',
        description: 'Добро пожаловать в панель администратора',
      });
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный пароль',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  const handleSave = () => {
    localStorage.setItem('site_content', JSON.stringify(content));
    onContentUpdate(content);
    toast({
      title: 'Сохранено',
      description: 'Контент успешно обновлён',
    });
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    const newServices = [...content.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setContent({ ...content, services: newServices });
  };

  const addService = () => {
    const newService: Service = {
      icon: 'Star',
      title: 'Новая услуга',
      description: 'Описание услуги',
      image: '',
    };
    setContent({ ...content, services: [...content.services, newService] });
  };

  const deleteService = (index: number) => {
    const newServices = content.services.filter((_, i) => i !== index);
    setContent({ ...content, services: newServices });
  };

  const updateBlogPost = (index: number, field: keyof BlogPost, value: string) => {
    const newBlog = [...content.blog];
    newBlog[index] = { ...newBlog[index], [field]: value };
    setContent({ ...content, blog: newBlog });
  };

  const addBlogPost = () => {
    const newPost: BlogPost = {
      category: 'Новое',
      title: 'Новая статья',
      excerpt: 'Краткое описание статьи',
      date: new Date().toLocaleDateString('ru-RU'),
      icon: 'FileText',
      image: '',
    };
    setContent({ ...content, blog: [...content.blog, newPost] });
  };

  const deleteBlogPost = (index: number) => {
    const newBlog = content.blog.filter((_, i) => i !== index);
    setContent({ ...content, blog: newBlog });
  };

  const updateContact = (field: keyof Contact, value: string) => {
    setContent({ ...content, contact: { ...content.contact, [field]: value } });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={32} className="text-primary" />
            </div>
            <CardTitle className="text-2xl">Панель администратора</CardTitle>
            <CardDescription>Введите пароль для входа</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Введите пароль"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Пароль по умолчанию: admin123
              </p>
            </div>
            <Button onClick={handleLogin} className="w-full">
              Войти
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Панель администратора</h1>
              <p className="text-white/60">Управление контентом сайта Life-Promo</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="lg">
              <Icon name="Save" size={20} className="mr-2" />
              Сохранить
            </Button>
            <Button onClick={handleLogout} variant="outline" size="lg">
              <Icon name="LogOut" size={20} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger value="services" className="data-[state=active]:bg-primary">
              <Icon name="Briefcase" size={18} className="mr-2" />
              Услуги
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-primary">
              <Icon name="FileText" size={18} className="mr-2" />
              Блог
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-primary">
              <Icon name="Mail" size={18} className="mr-2" />
              Контакты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Управление услугами</h2>
              <Button onClick={addService}>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить услугу
              </Button>
            </div>
            <div className="grid gap-6">
              {content.services.map((service, index) => (
                <Card key={index} className="animate-fade-in">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Услуга #{index + 1}</CardTitle>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteService(index)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ImageUpload
                      value={service.image}
                      onChange={(url) => updateService(index, 'image', url)}
                      label="Изображение услуги"
                    />
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Иконка (Lucide name)</Label>
                        <Input
                          value={service.icon}
                          onChange={(e) => updateService(index, 'icon', e.target.value)}
                          placeholder="Globe"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Название</Label>
                        <Input
                          value={service.title}
                          onChange={(e) => updateService(index, 'title', e.target.value)}
                          placeholder="Название услуги"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Описание</Label>
                      <Textarea
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        placeholder="Описание услуги"
                        rows={3}
                      />
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Превью:</p>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon name={service.icon} fallback="Star" size={20} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{service.title}</h4>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Управление блогом</h2>
              <Button onClick={addBlogPost}>
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить статью
              </Button>
            </div>
            <div className="grid gap-6">
              {content.blog.map((post, index) => (
                <Card key={index} className="animate-fade-in">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Статья #{index + 1}</CardTitle>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteBlogPost(index)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ImageUpload
                      value={post.image}
                      onChange={(url) => updateBlogPost(index, 'image', url)}
                      label="Изображение статьи"
                    />
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Категория</Label>
                        <Input
                          value={post.category}
                          onChange={(e) => updateBlogPost(index, 'category', e.target.value)}
                          placeholder="Разработка"
                        />
                      </div>
                      <div>
                        <Label>Иконка</Label>
                        <Input
                          value={post.icon}
                          onChange={(e) => updateBlogPost(index, 'icon', e.target.value)}
                          placeholder="Code"
                        />
                      </div>
                      <div>
                        <Label>Дата</Label>
                        <Input
                          value={post.date}
                          onChange={(e) => updateBlogPost(index, 'date', e.target.value)}
                          placeholder="15 декабря 2024"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Заголовок</Label>
                      <Input
                        value={post.title}
                        onChange={(e) => updateBlogPost(index, 'title', e.target.value)}
                        placeholder="Название статьи"
                      />
                    </div>
                    <div>
                      <Label>Краткое описание</Label>
                      <Textarea
                        value={post.excerpt}
                        onChange={(e) => updateBlogPost(index, 'excerpt', e.target.value)}
                        placeholder="Краткое описание статьи"
                        rows={2}
                      />
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Превью:</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon name={post.icon} fallback="FileText" size={16} className="text-primary" />
                          <span className="text-sm font-medium text-primary">{post.category}</span>
                        </div>
                        <h4 className="font-semibold text-lg">{post.title}</h4>
                        <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Icon name="Calendar" size={12} className="mr-1" />
                          {post.date}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6 mt-6">
            <h2 className="text-2xl font-bold text-white">Управление контактами</h2>
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
                <CardDescription>
                  Эта информация отображается в разделе контактов на главной странице
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Название компании</Label>
                  <Input
                    value={content.contact.name}
                    onChange={(e) => updateContact('name', e.target.value)}
                    placeholder="Life-Promo"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={content.contact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    placeholder="info@life-promo.ru"
                    type="email"
                  />
                </div>
                <div>
                  <Label>Телефон</Label>
                  <Input
                    value={content.contact.phone}
                    onChange={(e) => updateContact('phone', e.target.value)}
                    placeholder="+7 (999) 999-99-99"
                    type="tel"
                  />
                </div>
                <div>
                  <Label>Адрес</Label>
                  <Input
                    value={content.contact.address}
                    onChange={(e) => updateContact('address', e.target.value)}
                    placeholder="Москва, ул. Примерная, 1"
                  />
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-4">Превью контактов:</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-background rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon name="Mail" size={20} className="text-primary" />
                      </div>
                      <p className="text-xs font-medium mb-1">Email</p>
                      <p className="text-xs text-primary">{content.contact.email}</p>
                    </div>
                    <div className="text-center p-4 bg-background rounded-lg">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon name="Phone" size={20} className="text-accent" />
                      </div>
                      <p className="text-xs font-medium mb-1">Телефон</p>
                      <p className="text-xs text-accent">{content.contact.phone}</p>
                    </div>
                    <div className="text-center p-4 bg-background rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon name="MapPin" size={20} className="text-primary" />
                      </div>
                      <p className="text-xs font-medium mb-1">Адрес</p>
                      <p className="text-xs text-muted-foreground">{content.contact.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;