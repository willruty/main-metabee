import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

export default function Pagamento() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(false)

    const handlePagamento = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            alert("Pagamento realizado com sucesso!")
            navigate("/app/homepage")
        }, 2000)
    }

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Finalizar compra</h1>
            <Card className="bg-brand-surface border-brand-border">
                <CardContent className="space-y-4 p-6">
                    <div>
                        <p className="text-lg">Curso selecionado</p>
                        <p className="text-xl font-semibold">Curso ID: {id}</p>
                    </div>

                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Nome no cartão"
                            className="w-full p-2 rounded-md border bg-background"
                        />
                        <input
                            type="text"
                            placeholder="Número do cartão"
                            className="w-full p-2 rounded-md border bg-background"
                        />
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="MM/AA"
                                className="flex-1 p-2 rounded-md border bg-background"
                            />
                            <input
                                type="text"
                                placeholder="CVV"
                                className="flex-1 p-2 rounded-md border bg-background"
                            />
                        </div>
                    </div>

                    <Button
                        className="w-full mt-4"
                        disabled={loading}
                        onClick={handlePagamento}
                    >
                        {loading ? "Processando..." : "Pagar agora"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
