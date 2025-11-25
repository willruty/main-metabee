import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, MapPin, Calendar, Award, Book, Clock, LogOut } from "lucide-react";
import { toast } from "sonner";
import { getProfile, Profile, getProfileImageUrl, updateProfile, uploadProfileImage } from "../services/ProfileService";

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
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const profile = await getProfile();
        if (profile) {
          setProfileData(profile);
          
          // Carregar avatar se existir
          if (profile.has_avatar) {
            const token = localStorage.getItem("authToken");
            if (token) {
              // Criar uma URL blob para a imagem autenticada
              try {
                const response = await fetch(getProfileImageUrl(), {
                  headers: {
                    "Authorization": `Bearer ${token}`,
                  },
                });
                if (response.ok) {
                  const blob = await response.blob();
                  const url = URL.createObjectURL(blob);
                  setAvatarUrl(url);
                }
              } catch (err) {
                console.warn("Erro ao carregar avatar:", err);
              }
            }
          }
        } else {
          setError("Não foi possível carregar o perfil");
        }
      } catch (err: any) {
        console.error("Erro ao carregar perfil:", err);
        setError(err.message || "Erro ao carregar perfil");
        if (err.message?.includes("Sessão expirada")) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // Cleanup: revogar URL do blob quando o componente desmontar ou avatarUrl mudar
  useEffect(() => {
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const handleSave = async () => {
    if (!profileData) return;

    try {
      setIsSaving(true);
      await updateProfile({
        name: profileData.name,
        bio: profileData.bio || "",
        location: profileData.location || "",
      });
      toast.success("Perfil atualizado com sucesso!");
      
      // Recarregar perfil para pegar dados atualizados
      const updatedProfile = await getProfile();
      if (updatedProfile) {
        setProfileData(updatedProfile);
      }
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      toast.error(error.message || "Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      await uploadProfileImage(file);
      toast.success("Foto de perfil atualizada com sucesso!");
      
      // Recarregar perfil e avatar
      const updatedProfile = await getProfile();
      if (updatedProfile) {
        setProfileData(updatedProfile);
        
        // Recarregar avatar
        if (updatedProfile.has_avatar) {
          const token = localStorage.getItem("authToken");
          if (token) {
            try {
              const response = await fetch(getProfileImageUrl(), {
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
              });
              if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                // Revogar URL anterior se existir
                if (avatarUrl) {
                  URL.revokeObjectURL(avatarUrl);
                }
                setAvatarUrl(url);
              }
            } catch (err) {
              console.warn("Erro ao carregar novo avatar:", err);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast.error(error.message || "Erro ao fazer upload da imagem");
    } finally {
      setIsSaving(false);
      // Limpar input para permitir selecionar o mesmo arquivo novamente
      e.target.value = "";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data não disponível";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="p-6 space-y-8 max-w-4xl mx-auto">
        <Card className="bg-brand-surface border-brand-border">
          <CardContent className="p-12 text-center">
            <p className="text-red-500 text-lg">{error || "Erro ao carregar perfil"}</p>
            <Button
              variant="outline"
              onClick={() => navigate("/app/homepage")}
              className="mt-4"
            >
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogout = () => {
    // Limpar token do localStorage
    localStorage.removeItem("authToken");
    
    // Limpar qualquer outro cache se necessário
    // localStorage.clear(); // Descomente se quiser limpar tudo
    
    toast.success("Logout realizado com sucesso!");
    
    // Redirecionar para login
    navigate("/login");
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="bg-brand-surface border-brand-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  {avatarUrl ? (
                    <AvatarImage 
                      src={avatarUrl} 
                      alt="Profile"
                      onError={() => {
                        setAvatarUrl(null);
                      }}
                    />
                  ) : null}
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isSaving}
                />
                <Button
                  type="button"
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 z-10"
                  title="Alterar foto de perfil"
                  disabled={isSaving}
                  onClick={() => {
                    const input = document.getElementById('avatar-upload') as HTMLInputElement;
                    if (input) {
                      input.click();
                    }
                  }}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-foreground">{profileData.name}</h2>
                  <Badge variant="secondary">Estudante Premium</Badge>
                </div>
                {profileData.bio && (
                  <p className="text-muted-foreground">{profileData.bio}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {profileData.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.created_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Membro desde {formatDate(profileData.created_at)}</span>
                    </div>
                  )}
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
                    value={profileData.name || ""}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="bg-brand-input-bg border-brand-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email || ""}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="bg-brand-input-bg border-brand-border"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">O email não pode ser alterado</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={profileData.location || ""}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="bg-brand-input-bg border-brand-border"
                  placeholder="Ex: São Paulo, SP"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio || ""}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="bg-brand-input-bg border-brand-border min-h-[100px]"
                  placeholder="Conte um pouco sobre você..."
                />
              </div>

              <Button 
                onClick={handleSave} 
                className="w-full sm:w-auto"
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Salvar Alterações"}
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
                  <Button variant="outline" size="sm" onClick={() => {navigate("/app/configuracoes")}}>Configurar</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Notificações por Email</h3>
                    <p className="text-sm text-muted-foreground">Receber atualizações de cursos por email</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {navigate("/app/configuracoes")}}>Configurar</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Dados de Uso</h3>
                    <p className="text-sm text-muted-foreground">Compartilhar dados para melhorar a experiência</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {navigate("/app/configuracoes")}}>Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}