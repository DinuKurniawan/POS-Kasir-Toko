import { Link } from '@inertiajs/react';

export default function Receipt({ transaction }) {
    const formatRp = (val) => new Intl.NumberFormat('id-ID').format(val);
    const t = transaction;

    const handlePrint = () => window.print();

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 print:shadow-none print:p-0">
                {/* Header */}
                <div className="text-center border-b pb-4 mb-4">
                    <h1 className="text-xl font-bold">POS KASIR TOKO</h1>
                    <p className="text-sm text-gray-500">Jl. Contoh No. 123, Kota</p>
                </div>

                {/* Info */}
                <div className="text-sm space-y-1 mb-4">
                    <div className="flex justify-between"><span className="text-gray-500">No. Invoice</span><span className="font-mono">{t.invoice_number}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Kasir</span><span>{t.user?.name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Tanggal</span><span>{new Date(t.created_at).toLocaleString('id-ID')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Metode</span><span className="capitalize">{t.payment_method}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Status</span>
                        <span className={t.payment_status === 'paid' ? 'text-green-600 font-bold' : 'text-yellow-600'}>{t.payment_status.toUpperCase()}</span>
                    </div>
                </div>

                {/* Items */}
                <div className="border-t border-dashed pt-3 mb-3">
                    {t.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                            <div>
                                <span>{item.product_name}</span>
                                <span className="text-gray-400 ml-2">{item.quantity} x Rp {formatRp(item.price)}</span>
                            </div>
                            <span>Rp {formatRp(item.subtotal)}</span>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t border-dashed pt-3 text-sm space-y-1">
                    <div className="flex justify-between"><span>Subtotal</span><span>Rp {formatRp(t.subtotal)}</span></div>
                    {parseFloat(t.discount) > 0 && <div className="flex justify-between"><span>Diskon</span><span>-Rp {formatRp(t.discount)}</span></div>}
                    <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>Rp {formatRp(t.total)}</span></div>
                    {t.payment_method === 'cash' && (
                        <>
                            <div className="flex justify-between"><span>Bayar</span><span>Rp {formatRp(t.paid_amount)}</span></div>
                            <div className="flex justify-between"><span>Kembalian</span><span>Rp {formatRp(t.change_amount)}</span></div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 pt-4 border-t border-dashed">
                    <p className="text-sm text-gray-500">Terima kasih atas kunjungan Anda!</p>
                    <p className="text-xs text-gray-400 mt-1">Barang yang sudah dibeli tidak dapat dikembalikan</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6 print:hidden">
                    <Link href="/cashier/pos" className="flex-1 border rounded-lg py-2 text-center hover:bg-gray-50">Kembali ke POS</Link>
                    <button onClick={handlePrint} className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-bold hover:bg-blue-700">Print Struk</button>
                </div>
            </div>
        </div>
    );
}
