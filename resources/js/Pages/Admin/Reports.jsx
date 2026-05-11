import { router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Reports({ transactions, summary, cashiers, filters }) {
    const [form, setForm] = useState({
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
        user_id: filters?.user_id || '',
        payment_method: filters?.payment_method || '',
    });

    const formatRp = (val) => new Intl.NumberFormat('id-ID').format(val);

    const filter = (e) => {
        e.preventDefault();
        router.get('/admin/reports', form, { preserveState: true });
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Laporan Penjualan</h1>
            <form onSubmit={filter} className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
                <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="border rounded px-3 py-2" />
                <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="border rounded px-3 py-2" />
                <select value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })} className="border rounded px-3 py-2">
                    <option value="">Semua Kasir</option>
                    {cashiers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })} className="border rounded px-3 py-2">
                    <option value="">Semua Metode</option>
                    <option value="cash">Cash</option>
                    <option value="qris">QRIS</option>
                    <option value="bank_transfer">Transfer Bank</option>
                </select>
                <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Filter</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Total Transaksi</p>
                    <p className="text-xl font-bold">{summary.total_transactions}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Total Omzet</p>
                    <p className="text-xl font-bold text-blue-600">Rp {formatRp(summary.total_revenue)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Total Laba</p>
                    <p className="text-xl font-bold text-green-600">Rp {formatRp(summary.total_profit)}</p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Invoice</th>
                            <th className="px-4 py-3 text-left">Kasir</th>
                            <th className="px-4 py-3 text-right">Total</th>
                            <th className="px-4 py-3 text-left">Metode</th>
                            <th className="px-4 py-3 text-left">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id} className="border-t">
                                <td className="px-4 py-3 font-mono text-xs">{t.invoice_number}</td>
                                <td className="px-4 py-3">{t.user?.name}</td>
                                <td className="px-4 py-3 text-right">Rp {formatRp(t.total)}</td>
                                <td className="px-4 py-3 capitalize">{t.payment_method}</td>
                                <td className="px-4 py-3 text-gray-500">{new Date(t.created_at).toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                        {transactions.length === 0 && <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-400">Tidak ada data</td></tr>}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
