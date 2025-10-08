import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Calendar, User } from "lucide-react"

export default function BlogPost() {
    const navigate = useNavigate()
    const { id } = useParams()

    // Simulação de fetch de artigo (substituir por API)
    const article = {
        id,
        title: "Robótica Avança: Como IA Está Transformando o Setor Industrial",
        subtitle:
            "Integração entre inteligência artificial e automação está criando fábricas mais inteligentes e eficientes do que nunca.",
        content1:
            "A indústria 4.0 vem passando por um processo acelerado de digitalização e automação. Sistemas de IA já são capazes de prever falhas em máquinas antes que aconteçam, otimizando linhas de produção e reduzindo custos. Empresas de todos os portes estão investindo em soluções que integram robôs, sensores e plataformas de análise de dados para melhorar seus processos.",
        image:
            "https://images.unsplash.com/photo-1581091215361-5c4c54d09b84?q=80&w=1200",
        content2:
            "De acordo com especialistas, o próximo passo será a criação de sistemas autônomos capazes de tomar decisões em tempo real, adaptando a produção de acordo com a demanda. Isso promete reduzir desperdícios e aumentar a personalização dos produtos em escala. O futuro da indústria será marcado por fábricas conectadas, autoajustáveis e altamente inteligentes.",
        author: "Mariana Silva",
        date: "27 Set 2025",
        source: "TechNews Global",
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            {/* Cabeçalho da matéria */}
            <h1 className="text-3xl md:text-4xl font-bold">{article.title}</h1>
            <h2 className="text-lg md:text-xl text-muted-foreground">
                {article.subtitle}
            </h2>

            {/* Info autor e data */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {article.author}
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {article.date}
                </div>
            </div>

            {/* Imagem */}
            <div className="rounded-2xl overflow-hidden border border-brand-border">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full object-cover"
                />
            </div>

            {/* Conteúdo */}
            <p className="leading-relaxed text-lg">{article.content1}</p>
            <p className="leading-relaxed text-lg">{article.content2}</p>

            {/* Fonte */}
            <div className="text-xs text-muted-foreground border-t pt-3">
                Fonte: {article.source}
            </div>
        </div>
    )
}
