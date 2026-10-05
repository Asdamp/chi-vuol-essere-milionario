// Rendering DOM. Legge lo stato e disegna; ogni interazione chiama un'azione.
import { SCALA, SOGLIE, LIVELLI } from "./gioco.js";

const eur = (n) => "€ " + n.toLocaleString("it-IT");
const lettera = (i) => "ABCD"[i];

function barraComandi(azioni, muto) {
  return `<div class="barra">
    <button data-azione="muto" aria-pressed="${muto}" title="Attiva/disattiva l'audio">${muto ? "Audio off" : "Audio on"}</button>
    <button data-azione="schermo" title="Schermo intero">Schermo intero</button>
    <button data-azione="crediti" title="Crediti">Crediti</button>
  </div>`;
}

function schermataAvvio(stato, azioni, muto) {
  const r = stato.record;
  const recordTxt = r.importo > 0 ? `${eur(r.importo)} (livello ${r.livello})` : "nessuno ancora";
  return `${barraComandi(azioni, muto)}
  <div class="avvio">
    <h1>I Grandi Numeri</h1>
    <p class="sub">Chi vuol essere Milionario? — 15 livelli sui grandi numeri</p>
    <div class="record">Record personale: <b>${recordTxt}</b></div>
    <button class="inizia" data-azione="inizia">Inizia a giocare</button>
    <p class="nota">Tre aiuti a disposizione (50:50, Pubblico, Chiamata a casa), un traguardo al livello 5 e uno al livello 10. Nessun timer: pensa con calma. Premi "Inizia" per attivare anche l'audio.</p>
  </div>`;
}

function ladder(stato) {
  const righe = SCALA.map((v, i) => {
    const liv = i + 1;
    const cls = ["row", liv === stato.livello ? "current" : "", SOGLIE.includes(liv) ? "safe" : ""].filter(Boolean).join(" ");
    return `<div class="${cls}"><span class="lvl">${liv}</span><span>${eur(v)}</span></div>`;
  }).reverse().join("");
  return `<div class="ladder"><h3>Scala premi</h3>${righe}</div>`;
}

function classeAns(stato, i) {
  const d = stato.domanda;
  let c = "ans";
  if (stato.eliminate.includes(i)) c += " eliminated";
  if (stato.fase === "conferma" && stato.selezionata === i) c += " selezionata";
  if (stato.fase === "rivelazione") {
    if (i === d.corretta) c += " correct";
    else if (stato.selezionata === i && stato.esito === "errata") c += " wrong";
  }
  return c;
}

function schermataGioco(stato, azioni, muto) {
  const d = stato.domanda;
  const vite = [
    { chiave: "cinquanta", testo: "50:50", kbd: "1" },
    { chiave: "pubblico", testo: "Pubblico", kbd: "2" },
    { chiave: "casa", testo: "Casa", kbd: "3" },
  ].map((v) => `<button class="life ${stato.aiuti[v.chiave] ? "used" : ""}" data-aiuto="${v.chiave}" ${stato.aiuti[v.chiave] ? "disabled" : ""}>
      <span>${v.testo}<span class="kbd">${v.kbd}</span></span></button>`).join("");

  const risposte = d.opzioni.map((o, i) => {
    const pc = stato.mostra.pubblico && !stato.eliminate.includes(i) ? `<span class="percento">${d.audience[i]}%</span>` : "";
    return `<button class="${classeAns(stato, i)}" data-indice="${i}" ${stato.eliminate.includes(i) ? "disabled" : ""}>
      <span class="letter">${lettera(i)}</span><span>${o}</span>${pc}</button>`;
  }).join("");

  const casa = stato.mostra.casa ? `<div class="aiuto-casa"><b>Indizio:</b> ${d.hint}</div>` : "";
  const confermaBar = stato.fase === "conferma"
    ? `<div class="conferma-bar"><span>Risposta scelta: <b>${lettera(stato.selezionata)}) ${d.opzioni[stato.selezionata]}</b>. È la risposta definitiva?</span><button data-azione="conferma">Conferma (Invio)</button></div>`
    : "";

  const rivelazione = stato.fase === "rivelazione"
    ? `<div class="overlay"><div class="panel ${stato.esito}">
        <h2>${stato.esito === "corretta" ? "Risposta corretta!" : "Risposta errata"}</h2>
        <p class="why">${d.spiegazione}</p>
        <div class="azioni"><button data-azione="avanti">${stato.livello === LIVELLI && stato.esito === "corretta" ? "Vedi il risultato" : "Avanti"}</button></div>
      </div></div>`
    : "";

  return `${barraComandi(azioni, muto)}
  <div class="lifelines">${vite}</div>
  <div class="stage">
    <div>
      <div class="question"><span class="tag">Livello ${stato.livello} di ${LIVELLI} · Tipologia ${d.tipologia} · ${d.fascia}</span>${d.testo}</div>
      <div class="answers">${risposte}</div>
      ${casa}
      ${confermaBar}
    </div>
    ${ladder(stato)}
  </div>
  ${rivelazione}`;
}

function schermataFine(stato, azioni, muto) {
  const vinta = stato.esito === "corretta";
  const r = stato.record;
  return `${barraComandi(azioni, muto)}
  <div class="overlay"><div class="panel ${vinta ? "corretta" : "errata"}">
    <h2>${vinta ? "Hai vinto!" : "Partita finita"}</h2>
    <div class="prize">${eur(stato.vincita)}</div>
    <p class="why">${vinta ? "Complimenti, hai completato tutti i 15 livelli!" : "Ti fermi al livello " + stato.livello + "."} ${stato.domanda ? stato.domanda.spiegazione : ""}</p>
    <p class="why">Record personale: <b>${eur(r.importo)}</b> (livello ${r.livello})</p>
    <div class="azioni"><button data-azione="rigioca">Rigioca</button></div>
  </div></div>`;
}

export function disegna(stato, azioni, muto) {
  const app = document.getElementById("app");
  if (stato.fase === "avvio") app.innerHTML = schermataAvvio(stato, azioni, muto);
  else if (stato.fase === "fine") app.innerHTML = schermataFine(stato, azioni, muto);
  else app.innerHTML = schermataGioco(stato, azioni, muto);

  app.querySelectorAll("[data-indice]").forEach((el) => {
    el.addEventListener("click", () => azioni.seleziona(Number(el.dataset.indice)));
  });
  app.querySelectorAll("[data-aiuto]").forEach((el) => {
    el.addEventListener("click", () => azioni.aiuto(el.dataset.aiuto));
  });
  app.querySelectorAll("[data-azione]").forEach((el) => {
    const a = el.dataset.azione;
    if (azioni[a]) el.addEventListener("click", () => azioni[a]());
  });
}

export function disegnaCrediti(azioni, muto, dati) {
  const voci = (dati && dati.voci ? dati.voci : []).map((v) => `<li>
    <b>${v.uso}</b> — ${v.titolo} · ${v.autore} (${v.fonte}) · <a href="${v.licenzaUrl}" target="_blank" rel="noopener">${v.licenza}</a>
  </li>`).join("");
  document.getElementById("app").innerHTML = `${barraComandi(azioni, muto)}
  <div class="crediti">
    <h2>Crediti</h2>
    <p class="nota">${dati && dati.nota ? dati.nota : ""}</p>
    <ul>${voci}</ul>
    <div class="azioni"><button data-azione="chiudiCrediti">Torna al gioco</button></div>
  </div>`;
  document.querySelectorAll("[data-azione]").forEach((el) => {
    const a = el.dataset.azione;
    if (azioni[a]) el.addEventListener("click", () => azioni[a]());
  });
}
