// guardian/test-search.js
// Étape 3 : test de la recherche hybride sur les 18 fiches pilotes.
// includeUnpublished: true car toutes les fiches sont encore 'brouillon'
// (aucune n'a été revue/publiée) — voir avertissement dans guardian/search.js.
const { pool } = require('./db');
const { searchFiches } = require('./search');

const TEST_QUERIES = [
  'Comment créer un mot de passe sécurisé ?',
  "Un camarade partage une photo humiliante de moi, que faire ?",
  "Je me suis perdu au marché avec mes parents",
  "Un élève me dit qu'il vit une situation dangereuse à la maison, je suis enseignant",
  'Comment reconnaître une fausse information en ligne ?',
];

async function main() {
  for (const query of TEST_QUERIES) {
    console.log(`\n=== "${query}" ===`);
    const results = await searchFiches(query, { limit: 3, includeUnpublished: true });
    for (const r of results) {
      console.log(
        `  [${r.final_score.toFixed(4)}] ${r.slug} — ${r.topic} (lex=${r.lexical_score.toFixed(3)}, sem=${r.semantic_score.toFixed(3)}, risk=${r.risk_level})`
      );
    }
  }
}

main()
  .catch((err) => {
    console.error('Search test failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
