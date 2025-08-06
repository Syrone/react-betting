import { useQuery } from '@tanstack/react-query'
import BetsService from '@services/BetsService'

export const useBetsQuery = () => {
  return useQuery({
    queryKey: ['bets'],
    queryFn: () => BetsService.bets().then(res => res.data),
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    staleTime: 4000,
  })
}
