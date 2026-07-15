import { useQueryClient } from '@tanstack/react-query'

export function useInvalidate(...keys: string[]) {
  const queryClient = useQueryClient()
  return () =>
    Promise.all(
      keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
    )
}