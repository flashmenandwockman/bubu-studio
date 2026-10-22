# bubu-studio.com

Website von BUBU Studio (Jan Fechner, Liquid Mountains, drip tufting). Statische Site ohne Build-Schritt, 1:1 von Hostinger übernommen.

## Deployment

Netlify, eigene Site neben `bubu-tufting`. Deploy per `netlify deploy --prod --dir .` aus diesem Ordner. Konfiguration in `netlify.toml` (Header, Redirects).

Supabase wird hier nicht gebraucht: Die Seite hat keine Formulare und keine Daten, Kontakt läuft per Mail. Buchungen, Newsletter und Anfragen liegen in Supabase beim Projekt `bubu-tufting`.

## Workshops

Die frühere Seite `/tufting` wurde bewusst nicht übernommen. `/tufting`, `/tufting.html` und `/tufting/*` leiten per 301 auf https://www.bubu-tufting.com, alle Workshop-Links zeigen direkt dorthin. Aus `sitemap.xml` und `llms.txt` ist sie entfernt.

## Struktur

- `index.html`, `work.html`, `journal.html`, `journal-*.html`, `impressum.html`, `bubu-radio.html`
- `styles.css`, `work.css`, `styles/bubu-music.css`, `script.js`, `data.js` (Bildtexte der Galerie, ohne HTML editierbar)
- `assets/` — Bilder, `assets/gallery/` für die Galerie auf `/work`
- `sitemap.xml`, `robots.txt`, `llms.txt`

## Offen (schon auf Hostinger kaputt)

- `og-bubu-studio.jpg` fehlt (Vorschaubild für Social Media)
- `bubu-studio-press-kit.pdf` fehlt (Download-Link im Press-Bereich)
