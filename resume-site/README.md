# Drive Through — Resume Site

A single-page portfolio where you drive a car through a stylized city.
Scrolling moves the car down the road; five stops along the route are the
resume sections. Vanilla HTML/CSS/JS, canvas rendering, no frameworks.
Static site — deployable to Vercel as-is (project root: this directory).

- `index.html` — all content (readable without canvas; reduced-motion fallback)
- `styles.css` — design tokens + layout
- `main.js` — scroll engine, snapping, cards, menu
- `city.js` — city rendering
- `ambient.js` — decorative traffic/pedestrians (removable)
