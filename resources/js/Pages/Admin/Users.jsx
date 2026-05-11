import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Users({ users }) {
    const [editing, setEditing] = useState(null);
    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '', username: '', password: '', role: 'kasir', is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (editing) {
            put(`/admin/users/${editing}`, { onSuccess: () => { reset(); setEditing(null); } });
        } else {
            post('/admin/users', { onSuccess: () => reset() });
        }
    };

    const edit = (user) => {
        setEditing(user.id);
        setData({ name: user.name, username: user.username, password: '', role: user.role, is_active: user.is_active });
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Manajemen User</h1>
            <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
                <input placeholder="Nama" value={data.name} onChange={e => setData('name', e.target.value)}
                    className="border rounded px-3 py-2" />
                <input placeholder="Username" value={data.username} onChange={e => setData('username', e.target.value)}
                    className="border rounded px-3 py-2" />
                <input placeholder="Password" type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                    className="border rounded px-3 py-2" />
                <select value={data.role} onChange={e => setData('role', e.target.value)} className="border rounded px-3 py-2">
                    <option value="admin">Admin</option>
                    <option value="kasir">Kasir</option>
                </select>
                <button type="submit" disabled={processing} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
                    {editing ? 'Update' : 'Tambah'}
                </button>
            </form>
            {errors.username && <p className="text-red-500 text-sm mb-2">{errors.username}</p>}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Nama</th>
                            <th className="px-4 py-3 text-left">Username</th>
                            <th className="px-4 py-3 text-left">Role</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-t">
                                <td className="px-4 py-3">{user.name}</td>
                                <td className="px-4 py-3">{user.username}</td>
                                <td className="px-4 py-3 capitalize">{user.role}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 space-x-2">
                                    <button onClick={() => edit(user)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => router.delete(`/admin/users/${user.id}`)} className="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
