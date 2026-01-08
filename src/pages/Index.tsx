import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const stats = {
    online: 47,
    totalMembers: 1243,
    messagesDaily: 856,
    activeVoice: 12
  };

  const roles = [
    { name: 'Администратор', color: '#F97316', icon: 'Crown', description: 'Управление сервером и модерация' },
    { name: 'Модератор', color: '#8B5CF6', icon: 'Shield', description: 'Модерация чата и помощь игрокам' },
    { name: 'Строитель', color: '#0EA5E9', icon: 'Hammer', description: 'Создатели крутых построек' },
    { name: 'Гонщик', color: '#EF4444', icon: 'Flag', description: 'Участники гонок и трюков' },
    { name: 'Новичок', color: '#22C55E', icon: 'Star', description: 'Добро пожаловать в сообщество!' }
  ];

  const news = [
    { 
      title: 'Обновление сервера 2.0', 
      date: '5 января 2026', 
      content: 'Новые карты, улучшенная физика и система достижений!',
      badge: 'Важно'
    },
    { 
      title: 'Турнир по гонкам', 
      date: '28 декабря 2025', 
      content: 'Присоединяйтесь к новогоднему турниру. Призы для победителей!',
      badge: 'Событие'
    },
    { 
      title: 'Конкурс на лучшую постройку', 
      date: '15 декабря 2025', 
      content: 'Покажите свои строительные навыки. Лучшие работы попадут в галерею.',
      badge: 'Конкурс'
    }
  ];

  const gallery = [
    { title: 'Городская площадь', author: 'Player_123', likes: 47 },
    { title: 'Монстр-трак шоу', author: 'RacerPro', likes: 89 },
    { title: 'Военная база', author: 'Builder_X', likes: 62 },
    { title: 'Паркур трек', author: 'StuntMaster', likes: 71 }
  ];

  const faq = [
    { 
      question: 'Как присоединиться к серверу?', 
      answer: 'Нажмите кнопку "Присоединиться к Discord" выше, примите правила сервера и выберите роль в канале #выбор-роли.'
    },
    { 
      question: 'Какие правила на сервере?', 
      answer: 'Основные правила: уважение к другим игрокам, запрет мата и спама, никаких читов. Полный список в канале #правила.'
    },
    { 
      question: 'Как получить роль строителя?', 
      answer: 'Покажите свои постройки в канале #галерея. Если модераторам понравится, вы получите роль!'
    },
    { 
      question: 'Когда проходят события?', 
      answer: 'События анонсируются в канале #новости. Обычно гонки по выходным, конкурсы раз в месяц.'
    }
  ];

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Castle" size={28} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Russian Town</h1>
                <p className="text-sm text-muted-foreground">Brick Rigs Community</p>
              </div>
            </div>
            
            <div className="hidden md:flex gap-6">
              {[
                { id: 'home', label: 'Главная', icon: 'Home' },
                { id: 'news', label: 'Новости', icon: 'Newspaper' },
                { id: 'help', label: 'Помощь', icon: 'HelpCircle' },
                { id: 'gallery', label: 'Галерея', icon: 'Image' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-accent ${
                    activeSection === item.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <Icon name={item.icon as any} size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            <Button className="bg-primary hover:bg-primary/90">
              <Icon name="MessageCircle" size={18} className="mr-2" />
              Discord
            </Button>
          </div>
        </div>
      </nav>

      <section id="home" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4 bg-secondary text-secondary-foreground px-4 py-1.5">
              <Icon name="Zap" size={14} className="mr-1.5" />
              Онлайн: {stats.online} игроков
            </Badge>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Добро пожаловать в Russian Town
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Крупнейшее русскоязычное сообщество Brick Rigs. Создавай, гоняй и общайся с тысячами игроков!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                <Icon name="Users" size={20} className="mr-2" />
                Присоединиться к Discord
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => scrollToSection('help')}>
                <Icon name="BookOpen" size={20} className="mr-2" />
                Гайд для новичков
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: 'Участников', value: stats.totalMembers, icon: 'Users', color: 'text-primary' },
              { label: 'Онлайн', value: stats.online, icon: 'Radio', color: 'text-green-500' },
              { label: 'Сообщений/день', value: stats.messagesDaily, icon: 'MessageSquare', color: 'text-secondary' },
              { label: 'В голосовых', value: stats.activeVoice, icon: 'Mic', color: 'text-blue-500' }
            ].map((stat, i) => (
              <Card key={i} className="p-6 hover:scale-105 transition-transform bg-card border-border">
                <Icon name={stat.icon as any} size={28} className={`mb-3 ${stat.color}`} />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Icon name="Award" size={32} className="text-secondary" />
              Роли на сервере
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role, i) => (
                <Card key={i} className="p-6 hover:shadow-xl transition-all bg-card border-border hover:border-primary/50">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: role.color + '20' }}
                    >
                      <Icon name={role.icon as any} size={24} style={{ color: role.color }} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1" style={{ color: role.color }}>
                        {role.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="news" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Icon name="Newspaper" size={32} className="text-primary" />
            Последние новости
          </h3>
          <div className="space-y-4">
            {news.map((item, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-all bg-card border-border hover:border-primary/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="secondary" className="bg-secondary/20 text-secondary">
                        {item.badge}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                    <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                    <p className="text-muted-foreground">{item.content}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Icon name="ChevronRight" size={20} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Icon name="Image" size={32} className="text-secondary" />
            Галерея сообщества
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {gallery.map((item, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-xl transition-all bg-card border-border group">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon name="Image" size={64} className="text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">by {item.author}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Icon name="Heart" size={18} className="text-red-500" />
                      <span className="font-medium">{item.likes}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="help" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Icon name="HelpCircle" size={32} className="text-primary" />
            Часто задаваемые вопросы
          </h3>
          <Accordion type="single" collapsible className="space-y-4">
            {faq.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Castle" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <div className="font-bold">Russian Town</div>
                <div className="text-sm text-muted-foreground">Brick Rigs Community © 2026</div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon">
                <Icon name="MessageCircle" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Youtube" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Twitter" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
