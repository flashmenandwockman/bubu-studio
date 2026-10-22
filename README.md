# bubu-studio.com

Website von BUBU Studio (Jan Fechner, Liquid Mountains, drip tufting). Statische Site ohne Build-Schritt, 1:1 von Hostinger übernommen.

## Deployment

Netlify-Site `bubu-studio` (Team Flashmen and Wockman Ltd.), mit diesem Repo verbunden: jeder Push auf `main` geht automatisch live. Domains `bubu-studio.com` (primär) und `www.bubu-studio.com`. Vorschau: https://bubu-studio.netlify.app. Konfiguration in `netlify.toml` (Header, Redirects).

DNS liegt nicht bei Netlify (Nameserver `ns1/ns2.de-nserver.de`). Für den Umzug dort `A @ → 75.2.60.5` und `CNAME www → bubu-studio.netlify.app` setzen. `mail.bubu-studio.com` (A auf den alten Server) und der MX-Eintrag bleiben unverändert, sonst geht die Mail verloren.

Supabase wird hier nicht gebraucht: Die Seite hat keine Formulare und keine Daten, Kontakt läuft per Mail. Buchungen, Newsletter und Anfragen liegen in Supabase beim Projekt `bubu-tufting`.

## Workshops

Die frühere Seite `/tufting` wurde bewusst nicht übernommen. `/tufting`, `/tufting.html` und `/tufting/*` leiten per 301 auf https://www.bubu-tufting.com, alle Workshop-Links zeigen direkt dorthin. Aus `sitemap.xml` und `llms.txt` ist sie entfernt.

## Journal

Die Übersichtsseite `journal.html` ist gelöscht. `/journal` und `/journal.html` leiten per 301 auf https://www.bubu-tufting.com/journal/, alle Journal-Links zeigen dorthin. Die drei Artikel bleiben hier, weil es sie auf bubu-tufting.com nicht gibt.

## Struktur

- `index.html`, `work.html`, `journal-*.html` (die drei Artikel), `impressum.html`, `bubu-radio.html`
- `styles.css`, `work.css`, `styles/bubu-music.css`, `script.js`, `data.js` (Bildtexte der Galerie, ohne HTML editierbar)
- `assets/` — Bilder, `assets/gallery/` für die Galerie auf `/work`
- `sitemap.xml`, `robots.txt`, `llms.txt`

## Offen (schon auf Hostinger kaputt)

- `og-bubu-studio.jpg` fehlt (Vorschaubild für Social Media)
- `bubu-studio-press-kit.pdf` fehlt (Download-Link im Press-Bereich)
