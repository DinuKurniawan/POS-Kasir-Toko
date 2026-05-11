<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class POSController extends Controller
{
    public function __construct(protected TransactionService $transactionService) {}

    public function index()
    {
        return Inertia::render('Cashier/POS', [
            'products' => Product::where('is_active', true)
                ->where('stock', '>', 0)
                ->with('category')
                ->orderBy('name')
                ->get(),
            'midtransClientKey' => config('midtrans.client_key'),
        ]);
    }

    public function checkout(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'subtotal' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:1',
            'payment_method' => 'required|in:cash,qris,bank_transfer',
            'paid_amount' => 'required_if:payment_method,cash|nullable|numeric',
            'customer_name' => 'nullable|string|max:255',
        ]);

        // Validate stock
        foreach ($data['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            if ($product->stock < $item['quantity']) {
                return back()->with('error', "Stok {$product->name} tidak mencukupi.");
            }
        }

        // Validate cash payment
        if ($data['payment_method'] === 'cash' && $data['paid_amount'] < $data['total']) {
            return back()->with('error', 'Uang bayar kurang dari total.');
        }

        if ($data['payment_method'] === 'cash') {
            $transaction = $this->transactionService->createCashTransaction($data, auth()->id());
            return back()->with('success', 'Transaksi berhasil.')->with('transaction_id', $transaction->id);
        }

        $transaction = $this->transactionService->createMidtransTransaction($data, auth()->id());

        return back()->with('snap_token', $transaction->midtrans_snap_token)
            ->with('transaction_id', $transaction->id);
    }

    public function transactions()
    {
        return Inertia::render('Cashier/TransactionHistory', [
            'transactions' => Transaction::where('user_id', auth()->id())
                ->with('items')
                ->latest()
                ->paginate(20),
        ]);
    }

    public function receipt(Transaction $transaction)
    {
        if ($transaction->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403);
        }

        return Inertia::render('Cashier/Receipt', [
            'transaction' => $transaction->load(['items', 'user']),
        ]);
    }
}
