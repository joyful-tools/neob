import * as React from 'react';

import { Combobox, ComboboxContent, ComboboxGroup, ComboboxGroupLabel, ComboboxItem, ComboboxInput } from './combobox';

import type { Meta } from '@storybook/react-vite';

const meta = {
	title: 'Inputs/Combobox',
	component: Combobox,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Combobox>;

export default meta;

const ALL_LANGUAGES = [
	{ value: 'js', label: 'JavaScript' },
	{ value: 'ts', label: 'TypeScript' },
	{ value: 'py', label: 'Python' },
	{ value: 'rb', label: 'Ruby' },
	{ value: 'go', label: 'Go (Golang)' },
	{ value: 'rs', label: 'Rust' },
	{ value: 'java', label: 'Java' },
	{ value: 'cpp', label: 'C++' },
	{ value: 'swift', label: 'Swift' },
	{ value: 'kotlin', label: 'Kotlin' },
];

export const Default = {
	render: () => {
		const [searchValue, setSearchValue] = React.useState('');
		const [selectedValue, setSelectedValue] = React.useState('');

		const filteredLanguages = React.useMemo(() => {
			if (!searchValue) return ALL_LANGUAGES;
			return ALL_LANGUAGES.filter((lang) => lang.label.toLowerCase().includes(searchValue.toLowerCase()));
		}, [searchValue]);

		return (
			<div className="w-64">
				<Combobox value={selectedValue} onValueChange={setSelectedValue} open={searchValue.length > 0 || undefined}>
					<ComboboxInput placeholder="Search language..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
					<ComboboxContent>
						{filteredLanguages.length === 0 ? (
							<div className="px-3 py-2 text-sm font-medium text-muted-foreground">No results found.</div>
						) : (
							filteredLanguages.map((lang) => (
								<ComboboxItem key={lang.value} value={lang.value}>
									{lang.label}
								</ComboboxItem>
							))
						)}
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};

const FOOD_ITEMS = [
	{ value: 'apple', label: 'Apple', group: 'Fruits' },
	{ value: 'banana', label: 'Banana', group: 'Fruits' },
	{ value: 'carrot', label: 'Carrot', group: 'Vegetables' },
	{ value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
	{ value: 'steak', label: 'Steak', group: 'Proteins' },
	{ value: 'salmon', label: 'Salmon', group: 'Proteins' },
];

export const WithGroups = {
	render: () => {
		const [searchValue, setSearchValue] = React.useState('');
		const [selectedValue, setSelectedValue] = React.useState('');

		const filteredItems = React.useMemo(() => {
			if (!searchValue) return FOOD_ITEMS;
			return FOOD_ITEMS.filter((item) => item.label.toLowerCase().includes(searchValue.toLowerCase()));
		}, [searchValue]);

		const groupedItems = React.useMemo(() => {
			const groups: Record<string, typeof FOOD_ITEMS> = {};
			for (const item of filteredItems) {
				if (!groups[item.group]) {
					groups[item.group] = [];
				}
				groups[item.group].push(item);
			}
			return groups;
		}, [filteredItems]);

		return (
			<div className="w-64">
				<Combobox value={selectedValue} onValueChange={setSelectedValue}>
					<ComboboxInput placeholder="Search food item..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
					<ComboboxContent>
						{Object.keys(groupedItems).length === 0 ? (
							<div className="px-3 py-2 text-sm font-medium text-muted-foreground">No foods found.</div>
						) : (
							Object.entries(groupedItems).map(([groupName, groupList]) => (
								<ComboboxGroup key={groupName}>
									<ComboboxGroupLabel>{groupName}</ComboboxGroupLabel>
									{groupList.map((item) => (
										<ComboboxItem key={item.value} value={item.value}>
											{item.label}
										</ComboboxItem>
									))}
								</ComboboxGroup>
							))
						)}
					</ComboboxContent>
				</Combobox>
			</div>
		);
	},
};
