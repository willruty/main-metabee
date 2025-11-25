// Helper para fazer requisições com autenticação automática
const BASE_API_URL = "http://localhost:8080";

export interface ApiOptions extends RequestInit {
    requireAuth?: boolean;
}

export async function apiRequest<T>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const { requireAuth = false, headers = {}, ...fetchOptions } = options;

    const requestHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...headers,
    };

    // Adicionar token se necessário
    if (requireAuth) {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Token não encontrado. Faça login novamente.");
        }
        requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_API_URL}${endpoint}`, {
        ...fetchOptions,
        headers: requestHeaders,
    });

    if (!response.ok) {
        // Tentar ler mensagem de erro
        let errorMessage = `Erro HTTP ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
            // Se não conseguir fazer parse, usar status text
            errorMessage = response.statusText || errorMessage;
        }

        // Se for 401, pode ser token expirado
        if (response.status === 401) {
            // Limpar token inválido
            localStorage.removeItem("authToken");
            throw new Error("Sessão expirada. Faça login novamente.");
        }

        throw new Error(errorMessage);
    }

    // Se a resposta for vazia, retornar objeto vazio
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        return {} as T;
    }

    return await response.json();
}

