'use client';

import { EntityPage } from '@/components/Entity/EntityPage';
import { partsColumns } from './columns';
import { InventoryForm } from './components/InventoryForm';
import { GET_PARTS } from '@/graphql/queries/parts';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { DataTableColumn } from 'mantine-datatable';
import { ListPartsResponse, Part } from '@/types/part';

export default function MechanicsPage() {
	const { data, loading } = useQuery<ListPartsResponse>(GET_PARTS, {
		fetchPolicy: 'cache-first',
	});

	const [parts, setParts] = useState<Part[]>([]);

	useEffect(() => {
		if (data?.parts?.data) {
			setParts(data.parts.data);
		}
	}, [data]);
	return (
		<EntityPage
			title='Inventory'
			data={parts}
			columns={partsColumns as DataTableColumn<Part>[]}
			FormComponent={InventoryForm}
			entityName='Part'
			loading={loading}
		/>
	);
}
