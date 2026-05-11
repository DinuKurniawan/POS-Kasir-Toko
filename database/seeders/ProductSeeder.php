<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // Makanan (category_id: 1)
            ['category_id' => 1, 'name' => 'Nasi Goreng Instan', 'sku' => 'MKN-001', 'purchase_price' => 3000, 'selling_price' => 5000, 'stock' => 50],
            ['category_id' => 1, 'name' => 'Mie Instan Goreng', 'sku' => 'MKN-002', 'purchase_price' => 2500, 'selling_price' => 4000, 'stock' => 100],
            ['category_id' => 1, 'name' => 'Roti Tawar', 'sku' => 'MKN-003', 'purchase_price' => 10000, 'selling_price' => 14000, 'stock' => 20],
            ['category_id' => 1, 'name' => 'Sarden Kaleng', 'sku' => 'MKN-004', 'purchase_price' => 12000, 'selling_price' => 16000, 'stock' => 30],
            // Minuman (category_id: 2)
            ['category_id' => 2, 'name' => 'Air Mineral 600ml', 'sku' => 'MNM-001', 'purchase_price' => 2000, 'selling_price' => 3500, 'stock' => 200],
            ['category_id' => 2, 'name' => 'Teh Botol 450ml', 'sku' => 'MNM-002', 'purchase_price' => 3000, 'selling_price' => 5000, 'stock' => 80],
            ['category_id' => 2, 'name' => 'Kopi Sachet', 'sku' => 'MNM-003', 'purchase_price' => 1500, 'selling_price' => 2500, 'stock' => 150],
            ['category_id' => 2, 'name' => 'Susu UHT 250ml', 'sku' => 'MNM-004', 'purchase_price' => 5000, 'selling_price' => 7500, 'stock' => 60],
            // Sembako (category_id: 3)
            ['category_id' => 3, 'name' => 'Beras 5kg', 'sku' => 'SMB-001', 'purchase_price' => 55000, 'selling_price' => 65000, 'stock' => 25],
            ['category_id' => 3, 'name' => 'Minyak Goreng 1L', 'sku' => 'SMB-002', 'purchase_price' => 14000, 'selling_price' => 18000, 'stock' => 40],
            ['category_id' => 3, 'name' => 'Gula Pasir 1kg', 'sku' => 'SMB-003', 'purchase_price' => 12000, 'selling_price' => 15000, 'stock' => 35],
            ['category_id' => 3, 'name' => 'Telur 1kg', 'sku' => 'SMB-004', 'purchase_price' => 25000, 'selling_price' => 30000, 'stock' => 15],
            // Snack (category_id: 4)
            ['category_id' => 4, 'name' => 'Keripik Kentang', 'sku' => 'SNK-001', 'purchase_price' => 8000, 'selling_price' => 12000, 'stock' => 45],
            ['category_id' => 4, 'name' => 'Coklat Batang', 'sku' => 'SNK-002', 'purchase_price' => 5000, 'selling_price' => 8000, 'stock' => 60],
            ['category_id' => 4, 'name' => 'Biskuit Kaleng', 'sku' => 'SNK-003', 'purchase_price' => 25000, 'selling_price' => 35000, 'stock' => 20],
            ['category_id' => 4, 'name' => 'Permen Karet', 'sku' => 'SNK-004', 'purchase_price' => 1000, 'selling_price' => 2000, 'stock' => 100],
            // Peralatan (category_id: 5)
            ['category_id' => 5, 'name' => 'Sabun Cuci Piring', 'sku' => 'PRL-001', 'purchase_price' => 8000, 'selling_price' => 12000, 'stock' => 30],
            ['category_id' => 5, 'name' => 'Deterjen 1kg', 'sku' => 'PRL-002', 'purchase_price' => 15000, 'selling_price' => 20000, 'stock' => 25],
            ['category_id' => 5, 'name' => 'Sikat Gigi', 'sku' => 'PRL-003', 'purchase_price' => 5000, 'selling_price' => 8000, 'stock' => 40],
            ['category_id' => 5, 'name' => 'Tisu 250 lembar', 'sku' => 'PRL-004', 'purchase_price' => 10000, 'selling_price' => 14000, 'stock' => 50],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
