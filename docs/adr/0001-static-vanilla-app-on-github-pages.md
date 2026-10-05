# 0001 — App statica vanilla, senza build step, su GitHub Pages

## Stato

Accettata.

## Contesto

Il gioco deve essere costruito da una persona non necessariamente sviluppatrice, pubblicato su un repository GitHub pubblico e usato su LIM/desktop in classe. Servono deploy semplice, lunga durata e manutenzione minima.

## Decisione

L'app è scritta in **HTML/CSS/JS vanilla** (moduli ES), **senza build step né framework**, e pubblicata come sito statico su **GitHub Pages**. Nessun backend. Lo stato della partita vive nel browser; il record personale in `localStorage`.

## Conseguenze

- Deploy banale (Pages serve direttamente i file) e nessuna dipendenza da toolchain.
- Nessuna classifica condivisa né account: richiederebbero un backend (fuori scope).
- La gestione dello stato è affidata a una macchina a stati scritta a mano, sufficiente per la complessità del gioco.
