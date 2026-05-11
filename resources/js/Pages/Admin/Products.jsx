import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Products({ products, categories }) {
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        category_id: '', name: '', sku: '', barcode: '', purchase_price: '', selling_price: '', stock: '0', min_stock: '5', is_active: true, image: null,
    });

    const formatRp = (val) => new Intl.NumberFormat('id-ID').format(val);

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            router.post(`/admin/products/${editing}`, { ...data, _method: 'PUT' }, { onSuccess: () => { reset(); setEditing(null); setShowForm(false); } });
        } else {
            post('/admin/products', { onSuccess: () => { reset(); setShowForm(false); } });
        }
    };

    const edit = (p) => {
        setEditing(p.id);
        setShowForm(true);
        setData({ category_id: p.category_id, name: p.name, sku: p.sku, barcode: p.barcode || '', purchase_price: p.purchase_price, selling_price: p.selling_price, stock: p.stock, min_stock: p.min_stock, is_active: p.is_active, image: null });
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manajemen Produk</h1>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); reset(); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {showForm ? 'Tutup Form' : 'Tambah Produk'}
                </button>
            </div>
            {showForm && (
                <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="border rounded px-3 py-2">
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input placeholder="Nama Produk (contoh: Indomie Goreng)" value={data.name} onChange={e => setData('name', e.target.value)} className="border rounded px-3 py-2" />
                    <input placeholder="SKU (contoh: SKU-001)" value={data.sku} onChange={e => setData('sku', e.target.value)} className="border rounded px-3 py-2" />
                    <input placeholder="Barcode (contoh: 8992388111111)" value={data.barcode} onChange={e => setData('barcode', e.target.value)} className="border rounded px-3 py-2" />
                    <input placeholder="Harga Beli (Rp)" type="number" value={data.purchase_price} onChange={e => setData('purchase_price', e.target.value)} className="border rounded px-3 py-2" />
                    <input placeholder="Harga Jual (Rp)" type="number" value={data.selling_price} onChange={e => setData('selling_price', e.target.value)} className="border rounded px-3 py-2" />
                    <input placeholder="Jumlah Stok" type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} className="border rounded px-3 py-2" />
                    <input placeholder="Stok Minimum (contoh: 5)" type="number" value={data.min_stock} onChange={e => setData('min_stock', e.target.value)} className="border rounded px-3 py-2" />
                    <div className="flex items-center gap-4">
                        <button type="submit" disabled={processing} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
                            {editing ? 'Update' : 'Simpan'}
                        </button>
                    </div>
                </form>
            )}
            {Object.keys(errors).length > 0 && <div className="text-red-500 text-sm mb-2">{Object.values(errors).join(', ')}</div>}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-3 text-left">Produk</th>
                            <th className="px-3 py-3 text-left">SKU</th>
                            <th className="px-3 py-3 text-left">Kategori</th>
                            <th className="px-3 py-3 text-right">Harga Beli</th>
                            <th className="px-3 py-3 text-right">Harga Jual</th>
                            <th className="px-3 py-3 text-right">Stok</th>
                            <th className="px-3 py-3 text-left">Status</th>
                            <th className="px-3 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-t">
                                <td className="px-3 py-3">{p.name}</td>
                                <td className="px-3 py-3 text-gray-500">{p.sku}</td>
                                <td className="px-3 py-3">{p.category?.name}</td>
                                <td className="px-3 py-3 text-right">Rp {formatRp(p.purchase_price)}</td>
                                <td className="px-3 py-3 text-right">Rp {formatRp(p.selling_price)}</td>
                                <td className={`px-3 py-3 text-right ${p.stock <= p.min_stock ? 'text-red-600 font-bold' : ''}`}>{p.stock}</td>
                                <td className="px-3 py-3">
                                    <span className={`px-2 py-1 rounded text-xs ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {p.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-3 py-3 space-x-2">
                                    <button onClick={() => edit(p)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => router.delete(`/admin/products/${p.id}`)} className="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
