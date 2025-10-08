import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { useState } from "react"

export default function Aula() {
    const navigate = useNavigate()
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(50)

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Aula</h1>
                <p className="text-muted-foreground mt-2">
                    Assista à aula e acompanhe a descrição e avaliações.
                </p>
            </div>

            <Card className="bg-brand-surface border-brand-border">
                <CardContent className="p-0">
                    <div className="aspect-video bg-black relative flex items-center justify-center">
                        <span className="text-muted-foreground">[Vídeo Placeholder]</span>
                    </div>

                    {/* HUD de controle */}
                    <div className="flex items-center justify-between p-3 bg-muted/40 border-t">
                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="outline">
                                <Maximize className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 w-40">
                            {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                            <Slider value={[volume]} max={100} onValueChange={(val) => setVolume(val[0])} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Aqui vai a descrição da aula, materiais de apoio e informações relevantes.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
