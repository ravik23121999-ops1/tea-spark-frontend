'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    Plus,
    Edit2,
    Trash2,
    Search
} from 'lucide-react';
import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} from '@/redux/apiSlice';
import ConfirmationModal from '@/components/Common/ConfirmationModal';

interface CategoryManagementProps {
    canDelete?: boolean;
    canAdd?: boolean;
    canEdit?: boolean;
}

export default function CategoryManagement({
    canDelete = true,
    canAdd = true,
    canEdit = true
}: CategoryManagementProps) {
    const { data: categories, refetch: refetchCategories } = useGetCategoriesQuery();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'danger' | 'warning' | 'info';
        onConfirm: () => void;
        confirmText?: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: () => { }
    });

    const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

    const openCreateModal = () => {
        setModalMode('create');
        setCategoryForm({ name: '', description: '' });
    };

    const openEditModal = (item: any) => {
        setModalMode('edit');
        setSelectedItem(item);
        setCategoryForm({ name: item.name, description: item.description });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') await createCategory(categoryForm).unwrap();
            else await updateCategory({ id: selectedItem._id, ...categoryForm }).unwrap();
            refetchCategories();
            setModalMode(null);
            setConfirmConfig({
                isOpen: true,
                title: 'Success!',
                message: `Category ${modalMode === 'create' ? 'created' : 'updated'} successfully.`,
                type: 'success',
                confirmText: 'Great',
                onConfirm: closeConfirm
            });
        } catch (err) {
            console.error('Category submission failed:', err);
        }
    };

    const handleDelete = (id: string, name: string) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Delete Category?',
            message: `Are you sure you want to delete "${name}"?`,
            type: 'danger',
            confirmText: 'Delete',
            onConfirm: async () => {
                try {
                    await deleteCategory(id).unwrap();
                    refetchCategories();
                    closeConfirm();
                } catch (err) {
                    console.error('Category deletion failed:', err);
                }
            }
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white mb-2 font-display">Collections</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage categories and collections.</p>
                </div>
                {canAdd && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus size={20} />
                        Create Collection
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <Layers size={20} className="text-secondary" />
                        Active Categories
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-8 py-4">Title</th>
                                <th className="px-8 py-4 hidden md:table-cell">Description</th>
                                <th className="px-8 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {categories?.map((cat: any) => (
                                <tr key={cat._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-6 font-bold dark:text-white">{cat.name}</td>
                                    <td className="px-8 py-6 text-slate-500 dark:text-slate-400 text-sm max-w-sm line-clamp-2 hidden md:table-cell">{cat.description}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            {canEdit && (
                                                <button onClick={() => openEditModal(cat)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-secondary transition-all">
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {modalMode && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalMode(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <form onSubmit={handleSubmit}>
                                <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                                    <h3 className="text-2xl font-bold dark:text-white">{modalMode === 'create' ? 'Define' : 'Refine'} Collection</h3>
                                </div>
                                <div className="p-8 space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 px-1">Display Name</label>
                                        <input required type="text" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-secondary/30 dark:text-white" placeholder="e.g. Breads" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 px-1">Description</label>
                                        <textarea value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-secondary/30 h-32 resize-none dark:text-white" placeholder="Description..." />
                                    </div>
                                </div>
                                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
                                    <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-4 font-bold text-slate-500 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 font-bold text-white bg-secondary rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Submit</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={confirmConfig.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
                isLoading={isDeleting || isCreating || isUpdating}
            />
        </div>
    );
}
