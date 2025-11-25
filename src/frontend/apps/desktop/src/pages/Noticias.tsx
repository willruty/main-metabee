import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, ArrowRight, Search } from "lucide-react"
import { getAllNews, News, getNewsImageUrl } from "../services/NewsService"

export default function BlogNoticias() {
    const navigate = useNavigate()
    const [news, setNews] = useState<News[]>([])
    const [filteredNews, setFilteredNews] = useState<News[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadNews = async () => {
            try {
                setIsLoading(true)
                setError(null)
                console.log("Carregando notícias...")
                const newsData = await getAllNews()
                console.log("Notícias carregadas:", newsData)
                
                if (newsData.news && newsData.news.length > 0) {
                    setNews(newsData.news)
                    console.log(`✅ ${newsData.news.length} notícias carregadas com sucesso`)
                } else {
                    setNews([])
                    console.warn("⚠️ Nenhuma notícia encontrada")
                    setError("Nenhuma notícia disponível no momento")
                }
            } catch (error: any) {
                console.error("❌ Erro ao carregar notícias:", error)
                setError(error.message || "Erro ao carregar notícias")
                setNews([])
            } finally {
                setIsLoading(false)
            }
        }
        loadNews()
    }, [])

    useEffect(() => {
        filterNews()
    }, [searchTerm, news])

    const filterNews = () => {
        let filtered = [...news]

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            filtered = filtered.filter(item =>
                (item.title && item.title.toLowerCase().includes(term)) ||
                (item.description && item.description.toLowerCase().includes(term)) ||
                (item.content && item.content.toLowerCase().includes(term)) ||
                (item.writer && item.writer.toLowerCase().includes(term)) ||
                (item.font && item.font.toLowerCase().includes(term))
            )
        }

        setFilteredNews(filtered)
    }

    const featuredNews = filteredNews.length > 0 ? filteredNews[0] : null
    const otherNews = filteredNews.slice(1)

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Data não disponível"
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-12">
            {/* Header com busca */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Notícias</h1>
                    <p className="text-muted-foreground mt-2">
                        Fique por dentro das últimas novidades em tecnologia
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar notícias..."
                        className="pl-10 w-64 bg-brand-input-bg border-brand-border"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">{error}</p>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Carregando notícias...</p>
                </div>
            ) : filteredNews.length > 0 ? (
                <>
                    {/* Hero - Matéria principal */}
                    {featuredNews && (
                        <div className="relative rounded-2xl overflow-hidden bg-brand-surface border border-brand-border">
                            <img
                                src={getNewsImageUrl(featuredNews._id, featuredNews.image, featuredNews.image_id)}
                                alt={featuredNews.title}
                                className="w-full h-72 object-cover opacity-80"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23ddd' width='800' height='400'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ESem imagem%3C/text%3E%3C/svg%3E"
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <Calendar className="h-4 w-4" /> {formatDate(featuredNews.date)}
                                    {featuredNews.writer && <span className="ml-2">• {featuredNews.writer}</span>}
                                </div>
                                <h1 className="text-3xl font-bold">{featuredNews.title}</h1>
                                <p className="text-gray-200">{featuredNews.description}</p>
                                <Button
                                    variant="secondary"
                                    className="mt-2"
                                    onClick={() => navigate(`/app/materia/${featuredNews._id}`)}
                                >
                                    Ler matéria
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Lista de notícias */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {otherNews.map((article) => {
                            const imageUrl = getNewsImageUrl(article._id, article.image, article.image_id)
                            return (
                                <Card
                                    key={article._id}
                                    className="bg-brand-surface border-brand-border hover:border-primary/50 transition-colors"
                                >
                                    {article.image && (
                                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                                            <img
                                                src={imageUrl}
                                                alt={article.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement
                                                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23ddd' width='400' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ESem imagem%3C/text%3E%3C/svg%3E"
                                                }}
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" /> {formatDate(article.date)}
                                        </div>
                                        <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="text-muted-foreground text-sm">{article.description}</p>
                                        {article.writer && (
                                            <p className="text-xs text-muted-foreground">Por {article.writer}</p>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/app/materia/${article._id}`)}
                                        >
                                            Ler mais
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Nenhuma notícia encontrada</p>
                </div>
            )}
        </div>
    )
}
