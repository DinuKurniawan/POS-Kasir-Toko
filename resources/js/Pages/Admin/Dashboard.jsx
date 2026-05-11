import AdminLayout from '../../Layouts/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ stats, chart }) {
    const formatRp = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                <Card label="Total Produk" value={stats.total_products} />
                <Card label="Transaksi Hari Ini" value={stats.transactions_today} />
                <Card label="Pendapatan Hari Ini" value={formatRp(stats.revenue_today)} />
                <Card label="Pendapatan Bulan Ini" value={formatRp(stats.revenue_month)} />
                <Card label="Stok Menipis" value={stats.low_stock} color="red" />
            </div>
            {chart.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="font-semibold mb-4">Penjualan 7 Hari Terakhir</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chart.map(item => ({ ...item, date: item.date.slice(5) }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                            <Tooltip formatter={(value) => formatRp(value)} />
                            <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </AdminLayout>
    );
}

function Card({ label, value, color = 'blue' }) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-xl font-bold text-${color}-600 mt-1`}>{value}</p>
        </div>
    );
}
