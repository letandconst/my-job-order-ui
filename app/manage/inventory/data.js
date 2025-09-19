export const inventoryUnits = [
	{
		group: 'By Count',
		units: [
			{ accessor: 'pcs', name: 'Pieces' },
			{ accessor: 'unit', name: 'Unit' },
			{ accessor: 'set', name: 'Set' },
			{ accessor: 'kit', name: 'Kit' },
			{ accessor: 'pair', name: 'Pair' },
		],
	},
	{
		group: 'By Volume',
		units: [
			{ accessor: 'L', name: 'Liters' },
			{ accessor: 'gal', name: 'Gallons' },
			{ accessor: 'oz', name: 'Fluid Ounce' },
			{ accessor: 'bottle', name: 'Bottle' },
			{ accessor: 'can', name: 'Can' },
		],
	},
	{
		group: 'By Length',
		units: [
			{ accessor: 'm', name: 'Meters' },
			{ accessor: 'ft', name: 'Feet' },
			{ accessor: 'roll', name: 'Roll' },
		],
	},
	{
		group: 'By Weight',
		units: [
			{ accessor: 'kg', name: 'Kilograms' },
			{ accessor: 'g', name: 'Grams' },
			{ accessor: 'lb', name: 'Pounds' },
		],
	},
];

export const partCategories = [
	{
		group: 'Engine & Drivetrain',
		categories: ['Filters', 'Fluids', 'Belts & Hoses', 'Ignition System', 'Sensors'],
	},
	{
		group: 'Brakes & Suspension',
		categories: ['Brakes', 'Suspension', 'Steering'],
	},
	{
		group: 'Electrical & Lighting',
		categories: ['Batteries & Charging', 'Lighting', 'Fuses & Relays'],
	},
	{
		group: 'Body & Exterior',
		categories: ['Body Panels', 'Glass', 'Paint Supplies', 'Exterior Trim'],
	},
	{
		group: 'Accessories & Interior',
		categories: ['Interior Trim', 'Accessories', 'Audio & Electronics', 'Steering Wheels & Shift Knobs'],
	},
];
