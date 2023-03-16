import { Level } from './Level';
import Lights from './Lights';
import { Physics, Debug } from '@react-three/rapier';
import Player from './Player';
import useGame from './stores/useGame';

function Experience() {
	const blocksCount = useGame((state) => state.blocksCount);
	const blocksSeed = useGame((state) => state.blocksSeed);

	return (
		<>
			<color args={['#bdedfc']} attach="background" />

			<Physics>
				{/* <Debug /> */}
				<Lights />
				<Level count={blocksCount} seed={blocksSeed} />
				<Player />
			</Physics>
		</>
	);
}

export default Experience;
