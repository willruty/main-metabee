import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Calendar, User, ArrowLeft, Clock, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getNewsById, News, getNewsImageUrl } from "../services/NewsService"

export default function BlogPost() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [article, setArticle] = useState<News | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadArticle = async () => {
            if (!id) {
                setError("ID da notícia não fornecido")
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                setError(null)
                console.log(`Carregando notícia com ID: ${id}`)
                const newsData = await getNewsById(id)
                
                if (newsData) {
                    setArticle(newsData)
                    console.log("Notícia carregada:", newsData)
                } else {
                    setError("Notícia não encontrada")
                }
            } catch (err: any) {
                console.error("Erro ao carregar notícia:", err)
                setError(err.message || "Erro ao carregar notícia")
            } finally {
                setIsLoading(false)
            }
        }

        loadArticle()
    }, [id])

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Data não disponível"
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        })
    }

    const formatTime = (dateString?: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground">Carregando matéria...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/app/noticias")}
                        className="mb-6 hover:bg-brand-surface"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar para notícias
                    </Button>
                    <Card className="bg-brand-surface border-brand-border">
                        <CardContent className="p-12 text-center">
                            <p className="text-red-500 text-lg">{error || "Notícia não encontrada"}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const imageUrl = getNewsImageUrl(article._id, article.image, article.image_id)

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header com botão voltar */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/app/noticias")}
                        className="hover:bg-brand-surface transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar para notícias
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Conteúdo principal */}
                    <article className="lg:col-span-8 space-y-8">
                        {/* Hero Section */}
                        <div className="space-y-6">
                            {/* Título */}
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                                    {article.title}
                                </h1>
                                
                                {article.description && (
                                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                                        {article.description}
                                    </p>
                                )}
                            </div>

                            {/* Meta informações */}
                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-brand-border">
                                {article.writer && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="p-1.5 bg-primary/10 rounded-full">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="font-medium">{article.writer}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="p-1.5 bg-primary/10 rounded-full">
                                        <Calendar className="h-4 w-4 text-primary" />
                                    </div>
                                    <span>{formatDate(article.date)}</span>
                                    {formatTime(article.date) && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatTime(article.date)}
                                        </span>
                                    )}
                                </div>
                                {article.font && (
                                    <Badge variant="secondary" className="gap-1">
                                        <Newspaper className="h-3 w-3" />
                                        {article.font}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Imagem de destaque */}
                        {(article.image || article.image_id) && (
                            <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-lg">
                                <img
                                    src={imageUrl}
                                    alt={article.title}
                                    className="w-full h-auto object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23ddd' width='800' height='400'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ESem imagem%3C/text%3E%3C/svg%3E"
                                    }}
                                />
                            </div>
                        )}

                        {/* Conteúdo do artigo */}
                        {article.content && (
                            <Card className="bg-brand-surface border-brand-border shadow-sm">
                                <CardContent className="p-8 md:p-12">
                                    <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg">
                                        <div className="space-y-6">
                                            {article.content.split('\n').map((paragraph, index) => (
                                                paragraph.trim() && (
                                                    <p 
                                                        key={index} 
                                                        className="text-foreground leading-8 text-base md:text-lg"
                                                    >
                                                        {paragraph.trim()}
                                                    </p>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Footer do artigo */}
                        <Card className="bg-brand-surface border-brand-border">
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    {article.writer && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">Autor</p>
                                                <p className="text-sm text-muted-foreground">{article.writer}</p>
                                            </div>
                                        </div>
                                    )}
                                    {article.font && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <Newspaper className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">Fonte</p>
                                                <p className="text-sm text-muted-foreground">{article.font}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3 pt-2 border-t border-brand-border">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Calendar className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Publicado em</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(article.date)} às {formatTime(article.date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </article>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-6">
                        <Card className="bg-brand-surface border-brand-border sticky top-8">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-semibold text-lg text-foreground">Informações</h3>
                                <div className="space-y-4">
                                    {article.writer && (
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                                Autor
                                            </p>
                                            <p className="text-sm text-foreground">{article.writer}</p>
                                        </div>
                                    )}
                                    {article.font && (
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                                Fonte
                                            </p>
                                            <p className="text-sm text-foreground">{article.font}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                            Data de Publicação
                                        </p>
                                        <p className="text-sm text-foreground">{formatDate(article.date)}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-brand-border">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => navigate("/app/noticias")}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Ver todas as notícias
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    )
}
