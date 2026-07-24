-- guardian/schema.sql
-- Guardian AI knowledge base schema. Managed via raw SQL + the `pg` client,
-- deliberately kept out of prisma/schema.prisma (pgvector types and cosine
-- similarity queries need raw SQL anyway; see conversation for rationale).

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS guardian_subcategories (
    slug        TEXT PRIMARY KEY,
    category    TEXT NOT NULL CHECK (category IN (
                    'securite_numerique','securite_physique',
                    'citoyennete_numerique','intelligence_emotionnelle')),
    label       TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO guardian_subcategories (slug, category, label) VALUES
    ('cyberharcelement', 'securite_numerique', 'Cyberharcèlement'),
    ('mots_de_passe_authentification', 'securite_numerique', 'Mots de passe et authentification'),
    ('reconnaissance_arnaques', 'securite_numerique', 'Reconnaissance des arnaques'),
    ('confidentialite_en_ligne', 'securite_numerique', 'Confidentialité en ligne'),
    ('usage_responsable_ia', 'securite_numerique', 'Usage responsable de l''IA'),
    ('incident_numerique_collectif', 'securite_numerique', 'Incident numérique collectif'),
    ('reconnaissance_situations_dangereuses', 'securite_physique', 'Reconnaissance de situations dangereuses'),
    ('securite_rue_communaute', 'securite_physique', 'Sécurité rue et communauté'),
    ('criteres_escalade', 'securite_physique', 'Critères d''escalade'),
    ('desinformation', 'citoyennete_numerique', 'Désinformation'),
    ('gestion_pression_pairs', 'intelligence_emotionnelle', 'Gestion de la pression des pairs'),
    ('communication_empathie', 'intelligence_emotionnelle', 'Communication et empathie')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS guardian_fiches (
    -- 2.1 Identification et Classification
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug                TEXT UNIQUE NOT NULL,
    topic               TEXT NOT NULL,
    category            TEXT NOT NULL CHECK (category IN (
                            'securite_numerique','securite_physique',
                            'citoyennete_numerique','intelligence_emotionnelle')),
    subcategory         TEXT NOT NULL REFERENCES guardian_subcategories(slug),
    knowledge_type      TEXT NOT NULL CHECK (knowledge_type IN (
                            'educatif','protocole','narratif')),
    scenario            TEXT,
    intent              TEXT CHECK (intent IN (
                            'demande_conseil','signalement','information_generale')),
    language            TEXT NOT NULL DEFAULT 'fr' CHECK (language IN ('fr','en')),

    -- 2.2 Ciblage et Adaptation
    age_group           TEXT[] NOT NULL,
    user_profile        TEXT[] NOT NULL,
    risk_level          TEXT NOT NULL CHECK (risk_level IN (
                            'faible','modere','eleve','critique')),
    dimension_culturelle TEXT,
    cultural_adaptation  TEXT,

    -- 2.3 Contenu Pédagogique
    objectif_educatif      TEXT NOT NULL,
    resultat_apprentissage TEXT,
    contenu_principal       TEXT NOT NULL,
    conseils_parent          TEXT,
    conseils_enseignant      TEXT,
    conseil_securite         TEXT,
    escalade_urgence         TEXT,

    -- 2.4 Ancrage Narratif
    personnage_reference TEXT,
    episode_reference    TEXT,
    saison_reference     INTEGER,
    phrase_signature     TEXT,
    trait_associe        TEXT,
    arc_saison           TEXT CHECK (arc_saison IN ('decouvrir','comprendre','devenir')),
    lecon_episode        TEXT,

    -- 2.5 Sources, Validation et Gouvernance
    references_list   TEXT[],
    sources_autorite   TEXT[],
    keywords           TEXT[],
    tags               TEXT[],
    difficulty         TEXT CHECK (difficulty IN ('simple','intermediaire')),
    version            TEXT NOT NULL DEFAULT '0.1.0',
    review_status      TEXT NOT NULL DEFAULT 'brouillon' CHECK (review_status IN (
                            'brouillon','en_revision','publie','obsolete','archive')),
    quality_score      FLOAT DEFAULT NULL,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_by        TEXT[] NOT NULL DEFAULT '{}',
    next_review_date   DATE,

    CONSTRAINT escalade_obligatoire_si_critique
        CHECK (risk_level != 'critique' OR escalade_urgence IS NOT NULL)
);

-- Couche pgvector : dérivée, séparée de la table canonique (Module 6, règle d'or)
CREATE TABLE IF NOT EXISTS guardian_fiches_embeddings (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fiche_id    UUID NOT NULL REFERENCES guardian_fiches(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL DEFAULT 0,   -- reste à 0 : pas de chunking (Module 8 §3)
    chunk_text  TEXT NOT NULL,
    embedding   vector(1536),                 -- text-embedding-3-small
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (fiche_id, chunk_index)
);
CREATE INDEX IF NOT EXISTS guardian_fiches_embeddings_ivfflat
    ON guardian_fiches_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Risque de dérive identifié au Module 6 : l'embedding doit être régénéré
-- à chaque transition de review_status vers 'publie'. Synchronisation
-- implémentée au Module 8 (pipeline RAG), pas au niveau du schéma.

CREATE TABLE IF NOT EXISTS guardian_emergency_contacts (
    id SERIAL PRIMARY KEY,
    service_name TEXT NOT NULL,
    service_type TEXT NOT NULL CHECK (service_type IN ('police','gendarmerie','pompiers','samu')),
    number_mobile TEXT,
    number_fixed TEXT,
    scope TEXT NOT NULL DEFAULT 'national',
    usage_recommande TEXT NOT NULL CHECK (usage_recommande IN ('information_generale','escalade_directe')),
    verified_by TEXT NOT NULL,
    verified_at DATE NOT NULL,
    source_note TEXT,
    next_verification_date DATE
);

INSERT INTO guardian_emergency_contacts
(service_name, service_type, number_mobile, number_fixed, usage_recommande, verified_by, verified_at, source_note, next_verification_date)
SELECT * FROM (VALUES
    ('Police Secours', 'police', '117', '17', 'information_generale', 'fondateur - vérification manuelle', CURRENT_DATE, 'confirmé directement par le porteur de projet', CURRENT_DATE + INTERVAL '6 months'),
    ('Gendarmerie Nationale', 'gendarmerie', '113', '13', 'information_generale', 'fondateur - vérification manuelle', CURRENT_DATE, 'confirmé directement par le porteur de projet', CURRENT_DATE + INTERVAL '6 months'),
    ('Sapeurs-Pompiers', 'pompiers', '118', NULL, 'escalade_directe', 'fondateur - vérification manuelle', CURRENT_DATE, 'confirmé directement par le porteur de projet', CURRENT_DATE + INTERVAL '6 months'),
    ('SAMU / Ambulance', 'samu', '119', NULL, 'escalade_directe', 'fondateur - vérification manuelle', CURRENT_DATE, 'confirmé directement par le porteur de projet', CURRENT_DATE + INTERVAL '6 months')
) AS v(service_name, service_type, number_mobile, number_fixed, usage_recommande, verified_by, verified_at, source_note, next_verification_date)
WHERE NOT EXISTS (SELECT 1 FROM guardian_emergency_contacts WHERE service_type = v.service_type);

-- Règle de génération (Module 9, détaillée à l'Étape 4) : escalade_urgence
-- de guardian_fiches reste TOUJOURS la réponse principale. Un contact
-- d'urgence n'est qu'un complément secondaire, jamais un remplacement, et
-- jamais un premier réflexe pour une situation familiale sensible (abus,
-- secret demandé par un proche) — seulement pour urgence physique immédiate
-- (incendie, accident) ou question factuelle directe sur un numéro.

CREATE TABLE IF NOT EXISTS guardian_fiche_emergency_contacts (
    fiche_id UUID REFERENCES guardian_fiches(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES guardian_emergency_contacts(id),
    PRIMARY KEY (fiche_id, contact_id)
);
