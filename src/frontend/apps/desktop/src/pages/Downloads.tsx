import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Download, Pause, Play, Trash2 } from "lucide-react"

export default function Downloads() {
    const navigate = useNavigate()
    const [downloads, setDownloads] = useState([
        { id: 1, name: "Aula 1 - Introdução", progress: 90, status: "downloading" },
        { id: 2, name: "PDF - Guia do Curso", progress: 100, status: "completed" },
        { id: 3, name: "Exercícios Extras", progress: 100, status: "completed" },
        { id: 4, name: "Aula 2 - Conceitos Avançados", progress: 100, status: "completed" },
        { id: 5, name: "Checklist do Projeto", progress: 100, status: "completed" },
        { id: 6, name: "Slides Complementares", progress: 100, status: "completed" },
        { id: 7, name: "Template de Código", progress: 20, status: "paused" },
    ])

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) navigate("/login")
    }, [])

    const activeDownloads = downloads.filter(
        (item) => item.status === "downloading" || item.status === "paused"
    )
    const completedDownloads = downloads.filter((item) => item.status === "completed")

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Downloads</h1>
                <p className="text-muted-foreground">
                    Gerencie seus downloads em andamento ou visualize os concluídos.
                </p>
            </div>

            {/* Seção de downloads em andamento */}
            {activeDownloads.length > 0 && (
                <Card className="bg-brand-surface border-brand-border">
                    <CardHeader>
                        <CardTitle className="text-lg">Em andamento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeDownloads.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between bg-muted/30 rounded-lg p-4"
                            >
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground">{item.name}</p>
                                    <Progress value={item.progress} className="mt-2" />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {item.progress}% concluído
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 px-4">
                                    {item.status === "downloading" && (
                                        <Button size="icon" variant="outline">
                                            <Pause className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {item.status === "paused" && (
                                        <Button size="icon" variant="outline">
                                            <Play className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button size="icon" variant="destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Grid de downloads concluídos */}
            <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Concluídos</h2>
                {completedDownloads.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhum download concluído ainda.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {completedDownloads.map((item) => (
                            <Card
                                key={item.id}
                                className="bg-brand-surface border-brand-border hover:border-primary transition"
                            >
                                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                    <Download className="h-8 w-8 text-primary mb-2" />
                                    <p className="font-semibold">{item.name}</p>
                                    <Button size="sm" className="mt-3 w-full">
                                        Abrir
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
