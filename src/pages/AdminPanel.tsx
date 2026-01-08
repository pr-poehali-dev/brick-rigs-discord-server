import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { API_URLS } from '@/config/api';
import { toast } from 'sonner';

interface User {
  id: number;
  username: string;
  role: string;
  is_admin: boolean;
  is_banned: boolean;
  is_muted: boolean;
}

interface Faction {
  id: number;
  name: string;
  type: string;
  is_open: boolean;
  general_username: string | null;
}

interface Stat {
  key: string;
  value: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const u = JSON.parse(userData);
    if (!u.is_admin) {
      toast.error('Доступ запрещен');
      navigate('/');
      return;
    }
    setUser(u);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [usersRes, factionsRes, statsRes] = await Promise.all([
        fetch(`${API_URLS.auth}?action=users`),
        fetch(`${API_URLS.factions}?action=list`),
        fetch(`${API_URLS.forum}?action=stats`)
      ]);

      const usersData = await usersRes.json();
      const factionsData = await factionsRes.json();
      const statsData = await statsRes.json();

      setUsers(usersData.users || []);
      setFactions(factionsData.factions || []);
      setStats(statsData.statistics || []);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: number, updates: any) => {
    try {
      const response = await fetch(`${API_URLS.auth}?action=user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, updates })
      });

      if (response.ok) {
        toast.success('Пользователь обновлен');
        loadData();
      }
    } catch (error) {
      toast.error('Ошибка обновления');
    }
  };

  const updateFaction = async (factionId: number, updates: any) => {
    try {
      const response = await fetch(`${API_URLS.factions}?action=update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faction_id: factionId, updates })
      });

      if (response.ok) {
        toast.success('Фракция обновлена');
        loadData();
      }
    } catch (error) {
      toast.error('Ошибка обновления');
    }
  };

  const updateStat = async (key: string, value: string) => {
    try {
      const response = await fetch(`${API_URLS.forum}?action=stats`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });

      if (response.ok) {
        toast.success('Статистика обновлена');
        loadData();
      }
    } catch (error) {
      toast.error('Ошибка обновления');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <Icon name="Settings" size={28} className="text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Админ-панель</h1>
                <p className="text-sm text-muted-foreground">Управление сервером</p>
              </div>
            </Link>
            
            <Button variant="outline" asChild>
              <Link to="/">
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                На главную
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="users">
              <Icon name="Users" size={18} className="mr-2" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="factions">
              <Icon name="Shield" size={18} className="mr-2" />
              Фракции
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Icon name="BarChart" size={18} className="mr-2" />
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="p-6 bg-card">
              <h3 className="text-2xl font-bold mb-6">Управление пользователями</h3>
              {loading ? (
                <div className="text-center py-12">
                  <Icon name="Loader2" size={48} className="animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map(u => (
                    <Card key={u.id} className="p-4 bg-background">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold">{u.username[0].toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{u.username}</span>
                              {u.is_admin && (
                                <span className="px-2 py-0.5 bg-secondary rounded text-xs">Admin</span>
                              )}
                              {u.is_banned && (
                                <span className="px-2 py-0.5 bg-red-500 rounded text-xs">Забанен</span>
                              )}
                              {u.is_muted && (
                                <span className="px-2 py-0.5 bg-yellow-500 rounded text-xs">Замучен</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">ID: {u.id} | Роль: {u.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUser(u.id, { is_banned: !u.is_banned })}
                          >
                            <Icon name={u.is_banned ? "UserCheck" : "Ban"} size={16} className="mr-1" />
                            {u.is_banned ? 'Разбанить' : 'Забанить'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUser(u.id, { is_muted: !u.is_muted })}
                          >
                            <Icon name={u.is_muted ? "Volume2" : "VolumeX"} size={16} className="mr-1" />
                            {u.is_muted ? 'Размутить' : 'Замутить'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUser(u.id, { is_admin: !u.is_admin })}
                          >
                            <Icon name="Crown" size={16} className="mr-1" />
                            {u.is_admin ? 'Снять админа' : 'Дать админа'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="factions">
            <Card className="p-6 bg-card">
              <h3 className="text-2xl font-bold mb-6">Управление фракциями</h3>
              {loading ? (
                <div className="text-center py-12">
                  <Icon name="Loader2" size={48} className="animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {factions.map(f => (
                    <Card key={f.id} className="p-4 bg-background">
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-bold">{f.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Тип: {f.type} | {f.is_open ? 'Открыта' : 'Закрыта'}
                            </p>
                          </div>
                          <Switch
                            checked={f.is_open}
                            onCheckedChange={(checked) => updateFaction(f.id, { is_open: checked })}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Генерал фракции</Label>
                            <Input
                              value={f.general_username || ''}
                              onChange={(e) => {
                                const updated = [...factions];
                                const idx = updated.findIndex(x => x.id === f.id);
                                updated[idx].general_username = e.target.value;
                                setFactions(updated);
                              }}
                              onBlur={(e) => updateFaction(f.id, { general_username: e.target.value })}
                              placeholder="Имя генерала"
                              className="bg-background border-border"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Тип фракции</Label>
                            <Select
                              value={f.type}
                              onValueChange={(v) => updateFaction(f.id, { type: v })}
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Открытая</SelectItem>
                                <SelectItem value="criminal">Криминальная</SelectItem>
                                <SelectItem value="closed">Закрытая</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="p-6 bg-card">
              <h3 className="text-2xl font-bold mb-6">Статистика сервера</h3>
              {loading ? (
                <div className="text-center py-12">
                  <Icon name="Loader2" size={48} className="animate-spin mx-auto text-muted-foreground" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {stats.map(stat => (
                    <Card key={stat.key} className="p-4 bg-background">
                      <Label className="text-xs uppercase text-muted-foreground mb-2 block">
                        {stat.key.replace('_', ' ')}
                      </Label>
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...stats];
                          const idx = updated.findIndex(s => s.key === stat.key);
                          updated[idx].value = e.target.value;
                          setStats(updated);
                        }}
                        onBlur={(e) => updateStat(stat.key, e.target.value)}
                        className="bg-background border-border text-2xl font-bold"
                      />
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
