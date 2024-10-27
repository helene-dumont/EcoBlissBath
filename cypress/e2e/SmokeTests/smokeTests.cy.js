describe("smoke tests",()=>{
    it ("vérification des champs et du bouton de connexion",()=>{
        //Se rendre sur la page de connection
        cy.visit("http://localhost:8080/#/login")
        cy.getBySel("login-input-username").should ("be.visible")
        cy.getBySel("login-input-password").should ("be.visible")
        cy.getBySel("login-submit").should ("be.visible")
    })

    it("vérification présence bouton ajouter l'article au panier quand l'utilisateur est connecté", () => {
        //Se connecter au site Web
        cy.login() // Voir code dans le fichier commands.js
        cy.getBySel("nav-link-logout").should("be.visible");
        //Accéder à la page produits depuis la barre de navigation 
        cy.getBySel("nav-link-products").click()
        //Consulter un produit
        cy.getBySel("product-link").first().click()
        //Vérifier si le bouton Ajouter au panier est visible
        cy.getBySel("detail-product-add").should("be.visible")
    })

    it("vérification champs de disponibilité produit", () => {
        //Se rendre sur la page produits et consulter un produit
        cy.visit("http://localhost:8080/#/products")
        cy.getBySel("product-link").first().click()
        //Vérifier si champs disponibilité du produit est visible
        cy.getBySel("detail-product-stock").should("be.visible")
    })
})
