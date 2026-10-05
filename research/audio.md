# Audio: catalogo royalty-free e vincoli browser

Ricerca per il quiz statico vanilla-JS (15 livelli, stile "Chi vuol essere milionario?", scuola primaria, italiano). Ticket [#4](https://github.com/Asdamp/chi-vuol-essere-milionario/issues/4).

Ogni affermazione di licenza è verificata sulla **pagina ufficiale della fonte** (link inline). Dove una licenza non è verificabile, è scritto esplicitamente.

---

## 0. Avvertenza: la sigla del programma TV originale è protetta

La sigla di *Chi vuol essere milionario?* / *Who Wants to Be a Millionaire?* — il tema "Mars" di Keith e Matthew Strachan — **è musica protetta da copyright**, così come il nome e il format del programma sono marchi di Sony Pictures Television / 2waytraffic. **Non va usata, né copiata, né riprodotta in "sound-alike".** Questa ricerca copre solo materiale con licenza libera o di pubblico dominio, da usare come alternativa originale.

---

## 1. Cosa dicono davvero le licenze delle fonti candidate

| Fonte | Licenza effettiva (dalla fonte) | Attribuzione | Si può committare in un repo pubblico? |
|---|---|---|---|
| **Kenney** (Audio) | [CC0 1.0](https://kenney.nl/assets/interface-sounds) — il file `License.txt` dello zip dice: *"License: (Creative Commons Zero, CC0) ... free to use in personal, educational and commercial projects. Support us by crediting Kenney or www.kenney.nl (this is not mandatory)"* | No (gradita) | **Sì**, senza obblighi |
| **Freesound** | L'utente sceglie [CC0, CC-BY o CC-BY-NC](https://freesound.org/help/faq/) — *"For the 'zero' license you can do pretty much what you want with the sound. You could even sell the sound ... but you can't claim you are the author!"* | Solo per CC-BY | **Sì** se CC0/CC-BY (CC-BY-NC da evitare se il repo è commerciale) |
| **OpenGameArt** | [Licenza dichiarata per singolo asset](https://opengameart.org/content/faq); supporta CC0, CC-BY, CC-BY-SA, GPL, OGA-BY. Per CC0: *"may be copied, modified, distributed, performed or otherwise used in anyway without asking, crediting or notifying"* | Dipende dall'asset | **Sì** per CC0/CC-BY; CC-BY-SA impone share-alike sulle opere derivate |
| **Incompetech** (Kevin MacLeod) | [CC-BY 4.0](https://incompetech.com/music/royalty-free/faq.html) — *"All of this music is copyrighted... Is this music in the Public Domain? No."* Credito obbligatorio con titolo + licenza | **Sì (obbligatoria)** | **Sì**, ma serve il credito nel repo e nel gioco |
| **Pixabay** | [Pixabay Content License](https://pixabay.com/service/terms/): nessuna attribuzione, ma **vietato distribuire il contenuto "on a Standalone basis"** (file audio così com'è). I contenuti pubblicati **prima del 9 gennaio 2019** sono [CC0](https://pixabay.com/service/terms/) | No | **Rischioso**: committare il file grezzo può essere "Standalone". Preferire CC0 pre-2019 o evitare |
| **Mixkit** | [Pagina licenze](https://mixkit.co/license/) con license "Free" per musica/SFX, ma i **termini puntuali sono renderizzati lato client e non sono estraibili via fetch statico** | Non verificato | **Non verificato** — trattare con cautela |
| **Free Music Archive** | Oggi [FMA è "Powered by Tribe of Noise"](https://freemusicarchive.org/) e il download libero è indirizzato al versante "discovery/personal use"; le licenze CC restano per singola traccia ma il sito non le espone più in modo semplice dalla home | Dipende dalla traccia | **Non verificato** — bassa priorità |

Sintesi: **CC0 (Kenney, Freesound, OpenGameArt) è la scelta sicura** perché consente copia, modifica e ridistribuzione senza obblighi; **Incompetech è l'opzione CC-BY** con credito obbligatorio; **Pixabay/Mixkit/FMA non vanno usati come prima scelta per file committati**.

---

## 2. Catalogo consigliato per momento

Tutti i titoli sotto esistono e sono stati verificati sulle pagine della fonte.

### Intro / sigla (loopable, game-show)
- **"Happy Happy Game Show"** — Kevin MacLeod, Incompetech ([ISRC USUAN1600006](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1600006), elencato nella [lista completa](https://incompetech.com/music/royalty-free/full_list.php)). Licenza **CC-BY 4.0**, [credito obbligatorio](https://incompetech.com/music/royalty-free/faq.html).
- Alternativa CC0 senza attribuzione: nessun tema lungo equivalente; si può comporre un loop con i jingle di Kenney (sotto) o sintetizzarlo con Web Audio.

### Suspense (musica del "pensiero")
- **"Final Count"** — Kevin MacLeod ([USUAN1100657](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100657)), **CC-BY 4.0**. In alternativa "Distant Tension" ([USUAN1100257](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100257)).
- Alternativa con licenza più restrittiva: **"Suspense"** di lalanl su OpenGameArt ([pagina](https://opengameart.org/content/suspense)), **CC-BY-SA 3.0** — credito + share-alike se modifichi.
- Loop CC0: cercare su Freesound filtrando CC0 e tag `loop`/`suspense` ([FAQ licenze Freesound](https://freesound.org/help/faq/)).

### Lock-in / conferma risposta finale
- **Kenney Interface Sounds**, file `confirmation_001…004.ogg` — [pacchetto CC0](https://kenney.nl/assets/interface-sounds) (verificato nello zip, `License.txt` = CC0).
- Alternativa CC-BY: **"Mystery Sting"** ([USUAN1100430](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100430)) o "Flutey Sting" ([USUAN1100435](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100435)).

### Risposta corretta
- **"Win sound effect"** di Listener su OpenGameArt ([pagina](https://opengameart.org/content/win-sound-effect)) — **CC0** (l'autore scrive *"Sounds are public domain"*). File: `Win sound.wav` (785 KB).
- **Kenney Music Jingles** (jingle positivi), [CC0](https://kenney.nl/assets/music-jingles).

### Risposta errata
- **Kenney Interface Sounds**, file `error_001…008.ogg` — [CC0](https://kenney.nl/assets/interface-sounds).
- Alternativa CC-BY: **"Dissappointment"** ([USUAN1100481](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100481)).

### Aiuto usato (lifeline)
- **Kenney Interface Sounds**, file `question_001/002.ogg`, `toggle_*`, `select_*` — [CC0](https://kenney.nl/assets/interface-sounds).

### Vittoria e game over
- Vittoria: **"Win sound effect"** (CC0, sopra) oppure **"Winner Winner!"** ([USUAN1400036](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1400036), CC-BY 4.0).
- Game over: jingle negativo di **Kenney Music Jingles** ([CC0](https://kenney.nl/assets/music-jingles)).

### Credito base per materiale CC-BY (da mettere in `CREDITS` e in una schermata crediti)
Modello richiesto da Incompetech ([FAQ](https://incompetech.com/music/royalty-free/faq.html)):

```
Happy Happy Game Show — Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0
https://creativecommons.org/licenses/by/4.0/
```

---

## 3. Formato, dimensioni, commit vs hotlink

### Formati
- **MP3** è la scelta più universale: patent-free dal 2017 e supportato da tutti i browser principali ([MDN, Web audio codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Audio_codecs)).
- **Vorbis/Ogg NON è supportato da Safari** (tabella compatibilità MDN: Safari "No" per Vorbis, quindi nemmeno in un container Ogg). **Attenzione: i pacchetti Kenney sono `.ogg`** → vanno **transcodificati in MP3/AAC** per iOS/macOS Safari.
- **AAC in MP4** è supportato ovunque, ma è patent-encumbered (per distribuire contenuto non serve licenza, ma la supportabilità in Firefox dipende dall'OS) ([MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Audio_codecs)).
- Strategia minima e robusta: **MP3 come unico formato**; se vuoi risparmiare banda, aggiungi Ogg come prima `<source>` con fallback MP3 ([MDN, Cross-browser audio basics](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Cross-browser_audio_basics)).

### Dimensioni indicative
- Sting corti (0,5–3 s): **10–80 KB** in MP3 mono.
- Musica di sottofondo (1–2 min) a 128 kbps: **~1 MB/min**; a 192 kbps **~1,4 MB/min**.
- Tenere il totale audio **sotto ~3 MB** per non pesare sulle reti scolastiche.

### Commit nel repo o hotlink?
- **CC0 (Kenney, Freesound CC0, OGA CC0): committare è sicuro e preferibile.** Il repository è autosufficiente e non dipende da CDN esterne.
- **CC-BY (Incompetech): si può committare** purché il credito sia incluso in modo visibile (file `CREDITS` + schermata crediti nel gioco).
- **CC-BY-SA: si può committare**, ma ogni derivato va rilasciato con la stessa licenza (share-alike): attenzione se in futuro il gioco viene relicenziato.
- **Pixabay: NON committare il file grezzo** — la licenza vieta la distribuzione "Standalone" ([termini](https://pixabay.com/service/terms/)); l'hotlink al CDN non è supportato ufficialmente ed è fragile. Preferire CC0.
- **Mixkit/FMA**: licenza puntuale non verificata → da evitare finché non confermata.

---

## 4. Vincoli browser (fonti primarie)

### 4.1 Autoplay: solo dopo un gesto utente
L'audio con tracce udibili **non parte da solo** al caricamento se la pagina non ha ancora ricevuto un'interazione; valgono anche le chiamate JS `audio.play()` fuori da un handler di input ([MDN, Autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)). Chrome: *"Muted autoplay is always allowed"*, con suono solo se l'utente ha interagito (o superato la Media Engagement Index) ([Chrome autoplay policy](https://developer.chrome.com/blog/autoplay/)). Safari: *"Websites should assume any use of `<video>` or `<audio>` requires a user gesture click to play"* ([WebKit, macOS](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/)); su iOS è richiesto storicamente un gesto, con eccezioni solo per media **muti o senza traccia audio** ([WebKit, iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/)).

**Conseguenza per la sigla**: non tentare di farla partire all'apertura. Mostra una schermata iniziale con un pulsante **"Inizia / Gioca"**: è quel click a sbloccare l'audio e a far partire la sigla. Gestisci la Promise di `play()`: se viene rifiutata con `NotAllowedError`, mostra un pulsante di play ([MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)).

### 4.2 Formati e fallback
Usa più `<source>` dentro `<audio>`: il browser prova in ordine e usa il primo supportato. MDN indica **mp3 + ogg** come coppia a massima copertura ([MDN, Cross-browser audio basics](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Cross-browser_audio_basics)). Ricorda il **buco Safari su Ogg/Vorbis** ([MDN codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Audio_codecs)): se usi solo Ogg, Safari non suona.

### 4.3 Preload e caching
- `preload` accetta `none` / `metadata` / `auto`; **`metadata` è il default consigliato** (durata + scelta del file senza scaricare tutto). `auto` solo con rete veloce garantita ([MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Cross-browser_audio_basics)).
- **Su mobile `preload` è spesso ignorato** ([MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Cross-browser_audio_basics)).
- Su GitHub Pages non si controllano gli header di cache in modo fine, ma il browser cachea comunque gli asset; per un gioco piccolo conviene **precaricare gli sting** (`preload="auto"` o `new Audio()` + `load()`) dopo il primo gesto, così le risposte sono immediate.

### 4.4 `HTMLAudioElement` vs Web Audio API
- **`HTMLAudioElement`**: semplice, adatto a **musica di sottofondo** e sting singoli; ha l'attributo `loop` ([MDN loop](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop)). Latenza e loop gapless non sono garantiti.
- **Web Audio API**: meglio per **timing preciso e suoni sovrapposti** (es. sting sopra la musica), ma l'`AudioContext` creato prima del gesto nasce in stato `"suspended"` e richiede `resume()` dentro un gesto utente ([Chrome](https://developer.chrome.com/blog/autoplay/)).
- Scelta pragmatica: **`HTMLAudioElement` per la BGM, Web Audio (o Audio() dedicati) per gli sting**, sbloccando tutto al primo click.

### 4.5 Loop in sottofondo e stop pulito
- Nessun metodo `stop()` esiste: per fermare davvero un elemento audio si fa **`pause()` + `currentTime = 0`** ([MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Cross-browser_audio_basics)).
- Loop continuo: `loop = true`, oppure `AudioBufferSourceNode.loop = true` con Web Audio (loop campionato, più gapless).
- Per una dissolvenza pulita, usa un `GainNode` con `linearRampToValueAtTime` (Web Audio) invece di tagliare il volume a scatti.

### 4.6 Quirk mobile / LIM
- iOS Safari richiede il gesto e **spesso ignora `preload`, `autoplay` e l'attributo `muted`** ([MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Cross-browser_audio_basics); [WebKit iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/)).
- Su iOS storicamente **un solo `HTMLMediaElement` alla volta** può suonare: se servi BGM + effetto insieme, il **Web Audio** è più affidabile. (Comportamento da testare sul dispositivo: non è documentato nelle pagine sopra come garanzia contrattuale.)
- Il **tasto silenzioso hardware di iOS** può silenziare l'audio (incluso Web Audio) anche se il volume del gioco è alzato: va provato su dispositivo reale in classe.
- Su LIM/desktop con browser datati, verifica sempre `canPlayType()` prima di puntare a un formato.
- Sblocca l'`AudioContext` al **primo `click`** (non a `load`, non a `canplaythrough`) — WebKit è esplicito: *"the JavaScript which resulted in the call to `video.play()` must have directly resulted from a handler for a `touchend`, `click`, `doubleclick`, or `keydown` event"* ([WebKit iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/)).

### 4.7 Mute / toggle
- Tieni un flag globale (`audioMuted`) persistito in `localStorage`.
- Con `HTMLAudioElement` usa la proprietà `muted` (JS), non solo l'attributo HTML (spesso ignorato su mobile) — [MDN](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Cross-browser_audio_basics).
- Con Web Audio usa un **master `GainNode`**: `gain.value = 0` per mutare, `1` per riattivare.
- Il toggle deve agire su **tutti** i canali (BGM + sting), quindi centralizza in un piccolo modulo audio.

### 4.8 Asset che non si carica
- Ascolta l'evento **`error`** sull'elemento media (e sui `<source>`): *"fired when the resource could not be loaded due to an error"* ([MDN error event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event)); ispeziona `audio.error` (`MediaError`) per capire la causa.
- Con più `<source>`, il browser passa automaticamente al successivo in fase di selezione; se falliscono tutti, scatta `error` sull'elemento.
- **Regola d'oro**: l'audio non deve mai bloccare il gioco. In caso di errore, prosegui **in silenzio** e mostra al massimo un'icona discreta "audio non disponibile". Verifica anche il rifiuto di `play()` (vedi 4.1) e mostra un pulsante di attivazione.

---

## 5. Tabella di raccomandazione

| Momento | Asset / fonte | Licenza | Formato | Note |
|---|---|---|---|---|
| Intro / sigla | "Happy Happy Game Show" — Incompetech (Kevin MacLeod) | CC-BY 4.0 | MP3 | Credito obbligatorio; parte solo dopo click su "Gioca" |
| Intro (fallback) | Kenney Music Jingles | CC0 | transcodifica in MP3 | Pacchetto in `.ogg`: convertire per Safari |
| Suspense loop | "Final Count" — Incompetech | CC-BY 4.0 | MP3 | Alternativa "Distant Tension"; loop con `loop=true` |
| Suspense (SA) | "Suspense" — lalanl, OpenGameArt | CC-BY-SA 3.0 | MP3 | Credito + share-alike se modifichi |
| Lock-in / conferma | Kenney Interface Sounds `confirmation_00x` | CC0 | transcodifica in MP3 | Precisa, senza attribuzione |
| Risposta corretta | "Win sound effect" — Listener, OpenGameArt | CC0 | WAV→MP3 | Autore: "public domain" |
| Risposta errata | Kenney Interface Sounds `error_00x` | CC0 | transcodifica in MP3 | |
| Aiuto usato | Kenney Interface Sounds `question_00x` / `toggle_*` | CC0 | transcodifica in MP3 | |
| Vittoria | "Win sound effect" (CC0) o "Winner Winner!" (CC-BY) | CC0 / CC-BY 4.0 | MP3 | |
| Game over | Kenney Music Jingles (jingle negativo) | CC0 | transcodifica in MP3 | |

**Scelta consigliata (tutta-C C0, zero attriti):** Kenney Interface Sounds + Kenney Music Jingles + "Win sound effect" OGA per tutti gli sting; per sigla e suspense aggiungere Incompetech (CC-BY) accettando l'obbligo di credito, oppure comporre/sintetizzare intro e loop internamente con Web Audio.

---

## 6. Fonti (primarie)

- Pixabay — [License Summary](https://pixabay.com/service/license-summary/), [Terms of Service](https://pixabay.com/service/terms/)
- Freesound — [FAQ / Licenses](https://freesound.org/help/faq/)
- Creative Commons — [CC0 1.0 deed](https://creativecommons.org/publicdomain/zero/1.0/)
- Incompetech — [Music FAQ](https://incompetech.com/music/royalty-free/faq.html), [lista completa tracce](https://incompetech.com/music/royalty-free/full_list.php)
- OpenGameArt — [FAQ licenze](https://opengameart.org/content/faq), [Win sound effect (CC0)](https://opengameart.org/content/win-sound-effect), [Suspense (CC-BY-SA 3.0)](https://opengameart.org/content/suspense)
- Kenney — [Interface Sounds (CC0)](https://kenney.nl/assets/interface-sounds), [Music Jingles (CC0)](https://kenney.nl/assets/music-jingles)
- Mixkit — [License](https://mixkit.co/license/)
- Free Music Archive — [home](https://freemusicarchive.org/)
- MDN — [Autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), [Web audio codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Audio_codecs), [Cross-browser audio basics](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Cross-browser_audio_basics), [`error` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event), [`loop` property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loop)
- Chrome for Developers — [Autoplay policy in Chrome](https://developer.chrome.com/blog/autoplay/)
- WebKit — [Auto-Play Policy Changes for macOS](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/), [New `<video>` Policies for iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/)
