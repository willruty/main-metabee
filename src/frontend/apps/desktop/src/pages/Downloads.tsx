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
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 py-8 px-6">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* HEADER */}
                <div className="border-b border-zinc-800 pb-4">
                    <h1 className="text-3xl font-bold text-yellow-400 tracking-tight">
                        Downloads
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Gerencie seus downloads em andamento ou visualize os concluídos.
                    </p>
                </div>

                {/* DOWNLOAD ATUAL */}
                {activeDownloads.length > 0 && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg">
                        {activeDownloads.map((item) => (
                            <div key={item.id} className="flex flex-col md:flex-row border border-zinc-800">
                                {/* CAPA DO ITEM */}
                                <div className="w-full h-48 md:w-1/4 relative bg-zinc-800">
                                    {item.thumbnail ? (
                                        <img
                                            src={item.thumbnail}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                            Sem imagem
                                        </div>
                                    )}
                                </div>

                                {/* CONTEÚDO */}
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{item.name}</h2>
                                        <p className="text-sm text-zinc-400 mt-1">
                                            {'35.6 GB'} • {'11.7 MB/s'} •{' '}
                                            {'45:24 restantes'}
                                        </p>

                                        {/* Barra de progresso estilo Steam */}
                                        <div className="mt-4 h-2 bg-zinc-800 rounded overflow-hidden">
                                            <div
                                                className="h-2 bg-yellow-400 transition-all"
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-2">
                                            {item.progress}% concluído
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-end gap-3">
                                        {item.status === 'downloading' && (
                                            <button className="p-2 bg-yellow-400/10 border border-yellow-400/30 rounded hover:bg-yellow-400/20 transition">
                                                <Pause className="h-5 w-5 text-yellow-400" />
                                            </button>
                                        )}
                                        {item.status === 'paused' && (
                                            <button className="p-2 bg-yellow-400/10 border border-yellow-400/30 rounded hover:bg-yellow-400/20 transition">
                                                <Play className="h-5 w-5 text-yellow-400" />
                                            </button>
                                        )}
                                        <button className="p-2 bg-red-500/10 border border-red-500/30 rounded hover:bg-red-500/20 transition">
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* UP NEXT */}
                <div>
                    <h2 className="text-lg font-semibold text-yellow-400 mb-3">
                        Próximos na fila
                    </h2>
                    {loading ? (
                        <p className="text-zinc-500 text-sm">Carregando...</p>
                    ) : queuedDownloads.length === 0 ? (
                        <p className="text-zinc-500 text-sm">Nenhum download pendente.</p>
                    ) : (
                        <div className="space-y-3">
                            {queuedDownloads.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:border-yellow-400/40 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.name}
                                                className="w-16 h-10 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-16 h-10 bg-zinc-800 rounded flex items-center justify-center text-zinc-500 text-xs">
                                                Sem img
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-white">{item.name}</p>
                                            <p className="text-xs text-zinc-500">Aguardando download</p>
                                        </div>
                                    </div>
                                    <button className="p-2 bg-yellow-400/10 border border-yellow-400/30 rounded hover:bg-yellow-400/20 transition">
                                        <Download className="h-4 w-4 text-yellow-400" />
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
