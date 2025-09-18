'use client';

import { EntityPage } from '@/components/Entity/EntityPage';
import { ServiceTypeForm } from './components/ServiceForm';
import { serviceTypeColumns } from './columns';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { DataTableColumn } from 'mantine-datatable';

import { LIST_SERVICES } from '@/graphql/queries/serviceTypes';
import { ServiceType, ServiceTypeResponse } from '@/types/serviceType';

export default function MechanicsPage() {
	const { data, loading } = useQuery<ServiceTypeResponse>(LIST_SERVICES, {
		fetchPolicy: 'cache-first',
	});
	const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

	useEffect(() => {
		if (data?.services?.data) {
			setServiceTypes(data.services.data);
		}
	}, [data]);
	return (
		<>
			<EntityPage
				title='Services'
				data={serviceTypes}
				columns={serviceTypeColumns as DataTableColumn<ServiceType>[]}
				FormComponent={ServiceTypeForm}
				entityName='Service'
				loading={loading}
			/>
		</>
	);
}
