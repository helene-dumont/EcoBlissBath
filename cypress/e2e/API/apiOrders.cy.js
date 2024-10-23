describe ("Accéder au panier sans être connecté", () => {
  const apiUrl = `${Cypress.env("apiUrl")}`
    
  it("Accéder au panier sans être connecté", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/orders",
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(403) // => accès à la ressource refusé
    })
  })
})
    
describe("Accéder au panier en étant connecté", () => {
  let token
  const apiUrl = `${Cypress.env("apiUrl")}`
  const loginUsername = `${Cypress.env("loginUsername")}`
  const loginPassword = `${Cypress.env("loginPassword")}`
  
  beforeEach (() => {
    cy.request("POST", apiUrl + "/login", {
      "username": loginUsername,
      "password": loginPassword
    }).then((response) => {
      token = response.body.token;
    })
  })
  
  it("Vérifier le contenu du panier", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/orders",
      headers: {
        "Authorization": "Bearer " + token 
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.orderLines).to.have.lengthOf.above(0) // Vérifier si le tableau "orderLines" contient des éléments
    })
  })
  
  it("Ajouter un produit disponible au panier (method PUT)", () => {
    cy.request({
      method: "PUT",
      url: apiUrl + "/orders/add",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: {
        product: 6,
        quantity: 1
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
  
  it("Ajouter un produit disponible au panier (method POST)", () => {
    cy.request({
      method: "POST",   
      url: apiUrl + "/orders/add",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: {
        product: 6,
        quantity: 1
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)  
    })
  })
  
  it("Ajouter un produit non disponible (method PUT)", () => {
    cy.request({
      method: 'PUT',
      url: apiUrl + "/orders/add",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: {
        product: 3,
        quantity: 1
      }
    })
      .then((response) => {
        expect(response.status).to.eq(400)
      })
  })
  
  it("Ajouter un produit non disponible (method POST)", () => {
    cy.request({
      method: 'POST', 
      url: apiUrl + "/orders/add",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: {
        product: 3, 
        quantity: 1
      },
      failOnStatusCode: false
    })
      .then((response) => {
        expect(response.status).to.eq(400) 
      })
  })
})