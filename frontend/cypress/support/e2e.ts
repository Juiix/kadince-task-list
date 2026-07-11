// Every e2e task title carries this prefix so tests can seed and purge
// their own data against the running backend without touching real tasks.
export const E2E_PREFIX = 'E2E: '

const graphqlUrl = () => Cypress.env('graphqlUrl') as string

export function graphql(query: string, variables?: object) {
  return cy.request('POST', graphqlUrl(), { query, variables })
}

export function seedTask(input: {
  title: string
  description?: string
  dueOn?: string
  completed?: boolean
}) {
  return graphql(
    `mutation($input: CreateTaskInput!) {
      createTask(input: $input) { task { id } errors }
    }`,
    { input: { title: input.title, description: input.description, dueOn: input.dueOn } },
  ).then(({ body }) => {
    const id = body.data.createTask.task.id as string
    if (input.completed) {
      graphql(
        `mutation($input: UpdateTaskInput!) {
          updateTask(input: $input) { task { id } errors }
        }`,
        { input: { id, completed: true } },
      )
    }
    return cy.wrap(id)
  })
}

export function purgeE2eTasks() {
  graphql('{ tasks { id title } }').then(({ body }) => {
    const strays = body.data.tasks.filter((task: { title: string }) =>
      task.title.startsWith(E2E_PREFIX),
    )
    strays.forEach((task: { id: string }) => {
      graphql(
        `mutation($input: DeleteTaskInput!) {
          deleteTask(input: $input) { id errors }
        }`,
        { input: { id: task.id } },
      )
    })
  })
}
