import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Play } from "lucide-react"

const courseModules = [
    {
        id: 1,
        title: "Módulo 1 - Introdução",
        lessons: [
            { id: 101, title: "Boas-vindas e apresentação" },
            { id: 102, title: "Configuração do ambiente" },
            { id: 103, title: "Primeiros passos" }
        ]
    },
    {
        id: 2,
        title: "Módulo 2 - Fundamentos",
        lessons: [
            { id: 201, title: "Teoria essencial" },
            { id: 202, title: "Exercícios práticos" }
        ]
    },
    {
        id: 3,
        title: "Módulo 3 - Avançado",
        lessons: [
            { id: 301, title: "Truques e dicas avançadas" },
            { id: 302, title: "Projeto final" }
        ]
    }
]

export default function VisaoGeralCurso() {
    const [openModules, setOpenModules] = useState([]) // agora é array
    const navigate = useNavigate()

    const toggleModule = (id) => {
        setOpenModules((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Visão Geral do Curso</h1>
            <p className="text-muted-foreground">
                Veja todos os módulos e assista às aulas no seu ritmo.
            </p>

            <div className="border rounded-lg divide-y bg-brand-surface border-brand-border">
                {courseModules.map((modulo) => {
                    const isOpen = openModules.includes(modulo.id)
                    return (
                        <div key={modulo.id}>
                            {/* Cabeçalho do Módulo */}
                            <button
                                onClick={() => toggleModule(modulo.id)}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-primary/5 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    {isOpen ? (
                                        <ChevronDown className="h-4 w-4 text-primary" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-primary" />
                                    )}
                                    <span className="font-semibold text-foreground">{modulo.title}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {modulo.lessons.length} aulas
                                </span>
                            </button>

                            {/* Lista de aulas */}
                            {isOpen && (
                                <div className="border-t divide-y">
                                    {modulo.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className="flex items-center justify-between px-8 py-3 hover:bg-primary/5 transition-colors"
                                        >
                                            <span className="text-foreground">{lesson.title}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/app/aula?id=${lesson.id}`)}
                                            >
                                                <Play className="h-4 w-4 mr-2" />
                                                Assistir
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
