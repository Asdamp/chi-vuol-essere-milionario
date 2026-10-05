// Validatore indipendente della banca: ricalcola la risposta corretta dai dati
// e la confronta con l'opzione segnata. Uso: node tools/valida-banca.mjs
import { readFileSync } from "node:fs";
import { numeroInLettere, lettereInNumero } from "./numero-in-lettere.mjs";

const MARCHE = ["u", "da", "h", "uk", "dak", "hk", "uM", "daM", "hM", "uG", "daG", "hG"];
const int = (s) => Number(String(s).replace(/\./g, ""));
const cifraA = (n, i) => Math.floor(n / 10 ** i) % 10;
const err = (q, m) => { throw new Error(`[${q.id}] ${m}`); };

function validaA(q, n, d) {
  const pos = [];
  for (let i = 0; 10 ** i <= n; i++) if (cifraA(n, i) === d) pos.push(i);
  if (pos.length !== 1) err(q, `cifra ${d} non unica in ${n}`);
  const code = q.opzioni[q.corretta].match(/\(([a-zA-Z]+)\)/)[1];
  if (MARCHE[pos[0]] !== code) err(q, `marca attesa ${MARCHE[pos[0]]}, trovata ${code}`);
}
function validaB(q, n, d) {
  const pos = [];
  for (let i = 0; 10 ** i <= n; i++) if (cifraA(n, i) === d) pos.push(i);
  if (pos.length !== 1) err(q, `cifra ${d} non unica in ${n}`);
  const v = int(q.opzioni[q.corretta]);
  if (v !== d * 10 ** pos[0]) err(q, `valore atteso ${d * 10 ** pos[0]}, trovato ${v}`);
}
function validaC(q, n) {
  let somma = 0;
  for (const t of q.opzioni[q.corretta].split(" + ")) {
    const m = t.match(/^(\d+) ([a-zA-Z]+)$/);
    if (!m) err(q, "termine malformato: " + t);
    const i = MARCHE.indexOf(m[2]);
    if (i < 0) err(q, "codice sconosciuto: " + m[2]);
    somma += Number(m[1]) * 10 ** i;
  }
  if (somma !== n) err(q, `scomposizione somma ${somma} != ${n}`);
}
function validaE(q, n) {
  const somma = q.opzioni[q.corretta].split(" + ").map(int).reduce((a, b) => a + b, 0);
  if (somma !== n) err(q, `somma additiva ${somma} != ${n}`);
}
function validaF(q, n) {
  let somma = 0;
  for (const m of q.opzioni[q.corretta].matchAll(/\((\d+)×([\d.]+)\)/g)) somma += Number(m[1]) * int(m[2]);
  if (somma !== n) err(q, `polinomio ${somma} != ${n}`);
}
function validaG(q, n, target) {
  const v = int(q.opzioni[q.corretta]);
  if (target - n !== v) err(q, `${target} - ${n} = ${target - n}, trovato ${v}`);
}

const banca = JSON.parse(readFileSync("data/questions.json", "utf8"));
let n = 0;
for (const q of banca.domande) {
  const num = q.numero;
  const t = q.testo;
  switch (q.tipologia) {
    case "A": { const m = t.match(/Nel numero ([\d.]+), quale valore posizionale occupa la cifra (\d)/); validaA(q, int(m[1]), Number(m[2])); break; }
    case "B": { const m = t.match(/Nel numero ([\d.]+), a quale valore corrisponde la cifra (\d)/); validaB(q, int(m[1]), Number(m[2])); break; }
    case "C": validaC(q, num); break;
    case "D": {
      if (t.startsWith("Come si scrive in lettere")) { if (q.opzioni[q.corretta] !== numeroInLettere(num)) err(q, "lettere errate"); }
      else { const m = t.match(/Scrivi in cifre: "(.+)"\./); if (lettereInNumero(m[1]) !== int(q.opzioni[q.corretta])) err(q, "cifre errate"); }
      break;
    }
    case "E": validaE(q, num); break;
    case "F": validaF(q, num); break;
    case "G": { const m = t.match(/Quanto manca a ([\d.]+) per raggiungere ([\d.]+)\?/); validaG(q, int(m[1]), int(m[2])); break; }
  }
  n++;
}
console.log("Banca valida:", n, "domande verificate.");
