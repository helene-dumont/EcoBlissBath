describe("Test de connexion", () => {
    it("Se connecter au site web - identifiants corrects", () => {
        cy.visit("http://localhost:8080/#/");
        cy.getBySel("nav-link-login").click();
        cy.getBySel("login-input-username").type("test2@test.fr");
        cy.getBySel("login-input-password").type("testtest");
        cy.getBySel("login-submit").click();
        cy.getBySel("nav-link-cart").should("be.visible")
    });

    it("Se connecter au site web - identifiants incorrects", () => {
        cy.visit("http://localhost:8080/#/");
        cy.getBySel("nav-link-login").click();
        cy.getBySel("login-input-username").type("test@test.fr");
        cy.getBySel("login-input-password").type("testtest");
        cy.getBySel("login-submit").click();
        //Vérification de l'affichage d'un message d'alerte et de l'absence du panier
        cy.getBySel("nav-link-cart").should("not.exist")
        cy.getBySel("login-errors").should('be.visible')
        
    })
})