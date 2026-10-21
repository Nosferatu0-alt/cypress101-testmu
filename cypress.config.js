const { defineConfig } = require('cypress');
const { lighthouse, prepareAudit } = require('@cypress-audit/lighthouse');

module.exports = defineConfig({
  video: true,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 60000,
  retries: { runMode: 1, openMode: 0 },
  e2e: {
    baseUrl: 'https://www.testmuai.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });
      on('task', {
        lighthouse: lighthouse(),
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
});