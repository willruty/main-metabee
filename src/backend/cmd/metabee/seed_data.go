package main

import (
	"context"
	"log"
	"metabee/internal/database"
	"metabee/internal/model/dao"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

func seedDatabase() {
	log.Println("🌱 Iniciando seed do banco de dados...")

	// Buscar um usuário existente ou criar um de exemplo
	userDao := dao.UserDao{}
	user, err := userDao.FindUserByEmail("admin@metabee.com")
	if err != nil {
		log.Println("Usuário admin não encontrado, criando...")
		// Criar usuário de exemplo se não existir
		// Nota: Isso requer que o usuário já exista ou você precisa criar primeiro
		log.Println("⚠️  Por favor, crie um usuário primeiro antes de executar o seed")
		return
	}

	// Criar cursos
	courseDao := dao.CourseDao{}
	courses := []dao.CourseDao{
		{
			Title:       "Introdução à Inteligência Artificial",
			Description: "Aprenda os fundamentos da IA e machine learning",
			Image:       "/images/course-ai.jpg",
			Category:    "Tecnologia",
			Duration:    40,
			DriveLink:   "https://drive.google.com/drive/folders/EXEMPLO_ID_DRIVE_1",
			Price:       199.90,
		},
		{
			Title:       "Python para Iniciantes",
			Description: "Curso completo de Python do zero ao avançado",
			Image:       "/images/course-python.jpg",
			Category:    "Programação",
			Duration:    60,
			DriveLink:   "https://drive.google.com/drive/folders/EXEMPLO_ID_DRIVE_2",
			Price:       249.90,
		},
		{
			Title:       "Robótica e Automação",
			Description: "Construa e programe robôs do zero",
			Image:       "/images/course-robotics.jpg",
			Category:    "Engenharia",
			Duration:    50,
			DriveLink:   "https://drive.google.com/drive/folders/EXEMPLO_ID_DRIVE_3",
			Price:       299.90,
		},
		{
			Title:       "Visão Computacional",
			Description: "Processamento de imagens e reconhecimento de padrões",
			Image:       "/images/course-vision.jpg",
			Category:    "Tecnologia",
			Duration:    45,
			DriveLink:   "https://drive.google.com/drive/folders/EXEMPLO_ID_DRIVE_4",
			Price:       279.90,
		},
	}

	var courseIDs []bson.ObjectID
	for _, course := range courses {
		created, err := courseDao.CreateCourse(course)
		if err != nil {
			log.Printf("Erro ao criar curso %s: %v", course.Title, err)
			continue
		}
		courseIDs = append(courseIDs, created.ID)
		log.Printf("✅ Curso criado: %s", created.Title)
	}

	// Criar notícias
	newsDao := dao.NewsDao{}
	news := []dao.NewsDao{
		{
			Title:   "Nova atualização da plataforma MetaBee",
			Content: "Estamos lançando novas funcionalidades incríveis para melhorar sua experiência de aprendizado.",
			Author:  "Equipe MetaBee",
		},
		{
			Title:   "Curso de IA com certificado reconhecido",
			Content: "Agora você pode obter certificados reconhecidos internacionalmente ao completar nossos cursos.",
			Author:  "Equipe MetaBee",
		},
	}

	for _, n := range news {
		_, err := newsDao.CreateNews(n)
		if err != nil {
			log.Printf("Erro ao criar notícia %s: %v", n.Title, err)
			continue
		}
		log.Printf("✅ Notícia criada: %s", n.Title)
	}

	// Criar progresso do usuário
	if len(courseIDs) > 0 {
		progresses := []dao.UserProgressDao{
			{
				UserID:    user.ID,
				CourseID:  courseIDs[0],
				Progress:  45.5,
				Hours:     18.0,
				LastStudy: time.Now().Add(-24 * time.Hour),
			},
			{
				UserID:    user.ID,
				CourseID:  courseIDs[1],
				Progress:  30.0,
				Hours:     12.0,
				LastStudy: time.Now().Add(-12 * time.Hour),
			},
		}

		collection := database.DB.Collection("user_progress")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		for _, progress := range progresses {
			progress.ID = bson.NewObjectID()
			progress.CreatedAt = time.Now()
			progress.UpdatedAt = time.Now()
			_, err := collection.InsertOne(ctx, progress)
			if err != nil {
				log.Printf("Erro ao criar progresso: %v", err)
				continue
			}
			log.Printf("✅ Progresso criado para curso")
		}
	}

	// Criar sessões de estudo deste mês
	collection := database.DB.Collection("study_session")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	now := time.Now()
	sessions := []dao.StudySessionDao{
		{
			UserID:   user.ID,
			CourseID: courseIDs[0],
			Duration: 2.5,
			Date:     now.Add(-2 * 24 * time.Hour),
		},
		{
			UserID:   user.ID,
			CourseID: courseIDs[0],
			Duration: 3.0,
			Date:     now.Add(-5 * 24 * time.Hour),
		},
		{
			UserID:   user.ID,
			CourseID: courseIDs[1],
			Duration: 1.5,
			Date:     now.Add(-1 * 24 * time.Hour),
		},
		{
			UserID:   user.ID,
			CourseID: courseIDs[1],
			Duration: 2.0,
			Date:     now.Add(-3 * 24 * time.Hour),
		},
	}

	for _, session := range sessions {
		session.ID = bson.NewObjectID()
		session.CreatedAt = time.Now()
		_, err := collection.InsertOne(ctx, session)
		if err != nil {
			log.Printf("Erro ao criar sessão de estudo: %v", err)
			continue
		}
		log.Printf("✅ Sessão de estudo criada")
	}

	log.Println("✅ Seed do banco de dados concluído!")
}

