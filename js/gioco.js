// Macchina a stati del gioco — logica pura, niente DOM, niente audio.
// Ogni transizione è un evento: INIZIA, SELEZIONA, USA_AIUTO, CONFERMA, AVANTI, RIGIOCA.

export const SCALA = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
export const LIVELLI = SCALA.length;
export const SOGLIE = [5, 10];

export function importoInCasoDiErrore(livello) {
  if (livello <= 5) return 0;
  if (livello <= 10) return 1000;
  return 32000;
}

export function statoIniziale(partita, record) {
  return {
    fase: "avvio",
    partita: partita || [],
    livello: 1,
    domanda: null,
    selezionata: null,
    aiuti: { cinquanta: false, pubblico: false, casa: false },
    eliminate: [],
    mostra: { pubblico: false, casa: false },
    esito: null,
    vincita: 0,
    record: record || { importo: 0, livello: 0 },
  };
}

function nuovaDomanda(stato, livello) {
  return {
    ...stato,
    fase: "domanda",
    livello,
    domanda: stato.partita[livello - 1],
    selezionata: null,
    eliminate: [],
    mostra: { pubblico: false, casa: false },
    esito: null,
  };
}

export function riduci(stato, evento) {
  switch (evento.tipo) {
    case "INIZIA":
      return nuovaDomanda({ ...stato, aiuti: { cinquanta: false, pubblico: false, casa: false } }, 1);

    case "SELEZIONA": {
      if (stato.fase !== "domanda" && stato.fase !== "conferma") return stato;
      if (stato.eliminate.includes(evento.indice)) return stato;
      return { ...stato, fase: "conferma", selezionata: evento.indice };
    }

    case "USA_AIUTO": {
      if (stato.fase !== "domanda" && stato.fase !== "conferma") return stato;
      const a = evento.aiuto;
      if (stato.aiuti[a]) return stato;
      if (a === "cinquanta") {
        const sbagliate = [0, 1, 2, 3].filter((i) => i !== stato.domanda.corretta && !stato.eliminate.includes(i));
        return { ...stato, aiuti: { ...stato.aiuti, cinquanta: true }, eliminate: sbagliate.slice(0, 2) };
      }
      if (a === "pubblico") return { ...stato, aiuti: { ...stato.aiuti, pubblico: true }, mostra: { ...stato.mostra, pubblico: true } };
      if (a === "casa") return { ...stato, aiuti: { ...stato.aiuti, casa: true }, mostra: { ...stato.mostra, casa: true } };
      return stato;
    }

    case "CONFERMA": {
      if (stato.fase !== "conferma" || stato.selezionata == null) return stato;
      const giusta = stato.selezionata === stato.domanda.corretta;
      return { ...stato, fase: "rivelazione", esito: giusta ? "corretta" : "errata" };
    }

    case "AVANTI": {
      if (stato.fase !== "rivelazione") return stato;
      if (stato.esito === "corretta") {
        if (stato.livello === LIVELLI) return { ...stato, fase: "fine", vincita: SCALA[LIVELLI - 1] };
        return nuovaDomanda(stato, stato.livello + 1);
      }
      return { ...stato, fase: "fine", vincita: importoInCasoDiErrore(stato.livello) };
    }

    case "RIGIOCA": {
      const s = statoIniziale(evento.partita, stato.record);
      return nuovaDomanda(s, 1);
    }

    default:
      return stato;
  }
}

export function miglioreRecord(record, stato) {
  if (stato.fase !== "fine") return record;
  const livello = stato.esito === "corretta" ? LIVELLI : stato.livello;
  if (stato.vincita > record.importo || (stato.vincita === record.importo && livello > record.livello)) {
    return { importo: stato.vincita, livello };
  }
  return record;
}
