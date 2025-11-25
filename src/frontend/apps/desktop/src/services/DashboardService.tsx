export async function fetchDashboardData() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
    }

    try {
        const response = await fetch("http://localhost:8080/metabee/dashboard/main", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro ao buscar dashboard:", response.status, errorText);
            
            if (response.status === 401) {
                localStorage.removeItem("authToken");
                throw new Error("Sessão expirada. Faça login novamente.");
            }
            
            throw new Error(`Falha ao buscar dados do dashboard: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error("Erro na requisição fetchDashboardData:", error);
        throw error;
    }
}
