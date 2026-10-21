describe('Cenário 1 - Drag & Drop Sliders', () => {
  it('arrasta o slider "Default value 15" até 95 e valida o valor', () => {
    cy.visit('/selenium-playground/');

    cy.contains('a', 'Drag & Drop Sliders').click();
    cy.url().should('include', 'drag-drop-range-sliders');

    cy.get('input[type="range"][value="15"]').as('slider');

    // Eventos de mouse do Cypress (início do arraste)
    cy.get('@slider').trigger('mousedown', { force: true });

    // Define o valor do jeito nativo, dentro da janela do site,
    // para o framework da página perceber a mudança
    cy.window().then((win) => {
      cy.get('@slider').then(($el) => {
        const el = $el[0];
        const setter = Object.getOwnPropertyDescriptor(
          win.HTMLInputElement.prototype,
          'value'
        ).set;
        setter.call(el, '95');
        el.dispatchEvent(new win.Event('input', { bubbles: true }));
        el.dispatchEvent(new win.Event('change', { bubbles: true }));
      });
    });

    // Fim do arraste
    cy.get('@slider').trigger('mouseup', { force: true });

    // Validações
    cy.get('@slider').should('have.value', '95');
    cy.get('@slider').closest('div').find('output').should('have.text', '95');

    cy.screenshot('slider-95');
  });
});