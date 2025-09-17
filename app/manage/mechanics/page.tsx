'use client';

import { EntityPage } from '@/components/Entity/EntityPage';

import { MechanicForm } from './components/MechanicForm';
import { mechanicColumns } from './columns';
import { LIST_MECHANICS } from '@/graphql/queries/mechanics';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { DataTableColumn } from 'mantine-datatable';
import { ListMechanicsResponse, Mechanic } from '@/types/mechanic';

export default function ClientsPage() {
	const { data, loading } = useQuery<ListMechanicsResponse>(LIST_MECHANICS, {
		fetchPolicy: 'cache-first',
	});
	const [mechanics, setMechanics] = useState<Mechanic[]>([]);

	useEffect(() => {
		if (data?.listMechanics?.data) {
			setMechanics(data.listMechanics.data);
		}
	}, [data]);
	return (
		<EntityPage
			title='Mechanics'
			data={mechanics}
			columns={mechanicColumns as DataTableColumn<Mechanic>[]}
			FormComponent={MechanicForm}
			entityName='Mechanic'
			loading={loading}
		/>
	);
}
