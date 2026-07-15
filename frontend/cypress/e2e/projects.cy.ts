import { E2E_PREFIX, purgeE2eProjects, purgeE2eTasks, seedProject, seedTask } from '../support/e2e'

const title = (name: string) => `${E2E_PREFIX}${name}`
const name = (name: string) => `${E2E_PREFIX}${name}`

function localISO(offsetDays: number): string {
  const date = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

const hexToRgb = (hex: string) =>
  `rgb(${[0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`

describe('project management', () => {
  beforeEach(() => {
    purgeE2eTasks()
    purgeE2eProjects()
  })

  after(() => {
    purgeE2eTasks()
    purgeE2eProjects()
  })

  it('creates a project through the modal', () => {
    cy.visit('/tasks')
    cy.get('[data-cy=add-project-button]').click()
    cy.get('[data-cy=project-name-input]').type(name('created in browser'))
    cy.get('[data-cy=swatch-e66767]').siblings('.swatch-dot').click()
    cy.get('[data-cy=swatch-e66767]').should('be.checked')
    cy.get('[data-cy=project-submit]').click()

    cy.get('[data-cy=modal]').should('not.exist')
    cy.contains('[data-cy=project-row]', name('created in browser'))
      .should('be.visible')
      .find('.project-dot')
      .should('have.css', 'background-color', hexToRgb('e66767'))
  })

  it('rejects a blank name client-side', () => {
    cy.visit('/tasks')
    cy.get('[data-cy=add-project-button]').click()
    cy.get('[data-cy=project-submit]').click()

    cy.contains('Name is required').should('be.visible')
    cy.get('[data-cy=modal]').should('exist')
  })
  
  it('filters project tasks', () => {
    seedProject({ name: name('Paint the Fence') })
    
    cy.visit('/tasks')
    cy.contains('[data-cy=project-row]', 'E2E: Paint the Fence').click()

    cy.url().should('include', 'project=')
    cy.get('[data-cy=project-banner]').should('contain', 'E2E: Paint the Fence')
    cy.contains('.group-empty', 'No tasks in this project yet.')
  })
  
  it('creates a project task', () => {
    seedProject({ name: name('Paint the Fence') })
    
    cy.visit('/tasks')
    cy.contains('[data-cy=project-row]', 'E2E: Paint the Fence').click()
    cy.get('[data-cy=add-task-button]').click()
    cy.get('[data-cy=task-project-select]')
        .find(':selected')
        .should('have.text', 'E2E: Paint the Fence')

    cy.get('[data-cy=task-title-input]').type(title('created in browser'))
    cy.get('[data-cy=task-description-input]').type('typed by Cypress')
    cy.get('[data-cy=task-submit]').click()

    cy.get('[data-cy=modal]').should('not.exist')
    cy.contains('[data-cy=task-row]', title('created in browser'))
      .should('be.visible')
      .and('contain', 'typed by Cypress')
  })

  it('completes a project and its dependent tasks', () => {
    seedProject({ name: name('Paint the Fence') }).then((projectId) => {
        seedTask({ title: title('Buy paint'), projectId: projectId })
        seedTask({ title: title('Buy brushes'), projectId: projectId })
    })

    cy.visit('/tasks')
    cy.contains('[data-cy=project-row]', 'E2E: Paint the Fence').click()
    cy.get('[data-cy=project-complete]').click()

    cy.get('[data-cy=project-banner]').within(() => {
        cy.contains('Completed').should('be.visible')
        cy.get('[data-cy=project-reopen]').should('be.visible')
        cy.get('[data-cy=project-complete]').should('not.exist')
    })

    cy.contains('[data-cy=task-row]', title('Buy paint'))
        .should('have.class', 'completed')
        .find('.done-text')
        .should('have.text', 'Done')
  })

  it('reopens a project and leaves its dependent tasks completed', () => {
    seedProject({ name: name('Paint the Fence') }).then((projectId) => {
        seedTask({ title: title('Buy paint'), projectId: projectId })
        seedTask({ title: title('Buy brushes'), projectId: projectId })
    })

    cy.visit('/tasks')
    cy.contains('[data-cy=project-row]', 'E2E: Paint the Fence').click()
    cy.get('[data-cy=project-complete]').click()
    cy.get('[data-cy=project-reopen]').click()

    cy.get('[data-cy=project-banner]').within(() => {
        cy.get('[data-cy=project-complete]').should('be.visible')
        cy.get('[data-cy=project-reopen]').should('not.exist')
    })

    cy.contains('[data-cy=task-row]', title('Buy paint'))
        .should('have.class', 'completed')
        .find('.done-text')
        .should('have.text', 'Done')
  })

  it('deletes a project and its dependent tasks', () => {
    seedProject({ name: name('Paint the Fence') }).then((projectId) => {
        seedTask({ title: title('Buy paint'), projectId: projectId })
    })

    cy.visit('/tasks')
    cy.contains('[data-cy=project-row]', name('Paint the Fence')).click()
    cy.get('[data-cy=project-banner]').should('be.visible')

    cy.get('[data-cy=project-delete]').click()

    cy.get('[data-cy=project-banner]').should('not.exist')
    cy.url().should('not.include', 'project=')
    cy.contains('[data-cy=project-row]', name('Paint the Fence')).should('not.exist')
    cy.contains('[data-cy=task-row]', title('Buy paint')).should('not.exist')
  })
})
