const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'phoe1m',
  env: {
    apiUrl: "http://localhost:8081" ,
    loginUsername : "test2@test.fr",
    loginPassword : "testtest"
  },
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: "http://localhost:8080"
  },
});
