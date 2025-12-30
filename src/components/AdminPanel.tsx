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
import { User, Message } from '@/types/user';

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
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [replyText, setReplyText] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated');
    const savedPassword = localStorage.getItem('admin_password');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    if (savedPassword) {
      setAdminPassword(savedPassword);
    } else {
      setAdminPassword('admin123');
      localStorage.setItem('admin_password', 'admin123');
    }

    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  const handleLogin = () => {
    if (password === adminPassword) {
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

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен содержать минимум 6 символов',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    setAdminPassword(newPassword);
    localStorage.setItem('admin_password', newPassword);
    setShowPasswordDialog(false);
    setNewPassword('');
    setConfirmPassword('');
    toast({
      title: 'Успешно',
      description: 'Пароль успешно изменён',
    });
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    
    const adminMessage: Message = {
      id: Date.now().toString(),
      userId: 'admin',
      username: 'Администратор',
      avatar: '👨‍💼',
      text: replyText,
      timestamp: new Date().toISOString(),
      isAdmin: true
    };
    
    const updatedMessages = [...messages, adminMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
    setReplyText('');
    toast({
      title: 'Сообщение отправлено',
      description: 'Ответ отправлен пользователю',
    });
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
          <TabsList className="grid w-full grid-cols-5 bg-white/5">
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
            <TabsTrigger value="users" className="data-[state=active]:bg-primary">
              <Icon name="Users" size={18} className="mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
              <Icon name="Key" size={18} className="mr-2" />
              Настройки
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

          <TabsContent value="users" className="space-y-6 mt-6">
            <h2 className="text-2xl font-bold text-white">Пользователи и сообщения</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Зарегистрированные пользователи</CardTitle>
                <CardDescription>Список всех пользователей сайта</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="Users" size={48} className="mx-auto mb-3 opacity-30" />
                      <p>Пока нет зарегистрированных пользователей</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-muted">
                            {user.avatar.startsWith('data:') ? (
                              <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              user.avatar
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{user.username}</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                              {user.phone && <p>📱 {user.phone}</p>}
                              {user.email && <p>✉️ {user.email}</p>}
                              {user.telegram && <p>💬 {user.telegram}</p>}
                            </div>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            <p>Регистрация: {new Date(user.registeredAt).toLocaleDateString('ru-RU')}</p>
                            <p>Последний вход: {new Date(user.lastLogin).toLocaleDateString('ru-RU')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Чат с пользователями</CardTitle>
                <CardDescription>Сообщения от пользователей</CardDescription>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="MessageSquare" size={48} className="mx-auto mb-3 opacity-30" />
                      <p>Пока нет сообщений</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-muted flex-shrink-0">
                            {msg.avatar.startsWith('data:') ? (
                              <img src={msg.avatar} alt={msg.username} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              msg.avatar
                            )}
                          </div>
                          <div className={`flex-1 ${msg.isAdmin ? 'text-right' : 'text-left'}`}>
                            <p className="text-sm font-medium mb-1">{msg.username}</p>
                            <div className={`inline-block px-4 py-2 rounded-lg ${
                              msg.isAdmin ? 'bg-primary text-white' : 'bg-muted'
                            }`}>
                              <p className="text-sm">{msg.text}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(msg.timestamp).toLocaleString('ru-RU')}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <Label>Ответить пользователю</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Введите сообщение..."
                            onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                          />
                          <Button onClick={handleReply}>
                            <Icon name="Send" size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <h2 className="text-2xl font-bold text-white">Настройки безопасности</h2>
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Изменение пароля администратора</CardTitle>
                <CardDescription>
                  Создайте надёжный пароль для защиты панели администратора
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg mb-4">
                  <div className="flex gap-3">
                    <Icon name="AlertTriangle" size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                        Важно запомнить новый пароль
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        После изменения пароля вам потребуется использовать его для входа в систему. 
                        Сохраните пароль в надёжном месте.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Текущий пароль</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-mono">{'*'.repeat(adminPassword.length)}</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-password">Новый пароль</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Минимум 6 символов"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Используйте буквы, цифры и специальные символы
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Подтвердите новый пароль</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите новый пароль"
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleChangePassword} className="flex-1">
                    <Icon name="Check" size={18} className="mr-2" />
                    Изменить пароль
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    <Icon name="X" size={18} className="mr-2" />
                    Отменить
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Резервное копирование</CardTitle>
                <CardDescription>
                  Экспорт и импорт всех данных сайта
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                  <div className="flex gap-3">
                    <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                        Что включает резервная копия
                      </p>
                      <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Услуги и их изображения</li>
                        <li>• Статьи блога и изображения</li>
                        <li>• Контактная информация</li>
                        <li>• Список пользователей</li>
                        <li>• История сообщений чата</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      const data = {
                        site_content: localStorage.getItem('site_content'),
                        users: localStorage.getItem('users'),
                        chat_messages: localStorage.getItem('chat_messages'),
                        admin_password: localStorage.getItem('admin_password'),
                        exportDate: new Date().toISOString()
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast({
                        title: 'Экспорт завершён',
                        description: 'Файл резервной копии загружен',
                      });
                    }}
                    className="flex-1"
                  >
                    <Icon name="Download" size={18} className="mr-2" />
                    Экспорт
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'application/json';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          try {
                            const data = JSON.parse(e.target?.result as string);
                            if (data.site_content) localStorage.setItem('site_content', data.site_content);
                            if (data.users) localStorage.setItem('users', data.users);
                            if (data.chat_messages) localStorage.setItem('chat_messages', data.chat_messages);
                            if (data.admin_password) localStorage.setItem('admin_password', data.admin_password);
                            toast({
                              title: 'Импорт завершён',
                              description: 'Данные успешно восстановлены. Перезагрузите страницу.',
                            });
                            setTimeout(() => window.location.reload(), 2000);
                          } catch (error) {
                            toast({
                              title: 'Ошибка импорта',
                              description: 'Неверный формат файла',
                              variant: 'destructive',
                            });
                          }
                        };
                        reader.readAsText(file);
                      };
                      input.click();
                    }}
                    className="flex-1"
                  >
                    <Icon name="Upload" size={18} className="mr-2" />
                    Импорт
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Информация о системе</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Версия админки</span>
                  <span className="text-sm font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Хранилище данных</span>
                  <span className="text-sm font-medium">LocalStorage</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Статус авторизации</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Активна</span>
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