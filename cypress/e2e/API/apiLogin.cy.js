describe("Se connecter à l'API", () => {
    const apiUrl = `${Cypress.env("apiUrl")}`
    const loginUsername = `${Cypress.env("loginUsername")}`
    const loginPassword = `${Cypress.env("loginPassword")}`

    it("Se connecter avec des identifiants corrects", () => {
        cy.request("POST", apiUrl + "/login", {
            "username": loginUsername,
            "password": loginPassword
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("token") 
        })
    })

    it("Se connecter avec des identifiants incorrects", () => {
        cy.request({
            method: "POST",
            url: apiUrl + "/login",
            body: {
                username: "test@test.fr",
                password: "testtest"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
        })
    })
})