import { ArrowClockwise, CurrencyDollar, Minus, Plus, TrendDown, TrendUp } from '@phosphor-icons/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { AnimatedNumber, NumberFlowGroup, RollingDigit } from './animated-number';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * AnimatedNumber and RollingDigit deliver smooth, layout-aware rolling digit transitions using Number Flow.
 * Features synchronized horizontal transitions, subtle container resizes, and continuous reel animations.
 */
const meta = {
	title: 'Experiments/AnimatedNumber',
	component: RollingDigit,
	args: {
		value: 1284,
	},
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof RollingDigit>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic interactive rolling digit counter with subtle container resize transitions.
 */
export const InteractiveCounter: Story = {
	render: () => {
		const [value, setValue] = useState(1284);

		return (
			<Card className="flex min-w-85 flex-col items-center gap-6 border-3 border-edge bg-card p-6 text-card-foreground shadow-cel transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
				<div className="flex flex-col items-center gap-1">
					<span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">Live Counter</span>
					<div className="overflow-hidden rounded-xl border-3 border-edge bg-muted px-6 py-4 shadow-cel-inset-md transition-[width,height,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-zinc">
						<RollingDigit value={value} className="text-5xl font-extrabold text-foreground" />
					</div>
				</div>

				<div className="flex flex-wrap justify-center gap-2">
					<Button variant="subtle" size="sm" onClick={() => setValue((previous) => previous - 100)} className="font-mono">
						-100
					</Button>
					<Button
						variant="subtle"
						size="sm"
						onClick={() => setValue((previous) => previous - 10)}
						className="flex items-center gap-1 font-mono"
					>
						<Minus className="size-3.5" /> 10
					</Button>
					<Button
						variant="subtle"
						size="sm"
						onClick={() => setValue((previous) => previous - 1)}
						className="flex items-center gap-1 font-mono"
					>
						<Minus className="size-3.5" /> 1
					</Button>
					<Button variant="subtle" size="sm" onClick={() => setValue(0)} className="flex items-center gap-1 font-mono">
						<ArrowClockwise className="size-3.5" /> Reset
					</Button>
					<Button color="gold" size="sm" onClick={() => setValue((previous) => previous + 1)} className="flex items-center gap-1 font-mono">
						<Plus className="size-3.5" /> 1
					</Button>
					<Button
						color="gold"
						size="sm"
						onClick={() => setValue((previous) => previous + 10)}
						className="flex items-center gap-1 font-mono"
					>
						<Plus className="size-3.5" /> 10
					</Button>
					<Button color="gold" size="sm" onClick={() => setValue((previous) => previous + 100)} className="font-mono">
						+100
					</Button>
				</div>
			</Card>
		);
	},
};

/**
 * Continuous rolling odometer reel with slot-machine spin transitions.
 */
export const ContinuousOdometerReel: Story = {
	render: () => {
		const [odometerValue, setOdometerValue] = useState(99_945);

		const triggerRandomSpin = () => {
			const delta = Math.floor(Math.random() * 400) + 50;
			setOdometerValue((previous) => previous + delta);
		};

		return (
			<Card className="flex min-w-95 flex-col items-center gap-6 border-4 border-edge bg-gold p-8 text-edge shadow-cel-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
				<div className="flex flex-col items-center gap-2">
					<div className="rounded-md border-2 border-edge bg-edge px-3 py-1 font-mono text-xs font-black text-gold uppercase">
						High-Speed Odometer
					</div>
					<div className="overflow-hidden rounded-2xl border-4 border-edge bg-card px-8 py-5 shadow-cel transition-[width,height,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-zinc">
						<RollingDigit value={odometerValue} continuous className="text-6xl font-black tracking-widest text-foreground" />
					</div>
				</div>

				<div className="flex gap-3">
					<Button
						color="gold"
						onClick={triggerRandomSpin}
						className="border-2 border-edge bg-cyan font-mono text-sm font-bold text-edge hover:bg-cyan-light"
					>
						Spin Odometer (+50 to +450)
					</Button>
				</div>
			</Card>
		);
	},
};

/**
 * Currency & financial market ticker with dynamic trend indicator arrow & color badge.
 */
export const FinancialMarketTicker: Story = {
	render: () => {
		const [price, setPrice] = useState(42_850.5);
		const [previousPrice, setPreviousPrice] = useState(42_000);

		const simulateTrade = (trendDirection: 'up' | 'down') => {
			setPreviousPrice(price);
			const changePercent = (Math.random() * 0.05 + 0.01) * (trendDirection === 'up' ? 1 : -1);
			setPrice((previous) => Number((previous * (1 + changePercent)).toFixed(2)));
		};

		const isPositive = price >= previousPrice;
		const diff = Number((price - previousPrice).toFixed(2));

		return (
			<Card className="flex w-95 flex-col gap-5 border-3 border-edge bg-card p-6 text-card-foreground shadow-cel transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="flex size-9 items-center justify-center rounded-lg border-2 border-edge bg-cyan font-bold text-edge shadow-cel-sm">
							<CurrencyDollar className="size-5" />
						</div>
						<div>
							<h4 className="font-display text-base font-extrabold tracking-tight text-foreground">BTC / USD</h4>
							<p className="font-mono text-xs text-muted-foreground">Crypto Index Ticker</p>
						</div>
					</div>

					<div
						className={`flex items-center gap-1 rounded-full border-2 border-edge px-2.5 py-1 font-mono text-xs font-bold shadow-cel-sm transition-all duration-300 ${
							isPositive ? 'bg-green text-edge' : 'bg-coral text-edge'
						}`}
					>
						{isPositive ? <TrendUp className="size-3.5" /> : <TrendDown className="size-3.5" />}
						<span>{isPositive ? `+${diff}` : `${diff}`}</span>
					</div>
				</div>

				<div className="overflow-hidden rounded-xl border-3 border-edge bg-muted px-5 py-4 shadow-cel-inset-md transition-[width,height,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-zinc">
					<RollingDigit
						value={price}
						format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 2 }}
						trend={isPositive ? 1 : -1}
						className="text-4xl font-extrabold text-foreground"
					/>
				</div>

				<div className="flex gap-2">
					<Button
						variant="danger"
						size="sm"
						onClick={() => simulateTrade('down')}
						className="flex-1 border-2 border-edge font-mono text-xs text-edge"
					>
						Simulate Dip
					</Button>
					<Button
						color="gold"
						size="sm"
						onClick={() => simulateTrade('up')}
						className="flex-1 border-2 border-edge bg-green font-mono text-xs text-edge hover:bg-green-light"
					>
						Simulate Rally
					</Button>
				</div>
			</Card>
		);
	},
};

/**
 * Synchronized multi-metric KPI Dashboard panel using NumberFlowGroup.
 */
export const AnalyticsDashboardGrid: Story = {
	render: () => {
		const [metrics, setMetrics] = useState({
			revenue: 124_500,
			activeUsers: 8420,
			conversionRate: 0.142,
		});

		const refreshAllMetrics = () => {
			setMetrics({
				revenue: Math.floor(124_500 + (Math.random() - 0.4) * 15_000),
				activeUsers: Math.floor(8420 + (Math.random() - 0.4) * 800),
				conversionRate: Number((0.142 + (Math.random() - 0.4) * 0.03).toFixed(3)),
			});
		};

		return (
			<NumberFlowGroup>
				<Card className="flex w-120 flex-col gap-6 border-3 border-edge bg-card p-6 text-card-foreground shadow-cel-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
					<div className="flex items-center justify-between border-b-2 border-edge pb-4">
						<div>
							<h3 className="font-display text-lg font-black tracking-tight text-foreground">Live Performance Analytics</h3>
							<p className="font-mono text-xs text-muted-foreground">Real-time synchronized metrics</p>
						</div>
						<Button variant="subtle" size="sm" onClick={refreshAllMetrics} className="flex items-center gap-1.5 font-mono text-xs">
							<ArrowClockwise className="size-3.5" /> Refresh
						</Button>
					</div>

					<div className="grid grid-cols-3 gap-3">
						<div className="flex flex-col gap-1 overflow-hidden rounded-xl border-2 border-edge bg-cyan-light/30 p-3 shadow-cel-sm transition-[width,height,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-zinc">
							<span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Revenue</span>
							<RollingDigit
								value={metrics.revenue}
								format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
								className="text-lg font-extrabold text-foreground"
							/>
						</div>

						<div className="flex flex-col gap-1 overflow-hidden rounded-xl border-2 border-edge bg-gold-light/30 p-3 shadow-cel-sm transition-[width,height,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-zinc">
							<span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Active Users</span>
							<RollingDigit
								value={metrics.activeUsers}
								format={{ notation: 'standard' }}
								className="text-lg font-extrabold text-foreground"
							/>
						</div>

						<div className="flex flex-col gap-1 overflow-hidden rounded-xl border-2 border-edge bg-purple-light/30 p-3 shadow-cel-sm transition-[width,height,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-zinc">
							<span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">Conversion</span>
							<RollingDigit
								value={metrics.conversionRate}
								format={{ style: 'percent', minimumFractionDigits: 1 }}
								className="text-lg font-extrabold text-foreground"
							/>
						</div>
					</div>
				</Card>
			</NumberFlowGroup>
		);
	},
};

/**
 * AnimatedNumber component demonstrating backward-compatible tween mode alongside rolling digit mode.
 */
export const AnimatedNumberModes: Story = {
	render: () => {
		const [value, setValue] = useState(42);

		return (
			<Card className="flex min-w-85 flex-col items-center gap-6 border-3 border-edge bg-card p-6 text-card-foreground shadow-cel transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
				<div className="grid w-full grid-cols-2 gap-4">
					<div className="flex flex-col items-center gap-2 overflow-hidden rounded-xl border-2 border-edge bg-muted p-4 shadow-cel-inset-md transition-[width,height,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-zinc">
						<span className="font-mono text-xs font-bold text-muted-foreground">Rolling Mode</span>
						<AnimatedNumber mode="rolling" value={value} className="text-4xl font-extrabold text-cyan" />
					</div>
					<div className="flex flex-col items-center gap-2 overflow-hidden rounded-xl border-2 border-edge bg-muted p-4 shadow-cel-inset-md transition-[width,height,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:bg-zinc">
						<span className="font-mono text-xs font-bold text-muted-foreground">Tween Mode</span>
						<AnimatedNumber mode="tween" value={value} className="text-4xl font-extrabold text-gold-dark dark:text-gold" />
					</div>
				</div>

				<Button color="gold" onClick={() => setValue(Math.floor(Math.random() * 900) + 100)} className="font-mono text-xs">
					Randomize (100 - 999)
				</Button>
			</Card>
		);
	},
};
