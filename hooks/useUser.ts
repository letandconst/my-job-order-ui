// hooks/useUser.ts
'use client';
import { useQuery } from '@apollo/client/react';
import { GET_CURRENT_USER } from '@/graphql/queries/users';
import { useAuthStore, User } from '@/store/authStore';
import { useEffect } from 'react';

interface MeQuery {
	me: User | null;
}

export function useUser() {
	const { user, setUser, loading, setLoading } = useAuthStore();
	const {
		data,
		loading: gqlLoading,
		refetch,
	} = useQuery<MeQuery>(GET_CURRENT_USER, {
		fetchPolicy: 'cache-first',
	});

	useEffect(() => {
		if (!gqlLoading) {
			if (data) {
				setUser(data.me);
			}
			setLoading(false);
		}
	}, [data, gqlLoading, setUser, setLoading]);

	return { user, loading, refetchUser: refetch };
}
