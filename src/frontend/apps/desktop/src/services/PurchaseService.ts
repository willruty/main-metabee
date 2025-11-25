const BASE_API_URL = "http://localhost:8080";

export interface Purchase {
    purchase_id: string;
    course_id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    duration: number;
    status: "pending" | "downloading" | "downloaded" | "error";
    drive_link: string;
    local_path?: string;
    created_at: string;
}

export interface MyCoursesResponse {
    courses: Purchase[];
}

export async function purchaseCourse(courseId: string): Promise<Purchase> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("Token não encontrado");
    }

    const response = await fetch(`${BASE_API_URL}/metabee/purchase/course`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ course_id: courseId }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Erro ao comprar curso");
    }

    return await response.json();
}

export async function getMyCourses(): Promise<MyCoursesResponse> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
    }

    try {
        const response = await fetch(`${BASE_API_URL}/metabee/purchase/my-courses`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro ao buscar meus cursos:", response.status, errorText);
            
            if (response.status === 401) {
                localStorage.removeItem("authToken");
                throw new Error("Sessão expirada. Faça login novamente.");
            }
            
            throw new Error(`Erro ao buscar cursos: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error("Erro na requisição getMyCourses:", error);
        throw error;
    }
}

export async function updateDownloadStatus(
    purchaseId: string,
    status: "downloading" | "downloaded" | "error",
    localPath?: string
): Promise<void> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("Token não encontrado");
    }

    const body: any = {
        purchase_id: purchaseId,
        status,
    };

    if (localPath) {
        body.local_path = localPath;
    }

    const response = await fetch(`${BASE_API_URL}/metabee/purchase/download-status`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error("Erro ao atualizar status do download");
    }
}

