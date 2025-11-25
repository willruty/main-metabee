const BASE_API_URL = "http://localhost:8080";

export interface News {
    _id: string;
    title: string;
    date?: string;
    description: string;
    content: string;
    font?: string;
    writer?: string;
    image?: string;
    image_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface NewsResponse {
    news: News[];
}

// Helper para obter URL da imagem da notícia
export function getNewsImageUrl(newsId: string, imagePath?: string, imageId?: string): string {
    // Se a imagem for um caminho relativo que começa com /images/, usar o endpoint de imagens
    if (imagePath && imagePath.startsWith('/images/')) {
        const imageName = imagePath.replace('/images/', '');
        return `${BASE_API_URL}/images/${imageName}`;
    }
    
    // Se a imagem for apenas o nome do arquivo (sem /images/), adicionar o prefixo
    if (imagePath && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
        return `${BASE_API_URL}/images/${imagePath}`;
    }
    
    // Se a imagem for uma URL completa, usar ela
    if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
        return imagePath;
    }
    
    // Caso contrário, usar o endpoint do backend para buscar a imagem binária da notícia
    return `${BASE_API_URL}/metabee/news/${newsId}/image`;
}

// Função auxiliar para normalizar tipos
function normalizeNews(news: any): News {
    return {
        _id: news._id || news.id || "",
        title: news.title || "",
        date: news.date || undefined,
        description: news.description || "",
        content: news.content || "",
        font: news.font || undefined,
        writer: news.writer || undefined,
        image: news.image || undefined,
        image_id: news.image_id || news.imageId || undefined,
        created_at: news.created_at || news.createdAt || undefined,
        updated_at: news.updated_at || news.updatedAt || undefined,
    };
}

// Buscar todas as notícias
export async function getAllNews(): Promise<NewsResponse> {
    try {
        console.log(`🔍 Buscando notícias em: ${BASE_API_URL}/metabee/news`);
        const response = await fetch(`${BASE_API_URL}/metabee/news`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log(`📡 Resposta recebida: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Erro HTTP ${response.status}:`, errorText);
            throw new Error(`Erro ao buscar notícias: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("📦 Dados recebidos:", data);
        const news = (data.news || []).map(normalizeNews);
        console.log(`✅ ${news.length} notícias normalizadas`);
        return { news: news };
    } catch (error) {
        console.error("❌ Erro ao buscar notícias:", error);
        return { news: [] };
    }
}

// Buscar últimas notícias
export async function getLastNews(limit: number = 5): Promise<NewsResponse> {
    try {
        const response = await fetch(`${BASE_API_URL}/metabee/news/last`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar últimas notícias: ${response.status}`);
        }

        const data = await response.json();
        const news = (data.news || []).map(normalizeNews);
        return { news: news };
    } catch (error) {
        console.error("Erro ao buscar últimas notícias:", error);
        return { news: [] };
    }
}

// Buscar notícia por ID
export async function getNewsById(newsId: string): Promise<News | null> {
    try {
        console.log(`🔍 Buscando notícia com ID: ${newsId}`);
        const response = await fetch(`${BASE_API_URL}/metabee/news/${newsId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log(`📡 Resposta recebida: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Erro HTTP ${response.status}:`, errorText);
            throw new Error(`Erro ao buscar notícia: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("📦 Dados recebidos:", data);
        
        // O backend retorna { "news": NewsDao } ou diretamente NewsDao
        const newsData = data.news || data;
        return normalizeNews(newsData);
    } catch (error) {
        console.error("❌ Erro ao buscar notícia:", error);
        return null;
    }
}

