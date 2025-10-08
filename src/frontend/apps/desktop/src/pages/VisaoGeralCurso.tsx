import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, User } from "lucide-react"

export default function CursoDetalhe() {
    const navigate = useNavigate()

    // Simulação de dados do curso
    const curso = {
        id: 101,
        title: "Introdução à Inteligência Artificial",
        description:
            "Aprenda os fundamentos de IA, redes neurais e machine learning com exemplos práticos e conteúdo atualizado para o mercado de tecnologia.",
        price: "R$ 149,90",
        cargaHoraria: "12h de conteúdo",
        professor: "Carlos Eduardo",
        professorBio: "Engenheiro de Software e pesquisador em IA há 10 anos.",
        image:
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            {/* Imagem de capa */}
            <div className="rounded-2xl overflow-hidden border border-brand-border">
                <img
                    src={curso.image}
                    alt={curso.title}
                    className="w-full h-72 object-cover"
                />
            </div>

            {/* Título e descrição */}
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">{curso.title}</h1>
                <p className="text-muted-foreground text-lg">{curso.description}</p>

                {/* Info carga horária e professor */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-4 w-4" /> {curso.cargaHoraria}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <User className="h-4 w-4" /> {curso.professor}
                    </div>
                </div>
            </div>

            {/* Card lateral de compra */}
            <Card className="bg-brand-surface border-brand-border">
                <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6">
                    <div>
                        <p className="text-lg text-muted-foreground">Preço do curso</p>
                        <p className="text-3xl font-bold">{curso.price}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            className="px-6"
                            onClick={() => navigate("/app/checkout/")}
                        >
                            Comprar agora
                        </Button>
                        <Button
                            variant="outline"
                            className="px-6"
                            onClick={() => navigate("/app/downloads")}
                        >
                            Fazer download
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Bio do professor */}
            <div className="border-t pt-4 text-sm text-muted-foreground">
                <span className="font-semibold">{curso.professor}</span> –{" "}
                {curso.professorBio}
            </div>
        </div>
    )
}
