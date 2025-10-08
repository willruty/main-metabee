import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"

export default function ChatIA() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const navigate = useNavigate()

    const handleSend = async () => {
        if (!input.trim()) return
        const userMessage = { role: "user", content: input }
        setMessages((prev) => [...prev, userMessage])
        setInput("")

        try {
            const res = await fetch("http://192.168.0.203:8080/chat/ia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            })
            const data = await res.json()
            setMessages((prev) => [...prev, { role: "bot", content: data.reply }])
        } catch (err) {
            console.error("Erro no chat:", err)
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Assistente de IA</h1>
                <p className="text-muted-foreground mt-2">
                    Converse com o assistente inteligente em tempo real.
                </p>
            </div>

            <Card className="bg-brand-surface border-brand-border">
                <CardContent className="p-0">
                    <ScrollArea className="h-[400px] p-4 space-y-3">
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
                                    className={`px-3 py-2 rounded-xl max-w-[70%] ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-foreground"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                                {msg.role === "user" && (
                                    <User className="h-5 w-5 text-primary mt-1" />
                                )}
                            </div>
                        ))}
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
        </div>
    )
}
