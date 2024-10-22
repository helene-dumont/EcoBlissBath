describe ("Vérifier les informations produits", () => {
  const apiUrl = `${Cypress.env("apiUrl")}`;
  let productCard;
   
  it("Vérifier les fiches produits", () => {
      
    cy.request({
      method: "GET",
      url: apiUrl + "/products"
    }).then((response) => {
      expect(response.status).to.eq(200)
      for (let i = 0; i < response.body.length; i++) {    // Boucle sur chaque ID produit pour vérifier toutes les fiches
        cy.log(response.body[i].id)
        cy.request({
          method: "GET",
          url: apiUrl + "/products" + `/${response.body[i].id}`  // ID produit
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          productCard = response.body;
            
          expect(productCard.id).to.be.a("number");
          expect(productCard.availableStock).to.be.a("number");
          expect(productCard.name).to.be.a("string");
          expect(productCard.skin).to.be.a("string");
          expect(productCard.aromas).to.be.a("string");
          expect(productCard.ingredients).to.be.a("string");
          expect(productCard).to.have.property("description");
          expect(productCard.price).to.be.a("number");
        })
      } 
    })
  })

  it("Vérifier défaut stock", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/products/3"   // Stock = -12
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      productCard = response.body;
        
      expect(productCard.availableStock).to.be.at.least(0);
    })
  })
})
