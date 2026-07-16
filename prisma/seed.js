// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing data
  await prisma.contactMessage.deleteMany({});
  await prisma.download.deleteMany({});
  await prisma.partner.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@africaimpact.studio',
      name: 'Directeur Editorial',
      passwordHash: '$2b$10$EPfdb09Q9Z.PjFfG8qX7Qe25a81T6wL5Hw16.MhB47fQ0504h/8r2', // bcrypt for 'AdminImpact2026!'
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  // 3. Create Projects
  const flagship = await prisma.project.create({
    data: {
      title: 'Les Gardiens du Quartier',
      slug: 'les-gardiens-du-quartier',
      tagline: 'Sensibiliser la jeunesse africaine à la cybersécurité et à la citoyenneté numérique.',
      description: 'Une série d\'animation immersive, accompagnée de kits pédagogiques, de bandes dessinées et d\'un assistant IA pour enseigner aux enfants les bonnes pratiques du web de manière ludique.',
      category: 'Animation & Cybersécurité',
      status: 'Active',
      isFlagship: true,
      coverImage: '/assets/projects/gardiens-hero.jpg',
      images: '/assets/projects/amina.jpg,/assets/projects/kofi.jpg,/assets/projects/malik.jpg',
    },
  });

  const elearning = await prisma.project.create({
    data: {
      title: 'Studio E-learning Afrique',
      slug: 'studio-e-learning-afrique',
      tagline: 'Plateforme modulaire de formation professionnelle pour les enseignants.',
      description: 'Un portail web et mobile permettant d\'assurer la formation continue des enseignants africains aux technologies éducatives (EdTech) et à l\'apprentissage hybride.',
      category: 'Formation & Plateformes',
      status: 'In Development',
      isFlagship: false,
      coverImage: '/assets/projects/elearning.jpg',
      images: '',
    },
  });

  const securityLab = await prisma.project.create({
    data: {
      title: 'Cyber Security Junior Lab',
      slug: 'cyber-security-junior-lab',
      tagline: 'Laboratoire mobile d\'apprentissage pratique de la sécurité informatique.',
      description: 'Un projet de conteneurs-lab mobiles équipés pour former les collégiens et lycéens à l\'identification des menaces numériques et à la protection de leurs données.',
      category: 'Cybersécurité',
      status: 'Future',
      isFlagship: false,
      coverImage: '/assets/projects/security-lab.jpg',
      images: '',
    },
  });
  console.log('Projects created:', flagship.title, ',', elearning.title);

  // 4. Create Institutional Partners (Marked as In Development)
  const partnerNames = [
    'UNICEF',
    'MINPOSTEL',
    'MINEDUB',
    'MINESEC',
    'MINJEC',
    'MINPROFF',
    'MINCOM',
    'MINAC'
  ];

  for (const name of partnerNames) {
    await prisma.partner.create({
      data: {
        name,
        logoUrl: `/assets/partners/${name.toLowerCase()}.svg`,
        status: 'IN_DEVELOPMENT',
      },
    });
  }
  console.log('Institutional partners seeded (in development status).');

  // 5. Create Downloads
  const downloads = [
    {
      name: 'La Bible du Projet - Les Gardiens du Quartier',
      description: 'Dossier artistique complet, bible littéraire et graphique de la série d\'animation.',
      fileUrl: '/api/download?file=bible-gardiens-du-quartier.pdf',
      fileSize: '12.4 MB',
    },
    {
      name: 'One Pager - Africa Impact Studio',
      description: 'Fiche descriptive synthétique présentant notre vision, notre équipe et nos projets.',
      fileUrl: '/api/download?file=one-pager-africa-impact-studio.pdf',
      fileSize: '1.8 MB',
    },
    {
      name: 'Kit Pédagogique - Cybersécurité pour Ecoles',
      description: 'Fiches pratiques, scénarios d\'exercices et affiches pour animer des ateliers en classe.',
      fileUrl: '/api/download?file=kit-pedagogique-cybersecurity.pdf',
      fileSize: '4.5 MB',
    },
    {
      name: 'Dossier de Presse Officiel',
      description: 'Communiqués de presse, revue médiatique et photos HD pour les journalistes.',
      fileUrl: '/api/download?file=dossier-presse-2026.zip',
      fileSize: '8.2 MB',
    }
  ];

  for (const dl of downloads) {
    await prisma.download.create({
      data: {
        ...dl,
        downloadCount: Math.floor(Math.random() * 150) + 10,
      },
    });
  }
  console.log('Downloads seeded.');

  // 6. Create Blog Posts
  const blogPosts = [
    {
      title: 'L\'Intelligence Artificielle au service de la formation : Révolutionner l\'éducation en Afrique',
      slug: 'ia-education-afrique',
      category: 'IA',
      excerpt: 'Découvrez comment l\'IA peut combler le déficit d\'enseignants et offrir un apprentissage personnalisé à des millions d\'enfants africains.',
      content: `## L'éducation africaine à l'aube d'une révolution technologique

L'Afrique fait face à un défi éducatif majeur : un déficit persistant d'enseignants qualifiés et un manque de ressources pédagogiques adaptées. Pourtant, le continent possède l'une des populations les plus jeunes et les plus dynamiques au monde. C'est dans ce contexte que l'Intelligence Artificielle (IA) se présente non pas comme un gadget, mais comme un accélérateur historique d'opportunités.

### 1. Personnalisation de l'apprentissage
Chaque enfant apprend à son propre rythme. Les chatbots éducatifs comme **Le Gardien** s'adaptent au niveau de l'élève, reformulent les concepts complexes et fournissent des exercices sur mesure. Cela permet de lutter efficacement contre le décrochage scolaire.

### 2. Renforcement des capacités des enseignants
L'IA ne remplace pas l'enseignant, elle le décharge des tâches répétitives d'évaluation et de planification de cours. Ainsi, l'enseignant peut se concentrer sur l'accompagnement humain et la transmission des compétences douces (*soft skills*).

### 3. Accessibilité et inclusion
Grâce aux applications mobiles intégrant la reconnaissance vocale et la synthèse vocale, l'éducation s'ouvre aux zones reculées et aux enfants ayant des besoins spécifiques.

Africa Impact Studio s'engage à concevoir des solutions IA souveraines et adaptées aux réalités locales africaines pour bâtir l'école du futur.`,
      coverImage: '/assets/blog/ia-edu.jpg',
      published: true,
      authorId: admin.id,
    },
    {
      title: 'Sensibilisation des jeunes à la Cybersécurité : le concept de Patriotisme Numérique',
      slug: 'patriotisme-numerique-cybersecurite',
      category: 'Cybersécurité',
      excerpt: 'Protéger nos frontières virtuelles commence dès l\'enfance. Pourquoi le patriotisme numérique est le pilier de la souveraineté africaine.',
      content: `## Pourquoi former nos enfants à la sécurité en ligne ?

À mesure que l'Afrique se digitalise, nos enfants accèdent de plus en plus tôt aux smartphones et à Internet. Si c'est une formidable fenêtre sur le monde, c'est aussi un espace à hauts risques : harcèlement, arnaques, vol d'identité, désinformation. 

Le **patriotisme numérique** est une philosophie éducative qui enseigne aux jeunes que l'espace numérique commun est un bien précieux à protéger.

### Les 3 Piliers du Jeune Citoyen Numérique :
1. **La Vigilance** : Repérer les indices de phishing, douter des profils inconnus et ne jamais partager de mots de passe ou d'informations privées.
2. **La Responsabilité** : Adopter un comportement éthique en ligne, refuser le cyberharcèlement et promouvoir des contenus constructifs.
3. **La Souveraineté** : Apprendre aux enfants à utiliser et à créer des technologies locales afin d'assurer l'indépendance technologique du continent.

À travers notre projet d'animation **Les Gardiens du Quartier**, nous donnons vie à ces concepts complexes sous forme d'aventures palpitantes auxquelles les enfants s'identifient instantanément.`,
      coverImage: '/assets/blog/cybersec.jpg',
      published: true,
      authorId: admin.id,
    },
    {
      title: 'Le rôle de l\'animation 3D et du Storytelling dans la transmission des valeurs',
      slug: 'animation-storytelling-valeurs-africaines',
      category: 'Animation',
      excerpt: 'Pourquoi les héros de dessins animés locaux ont un impact démesuré sur le développement identitaire et moral des enfants.',
      content: `## Reconnecter les enfants africains à leur culture et à la technologie

Pendant des décennies, la quasi-totalité des programmes jeunesses diffusés en Afrique provenaient d'autres continents. Bien que divertissants, ils ne reflètent ni nos paysages, ni nos noms, ni nos défis quotidiens.

Le storytelling local associé à l'animation moderne a un pouvoir de transformation sociale immense.

### Le Miroir Représentatif
Quand un enfant voit **Amina**, une jeune fille passionnée de programmation vivant dans un quartier similaire au sien, résoudre des problèmes communautaires avec son ordinateur, une barrière mentale s'effondre. Il se dit : "Je peux le faire moi aussi."

### Allier tradition et modernité
Nos contes et valeurs de solidarité (Ubuntu, dialogue intergénérationnel) s'intègrent parfaitement dans des récits modernes de science-fiction ou de cybersécurité.

L'animation 3D n'est plus seulement un divertissement, c'est le support par excellence de l'éducation cognitive moderne.`,
      coverImage: '/assets/blog/animation.jpg',
      published: true,
      authorId: admin.id,
    }
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: post,
    });
  }
  console.log('Blog posts seeded successfully!');
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
