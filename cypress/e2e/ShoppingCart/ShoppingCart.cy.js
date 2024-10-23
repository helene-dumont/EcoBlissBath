describe("Vérification de la fonctionnalité Panier", () => {

    let token

    it("Ajouter un produit disponible au panier (stock > 1) et vérifier la mise à jour du stock", () => {
        cy.login () // Voir code dans le fichier commands.js
        // Vider le panier s'il n'est pas vide
        cy.clearCartIfNotEmpty()
        // Sélectionner un produit 
        cy.getBySel("nav-link-products").click()
        cy.getBySel ("product-link").eq(4).click();
        cy.getBySel("detail-product-name").invoke('text')
        cy.getBySel("detail-product-stock").invoke('text')
        .should((text) => {
            // Extraire le nombre de la chaîne de caractères pour vérifier si stock est > 1
            const regex = /(-?\d+) en stock/   // Définir la chaîne à vérifier  
            const match = text.match(regex) // Recherche des occurences dans la chaîne à traiter
            const stockNr = parseInt(match[1], 10) // Conversion de la chaîne en entier
            expect(stockNr).to.be.gte(1) // Vérifiez que le stock est supérieur à 1 pour pouvoir être ajouté       
        }).then((text) => {
            const stockText = text.trim(); // Enlever les blancs en début et en fin de chaîne
            const stockNr = parseInt(stockText.match(/\d+/)) // Conversion en entier pour obtenir le stock
            cy.log("Stock:"+ stockNr) // Affichage du stock
            cy.getBySel("detail-product-add").click() // Cliquez sur "Ajouter au panier"
            cy.getBySel("nav-link-cart").click()
            cy.getBySel("cart-line-name").should("be.visible").contains("Extrait de nature") // Vérifier que le produit a été ajouté au panier
            cy.go('back') // Retour à la page produit 
            // Vérifier si le niveau de stock a été réduit
            const newStock = stockNr - 1
            cy.getBySel("detail-product-stock").invoke("text").should("match", new RegExp(newStock +" en stock"))
        })
    })

    it("Connexion via l'API", () => {
        cy.request({
            method: "POST",
            url: "http://localhost:8081/login",
            body: {
                username: "test2@test.fr",
                password: "testtest"
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("token");
            token = response.body.token;
        })
    })

    it("Vérifier que le produit est ajouté au panier via l'API", () => {
        cy.request({
            method: "GET",
            url: "http://localhost:8081/orders",
            headers: {
                "Authorization": "Bearer " + token 
            },          
        }).then((response) => {
            expect(response.status).to.eq(200);
            let orderLines = response.body.orderLines
            orderLines.forEach((orderLine) => {
                if (orderLine.product.id === 7) {
                    // Vérification si la quantité de produit avec l'identifiant 7 est 1
                    expect(orderLine.quantity).to.be.equal(1)
                } else {
                    throw new Error("Product with id 7 not found in the cart");
                }
            })
        })
    })
})

describe ("Vérification des limites", () => {

    beforeEach("Se connecter", () => {
        cy.login() // Voir code dans le fichier commands.js
    })

    /*it ("Ajouter un produit indisponible (stock < 1)", () => {
        // Vider le panier s'il n'est pas vide
        cy.clearCartIfNotEmpty()
        // Sélectionner le produit Poussière de lune
        cy.getBySel("nav-link-products").click()
        cy.getBySel ("product-link").eq(0).click();
        cy.getBySel("detail-product-stock").invoke('text')
        .should((text) => {
            // Extraire le nombre de la chaîne de caractères pour vérifier si stock est < 1
            const regex = /(-?\d+) en stock/   // Définir la chaîne à vérifier  
            const match = text.match(regex) // Recherche des occurences dans la chaîne à traiter
            const stockNr = parseInt(match[1], 10) // Conversion de la chaîne en entier
            expect(stockNr).to.be.lessThan(1) // Vérifiez que le produit est indisponible      
        })
        // Entrer une quantité égale à 1
        cy.getBySel ("detail-product-quantity").click();
        cy.getBySel ("detail-product-quantity").clear();
        cy.getBySel ("detail-product-quantity").type("1");
        // Ajouter au panier
        cy.getBySel ("detail-product-add").click();
        // Accéder au panier
        cy.getBySel ("nav-link-cart").click();
        // Vérifier que le panier est toujours vide
        cy.getBySel("cart-empty").should("be.visible")
        cy.getBySel("cart-line").should("be.not.visible")
    })*/

    it("Ajouter une quantité négative", () => {
        // Vider le panier s'il n'est pas vide
        cy.clearCartIfNotEmpty()
        // Sélectionner le produit Poussière de lune
        cy.getBySel("nav-link-products").click()
        cy.getBySel ("product-link").eq(5).click();
        // Entrer une quantité égale à -2
        cy.getBySel ("detail-product-quantity").click();
        cy.getBySel ("detail-product-quantity").clear();
        cy.getBySel ("detail-product-quantity").type("-2");
        // Ajouter au panier
        cy.getBySel ("detail-product-add").click();
        // Accéder au panier
        cy.getBySel ("nav-link-cart").click();
        // Vérifier que le panier est toujours vide
        cy.getBySel("cart-empty").should("be.visible")
    })

    it("Ajouter une quantité > 20", () => {
        // Sélectionner un produit
        cy.getBySel("nav-link-products").click()
        // Sélectionner le produit Aurore boréale 
        cy.getBySel("product-link").eq(7).click()
        cy.getBySel("detail-product-quantity").click()
        cy.getBySel("detail-product-quantity").clear()
        // Entrer une quantité > 20
        cy.getBySel("detail-product-quantity").type("21")
        // Ajouter au panier
        cy.getBySel ("detail-product-add").click();
        // Accéder au panier
        cy.getBySel ("nav-link-cart").click();
        // Vérifier que le panier est toujours vide
        //cy.getBySel("cart-empty").should("be.visible")
        // Vérifier que les articles n'ont pas été ajoutés au panier
        cy.getBySel("cart-empty").should("be.visible")
        cy.getBySel("cart-line").should("be.not.visible")
    })
})
