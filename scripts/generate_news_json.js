// Script Node.js para gerar documentos JSON com notícias e imagens do Unsplash
// Execute: node scripts/generate_news_json.js

const https = require('https');
const fs = require('fs');

// URLs de imagens do Unsplash relacionadas a notícias de tecnologia, robótica, IA, etc.
const newsData = [
  {
    title: "Revolução da Inteligência Artificial em 2024",
    description: "As últimas inovações em IA estão transformando a indústria tecnológica",
    content: "A inteligência artificial continua evoluindo rapidamente, com novos modelos e aplicações sendo lançados constantemente. Empresas líderes estão investindo bilhões em pesquisa e desenvolvimento para criar sistemas mais inteligentes e eficientes.",
    font: "TechNews",
    writer: "Maria Silva",
    imageName: 'news-ai.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  },
  {
    title: "Robótica Avançada: O Futuro da Automação",
    description: "Robôs cada vez mais sofisticados estão mudando o mercado de trabalho",
    content: "A robótica avançada está revolucionando diversos setores, desde a manufatura até os serviços. Novos robôs com capacidades de aprendizado estão sendo desenvolvidos para trabalhar em ambientes complexos e colaborar com humanos de forma mais eficiente.",
    font: "Robotics Today",
    writer: "João Santos",
    imageName: 'news-robotics.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
  },
  {
    title: "Python Domina o Desenvolvimento de Software",
    description: "Linguagem se consolida como a mais popular entre desenvolvedores",
    content: "Python continua sendo a linguagem de programação mais popular do mundo, com crescimento constante em diversos setores. Sua simplicidade e versatilidade a tornam ideal para projetos de ciência de dados, desenvolvimento web e automação.",
    font: "Dev Weekly",
    writer: "Ana Costa",
    imageName: 'news-python.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
  },
  {
    title: "Visão Computacional: Novos Horizontes",
    description: "Tecnologias de reconhecimento de imagem alcançam novos patamares",
    content: "A visão computacional está alcançando níveis de precisão impressionantes, com aplicações em medicina, segurança, transporte autônomo e muito mais. Novos algoritmos estão permitindo que máquinas vejam e interpretem o mundo de forma cada vez mais precisa.",
    font: "AI Insights",
    writer: "Carlos Oliveira",
    imageName: 'news-vision.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=600&fit=crop',
  },
  {
    title: "Arduino: Democratizando a Eletrônica",
    description: "Plataforma acessível permite que qualquer pessoa crie projetos inovadores",
    content: "O Arduino continua sendo uma das plataformas mais acessíveis para iniciantes em eletrônica e programação. Com uma comunidade global ativa e milhares de projetos disponíveis, está facilitando a criação de soluções inovadoras em IoT e automação residencial.",
    font: "Maker Magazine",
    writer: "Pedro Alves",
    imageName: 'news-arduino.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  },
  {
    title: "Eletrônica Moderna: Componentes do Futuro",
    description: "Novos componentes eletrônicos prometem revolucionar dispositivos",
    content: "A indústria de componentes eletrônicos está em constante evolução, com novos materiais e designs que permitem dispositivos menores, mais eficientes e poderosos. Pesquisadores estão desenvolvendo componentes que podem transformar completamente a forma como interagimos com a tecnologia.",
    font: "Electronics Today",
    writer: "Fernanda Lima",
    imageName: 'news-electronics.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
  },
  {
    title: "Programação: Habilidades Essenciais para 2024",
    description: "Quais linguagens e tecnologias você precisa dominar este ano",
    content: "O mercado de desenvolvimento de software continua aquecido, com alta demanda por profissionais qualificados. Linguagens como JavaScript, Python e Go estão em alta, enquanto frameworks modernos como React e Next.js dominam o desenvolvimento web.",
    font: "Code Weekly",
    writer: "Lucas Martins",
    imageName: 'news-programming.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
  },
  {
    title: "Machine Learning: Aplicações Práticas",
    description: "Como empresas estão usando ML para resolver problemas reais",
    content: "Machine Learning está sendo aplicado em diversos setores, desde recomendações de produtos até diagnósticos médicos. Empresas estão descobrindo novas formas de usar dados para tomar decisões mais inteligentes e criar produtos melhores.",
    font: "Data Science Journal",
    writer: "Juliana Rocha",
    imageName: 'news-ml.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
  },
  {
    title: "Desenvolvimento Web: Tendências 2024",
    description: "As principais tecnologias que estão moldando o futuro da web",
    content: "O desenvolvimento web está evoluindo rapidamente, com novas ferramentas e frameworks sendo lançados constantemente. Serverless, edge computing e aplicações web progressivas estão se tornando padrão na indústria.",
    font: "Web Dev News",
    writer: "Rafael Souza",
    imageName: 'news-web.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  },
  {
    title: "Data Science: Transformando Dados em Insights",
    description: "Como cientistas de dados estão ajudando empresas a crescer",
    content: "A ciência de dados continua sendo uma das áreas mais promissoras da tecnologia. Profissionais qualificados estão ajudando empresas de todos os tamanhos a entender melhor seus dados e tomar decisões baseadas em evidências.",
    font: "Analytics Today",
    writer: "Patricia Mendes",
    imageName: 'news-data.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  }
];

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

function bufferToBase64(buffer) {
  return buffer.toString('base64');
}

function generateObjectId() {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

async function generateDocuments() {
  const documents = [];
  const now = new Date().toISOString();
  
  console.log('📥 Baixando imagens e gerando notícias...\n');
  
  for (let i = 0; i < newsData.length; i++) {
    const news = newsData[i];
    try {
      console.log(`[${i + 1}/${newsData.length}] Processando: ${news.title}...`);
      const imageBuffer = await downloadImage(news.imageUrl);
      const base64Data = bufferToBase64(imageBuffer);
      
      // Gerar ObjectId para a notícia
      const newsObjectId = generateObjectId();
      
      // Gerar ObjectId para a imagem (será inserida na collection images)
      const imageObjectId = generateObjectId();
      
      // Documento da imagem
      const imageDocument = {
        _id: {
          $oid: imageObjectId
        },
        name: news.imageName,
        data: {
          $binary: {
            base64: base64Data,
            subType: "00"
          }
        },
        mime_type: "image/jpeg",
        created_at: {
          $date: now
        },
        updated_at: {
          $date: now
        }
      };
      
      // Documento da notícia
      const newsDocument = {
        _id: {
          $oid: newsObjectId
        },
        title: news.title,
        date: {
          $date: new Date(Date.now() - i * 86400000).toISOString() // Notícias com datas diferentes
        },
        description: news.description,
        content: news.content,
        font: news.font,
        writer: news.writer,
        image: `/images/${news.imageName}`,
        image_id: {
          $oid: imageObjectId
        },
        created_at: {
          $date: now
        },
        updated_at: {
          $date: now
        }
      };
      
      documents.push({
        image: imageDocument,
        news: newsDocument
      });
      
      const sizeKB = (imageBuffer.length / 1024).toFixed(2);
      console.log(`✅ ${news.title} processado (${sizeKB} KB)\n`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Erro ao processar ${news.title}:`, error.message);
    }
  }
  
  return documents;
}

async function main() {
  try {
    const documents = await generateDocuments();
    
    // Separar imagens e notícias
    const images = documents.map(d => d.image);
    const news = documents.map(d => d.news);
    
    // Salvar imagens
    const imagesJson = JSON.stringify(images, null, 2);
    fs.writeFileSync('scripts/news_images_documents.json', imagesJson);
    
    // Salvar notícias
    const newsJson = JSON.stringify(news, null, 2);
    fs.writeFileSync('scripts/news_documents.json', newsJson);
    
    console.log(`\n✅ ${documents.length} notícias e imagens geradas com sucesso!`);
    console.log('📄 Arquivos criados:');
    console.log('   - scripts/news_images_documents.json (imagens para collection images)');
    console.log('   - scripts/news_documents.json (notícias para collection news)');
    console.log('\n💡 Para inserir no MongoDB:');
    console.log('   1. Primeiro insira as imagens em scripts/news_images_documents.json na collection "images"');
    console.log('   2. Depois insira as notícias em scripts/news_documents.json na collection "news"');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

main();

