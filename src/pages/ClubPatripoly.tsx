import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Users, 
  Video, 
  MessageSquare, 
  Calendar, 
  Send, 
  Heart, 
  MessageCircle,
  Clock,
  UserPlus,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCurrentWealthLevel } from "@/lib/wealth-levels";

interface ClubPatripolyProps {
  onBack: () => void;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  level: string;
  joinedDate: string;
  isOnline: boolean;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  level: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  host: string;
  attendees: number;
  maxAttendees: number;
  status: "upcoming" | "live" | "ended";
}

export function ClubPatripoly({ onBack }: ClubPatripolyProps) {
  const { toast } = useToast();
  const [newPost, setNewPost] = useState("");
  const [newComment, setNewComment] = useState("");
  const [allMembers, setAllMembers] = useState<Member[]>([]);

  // Static members for demo purposes
  const staticMembers: Member[] = [
    {
      id: "static-1",
      name: "Ana Martínez",
      avatar: "",
      level: "Inversionista",
      joinedDate: "2024-01-15",
      isOnline: true
    },
    {
      id: "static-2", 
      name: "Carlos Ruiz",
      avatar: "",
      level: "Emprendedor",
      joinedDate: "2024-02-03",
      isOnline: false
    },
    {
      id: "static-3",
      name: "María González",
      avatar: "",
      level: "Millonario",
      joinedDate: "2024-01-28",
      isOnline: true
    },
    {
      id: "static-4",
      name: "David López",
      avatar: "",
      level: "Constructor",
      joinedDate: "2024-02-10",
      isOnline: true
    }
  ];

  // Load real members who opted in to participate
  useEffect(() => {
    const loadMembers = () => {
      const userData = localStorage.getItem('patripoly_user');
      const profileSettings = localStorage.getItem('patripoly_profile_settings');
      const savedAssets = localStorage.getItem('patripoly_assets');

      let realMembers: Member[] = [];

      // Check if current user wants to participate
      if (userData && profileSettings) {
        const user = JSON.parse(userData);
        const settings = JSON.parse(profileSettings);

        if (settings.participateInClub) {
          // Calculate user's wealth level
          let patrimonioTotal = 25000; // default
          if (savedAssets) {
            const assets = JSON.parse(savedAssets);
            const totalAssets = assets.filter((a: any) => a.type === 'asset').reduce((sum: number, asset: any) => sum + asset.value, 0);
            const totalLiabilities = assets.filter((a: any) => a.type === 'liability').reduce((sum: number, asset: any) => sum + asset.value, 0);
            patrimonioTotal = totalAssets - totalLiabilities;
          }

          const wealthLevel = getCurrentWealthLevel(patrimonioTotal);

          realMembers.push({
            id: "current-user",
            name: user.name || "Usuario",
            avatar: settings.profilePicture || "",
            level: wealthLevel.name,
            joinedDate: new Date().toISOString(),
            isOnline: true
          });
        }
      }

      // Combine real members with static members
      setAllMembers([...realMembers, ...staticMembers]);
    };

    loadMembers();
  }, []);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Ana Martínez",
      avatar: "",
      content: "¡Acabo de completar mi primera inversión en REITs! Gracias por todos los consejos del Centro de Estudios. 💪",
      timestamp: "2024-03-15T14:30:00Z",
      likes: 12,
      comments: 5,
      level: "Inversionista"
    },
    {
      id: "2",
      author: "Carlos Ruiz",
      avatar: "",
      content: "¿Alguien más está participando en el reto del Duplicador? Llevo 3 semanas y ya he duplicado mi inversión inicial. 🚀",
      timestamp: "2024-03-15T12:15:00Z",
      likes: 8,
      comments: 3,
      level: "Emprendedor"
    },
    {
      id: "3",
      author: "María González",
      avatar: "",
      content: "Compartiendo mi estrategia de cashflow pasivo que me está dando €2,500 mensuales. ¡AMA en los comentarios!",
      timestamp: "2024-03-15T09:45:00Z",
      likes: 25,
      comments: 12,
      level: "Millonario"
    }
  ]);

  const [meetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Estrategias de Inversión 2024",
      date: "2024-03-20",
      time: "19:00",
      host: "María González",
      attendees: 15,
      maxAttendees: 25,
      status: "upcoming"
    },
    {
      id: "2",
      title: "Club de Lectura: Padre Rico Padre Pobre",
      date: "2024-03-18",
      time: "20:30",
      host: "Ana Martínez", 
      attendees: 8,
      maxAttendees: 15,
      status: "live"
    },
    {
      id: "3",
      title: "Sesión de Q&A Mensual",
      date: "2024-03-25",
      time: "18:00",
      host: "David López",
      attendees: 0,
      maxAttendees: 30,
      status: "upcoming"
    }
  ]);

  const handlePublishPost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now().toString(),
      author: "Tú",
      avatar: "",
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      level: "Constructor"
    };
    
    setPosts([post, ...posts]);
    setNewPost("");
    
    toast({
      title: "Publicación compartida",
      description: "Tu post ha sido publicado en el foro del club.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Hace unos minutos";
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return "Ayer";
    return date.toLocaleDateString();
  };

  const joinMeeting = (meetingId: string) => {
    toast({
      title: "Uniéndose a la reunión...",
      description: "Redirigiendo a la sala de videoconferencia.",
    });
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      "Nuevo Inversor": "bg-muted",
      "Constructor": "bg-muted",
      "Emprendedor": "bg-primary",
      "Inversionista": "bg-accent",
      "Millonario": "bg-gradient-wealth"
    };
    return colors[level] || "bg-muted";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">Club Patripoly</h1>
                <p className="text-sm text-muted-foreground">Conecta, aprende y crece junto a otros miembros</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="forum" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forum" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Foro
            </TabsTrigger>
            <TabsTrigger value="meetings" className="gap-2">
              <Video className="h-4 w-4" />
              Reuniones
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              Miembros
            </TabsTrigger>
          </TabsList>

          {/* Forum Tab */}
          <TabsContent value="forum" className="space-y-6">
            {/* New Post */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comparte con la comunidad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="¿Qué quieres compartir con la comunidad? Logros, preguntas, consejos..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handlePublishPost}
                    disabled={!newPost.trim()}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Publicar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {getUserInitials(post.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-primary">{post.author}</h4>
                          <Badge className={getLevelColor(post.level)}>
                            {post.level}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(post.timestamp)}
                          </span>
                        </div>
                        <p className="text-foreground mb-4">{post.content}</p>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-red-500">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="space-y-6">
            <div className="grid gap-4">
              {meetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-primary">{meeting.title}</h3>
                          <Badge 
                            variant={meeting.status === "live" ? "destructive" : "secondary"}
                          >
                            {meeting.status === "live" ? "En vivo" : 
                             meeting.status === "upcoming" ? "Próxima" : "Finalizada"}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(meeting.date).toLocaleDateString()} a las {meeting.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Anfitrión: {meeting.host}
                          </div>
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            {meeting.attendees}/{meeting.maxAttendees} participantes
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {meeting.status === "live" && (
                          <Button 
                            onClick={() => joinMeeting(meeting.id)}
                            className="gap-2 bg-red-600 hover:bg-red-700"
                          >
                            <Play className="h-4 w-4" />
                            Unirse
                          </Button>
                        )}
                        {meeting.status === "upcoming" && (
                          <Button 
                            variant="outline"
                            onClick={() => joinMeeting(meeting.id)}
                            className="gap-2"
                          >
                            <Clock className="h-4 w-4" />
                            Recordar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Schedule Meeting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Programar nueva reunión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Título de la reunión" />
                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" />
                  <Input type="time" />
                </div>
                <Textarea placeholder="Descripción (opcional)" rows={2} />
                <Button className="w-full gap-2">
                  <Calendar className="h-4 w-4" />
                  Programar reunión
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            {allMembers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No hay miembros visibles</h3>
                  <p className="text-muted-foreground">
                    Los miembros aparecerán aquí cuando opten por participar públicamente en el Club Patripoly desde su perfil.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Miembros del Club ({allMembers.length})</h3>
                  <Badge variant="secondary">{allMembers.filter(m => m.isOnline).length} en línea</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {allMembers.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="bg-gradient-primary text-white">
                                {getUserInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            {member.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-primary">{member.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getLevelColor(member.level)}>
                                {member.level}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {member.isOnline ? "En línea" : "Desconectado"}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Miembro desde {new Date(member.joinedDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Conectar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}