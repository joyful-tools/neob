import { cn } from '@/lib/utilities';

import type { CSSProperties } from 'react';

interface BorderBeamProperties {
	readonly className?: string;
	readonly duration?: number;
}

const beamStyle: CSSProperties = {
	animation: 'borderBeam var(--border-beam-duration, 2s) linear infinite',
	background:
		'conic-gradient(from var(--border-beam-angle), transparent 0%, transparent 70%, var(--color-orange) 85%, var(--color-gold) 92%, transparent 100%)',
	mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
	maskComposite: 'exclude',
	padding: '1.5px',
};

export function BorderBeam({ className, duration = 2 }: BorderBeamProperties) {
	return (
		<div className={cn('pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]', className)}>
			<div
				className="absolute inset-0"
				style={{
					...beamStyle,
					animationDuration: `${duration}s`,
				}}
			/>
		</div>
	);
}
export type { BorderBeamProperties };
