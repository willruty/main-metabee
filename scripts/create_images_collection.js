// Script MongoDB para criar a collection de imagens
// Execute este script no MongoDB Atlas ou MongoDB Compass

// Conectar ao banco de dados
use metabee;

// Criar a collection 'images' se não existir
db.createCollection("images");

// Criar índice único no campo 'name' para garantir que não haja imagens duplicadas
db.images.createIndex(
  { "name": 1 },
  { unique: true, name: "idx_image_name_unique" }
);

// Criar índice no campo 'created_at' para consultas por data
db.images.createIndex(
  { "created_at": -1 },
  { name: "idx_image_created_at" }
);

// Exemplo de documento da collection images:
/*
{
  "_id": ObjectId("..."),
  "name": "course-robotics.jpg",
  "data": BinData(0, "..."), // Dados binários da imagem
  "mime_type": "image/jpeg",
  "created_at": ISODate("2024-01-01T00:00:00.000Z"),
  "updated_at": ISODate("2024-01-01T00:00:00.000Z")
}
*/

print("✅ Collection 'images' criada com sucesso!");
print("✅ Índices criados:");
print("   - idx_image_name_unique (único no campo 'name')");
print("   - idx_image_created_at (campo 'created_at')");

