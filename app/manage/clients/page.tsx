'use client';

import { EntityPage } from '@/components/Entity/EntityPage';
import { ClientForm } from './components/ClientForm';
import { useQuery } from '@apollo/client/react';
import { LIST_CLIENTS } from '@/graphql/queries/clients';
import { ListClientsResponse, Client } from '@/types/client';
import { useState, useEffect } from 'react';
import { clientColumns } from './columns';
import { DataTableColumn } from 'mantine-datatable';

export default function ClientsPage() {
	const { data, loading } = useQuery<ListClientsResponse>(LIST_CLIENTS, {
		fetchPolicy: 'cache-first', // cache data for faster navigation
	});

	const [clients, setClients] = useState<Client[]>([]);

	useEffect(() => {
		if (data?.clients?.data) {
			setClients(data.clients.data);
		}
	}, [data]);

	return (
		<EntityPage
			title='Clients'
			data={clients}
			columns={clientColumns as DataTableColumn<Client>[]}
			FormComponent={ClientForm}
			entityName='Client'
			loading={loading}
		/>
	);
}
