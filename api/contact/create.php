<?php
// ================================================================
//  OPTICANA — api/contact/create.php
//  POST — public endpoint, no auth required.
//  Body: { name, email, service, message }
//  → { success:true, id:N }
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

requireMethod('POST');

$b = getBody();

$name    = trim($b['name']    ?? '');
$email   = trim($b['email']   ?? '');
$service = trim($b['service'] ?? '');
$message = trim($b['message'] ?? '');

if (!$name || !$email || !$message) {
    jsonResponse(['success' => false, 'message' => 'Name, email and message are required.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Please enter a valid email address.']);
}

if (mb_strlen($name) > 150 || mb_strlen($email) > 150 || mb_strlen($service) > 100) {
    jsonResponse(['success' => false, 'message' => 'One of the fields is too long.']);
}

try {
    $pdo = getDB();

    $pdo->prepare(
        'INSERT INTO contact_messages (name, email, service, message) VALUES (?, ?, ?, ?)'
    )->execute([$name, $email, $service ?: null, $message]);

    $newId = (int)$pdo->lastInsertId();

    $excerpt = mb_strlen($message) > 80 ? mb_substr($message, 0, 80) . '…' : $message;
    notifyAdminStaff($pdo, 'contact_message', 'New Contact Message',
        "{$name} sent a message: \"{$excerpt}\""
    );

    jsonResponse(['success' => true, 'id' => $newId]);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error. Please try again.'], 500);
}
