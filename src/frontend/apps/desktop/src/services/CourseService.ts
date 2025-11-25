const BASE_API_URL = "http://localhost:8080";

export interface Course {
    _id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    duration: number;
    drive_link: string;
    price: number;
    grade?: number;
    created_at?: string;
    updated_at?: string;
}

export interface CourseResponse {
    courses: Course[];
}

export interface Lesson {
    id: string;
    filename: string;
    title: string;
    order: number;
    path: string;
}

export interface CourseLessonsResponse {
    course_id: string;
    lessons: Lesson[];
    local_path: string;
}

export interface LessonVideoResponse {
    file_path: string;
    file_name: string;
    local_path: string;
}

// Helper para obter URL da imagem do curso
export function getCourseImageUrl(courseId: string, imagePath?: string): string {
    // Se a imagem for um caminho relativo que começa com /images/, usar o endpoint de imagens
    if (imagePath && imagePath.startsWith('/images/')) {
        // Extrair o nome do arquivo (ex: /images/course-robotics.jpg -> course-robotics.jpg)
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
    
    // Caso contrário, usar o endpoint do backend para buscar a imagem binária do curso (fallback)
    return `${BASE_API_URL}/metabee/marketplace/courses/${courseId}/image`;
}

// Dados mock de cursos
const mockCourses: Course[] = [
    {
        _id: "1",
        title: "Desenvolvimento Web Moderno",
        description: "Domine React, TypeScript, Next.js e as tecnologias mais demandadas do mercado. Aprenda do zero ao avançado com projetos reais.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
        category: "Desenvolvimento",
        duration: 40,
        price: 497.00,
        drive_link: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        _id: "2",
        title: "Inteligência Artificial e Machine Learning",
        description: "Construa modelos de IA, aprenda deep learning e integre machine learning em suas aplicações. Do básico ao avançado.",
        image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop",
        category: "IA & Data Science",
        duration: 60,
        price: 697.00,
        drive_link: "",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        _id: "3",
        title: "Design UX/UI Completo",
        description: "Crie interfaces incríveis e experiências de usuário memoráveis. Aprenda Figma, design systems e prototipação avançada.",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
        category: "Design",
        duration: 35,
        price: 397.00,
        drive_link: "",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
        _id: "4",
        title: "DevOps e Cloud Computing",
        description: "Automatize deployments, gerencie infraestrutura na nuvem e domine Docker, Kubernetes, AWS e CI/CD.",
        image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop",
        category: "DevOps",
        duration: 45,
        price: 597.00,
        drive_link: "",
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date(Date.now() - 259200000).toISOString()
    },
    {
        _id: "5",
        title: "Mobile Development com React Native",
        description: "Desenvolva apps nativos para iOS e Android usando React Native. Aprenda desde o setup até publicação nas stores.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
        category: "Mobile",
        duration: 50,
        price: 547.00,
        drive_link: "",
        created_at: new Date(Date.now() - 345600000).toISOString(),
        updated_at: new Date(Date.now() - 345600000).toISOString()
    }
];

// Função auxiliar para normalizar tipos numéricos que podem vir do MongoDB
function normalizeCourse(course: any): Course {
    return {
        _id: course._id || course.id || "",
        title: course.title || "",
        description: course.description || "",
        image: course.image || "",
        category: course.category || "",
        duration: typeof course.duration === 'number' 
            ? course.duration 
            : (typeof course.duration === 'string' ? parseInt(course.duration) || 0 : 0),
        drive_link: course.drive_link || course.driveLink || "",
        price: typeof course.price === 'number' 
            ? course.price 
            : (typeof course.price === 'string' ? parseFloat(course.price) || 0 : 0),
        grade: typeof course.grade === 'number' 
            ? course.grade 
            : (typeof course.grade === 'string' ? parseFloat(course.grade) || undefined : undefined),
        created_at: course.created_at || course.createdAt || undefined,
        updated_at: course.updated_at || course.updatedAt || undefined,
    };
}

// Buscar todos os cursos disponíveis do backend
export async function getAllCourses(): Promise<CourseResponse> {
    try {
        const response = await fetch(`${BASE_API_URL}/metabee/marketplace/courses`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar cursos: ${response.status}`);
        }

        const data = await response.json();
        const courses = (data.courses || []).map(normalizeCourse);
        
        return {
            courses: courses
        };
    } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        // Em caso de erro, retornar array vazio
        return {
            courses: []
        };
    }
}

// Interface para estatísticas do marketplace
export interface MarketplaceStats {
    total_courses: number;
    average_rating: number;
    total_students: number;
}

// Buscar estatísticas do marketplace
export async function getMarketplaceStats(): Promise<MarketplaceStats> {
    try {
        const response = await fetch(`${BASE_API_URL}/metabee/marketplace/stats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar estatísticas: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        // Retornar valores padrão em caso de erro
        return {
            total_courses: 0,
            average_rating: 0,
            total_students: 0,
        };
    }
}

export async function getCourseLessons(courseId: string): Promise<CourseLessonsResponse> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("Token não encontrado");
    }

    const response = await fetch(`${BASE_API_URL}/metabee/courses/${courseId}/lessons`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Erro ao buscar aulas");
    }

    return await response.json();
}

export async function getLessonVideo(courseId: string, lessonFile: string): Promise<LessonVideoResponse> {
    const token = localStorage.getItem("authToken");
    if (!token) {
        throw new Error("Token não encontrado");
    }

    const response = await fetch(`${BASE_API_URL}/metabee/courses/${courseId}/lesson/${encodeURIComponent(lessonFile)}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Erro ao buscar vídeo");
    }

    return await response.json();
}
