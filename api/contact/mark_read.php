<?php
// ================================================================
//  OPTICANA — api/contact/mark_read.php
//  POST { id: N, read: true|false } → mark single message read/unread
//  POST { all: true }                → mark all messages as read
//  admin/staff only.
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

requireMethod('POST');
startSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}

$role = $_SESSION['role'] ?? '';
if (!in_array($role, ['admin', 'staff'], true)) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized.'], 403);
}

$b = getBody();

try {
    $pdo = getDB();

    if (!empty($b['all'])) {
        $pdo->exec('UPDATE contact_messages SET is_read = 1');
        jsonResponse(['success' => true]);
    }

    $id = (int)($b['id'] ?? 0);
    if (!$id) {
        jsonResponse(['success' => false, 'message' => 'id or all is required.']);
    }

    $read = array_key_exists('read', $b) ? (int)(bool)$b['read'] : 1;

    $pdo->prepare('UPDATE contact_messages SET is_read = ? WHERE id = ?')
        ->execute([$read, $id]);

    jsonResponse(['success' => true]);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error.'], 500);
}
