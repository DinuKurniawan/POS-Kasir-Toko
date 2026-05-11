<?php

namespace App\Http\Controllers;

use App\Models\PaymentLog;
use App\Models\Transaction;
use App\Services\MidtransService;
use App\Services\TransactionService;
use Illuminate\Http\Request;

class MidtransController extends Controller
{
    public function __construct(
        protected MidtransService $midtransService,
        protected TransactionService $transactionService,
    ) {}

    public function notification(Request $request)
    {
        $data = $request->all();

        if (!$this->midtransService->verifySignature($data)) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        PaymentLog::create([
            'order_id' => $data['order_id'] ?? null,
            'payment_type' => $data['payment_type'] ?? null,
            'transaction_status' => $data['transaction_status'] ?? null,
            'fraud_status' => $data['fraud_status'] ?? null,
            'raw_response' => $data,
            'transaction_id' => Transaction::where('midtrans_order_id', $data['order_id'])->value('id'),
        ]);

        $transaction = Transaction::where('midtrans_order_id', $data['order_id'])->first();

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        $status = $data['transaction_status'] ?? '';

        if (in_array($status, ['capture', 'settlement'])) {
            if ($transaction->payment_status !== 'paid') {
                $this->transactionService->markAsPaid($transaction, $data['payment_type'] ?? null);
            }
        } elseif (in_array($status, ['deny', 'cancel'])) {
            $transaction->update(['payment_status' => 'failed', 'transaction_status' => 'cancelled']);
        } elseif ($status === 'expire') {
            $transaction->update(['payment_status' => 'expired', 'transaction_status' => 'cancelled']);
        }

        return response()->json(['message' => 'OK']);
    }
}
