# CONTEXT.md

Glossario del progetto. Solo linguaggio di dominio: nessun dettaglio implementativo.

## Glossario

- **Grande numero**: numero del sistema posizionale decimale che coinvolge migliaia, milioni o miliardi; oggetto di studio della classe quinta.
- **Sistema di numerazione posizionale decimale**: sistema in cui il valore di una cifra dipende dalla sua posizione; ogni posizione vale dieci volte quella alla sua destra.
- **Valore posizionale**: la posizione che una cifra occupa nel numero, con il nome e il peso che ne derivano; si nomina con unità `u`, decina `da`, centinaio `h`, unità di migliaia `uk`, decina di migliaia `dak`, centinaio di migliaia `hk`, unità di milione `uM`, decina di milione `daM`, centinaio di milione `hM`, unità di miliardo `uG`, decina di miliardo `daG`, centinaio di miliardo `hG` (es. in `18.500.170` la cifra `5` ha valore posizionale `hk` e vale `500.000`). Il termine preferito è "valore posizionale"; "marca" non si usa.
- **Tipologia**: una delle sette famiglie di quesito (A–G) definite nelle specifiche: riconoscimento del valore posizionale, valore numerico, scomposizione canonica, conversione cifre↔lettere, scomposizione additiva (somma dei valori), notazione polinomiale, complementare.
- **Fascia numerica**: intervallo di grandezza dei numeri usati in un blocco di livelli (entro `999.999`; entro `999.999.999`; oltre il miliardo).
- **Livello**: uno dei 15 gradini a difficoltà crescente della partita; a ogni livello corrisponde una domanda.
- **Partita**: una singola sessione di gioco, dal livello 1 al livello 15 o fino all'errore.
- **Scala premi**: sequenza dei valori (in € di gioco) associati ai 15 livelli.
- **Traguardo** (safe point): livello soglia (5 e 10) che garantisce un punteggio minimo salvato in caso di errore.
- **Aiuti**: i tre supporti una tantum per partita — 50:50, Pubblico, Chiamata a casa.
- **Banca domande**: l'insieme strutturato dei quesiti, categorizzati per livello e tipologia, da cui si pesca a ogni partita.
- **Distrattore**: una delle tre risposte sbagliate ma plausibili di un quesito; il generatore ne garantisce la plausibilità e l'unicità della risposta corretta.
- **Trabocchetto**: quesito dei livelli alti costruito su numeri con zeri interni, per verificare che il bambino non salti le posizioni vuote.
- **Spiegazione**: il breve commento didattico mostrato dopo la risposta, che chiarisce il valore posizionale in gioco.
- **Record personale**: il miglior importo vinto (con il livello raggiunto) salvato sul dispositivo in `localStorage`; mostrato all'avvio e a fine partita. Non c'è classifica condivisa.
