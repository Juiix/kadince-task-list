import axios from 'axios'

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:3000/graphql'

interface GraphQLError {
  message: string
}

interface GraphQLResponse<T> {
  data?: T
  errors?: GraphQLError[]
}

/**
 * Minimal GraphQL client: POSTs a query document + variables and returns
 * the typed `data` payload, surfacing GraphQL-level errors as exceptions.
 */
export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await axios.post<GraphQLResponse<T>>(GRAPHQL_URL, {
    query,
    variables,
  })

  const { data, errors } = response.data
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join('; '))
  }
  if (!data) {
    throw new Error('GraphQL response contained no data')
  }
  return data
}
