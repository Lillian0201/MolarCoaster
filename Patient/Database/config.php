<?php
// Database connection + small helpers shared by the API endpoints.
// Set real credentials with environment variables (or edit the defaults for local XAMPP).

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $name = getenv('DB_NAME') ?: 'molarcoaster';
        $user = getenv('DB_USER') ?: 'root';
        $pass = getenv('DB_PASS') ?: '';
        $pdo = new PDO("mysql:host=$host;dbname=$name;charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

function respond(int $status, array $body): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body);
    exit;
}

// Reads a JSON body (what our JavaScript sends) or falls back to normal form fields.
function input(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $_POST;
}

function clean($v, int $max): string {
    return mb_substr(trim((string)($v ?? '')), 0, $max);
}

function valid_phone(string $p): bool {
    return (bool)preg_match('/^[0-9+\s\-()]{7,15}$/', $p);
}

// Clinic hours: Mon-Fri 9AM-6PM, Sat 9AM-2PM, closed Sunday.
// Returns the allowed start times (as "9:00 AM") for a Y-m-d date.
function slots_for(string $ymd): array {
    $d = DateTime::createFromFormat('Y-m-d', $ymd);
    if (!$d || $d->format('Y-m-d') !== $ymd) return [];
    $dow = (int)$d->format('w');
    if ($dow === 0) return [];
    $last = $dow === 6 ? 13 : 17;
    $out = [];
    for ($h = 9; $h <= $last; $h++) {
        $out[] = (($h % 12) ?: 12) . ':00 ' . ($h >= 12 ? 'PM' : 'AM');
    }
    return $out;
}