# Cypress 101 Assignment — TestMu AI Certification

Automation of two test scenarios on the [TestMu AI Selenium Playground](https://www.testmuai.com/selenium-playground/) using Cypress, executed locally and on the TestMu AI cloud.

**Author:** Lucia Maria Reis Braga
**LinkedIn:** https://www.linkedin.com/in/lucia-maria-r-braga-03561334b

---

## Scenarios covered

### Scenario 1 — Drag & Drop Sliders (`cypress/e2e/01-slider.cy.js`)
1. Open the Selenium Playground and click **Drag & Drop Sliders**.
2. Select the slider **"Default value 15"**.
3. Move it to **95** using Cypress mouse events (`mousedown` / `mouseup`) plus the native value setter and `input`/`change` events.
4. Assert that both the input value and the displayed `<output>` text are **95**.

### Scenario 2 — Input Form Submit (`cypress/e2e/02-input-form.cy.js`)
1. `cy.visit` the Playground emulating a **Samsung Galaxy Note 9** (viewport 414x846 and a mobile user agent) and wait for `document.readyState === 'complete'`.
2. Click **Input Form Submit**.
3. Accessibility audit with **cypress-axe** (`injectAxe` + `checkA11y`).
4. Fill in all form fields.
5. Submit the form.
6. Performance audit with **Lighthouse** (`@cypress-audit/lighthouse`, `cy.lighthouse`).
7. Assert the message **"Thanks for contacting us, we will get back to you shortly."**
8. Session cleanup (cookies, local and session storage). Cypress closes the browser at the end of the run.

---

## Requirements checklist

| Requirement | How it is covered |
|---|---|
| Latest Cypress | Cypress 15.x |
| At least 2 different locators | CSS selectors / `cy.contains` (both specs) and **XPath** via `cypress-xpath` (`cy.xpath` in scenario 2) |
| Accessibility check | `cypress-axe` |
| Lighthouse performance check | `@cypress-audit/lighthouse` |
| Terminal logs | Printed by `cypress run`; accessibility violations are also logged with a custom `cy.task('log')` |
| Video recordings | `video: true` in `cypress.config.js`; `"video": true` in `lambdatest-config.json` |
| Screenshots | `screenshotOnRunFailure: true` plus explicit `cy.screenshot()` calls |
| Network and console logs | `"network": true` in `lambdatest-config.json` |
| Parallel execution on 2+ browser/OS combinations | `"parallels": 2` with Chrome / Windows 10 and Edge / macOS (see below) |

---

## Project structure

```
cypress101-testmu/
├── cypress/
│   ├── e2e/
│   │   ├── 01-slider.cy.js
│   │   └── 02-input-form.cy.js
│   └── support/
│       └── e2e.js
├── cypress.config.js
├── lambdatest-config.json
├── package.json
└── README.md
```

---

## How to run

### Install
```bash
npm install
```

### Locally
```bash
npx cypress open                      # interactive mode
npx cypress run --browser edge        # headless, with video and screenshots
```
Lighthouse requires a Chromium-based browser.

### On the TestMu AI cloud
```bash
npm i -g lambdatest-cypress-cli
lambdatest-cypress run --username="<LT_USERNAME>" --ak="<LT_ACCESS_KEY>"
```
Alternatively, set the `LT_USERNAME` and `LT_ACCESS_KEY` environment variables. **Credentials are intentionally not stored in this repository**; `lambdatest-config.json` keeps them empty.

Browser/OS combinations configured in `lambdatest-config.json`:
- Chrome (latest) on Windows 10
- Microsoft Edge (latest) on macOS Ventura

---

## Design decisions and findings

- **macOS Catalina was replaced.** A first cloud run on macOS Catalina failed before any test started with `dyld: Library not loaded: UniformTypeIdentifiers.framework` (Cypress 15, darwin 19.6.0). Cypress 15 does not run on that macOS version, so the macOS combination was changed to a newer release.
- **Slider stability.** The Playground updates the `<output>` value only after the page scripts are ready. In a first version the input value changed but the output stayed at `15`, and the test only passed on the retry. The final version waits for the page to load, uses a short pause and retries the adjustment up to 5 times before asserting.
- **Accessibility results are reported, not enforced.** `cy.checkA11y` runs with `skipFailures = true`, so existing issues of the page under test do not fail the run. Locally, axe reported 2 violations on the form (`color-contrast`, serious; `select-name`, critical), logged in the terminal.
- **Lighthouse thresholds are intentionally lenient** (the plugin default is 100 for every category), so the check measures and reports without failing on third-party scripts of the page.
- **Mobile emulation.** The Samsung Galaxy Note 9 is emulated with `cy.viewport(414, 846)` and a mobile `navigator.userAgent` set in `onBeforeLoad`, since Cypress has no built-in preset for this device.
- **Third-party scripts.** The page loads analytics and chat scripts that can throw unrelated errors, so `uncaught:exception` is ignored in `cypress/support/e2e.js`.

## Known limitations

- Form selectors were validated against the current Playground markup and may need adjustment if the page changes.
- Running Lighthouse inside a remote cloud browser can be restricted by the platform, because it needs a browser debugging port. It was validated locally on a Chromium-based browser.
- `cy.wait` is used in the slider spec as a deliberate workaround for the late script initialization described above.