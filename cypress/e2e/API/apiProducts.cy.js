describe ("Vérifier les informations produits", () => {
  const apiUrl = `${Cypress.env("apiUrl")}`;
  let productCard;
   
  it("Vérifier les fiches produits", () => {
      
    cy.request({
      method: "GET",
      url: apiUrl + "/products/3"
    }).then((response) => {
      expect(response.status).to.eq(200)
      productCard = response.body;
      expect(productCard.id).to.eq(3);
      expect(productCard.availableStock).to.be.a("number");
      expect(productCard.name).to.eq("Sentiments printaniers");
      expect(productCard.skin).to.eq("Propre, fraîche");
      expect(productCard.aromas).to.eq("Frais et fruité");
      expect(productCard.ingredients).to.eq("Framboise, zeste de citron et feuille de menthe");
      expect(productCard).to.have.property("description");
      expect(productCard.price).to.be.a("number");
    })
  })
})
