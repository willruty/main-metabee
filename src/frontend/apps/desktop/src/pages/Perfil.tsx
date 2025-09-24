import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MapPin, Calendar, Award, Book, Clock } from "lucide-react";
import { toast } from "sonner";

const achievements = [
  { title: "Primeiro Curso", description: "Completou seu primeiro curso", date: "Jan 2024" },
  { title: "Robótica Expert", description: "Completou 5 cursos de robótica", date: "Mar 2024" },
  { title: "100 Horas", description: "100 horas de estudo acumuladas", date: "Mai 2024" }
];

const stats = [
  { label: "Cursos Completados", value: "8", icon: Book },
  { label: "Horas de Estudo", value: "124", icon: Clock },
  { label: "Certificados", value: "5", icon: Award }
];

export default function Perfil() {
  const [profileData, setProfileData] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    bio: "Estudante de engenharia apaixonado por robótica e inteligência artificial.",
    location: "São Paulo, SP",
    joinDate: "Janeiro 2024"
  });

  const handleSave = () => {
    toast.success("Perfil atualizado com sucesso!");
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
        
        {/* Profile Card */}
        <Card className="bg-brand-surface border-brand-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-foreground">{profileData.name}</h2>
                  <Badge variant="secondary">Estudante Premium</Badge>
                </div>
                <p className="text-muted-foreground">{profileData.bio}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {profileData.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-brand-surface border-brand-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="edit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-brand-surface">
          <TabsTrigger value="edit">Editar Perfil</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="bg-brand-input-bg border-brand-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="bg-brand-input-bg border-brand-border"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  className="bg-brand-input-bg border-brand-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="bg-brand-input-bg border-brand-border min-h-[100px]"
                  placeholder="Conte um pouco sobre você..."
                />
              </div>
              
              <Button onClick={handleSave} className="w-full sm:w-auto">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle>Suas Conquistas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-brand-input-bg rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{achievement.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle>Configurações de Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Perfil Público</h3>
                    <p className="text-sm text-muted-foreground">Permitir que outros vejam seu perfil</p>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Notificações por Email</h3>
                    <p className="text-sm text-muted-foreground">Receber atualizações de cursos por email</p>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Dados de Uso</h3>
                    <p className="text-sm text-muted-foreground">Compartilhar dados para melhorar a experiência</p>
                  </div>
                  <Button variant="outline" size="sm">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}