# EBServices website (ebservices4u.com)

Static site with no framework and no build step. GitHub Pages serves it from the root of `main`.

```
index.html        Homepage (all sections)
bathroom-remodeling/  basement-finishing/  kitchen-remodeling/  media-walls/   (specialties)
carpentry-trim/  painting-drywall/  handyman-services/                     (secondary)  (interior-carpentry/ redirects to carpentry-trim/)
                  Service pages (clean URLs). Estimate buttons link to /?service=<val>#estimate,
                  which pre-selects the service in the homepage form.
404.html          Not-found page (absolute paths, so it works at any URL depth)
thanks.html       Fallback thank-you page for the form when JavaScript is off
css/style.css     All styles (palette tokens at the top)
js/config.js      ALL business facts. Edit this file to update the site
js/main.js        Behavior: config fill-in, header, menu, reveal, lightbox, form
assets/img/       Project photos (.webp, full + 480w), logo, og-image.jpg
assets/fonts/     Self-hosted Cormorant Garamond + Inter (woff2)
CNAME             Custom domain for GitHub Pages (ebservices4u.com)
sitemap.xml, robots.txt, site.webmanifest, favicon.ico, icons
```

## Confirmed facts
VA SCC: EBServices LLC, an active Virginia LLC formed April 29, 2023, based in Leesburg, VA 20175 (Loudoun County).
Owner-confirmed (Oct 2026): owner-operator Evvon Boxill; phone (571) 302-1240; serves Northern Virginia;
licensed & insured; 2+ years in business; specialties are bathrooms, basement finishing, kitchens and media walls.
"Technology-forward" means AI design previews: Evvon photographs the client's real space and uses AI to create
photorealistic previews of the finished room before work starts (always note previews are for visualization).
**Compliance:** EBServices does NOT offer the technology/electronics side of entertainment systems. Never mention
TV mounting, AV, wiring, low-voltage, sound, smart-home or electronics installs. Media walls are carpentry and
finish work only (built-ins, shelving, cabinetry, paneling, slat walls, trim, paint, niches), with the note that the
client's preferred AV/electronics installer handles the technology.
**Do not publish** the street address (private) or a license number (none provided). No reviews section until
there are real reviews.

## Updating business info: `js/config.js`

The page never shows a placeholder. While a fact is empty (`""` or `null`), whatever
depends on it stays hidden. Fill it in, commit, and it appears everywhere at once.

| Field | What it controls when filled in |
|---|---|
| `phoneDisplay` + `phoneTel` | Phone in header, hero "Tap to call", contact list, footer, mobile menu; the mobile bar's "Request a Call" becomes "Call Now" (tel: link); `telephone` in JSON-LD. Until set, call buttons go to the estimate form. Both fields are needed. |
| `email` | Contact email links, plus the address FormSubmit delivers the estimate form to |
| `serviceArea` | "Serving …" line in hero, contact list, footer, and the "What areas do you serve?" FAQ; `areaServed` in JSON-LD |
| `townsServed` | Optional town list used for `areaServed` in JSON-LD (takes priority over `serviceArea`) |
| `hours` | Hours row in the contact list |
| `freeEstimates: true` | "Free Estimates" trust item + FAQ |
| `licensed: true` and `insured: true` | "Licensed & Insured" trust item and FAQ (owner-confirmed; both set). |
| `licenseNumber` | Shown under the Licensed & Insured trust item and in the FAQ |
| `legalName` | Footer copyright line |
| `address.*` | `address` in JSON-LD only (not shown on the page). Currently locality/region/ZIP only; keep `streetAddress` empty. |
| `social.instagram/facebook/google` | Instagram/Facebook/Google icons and links. Empty means hidden. Switch Instagram to `https://www.instagram.com/ebservices4u` when the handle changes. |

**Search engines:** the static JSON-LD block in `index.html` (`#ld-business`) holds the
confirmed facts, including telephone, founder (Evvon Boxill) and areaServed. Confirmed facts
(phone, area, licensed & insured) are also baked into the static HTML by `facts()` in `common.py`,
so they show even without JavaScript. Keep `address.streetAddress` empty.

## Estimate form

The form is delivered by [FormSubmit.co](https://formsubmit.co) to the `email` in config.
**The first submission triggers a one-time activation email to Ebservices4U@outlook.com.
Click "Activate" in it or no requests will arrive.** After activating, FormSubmit
suggests replacing the email in the URL with the random alias it gives you, to hide the
address from scrapers. Put that alias in `index.html` (form `action`) and in `main.js`
(`endpoint`).

With JavaScript the form submits by AJAX, validates inline (service, name, phone or
email, zip, details) and shows a thank-you panel. Without JS it posts normally and
redirects to `thanks.html`. If sending fails, the user gets a pre-filled mailto link.

## Photos

The photos come from the EBServices Instagram (`ebservices2u`). The source images were
only ~150–180 px wide, so they were upscaled 4x with Real-ESRGAN (x4plus) and lightly
sharpened. They hold up at card size, but the **owner's original photos will look much
better**. To swap one in, keep the file name and export a `.webp` (~1200px on the long side)
plus a `-480.webp` version, then update `width`/`height` in `index.html` if the aspect
ratio changes.

## Still to confirm with the owner
Hours, free estimates, license number (optional), real photos of basement, kitchen and
media-wall projects (those pages currently show other EBServices work, captioned honestly),
and reviews once they exist.

## Deploying
Push to `main`. GitHub Pages publishes automatically. The custom domain is set in repo
Settings → Pages and in `CNAME`. DNS at Namecheap: A records for `@` →
185.199.108.153 / 185.199.109.153 / 185.199.110.153 / 185.199.111.153, and CNAME `www` →
`bryanralston.github.io`. Then tick **Enforce HTTPS** in Settings → Pages.

## Service pages
The seven service pages are generated from `/workspace/ebservices/svc_content.py` + `build_services.py`
(the homepage from `index.tpl.html` + `build_html.py`, shared nav in `common.py`) on the build box.
They are plain HTML, so small text edits can also be made directly in each `*/index.html`.
Each page has its own title/description/OG tags plus Service, BreadcrumbList and FAQPage JSON-LD.
Form service values: bathroom, basement, kitchen, media-wall, carpentry, painting, handyman, other.

## Logo
`assets/img/logo.png` is the owner's official logo with the dark background removed (exact alpha
extraction of the two-color artwork). `logo.webp` is the header/footer size, `logo-square.png` is the
512px version on black used in structured data, and the favicons use the house mark only.

## Analytics (GoatCounter, cookieless, so no consent banner is needed)
ON: `analytics.goatcounter` in `js/config.js` is `"ebservices4u"`; the dashboard is https://ebservices4u.goatcounter.com. Set it to `""` to turn tracking off.
Tracked events: `estimate-submit` (successful form send, title includes the service),
`call-click` (any tel: link), `request-call-click` (the "Request a Call" button while no phone is set),
`estimate-cta-click`, `email-click`. Page views are counted automatically.
