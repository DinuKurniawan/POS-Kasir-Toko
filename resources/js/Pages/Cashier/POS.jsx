import { router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import CashierLayout from '../../Layouts/CashierLayout';

export default function POS({ products, midtransClientKey }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paidAmount, setPaidAmount] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [processing, setProcessing] = useState(false);
    const searchRef = useRef(null);

    const resetCart = () => {
        setCart([]);
        setDiscount(0);
        setPaidAmount('');
        setShowPayment(false);
    };

    useEffect(() => { searchRef.current?.focus(); }, []);

    useEffect(() => {
        // Cash: backend return success + transaction_id -> auto redirect ke struk
        if (flash?.transaction_id && flash?.success) {
            resetCart();
            router.visit(`/cashier/transactions/${flash.transaction_id}/receipt`);
            return;
        }

        // Midtrans: backend return snap_token -> buka popup Snap
        if (flash?.snap_token) {
            const trxId = flash.transaction_id;
            window.snap?.pay(flash.snap_token, {
                onSuccess: () => {
                    resetCart();
                    if (trxId) router.visit(`/cashier/transactions/${trxId}/receipt`);
                },
                onPending: () => {
                    resetCart();
                    if (trxId) router.visit(`/cashier/transactions/${trxId}/receipt`);
                },
                onError: () => setShowPayment(false),
                onClose: () => setShowPayment(false),
            });
        }
    }, [flash]);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        (p.barcode && p.barcode.includes(search))
    );

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.product_id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev;
                return prev.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { product_id: product.id, name: product.name, price: parseFloat(product.selling_price), quantity: 1, stock: product.stock }];
        });
    };

    const updateQty = (productId, qty) => {
        if (qty < 1) return removeFromCart(productId);
        const item = cart.find(i => i.product_id === productId);
        if (qty > item.stock) return;
        setCart(prev => prev.map(i => i.product_id === productId ? { ...i, quantity: qty } : i));
    };

    const removeFromCart = (productId) => setCart(prev => prev.filter(i => i.product_id !== productId));

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const total = subtotal - discount;
    const change = paymentMethod === 'cash' ? (parseFloat(paidAmount) || 0) - total : 0;

    const formatRp = (val) => new Intl.NumberFormat('id-ID').format(val);

    const checkout = () => {
        if (cart.length === 0) return;
        if (paymentMethod === 'cash' && (parseFloat(paidAmount) || 0) < total) return;
        setProcessing(true);

        router.post('/cashier/checkout', {
            items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
            subtotal, discount, total,
            payment_method: paymentMethod,
            paid_amount: paymentMethod === 'cash' ? parseFloat(paidAmount) : null,
        }, {
            preserveState: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <CashierLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-7rem)]">
                {/* Product List */}
                <div className="lg:col-span-2 flex flex-col bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-3 border-b">
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Cari produk (nama, SKU, barcode)..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 content-start">
                        {filtered.map(p => (
                            <button
                                key={p.id}
                                onClick={() => addToCart(p)}
                                className="border rounded-lg p-3 text-left hover:border-green-500 hover:bg-green-50 transition"
                            >
                                <p className="font-medium text-sm truncate">{p.name}</p>
                                <p className="text-xs text-gray-500">{p.sku}</p>
                                <p className="text-sm font-bold text-green-600 mt-1">Rp {formatRp(p.selling_price)}</p>
                                <p className="text-xs text-gray-400">Stok: {p.stock}</p>
                            </button>
                        ))}
                        {filtered.length === 0 && <p className="col-span-full text-center text-gray-400 py-8">Produk tidak ditemukan</p>}
                    </div>
                </div>

                {/* Cart */}
                <div className="flex flex-col bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-3 border-b font-semibold">Keranjang ({cart.length} item)</div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {cart.map(item => (
                            <div key={item.product_id} className="flex items-center justify-between border rounded p-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{item.name}</p>
                                    <p className="text-xs text-gray-500">Rp {formatRp(item.price)}</p>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <button onClick={() => updateQty(item.product_id, item.quantity - 1)} className="w-7 h-7 bg-gray-200 rounded text-lg leading-none">-</button>
                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                    <button onClick={() => updateQty(item.product_id, item.quantity + 1)} className="w-7 h-7 bg-gray-200 rounded text-lg leading-none">+</button>
                                    <button onClick={() => removeFromCart(item.product_id)} className="ml-1 text-red-500 text-lg">×</button>
                                </div>
                            </div>
                        ))}
                        {cart.length === 0 && <p className="text-center text-gray-400 py-8">Keranjang kosong</p>}
                    </div>
                    <div className="border-t p-3 space-y-2">
                        <div className="flex justify-between text-sm"><span>Subtotal</span><span>Rp {formatRp(subtotal)}</span></div>
                        <div className="flex items-center justify-between text-sm">
                            <span>Diskon</span>
                            <input type="number" min="0" value={discount} onChange={e => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-28 border rounded px-2 py-1 text-right text-sm" />
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>Rp {formatRp(total)}</span></div>
                        <button
                            onClick={() => setShowPayment(true)}
                            disabled={cart.length === 0}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            Bayar
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPayment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Pembayaran</h2>
                        <p className="text-2xl font-bold text-center mb-4">Rp {formatRp(total)}</p>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Metode Pembayaran</label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full border rounded px-3 py-2">
                                    <option value="cash">Cash</option>
                                    <option value="qris">QRIS</option>
                                    <option value="bank_transfer">Transfer Bank</option>
                                </select>
                            </div>
                            {paymentMethod === 'cash' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Uang Bayar</label>
                                        <input type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)}
                                            className="w-full border rounded px-3 py-2 text-lg" autoFocus />
                                    </div>
                                    {parseFloat(paidAmount) >= total && (
                                        <p className="text-lg font-bold text-green-600">Kembalian: Rp {formatRp(change)}</p>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowPayment(false)} className="flex-1 border rounded-lg py-2 hover:bg-gray-50">Batal</button>
                            <button
                                onClick={checkout}
                                disabled={processing || (paymentMethod === 'cash' && (parseFloat(paidAmount) || 0) < total)}
                                className="flex-1 bg-green-600 text-white rounded-lg py-2 font-bold hover:bg-green-700 disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : 'Proses'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </CashierLayout>
    );
}
