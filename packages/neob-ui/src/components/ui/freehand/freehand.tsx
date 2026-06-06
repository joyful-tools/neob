import { type HTMLAttributes, type ReactNode, type Ref } from 'react';

import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utilities';

export interface FreehandProperties extends HTMLAttributes<HTMLDivElement> {
	readonly ref?: Ref<HTMLDivElement>;
	readonly children?: ReactNode;
	readonly variant?: 'freehand' | 'fuzzy';
}

/**
 * FreehandFilters renders the SVG filter definitions used for generating sketch/hand-drawn and fuzzy borders.
 * It is rendered automatically by the Freehand wrapper, but can also be used directly.
 */
export function FreehandFilters() {
	const prefersReducedMotion = usePrefersReducedMotion();

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
				<filter id="freehand">
					<feTurbulence id="freehand--turbulence" type="fractalNoise" baseFrequency="0.005" numOctaves="3" seed="1" result="noise" />
					<feDisplacementMap in2="noise" in="SourceGraphic" scale="12" result="displaced" />
					<feConvolveMatrix in="displaced" order="3" kernelMatrix="1 1 1 1 2 1 1 1 1" edgeMode="duplicate" result="smoothed" />
					{!prefersReducedMotion && (
						<animate href="#freehand--turbulence" attributeName="seed" from="1" to="5" dur="2s" repeatCount="indefinite" />
					)}
				</filter>

				<filter id="fuzzy">
					<feTurbulence id="fuzzy--turbulence" type="fractalNoise" baseFrequency="0.95" numOctaves="3" seed="1" result="noise" />
					<feDisplacementMap in2="noise" in="SourceGraphic" scale="8" result="displaced" />
					<feConvolveMatrix
						in="displaced"
						order="3"
						kernelMatrix="0.3 0.3 0.3 0.3 2 0.3 0.3 0.3 0.3"
						edgeMode="duplicate"
						result="smoothed"
					/>
					{!prefersReducedMotion && (
						<animate href="#fuzzy--turbulence" attributeName="seed" from="1" to="5" dur="2s" repeatCount="indefinite" />
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
export function Freehand({ children, variant = 'freehand', className, style, ref, ...properties }: FreehandProperties) {
	return (
		<>
			<FreehandFilters />
			<div
				ref={ref}
				className={cn(className)}
				style={{
					filter: `url(#${variant})`,
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
