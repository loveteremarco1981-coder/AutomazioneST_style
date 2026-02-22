
# AUTOMAZIONE — Dashboard tipo SmartThings (pacchetto completo)

Questo pacchetto statico (HTML/CSS/JS + icone SVG) legge il modello dal tuo Google Apps Script via **JSONP** e replica il look & feel "pill cards" in stile SmartThings.

## File inclusi
- `index.html` — struttura e script di bootstrap (`window.__WEB_APP_URL__` già impostato)
- `assets/style.css` — tema e layout
- `js/app.js` — lettura JSONP, render, azioni Preferiti
- `assets/icons/*.svg` — set minimo di icone (persone, energia, temperatura, umidità, ecc.)

## Deploy
1. Crea una nuova repo pubblica (es. `AUTOMAZIONE-ST`).
2. Carica questi file nella root.
3. Settings → Pages → Source: **Deploy from a branch** / Branch: **main** (root).
4. Apri `https://<user>.github.io/<repo>/`.

## Requisiti backend
Il Web App deve rispondere a `GET …/exec?callback=cb` con `cb({...})`.
Endpoint admin supportati: `?admin=1&event=set_vacanza|set_override|alza_tutto|abbassa_tutto|piante`.

## Note
- Per mostrare l'**umidità**, aggiungi in `CRUSCOTTO` una chiave `WEATHER_HUMIDITY` e adatta `app.js`.
- Per icone aggiuntive puoi sostituire gli SVG in `assets/icons/` con i tuoi.
