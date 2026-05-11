import { Link, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

export default function CashierLayout({ children }) {
    const { auth, flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster position="top-right" />
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-14">
                        <div className="flex items-center space-x-4">
                            <span className="font-bold text-green-600">POS Kasir</span>
                            <Link href="/cashier/pos" className="text-sm text-gray-600 hover:text-green-600">POS</Link>
                            <Link href="/cashier/transactions" className="text-sm text-gray-600 hover:text-green-600">Riwayat</Link>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">{auth.user?.name}</span>
                            <Link href="/logout" method="post" as="button" className="text-sm text-red-600 hover:text-red-800">
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-4 px-4">{children}</main>
        </div>
    );
}
