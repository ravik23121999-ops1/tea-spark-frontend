'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Check,
    X,
    Shield,
    UserPlus,
    ChevronDown,
    Search,
    Filter,
    Award
} from 'lucide-react';
import {
    useGetPendingStaffQuery,
    useGetApprovedStaffQuery,
    useApproveStaffMutation,
    useGetResponsibilitiesQuery,
    useAssignResponsibilitiesMutation,
    useRemoveResponsibilityMutation
} from '@/redux/apiSlice';
import ConfirmationModal from '@/components/Common/ConfirmationModal';

export default function StaffManagement() {
    const formatKey = (key: string) => {
        if (!key) return 'Role';
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
    const [page, setPage] = useState(1);
    const limit = 5;

    const { data: pendingData, isLoading: isPendingLoading, refetch: refetchPending } = useGetPendingStaffQuery({ page, limit }, { skip: activeTab !== 'pending' });
    const { data: approvedData, isLoading: isApprovedLoading, refetch: refetchApproved } = useGetApprovedStaffQuery({ page, limit }, { skip: activeTab !== 'approved' });
    const { data: allResponsibilities } = useGetResponsibilitiesQuery();

    const [approveStaff, { isLoading: isApproving }] = useApproveStaffMutation();
    const [assignResponsibilities, { isLoading: isSavingResp }] = useAssignResponsibilitiesMutation();
    const [removeResponsibility] = useRemoveResponsibilityMutation();

    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [showRespModal, setShowRespModal] = useState(false);
    const [tempResponsibilities, setTempResponsibilities] = useState<string[]>([]);

    const staffData = activeTab === 'pending' ? pendingData : approvedData;
    const isLoading = activeTab === 'pending' ? isPendingLoading : isApprovedLoading;

    // Confirmation Modal State
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

    const handleApproveAction = (staff: any, status: 'approved' | 'rejected') => {
        setConfirmConfig({
            isOpen: true,
            title: status === 'approved' ? 'Approve Staff?' : 'Reject Application?',
            message: status === 'approved'
                ? `Are you sure you want to approve ${staff.name}? They will gain staff access immediately.`
                : `Are you sure you want to reject ${staff.name}'s application? This action will notify them.`,
            type: status === 'approved' ? 'success' : 'danger',
            confirmText: status === 'approved' ? 'Approve' : 'Reject',
            onConfirm: async () => {
                try {
                    await approveStaff({ id: staff._id, status }).unwrap();
                    refetchPending();
                    refetchApproved();
                    closeConfirm();
                } catch (err) {
                    console.error('Action failed:', err);
                }
            }
        });
    };

    const openRespModal = (staff: any) => {
        setSelectedStaff(staff);
        setTempResponsibilities(staff.responsibilities?.map((r: any) => r._id) || []);
        setShowRespModal(true);
    };

    const handleRemoveResponsibility = async (staff: any, respId: string) => {
        try {
            await removeResponsibility({
                id: staff._id,
                respId
            }).unwrap();
            refetchApproved();
        } catch (err) {
            console.error('Remove responsibility failed:', err);
        }
    };

    const handleSaveResponsibilities = async () => {
        try {
            await assignResponsibilities({
                id: selectedStaff._id,
                responsibilityIds: tempResponsibilities
            }).unwrap();
            setShowRespModal(false);
            refetchApproved();

            setConfirmConfig({
                isOpen: true,
                title: 'Roles Updated!',
                message: `Responsibilities for ${selectedStaff.name} have been updated successfully.`,
                type: 'success',
                confirmText: 'Done',
                onConfirm: closeConfirm
            });
        } catch (err) {
            console.error('Save responsibilities failed:', err);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white mb-2">Staff Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Review applications and manage team roles.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/50 w-fit rounded-lg border border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => { setActiveTab('pending'); setPage(1); }}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'pending'
                        ? 'bg-white dark:bg-slate-900 text-secondary shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    Pending Applications
                </button>
                <button
                    onClick={() => { setActiveTab('approved'); setPage(1); }}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'approved'
                        ? 'bg-white dark:bg-slate-900 text-secondary shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    Approved Members
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        {activeTab === 'pending' ? (
                            <>
                                <UserPlus size={20} className="text-orange-500" />
                                Review Applications
                                <span className="ml-2 px-2.5 py-0.5 bg-orange-100 dark:bg-orange-500/10 text-orange-600 text-xs font-bold rounded-full">
                                    {staffData?.pagination?.totalItems || 0}
                                </span>
                            </>
                        ) : (
                            <>
                                <Users size={20} className="text-secondary" />
                                Active Team
                                <span className="ml-2 px-2.5 py-0.5 bg-secondary/10 text-secondary text-xs font-bold rounded-full">
                                    {staffData?.pagination?.totalItems || 0}
                                </span>
                            </>
                        )}
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            {activeTab === 'pending' ? (
                                <tr>
                                    <th className="px-8 py-4">Name</th>
                                    <th className="px-8 py-4">Email</th>
                                    <th className="px-8 py-4">Joined</th>
                                    <th className="px-8 py-4 text-center">Actions</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th className="px-8 py-4">Team Member</th>
                                    <th className="px-8 py-4">Responsibilities</th>
                                    <th className="px-8 py-4 text-center">Manage</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-medium">Loading...</td>
                                </tr>
                            ) : staffData?.list?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-medium italic">
                                        No {activeTab} staff found.
                                    </td>
                                </tr>
                            ) : staffData?.list?.map((staff: any) => (
                                <tr key={staff._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    {activeTab === 'pending' ? (
                                        <>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                                                        {staff.name[0].toUpperCase()}
                                                    </div>
                                                    <span className="font-bold dark:text-white">{staff.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-slate-500 dark:text-slate-400 font-medium">{staff.email}</td>
                                            <td className="px-8 py-5">
                                                <span className="text-slate-400 text-xs">{new Date(staff.createdAt).toLocaleDateString()}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleApproveAction(staff, 'approved')} className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-sm"><Check size={18} /></button>
                                                    <button onClick={() => handleApproveAction(staff, 'rejected')} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"><X size={18} /></button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                                                        {staff.name[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold dark:text-white">{staff.name}</span>
                                                        <span className="text-xs text-slate-400">{staff.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {staff.responsibilities?.length > 0 ? (
                                                        staff.responsibilities.map((r: any) => (
                                                            <span
                                                                key={r._id}
                                                                className="group relative flex items-center gap-1.5 px-2.5 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider rounded-lg border border-secondary/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all cursor-default"
                                                            >
                                                                {r.name || formatKey(r.key)}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRemoveResponsibility(staff, r._id);
                                                                    }}
                                                                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-red-500 hover:text-white transition-all"
                                                                >
                                                                    <X size={10} strokeWidth={4} />
                                                                </button>
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-400 text-xs italic">No duties assigned</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center justify-center">
                                                    <button onClick={() => openRespModal(staff)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                                        <Award size={14} className="text-secondary" />
                                                        Assign Roles
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {staffData?.pagination?.totalPages > 1 && (
                    <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-sm text-slate-500 font-medium">
                            Showing page <span className="text-slate-900 dark:text-white">{staffData.pagination.currentPage}</span> of <span className="text-slate-900 dark:text-white">{staffData.pagination.totalPages}</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <ChevronDown size={20} className="rotate-90" />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(staffData.pagination.totalPages, p + 1))}
                                disabled={page === staffData.pagination.totalPages}
                                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <ChevronDown size={20} className="-rotate-90" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Responsibility Modal */}
            <AnimatePresence>
                {showRespModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRespModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden">
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                                <h3 className="text-2xl font-bold dark:text-white">Assign Responsibilities</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Updating <span className="text-secondary font-bold">{selectedStaff?.name}</span></p>
                            </div>
                            <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
                                <div className="grid grid-cols-1 gap-3">
                                    {allResponsibilities?.map((resp: any) => {
                                        const isSelected = tempResponsibilities.includes(resp._id);
                                        return (
                                            <button key={resp._id} onClick={() => isSelected ? setTempResponsibilities(r => r.filter(id => id !== resp._id)) : setTempResponsibilities(r => [...r, resp._id])} className={`flex items-center gap-3 p-4 rounded-lg border transition-all text-left ${isSelected ? 'border-secondary bg-secondary/5' : 'border-slate-100 dark:border-slate-800 text-slate-500'}`}>
                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-secondary border-secondary text-white' : 'border-slate-300'}`}>{isSelected && <Check size={12} strokeWidth={4} />}</div>
                                                <div className="flex flex-col"><span className="font-bold text-sm">{resp.name || formatKey(resp.key)}</span><span className="text-[10px] opacity-60 line-clamp-1">{resp.description}</span></div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                                <button onClick={() => setShowRespModal(false)} disabled={isSavingResp} className="flex-1 py-3 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-all disabled:opacity-50">Cancel</button>
                                <button onClick={handleSaveResponsibilities} disabled={isSavingResp} className="flex-1 py-3 bg-secondary text-white font-bold rounded-lg shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all disabled:opacity-50">{isSavingResp ? 'Saving...' : 'Save Changes'}</button>
                            </div>
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
                isLoading={isApproving}
            />
        </div>
    );
}
