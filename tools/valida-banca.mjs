// Validatore indipendente della banca: ricalcola la risposta corretta dai dati e
// verifica che sia l'UNICA opzione corretta (es. nessun riordino valido tra i distrattori).
// Uso: node tools/valida-banca.mjs
import { readFileSync } from "node:fs";
import { numeroInLettere, lettereInNumero } from "./numero-in-lettere.mjs";

const MARCHE = ["u", "da", "h", "uk", "dak", "hk", "uM", "daM", "hM", "uG", "daG", "hG"];
const int = (s) => Number(String(s).replace(/\./g, ""));
const cifraA = (n, i) => Math.floor(n / 10 ** i) % 10;
const err = (q, m) => { throw new Error(`[${q.id}] ${m}`); };

function sommaScomposizione(opzione) {
  let somma = 0;
  for (const termine of opzione.split(" + ")) {
    const m = termine.match(/^(\d+) ([a-zA-Z]+)$/);
    if (!m) return null;
    const i = MARCHE.indexOf(m[2]);
    if (i < 0) return null;
    somma += Number(m[1]) * 10 ** i;
  }
  return somma;
}
function sommaAdditiva(opzione) {
  const parti = opzione.split(" + ");
  if (parti.some((p) => !/^\d[\d.]*$/.test(p))) return null;
  return parti.map(int).reduce((a, b) => a + b, 0);
}
function valutaPolinomio(opzione) {
  let somma = 0, trovato = false;
  for (const m of opzione.matchAll(/\((\d+)×([\d.]+)\)/g)) { somma += Number(m[1]) * int(m[2]); trovato = true; }
  return trovato ? somma : null;
}
const quante = (arr, pred) => arr.filter(pred).length;

const banca = JSON.parse(readFileSync("data/questions.json", "utf8"));
let n = 0;
for (const q of banca.domande) {
  const t = q.testo, ops = q.opzioni, num = q.numero, corr = q.corretta;
  if (ops.length !== 4) err(q, "servono 4 opzioni");
  if (new Set(ops).size !== 4) err(q, "opzioni duplicate");
  if (q.audience.length !== 4 || q.audience.reduce((a, b) => a + b, 0) !== 100) err(q, "audience non somma 100");
  if (q.audience[corr] !== Math.max(...q.audience)) err(q, "audience: massimo non sulla corretta");
  if (!q.hint || !q.spiegazione) err(q, "hint o spiegazione mancante");

  switch (q.tipologia) {
    case "A": {
      const m = t.match(/Nel numero ([\d.]+), quale valore posizionale occupa la cifra (\d)/);
      const v = int(m[1]), d = Number(m[2]);
      const pos = []; for (let i = 0; 10 ** i <= v; i++) if (cifraA(v, i) === d) pos.push(i);
      if (pos.length !== 1) err(q, `cifra ${d} non unica in ${v}`);
      const atteso = MARCHE[pos[0]];
      const nCorrette = quante(ops, (o) => (o.match(/\(([a-zA-Z]+)\)/) || [])[1] === atteso);
      if (nCorrette !== 1) err(q, `tipo A ambiguo: ${nCorrette} opzioni corrette`);
      if ((ops[corr].match(/\(([a-zA-Z]+)\)/) || [])[1] !== atteso) err(q, "tipo A: corretta non segnata");
      break;
    }
    case "B": {
      const m = t.match(/Nel numero ([\d.]+), a quale valore corrisponde la cifra (\d)/);
      const v = int(m[1]), d = Number(m[2]);
      const pos = []; for (let i = 0; 10 ** i <= v; i++) if (cifraA(v, i) === d) pos.push(i);
      if (pos.length !== 1) err(q, `cifra ${d} non unica in ${v}`);
      const atteso = d * 10 ** pos[0];
      const nCorrette = quante(ops, (o) => int(o) === atteso);
      if (nCorrette !== 1) err(q, `tipo B ambiguo: ${nCorrette} opzioni corrette`);
      break;
    }
    case "C": {
      if (sommaScomposizione(ops[corr]) !== num) err(q, "tipo C: corretta non valida");
      const nCorrette = quante(ops, (o) => sommaScomposizione(o) === num);
      if (nCorrette !== 1) err(q, `tipo C ambiguo: ${nCorrette} opzioni corrette (riordini?)`);
      break;
    }
    case "D": {
      if (t.startsWith("Come si scrive in lettere")) {
        const atteso = numeroInLettere(num);
        if (ops[corr] !== atteso) err(q, "tipo D: lettere errate");
        if (quante(ops, (o) => o === atteso) !== 1) err(q, "tipo D ambiguo");
      } else {
        const m = t.match(/Scrivi in cifre: "(.+)"\./);
        const atteso = lettereInNumero(m[1]);
        if (int(ops[corr]) !== atteso) err(q, "tipo D: cifre errate");
        if (quante(ops, (o) => int(o) === atteso) !== 1) err(q, "tipo D ambiguo");
      }
      break;
    }
    case "E": {
      if (sommaAdditiva(ops[corr]) !== num) err(q, "tipo E: corretta non valida");
      const nCorrette = quante(ops, (o) => sommaAdditiva(o) === num);
      if (nCorrette !== 1) err(q, `tipo E ambiguo: ${nCorrette} opzioni corrette`);
      break;
    }
    case "F": {
      if (valutaPolinomio(ops[corr]) !== num) err(q, "tipo F: corretta non valida");
      const nCorrette = quante(ops, (o) => valutaPolinomio(o) === num);
      if (nCorrette !== 1) err(q, `tipo F ambiguo: ${nCorrette} opzioni corrette`);
      break;
    }
    case "G": {
      const m = t.match(/Quanto manca a ([\d.]+) per raggiungere ([\d.]+)\?/);
      const atteso = int(m[2]) - int(m[1]);
      const nCorrette = quante(ops, (o) => int(o) === atteso);
      if (nCorrette !== 1) err(q, `tipo G ambiguo: ${nCorrette} opzioni corrette`);
      break;
    }
    default: err(q, "tipologia sconosciuta");
  }
  n++;
}
console.log("Banca valida:", n, "domande; una sola risposta corretta per ogni domanda.");
