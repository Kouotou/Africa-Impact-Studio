export type Language = 'fr' | 'en';

interface KnowledgeEntry {
  keywords: string[];
  answers: Record<Language, string>;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ['mot de passe', 'password', 'mdp', 'securis', 'secure', 'cadeau'],
    answers: {
      fr: 'Un bon mot de passe doit être long et unique. Ajoute des lettres, des chiffres et des symboles, et ne partage jamais ton mot de passe avec quelqu\'un. Si tu veux, je peux aussi t\'aider à créer un mot de passe facile à retenir mais difficile à deviner.',
      en: 'A good password should be long and unique. Add letters, numbers, and symbols, and never share it with anyone. I can also help you create one that is easy to remember but hard to guess.'
    }
  },
  {
    keywords: ['phishing', 'hameconnage', 'hameçonnage', 'lien', 'link', 'suspect', 'suspicious'],
    answers: {
      fr: 'Le phishing, c\'est quand quelqu\'un essaie de te tromper pour voler tes informations. Ne clique jamais sur un lien douteux, vérifie l\'expéditeur et demande toujours à un adulte si tu as un doute.',
      en: 'Phishing is when someone tries to trick you into sharing information. Never click a suspicious link, check the sender, and ask an adult if you are unsure.'
    }
  },
  {
    keywords: ['danger', 'menace', 'threat', 'harcelement', 'bully', 'harcel', 'suspect', 'unsafe'],
    answers: {
      fr: 'Si tu te sens en danger en ligne, parle-en tout de suite à un adulte de confiance, à tes parents ou à un enseignant. Tu peux aussi bloquer et signaler la personne sur la plateforme.',
      en: 'If you feel unsafe online, tell a trusted adult, your parents, or a teacher right away. You can also block and report the person on the platform.'
    }
  },
  {
    keywords: ['gardiens', 'quartier', 'project', 'startup', 'ahmad', 'sarah', 'ily', 'yusuf', 'junior', 'fatima', 'inspectrice', 'serie', 'anime'],
    answers: {
      fr: 'Les Gardiens du Quartier est notre projet de sensibilisation numérique pour les enfants et les jeunes. Il met en scène Ahmad, Sarah, Ily, Yusuf, Junior et l’Inspectrice-Fatima pour apprendre la cybersécurité, la citoyenneté numérique et la confiance en soi.',
      en: 'Les Gardiens du Quartier is our digital education project for children and young people. It features Ahmad, Sarah, Ily, Yusuf, Junior, and Inspectrice-Fatima as they learn cybersecurity, digital citizenship, and confidence.'
    }
  },
  {
    keywords: ['site', 'website', 'platform', 'utiliser', 'use', 'trouver', 'find', 'ressource', 'resource', 'blog', 'contact', 'projects', 'projets'],
    answers: {
      fr: 'Tu peux utiliser notre plateforme pour explorer les projets, lire les ressources, trouver des conseils de sécurité et contacter l\'équipe. Si tu veux, pose-moi une question précise comme "où trouver les ressources ?" ou "comment contacter l\'équipe".',
      en: 'You can use our platform to explore projects, read resources, find safety tips, and contact the team. If you want, ask me something specific like “where are the resources?” or “how do I contact the team?”.'
    }
  },
  {
    keywords: ['ia', 'ai', 'intelligence artificielle', 'artificial intelligence', 'assistant', 'chatbot'],
    answers: {
      fr: 'Je suis Le Gardien, votre assistant simple et amical pour apprendre la cybersécurité. Je peux t\'aider à comprendre des mots, à rester en sécurité en ligne et à découvrir notre projet.',
      en: 'I am Le Gardien, your friendly assistant for learning cybersecurity. I can help you understand key ideas, stay safe online, and discover our project.'
    }
  },
  {
    keywords: ['bonjour', 'hello', 'hi', 'salut', 'welcome', 'bienvenue'],
    answers: {
      fr: 'Bonjour ! Je suis Le Gardien. Je peux t\'aider à apprendre la cybersécurité, à comprendre notre projet et à trouver ce que tu cherches sur le site.',
      en: 'Hello! I am Le Gardien. I can help you learn cybersecurity, understand our project, and find what you need on the website.'
    }
  }
];

export function getAssistantReply(message: string, lang: Language = 'fr') {
  const normalized = normalize(message);

  if (!normalized) {
    return lang === 'fr'
      ? 'Bonjour ! Pose-moi une question simple sur la cybersécurité, notre projet ou la plateforme.'
      : 'Hello! Ask me a simple question about cybersecurity, our project, or the platform.';
  }

  let bestEntry: KnowledgeEntry | undefined;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const score = entry.keywords.reduce((total, keyword) => {
      const cleanKeyword = normalize(keyword);
      return total + (normalized.includes(cleanKeyword) ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && bestScore > 0) {
    return bestEntry.answers[lang];
  }

  return lang === 'fr'
    ? 'Je peux t’aider avec la cybersécurité, notre projet ou la plateforme. Essaie une question comme : “Comment créer un bon mot de passe ?” ou “Qu’est-ce que le phishing ?”.'
    : 'I can help with cybersecurity, our project, or the platform. Try a question like “How do I create a strong password?” or “What is phishing?”.';
}
