import AdminLayout from '../../Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function Transactions({ transactions }) {
    const formatRp = (val) => new Intl.NumberFormat('id-ID').format(val);
    const items = transactions.data || [];

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Semua Transaksi</h1>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Invoice</th>
                            <th className="px-4 py-3 text-left">Kasir</th>
                            <th className="px-4 py-3 text-right">Total</th>
                            <th className="px-4 py-3 text-left">Metode</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Tanggal</th>
                            <th className="px-4 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(t => (
                            <tr key={t.id} className="border-t">
                                <td className="px-4 py-3 font-mono text-xs">{t.invoice_number}</td>
                                <td className="px-4 py-3">{t.user?.name}</td>
                                <td className="px-4 py-3 text-right">Rp {formatRp(t.total)}</td>
                                <td className="px-4 py-3 capitalize">{t.payment_method}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={t.payment_status} />
                                </td>
                                <td className="px-4 py-3 text-gray-500">{new Date(t.created_at).toLocaleString('id-ID')}</td>
                                <td className="px-4 py-3">
                                    <Link href={`/cashier/transactions/${t.id}/receipt`} className="text-blue-600 hover:underline">Struk</Link>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan="7" className="px-4 py-6 text-center text-gray-400">Belum ada transaksi</td></tr>}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

function StatusBadge({ status }) {
    const colors = { paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', failed: 'bg-red-100 text-red-700', expired: 'bg-gray-100 text-gray-700' };
    return <span className={`px-2 py-1 rounded text-xs ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
}
