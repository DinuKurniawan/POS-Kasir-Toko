import { Link, usePage } from '@inertiajs/react';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/categories', label: 'Kategori' },
    { href: '/admin/products', label: 'Produk' },
    { href: '/admin/stock', label: 'Stok' },
    { href: '/admin/transactions', label: 'Transaksi' },
    { href: '/admin/reports', label: 'Laporan' },
    { href: '/cashier/pos', label: 'POS' },
];

export default function AdminLayout({ children }) {
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
                        <div className="flex items-center space-x-4 overflow-x-auto">
                            <span className="font-bold text-blue-600 whitespace-nowrap">POS Admin</span>
                            {navItems.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm text-gray-600 hover:text-blue-600 whitespace-nowrap"
                                >
                                    {item.label}
                                </Link>
                            ))}
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
            <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
        </div>
    );
}
