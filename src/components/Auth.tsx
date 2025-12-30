import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import AvatarSelector from '@/components/AvatarSelector';
import { User } from '@/types/user';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth = ({ onLogin }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    phone: '',
    email: '',
    telegram: '',
    avatar: '👨‍💼'
  });

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = users.find(u => u.username === loginData.username);
    
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      onLogin(updatedUser);
    } else {
      alert('Пользователь не найден. Пожалуйста, зарегистрируйтесь.');
    }
  };

  const handleRegister = () => {
    if (!registerData.username) {
      alert('Введите имя пользователя');
      return;
    }

    if (!registerData.phone && !registerData.email && !registerData.telegram) {
      alert('Укажите хотя бы один способ связи: телефон, email или Telegram');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    
    if (users.find(u => u.username === registerData.username)) {
      alert('Пользователь с таким именем уже существует');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: registerData.username,
      phone: registerData.phone || undefined,
      email: registerData.email || undefined,
      telegram: registerData.telegram || undefined,
      avatar: registerData.avatar,
      registeredAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="UserCircle" size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl">Добро пожаловать</CardTitle>
          <CardDescription>Войдите или создайте новый аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div>
                <Label htmlFor="login-username">Имя пользователя</Label>
                <Input
                  id="login-username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="Введите имя пользователя"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                Войти
                <Icon name="LogIn" size={18} className="ml-2" />
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setShowAvatarSelector(true)}
                  className="w-20 h-20 text-4xl rounded-full bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center"
                >
                  {registerData.avatar.startsWith('data:') ? (
                    <img src={registerData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    registerData.avatar
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Выберите аватар</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAvatarSelector(true)}
                  >
                    <Icon name="Edit" size={14} className="mr-2" />
                    Изменить
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="reg-username">Имя пользователя *</Label>
                <Input
                  id="reg-username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  placeholder="Введите имя"
                />
              </div>

              <div>
                <Label htmlFor="reg-phone">Телефон</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  placeholder="+7 (999) 999-99-99"
                />
              </div>

              <div>
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  placeholder="example@mail.com"
                />
              </div>

              <div>
                <Label htmlFor="reg-telegram">Telegram</Label>
                <Input
                  id="reg-telegram"
                  value={registerData.telegram}
                  onChange={(e) => setRegisterData({ ...registerData, telegram: e.target.value })}
                  placeholder="@username"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                * Укажите хотя бы один способ связи
              </p>

              <Button onClick={handleRegister} className="w-full">
                Зарегистрироваться
                <Icon name="UserPlus" size={18} className="ml-2" />
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showAvatarSelector && (
        <AvatarSelector
          selectedAvatar={registerData.avatar}
          onSelect={(avatar) => setRegisterData({ ...registerData, avatar })}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}
    </div>
  );
};

export default Auth;
