// guardian/generate-embeddings.js
// Generates one embedding per fiche (Module 8: no chunking, fiche = atomic
// unit -> chunk_index always 0) via OpenAI text-embedding-3-small (Module 6).
// Idempotent: re-running regenerates chunk_text/embedding for every fiche.
const { pool } = require('./db');

const EMBEDDING_MODEL = 'text-embedding-3-small';

function buildChunkText(fiche) {
  return [fiche.topic, fiche.scenario, fiche.objectif_educatif, fiche.contenu_principal]
    .filter(Boolean)
    .join('\n\n');
}

async function embed(texts) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI embeddings request failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.data.map((d) => d.embedding);
}

async function main() {
  const { rows: fiches } = await pool.query(
    'SELECT id, slug, topic, scenario, objectif_educatif, contenu_principal FROM guardian_fiches ORDER BY slug'
  );
  console.log(`Generating embeddings for ${fiches.length} fiches (${EMBEDDING_MODEL})`);

  const chunkTexts = fiches.map(buildChunkText);
  const embeddings = await embed(chunkTexts);

  for (let i = 0; i < fiches.length; i += 1) {
    const fiche = fiches[i];
    const vectorLiteral = `[${embeddings[i].join(',')}]`;
    await pool.query(
      `INSERT INTO guardian_fiches_embeddings (fiche_id, chunk_index, chunk_text, embedding)
       VALUES ($1, 0, $2, $3::vector)
       ON CONFLICT (fiche_id, chunk_index)
       DO UPDATE SET chunk_text = EXCLUDED.chunk_text, embedding = EXCLUDED.embedding, created_at = now()`,
      [fiche.id, chunkTexts[i], vectorLiteral]
    );
    console.log(`  OK  ${fiche.slug} (${embeddings[i].length} dims)`);
  }

  console.log(`Done: ${fiches.length} embeddings generated.`);
}

main()
  .catch((err) => {
    console.error('Embedding generation failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
