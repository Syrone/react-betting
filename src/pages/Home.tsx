import Hero from '../components/Hero/Hero'
import Items from '../components/Items/Items'

type Props = {}

function Home({ }: Props) {
	return (
		<>
			<Hero />
			<Items />
		</>
	)
}

export default Home