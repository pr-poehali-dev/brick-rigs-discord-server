import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { API_URLS } from '@/config/api';
import { toast } from 'sonner';

interface Post {
  id: number;
  author_username: string;
  title: string;
  content: string;
  post_type: string;
  created_at: string;
  faction_name?: string;
}

const Forum = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', post_type: 'general' });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadPosts();
  }, []);

  const loadPosts = async (type = 'all') => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URLS.forum}?action=posts&type=${type}`);
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      toast.error('Ошибка загрузки постов');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error('Войдите в систему для создания постов');
      navigate('/login');
      return;
    }

    if (!newPost.title || !newPost.content) {
      toast.error('Заполните все поля');
      return;
    }

    try {
      const response = await fetch(`${API_URLS.forum}?action=create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: user.id,
          title: newPost.title,
          content: newPost.content,
          post_type: newPost.post_type
        })
      });

      if (response.ok) {
        toast.success('Пост создан!');
        setDialogOpen(false);
        setNewPost({ title: '', content: '', post_type: 'general' });
        loadPosts();
      }
    } catch (error) {
      toast.error('Ошибка создания поста');
    }
  };

  const getPostTypeLabel = (type: string) => {
    const types: any = {
      general: 'Обсуждение',
      complaint: 'Жалоба',
      application: 'Анкета',
      announcement: 'Объявление'
    };
    return types[type] || type;
  };

  const getPostTypeColor = (type: string) => {
    const colors: any = {
      general: 'bg-blue-500/20 text-blue-500',
      complaint: 'bg-red-500/20 text-red-500',
      application: 'bg-green-500/20 text-green-500',
      announcement: 'bg-secondary/20 text-secondary'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-500';
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
                <p className="text-sm text-muted-foreground">Форум</p>
              </div>
            </Link>
            
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/factions">
                  <Icon name="Shield" size={18} className="mr-2" />
                  Фракции
                </Link>
              </Button>
              {user ? (
                <Button variant="outline" asChild>
                  <Link to="/profile">
                    <Icon name="User" size={18} className="mr-2" />
                    {user.username}
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/login">Войти</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">Форум сообщества</h2>
            <p className="text-xl text-muted-foreground">Обсуждения, жалобы и анкеты</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Icon name="Plus" size={18} className="mr-2" />
                Создать пост
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Новый пост</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Тип поста</Label>
                  <Select value={newPost.post_type} onValueChange={(v) => setNewPost({ ...newPost, post_type: v })}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Обсуждение</SelectItem>
                      <SelectItem value="complaint">Жалоба</SelectItem>
                      <SelectItem value="application">Анкета вступления</SelectItem>
                      <SelectItem value="announcement">Объявление</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Заголовок</Label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Название поста"
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label>Содержание</Label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Текст поста..."
                    className="bg-background min-h-[150px]"
                  />
                </div>
                <Button onClick={handleCreatePost} className="w-full">Опубликовать</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-6" onValueChange={(v) => loadPosts(v)}>
          <TabsList className="bg-card">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="general">Обсуждения</TabsTrigger>
            <TabsTrigger value="complaint">Жалобы</TabsTrigger>
            <TabsTrigger value="application">Анкеты</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <Icon name="Loader2" size={48} className="animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : posts.length === 0 ? (
              <Card className="p-12 text-center bg-card">
                <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-muted-foreground">Пока нет постов</p>
              </Card>
            ) : (
              posts.map(post => (
                <Card key={post.id} className="p-6 hover:shadow-lg transition-all bg-card border-border">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.post_type)}`}>
                          {getPostTypeLabel(post.post_type)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-3">{post.content}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="User" size={14} />
                        <span>{post.author_username}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Icon name="ChevronRight" size={20} />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Forum;
