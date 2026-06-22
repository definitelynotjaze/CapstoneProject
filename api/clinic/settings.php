<?php
// ================================================================
//  OPTICANA — api/clinic/settings.php
//  GET  — any authenticated user. Returns the single clinic settings row.
//  POST — admin only. Partial update: send only the fields you want to
//         change (clinic info, consultation/scheduling rules, or both
//         in one call — mirrors the 3 separate "Save" buttons in the UI).
// ================================================================

require_once '../../config/db.php';
require_once '../helpers.php';

startSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}

// Maps camelCase request/response keys to snake_case DB columns
const FIELD_MAP = [
    'name'                     => 'name',
    'tagline'                  => 'tagline',
    'address'                  => 'address',
    'phone'                    => 'phone',
    'email'                    => 'email',
    'hours'                    => 'hours',
    'tinNo'                    => 'tin_no',
    'phicNo'                   => 'phic_no',
    'logoUrl'                  => 'logo_url',
    'defaultDuration'          => 'default_duration',
    'maxAdvanceBooking'        => 'max_advance_booking',
    'minAdvanceBooking'        => 'min_advance_booking',
    'maxApptsPerDoctorPerDay'  => 'max_appts_per_doctor_per_day',
    'morningStart'             => 'morning_start',
    'morningEnd'               => 'morning_end',
    'afternoonStart'           => 'afternoon_start',
    'afternoonEnd'             => 'afternoon_end',
    'lunchBreak'               => 'lunch_break',
];

function rowToResponse(array $r): array {
    return [
        'name'                     => $r['name'],
        'tagline'                  => $r['tagline'],
        'address'                  => $r['address'],
        'phone'                    => $r['phone'],
        'mobile'                   => $r['phone'], // mobile always mirrors phone (same as the old client-side behavior)
        'email'                    => $r['email'],
        'hours'                    => $r['hours'],
        'tinNo'                    => $r['tin_no'],
        'phicNo'                   => $r['phic_no'],
        'logoUrl'                  => $r['logo_url'],
        'defaultDuration'          => $r['default_duration'],
        'maxAdvanceBooking'        => $r['max_advance_booking'],
        'minAdvanceBooking'        => $r['min_advance_booking'],
        'maxApptsPerDoctorPerDay'  => (int)$r['max_appts_per_doctor_per_day'],
        'morningStart'             => $r['morning_start'],
        'morningEnd'               => $r['morning_end'],
        'afternoonStart'           => $r['afternoon_start'],
        'afternoonEnd'             => $r['afternoon_end'],
        'lunchBreak'               => (bool)$r['lunch_break'],
        'clinicDays'               => $r['clinic_days'] ? explode(',', $r['clinic_days']) : [],
    ];
}

try {
    $pdo = getDB();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $row = $pdo->query('SELECT * FROM clinic_settings WHERE id = 1 LIMIT 1')->fetch();
        if (!$row) {
            jsonResponse(['success' => false, 'message' => 'Clinic settings not found.'], 404);
        }
        jsonResponse(['success' => true, 'settings' => rowToResponse($row)]);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (($_SESSION['role'] ?? '') !== 'admin') {
            jsonResponse(['success' => false, 'message' => 'Only admins may edit clinic settings.'], 403);
        }

        $b = getBody();
        $sets   = [];
        $values = [];

        foreach (FIELD_MAP as $reqKey => $col) {
            if (!array_key_exists($reqKey, $b)) continue;
            $sets[]   = "`$col` = ?";
            $values[] = $reqKey === 'lunchBreak' ? (int)(bool)$b[$reqKey] : trim((string)$b[$reqKey]);
        }
        if (array_key_exists('clinicDays', $b) && is_array($b['clinicDays'])) {
            $sets[]   = '`clinic_days` = ?';
            $values[] = implode(',', array_map('trim', $b['clinicDays']));
        }

        if ($sets) {
            $values[] = 1; // WHERE id = 1
            $pdo->prepare('UPDATE clinic_settings SET ' . implode(', ', $sets) . ' WHERE id = ?')
                ->execute($values);
        }

        $row = $pdo->query('SELECT * FROM clinic_settings WHERE id = 1 LIMIT 1')->fetch();
        jsonResponse(['success' => true, 'settings' => rowToResponse($row)]);
    }

    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error.'], 500);
}
