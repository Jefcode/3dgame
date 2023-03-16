import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import Experience from './Experience';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Interface from './Interface';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<KeyboardControls
			map={[
				{ name: 'forward', keys: ['ArrowUp', 'KeyW'] },
				{ name: 'backward', keys: ['ArrowDown', 'KeyS'] },
				{ name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
				{ name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
				{ name: 'jump', keys: ['Space'] },
			]}
		>
			<Canvas
				shadows
				camera={{
					fov: 45,
					near: 0.1,
					far: 200,
					position: [4, 3, 6],
				}}
			>
				<Experience />
			</Canvas>
			<Interface />
		</KeyboardControls>
	</React.StrictMode>
);
