<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentLog extends Model
{
    protected $fillable = [
        'transaction_id', 'order_id', 'payment_type',
        'transaction_status', 'fraud_status', 'raw_response',
    ];

    protected function casts(): array
    {
        return ['raw_response' => 'array'];
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
