import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    adminToken: string | null;
    email: string | null;
    role: string | null;
    responsibilities: string[] | null;
}

const initialState: AuthState = {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    adminToken: typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null,
    email: null,
    role: null,
    responsibilities: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('responsibilities') || 'null') : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setStaffCredentials: (state, action: PayloadAction<{ token: string; email: string; role: string; responsibilities: any[] }>) => {
            state.token = action.payload.token;
            state.email = action.payload.email;
            state.role = action.payload.role;
            // Store only the keys for easier access in UI
            const respKeys = action.payload.responsibilities.map(r => r.key || r);
            state.responsibilities = respKeys;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('responsibilities', JSON.stringify(respKeys));
        },
        setAdminCredentials: (state, action: PayloadAction<{ token: string; email: string; role: string }>) => {
            state.adminToken = action.payload.token;
            state.email = action.payload.email;
            state.role = action.payload.role;
            localStorage.setItem('adminToken', action.payload.token);
        },
        logout: (state) => {
            state.token = null;
            state.adminToken = null;
            state.email = null;
            state.role = null;
            state.responsibilities = null;
            localStorage.removeItem('token');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('responsibilities');
        },
    },
});

export const { setStaffCredentials, setAdminCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
