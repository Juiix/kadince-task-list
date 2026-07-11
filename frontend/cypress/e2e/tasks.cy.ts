import { E2E_PREFIX, purgeE2eTasks, seedTask } from '../support/e2e'

const title = (name: string) => `${E2E_PREFIX}${name}`

function localISO(offsetDays: number): string {
  const date = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

describe('task management', () => {
  beforeEach(() => {
    purgeE2eTasks()
  })

  after(() => {
    purgeE2eTasks()
  })

  it('creates a task through the modal', () => {
    cy.visit('/tasks')
    cy.get('[data-cy=add-task-button]').click()
    cy.get('[data-cy=task-title-input]').type(title('created in browser'))
    cy.get('[data-cy=task-description-input]').type('typed by Cypress')
    cy.get('[data-cy=task-submit]').click()

    cy.get('[data-cy=modal]').should('not.exist')
    cy.contains('[data-cy=task-row]', title('created in browser'))
      .should('be.visible')
      .and('contain', 'typed by Cypress')
  })

  it('rejects a blank title client-side', () => {
    cy.visit('/tasks')
    cy.get('[data-cy=add-task-button]').click()
    cy.get('[data-cy=task-submit]').click()

    cy.contains('Title is required').should('be.visible')
    cy.get('[data-cy=modal]').should('exist')
  })

  it('completes a task and moves it across filters', () => {
    seedTask({ title: title('complete me') })
    cy.visit('/tasks?filter=pending')

    cy.contains('[data-cy=task-row]', title('complete me'))
      .find('[data-cy=task-checkbox]')
      .click()

    // A completed task leaves the pending view...
    cy.contains('[data-cy=task-row]', title('complete me')).should('not.exist')

    // ...and shows up under Completed with a Done badge
    cy.get('[data-cy=filter-completed]').click()
    cy.url().should('include', 'filter=completed')
    cy.contains('[data-cy=task-row]', title('complete me')).should(
      'contain',
      'Done',
    )
  })

  it('edits a task inline', () => {
    seedTask({ title: title('rename me'), description: 'old description' })
    cy.visit('/tasks')

    cy.contains('[data-cy=task-row]', title('rename me'))
      .find('[data-cy=task-edit]')
      .click({ force: true })
    cy.get('[data-cy=task-title-input]').clear()
    cy.get('[data-cy=task-title-input]').type(title('renamed'))
    cy.contains('button', 'Save').click()

    cy.contains('[data-cy=task-row]', title('renamed')).should('be.visible')
    cy.contains(title('rename me')).should('not.exist')
  })

  it('deletes a task', () => {
    seedTask({ title: title('delete me') })
    cy.visit('/tasks')

    cy.contains('[data-cy=task-row]', title('delete me'))
      .find('[data-cy=task-delete]')
      .click({ force: true })

    // window.confirm is auto-accepted by Cypress
    cy.contains('[data-cy=task-row]', title('delete me')).should('not.exist')
  })

  it('searches across the visible list', () => {
    seedTask({ title: title('alpha errand') })
    seedTask({ title: title('beta chore') })
    cy.visit('/tasks')

    cy.get('[data-cy=search-input]').type('alpha')

    cy.contains('[data-cy=task-row]', title('alpha errand')).should('be.visible')
    cy.contains('[data-cy=task-row]', title('beta chore')).should('not.exist')
  })

  it('surfaces overdue tasks on the Today dashboard', () => {
    seedTask({ title: title('overdue thing'), dueOn: localISO(-2) })
    seedTask({ title: title('due today thing'), dueOn: localISO(0) })
    cy.visit('/')

    cy.contains('.task-group', 'Overdue').within(() => {
      cy.contains(title('overdue thing')).should('be.visible')
    })
    cy.contains('.task-group', 'Today').within(() => {
      cy.contains(title('due today thing')).should('be.visible')
    })
  })
})
