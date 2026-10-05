// Generatore della banca domande per "Chi vuol essere Milionario? – I Grandi Numeri".
// Uso: node tools/genera-domande.mjs   ->  scrive data/questions.json
// Seme fisso: la banca è riproducibile.

import { writeFileSync, mkdirSync } from "node:fs";
import { numeroInLettere } from "./numero-in-lettere.mjs";

const SEME = 20241005;
const DOMANDE_PER_LIVELLO = 12;

const TIPOLOGIE_PER_LIVELLO = {
  1: ["A", "B"], 2: ["A", "B", "D"], 3: ["A", "B", "D"], 4: ["A", "B", "C"], 5: ["A", "B", "C", "D"],
  6: ["A", "B", "C", "E"], 7: ["A", "B", "C", "E"], 8: ["A", "B", "C", "E", "G"], 9: ["A", "B", "D", "E", "G"], 10: ["B", "C", "E", "G"],
  11: ["C", "E", "F"], 12: ["C", "F", "G"], 13: ["B", "C", "F", "G"], 14: ["C", "D", "F", "G"], 15: ["C", "D", "F", "G"],
};

const MARCHE = [
  { code: "u", nome: "unità (u)" }, { code: "da", nome: "decine (da)" }, { code: "h", nome: "centinaia (h)" },
  { code: "uk", nome: "unità di migliaia (uk)" }, { code: "dak", nome: "decine di migliaia (dak)" }, { code: "hk", nome: "centinaia di migliaia (hk)" },
  { code: "uM", nome: "unità di milione (uM)" }, { code: "daM", nome: "decine di milioni (daM)" }, { code: "hM", nome: "centinaia di milioni (hM)" },
  { code: "uG", nome: "unità di miliardo (uG)" }, { code: "daG", nome: "decine di miliardi (daG)" }, { code: "hG", nome: "centinaia di miliardi (hG)" },
];

const RANGHI = { migliaia: [1000, 999999], milioni: [1000000, 999999999], miliardi: [1000000000, 999999999999] };
const LUNGHEZZE = { migliaia: [4, 6], milioni: [7, 9], miliardi: [10, 12] };
const fasce = (livello) => (livello <= 5 ? "migliaia" : livello <= 10 ? "milioni" : "miliardi");

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(SEME);
const randInt = (a, b) => a + Math.floor(rng() * (b - a + 1));
const fmt = (n) => n.toLocaleString("it-IT");
const shuffle = (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };

function cifraA(n, i) { return Math.floor(n / 10 ** i) % 10; }
function cifreNonNulle(n) {
  const out = [];
  for (let i = 0; 10 ** i <= n; i++) { const d = cifraA(n, i); if (d !== 0) out.push({ d, i }); }
  return out;
}
function cifraUnica(n) {
  const conteggi = {};
  const s = String(n);
  for (const c of s) conteggi[c] = (conteggi[c] || 0) + 1;
  const cand = [];
  for (let i = 0; 10 ** i <= n; i++) { const d = cifraA(n, i); if (d !== 0 && conteggi[String(d)] === 1) cand.push({ d, i }); }
  return cand;
}
function generaNumero(fascia, { nonNulle = [3, 5] } = {}) {
  const [min, max] = RANGHI[fascia];
  const [lmin, lmax] = LUNGHEZZE[fascia];
  for (let t = 0; t < 300; t++) {
    const len = randInt(lmin, lmax);
    const k = randInt(nonNulle[0], nonNulle[1]);
    const s = new Array(len).fill("0");
    s[0] = String(randInt(1, 9));
    const pos = shuffle([...Array(len - 1).keys()].map((i) => i + 1)).slice(0, k - 1);
    for (const p of pos) s[p] = String(randInt(1, 9));
    const v = Number(s.join(""));
    if (v >= min && v <= max && cifreNonNulle(v).length >= 2) return v;
  }
  return randInt(min, max);
}
function scegli(rng, arr, k) {
  const copia = shuffle(arr.slice());
  return copia.slice(0, k);
}
function scegliDistrattori(correct, candidati, k = 3) {
  const visti = new Set([correct]);
  const out = [];
  for (const c of candidati) {
    if (c == null) continue;
    if (!visti.has(c)) { visti.add(c); out.push(c); }
    if (out.length === k) break;
  }
  if (out.length < k) throw new Error("distrattori insufficienti per: " + correct + " (ho " + out.length + ")");
  return out;
}
function assembla(correct, distrattori) {
  const opzioni = shuffle([correct, ...distrattori]);
  return { opzioni, corretta: opzioni.indexOf(correct) };
}
function audience(correctIdx) {
  const pct = randInt(55, 78);
  const vals = [0, 0, 0, 0];
  vals[correctIdx] = pct;
  const altri = [0, 1, 2, 3].filter((i) => i !== correctIdx);
  let resto = 100 - pct;
  const pesi = altri.map(() => rng() + 0.2);
  const somma = pesi.reduce((a, b) => a + b, 0);
  let acc = 0;
  altri.forEach((idx, k) => {
    const v = k === altri.length - 1 ? resto - acc : Math.round(resto * pesi[k] / somma);
    vals[idx] = v; acc += v;
  });
  const diff = 100 - vals.reduce((a, b) => a + b, 0);
  vals[correctIdx] += diff;
  return vals;
}
function intorni(i) {
  const idx = [];
  for (const d of [1, -1, 2, -2, 3, -3, 4]) {
    const j = i + d;
    if (j >= 0 && j < MARCHE.length) idx.push(j);
  }
  return idx;
}

// ---------- Generatori per tipologia ----------

function tipoA(livello, fascia) {
  for (let t = 0; t < 300; t++) {
    const n = generaNumero(fascia, { nonNulle: [3, 6] });
    const cand = cifraUnica(n);
    if (!cand.length) continue;
    const { d, i } = cand[Math.floor(rng() * cand.length)];
    const correct = MARCHE[i].nome;
    const candidati = intorni(i).map((j) => MARCHE[j].nome);
    const { opzioni, corretta } = assembla(correct, scegliDistrattori(correct, candidati));
    return {
      numero: n, valoriPosizionali: cifreNonNulle(n).map((c) => MARCHE[c.i].code),
      testo: `Nel numero ${fmt(n)}, quale valore posizionale occupa la cifra ${d}?`,
      opzioni, corretta,
      hint: `Conta le posizioni da destra a gruppi di tre (u, da, h — poi uk, dak, hk...). Guarda in quale gruppo cade la cifra ${d}.`,
      audience: audience(corretta),
      spiegazione: `La cifra ${d} occupa ${MARCHE[i].nome}, quindi vale ${d} × ${fmt(10 ** i)} = ${fmt(d * 10 ** i)}.`,
    };
  }
  throw new Error("tipoA: nessun numero con cifra unica");
}

function tipoB(livello, fascia) {
  for (let t = 0; t < 300; t++) {
    const n = generaNumero(fascia, { nonNulle: [3, 6] });
    const cand = cifraUnica(n);
    if (!cand.length) continue;
    const { d, i } = cand[Math.floor(rng() * cand.length)];
    const correct = fmt(d * 10 ** i);
    const candidati = [i - 1, i + 1, i + 2, i - 2, i + 3].filter((j) => j >= 0 && j !== i).map((j) => fmt(d * 10 ** j));
    const { opzioni, corretta } = assembla(correct, scegliDistrattori(correct, candidati));
    return {
      numero: n, valoriPosizionali: [MARCHE[i].code],
      testo: `Nel numero ${fmt(n)}, a quale valore corrisponde la cifra ${d}?`,
      opzioni, corretta,
      hint: `La cifra ${d} è nella posizione ${MARCHE[i].code}: moltiplicala per ${fmt(10 ** i)}.`,
      audience: audience(corretta),
      spiegazione: `La cifra ${d} occupa ${MARCHE[i].code}, quindi vale ${d} × ${fmt(10 ** i)} = ${fmt(d * 10 ** i)}.`,
    };
  }
  throw new Error("tipoB: nessun numero con cifra unica");
}

function scomposizioneCanonica(n, ordineDiscendente = true) {
  const termini = cifreNonNulle(n).map((c) => ({ ...c, testo: `${c.d} ${MARCHE[c.i].code}` }));
  if (ordineDiscendente) termini.sort((a, b) => b.i - a.i);
  return termini;
}

function tipoC(livello, fascia) {
  const n = generaNumero(fascia, { nonNulle: [3, 5] });
  const termini = scomposizioneCanonica(n);
  const correct = termini.map((t) => t.testo).join(" + ");
  const candidati = [];
  if (termini.length >= 2) {
    const sw = termini.slice(); [sw[0], sw[1]] = [sw[1], sw[0]];
    candidati.push(sw.map((t) => t.testo).join(" + "));
    candidati.push(termini.slice(1).map((t) => t.testo).join(" + "));
  }
  for (const t of termini) {
    const alt = termini.map((x) => (x === t ? { d: x.d, i: Math.min(x.i + 1, MARCHE.length - 1), testo: `${x.d} ${MARCHE[Math.min(x.i + 1, MARCHE.length - 1)].code}` } : x));
    candidati.push(alt.map((x) => x.testo).join(" + "));
    const d2 = t.d === 9 ? 8 : t.d + 1;
    const alt2 = termini.map((x) => (x === t ? { d: d2, i: x.i, testo: `${d2} ${MARCHE[x.i].code}` } : x));
    candidati.push(alt2.map((x) => x.testo).join(" + "));
  }
  const { opzioni, corretta } = assembla(correct, scegliDistrattori(correct, candidati));
  return {
    numero: n, valoriPosizionali: termini.map((t) => MARCHE[t.i].code),
    testo: `Qual è la scomposizione per valori posizionali del numero ${fmt(n)}?`,
    opzioni, corretta,
    hint: `Elenca le cifre non nulle dalla posizione più alta alla più bassa, ciascuna con il suo codice.`,
    audience: audience(corretta),
    spiegazione: `${fmt(n)} = ${correct}.`,
  };
}

function tipoD(livello, fascia) {
  const n = generaNumero(fascia, { nonNulle: [3, 6] });
  const versoLettere = rng() < 0.5;
  if (versoLettere) {
    const correct = numeroInLettere(n);
    const vicini = [n + 1, n - 1, n + 10, n - 10, n + 100].filter((v) => v > 0).map(numeroInLettere);
    const mutazioni = [correct.replace("mila", "mille"), correct.replace("milioni", "milione"), correct.replace("miliardi", "miliardo")];
    const { opzioni, corretta } = assembla(correct, scegliDistrattori(correct, [...vicini, ...mutazioni]));
    return {
      numero: n, valoriPosizionali: cifreNonNulle(n).map((c) => MARCHE[c.i].code),
      testo: `Come si scrive in lettere il numero ${fmt(n)}?`,
      opzioni, corretta,
      hint: `Leggi il numero a gruppi: prima i miliardi/milioni, poi le migliaia ("mila"), poi il resto.`,
      audience: audience(corretta),
      spiegazione: `${fmt(n)} si scrive "${correct}".`,
    };
  }
  const correct = fmt(n);
  const vicini = [n + 1, n - 1, n + 10, n - 10, n + 100].filter((v) => v > 0).map(fmt);
  const cifre = String(n).split(""); if (cifre.length >= 2) { const sc = cifre.slice(); [sc[0], sc[1]] = [sc[1], sc[0]]; vicini.push(fmt(Number(sc.join("")))); }
  const { opzioni, corretta } = assembla(correct, scegliDistrattori(correct, vicini));
  return {
    numero: n, valoriPosizionali: cifreNonNulle(n).map((c) => MARCHE[c.i].code),
    testo: `Scrivi in cifre: "${numeroInLettere(n)}".`,
    opzioni, corretta,
    hint: `Attenzione ai gruppi: le parole "mila", "milioni", "miliardi" indicano dove vanno le cifre.`,
    audience: audience(corretta),
    spiegazione: `"${numeroInLettere(n)}" si scrive ${fmt(n)}.`,
  };
}

function tipoE(livello, fascia) {
  const n = generaNumero(fascia, { nonNulle: [3, 5] });
  const termini = cifreNonNulle(n).sort((a, b) => b.i - a.i);
  const valori = termini.map((t) => t.d * 10 ** t.i);
  const correct = valori.map(fmt).join(" + ");
  const candidati = [];
  if (valori.length >= 2) candidati.push(valori.slice(1).map(fmt).join(" + "));
  for (const v of valori) {
    candidati.push(valori.map((x) => (x === v ? fmt(x * 10) : fmt(x))).join(" + "));
    if (v % 10 === 0) candidati.push(valori.map((x) => (x === v ? fmt(x / 10) : fmt(x))).join(" + "));
  }
  candidati.push([...valori, 1].map(fmt).join(" + "));
  const { opzioni, corretta } = assembla(correct, scegliDistrattori(correct, candidati));
  return {
    numero: n, valoriPosizionali: termini.map((t) => MARCHE[t.i].code),
    testo: `Qual è la scomposizione additiva (somma dei valori) di ${fmt(n)}?`,
    opzioni, corretta,
    hint: `Per ogni cifra non nulla scrivi il suo valore (cifra × valore della posizione) e uniscili con "+".`,
    audience: audience(corretta),
    spiegazione: `${fmt(n)} = ${correct}.`,
  };
}

function tipoF(livello, fascia) {
  const n = generaNumero(fascia, { nonNulle: [3, 5] });
  const nn = cifreNonNulle(n);
  const alto = Math.max(...nn.map((c) => c.i));
  const basso = Math.min(...nn.map((c) => c.i));
  const conZeri = fascia !== "migliaia" && rng() < 0.6;
  const indici = [];
  for (let i = alto; i >= basso; i--) if (conZeri || cifraA(n, i) !== 0) indici.push(i);
  const termine = (d, i) => `(${d}×${fmt(10 ** i)})`;
  const correct = indici.map((i) => termine(cifraA(n, i), i)).join("+");
  const candidati = [];
  for (const i of indici) {
    candidati.push(indici.map((j) => (j === i ? termine(cifraA(n, j), j + 1) : termine(cifraA(n, j), j))).join("+"));
    candidati.push(indici.map((j) => (j === i ? termine(cifraA(n, j) === 9 ? 8 : cifraA(n, j) + 1, j) : termine(cifraA(n, j), j))).join("+"));
  }
  if (indici.length >= 2) candidati.push(indici.slice(1).map((i) => termine(cifraA(n, i), i)).join("+"));
  const { opzioni, corretta } = assembla(correct, scegliDistrattori(correct, candidati));
  return {
    numero: n, valoriPosizionali: nn.map((c) => MARCHE[c.i].code),
    testo: `Qual è la notazione polinomiale di ${fmt(n)}${conZeri ? ", includendo i termini con fattore zero" : ""}?`,
    opzioni, corretta,
    hint: `Ogni cifra va moltiplicata per la potenza di 10 della sua posizione.`,
    audience: audience(corretta),
    spiegazione: `${fmt(n)} = ${correct}.`,
  };
}

function tipoG(livello, fascia) {
  const target = fascia === "migliaia" ? 1_000_000 : fascia === "milioni" ? 1_000_000_000 : 10_000_000_000;
  const k = scegli(rng, [10, 20, 50, 100, 200, 300, 500, 1000, 1500, 2500, 5000, 10000, 50000, 100000, 500000].filter((x) => x < target / 100), 1)[0];
  const n = target - k;
  const correct = fmt(k);
  const candidati = [k * 10, Math.round(k / 10), k * 2, k * 100, k + 100].filter((x) => Number.isInteger(x) && x > 0).map(fmt);
  const { opzioni, corretta } = assembla(correct, scegliDistrattori(correct, candidati));
  return {
    numero: n, valoriPosizionali: cifreNonNulle(n).map((c) => MARCHE[c.i].code),
    testo: `Quanto manca a ${fmt(n)} per raggiungere ${fmt(target)}?`,
    opzioni, corretta,
    hint: `Fai ${fmt(target)} − ${fmt(n)}: completa prima le posizioni più piccole.`,
    audience: audience(corretta),
    spiegazione: `${fmt(target)} − ${fmt(n)} = ${fmt(k)}.`,
  };
}

const GENERATORI = { A: tipoA, B: tipoB, C: tipoC, D: tipoD, E: tipoE, F: tipoF, G: tipoG };

function valida(q, tipo) {
  const err = (m) => { throw new Error(`[${q.id}] ${m}`); };
  if (q.opzioni.length !== 4) err("servono 4 opzioni");
  if (new Set(q.opzioni).size !== 4) err("opzioni duplicate: " + q.opzioni.join(" | "));
  if (!(q.corretta >= 0 && q.corretta <= 3)) err("indice corretta fuori range");
  if (q.audience.length !== 4 || q.audience.reduce((a, b) => a + b, 0) !== 100) err("audience non somma 100: " + q.audience.join(","));
  if (q.audience[q.corretta] !== Math.max(...q.audience)) err("audience: il massimo non è sulla corretta");
  if (!q.hint || !q.spiegazione) err("hint o spiegazione mancante");
  if (!q.testo) err("testo mancante");
  if (!["A", "B", "C", "D", "E", "F", "G"].includes(tipo)) err("tipologia sconosciuta");
}

function main() {
  const domande = [];
  for (let livello = 1; livello <= 15; livello++) {
    const fascia = fasce(livello);
    const tipologie = TIPOLOGIE_PER_LIVELLO[livello];
    for (let k = 0; k < DOMANDE_PER_LIVELLO; k++) {
      const tipo = tipologie[k % tipologie.length];
      const gen = GENERATORI[tipo];
      const q = gen(livello, fascia);
      const id = `L${String(livello).padStart(2, "0")}-${tipo}-${String(k + 1).padStart(3, "0")}`;
      const domanda = { id, livello, tipologia: tipo, fascia, ...q };
      valida(domanda, tipo);
      domande.push(domanda);
    }
  }
  const out = { schemaVersione: 1, seme: SEME, domande };
  mkdirSync("data", { recursive: true });
  writeFileSync("data/questions.json", JSON.stringify(out, null, 2) + "\n");
  const perTipo = {};
  for (const d of domande) perTipo[d.tipologia] = (perTipo[d.tipologia] || 0) + 1;
  console.log("Scritte", domande.length, "domande in data/questions.json");
  console.log("Per tipologia:", perTipo);
}

main();
