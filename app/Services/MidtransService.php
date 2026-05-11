<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$clientKey = config('midtrans.client_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    public function createSnapToken(array $params): string
    {
        return Snap::getSnapToken($params);
    }

    public function handleNotification(): Notification
    {
        return new Notification();
    }

    public function verifySignature(array $data): bool
    {
        $orderId = $data['order_id'];
        $statusCode = $data['status_code'];
        $grossAmount = $data['gross_amount'];
        $serverKey = config('midtrans.server_key');

        $signature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        return $signature === $data['signature_key'];
    }
}
