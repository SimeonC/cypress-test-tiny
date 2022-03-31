/// <reference types="cypress" />
const {
  createCypressModel,
  simpleExecutePlan,
  createCypressMachine,
} = require("xstate-test-cypress");

const model = createCypressModel(
  createCypressMachine(
    {
      initial: "init",
      states: {
        init: { on: { OPEN: 'modalOpen' } },
        modalOpen: { on: { TYPE: "withValues" } },
        withValues: {},
      },
    },
    {
      withValues: () => {
        cy.get("#name").should("have.value", "first check");
        cy.get("#username").should("have.value", "second check");
      },
    }
  ),
  {
    OPEN: () => {
      cy.get('button').click()
    },
    TYPE: () => {
      cy.get("#name").clear().type("first check");
      cy.get("#username").clear().type("second check");
    },
  }
);

describe("page", () => {
  simpleExecutePlan(model.getSimplePathPlansTo('withValues'), () => {
    cy.visit("http://localhost:3000");
  });
});