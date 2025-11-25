import { useState, useEffect } from "react"
import { Pause, Play, Trash2, Download } from "lucide-react"
import { getMyCourses, Purchase } from "@/services/PurchaseService"
import { useToast } from "@/hooks/use-toast"

interface DownloadItem {
    id: string
    name: string
    progress: number
    status: "downloading" | "paused" | "completed" | "error" | "pending"
    thumbnail?: string
    purchaseId: string
    courseId: string
}

export default function Downloads() {
    const { toast } = useToast()
    const [downloads, setDownloads] = useState<DownloadItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadDownloads()
    }, [])

    const loadDownloads = async () => {
        try {
            setLoading(true)
            const response = await getMyCourses()
            
            const downloadItems: DownloadItem[] = response.courses.map((course: Purchase) => ({
                id: course.purchase_id,
                name: course.title,
                progress: course.status === "downloaded" ? 100 : 
                         course.status === "downloading" ? 50 : 0,
                status: course.status === "downloaded" ? "completed" : 
                       course.status === "downloading" ? "downloading" :
                       course.status === "error" ? "error" : "pending",
                purchaseId: course.purchase_id,
                courseId: course.course_id,
            }))

            setDownloads(downloadItems)
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao carregar downloads",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const activeDownloads = downloads.filter(
        (item) => item.status === "downloading" || item.status === "paused"
    )
    const completedDownloads = downloads.filter((item) => item.status === "completed")
    const queuedDownloads = downloads.filter((item) => item.status === "pending")

    return (
        <div className="min-h-screen bg-background text-foreground py-8 px-6">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* HEADER */}
                <div className="border-b border-brand-border pb-4">
                    <h1 className="text-3xl font-bold text-primary tracking-tight">
                        Downloads
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Gerencie seus downloads em andamento ou visualize os concluídos.
                    </p>
                </div>

                {/* DOWNLOAD ATUAL */}
                {activeDownloads.length > 0 && (
                    <div className="bg-brand-surface border border-brand-border rounded-lg overflow-hidden shadow-lg">
                        {activeDownloads.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row border-b border-brand-border last:border-b-0">
                                {/* CAPA DO ITEM */}
                                <div className="w-full h-48 md:w-1/4 relative bg-brand-input-bg">
                                    {item.thumbnail ? (
                                        <img
                                            src={item.thumbnail}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            Sem imagem
                                        </div>
                                    )}
                                </div>

                                {/* CONTEÚDO */}
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">{item.name}</h2>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {'35.6 GB'} • {'11.7 MB/s'} •{' '}
                                            {'45:24 restantes'}
                                        </p>

                                        {/* Barra de progresso estilo Steam */}
                                        <div className="mt-4 h-2 bg-brand-input-bg rounded overflow-hidden">
                                            <div
                                                className="h-2 bg-primary transition-all"
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {item.progress}% concluído
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end gap-3">
                                        {item.status === 'downloading' && (
                                            <button className="p-2 bg-primary/10 border border-primary/30 rounded hover:bg-primary/20 transition">
                                                <Pause className="h-5 w-5 text-primary" />
                                            </button>
                                        )}
                                        {item.status === 'paused' && (
                                            <button className="p-2 bg-primary/10 border border-primary/30 rounded hover:bg-primary/20 transition">
                                                <Play className="h-5 w-5 text-primary" />
                                            </button>
                                        )}
                                        <button className="p-2 bg-destructive/10 border border-destructive/30 rounded hover:bg-destructive/20 transition">
                                            <Trash2 className="h-5 w-5 text-destructive" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* DOWNLOADS COMPLETOS */}
                {completedDownloads.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-primary mb-3">
                            Downloads Concluídos
                        </h2>
                        <div className="space-y-3">
                            {completedDownloads.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between bg-brand-surface border border-brand-border rounded-lg p-3 hover:border-primary/40 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.name}
                                                className="w-16 h-10 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-10 bg-brand-input-bg rounded flex items-center justify-center text-muted-foreground text-xs">
                                                Sem img
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-foreground">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Download concluído</p>
                                        </div>
                                    </div>
                                    <button className="p-2 bg-destructive/10 border border-destructive/30 rounded hover:bg-destructive/20 transition">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* UP NEXT */}
                <div>
                    <h2 className="text-lg font-semibold text-primary mb-3">
                        Próximos na fila
                    </h2>
                    {loading ? (
                        <p className="text-muted-foreground text-sm">Carregando...</p>
                    ) : queuedDownloads.length === 0 ? (
                        <p className="text-muted-foreground text-sm">Nenhum download pendente.</p>
                    ) : (
                        <div className="space-y-3">
                            {queuedDownloads.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between bg-brand-surface border border-brand-border rounded-lg p-3 hover:border-primary/40 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.name}
                                                className="w-16 h-10 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-10 bg-brand-input-bg rounded flex items-center justify-center text-muted-foreground text-xs">
                                                Sem img
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-foreground">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Aguardando download</p>
                                        </div>
                                    </div>
                                    <button className="p-2 bg-primary/10 border border-primary/30 rounded hover:bg-primary/20 transition">
                                        <Download className="h-4 w-4 text-primary" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
