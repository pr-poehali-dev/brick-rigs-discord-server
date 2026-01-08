import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Вы вышли из системы');
    navigate('/');
  };

  const handleSaveAvatar = () => {
    if (user) {
      const updatedUser = { ...user, avatar_url: avatarUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Аватар обновлен!');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Castle" size={28} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Russian Town</h1>
                <p className="text-sm text-muted-foreground">Профиль</p>
              </div>
            </Link>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/factions">
                  <Icon name="Shield" size={18} className="mr-2" />
                  Фракции
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/forum">
                  <Icon name="MessageSquare" size={18} className="mr-2" />
                  Форум
                </Link>
              </Button>
              {user.is_admin && (
                <Button variant="outline" className="bg-secondary/20 border-secondary" asChild>
                  <Link to="/admin">
                    <Icon name="Settings" size={18} className="mr-2" />
                    Админ-панель
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="p-8 bg-card border-border">
          <div className="flex items-start gap-8 mb-8">
            <Avatar className="w-32 h-32">
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{user.username}</h2>
                {user.is_admin && (
                  <span className="px-3 py-1 bg-secondary rounded-full text-sm font-medium">
                    <Icon name="Crown" size={14} className="inline mr-1" />
                    Администратор
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mb-4">
                Роль: {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </p>
              {user.status && (
                <p className="text-sm">
                  <Icon name="Info" size={14} className="inline mr-1" />
                  Статус: {user.status}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="avatar">URL аватара</Label>
              <div className="flex gap-2">
                <Input
                  id="avatar"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="bg-background border-border"
                />
                <Button onClick={handleSaveAvatar} variant="outline">
                  <Icon name="Save" size={18} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-background">
                <div className="flex items-center gap-3">
                  <Icon name="MessageSquare" size={24} className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Постов</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-background">
                <div className="flex items-center gap-3">
                  <Icon name="Calendar" size={24} className="text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">На сервере</p>
                    <p className="text-2xl font-bold">Новичок</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="pt-6 border-t border-border">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full"
              >
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти из аккаунта
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
