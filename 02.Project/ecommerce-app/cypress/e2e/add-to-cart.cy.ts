describe('Agregar productos al carrito', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('Should login, add a product to the cart, and verify it', () => {
    
    // 1. LOGIN
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');
    cy.visit('/login');

    const email = 'cypress_test@example.com';
    const password = 'Test12345!';

    cy.get('input[type="email"]').type(email);
    cy.get('#password').type(password);
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').then((res) => {
      expect(res.response!.statusCode).to.equal(200);
    });

    // 2. IR A PRODUCTOS
    cy.visit('/products');

    // Asegura que haya tarjetas
    cy.get('[data-cy="product-card"]').should('have.length.greaterThan', 0);

    // Guarda ID del primer producto
    cy.get('[data-cy="product-card"]').first()
      .invoke('attr', 'data-cy-product-id')
      .as('productId');

    // 3. HACER CLIC EN AGREGAR AL CARRITO
    cy.get('[data-cy="product-card"]').first()
      .find('[data-cy="add-to-cart-btn"]')
      .click();

    // 4. IR AL CARRITO
    cy.visit('/user/cart');

    // 5. Verificar que el producto está en el carrito
    cy.get('@productId').then((id) => {
      cy.get('[data-cy="cart-item"]').should('exist');
      cy.get(`[data-cy-cart-product-id="${id}"]`).should('exist');
    });

    // 6. Verificar que la cantidad es 1
    cy.get('[data-cy="cart-item"]')
      .first()
      .find('[data-cy="cart-quantity"]')
      .should('contain', '1');

    // 7. Verificar botón de aumentar
    cy.get('[data-cy="cart-item"]')
      .first()
      .find('[data-cy="increase-qty-btn"]')
      .click();

    cy.get('[data-cy="cart-item"]')
      .first()
      .find('[data-cy="cart-quantity"]')
      .should('contain', '2');

  });

});
