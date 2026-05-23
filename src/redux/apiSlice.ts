import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api',
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState;
            const token = state.auth.token || state.auth.adminToken;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Product', 'Category', 'User', 'Order'],
    endpoints: (builder) => ({
        // Product Endpoints
        getProducts: builder.query<any[], void>({
            query: () => '/products',
            transformResponse: (response: any) => response.data,
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }: any) => ({ type: 'Product' as const, id: _id })), { type: 'Product', id: 'LIST' }]
                    : [{ type: 'Product', id: 'LIST' }],
        }),
        getCategories: builder.query<any[], void>({
            query: () => '/categories/get',
            transformResponse: (response: any) => response.data,
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }: any) => ({ type: 'Category' as const, id: _id })), { type: 'Category', id: 'LIST' }]
                    : [{ type: 'Category', id: 'LIST' }],
        }),

        // Auth Endpoints
        login: builder.mutation({
            query: (credentials) => ({
                url: '/staff/login',
                method: 'POST',
                body: credentials,
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['User'],
        }),
        signup: builder.mutation({
            query: (userData) => ({
                url: '/staff/register',
                method: 'POST',
                body: userData,
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['User'],
        }),
        adminLogin: builder.mutation({
            query: (credentials) => ({
                url: '/admin/login',
                method: 'POST',
                body: credentials,
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['User'],
        }),

        // Staff Management
        getPendingStaff: builder.query<any, { page?: number; limit?: number } | void>({
            query: (params) => ({
                url: '/admin/pending-staff',
                params: params || { page: 1, limit: 5 },
            }),
            transformResponse: (response: any) => response.data,
            providesTags: (result) =>
                result?.list
                    ? [...result.list.map(({ _id }: any) => ({ type: 'User' as const, id: _id })), { type: 'User', id: 'LIST' }]
                    : [{ type: 'User', id: 'LIST' }],
        }),
        getApprovedStaff: builder.query<any, { page?: number; limit?: number } | void>({
            query: (params) => ({
                url: '/admin/approved-staff',
                params: params || { page: 1, limit: 5 },
            }),
            transformResponse: (response: any) => response.data,
            providesTags: (result) =>
                result?.list
                    ? [...result.list.map(({ _id }: any) => ({ type: 'User' as const, id: _id })), { type: 'User', id: 'LIST' }]
                    : [{ type: 'User', id: 'LIST' }],
        }),
        approveStaff: builder.mutation({
            query: ({ id, status }) => ({
                url: `/admin/update-staff-status/${id}/approve`,
                method: 'PATCH',
                body: { status },
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['User'],
        }),
        getResponsibilities: builder.query<any[], void>({
            query: () => '/admin/get-responsibilities',
            transformResponse: (response: any) => response.data,
        }),
        assignResponsibilities: builder.mutation({
            query: ({ id, responsibilityIds }) => ({
                url: `/admin/staff-responsibilities/${id}/assign`,
                method: 'PATCH',
                body: { responsibilityIds },
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['User'],
        }),
        removeResponsibility: builder.mutation({
            query: ({ id, respId }) => ({
                url: `/admin/staff/${id}/responsibility/${respId}/remove`,
                method: 'PATCH',
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['User'],
        }),

        // Product CRUD
        createProduct: builder.mutation({
            query: (formData) => ({
                url: '/products',
                method: 'POST',
                body: formData,
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body: formData,
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['Product'],
        }),

        // Category CRUD
        createCategory: builder.mutation({
            query: (data) => ({
                url: '/categories/create',
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/categories/update-category/${id}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/delete/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['Category'],
        }),
        getStaffProfile: builder.query<any, void>({
            query: () => '/staff/profile',
            transformResponse: (response: any) => response.data,
            providesTags: ['User'],
        }),
        updateStaffProfile: builder.mutation({
            query: (data) => ({
                url: '/staff/profile',
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: any) => response.data,
            invalidatesTags: ['User'],
        }),

        // Orders (admin)
        getOrders: builder.query<
            { list: any[]; pagination: { totalItems: number; totalPages: number; currentPage: number; itemsPerPage: number } },
            { page?: number; limit?: number }
        >({
            query: (params = { page: 1, limit: 10 }) => ({
                url: '/orders',
                params: { page: params.page ?? 1, limit: params.limit ?? 10 },
            }),
            transformResponse: (response: any) => response.data,
            providesTags: (result) =>
                result?.list
                    ? [...result.list.map(({ _id }: any) => ({ type: 'Order' as const, id: _id })), { type: 'Order', id: 'LIST' }]
                    : [{ type: 'Order', id: 'LIST' }],
        }),
        deleteOrder: builder.mutation<{ message?: string }, string>({
            query: (id) => ({
                url: `/orders/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: any) => ({ message: response.message }),
            invalidatesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, orderStatus }) => ({
                url: `/orders/${id}/status`,
                method: 'PATCH',
                body: { orderStatus },
            }),
            transformResponse: (response: any) => ({
                order: response.data?.order ?? response.data,
                message: response.message,
                emailNotification: response.data?.emailNotification,
            }),
            invalidatesTags: ['Order'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetCategoriesQuery,
    useLoginMutation,
    useSignupMutation,
    useAdminLoginMutation,
    useGetPendingStaffQuery,
    useGetApprovedStaffQuery,
    useApproveStaffMutation,
    useGetResponsibilitiesQuery,
    useAssignResponsibilitiesMutation,
    useRemoveResponsibilityMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetStaffProfileQuery,
    useUpdateStaffProfileMutation,
    useGetOrdersQuery,
    useUpdateOrderStatusMutation,
    useDeleteOrderMutation,
} = apiSlice;
