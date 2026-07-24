// guardian/search.js
// Recherche hybride (Module 8 §3) : 30% lexicale (French full-text) +
// 70% sémantique (pgvector cosine similarity), rerankée par quality_score.
// Filtre non-contournable (Module 5 §3) : seul review_status = 'publie' est
// éligible par défaut. `includeUnpublished` n'existe que pour les tests sur
// données brouillon (Étape 3) et doit rester false pour tout usage réel.
const { pool } = require('./db');

const LEXICAL_WEIGHT = 0.3;
const SEMANTIC_WEIGHT = 0.7;
const EMBEDDING_MODEL = 'text-embedding-3-small';

async function embedQuery(query) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: query }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI embeddings request failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.data[0].embedding;
}

async function searchFiches(query, { limit = 5, includeUnpublished = false } = {}) {
  const queryEmbedding = await embedQuery(query);
  const vectorLiteral = `[${queryEmbedding.join(',')}]`;

  const statusFilter = includeUnpublished
    ? "gf.review_status IN ('brouillon','en_revision','publie')"
    : "gf.review_status = 'publie'";

  const { rows } = await pool.query(
    `
    WITH lexical AS (
      SELECT
        gf.id,
        ts_rank(
          to_tsvector('french', gf.topic || ' ' || coalesce(gf.scenario, '') || ' ' || gf.contenu_principal || ' ' || array_to_string(gf.keywords, ' ')),
          plainto_tsquery('french', $1)
        ) AS lexical_score
      FROM guardian_fiches gf
      WHERE ${statusFilter}
    ),
    semantic AS (
      SELECT
        gfe.fiche_id AS id,
        1 - (gfe.embedding <=> $2::vector) AS semantic_score
      FROM guardian_fiches_embeddings gfe
      JOIN guardian_fiches gf ON gf.id = gfe.fiche_id
      WHERE ${statusFilter}
    ),
    combined AS (
      SELECT
        gf.id,
        gf.slug,
        gf.topic,
        gf.risk_level,
        gf.quality_score,
        coalesce(l.lexical_score, 0) AS lexical_score,
        coalesce(s.semantic_score, 0) AS semantic_score,
        (${LEXICAL_WEIGHT} * coalesce(l.lexical_score, 0) + ${SEMANTIC_WEIGHT} * coalesce(s.semantic_score, 0)) AS hybrid_score
      FROM guardian_fiches gf
      LEFT JOIN lexical l ON l.id = gf.id
      LEFT JOIN semantic s ON s.id = gf.id
      WHERE ${statusFilter}
    )
    SELECT
      *,
      -- Reranking pondéré par quality_score (Module 8 §3). quality_score est
      -- NULL tant qu'aucun feedback 👍/👎 n'a été reçu : traité comme neutre
      -- (0.5) plutôt que de pénaliser une fiche jamais notée.
      hybrid_score * (0.7 + 0.3 * coalesce(quality_score, 0.5)) AS final_score
    FROM combined
    ORDER BY final_score DESC
    LIMIT $3;
    `,
    [query, vectorLiteral, limit]
  );

  return rows;
}

module.exports = { searchFiches };
