import { type HTMLAttributes, type ReactNode, type Ref, useId } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utilities';

export interface FreehandProperties extends HTMLAttributes<HTMLDivElement> {
	readonly ref?: Ref<HTMLDivElement>;
	readonly children?: ReactNode;
	readonly variant?: 'freehand' | 'fuzzy';
	readonly speed?: number;
	readonly intensity?: number;
}

export interface FreehandFiltersProperties {
	readonly id?: string;
	readonly speed?: number;
	readonly intensity?: number;
}

/**
 * FreehandFilters renders the SVG filter definitions used for generating sketch/hand-drawn and fuzzy borders.
 * It is rendered automatically by the Freehand wrapper, but can also be used directly.
 */
export function FreehandFilters({ id, speed = 1, intensity = 1 }: FreehandFiltersProperties) {
	const generatedId = useId();
	const prefersReducedMotion = usePrefersReducedMotion();
	const filterId = id ?? generatedId;
	const freehandId = `${filterId}-freehand`;
	const freehandShapeId = `${filterId}-freehand-shape`;
	const freehandEdgeId = `${filterId}-freehand-edge`;
	const fuzzyId = `${filterId}-fuzzy`;
	const fuzzyTurbulenceId = `${filterId}-fuzzy-turbulence`;
	const normalizedSpeed = Number.isFinite(speed) ? Math.max(speed, 0.01) : 1;
	const normalizedIntensity = Number.isFinite(intensity) ? Math.max(intensity, 0) : 1;
	const duration = `${0.42 / normalizedSpeed}s`;
	const padding = Math.max(12, normalizedIntensity * 12);
	const filterOffset = `-${padding}%`;
	const filterSize = `${100 + padding * 2}%`;

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			width="0"
			height="0"
			className="pointer-events-none absolute size-0"
			aria-hidden="true"
		>
			<defs>
				<filter id={freehandId} x={filterOffset} y={filterOffset} width={filterSize} height={filterSize} colorInterpolationFilters="sRGB">
					<feTurbulence id={freehandShapeId} type="fractalNoise" baseFrequency="0.018 0.025" numOctaves="2" seed="2" result="shapeNoise" />
					<feDisplacementMap in="SourceGraphic" in2="shapeNoise" scale={12 * normalizedIntensity} result="shaped" />
					<feTurbulence id={freehandEdgeId} type="fractalNoise" baseFrequency="0.065" numOctaves="1" seed="11" result="edgeNoise" />
					<feDisplacementMap in="shaped" in2="edgeNoise" scale={4 * normalizedIntensity} result="displaced" />
					<feGaussianBlur in="displaced" stdDeviation="0.12" />
					{!prefersReducedMotion && (
						<>
							<animate
								href={`#${freehandShapeId}`}
								attributeName="seed"
								values="2;5;9"
								dur={duration}
								calcMode="discrete"
								repeatCount="indefinite"
							/>
							<animate
								href={`#${freehandEdgeId}`}
								attributeName="seed"
								values="11;17;23"
								dur={duration}
								calcMode="discrete"
								repeatCount="indefinite"
							/>
						</>
					)}
				</filter>

				<filter id={fuzzyId} x={filterOffset} y={filterOffset} width={filterSize} height={filterSize} colorInterpolationFilters="sRGB">
					<feTurbulence id={fuzzyTurbulenceId} type="fractalNoise" baseFrequency="0.14" numOctaves="2" seed="3" result="noise" />
					<feDisplacementMap in="SourceGraphic" in2="noise" scale={7 * normalizedIntensity} result="displaced" />
					<feGaussianBlur in="displaced" stdDeviation="0.15" />
					{!prefersReducedMotion && (
						<animate
							href={`#${fuzzyTurbulenceId}`}
							attributeName="seed"
							values="3;7;13"
							dur={duration}
							calcMode="discrete"
							repeatCount="indefinite"
						/>
					)}
				</filter>
			</defs>
		</svg>
	);
}
FreehandFilters.displayName = 'FreehandFilters';

/**
 * Freehand is a wrapper element that applies sketch-like SVG filter effects to its background/borders.
 */
export function Freehand({
	children,
	variant = 'freehand',
	speed = 1,
	intensity = 1,
	className,
	style,
	ref,
	...properties
}: FreehandProperties) {
	const filterId = useId();

	return (
		<>
			<FreehandFilters id={filterId} speed={speed} intensity={intensity} />
			<div
				ref={ref}
				className={cn(className)}
				style={{
					filter: `url(#${filterId}-${variant})`,
					...style,
				}}
				{...properties}
			>
				{children}
			</div>
		</>
	);
}
Freehand.displayName = 'Freehand';
