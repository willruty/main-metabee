import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Bell,
  Shield,
  Palette,
  Volume2,
  Download,
  Trash2,
  HardDrive,
  Wifi,
  Monitor
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

export default function Configuracoes() {
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    notifications: {
      courseUpdates: true,
      newCourses: true,
      achievements: true,
      emailDigest: false
    },
    privacy: {
      profileVisible: true,
      progressVisible: false,
      analyticsEnabled: true
    },
    appearance: {
      theme: theme,
      language: "pt-BR",
      fontSize: [14],
      animationsEnabled: true
    },
    audio: {
      volume: [75],
      soundEffects: true,
      voiceNarration: false
    },
    storage: {
      cacheSize: "2.4 GB",
      downloadQuality: "high",
      autoDownload: false
    }
  });

  // Sincronizar tema do hook com settings
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, theme }
    }));
  }, [theme]);

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const clearCache = () => {
    toast.success("Cache limpo com sucesso!");
  };

  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize sua experiência no MetaStation
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-brand-surface">
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          <TabsTrigger value="storage">Armazenamento</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Configurações de Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <Select 
                    value={settings.appearance.theme}
                    onValueChange={(value) => {
                      setTheme(value as "light" | "dark" | "auto");
                      setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, theme: value as "light" | "dark" | "auto" }
                      }));
                      toast.success("Tema alterado com sucesso!");
                    }}
                  >
                    <SelectTrigger className="bg-brand-input-bg border-brand-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Atualizações de Cursos</h3>
                    <p className="text-sm text-muted-foreground">Receber notificações sobre novos conteúdos</p>
                  </div>
                  <Switch
                    checked={settings.notifications.courseUpdates}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, courseUpdates: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Novos Cursos</h3>
                    <p className="text-sm text-muted-foreground">Ser notificado sobre cursos recém-lançados</p>
                  </div>
                  <Switch
                    checked={settings.notifications.newCourses}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, newCourses: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Conquistas</h3>
                    <p className="text-sm text-muted-foreground">Notificações sobre certificados e badges</p>
                  </div>
                  <Switch
                    checked={settings.notifications.achievements}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, achievements: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Resumo por Email</h3>
                    <p className="text-sm text-muted-foreground">Receber resumo semanal por email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailDigest}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailDigest: checked }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Perfil Público</h3>
                    <p className="text-sm text-muted-foreground">Permitir que outros vejam seu perfil</p>
                  </div>
                  <Switch
                    checked={settings.privacy.profileVisible}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, profileVisible: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Progresso Visível</h3>
                    <p className="text-sm text-muted-foreground">Mostrar seu progresso nos cursos</p>
                  </div>
                  <Switch
                    checked={settings.privacy.progressVisible}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, progressVisible: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Analytics</h3>
                    <p className="text-sm text-muted-foreground">Compartilhar dados para melhorar a experiência</p>
                  </div>
                  <Switch
                    checked={settings.privacy.analyticsEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, analyticsEnabled: checked }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Armazenamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Tamanho do Cache</h3>
                    <p className="text-sm text-muted-foreground">{settings.storage.cacheSize}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearCache}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Cache
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}