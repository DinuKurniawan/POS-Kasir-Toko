<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    public function __construct(
        protected StockService $stockService,
        protected MidtransService $midtransService,
    ) {}

    public function generateInvoiceNumber(): string
    {
        $date = now()->format('Ymd');
        $last = Transaction::where('invoice_number', 'like', "INV-{$date}-%")
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $last
            ? (int) substr($last->invoice_number, -4) + 1
            : 1;

        return sprintf("INV-%s-%04d", $date, $sequence);
    }

    public function createCashTransaction(array $data, int $userId): Transaction
    {
        return DB::transaction(function () use ($data, $userId) {
            $transaction = Transaction::create([
                'invoice_number' => $this->generateInvoiceNumber(),
                'user_id' => $userId,
                'customer_name' => $data['customer_name'] ?? null,
                'subtotal' => $data['subtotal'],
                'discount' => $data['discount'] ?? 0,
                'total' => $data['total'],
                'paid_amount' => $data['paid_amount'],
                'change_amount' => $data['paid_amount'] - $data['total'],
                'payment_method' => 'cash',
                'payment_status' => 'paid',
                'transaction_status' => 'success',
                'paid_at' => now(),
            ]);

            $this->saveItems($transaction, $data['items']);
            $this->reduceStock($data['items'], $userId);

            return $transaction;
        });
    }

    public function createMidtransTransaction(array $data, int $userId): Transaction
    {
        return DB::transaction(function () use ($data, $userId) {
            $invoiceNumber = $this->generateInvoiceNumber();

            $transaction = Transaction::create([
                'invoice_number' => $invoiceNumber,
                'user_id' => $userId,
                'customer_name' => $data['customer_name'] ?? null,
                'subtotal' => $data['subtotal'],
                'discount' => $data['discount'] ?? 0,
                'total' => $data['total'],
                'payment_method' => $data['payment_method'],
                'payment_status' => 'pending',
                'transaction_status' => 'draft',
                'midtrans_order_id' => $invoiceNumber,
            ]);

            $this->saveItems($transaction, $data['items']);

            $snapParams = [
                'transaction_details' => [
                    'order_id' => $invoiceNumber,
                    'gross_amount' => (int) $data['total'],
                ],
                'customer_details' => [
                    'first_name' => $data['customer_name'] ?? 'Customer',
                ],
            ];

            $snapToken = $this->midtransService->createSnapToken($snapParams);
            $transaction->update(['midtrans_snap_token' => $snapToken]);

            return $transaction;
        });
    }

    public function markAsPaid(Transaction $transaction, ?string $paymentType = null): void
    {
        DB::transaction(function () use ($transaction, $paymentType) {
            $transaction->update([
                'payment_status' => 'paid',
                'transaction_status' => 'success',
                'midtrans_payment_type' => $paymentType,
                'paid_at' => now(),
            ]);

            $this->reduceStock(
                $transaction->items->map(fn ($item) => [
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                ])->toArray(),
                $transaction->user_id
            );
        });
    }

    protected function saveItems(Transaction $transaction, array $items): void
    {
        foreach ($items as $item) {
            $product = Product::findOrFail($item['product_id']);

            TransactionItem::create([
                'transaction_id' => $transaction->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_sku' => $product->sku,
                'price' => $product->selling_price,
                'purchase_price' => $product->purchase_price,
                'quantity' => $item['quantity'],
                'subtotal' => $product->selling_price * $item['quantity'],
            ]);
        }
    }

    protected function reduceStock(array $items, int $userId): void
    {
        foreach ($items as $item) {
            $this->stockService->decreaseStock(
                $item['product_id'],
                $item['quantity'],
                $userId,
                'Penjualan'
            );
        }
    }
}
