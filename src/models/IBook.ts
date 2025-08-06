export interface IBook {
	name: string,
	market: string,
	description: string,
	event_url_bookmaker: string,
	odds_history: [
		{
			odds: number,
			timestamp: number
		}
	],
	status: 'up' | 'down' | null
}