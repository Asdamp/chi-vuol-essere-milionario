// Modulo audio: BGM (intro/suspense) + sting, mute persistito, fallback silenzioso.
// L'audio non blocca mai il gioco: ogni errore di caricamento o play() viene ignorato.

const FILE = {
  intro: "assets/audio/intro.mp3",
  suspense: "assets/audio/suspense.mp3",
  conferma: "assets/audio/conferma.mp3",
  corretta: "assets/audio/corretta.mp3",
  errata: "assets/audio/errata.mp3",
  aiuto: "assets/audio/aiuto.mp3",
  vittoria: "assets/audio/vittoria.mp3",
  "game-over": "assets/audio/game-over.mp3",
};

const VOLUME_MUSICA = 0.35;
const VOLUME_MUSICA_DUCK = 0.12;
const VOLUME_STING = 0.85;

const elementi = {};
let bgm = null;
let bgmNome = null;
let muto = localStorage.getItem("cvm-muto") === "1";
let avviato = false;

export function init() {
  for (const [nome, percorso] of Object.entries(FILE)) {
    const a = new Audio();
    a.preload = "auto";
    a.addEventListener("error", () => { a.dataset.errore = "1"; });
    a.src = percorso;
    elementi[nome] = a;
  }
}

export function isMuto() { return muto; }

export function toggleMuto() {
  muto = !muto;
  localStorage.setItem("cvm-muto", muto ? "1" : "0");
  if (muto) {
    for (const a of Object.values(elementi)) a.pause();
    bgm = null; bgmNome = null;
  }
  return muto;
}

function suonaSting(nome) {
  if (muto) return;
  const a = elementi[nome];
  if (!a || a.dataset.errore) return;
  try {
    a.currentTime = 0;
    a.volume = VOLUME_STING;
    a.play().catch(() => {});
  } catch { /* silenzio */ }
}

export function sting(nome) {
  if (muto) return;
  if (bgm) bgm.volume = VOLUME_MUSICA_DUCK;
  suonaSting(nome);
  if (bgm) setTimeout(() => { if (bgm && !muto) bgm.volume = VOLUME_MUSICA; }, 800);
}

export function musica(nome, loop = true) {
  if (bgm && bgmNome === nome) return;
  fermaMusica();
  const a = elementi[nome];
  if (!a || a.dataset.errore) return;
  bgm = a; bgmNome = nome;
  if (muto) return;
  try {
    a.loop = loop;
    a.volume = VOLUME_MUSICA;
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch { /* silenzio */ }
}

export function fermaMusica() {
  if (!bgm) return;
  try { bgm.pause(); bgm.currentTime = 0; } catch { /* silenzio */ }
  bgm = null; bgmNome = null;
}

// Sigla all'avvio, poi passa al loop di suspense se nessun altro suono l'ha interrotta.
export function introPoiSuspense(dopoMs = 5000) {
  musica("intro", false);
  setTimeout(() => { if (bgmNome === "intro") musica("suspense", true); }, dopoMs);
}

// Sblocca l'audio al primo gesto utente (policy autoplay dei browser).
export function sblocca() {
  if (avviato) return;
  avviato = true;
  const a = elementi.intro;
  if (!a || a.dataset.errore || muto) return;
  try { a.play().then(() => a.pause()).catch(() => {}); } catch { /* silenzio */ }
}
