// guardian/import-fiches.js
// Imports fiches from a JSON file (Module 4 schema) into guardian_fiches.
// Idempotent: re-running upserts by slug rather than duplicating rows.
const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

const DEFAULT_FILE = path.join(__dirname, '..', 'public', 'docs', 'guardian_fiches_lot_pilote_18.json');

const UPSERT_SQL = `
INSERT INTO guardian_fiches (
    slug, topic, category, subcategory, knowledge_type, scenario, intent, language,
    age_group, user_profile, risk_level, dimension_culturelle, cultural_adaptation,
    objectif_educatif, resultat_apprentissage, contenu_principal,
    conseils_parent, conseils_enseignant, conseil_securite, escalade_urgence,
    personnage_reference, episode_reference, saison_reference, phrase_signature,
    trait_associe, arc_saison, lecon_episode,
    references_list, sources_autorite, keywords, tags, difficulty, version,
    review_status, quality_score, created_at, updated_at, reviewed_by, next_review_date
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8,
    $9, $10, $11, $12, $13,
    $14, $15, $16,
    $17, $18, $19, $20,
    $21, $22, $23, $24,
    $25, $26, $27,
    $28, $29, $30, $31, $32, $33,
    $34, $35, $36, $37, $38, $39
)
ON CONFLICT (slug) DO UPDATE SET
    topic = EXCLUDED.topic,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    knowledge_type = EXCLUDED.knowledge_type,
    scenario = EXCLUDED.scenario,
    intent = EXCLUDED.intent,
    language = EXCLUDED.language,
    age_group = EXCLUDED.age_group,
    user_profile = EXCLUDED.user_profile,
    risk_level = EXCLUDED.risk_level,
    dimension_culturelle = EXCLUDED.dimension_culturelle,
    cultural_adaptation = EXCLUDED.cultural_adaptation,
    objectif_educatif = EXCLUDED.objectif_educatif,
    resultat_apprentissage = EXCLUDED.resultat_apprentissage,
    contenu_principal = EXCLUDED.contenu_principal,
    conseils_parent = EXCLUDED.conseils_parent,
    conseils_enseignant = EXCLUDED.conseils_enseignant,
    conseil_securite = EXCLUDED.conseil_securite,
    escalade_urgence = EXCLUDED.escalade_urgence,
    personnage_reference = EXCLUDED.personnage_reference,
    episode_reference = EXCLUDED.episode_reference,
    saison_reference = EXCLUDED.saison_reference,
    phrase_signature = EXCLUDED.phrase_signature,
    trait_associe = EXCLUDED.trait_associe,
    arc_saison = EXCLUDED.arc_saison,
    lecon_episode = EXCLUDED.lecon_episode,
    references_list = EXCLUDED.references_list,
    sources_autorite = EXCLUDED.sources_autorite,
    keywords = EXCLUDED.keywords,
    tags = EXCLUDED.tags,
    difficulty = EXCLUDED.difficulty,
    version = EXCLUDED.version,
    review_status = EXCLUDED.review_status,
    quality_score = EXCLUDED.quality_score,
    updated_at = EXCLUDED.updated_at,
    reviewed_by = EXCLUDED.reviewed_by,
    next_review_date = EXCLUDED.next_review_date
RETURNING id, slug;
`;

function toParams(fiche) {
  return [
    fiche.id, fiche.topic, fiche.category, fiche.subcategory, fiche.knowledge_type,
    fiche.scenario, fiche.intent, fiche.language,
    fiche.age_group, fiche.user_profile, fiche.risk_level,
    fiche.dimension_culturelle, fiche.cultural_adaptation,
    fiche.objectif_educatif, fiche.resultat_apprentissage, fiche.contenu_principal,
    fiche.conseils_parent, fiche.conseils_enseignant, fiche.conseil_securite, fiche.escalade_urgence,
    fiche.personnage_reference, fiche.episode_reference, fiche.saison_reference, fiche.phrase_signature,
    fiche.trait_associe, fiche.arc_saison, fiche.lecon_episode,
    fiche.references, fiche.sources_autorite, fiche.keywords, fiche.tags, fiche.difficulty, fiche.version,
    fiche.review_status, fiche.quality_score, fiche.created_at, fiche.updated_at,
    fiche.reviewed_by, fiche.next_review_date,
  ];
}

async function main() {
  const filePath = process.argv[2] || DEFAULT_FILE;
  const fiches = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  console.log(`Importing ${fiches.length} fiches from ${filePath}`);

  let imported = 0;
  for (const fiche of fiches) {
    try {
      const result = await pool.query(UPSERT_SQL, toParams(fiche));
      console.log(`  OK  ${fiche.id} -> ${result.rows[0].id}`);
      imported += 1;
    } catch (err) {
      console.error(`  FAIL ${fiche.id}: ${err.message}`);
    }
  }

  console.log(`Done: ${imported}/${fiches.length} fiches imported.`);
}

main()
  .catch((err) => {
    console.error('Import failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
