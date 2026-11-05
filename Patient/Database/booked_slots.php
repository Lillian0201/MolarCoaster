<?php
require __DIR__ . '/config.php';

$date = $_GET['date'] ?? '';
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    respond(400, ['success' => false, 'message' => 'Invalid date.']);
}

try {
    $stmt = db()->prepare("SELECT preferred_time FROM appointments WHERE appointment_date = ? AND status <> 'cancelled'");
    $stmt->execute([$date]);
    respond(200, ['success' => true, 'booked' => array_column($stmt->fetchAll(), 'preferred_time')]);
} catch (Throwable $e) {
    error_log($e->getMessage());
    respond(500, ['success' => false, 'message' => 'Could not load time slots.']);
}