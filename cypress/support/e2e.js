import 'cypress-axe';
import 'cypress-xpath';
import '@cypress-audit/lighthouse/commands';

Cypress.on('uncaught:exception', () => false);
