<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('customer_name')->nullable();
            $table->decimal('subtotal', 12, 2);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->decimal('paid_amount', 12, 2)->nullable();
            $table->decimal('change_amount', 12, 2)->nullable();
            $table->enum('payment_method', ['cash', 'qris', 'bank_transfer']);
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'expired', 'cancelled'])->default('pending');
            $table->enum('transaction_status', ['draft', 'success', 'cancelled'])->default('draft');
            $table->string('midtrans_order_id')->nullable();
            $table->text('midtrans_snap_token')->nullable();
            $table->string('midtrans_payment_type')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
