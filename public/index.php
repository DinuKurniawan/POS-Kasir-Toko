<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| SQLite Runtime Bootstrap (khusus serverless / read-only FS)
|--------------------------------------------------------------------------
|
| Kalau DB_CONNECTION = sqlite dan DB_DATABASE mengarah ke lokasi writable
| seperti `/tmp/...`, maka saat cold-start kita salin template SQLite yang
| sudah dimigrasi & di-seed dari `database/vercel.sqlite` ke path runtime.
| Kalau template tidak ada, fallback ke file kosong supaya tidak fatal.
|
*/
if (getenv('DB_CONNECTION') === 'sqlite') {
    $runtimeDatabasePath = getenv('DB_DATABASE') ?: '';
    $templateDatabasePath = __DIR__.'/../database/vercel.sqlite';

    if ($runtimeDatabasePath !== '' && str_starts_with($runtimeDatabasePath, '/tmp/')) {
        $runtimeDatabaseDirectory = dirname($runtimeDatabasePath);

        if (!is_dir($runtimeDatabaseDirectory)) {
            @mkdir($runtimeDatabaseDirectory, 0777, true);
        }

        if (!file_exists($runtimeDatabasePath)) {
            if (file_exists($templateDatabasePath)) {
                @copy($templateDatabasePath, $runtimeDatabasePath);
            } else {
                @touch($runtimeDatabasePath);
            }
        }
    }
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
