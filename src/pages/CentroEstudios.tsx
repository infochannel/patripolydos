import { useState } from "react";
import { ArrowLeft, BookOpen, FileCheck, HelpCircle, Play, Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface CentroEstudiosProps {
  onBack: () => void;
}

const studyCategories = [
  {
    id: "basicos",
    title: "Conceptos Básicos",
    description: "Fundamentos de educación financiera",
    icon: BookOpen,
    color: "bg-primary",
    topics: ["Presupuesto personal", "Ahorro", "Deuda vs. Inversión", "Inflación"]
  },
  {
    id: "inversion",
    title: "Inversión",
    description: "Estrategias de inversión y crecimiento",
    icon: FileCheck,
    color: "bg-accent",
    topics: ["Acciones", "Bonos", "Fondos indexados", "Bienes raíces"]
  },
  {
    id: "empresarial",
    title: "Mentalidad Empresarial",
    description: "Emprendimiento y negocios",
    icon: Heart,
    color: "bg-gradient-wealth",
    topics: ["Creación de empresas", "Flujo de caja", "Escalabilidad", "Pasivos"]
  }
];

const faqs = [
  {
    question: "¿Cuánto dinero necesito para empezar a invertir?",
    answer: "Puedes empezar con cualquier cantidad. Lo importante es desarrollar el hábito de invertir regularmente."
  },
  {
    question: "¿Cuál es la diferencia entre ahorro e inversión?",
    answer: "El ahorro preserva tu dinero, la inversión lo hace crecer. Ambos son importantes en diferentes momentos."
  },
  {
    question: "¿Cómo puedo crear ingresos pasivos?",
    answer: "Los ingresos pasivos se crean invirtiendo tiempo inicial en activos que generen dinero sin tu presencia constante."
  }
];

const videos = [
  {
    id: 1,
    title: "Introducción a la Libertad Financiera",
    duration: "15:23",
    category: "Básicos",
    thumbnail: "🎯"
  },
  {
    id: 2,
    title: "Cómo Crear Tu Primer Presupuesto",
    duration: "12:45",
    category: "Básicos",
    thumbnail: "📊"
  },
  {
    id: 3,
    title: "Estrategias de Inversión para Principiantes",
    duration: "18:30",
    category: "Inversión",
    thumbnail: "📈"
  },
  {
    id: 4,
    title: "Mentalidad Millonaria",
    duration: "22:15",
    category: "Mentalidad",
    thumbnail: "🧠"
  }
];

const pdfs = [
  {
    id: 1,
    title: "Guía Completa de Presupuesto Personal",
    size: "2.3 MB",
    category: "Básicos"
  },
  {
    id: 2,
    title: "Calculadora de Libertad Financiera",
    size: "1.8 MB", 
    category: "Herramientas"
  },
  {
    id: 3,
    title: "Template de Plan de Inversión",
    size: "1.2 MB",
    category: "Inversión"
  }
];

const stories = [
  {
    id: 1,
    name: "María González",
    age: 34,
    achievement: "Logró libertad financiera en 8 años",
    story: "Empecé con un salario mínimo y logré crear múltiples fuentes de ingresos pasivos invirtiendo en bienes raíces.",
    verified: true
  },
  {
    id: 2,
    name: "Carlos Mendoza", 
    age: 41,
    achievement: "Retirado a los 40 años",
    story: "Combiné inversión en índices con un negocio online para alcanzar la independencia financiera.",
    verified: true
  },
  {
    id: 3,
    name: "Ana Ruiz",
    age: 29,
    achievement: "€100K en patrimonio antes de los 30",
    story: "Enfoqué en aumentar mis ingresos y invertir el 50% en fondos indexados desde los 23 años.",
    verified: true
  }
];

export function CentroEstudios({ onBack }: CentroEstudiosProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Centro de Estudios de Riqueza
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Empodera tu futuro financiero con conocimiento y herramientas prácticas
          </p>
        </div>

        {/* Main Content */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-14">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Categorías</span>
                </TabsTrigger>
                <TabsTrigger value="tests" className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Tests</span>
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">FAQ</span>
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  <span className="hidden sm:inline">Videos</span>
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Recursos</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="p-6">
                <h2 className="text-2xl font-bold mb-6">Categorías de Estudio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {studyCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Card 
                        key={category.id}
                        className={`cursor-pointer transition-all duration-300 hover:shadow-elevated hover:scale-[1.02] ${
                          selectedCategory === category.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${category.color}`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{category.title}</CardTitle>
                              <CardDescription>{category.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {category.topics.map((topic, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-accent rounded-full" />
                                <span className="text-sm text-muted-foreground">{topic}</span>
                              </div>
                            ))}
                          </div>
                          <Button 
                            className="w-full mt-4" 
                            variant={selectedCategory === category.id ? "default" : "outline"}
                          >
                            {selectedCategory === category.id ? "Seleccionado" : "Seleccionar"}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Tests Tab */}
              <TabsContent value="tests" className="p-6">
                <h2 className="text-2xl font-bold mb-6">Tests y Autoevaluación</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Test de Conocimientos Básicos</CardTitle>
                      <CardDescription>Evalúa tu nivel actual de educación financiera</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        15 preguntas • 10 minutos
                      </p>
                      <Button className="w-full">Comenzar Test</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Perfil de Riesgo Inversor</CardTitle>
                      <CardDescription>Descubre qué tipo de inversor eres</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        20 preguntas • 15 minutos
                      </p>
                      <Button className="w-full">Comenzar Test</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Evaluación de Metas Financieras</CardTitle>
                      <CardDescription>Analiza tus objetivos y crea un plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        12 preguntas • 8 minutos
                      </p>
                      <Button className="w-full">Comenzar Test</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="p-6">
                <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Videos Tab */}
              <TabsContent value="videos" className="p-6">
                <h2 className="text-2xl font-bold mb-6">Biblioteca de Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <Card key={video.id} className="cursor-pointer hover:shadow-elevated transition-shadow">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                          <span className="text-4xl">{video.thumbnail}</span>
                        </div>
                        <h3 className="font-semibold mb-2">{video.title}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <Badge variant="secondary">{video.category}</Badge>
                          <span>{video.duration}</span>
                        </div>
                        <Button className="w-full mt-3" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Ver Video
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* PDFs Section */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">PDFs Descargables</h2>
                    <div className="space-y-4">
                      {pdfs.map((pdf) => (
                        <Card key={pdf.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{pdf.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                  <Badge variant="outline">{pdf.category}</Badge>
                                  <span>{pdf.size}</span>
                                </div>
                              </div>
                              <Button size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Stories Section */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Historias Inspiradoras</h2>
                    <div className="space-y-4">
                      {stories.map((story) => (
                        <Card key={story.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">{story.name}, {story.age} años</CardTitle>
                                <CardDescription>{story.achievement}</CardDescription>
                              </div>
                              {story.verified && (
                                <Badge className="bg-green-100 text-green-800">
                                  ✓ Verificado
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground italic">"{story.story}"</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}