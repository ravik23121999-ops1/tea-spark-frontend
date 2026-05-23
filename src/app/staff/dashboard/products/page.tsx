'use client';

import ProductManagement from '@/components/Management/ProductManagement';

export default function StaffProductManagementPage() {
    // Staff might have less permissions, e.g. they can't delete?
    // Following user request "play their responsibilities", I'll give them edit but maybe not delete.
    return <ProductManagement canDelete={false} />;
}
