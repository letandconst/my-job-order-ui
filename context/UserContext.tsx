'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_CURRENT_USER } from '@/graphql/queries/users';

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	avatar?: string | null;
}

interface MeQuery {
	me: {
		data: { user: User } | null;
		message: string;
		statusCode: number;
	};
}

interface UserContextType {
	user: User | null;
	loading: boolean;
	refetchUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const { data, loading, refetch } = useQuery<MeQuery>(GET_CURRENT_USER, {
		fetchPolicy: 'network-only',
	});

	const user = data?.me?.data?.user ?? null;

	return <UserContext.Provider value={{ user, loading, refetchUser: refetch }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) throw new Error('useUser must be used within a UserProvider');
	return context;
};
