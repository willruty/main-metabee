export async function fetchDashboardData() {
    const token = localStorage.getItem("authToken");
    
    console.log("🔍 DashboardService: Verificando token...");
    console.log("🔍 DashboardService: Token existe?", !!token);
    console.log("🔍 DashboardService: Token length?", token?.length || 0);

    if (!token || token.trim() === "") {
        console.error("❌ DashboardService: Token não encontrado ou vazio");
        throw new Error("Token não encontrado. Faça login novamente.");
    }

    try {
        console.log("📡 DashboardService: Fazendo requisição para /metabee/dashboard/main");
        const response = await fetch("http://localhost:8080/metabee/dashboard/main", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("📡 DashboardService: Resposta recebida - Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ DashboardService: Erro ao buscar dashboard:", response.status, errorText);
            
            if (response.status === 401) {
                console.error("❌ DashboardService: Token inválido ou expirado");
                localStorage.removeItem("authToken");
                throw new Error("Sessão expirada. Faça login novamente.");
            }
            
            throw new Error(`Falha ao buscar dados do dashboard: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ DashboardService: Dados recebidos com sucesso");
        return data;
    } catch (error: any) {
        console.error("❌ DashboardService: Erro na requisição:", error);
        // Se o erro não for sobre token, relançar
        if (error.message && error.message.includes("Token não encontrado")) {
            throw error;
        }
        // Para outros erros, verificar se é um erro de rede
        if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new Error("Erro de conexão. Verifique se o servidor está rodando.");
        }
        throw error;
    }
}
