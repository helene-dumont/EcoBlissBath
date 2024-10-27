let token;
const apiUrl = `${Cypress.env("apiUrl")}`
const loginUsername = `${Cypress.env("loginUsername")}`
const loginPassword = `${Cypress.env("loginPassword")}`

describe("Vérifier les avis", () => {
    
  before(() => {
    cy.request("POST", apiUrl + "/login", {
      "username": loginUsername,
      "password": loginPassword
    }).then((response) => {
      token = response.body.token;
    })
  })
  
  it("Ajouter un avis", () => {
    cy.request({
      method: "POST",
      url: apiUrl + '/reviews',
      headers: {
        "Authorization": "Bearer " + token 
      },
      body: {
        title: "Test : Produit validé!",
        comment: "Test : odeur très agréable",
        rating: 5
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id');
      expect(response.body.title).to.eq("Test : Produit validé!")
      expect(response.body.comment).to.eq("Test : odeur très agréable")
      expect(response.body.rating).to.eq(5)
    })
  })

  it("Test faille XSS", () => {
    cy.request({
      method: "POST",
      url: apiUrl + '/reviews',
     headers: {
        "Authorization": "Bearer " + token 
      },
      body: {
        title: "Test : Produit validé!",
        comment: '<script>alert("faille XSS");</script>',
        rating: 5
      }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id');
      expect(response.body.title).to.eq("Test : Produit validé!")
      expect(response.body.rating).to.eq(5)
    })
  })
})
