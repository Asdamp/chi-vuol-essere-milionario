import { test } from "node:test";
import assert from "node:assert/strict";
import { statoIniziale, riduci, miglioreRecord, importoInCasoDiErrore, LIVELLI } from "../js/gioco.js";

// Partita finta: 15 domande, la corretta è sempre l'indice 0.
function partitaFinta() {
  return Array.from({ length: LIVELLI }, (_, i) => ({
    id: "L" + (i + 1),
    livello: i + 1,
    tipologia: "A",
    fascia: "x",
    testo: "d" + (i + 1),
    opzioni: ["giusta", "a", "b", "c"],
    audience: [70, 10, 10, 10],
    corretta: 0,
    hint: "h",
    spiegazione: "s",
  }));
}

function gioca(stato, scelte) {
  let s = riduci(stato, { tipo: "INIZIA" });
  for (const scelta of scelte) {
    s = riduci(s, { tipo: "SELEZIONA", indice: scelta });
    s = riduci(s, { tipo: "CONFERMA" });
    s = riduci(s, { tipo: "AVANTI" });
  }
  return s;
}

test("vittoria: 15 risposte corrette", () => {
  const s = gioca(statoIniziale(partitaFinta(), { importo: 0, livello: 0 }), Array(15).fill(0));
  assert.equal(s.fase, "fine");
  assert.equal(s.esito, "corretta");
  assert.equal(s.vincita, 1000000);
});

test("errore al livello 6: si incassa il traguardo del 5 (1000)", () => {
  const s = gioca(statoIniziale(partitaFinta(), { importo: 0, livello: 0 }), [0, 0, 0, 0, 0, 1]);
  assert.equal(s.fase, "fine");
  assert.equal(s.esito, "errata");
  assert.equal(s.vincita, 1000);
});

test("errore al livello 3: si incassa 0", () => {
  const s = gioca(statoIniziale(partitaFinta(), { importo: 0, livello: 0 }), [0, 0, 1]);
  assert.equal(s.vincita, 0);
});

test("errore al livello 12: si incassa il traguardo del 10 (32000)", () => {
  const s = gioca(statoIniziale(partitaFinta(), { importo: 0, livello: 0 }), [...Array(11).fill(0), 2]);
  assert.equal(s.vincita, 32000);
});

test("importoInCasoDiErrore", () => {
  assert.equal(importoInCasoDiErrore(1), 0);
  assert.equal(importoInCasoDiErrore(5), 0);
  assert.equal(importoInCasoDiErrore(6), 1000);
  assert.equal(importoInCasoDiErrore(10), 1000);
  assert.equal(importoInCasoDiErrore(11), 32000);
  assert.equal(importoInCasoDiErrore(15), 32000);
});

test("50:50 elimina due opzioni sbagliate, mai la corretta", () => {
  let s = riduci(statoIniziale(partitaFinta(), null), { tipo: "INIZIA" });
  s = riduci(s, { tipo: "USA_AIUTO", aiuto: "cinquanta" });
  assert.equal(s.eliminate.length, 2);
  assert.ok(!s.eliminate.includes(s.domanda.corretta));
  // non riutilizzabile
  const s2 = riduci(s, { tipo: "USA_AIUTO", aiuto: "cinquanta" });
  assert.deepEqual(s2.eliminate, s.eliminate);
});

test("non si può selezionare un'opzione eliminata", () => {
  let s = riduci(statoIniziale(partitaFinta(), null), { tipo: "INIZIA" });
  s = riduci(s, { tipo: "USA_AIUTO", aiuto: "cinquanta" });
  const s2 = riduci(s, { tipo: "SELEZIONA", indice: s.eliminate[0] });
  assert.equal(s2.selezionata, null);
});

test("miglioreRecord tiene il massimo", () => {
  const statoFine = { fase: "fine", esito: "corretta", vincita: 1000000, livello: 15 };
  assert.deepEqual(miglioreRecord({ importo: 500000, livello: 14 }, statoFine), { importo: 1000000, livello: 15 });
  assert.deepEqual(miglioreRecord({ importo: 1000000, livello: 15 }, statoFine), { importo: 1000000, livello: 15 });
});
