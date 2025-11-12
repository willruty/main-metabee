export async function fetchDashboardData() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Token não encontrado");
    }

    const response = await fetch("http://localhost:8080/metabee/dashboard/name", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Falha ao buscar dados do dashboard");
    }

    return await response.json();
}
