import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"
import geminiLogo from "../assets/gemini.png"

// Função para dividir a resposta do n8n em múltiplas mensagens
function splitResponse(text: string): string[] {
    if (!text || typeof text !== 'string') {
        return []
    }
    
    // Delimitadores: ponto, exclamação ou interrogação seguidos de espaço
    const delimiters = /(?<=\.\s)|(?<=!\s)|(?<=\?\s)/
    
    return text
        .split(delimiters)
        .map(item => item.trim())
        .filter(item => item.length > 0)
}

export default function ChatIA() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const navigate = useNavigate()
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Função para fazer scroll até o final
    const scrollToBottom = () => {
        // Tentar usar scrollIntoView primeiro
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
        }
        
        // Alternativa usando o ScrollArea
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }

    // Scroll automático quando mensagens mudam ou quando está digitando
    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    // Função para adicionar mensagem com efeito de digitação
    const addTypingMessage = async (text: string, delayBetweenMessages: number = 500) => {
        setIsTyping(true)
        
        // Adicionar mensagem vazia inicialmente
        setMessages((prev) => {
            const newMessages = [...prev, { role: "bot", content: "" }]
            return newMessages
        })
        
        // Aguardar um frame para garantir que o estado foi atualizado
        await new Promise(resolve => setTimeout(resolve, 10))
        
        // Simular digitação caractere por caractere
        for (let i = 0; i <= text.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 30)) // Delay entre caracteres (30ms)
            setMessages((prev) => {
                const newMessages = [...prev]
                const lastIndex = newMessages.length - 1
                if (newMessages[lastIndex] && newMessages[lastIndex].role === "bot") {
                    newMessages[lastIndex] = {
                        role: "bot",
                        content: text.substring(0, i)
                    }
                }
                return newMessages
            })
            // Scroll durante a digitação
            scrollToBottom()
        }
        
        setIsTyping(false)
        
        // Delay antes da próxima mensagem
        if (delayBetweenMessages > 0) {
            await new Promise(resolve => setTimeout(resolve, delayBetweenMessages))
        }
    }

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = { role: "user", content: input }
        setMessages((prev) => [...prev, userMessage])
        const currentInput = input
        setInput("")

        // Adicionar mensagem de carregamento
        const loadingMessage = { role: "bot", content: "Processando..." }
        setMessages((prev) => [...prev, loadingMessage])
        const loadingIndex = messages.length + 1

        try {
            const n8nUrl = "https://n8n.zenitoficial.com.br/webhook/gemini"

            // Pegar as últimas 5 mensagens do usuário para contexto
            const userMessages = messages
                .filter((msg: any) => msg.role === "user")
                .slice(-5)
                .map((msg: any) => msg.content)

            const res = await fetch(n8nUrl, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ 
                    message: currentInput,
                    context: userMessages
                }),
            })

            if (!res.ok) {
                const errorText = await res.text().catch(() => "")
                throw new Error(`HTTP ${res.status}: ${errorText || "Erro na requisição"}`)
            }

            const data = await res.json()
            
            // Processar a resposta do n8n (equivalente a $input.first().json.output)
            let callback = data.output || data.json?.output || data.message || data.text || ""
            callback = callback.replace(/\*\*/g, "").replace(/\*/g, "");
            const splitMessages = splitResponse(callback)
            
            // Remover mensagem de carregamento
            setMessages((prev) => prev.filter((_, idx) => idx !== loadingIndex))
            
            // Adicionar todas as mensagens divididas com efeito de digitação
            if (splitMessages.length > 0) {
                for (let i = 0; i < splitMessages.length; i++) {
                    await addTypingMessage(splitMessages[i], i < splitMessages.length - 1 ? 500 : 0)
                }
            } else {
                // Se não conseguiu dividir, adiciona a resposta completa com efeito de digitação
                await addTypingMessage(callback || "Sem resposta da IA.")
            }
        } catch (err: any) {
            console.error("Erro no chat:", err)

            // Remover mensagem de carregamento
            setMessages((prev) => prev.filter((_, idx) => idx !== loadingIndex))

            let errorMessage = "Erro desconhecido"
            if (err.message) {
                errorMessage = err.message
            } else if (err.name === "TypeError" && err.message.includes("fetch")) {
                errorMessage = "Erro de conexão. Verifique sua internet ou se o serviço está disponível."
            }

            setMessages((prev) => [
                ...prev,
                { role: "bot", content: `❌ Erro ao conectar à IA: ${errorMessage}` },
            ])
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto mt-10">
            <div>
                <h1 className="text-3xl font-bold text-foreground"><span className="text-primary">MetaAgent</span> - Assistente de IA</h1>
                <p className="text-muted-foreground mt-2">
                    Converse com o assistente inteligente em tempo real e tire suas dúvidas sobre a plataforma.
                </p>
            </div>

            <Card className="bg-brand-surface border-brand-border mt-10">
                <CardContent className="p-0">
                    <ScrollArea ref={scrollAreaRef} className="h-[400px] p-4 space-y-3">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-2 items-start ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {msg.role === "bot" && (
                                    <Bot className="h-5 w-5 text-primary mt-1" />
                                )}
                                <div
                                    className={`px-3 py-2 my-1 rounded-xl max-w-[70%] ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-foreground"
                                        }`}
                                >
                                    {msg.content}
                                    {msg.role === "bot" && isTyping && idx === messages.length - 1 && (
                                        <span className="inline-block w-2 h-5 ml-1 bg-current animate-pulse">|</span>
                                    )}
                                </div>
                                {msg.role === "user" && (
                                    <User className="h-5 w-5 text-primary mt-1" />
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </ScrollArea>

                    <div className="flex border-t border-border p-3 gap-2">
                        <Input
                            placeholder="Digite sua mensagem..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <Button onClick={handleSend}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <div className="flex items-center gap-2">
                <p className="text-muted-foreground">Powered by Gemini</p>
                <img src={geminiLogo} className="w-5 h-5" alt="logo da IA usada" />
            </div>
        </div>
    )
}
