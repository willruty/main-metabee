const BASE_API_URL = "http://localhost:8080";

export interface Profile {
    id: string;
    name: string;
    email: string;
    bio?: string;
    location?: string;
    created_at?: string;
    updated_at?: string;
    has_avatar?: boolean;
}

// Buscar perfil do usuário autenticado
export async function getProfile(): Promise<Profile | null> {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Token não encontrado");
        }

        const response = await fetch(`${BASE_API_URL}/metabee/user/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("authToken");
                throw new Error("Sessão expirada. Por favor, faça login novamente.");
            }
            throw new Error(`Erro ao buscar perfil: ${response.status}`);
        }

        const data = await response.json();
        return {
            id: data.id || "",
            name: data.name || "",
            email: data.email || "",
            bio: data.bio || "",
            location: data.location || "",
            created_at: data.created_at || "",
            updated_at: data.updated_at || "",
            has_avatar: data.has_avatar || false,
        };
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        throw error;
    }
}

// Obter URL da imagem de perfil (com cache busting)
export function getProfileImageUrl(): string {
    return `${BASE_API_URL}/metabee/user/profile/image?t=${Date.now()}`;
}

// Função auxiliar para obter headers de autenticação
export function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

// Atualizar perfil do usuário
export async function updateProfile(data: { name?: string; bio?: string; location?: string }): Promise<void> {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Token não encontrado");
        }

        const response = await fetch(`${BASE_API_URL}/metabee/user/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("authToken");
                throw new Error("Sessão expirada. Por favor, faça login novamente.");
            }
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ao atualizar perfil: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        throw error;
    }
}

// Upload de foto de perfil
export async function uploadProfileImage(file: File): Promise<void> {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("Token não encontrado");
        }

        // Validar tamanho (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error("Arquivo muito grande. Máximo 5MB");
        }

        // Validar tipo
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            throw new Error("Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP");
        }

        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch(`${BASE_API_URL}/metabee/user/profile/image`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("authToken");
                throw new Error("Sessão expirada. Por favor, faça login novamente.");
            }
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro ao fazer upload da imagem: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        throw error;
    }
}

