import { useEffect } from 'react'

import { useAppDispatch } from '@redux/store'
import { dashboard } from '@redux/user/slice'

import Section from '@components/Section/Section'
import StatsCard from '@components/Dashboard/StatsCard'
import History from '@components/Dashboard/History'

type Props = {}

function Account({ }: Props) {
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(dashboard())
	}, [dispatch])

	return (
		<>
			<Section>
				<StatsCard />
			</Section>
			<Section>
				<History />
			</Section>
		</>
	)
}

export default Account