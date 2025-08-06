import { useMemo } from 'react'

export function useYear(): number {
  return useMemo(() => new Date().getFullYear(), [])
}
