import { useMemo } from 'react'

export function useSkeletonTableRows<T>(template: Partial<T>, count = 3): (T & { isSkeleton: boolean })[] {
  return useMemo(() => {
    return Array.from({ length: count }).map((_, index) => ({
      ...(template as unknown as T),
      _id: `skeleton-${ index }`,
      isSkeleton: true,
    }))
  }, [template, count])
}
