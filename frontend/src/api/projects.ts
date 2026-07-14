import { graphqlRequest } from '../lib/graphql'
import type { Project, ProjectFilter } from '../types'

const PROJECT_FIELDS = `
  id
  name
  color
  completed
  completedAt
  createdAt
  updatedAt
`
/** Shape of every mutation payload: user errors are data, not exceptions. */
interface ProjectPayload {
  project: Project | null
  errors: string[]
}

function unwrap(payload: ProjectPayload, fallbackMessage: string): Project {
  if (payload.errors.length > 0 || !payload.project) {
    throw new Error(payload.errors.join('; ') || fallbackMessage)
  }
  return payload.project
}

export async function fetchProjects(filter: ProjectFilter): Promise<Project[]> {
  const data = await graphqlRequest<{ projects: Project[] }>(
    `query Projects($filter: ProjectFilter) {
      projects(filter: $filter) {
        ${PROJECT_FIELDS}
      }
    }`,
    { filter },
  )
  return data.projects
}

export interface CreateProjectInput {
  name: string
  color: string
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const data = await graphqlRequest<{ createProject: ProjectPayload }>(
    `mutation CreateProject($input: CreateProjectInput!) {
      createProject(input: $input) {
        project {
          ${PROJECT_FIELDS}
        }
        errors
      }
    }`,
    { input },
  )
  return unwrap(data.createProject, 'Failed to create project')
}

export interface UpdateProjectInput {
  id: string
  name?: string
  color?: string
}

export async function updateProject(input: UpdateProjectInput): Promise<Project> {
  const data = await graphqlRequest<{ updateProject: ProjectPayload }>(
    `mutation UpdateProject($input: UpdateProjectInput!) {
      updateProject(input: $input) {
        project {
          ${PROJECT_FIELDS}
        }
        errors
      }
    }`,
    { input },
  )
  return unwrap(data.updateProject, 'Failed to update project')
}

export async function deleteProject(id: string): Promise<string> {
  const data = await graphqlRequest<{ deleteProject: { id: string | null; errors: string[] } }>(
    `mutation DeleteProject($input: DeleteProjectInput!) {
      deleteProject(input: $input) {
        id
        errors
      }
    }`,
    { input: { id } },
  )
  const { id: deletedId, errors } = data.deleteProject
  if (errors.length > 0 || !deletedId) {
    throw new Error(errors.join('; ') || 'Failed to delete project')
  }
  return deletedId
}

export async function completeProject(id: string): Promise<Project> {
  const data = await graphqlRequest<{ completeProject: ProjectPayload }>(
    `mutation CompleteProject($input: CompleteProjectInput!) {
      completeProject(input: $input) {
        project {
          ${PROJECT_FIELDS}
        }
        errors
      }
    }`,
    { input: { id } },
  )
  return unwrap(data.completeProject, 'Failed to complete project')
}

export async function reopenProject(id: string): Promise<Project> {
  const data = await graphqlRequest<{ reopenProject: ProjectPayload }>(
    `mutation ReopenProject($input: ReopenProjectInput!) {
      reopenProject(input: $input) {
        project {
          ${PROJECT_FIELDS}
        }
        errors
      }
    }`,
    { input: { id } },
  )
  return unwrap(data.reopenProject, 'Failed to reopen project')
}