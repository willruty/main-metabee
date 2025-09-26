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

export default function Configuracoes() {
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
      theme: "dark",
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

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const clearCache = () => {
    toast.success("Cache limpo com sucesso!");
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log("Token nao encontrado na home page, voltando para o login")
      navigate("/login")
      return
    }

    fetch("http://192.168.0.203:8080/metabee/user/auth/validate", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Token inválido ou expirado")
        }

        const contentType = res.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json()
          console.log("Token válido:", data)
        } else {
          throw new Error("Resposta não é JSON")
        }
      })
      .catch((err) => {
        console.error("Erro na validação do token:", err.message)
        navigate("/login")
      })
  }, [])

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
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-brand-surface">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Privacidade</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">Áudio</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            <span className="hidden sm:inline">Armazenamento</span>
          </TabsTrigger>
        </TabsList>

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
                Configurações de Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Perfil Público</h3>
                    <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu perfil</p>
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
                    <p className="text-sm text-muted-foreground">Mostrar seu progresso em cursos para outros</p>
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
                    <p className="text-sm text-muted-foreground">Compartilhar dados de uso para melhorias</p>
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
                  <Select value={settings.appearance.theme}>
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

                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select value={settings.appearance.language}>
                    <SelectTrigger className="bg-brand-input-bg border-brand-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tamanho da Fonte: {settings.appearance.fontSize[0]}px</Label>
                  <Slider
                    value={settings.appearance.fontSize}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, fontSize: value }
                      })
                    }
                    max={20}
                    min={12}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Animações</h3>
                    <p className="text-sm text-muted-foreground">Habilitar animações na interface</p>
                  </div>
                  <Switch
                    checked={settings.appearance.animationsEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, animationsEnabled: checked }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="space-y-6">
          <Card className="bg-brand-surface border-brand-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Configurações de Áudio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Volume Geral: {settings.audio.volume[0]}%</Label>
                  <Slider
                    value={settings.audio.volume}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        audio: { ...settings.audio, volume: value }
                      })
                    }
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Efeitos Sonoros</h3>
                    <p className="text-sm text-muted-foreground">Sons de notificação e interação</p>
                  </div>
                  <Switch
                    checked={settings.audio.soundEffects}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        audio: { ...settings.audio, soundEffects: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Narração de Voz</h3>
                    <p className="text-sm text-muted-foreground">Narração automática de textos</p>
                  </div>
                  <Switch
                    checked={settings.audio.voiceNarration}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        audio: { ...settings.audio, voiceNarration: checked }
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
                Configurações de Armazenamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Cache de Dados</h3>
                    <p className="text-sm text-muted-foreground">Tamanho atual: {settings.storage.cacheSize}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearCache}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Cache
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Qualidade de Download</Label>
                  <Select value={settings.storage.downloadQuality}>
                    <SelectTrigger className="bg-brand-input-bg border-brand-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa (720p)</SelectItem>
                      <SelectItem value="medium">Média (1080p)</SelectItem>
                      <SelectItem value="high">Alta (1440p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Download Automático</h3>
                    <p className="text-sm text-muted-foreground">Fazer download de novos conteúdos automaticamente</p>
                  </div>
                  <Switch
                    checked={settings.storage.autoDownload}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        storage: { ...settings.storage, autoDownload: checked }
                      })
                    }
                  />
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