// Caricamento della banca domande e preparazione di una partita.

export async function caricaBanca(url = "data/questions.json") {
  const risposta = await fetch(url, { cache: "no-cache" });
  if (!risposta.ok) throw new Error("Impossibile caricare le domande (" + risposta.status + ")");
  const banca = await risposta.json();
  if (!banca || !Array.isArray(banca.domande) || banca.domande.length === 0) {
    throw new Error("Banca domande vuota o malformata");
  }
  for (const q of banca.domande) {
    if (!Array.isArray(q.opzioni) || q.opzioni.length !== 4) throw new Error("Domanda " + q.id + ": servono 4 opzioni");
    if (!(q.corretta >= 0 && q.corretta <= 3)) throw new Error("Domanda " + q.id + ": indice corretto non valido");
    if (!Array.isArray(q.audience) || q.audience.length !== 4) throw new Error("Domanda " + q.id + ": audience non valida");
  }
  return banca;
}

function mescola(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Mescola opzioni e audience insieme, aggiornando l'indice della corretta.
function prepara(q, rng) {
  const ordine = mescola([0, 1, 2, 3], rng);
  const opzioni = ordine.map((i) => q.opzioni[i]);
  const audience = ordine.map((i) => q.audience[i]);
  const corretta = ordine.indexOf(q.corretta);
  return { ...q, opzioni, audience, corretta };
}

// Una domanda per livello, senza ripetizioni (i pool sono per livello).
export function creaPartita(banca, rng = Math.random) {
  const perLivello = new Map();
  for (const q of banca.domande) {
    if (!perLivello.has(q.livello)) perLivello.set(q.livello, []);
    perLivello.get(q.livello).push(q);
  }
  const partita = [];
  for (let livello = 1; livello <= 15; livello++) {
    const pool = perLivello.get(livello) || [];
    if (!pool.length) throw new Error("Nessuna domanda per il livello " + livello);
    const q = pool[Math.floor(rng() * pool.length)];
    partita.push(prepara(q, rng));
  }
  return partita;
}
