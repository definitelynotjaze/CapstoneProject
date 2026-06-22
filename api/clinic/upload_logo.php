<?php
// ================================================================
//  OPTICANA — api/clinic/upload_logo.php
//  POST multipart/form-data { logo: File } — admin only.
//  Saves to brand_assests/clinic-logo.<ext>, updates clinic_settings.logo_url.
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

requireMethod('POST');
startSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}
if (($_SESSION['role'] ?? '') !== 'admin') {
    jsonResponse(['success' => false, 'message' => 'Only admins may change the clinic logo.'], 403);
}

if (empty($_FILES['logo']) || $_FILES['logo']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['success' => false, 'message' => 'No file uploaded.']);
}

$file     = $_FILES['logo'];
$mimeType = mime_content_type($file['tmp_name']);
$allowed  = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

if (!in_array($mimeType, $allowed, true)) {
    jsonResponse(['success' => false, 'message' => 'Invalid file type. Use PNG, JPEG, WebP, or SVG.']);
}

$ext = match ($mimeType) {
    'image/png'     => 'png',
    'image/webp'    => 'webp',
    'image/svg+xml' => 'svg',
    default         => 'jpg',
};

$uploadDir = __DIR__ . '/../../brand_assests/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Remove any previous uploaded logo regardless of extension
foreach (['jpg', 'jpeg', 'png', 'webp', 'svg'] as $e) {
    $old = $uploadDir . 'clinic-logo.' . $e;
    if (file_exists($old)) @unlink($old);
}

$filename = 'clinic-logo.' . $ext;
$destPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    jsonResponse(['success' => false, 'message' => 'Failed to save file. Check server permissions.'], 500);
}

$logoUrl = 'brand_assests/' . $filename;

try {
    $pdo = getDB();
    $pdo->prepare('UPDATE clinic_settings SET logo_url = ? WHERE id = 1')
        ->execute([$logoUrl]);

    jsonResponse(['success' => true, 'logoUrl' => $logoUrl]);
} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error.'], 500);
}
