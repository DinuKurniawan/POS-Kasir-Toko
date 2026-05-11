<?php

namespace App\Services;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class StockService
{
    public function increaseStock(int $productId, int $quantity, int $userId, ?string $note = null): void
    {
        DB::transaction(function () use ($productId, $quantity, $userId, $note) {
            Product::where('id', $productId)->increment('stock', $quantity);

            StockMovement::create([
                'product_id' => $productId,
                'user_id' => $userId,
                'type' => 'in',
                'quantity' => $quantity,
                'note' => $note ?? 'Stok masuk',
            ]);
        });
    }

    public function decreaseStock(int $productId, int $quantity, int $userId, ?string $note = null): void
    {
        DB::transaction(function () use ($productId, $quantity, $userId, $note) {
            $product = Product::findOrFail($productId);

            if ($product->stock < $quantity) {
                throw new \Exception("Stok tidak mencukupi untuk produk {$product->name}");
            }

            $product->decrement('stock', $quantity);

            StockMovement::create([
                'product_id' => $productId,
                'user_id' => $userId,
                'type' => 'out',
                'quantity' => $quantity,
                'note' => $note ?? 'Stok keluar',
            ]);
        });
    }

    public function recordMovement(int $productId, int $userId, string $type, int $quantity, ?string $note = null): void
    {
        StockMovement::create([
            'product_id' => $productId,
            'user_id' => $userId,
            'type' => $type,
            'quantity' => $quantity,
            'note' => $note,
        ]);
    }
}
