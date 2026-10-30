# (Eye)Say

(Eye)Say is an open-source assistive communication tool for people living with paralysis or Locked-In Syndrome (LIS). It turns a standard webcam into a blink-driven keyboard: the app scans across rows and letters, and a blink selects.

Key features:

* Face and eye tracking in the browser with [clmtrackr](https://github.com/auduno/clmtrackr) — no special hardware
* Automatic calibration to each person's blink profile
* Two keyboard layouts (alphabetical and frequency-ordered), word completion and next-word prediction that learns from what the person says
* Text to speech using the browser's built-in voices (works offline)
* A tutorial with a blink-driven tic-tac-toe game for practising timing
* Optional accounts so settings follow a user between devices

![](https://media.giphy.com/media/12Vvpxe2St2Y6s/giphy.gif)
![](https://media.giphy.com/media/Wkn3sMKDZrrVK/giphy.gif)

## Running it

Requires Node 20 or newer.

```bash
npm install
npm run build
npm start            # http://localhost:1337
```

For development, `npm run dev` rebuilds the bundle on change and restarts the server.

The camera only works on `localhost` or over HTTPS.

### Guest-only mode vs. accounts

With no database configured the app runs in **guest-only mode**: everything works, and calibration and settings are saved in the browser (localStorage).

To enable accounts, point it at MongoDB:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Enables accounts, e.g. `mongodb://localhost:27017/eyesay` |
| `SESSION_SECRET` | Required in production when accounts are on |
| `PORT` | Defaults to `1337` |
| `NODE_ENV=production` | HTTPS redirect, secure cookies, trusts the platform proxy (Heroku etc.) |

A guest who calibrates and then signs up keeps their calibration. Accounts created by the original version of the app still log in; their passwords are upgraded to scrypt on first login.

## How it works

* `browser/js/lib/` — framework-free logic: eye-openness measurement, blink detection, word prediction, tic-tac-toe. Unit tested in Node.
* `browser/js/common/factories/timer.factory.js` — the single per-frame loop. It draws the face mesh, detects blinks, and emits `iterate` (advance the highlight every `cursorDelay` ms) and `singleBlink` (select). Angular only re-renders when one of those happens.
* `browser/js/common/factories/calibrate.factory.js` — measures the open-eye baseline (`blinkZero`) and the blink threshold ratio (`blinkRatio`).
* `browser/js/type/type.factory.js` — the scanning keyboard.
* `server/` — Express app: static bundle, session auth, and `GET/PUT /api/users/me` for a user's own blink settings.
* `scripts/build.js` — bundles vendor libraries, app code and all templates into `public/` with content-hashed URLs.

## Tests

```bash
npm test
```

Runs the blink-detection / prediction unit tests and the server integration tests (against an in-memory MongoDB, downloaded on first run).

## Credits

Originally built as a Fullstack Academy capstone project. Face tracking by [clmtrackr](https://github.com/auduno/clmtrackr) (MIT). Seed phrases for prediction come from Justin Isaf's [predict-next-word](https://www.npmjs.com/package/predict-next-word).
