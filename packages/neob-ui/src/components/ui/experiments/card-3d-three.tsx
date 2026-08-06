import { type MotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { cn } from '@/lib/utilities';

export interface ThreeCardSceneProperties {
	className?: string;
	maxTilt: number;
	x: MotionValue<number>;
	y: MotionValue<number>;
}

export function ThreeCardScene({ className, maxTilt, x, y }: ThreeCardSceneProperties) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const root = rootRef.current;
		if (!canvas || !root) return;

		let renderer: THREE.WebGLRenderer;
		try {
			renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas, powerPreference: 'high-performance' });
		} catch {
			return;
		}

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera();
		const eyeDistance = 8.2;
		const portalHalfHeight = 2.3;
		const near = 0.1;
		const far = 100;
		let portalHalfWidth = portalHalfHeight;

		const group = new THREE.Group();
		group.position.set(0, 0, -2.2);
		const knotGeometry = new THREE.TorusKnotGeometry(1.05, 0.32, 180, 24, 2, 3);
		const knotMaterial = new THREE.MeshPhysicalMaterial({
			clearcoat: 1,
			clearcoatRoughness: 0.12,
			color: 0xf4_81_20,
			iridescence: 0.72,
			iridescenceIOR: 1.5,
			iridescenceThicknessRange: [100, 420],
			metalness: 0.22,
			roughness: 0.2,
		});
		const knot = new THREE.Mesh(knotGeometry, knotMaterial);
		const cageGeometry = new THREE.IcosahedronGeometry(1.72, 1);
		const cageMaterial = new THREE.MeshBasicMaterial({ color: 0x00_00_00, transparent: true, opacity: 0.24, wireframe: true });
		const cage = new THREE.Mesh(cageGeometry, cageMaterial);
		group.add(knot, cage);

		const orbGeometry = new THREE.IcosahedronGeometry(0.48, 3);
		const orbMaterial = new THREE.MeshPhysicalMaterial({
			clearcoat: 1,
			color: 0xff_d0_8a,
			metalness: 0.1,
			roughness: 0.22,
		});
		const leftOrb = new THREE.Mesh(orbGeometry, orbMaterial);
		leftOrb.position.set(-2.1, 1.15, -4.1);
		const rightOrb = new THREE.Mesh(orbGeometry, orbMaterial);
		rightOrb.position.set(2.3, -1.35, -5.05);

		const wallGeometry = new THREE.PlaneGeometry(18, 14);
		const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xff_ad_60, metalness: 0, roughness: 0.92 });
		const wall = new THREE.Mesh(wallGeometry, wallMaterial);
		wall.position.z = -7;
		const grid = new THREE.GridHelper(14, 14, 0x00_00_00, 0x00_00_00);
		grid.rotation.x = Math.PI / 2;
		grid.position.z = -6.94;
		grid.material.transparent = true;
		grid.material.opacity = 0.12;
		scene.add(group, leftOrb, rightOrb, wall, grid);

		const ambientLight = new THREE.HemisphereLight(0xff_ff_ff, 0x6b_1c_05, 2.4);
		const keyLight = new THREE.PointLight(0xff_ff_ff, 46, 18, 1.8);
		keyLight.position.set(-3, 4, 5);
		const rimLight = new THREE.PointLight(0x7e_df_ff, 28, 16, 1.8);
		rimLight.position.set(4, -2, 4);
		scene.add(ambientLight, keyLight, rimLight);

		renderer.setClearColor(0x00_00_00, 0);
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.05;

		const resize = () => {
			const bounds = root.getBoundingClientRect();
			const width = Math.max(1, Math.round(bounds.width));
			const height = Math.max(1, Math.round(bounds.height));
			renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));
			renderer.setSize(width, height, false);
			portalHalfWidth = portalHalfHeight * (width / height);
		};

		let frame = 0;
		let visible = true;
		const cardRotation = new THREE.Matrix4();
		const inverseCardRotation = new THREE.Matrix4();
		const eye = new THREE.Vector3();
		const render = () => {
			const pointerX = x.get();
			const pointerY = y.get();
			const rotateX = THREE.MathUtils.degToRad(pointerY * -maxTilt);
			const rotateY = THREE.MathUtils.degToRad(pointerX * -maxTilt);
			cardRotation.makeRotationFromEuler(new THREE.Euler(rotateX, rotateY, 0, 'XYZ'));
			inverseCardRotation.copy(cardRotation).invert();
			eye.set(0, 0, eyeDistance).applyMatrix4(inverseCardRotation);
			camera.position.copy(eye);
			camera.quaternion.identity();
			const left = (near * (-portalHalfWidth - eye.x)) / eye.z;
			const right = (near * (portalHalfWidth - eye.x)) / eye.z;
			const top = (near * (portalHalfHeight - eye.y)) / eye.z;
			const bottom = (near * (-portalHalfHeight - eye.y)) / eye.z;
			camera.projectionMatrix.makePerspective(left, right, top, bottom, near, far, camera.coordinateSystem);
			camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
			renderer.render(scene, camera);
			if (visible) frame = requestAnimationFrame(render);
		};

		const resizeObserver = new ResizeObserver(resize);
		const intersectionObserver = new IntersectionObserver(([entry]) => {
			if (!entry) return;
			const wasVisible = visible;
			visible = entry.isIntersecting;
			if (visible && !wasVisible) frame = requestAnimationFrame(render);
		});
		resizeObserver.observe(root);
		intersectionObserver.observe(root);
		resize();
		frame = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			knotGeometry.dispose();
			knotMaterial.dispose();
			cageGeometry.dispose();
			cageMaterial.dispose();
			orbGeometry.dispose();
			orbMaterial.dispose();
			wallGeometry.dispose();
			wallMaterial.dispose();
			grid.geometry.dispose();
			grid.material.dispose();
			renderer.dispose();
		};
	}, [maxTilt, x, y]);

	return (
		<div ref={rootRef} className={cn('relative size-full', className)} role="img" aria-label="Interactive three-dimensional scene">
			<canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden="true" />
		</div>
	);
}

ThreeCardScene.displayName = 'ThreeCardScene';
