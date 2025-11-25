import { useEffect, useState, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft } from "lucide-react"
import { getCourseLessons, getLessonVideo, Lesson } from "@/services/CourseService"
import { useToast } from "@/hooks/use-toast"

export default function Aula() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { toast } = useToast()
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(50)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
    const [videoSrc, setVideoSrc] = useState<string>("")
    const [loading, setLoading] = useState(true)

    const courseId = searchParams.get("courseId")
    const lessonId = searchParams.get("lessonId")

    useEffect(() => {
        if (courseId) {
            loadLessons()
        }
    }, [courseId])

    useEffect(() => {
        if (lessonId && lessons.length > 0) {
            const lesson = lessons.find(l => l.id === lessonId)
            if (lesson) {
                loadVideo(lesson)
            }
        } else if (lessons.length > 0) {
            loadVideo(lessons[0])
        }
    }, [lessonId, lessons])

    const loadLessons = async () => {
        if (!courseId) return

        try {
            setLoading(true)
            const response = await getCourseLessons(courseId)
            setLessons(response.lessons)
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao carregar aulas",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const loadVideo = async (lesson: Lesson) => {
        if (!courseId) return

        try {
            const response = await getLessonVideo(courseId, lesson.filename)
            setCurrentLesson(lesson)
            // No Electron, usar protocolo file:// ou custom protocol
            // Por enquanto, usar o caminho direto
            setVideoSrc(`file:///${response.file_path.replace(/\\/g, '/')}`)
        } catch (error: any) {
            toast({
                title: "Erro",
                description: error.message || "Erro ao carregar vídeo",
                variant: "destructive",
            })
        }
    }

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
            setDuration(videoRef.current.duration)
        }
    }

    const handleSeek = (value: number[]) => {
        if (videoRef.current) {
            videoRef.current.currentTime = value[0]
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Aula</h1>
                <p className="text-muted-foreground mt-2">
                    Assista à aula e acompanhe a descrição e avaliações.
                </p>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="mb-4"
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Voltar
            </Button>

            <Card className="bg-brand-surface border-brand-border">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="aspect-video bg-black relative flex items-center justify-center">
                            <span className="text-muted-foreground">Carregando vídeo...</span>
                        </div>
                    ) : videoSrc ? (
                        <>
                            <div className="aspect-video bg-black relative">
                                <video
                                    ref={videoRef}
                                    src={videoSrc}
                                    className="w-full h-full"
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleTimeUpdate}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={() => setIsPlaying(false)}
                                />
                            </div>

                            {/* Controles */}
                            <div className="p-4 space-y-3 bg-muted/40 border-t">
                                {/* Barra de progresso */}
                                <Slider
                                    value={[currentTime]}
                                    max={duration || 100}
                                    step={0.1}
                                    onValueChange={handleSeek}
                                    className="w-full"
                                />

                                {/* Controles inferiores */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" onClick={togglePlay}>
                                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            {formatTime(currentTime)} / {formatTime(duration)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 w-40">
                                        {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                        <Slider 
                                            value={[volume]} 
                                            max={100} 
                                            onValueChange={(val) => {
                                                setVolume(val[0])
                                                if (videoRef.current) {
                                                    videoRef.current.volume = val[0] / 100
                                                }
                                            }} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="aspect-video bg-black relative flex items-center justify-center">
                            <span className="text-muted-foreground">Nenhum vídeo disponível</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Lista de aulas */}
            {lessons.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Aulas do Curso</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {lessons.map((lesson, index) => (
                                <div
                                    key={lesson.id}
                                    className={`p-3 rounded-lg border cursor-pointer transition ${
                                        currentLesson?.id === lesson.id
                                            ? "bg-primary/10 border-primary"
                                            : "bg-muted/50 border-border hover:border-primary/50"
                                    }`}
                                    onClick={() => {
                                        navigate(`/app/aula?courseId=${courseId}&lessonId=${lesson.id}`)
                                        loadVideo(lesson)
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">
                                                {index + 1}. {lesson.title || lesson.filename}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {lesson.filename}
                                            </p>
                                        </div>
                                        {currentLesson?.id === lesson.id && (
                                            <Play className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {currentLesson && (
                <Card>
                    <CardHeader>
                        <CardTitle>{currentLesson.title || currentLesson.filename}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            {currentLesson.title || "Aula do curso"}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}
