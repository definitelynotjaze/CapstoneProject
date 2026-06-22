<?php
// ================================================================
//  OPTICANA — api/helpers.php
//  Shared utilities for all API endpoints.
// ================================================================

function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function requireMethod(string $method): void {
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
        jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
    }
}

function getBody(): array {
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function startSession(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'lifetime' => 86400,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);
        session_start();
    }
}

// Parses clinic_settings.min_advance_booking ('Same day','1 day','2 days','3 days')
// into the minimum number of days ahead a booking must be made.
function minAdvanceBookingDays(PDO $pdo): int {
    $val = $pdo->query('SELECT min_advance_booking FROM clinic_settings WHERE id = 1 LIMIT 1')->fetchColumn();
    if (!$val || stripos($val, 'same') !== false) return 0;
    if (preg_match('/(\d+)/', $val, $m)) return (int)$m[1];
    return 1;
}

// ── Build the frontend-compatible user object ─────────────────────
// Maps snake_case DB columns to camelCase keys expected by pages.js.
function buildUserObject(string $role, array $p, string $email, array $days = []): array {
    $base = [
        'id'        => $p['id'],
        'firstName' => $p['first_name'],
        'lastName'  => $p['last_name'],
        'name'      => ($role === 'doctor' ? 'Dr. ' : '') . $p['first_name'] . ' ' . $p['last_name'],
        'email'     => $email,
        'contact'   => $p['contact'] ?? '',
        'status'    => $p['status']  ?? 'active',
        'role'      => $role,
        'photoUrl'  => $p['photo_url'] ?? null,
    ];

    if ($role === 'doctor') {
        return array_merge($base, [
            'specialization' => $p['specialization'] ?? 'Optometrist',
            'available'      => (bool)($p['available'] ?? true),
            'days'           => $days,
            'hours'          => $p['work_hours'] ?? '',
        ]);
    }

    if ($role === 'patient') {
        return array_merge($base, [
            'gender'         => $p['gender']          ?? '',
            'dob'            => $p['dob']              ?? '',
            'age'            => (int)($p['age']        ?? 0),
            'address'        => $p['address']          ?? '',
            'bloodType'      => $p['blood_type']       ?? '',
            'occupation'     => $p['occupation']       ?? '',
            'medicalHistory' => $p['medical_history']  ?? '',
            'opticalHistory' => $p['optical_history']  ?? '',
            'qrData'         => $p['qr_data']          ?? '',
            'registeredDate' => $p['registered_date']  ?? '',
            'lastVisit'      => $p['last_visit'] ?: '—',
            'consultations'  => [],
            'examinations'   => [],
            'prescriptions'  => [],
        ]);
    }

    return $base;
}

// ── Notification helpers ─────────────────────────────────────────
function createNotification(PDO $pdo, int $userId, string $type, string $title, string $body): void {
    try {
        $pdo->prepare(
            'INSERT INTO notifications (user_id, type, title, body) VALUES (?, ?, ?, ?)'
        )->execute([$userId, $type, $title, $body]);
    } catch (PDOException) {
        // Non-critical — silent fail
    }
}

function notifyAdminStaff(PDO $pdo, string $type, string $title, string $body): void {
    try {
        $ids  = $pdo->query("SELECT id FROM users WHERE role IN ('admin','staff') AND is_active = 1")->fetchAll();
        $stmt = $pdo->prepare('INSERT INTO notifications (user_id, type, title, body) VALUES (?, ?, ?, ?)');
        foreach ($ids as $row) {
            $stmt->execute([(int)$row['id'], $type, $title, $body]);
        }
    } catch (PDOException) {
        // Non-critical — silent fail
    }
}

// ── Fetch profile row + build user object for a given user_id ────
function loadUserProfile(PDO $pdo, int $userId, string $role): ?array {
    $profile = null;
    $days    = [];

    switch ($role) {
        case 'admin':
            $s = $pdo->prepare('SELECT * FROM admins WHERE user_id = ? LIMIT 1');
            $s->execute([$userId]);
            $profile = $s->fetch() ?: null;
            break;

        case 'staff':
            $s = $pdo->prepare('SELECT * FROM staff WHERE user_id = ? LIMIT 1');
            $s->execute([$userId]);
            $profile = $s->fetch() ?: null;
            break;

        case 'doctor':
            $s = $pdo->prepare('SELECT * FROM doctors WHERE user_id = ? LIMIT 1');
            $s->execute([$userId]);
            $profile = $s->fetch() ?: null;
            if ($profile) {
                $ds = $pdo->prepare(
                    'SELECT day_of_week FROM doctor_days WHERE doctor_id = ?
                     ORDER BY FIELD(day_of_week,"Mon","Tue","Wed","Thu","Fri","Sat","Sun")'
                );
                $ds->execute([$profile['id']]);
                $days = array_column($ds->fetchAll(), 'day_of_week');
            }
            break;

        case 'patient':
            $s = $pdo->prepare('SELECT * FROM patients WHERE user_id = ? LIMIT 1');
            $s->execute([$userId]);
            $profile = $s->fetch() ?: null;
            break;
    }

    // Fetch photo_url separately so a missing column (pre-migration) never breaks auth
    if ($profile) {
        try {
            $ps = $pdo->prepare('SELECT photo_url FROM users WHERE id = ? LIMIT 1');
            $ps->execute([$userId]);
            $photoRow = $ps->fetch();
            $profile['photo_url'] = $photoRow['photo_url'] ?? null;
        } catch (PDOException) {
            $profile['photo_url'] = null;
        }
    }

    return $profile ? ['profile' => $profile, 'days' => $days] : null;
}
