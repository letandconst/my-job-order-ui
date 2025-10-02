import { create } from 'zustand';

export interface User {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	avatar: string | null;
}

interface AuthState {
	user: User | null;
	loading: boolean;
	setUser: (user: User | null) => void;
	setLoading: (loading: boolean) => void;
	clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	loading: true,
	setUser: (user) => set({ user }),
	setLoading: (loading) => set({ loading }),
	clear: () => set({ user: null, loading: false }),
}));
