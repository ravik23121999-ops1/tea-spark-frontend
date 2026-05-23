'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Plus,
    Edit2,
    Trash2,
    Search,
    ImageIcon,
    Upload,
    X
} from 'lucide-react';
import {
    useGetProductsQuery,
    useGetCategoriesQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} from '@/redux/apiSlice';
import ConfirmationModal from '@/components/Common/ConfirmationModal';

interface ProductManagementProps {
    canDelete?: boolean;
    canAdd?: boolean;
    canEdit?: boolean;
}

export default function ProductManagement({
    canDelete = true,
    canAdd = true,
    canEdit = true
}: ProductManagementProps) {
    const { data: products, refetch: refetchProducts } = useGetProductsQuery();
    const { data: categories } = useGetCategoriesQuery();

    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [productForm, setProductForm] = useState({
        name: '',
        price: 0,
        category: '',
        description: '',
        availability: true,
        files: [] as File[],
        previews: [] as string[],
        existingImages: [] as string[]
    });

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
        setProductForm({
            name: '',
            price: 0,
            category: categories?.[0]?._id || '',
            description: '',
            availability: true,
            files: [],
            previews: [],
            existingImages: []
        });
    };

    const openEditModal = (item: any) => {
        setModalMode('edit');
        setSelectedItem(item);
        setProductForm({
            name: item.name,
            price: item.price,
            category: item.category?._id || item.category,
            description: item.description,
            availability: item.availability,
            files: [],
            previews: [],
            existingImages: item.images || []
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setProductForm(prev => ({
                ...prev,
                files: [...prev.files, ...newFiles],
                previews: [...prev.previews, ...newPreviews]
            }));
        }
    };

    const removeFile = (index: number) => {
        setProductForm(prev => {
            const newFiles = [...prev.files];
            const newPreviews = [...prev.previews];
            URL.revokeObjectURL(newPreviews[index]);
            newFiles.splice(index, 1);
            newPreviews.splice(index, 1);
            return { ...prev, files: newFiles, previews: newPreviews };
        });
    };

    const removeExistingImage = (index: number) => {
        setProductForm(prev => ({
            ...prev,
            existingImages: prev.existingImages.filter((_, i) => i !== index)
        }));
    };

    const handleDelete = (id: string) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Delete Treat?',
            message: 'Are you sure you want to remove this treat? This action cannot be undone.',
            type: 'danger',
            confirmText: 'Delete',
            onConfirm: async () => {
                try {
                    await deleteProduct(id).unwrap();
                    refetchProducts();
                    closeConfirm();
                } catch (err) {
                    console.error('Deletion failed:', err);
                }
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('price', productForm.price.toString());
        formData.append('category', productForm.category);
        formData.append('description', productForm.description);
        formData.append('availability', productForm.availability.toString());
        productForm.existingImages.forEach(img => formData.append('existingImages', img));
        productForm.files.forEach(file => formData.append('images', file));

        try {
            if (modalMode === 'create') await createProduct(formData).unwrap();
            else await updateProduct({ id: selectedItem._id, formData }).unwrap();
            refetchProducts();
            setModalMode(null);
            setConfirmConfig({
                isOpen: true,
                title: 'Success!',
                message: `Treat ${modalMode === 'create' ? 'added' : 'updated'} successfully.`,
                type: 'success',
                confirmText: 'Great',
                onConfirm: closeConfirm
            });
        } catch (err) {
            console.error('Submission failed:', err);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white mb-2 font-display">Treats Catalog</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your bakery items and availability.</p>
                </div>
                {canAdd && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus size={20} />
                        Add Treat
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <Package size={20} className="text-secondary" />
                        In-Stock items
                    </h3>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search catalogue..."
                            className="pl-9 pr-4 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-lg outline-none focus:ring-1 focus:ring-secondary/50 dark:text-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-8 py-4">Product</th>
                                <th className="px-8 py-4 hidden sm:table-cell">Category</th>
                                <th className="px-8 py-4">Price</th>
                                <th className="px-8 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {products?.map((product: any) => (
                                <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} className="object-cover w-full h-full" alt="" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={18} /></div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold dark:text-white">{product.name}</span>
                                                <span className={`text-[10px] font-bold ${product.availability ? 'text-green-500' : 'text-red-400'}`}>
                                                    {product.availability ? 'IN STOCK' : 'OUT OF STOCK'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 hidden sm:table-cell">
                                        <span className="px-2.5 py-0.5 bg-secondary/5 text-secondary text-[10px] font-bold uppercase tracking-wider rounded-lg border border-secondary/10">
                                            {product.category?.name || 'Treat'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 font-bold dark:text-white">${product.price.toFixed(2)}</td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            {canEdit && (
                                                <button onClick={() => openEditModal(product)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-secondary transition-all">
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button onClick={() => handleDelete(product._id)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all">
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
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <form onSubmit={handleSubmit}>
                                <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                                    <h3 className="text-2xl font-bold dark:text-white">{modalMode === 'create' ? 'Add New' : 'Edit'} Treat</h3>
                                </div>

                                <div className="p-8 space-y-5 max-h-[60vh] overflow-y-auto scrollbar-hide">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-500 px-1">Product Name</label>
                                            <input required type="text" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-secondary/30 dark:text-white" placeholder="e.g. Garlic Baguette" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-500 px-1">Price ($)</label>
                                            <input required type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-secondary/30 dark:text-white" placeholder="0.00" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 px-1">Category</label>
                                        <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-secondary/30 appearance-none dark:text-white">
                                            {categories?.map((cat: any) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 px-1">Product Images</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {productForm.existingImages.map((img, idx) => (
                                                <div key={`exist-${idx}`} className="relative group aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                                                </div>
                                            ))}
                                            {productForm.previews.map((preview, idx) => (
                                                <div key={`new-${idx}`} className="relative group aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-secondary/20">
                                                    <img src={preview} className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => removeFile(idx)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                                                </div>
                                            ))}
                                            {(productForm.existingImages.length + productForm.files.length) < 5 && (
                                                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all text-slate-400 hover:text-secondary">
                                                    <Upload size={20} />
                                                    <span className="text-[10px] font-bold">UPLOAD</span>
                                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 px-1">Description</label>
                                        <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-secondary/30 h-24 resize-none dark:text-white" placeholder="Description..." />
                                    </div>
                                    <div className="flex items-center gap-2 px-1">
                                        <input type="checkbox" checked={productForm.availability} onChange={e => setProductForm({ ...productForm, availability: e.target.checked })} className="w-5 h-5 accent-secondary" />
                                        <label className="text-sm font-bold text-slate-600 dark:text-slate-300">Available</label>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
                                    <button type="button" onClick={() => setModalMode(null)} className="flex-1 py-4 font-bold text-slate-500 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200">Cancel</button>
                                    <button type="submit" className="flex-1 py-4 font-bold text-white bg-secondary rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Save</button>
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
