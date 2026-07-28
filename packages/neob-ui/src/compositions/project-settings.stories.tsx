import { BellIcon, CheckCircleIcon, FloppyDiskIcon, UsersThreeIcon } from '@phosphor-icons/react';
import { action } from 'storybook/actions';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputArea } from '@/components/ui/input-area';
import { Meter } from '@/components/ui/meter';
import { Pill } from '@/components/ui/pill';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs } from '@/components/ui/tabs';
import { guardPlay } from '@/lib/storybook-interactions';

import type { Meta, StoryObj } from '@storybook/react-vite';

function ProjectSettings() {
	return (
		<main className="min-h-dvh bg-muted/30 text-foreground">
			<div className="border-b-2 border-edge bg-cyan-light dark:bg-cyan-dark">
				<div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-5 px-5 py-7 sm:flex-row sm:items-end sm:px-8 lg:px-10">
					<div className="flex items-start gap-4">
						<div>
							<p className="mb-1 font-mono text-xs font-bold tracking-wider uppercase">Workspace settings</p>
							<h1 className="font-display text-3xl/tight sm:text-4xl/tight">Northstar Studio</h1>
							<p className="mt-2 max-w-xl text-sm/relaxed font-medium text-foreground/90">
								Manage your workspace identity, team access, and communication preferences.
							</p>
						</div>
					</div>
					<Button type="submit" form="workspace-profile" className="self-start sm:self-auto">
						<FloppyDiskIcon aria-hidden="true" className="size-4" weight="bold" />
						Save changes
					</Button>
				</div>
			</div>

			<div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
				<Tabs defaultValue="general">
					<div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
						<Tabs.List variant="segmented" aria-label="Workspace settings sections">
							<Tabs.Trigger value="general">General</Tabs.Trigger>
							<Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
							<Tabs.Trigger value="team">Team</Tabs.Trigger>
						</Tabs.List>
						<Pill color="green" size="md">
							<CheckCircleIcon aria-hidden="true" className="size-3.5" weight="fill" />
							Workspace healthy
						</Pill>
					</div>

					<Tabs.Content value="general">
						<div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(17rem,0.8fr)]">
							<Card className="shadow-cel-sm">
								<Card.Header>
									<Card.Title>Workspace profile</Card.Title>
									<p className="text-sm/relaxed text-muted-foreground">The public details teammates use to recognize this workspace.</p>
								</Card.Header>
								<Card.Content>
									<form
										id="workspace-profile"
										className="flex flex-col gap-6"
										onSubmit={(event) => {
											event.preventDefault();
											action('workspace-settings-save')();
										}}
									>
										<Input label="Workspace name" name="workspaceName" defaultValue="Northstar Studio" required />
										<Select label="Default visibility" name="visibility" defaultValue="team" containerClassName="max-w-64">
											<Select.Option value="team">Team only</Select.Option>
											<Select.Option value="organization">Entire organization</Select.Option>
											<Select.Option value="public">Public</Select.Option>
										</Select>
										<InputArea
											label="Description"
											name="description"
											description="Keep it short and useful for new collaborators."
											defaultValue="A collaborative space for product design, research, and launch planning."
											autoResize={{ maxRows: 6 }}
											rows={2}
										/>
									</form>
								</Card.Content>
							</Card>

							<div className="flex flex-col gap-6">
								<Card>
									<Card.Header>
										<Card.Title className="flex items-center gap-2 text-lg">
											<BellIcon aria-hidden="true" className="size-5" weight="bold" />
											Quick preferences
										</Card.Title>
									</Card.Header>
									<Card.Content className="space-y-5">
										<div>
											<Switch
												label="Weekly digest"
												description="A Monday summary of workspace activity."
												defaultChecked
												controlFirst={true}
											/>
										</div>
										<div>
											<Switch
												label="Activity status"
												description="Show teammates when you are active."
												variant="success"
												controlFirst={true}
											/>
										</div>
									</Card.Content>
								</Card>

								<Card>
									<Card.Header>
										<div className="flex items-center justify-between gap-3">
											<Card.Title className="text-lg">Plan usage</Card.Title>
											<Pill>Studio</Pill>
										</div>
									</Card.Header>
									<Card.Content>
										<div className="mb-2 flex items-end justify-between gap-3">
											<span className="text-sm text-muted-foreground">Members</span>
											<span className="font-mono text-sm font-bold">12 / 20</span>
										</div>
										<Meter value={12} max={20} aria-label="12 of 20 member seats used" />
									</Card.Content>
								</Card>
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="notifications">
						<Card className="shadow-cel-sm">
							<Card.Header>
								<Card.Title className="flex items-center gap-2">
									<BellIcon aria-hidden="true" className="size-6" weight="bold" />
									Notification channels
								</Card.Title>
								<p className="text-sm text-foreground/70">Choose which workspace events should reach you.</p>
							</Card.Header>
							<Card.Content className="grid gap-6 md:grid-cols-2">
								<Switch label="Product updates" description="New releases, improvements, and scheduled maintenance." defaultChecked />
								<Switch label="Mentions and replies" description="Messages that need your attention." defaultChecked variant="accent" />
							</Card.Content>
						</Card>
					</Tabs.Content>

					<Tabs.Content value="team">
						<Card className="shadow-cel-sm">
							<Card.Header>
								<Card.Title className="flex items-center gap-2">
									<UsersThreeIcon aria-hidden="true" className="size-6" weight="bold" />
									Team access
								</Card.Title>
								<p className="text-sm text-foreground/70">Northstar Studio currently has 12 active members.</p>
							</Card.Header>
							<Card.Content>
								<div className="flex flex-col justify-between gap-4 rounded-xl border-2 border-edge bg-muted/30 p-5 sm:flex-row sm:items-center">
									<div>
										<p className="font-bold">Invite collaborators</p>
										<p className="mt-1 text-sm text-muted-foreground">New members join with viewer access by default.</p>
									</div>
									<Button variant="subtle">Manage members</Button>
								</div>
							</Card.Content>
						</Card>
					</Tabs.Content>
				</Tabs>
			</div>
		</main>
	);
}
ProjectSettings.displayName = 'ProjectSettings';

const meta = {
	title: 'Compositions/Project Settings',
	component: ProjectSettings,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof ProjectSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: guardPlay(async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const nameInput = canvas.getByRole('textbox', { name: /workspace name/i });
		await userEvent.clear(nameInput);
		await userEvent.type(nameInput, 'Northstar Labs');
		await expect(nameInput).toHaveValue('Northstar Labs');

		await userEvent.click(canvas.getByRole('tab', { name: 'Notifications' }));
		await expect(canvas.getByText('Notification channels')).toBeInTheDocument();
	}),
};
