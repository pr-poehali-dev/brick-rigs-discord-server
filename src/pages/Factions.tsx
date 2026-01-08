import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { API_URLS } from '@/config/api';
import { toast } from 'sonner';

interface Faction {
  id: number;
  name: string;
  type: string;
  is_open: boolean;
  general_username: string | null;
  description: string;
}

const Factions = () => {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFactions();
  }, []);

  const loadFactions = async () => {
    try {
      const response = await fetch(`${API_URLS.factions}?action=list`);
      const data = await response.json();
      if (response.ok) {
        setFactions(data.factions || []);
      }
    } catch (error) {
      toast.error('Ошибка загрузки фракций');
    } finally {
      setLoading(false);
    }
  };

  const getFactionIcon = (type: string) => {
    if (type === 'open') return 'Shield';
    if (type === 'criminal') return 'Skull';
    return 'Lock';
  };

  const getFactionColor = (type: string) => {
    if (type === 'open') return 'text-blue-500';
    if (type === 'criminal') return 'text-red-500';
    return 'text-purple-500';
  };

  const groupedFactions = {
    open: factions.filter(f => f.type === 'open'),
    criminal: factions.filter(f => f.type === 'criminal'),
    closed: factions.filter(f => f.type === 'closed')
  };

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
                <p className="text-sm text-muted-foreground">Фракции</p>
              </div>
            </Link>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/forum">
                  <Icon name="MessageSquare" size={18} className="mr-2" />
                  Форум
                </Link>
              </Button>
              <Button asChild>
                <Link to="/profile">
                  <Icon name="User" size={18} className="mr-2" />
                  Профиль
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Фракции сервера</h2>
          <p className="text-xl text-muted-foreground">Выберите фракцию и подайте заявку на вступление</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Icon name="Loader2" size={48} className="animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Icon name="Shield" size={32} className="text-blue-500" />
                <h3 className="text-3xl font-bold">Открытые фракции</h3>
                <Badge variant="secondary" className="ml-auto">
                  {groupedFactions.open.length} фракций
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {groupedFactions.open.map(faction => (
                  <Card key={faction.id} className="p-6 hover:shadow-xl transition-all bg-card border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={getFactionIcon(faction.type) as any} size={24} className="text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-xl font-bold">{faction.name}</h4>
                          {faction.is_open && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                              Открыта
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{faction.description}</p>
                        {faction.general_username && (
                          <div className="flex items-center gap-2 text-sm">
                            <Icon name="Crown" size={16} className="text-secondary" />
                            <span className="text-muted-foreground">Генерал:</span>
                            <span className="font-semibold text-foreground">{faction.general_username}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Icon name="Skull" size={32} className="text-red-500" />
                <h3 className="text-3xl font-bold">Криминальные структуры</h3>
                <Badge variant="secondary" className="ml-auto">
                  {groupedFactions.criminal.length} ОПГ
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {groupedFactions.criminal.map(faction => (
                  <Card key={faction.id} className="p-6 hover:shadow-xl transition-all bg-card border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={getFactionIcon(faction.type) as any} size={24} className="text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-xl font-bold">{faction.name}</h4>
                          {faction.is_open && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                              Открыта
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{faction.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Icon name="Lock" size={32} className="text-purple-500" />
                <h3 className="text-3xl font-bold">Закрытые фракции</h3>
                <Badge variant="secondary" className="ml-auto">
                  {groupedFactions.closed.length} фракций
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {groupedFactions.closed.map(faction => (
                  <Card key={faction.id} className="p-6 hover:shadow-xl transition-all bg-card border-border opacity-75">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={getFactionIcon(faction.type) as any} size={24} className="text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-xl font-bold">{faction.name}</h4>
                          <Badge variant="secondary" className="bg-red-500/20 text-red-500">
                            Закрыта
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{faction.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Factions;
