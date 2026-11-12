<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['success' => false, 'message' => 'Method not allowed.']);
}

$in    = input();
$name  = clean($in['full_name'] ?? '', 120);
$phone = clean($in['phone'] ?? '', 20);
$email = clean($in['email'] ?? '', 160);

if ($name === '') {
    respond(422, ['success' => false, 'message' => 'Please enter your name.']);
}
if (!valid_phone($phone)) {
    respond(422, ['success' => false, 'message' => 'Please enter a valid phone number.']);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['success' => false, 'message' => 'Please enter a valid email address.']);
}

try {
    $stmt = db()->prepare('INSERT INTO messages (full_name, phone, email) VALUES (?, ?, ?)');
    $stmt->execute([$name, $phone, $email !== '' ? $email : null]);
    respond(201, ['success' => true]);
} catch (Throwable $e) {
    error_log($e->getMessage());
    respond(500, ['success' => false, 'message' => 'Could not send your message. Please try again.']);
}