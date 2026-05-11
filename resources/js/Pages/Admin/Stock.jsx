import { useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Stock({ products, movements }) {
    const { data, setData, post, processing, reset } = useForm({
        product_id: '', type: 'in', quantity: '', note: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/stock', { onSuccess: () => reset() });
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Manajemen Stok</h1>
            <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
                <select value={data.product_id} onChange={e => setData('product_id', e.target.value)} className="border rounded px-3 py-2">
                    <option value="">Pilih Produk</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>)}
                </select>
                <select value={data.type} onChange={e => setData('type', e.target.value)} className="border rounded px-3 py-2">
                    <option value="in">Stok Masuk</option>
                    <option value="out">Stok Keluar</option>
                </select>
                <input placeholder="Jumlah" type="number" min="1" value={data.quantity} onChange={e => setData('quantity', e.target.value)} className="border rounded px-3 py-2" />
                <input placeholder="Catatan (opsional)" value={data.note} onChange={e => setData('note', e.target.value)} className="border rounded px-3 py-2" />
                <button type="submit" disabled={processing} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Simpan</button>
            </form>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <h2 className="px-4 py-3 font-semibold border-b">Riwayat Perubahan Stok</h2>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Tanggal</th>
                            <th className="px-4 py-3 text-left">Produk</th>
                            <th className="px-4 py-3 text-left">Tipe</th>
                            <th className="px-4 py-3 text-right">Jumlah</th>
                            <th className="px-4 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements.map(m => (
                            <tr key={m.id} className="border-t">
                                <td className="px-4 py-3 text-gray-500">{new Date(m.created_at).toLocaleString('id-ID')}</td>
                                <td className="px-4 py-3">{m.product?.name}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs ${m.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {m.type === 'in' ? 'Masuk' : 'Keluar'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">{m.quantity}</td>
                                <td className="px-4 py-3">{m.user?.name}</td>
                                <td className="px-4 py-3 text-gray-500">{m.note || '-'}</td>
                            </tr>
                        ))}
                        {movements.length === 0 && <tr><td colSpan="6" className="px-4 py-6 text-center text-gray-400">Belum ada data</td></tr>}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
