# Chi vuol essere Milionario? – I Grandi Numeri

Gioco web per la scuola primaria (classe quinta) che consolida il **sistema di numerazione posizionale decimale** sui grandi numeri (migliaia, milioni, miliardi), ispirato al format *Chi vuol essere milionario?*.

- **15 livelli** a difficoltà crescente, scala premi in €, traguardi (safe point) al livello 5 e 10.
- **Banca di 180 domande** categorizzate per livello e tipologia (A–G), **randomizzate ad ogni partita**.
- **Tre aiuti** una tantum: 50:50, Pubblico, Chiamata a casa.
- **Musica e suoni** royalty-free/CC0 (+ due brani CC-BY con credito).
- Nessun timer; dopo ogni risposta una **spiegazione didattica**.
- Nessun backend: stato e record personale in `localStorage`.

## Avvio in locale

Servono un server statico (i moduli ES e `fetch` non funzionano da `file://`):

```bash
python3 -m http.server 8000      # oppure: npm run servi
```

Poi apri <http://localhost:8000/>.

## Deploy

Sito statico pubblicato da **GitHub Pages**, sorgente: branch `main`, cartella **root**. URL:
`https://asdamp.github.io/chi-vuol-essere-milionario/`.

## Struttura

```
index.html
css/style.css
js/main.js       orchestrazione (azioni, tastiera, record)
js/gioco.js      macchina a stati pura (reducer)
js/domande.js    caricamento banca, pesca, shuffle
js/audio.js      BGM + sting, mute, ducking, fallback
js/ui.js         rendering DOM
data/questions.json    banca domande (generata)
data/credits.json      dati per la schermata crediti
assets/audio/          MP3
tools/                 generatore, convertitore, validatore, test
```

## Rigenerare la banca

```bash
node tools/genera-domande.mjs    # riscrive data/questions.json (seme fisso)
node tools/valida-banca.mjs      # ricalcola e verifica tutte le risposte
node --test tools/               # test (convertitore cifre↔lettere, reducer)
```

La generazione è **deterministica** (seme in `tools/genera-domande.mjs`). Modificando le regole, riesegui generatore, validatore e test.

## Crediti e licenza

Il dettaglio è in [`CREDITS`](./CREDITS) e in `data/credits.json`. In sintesi: effetti CC0 di Kenney e OpenGameArt; intro e suspense **CC-BY 4.0** di Kevin MacLeod (incompetech.com), credito obbligatorio. **Non** vengono usati i file originali del programma TV.

## Accessibilità

Contrasto alto, font grandi, navigazione da tastiera (frecce per scegliere, Invio per confermare, tasti 1/2/3 per gli aiuti), pulsante "Schermo intero" per la LIM.
