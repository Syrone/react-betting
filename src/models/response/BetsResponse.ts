import { IBook } from '@models/IBook'

export interface BetsResponse {
	id: string,
  hide?: boolean,
	teams: string,
	sport: string,
	start_event: number,
	created_at: number,
	is_live: boolean,
	pair_lifetime: number,
	profit: number,
	bookmakers: IBook[]
}