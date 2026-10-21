const NOTE9 = {
  width: 414,
  height: 846,
  ua: 'Mozilla/5.0 (Linux; Android 10; SM-N960F) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
};

const logViolations = (violations) => {
  cy.task(
    'log',
    `${violations.length} violação(ões) de acessibilidade encontrada(s)`
  );
  violations.forEach(({ id, impact, nodes }) =>
    cy.task('log', `  - [${impact}] ${id} (${nodes.length} elemento(s))`)
  );
};

describe('Cenário 2 - Input Form Submit', () => {
  it('preenche, envia e valida o formulário', () => {
    cy.viewport(NOTE9.width, NOTE9.height);
    cy.visit('/selenium-playground/', {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, 'userAgent', {
          value: NOTE9.ua,
        });
      },
    });
    cy.window().its('document.readyState').should('eq', 'complete');
    cy.get('body').should('be.visible');

    cy.xpath('//a[normalize-space()="Input Form Submit"]')
      .scrollIntoView()
      .click();
    cy.url().should('include', 'input-form-demo');

    cy.injectAxe();
    cy.checkA11y(null, null, logViolations, true);

    cy.get('#name').type('Lucia Braga');
    cy.get('#inputEmail4').type('lucia.teste@example.com');
    cy.get('#inputPassword4').type('Senha@12345');
    cy.get('#company').type('Fulltime QA');
    cy.get('#websitename').type('https://www.example.com');
    cy.get('select[name="country"]').select('Brazil');
    cy.get('#inputCity').type('Marilia');
    cy.get('#inputAddress1').type('Rua Exemplo, 100');
    cy.get('#inputAddress2').type('Apto 12');
    cy.get('#inputState').type('SP');
    cy.get('#inputZip').type('17500000');

    cy.contains('button', 'Submit').click();

    cy.lighthouse({
      performance: 30,
      accessibility: 50,
      'best-practices': 50,
      seo: 50,
    });

    cy.contains('Thanks for contacting us, we will get back to you shortly.')
      .should('be.visible');
    cy.screenshot('form-enviado');
  });

  after(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
  });
});