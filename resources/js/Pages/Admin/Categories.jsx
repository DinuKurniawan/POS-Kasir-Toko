import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Categories({ categories }) {
    const [editing, setEditing] = useState(null);
    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '', description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(`/admin/categories/${editing}`, { onSuccess: () => { reset(); setEditing(null); } });
        } else {
            post('/admin/categories', { onSuccess: () => reset() });
        }
    };

    const edit = (cat) => {
        setEditing(cat.id);
        setData({ name: cat.name, description: cat.description || '' });
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Manajemen Kategori</h1>
            <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow mb-6 flex gap-3">
                <input placeholder="Nama Kategori" value={data.name} onChange={e => setData('name', e.target.value)}
                    className="border rounded px-3 py-2 flex-1" />
                <input placeholder="Deskripsi (opsional)" value={data.description} onChange={e => setData('description', e.target.value)}
                    className="border rounded px-3 py-2 flex-1" />
                <button type="submit" disabled={processing} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
                    {editing ? 'Update' : 'Tambah'}
                </button>
                {editing && <button type="button" onClick={() => { reset(); setEditing(null); }} className="text-gray-600 px-3">Batal</button>}
            </form>
            {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Nama</th>
                            <th className="px-4 py-3 text-left">Deskripsi</th>
                            <th className="px-4 py-3 text-left">Jumlah Produk</th>
                            <th className="px-4 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id} className="border-t">
                                <td className="px-4 py-3">{cat.name}</td>
                                <td className="px-4 py-3 text-gray-500">{cat.description || '-'}</td>
                                <td className="px-4 py-3">{cat.products_count}</td>
                                <td className="px-4 py-3 space-x-2">
                                    <button onClick={() => edit(cat)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => router.delete(`/admin/categories/${cat.id}`)} className="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
