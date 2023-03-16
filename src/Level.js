import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

THREE.ColorManagement.enabled = true;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' });
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' });
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategray' });

export function BlockStart({ position = [0, 0, 0] }) {
	return (
		<group position={position}>
			<mesh
				geometry={boxGeometry}
				material={floor1Material}
				scale={[4, 0.2, 4]}
				receiveShadow
				position={[0, -0.1, 0]}
			/>
		</group>
	);
}

export function BlockEnd({ position = [0, 0, 0] }) {
	const hamburger = useGLTF('./hamburger.glb');

	useEffect(() => {
		hamburger.scene.children.forEach((mesh) => (mesh.castShadow = true));
	}, [hamburger]);

	return (
		<group position={position}>
			<mesh
				geometry={boxGeometry}
				material={floor1Material}
				scale={[4, 0.2, 4]}
				receiveShadow
				position={[0, 0, 0]}
			/>

			<RigidBody
				colliders="hull"
				type="fixed"
				position={[0, 0.25, 0]}
				restitution={0.2}
				friction={0}
			>
				<primitive object={hamburger.scene} scale={0.2} />
			</RigidBody>
		</group>
	);
}

export function BlockSpinner({ position = [0, 0, 0] }) {
	const obstacle = useRef();
	const [speed] = useState(
		() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
	);

	useFrame((state, delta) => {
		const time = state.clock.getElapsedTime();

		const eulerRotation = new THREE.Euler(0, time * speed, 0);
		const quaternionRotation = new THREE.Quaternion();
		quaternionRotation.setFromEuler(eulerRotation);

		obstacle.current.setNextKinematicRotation(quaternionRotation);
	});

	return (
		<group position={position}>
			{/* Floor */}
			<mesh
				geometry={boxGeometry}
				material={floor2Material}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>

			{/* Obstacle */}
			<RigidBody
				ref={obstacle}
				type="kinematicPosition"
				position-y={0.3}
				restitution={0.2}
				friction={0}
			>
				<mesh
					geometry={boxGeometry}
					material={obstacleMaterial}
					scale={[3.5, 0.3, 0.3]}
					castShadow
					receiveShadow
				/>
			</RigidBody>
		</group>
	);
}

export function BlockLimbo({ position = [0, 0, 0] }) {
	const obstacle = useRef();
	const [speed] = useState(() => Math.random() + 0.2);

	useFrame((state, delta) => {
		const time = state.clock.getElapsedTime();

		const y = Math.sin(time * speed * 2) + 1.15;
		obstacle.current.setNextKinematicTranslation({
			x: position[0],
			y: position[1] + y,
			z: position[2],
		});
	});

	return (
		<group position={position}>
			{/* Floor */}
			<mesh
				geometry={boxGeometry}
				material={floor2Material}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>

			{/* Obstacle */}
			<RigidBody
				ref={obstacle}
				type="kinematicPosition"
				position-y={0.3}
				restitution={0.2}
				friction={0}
			>
				<mesh
					geometry={boxGeometry}
					material={obstacleMaterial}
					scale={[3.5, 0.3, 0.3]}
					castShadow
					receiveShadow
				/>
			</RigidBody>
		</group>
	);
}

export function BlockAxe({ position = [0, 0, 0] }) {
	const obstacle = useRef();
	const [speed] = useState(() => Math.random() + 0.2);

	useFrame((state, delta) => {
		const time = state.clock.getElapsedTime();

		const x = Math.sin(time * speed * 2) * 1.25;
		obstacle.current.setNextKinematicTranslation({
			x: position[0] + x,
			y: position[1] + 0.75,
			z: position[2],
		});
	});

	return (
		<group position={position}>
			{/* Floor */}
			<mesh
				geometry={boxGeometry}
				material={floor2Material}
				position={[0, -0.1, 0]}
				scale={[4, 0.2, 4]}
				receiveShadow
			/>

			{/* Obstacle */}
			<RigidBody
				ref={obstacle}
				type="kinematicPosition"
				position-y={0.3}
				restitution={0.2}
				friction={0}
			>
				<mesh
					geometry={boxGeometry}
					material={obstacleMaterial}
					scale={[1.5, 1.5, 0.3]}
					castShadow
					receiveShadow
				/>
			</RigidBody>
		</group>
	);
}

function Bounds({ length = 1 }) {
	return (
		<>
			<RigidBody type="fixed" restitution={0.2} friction={0}>
				<mesh
					position={[2.15, 0.75, -(length * 2) + 2]}
					geometry={boxGeometry}
					material={wallMaterial}
					scale={[0.3, 1.5, length * 4]}
					castShadow
				/>
				<mesh
					position={[-2.15, 0.75, -(length * 2) + 2]}
					geometry={boxGeometry}
					material={wallMaterial}
					scale={[0.3, 1.5, length * 4]}
					receiveShadow
				/>
				<mesh
					position={[0, 0.75, -(length * 4) + 2]}
					geometry={boxGeometry}
					material={wallMaterial}
					scale={[4, 1.5, 0.3]}
					receiveShadow
				/>

				<CuboidCollider
					args={[2, 0.1, 2 * length]}
					position={[0, -0.1, -(length * 2) + 2]}
					restitution={0.2}
					friction={1}
				/>
			</RigidBody>
		</>
	);
}

export function Level({
	count = 5,
	types = [BlockSpinner, BlockLimbo, BlockAxe],
	seed = 0,
}) {
	const blocks = useMemo(() => {
		const blocks = [];

		for (let i = 0; i < count; i++) {
			const type = types[Math.floor(Math.random() * types.length)];
			blocks.push(type);
		}

		return blocks;
		// eslint-disable-next-line
	}, [count, types, seed]);

	return (
		<>
			<BlockStart position={[0, 0, 0]} />
			{blocks.map((Block, index) => (
				<Block key={index} position={[0, 0, -(index + 1) * 4]} />
			))}
			<BlockEnd position={[0, 0, -(count + 1) * 4]} />

			<Bounds length={count + 2} />
		</>
	);
}
