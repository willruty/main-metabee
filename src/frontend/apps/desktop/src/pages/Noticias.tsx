import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ArrowRight } from "lucide-react"

const featuredArticle = {
    id: 1,
    title: "Robótica Avança: Como IA Está Transformando o Setor Industrial",
    excerpt:
        "A integração de IA em robótica tem acelerado a produção e reduzido custos. Veja como empresas estão adotando essa revolução tecnológica.",
    image:
        "https://images.unsplash.com/photo-1581091215361-5c4c54d09b84?q=80&w=1200",
    date: "27 Set 2025",
}

const articles = [
    {
        id: 2,
        title: "Tendências de 2025 em Automação",
        excerpt:
            "Conheça as principais tendências do mercado de automação e como se preparar para o futuro.",
        date: "26 Set 2025",
    },
    {
        id: 3,
        title: "Impressão 3D em Escala Industrial",
        excerpt:
            "A impressão 3D está mudando a forma como produtos são fabricados, permitindo customização em massa.",
        date: "25 Set 2025",
    },
    {
        id: 4,
        title: "IA e Ética: O Debate Continua",
        excerpt:
            "Especialistas discutem os impactos éticos da implementação de sistemas autônomos em larga escala.",
        date: "24 Set 2025",
    },
    {
        id: 3,
        title: "Impressão 3D em Escala Industrial",
        excerpt:
            "A impressão 3D está mudando a forma como produtos são fabricados, permitindo customização em massa.",
        date: "25 Set 2025",
    },
    {
        id: 4,
        title: "IA e Ética: O Debate Continua",
        excerpt:
            "Especialistas discutem os impactos éticos da implementação de sistemas autônomos em larga escala.",
        date: "24 Set 2025",
    },
    {
        id: 3,
        title: "Impressão 3D em Escala Industrial",
        excerpt:
            "A impressão 3D está mudando a forma como produtos são fabricados, permitindo customização em massa.",
        date: "25 Set 2025",
    },
    {
        id: 4,
        title: "IA e Ética: O Debate Continua",
        excerpt:
            "Especialistas discutem os impactos éticos da implementação de sistemas autônomos em larga escala.",
        date: "24 Set 2025",
    },
    {
        id: 3,
        title: "Impressão 3D em Escala Industrial",
        excerpt:
            "A impressão 3D está mudando a forma como produtos são fabricados, permitindo customização em massa.",
        date: "25 Set 2025",
    },
    {
        id: 4,
        title: "IA e Ética: O Debate Continua",
        excerpt:
            "Especialistas discutem os impactos éticos da implementação de sistemas autônomos em larga escala.",
        date: "24 Set 2025",
    },
]

export default function BlogNoticias() {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            console.log("Token não encontrado, voltando para login")
            navigate("/login")
            return
        }

        fetch("http://192.168.0.203:8080/metabee/user/auth/validate", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Token inválido ou expirado")
                const contentType = res.headers.get("content-type")
                if (contentType?.includes("application/json")) {
                    const data = await res.json()
                    console.log("Token válido:", data)
                } else throw new Error("Resposta não é JSON")
            })
            .catch((err) => {
                console.error("Erro na validação do token:", err.message)
                navigate("/login")
            })
    }, [])

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-12">
            {/* Hero - Matéria principal */}
            <div className="relative rounded-2xl overflow-hidden bg-brand-surface border border-brand-border">
                <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-72 object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Calendar className="h-4 w-4" /> {featuredArticle.date}
                    </div>
                    <h1 className="text-3xl font-bold">{featuredArticle.title}</h1>
                    <p className="text-gray-200">{featuredArticle.excerpt}</p>
                    <Button
                        variant="secondary"
                        className="mt-2"
                        onClick={() => navigate(`/app/materia/`)} // ${featuredArticle.id}
                    >
                        Ler matéria
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>

            {/* Lista de notícias */}
            <div className="grid gap-6 md:grid-cols-3">
                {articles.map((article) => (
                    <Card
                        key={article.id}
                        className="bg-brand-surface border-brand-border hover:border-primary/50 transition-colors"
                    >
                        <CardHeader>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" /> {article.date}
                            </div>
                            <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-muted-foreground text-sm">{article.excerpt}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/app/materia/`)}
                            >
                                Ler mais
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
