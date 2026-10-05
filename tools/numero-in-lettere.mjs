// Conversioni cifre <-> lettere per l'italiano (grandi numeri).
// Usato dal generatore della banca domande (tipologia D).

const UNITA = ["", "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove"];
const TEENS = ["dieci", "undici", "dodici", "tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove"];
const DECINE = ["", "", "venti", "trenta", "quaranta", "cinquanta", "sessanta", "settanta", "ottanta", "novanta"];

const MAPPA_UNITA = { un: 1, uno: 1, una: 1, due: 2, tre: 3, quattro: 4, cinque: 5, sei: 6, sette: 7, otto: 8, nove: 9 };
const MAPPA_TEENS = { dieci: 10, undici: 11, dodici: 12, tredici: 13, quattordici: 14, quindici: 15, sedici: 16, diciassette: 17, diciotto: 18, diciannove: 19 };
const DECINE_PIENE = [["venti", 20], ["trenta", 30], ["quaranta", 40], ["cinquanta", 50], ["sessanta", 60], ["settanta", 70], ["ottanta", 80], ["novanta", 90]];
const DECINE_ELISE = [["vent", 20], ["trent", 30], ["quarant", 40], ["cinquant", 50], ["sessant", 60], ["settant", 70], ["ottant", 80], ["novant", 90]];

function sottoCento(n) {
  if (n === 0) return "";
  if (n < 10) return UNITA[n];
  if (n < 20) return TEENS[n - 10];
  const d = Math.floor(n / 10), u = n % 10;
  let tens = DECINE[d];
  if (u === 0) return tens;
  if (u === 1 || u === 8) tens = tens.slice(0, -1);
  return tens + UNITA[u];
}

function sottoMille(n) {
  if (n === 0) return "";
  const h = Math.floor(n / 100), r = n % 100;
  let out = h > 0 ? (h === 1 ? "cento" : UNITA[h] + "cento") : "";
  if (r === 0) return out;
  const rest = sottoCento(r);
  if (h > 0 && rest.startsWith("o")) out = out.slice(0, -1);
  return out + rest;
}

function gruppoScala(v, singolare, plurale) {
  if (v === 1) return "un " + singolare;
  let w = sottoMille(v);
  if (w.endsWith("uno")) w = w.slice(0, -1);
  return w + " " + plurale;
}

export function numeroInLettere(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error("numeroInLettere: atteso intero >= 0, ricevuto " + n);
  if (n === 0) return "zero";
  const miliardi = Math.floor(n / 1e9);
  const milioni = Math.floor(n / 1e6) % 1000;
  const migliaia = Math.floor(n / 1e3) % 1000;
  const unita = n % 1000;
  const parti = [];
  if (miliardi) parti.push(gruppoScala(miliardi, "miliardo", "miliardi"));
  if (milioni) parti.push(gruppoScala(milioni, "milione", "milioni"));
  if (migliaia || unita) {
    let blocco = "";
    if (migliaia === 1) blocco = "mille";
    else if (migliaia > 1) blocco = sottoMille(migliaia) + "mila";
    if (unita) blocco += sottoMille(unita);
    parti.push(blocco);
  }
  return parti.join(" ");
}

function parseSottoCento(w) {
  if (w === "" || w === "un" || w === "uno") return w === "" ? 0 : 1;
  if (w in MAPPA_UNITA) return MAPPA_UNITA[w];
  if (w in MAPPA_TEENS) return MAPPA_TEENS[w];
  for (const [root, val] of DECINE_PIENE) {
    if (w === root) return val;
    if (w.startsWith(root)) return val + parseSottoCento(w.slice(root.length));
  }
  for (const [root, val] of DECINE_ELISE) {
    if (w.startsWith(root)) return val + parseSottoCento(w.slice(root.length));
  }
  throw new Error("lettereInNumero: parola non riconosciuta: " + w);
}

function parseCompound(w) {
  if (w === "" || w === "un" || w === "uno") return w === "" ? 0 : 1;
  const idx = w.indexOf("cent");
  if (idx >= 0) {
    const prefix = w.slice(0, idx);
    const after = w.slice(idx + 4);
    const h = prefix === "" ? 1 : MAPPA_UNITA[prefix];
    if (h === undefined) throw new Error("lettereInNumero: centinaia non riconosciute: " + w);
    let rem = after;
    if (after.startsWith("ott")) rem = after;
    else if (after.startsWith("o")) rem = after.slice(1);
    return h * 100 + (rem ? parseSottoCento(rem) : 0);
  }
  return parseSottoCento(w);
}

export function lettereInNumero(s) {
  const segs = s.toLowerCase().replace(/[^a-zàèéìòù\s]/g, " ").trim().split(/\s+/).filter(Boolean);
  let total = 0, pending = 0;
  for (const seg of segs) {
    if (seg === "miliardo" || seg === "miliardi") { total += (pending || 1) * 1e9; pending = 0; }
    else if (seg === "milione" || seg === "milioni") { total += (pending || 1) * 1e6; pending = 0; }
    else if (seg.includes("mila")) {
      const i = seg.indexOf("mila");
      const left = seg.slice(0, i), right = seg.slice(i + 4);
      total += (left === "" ? 1 : parseCompound(left)) * 1000;
      if (right) total += parseCompound(right);
    } else if (seg.startsWith("mille")) {
      const rest = seg.slice(5);
      total += 1000 + (rest ? parseCompound(rest) : 0);
    } else {
      pending = parseCompound(seg);
    }
  }
  return total + pending;
}
