// Orchestrazione: collega banca, macchina a stati, audio e UI.
import { caricaBanca, creaPartita } from "./domande.js";
import { statoIniziale, riduci, miglioreRecord, LIVELLI } from "./gioco.js";
import * as audio from "./audio.js";
import { disegna, disegnaCrediti } from "./ui.js";

const CHIAVE_RECORD = "cvm-record";

let banca = null;
let crediti = null;
let stato = statoIniziale(null, leggiRecord());
let creditiAperti = false;

function leggiRecord() {
  try {
    const r = JSON.parse(localStorage.getItem(CHIAVE_RECORD));
    if (r && typeof r.importo === "number") return r;
  } catch { /* ignora */ }
  return { importo: 0, livello: 0 };
}
function salvaRecord(r) {
  try { localStorage.setItem(CHIAVE_RECORD, JSON.stringify(r)); } catch { /* ignora */ }
}

function azioni() {
  return {
    inizia() {
      audio.sblocca();
      stato = { ...stato, partita: creaPartita(banca) };
      dispatch({ tipo: "INIZIA" });
      audio.introPoiSuspense();
    },
    seleziona(i) { dispatch({ tipo: "SELEZIONA", indice: i }); },
    conferma() { dispatch({ tipo: "CONFERMA" }); },
    aiuto(a) { dispatch({ tipo: "USA_AIUTO", aiuto: a }); },
    avanti() { dispatch({ tipo: "AVANTI" }); },
    rigioca() { dispatch({ tipo: "RIGIOCA", partita: creaPartita(banca) }); audio.introPoiSuspense(); },
    muto() { audio.toggleMuto(); render(); },
    schermo() {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    },
    crediti() { creditiAperti = true; render(); },
    chiudiCrediti() { creditiAperti = false; render(); },
  };
}

function reagisci(ev, prev, next) {
  if (ev.tipo === "INIZIA" || ev.tipo === "RIGIOCA") return; // gestito in inizia/rigioca
  if (ev.tipo === "USA_AIUTO") { audio.sting("aiuto"); return; }
  if (ev.tipo === "CONFERMA") {
    audio.fermaMusica();
    audio.sting("conferma");
    const esito = next.esito;
    setTimeout(() => audio.sting(esito === "corretta" ? "corretta" : "errata"), 320);
    return;
  }
  if (ev.tipo === "AVANTI") {
    if (next.fase === "domanda") audio.musica("suspense", true);
    else if (next.fase === "fine") { audio.fermaMusica(); audio.sting(next.esito === "corretta" ? "vittoria" : "game-over"); }
  }
}

function dispatch(ev) {
  const prev = stato;
  stato = riduci(stato, ev);
  reagisci(ev, prev, stato);
  if (stato.fase === "fine") {
    const nuovo = miglioreRecord(stato.record, stato);
    if (nuovo !== stato.record) { stato = { ...stato, record: nuovo }; salvaRecord(nuovo); }
  }
  render();
}

function render() {
  if (creditiAperti) disegnaCrediti(azioni(), audio.isMuto(), crediti);
  else disegna(stato, azioni(), audio.isMuto());
}

// ---- tastiera ----
function opzioniAttive() {
  return [0, 1, 2, 3].filter((i) => !stato.eliminate.includes(i));
}
function muovi(dir) {
  if (stato.fase !== "domanda" && stato.fase !== "conferma") return;
  const attive = opzioniAttive();
  if (!attive.length) return;
  const pos = attive.indexOf(stato.selezionata);
  const nuova = pos < 0 ? (dir > 0 ? attive[0] : attive[attive.length - 1]) : attive[(pos + dir + attive.length) % attive.length];
  dispatch({ tipo: "SELEZIONA", indice: nuova });
}
function invio() {
  if (creditiAperti) { creditiAperti = false; render(); return; }
  switch (stato.fase) {
    case "avvio": azioni().inizia(); break;
    case "domanda":
      if (stato.selezionata == null) dispatch({ tipo: "SELEZIONA", indice: opzioniAttive()[0] });
      else dispatch({ tipo: "CONFERMA" });
      break;
    case "conferma": dispatch({ tipo: "CONFERMA" }); break;
    case "rivelazione": dispatch({ tipo: "AVANTI" }); break;
    case "fine": azioni().rigioca(); break;
  }
}
document.addEventListener("keydown", (e) => {
  const t = e.target;
  if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") { muovi(1); e.preventDefault(); }
  else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { muovi(-1); e.preventDefault(); }
  else if (e.key === "Enter" || e.key === " ") { invio(); e.preventDefault(); }
  else if (e.key === "1") dispatch({ tipo: "USA_AIUTO", aiuto: "cinquanta" });
  else if (e.key === "2") dispatch({ tipo: "USA_AIUTO", aiuto: "pubblico" });
  else if (e.key === "3") dispatch({ tipo: "USA_AIUTO", aiuto: "casa" });
});

// ---- avvio ----
async function avvia() {
  audio.init();
  try {
    [banca, crediti] = await Promise.all([
      caricaBanca(),
      fetch("data/credits.json").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]);
  } catch (err) {
    document.getElementById("app").innerHTML =
      `<div class="avvio"><h1>Ops…</h1><p class="sub">Impossibile caricare le domande.</p><p class="nota">${err.message}. Ricarica la pagina.</p></div>`;
    return;
  }
  render();
}
avvia();
