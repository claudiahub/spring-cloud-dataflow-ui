describe('Applications validation', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'))
    cy.get('.nav-content > a[routerlink = "apps"]').click()
  })

  it('Test add applications renders on table', () => {
    cy.importStreams()
    cy.get('.datagrid clr-dg-cell').should('have.length.gte', 1)
  })

  it('Test unregister for selected application', () => {
    cy.importStreams()
    cy.checkExistence('.apps-total')
    cy.get('.apps-total').should((elem) => {
      expect(Number(elem.text())).to.gt(0);
    });
    cy.get('.apps-total').then($appTotal => {
      const initialAddedApps = $appTotal.text();
      cy.get('.datagrid-action-toggle').last().click()
      cy.checkExistence('.datagrid-action-overflow button')
      cy.get('.datagrid-action-overflow button').last().click()
      cy.checkExistence('.modal-dialog button')
      cy.get('.modal-dialog button').last().click()
      cy.get('.content-area').scrollTo('bottom')
      cy.checkVisibility('.apps-total')
      cy.get('.apps-total').then($appUpdatedTotal => {
        expect(Number($appUpdatedTotal.text())).to.eq(Number(initialAddedApps) - 1)
      })
    })
  })

  it('Test show details for selected application', () => {
    cy.importStreams()
    cy.checkExistence('.apps-total')
    cy.get('.apps-total').then($appTotal => {
      const initialAddedApps = Number($appTotal.text());
      cy.get('.datagrid-action-toggle').last().click()
      cy.get('.datagrid-action-overflow button').first().click()
      cy.checkExistence('app-view-card')
      cy.get('app-view-card').should('have.id','info')
    })
  })

  it('Test group action for unregistering applications', () => {
    cy.importStreams()
    cy.checkExistence('.apps-total')
    cy.get('.apps-total').should((elem) => {
      expect(Number(elem.text())).to.gt(0);
    });
    cy.get('.apps-total').then($appTotal => {
      const initialAddedApps = $appTotal.text();
      cy.get('button#btnGroupActions').click()
      cy.get('input[type="checkbox"] + label').first().click()
      cy.get('button#btnUnregisterApplications').click()
      cy.checkExistence('.modal button')
      cy.get('.modal button').last().click()
      cy.checkLoading()
      cy.checkVisibility('app-toast.toast-success')
      cy.get('.content-area').scrollTo('bottom')
      cy.checkExistence('.apps-total')
      cy.get('.apps-total').then($appUpdatedTotal => {
        expect(Number($appUpdatedTotal.text())).to.lt(Number(initialAddedApps))
      })
    })
  })
})
