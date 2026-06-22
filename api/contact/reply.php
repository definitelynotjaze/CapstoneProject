<?php
// ================================================================
//  OPTICANA — api/contact/reply.php
//  POST { id, reply } — admin/staff only.
//  Saves the reply and emails the original sender via SMTP (best-effort —
//  the reply is still saved even if the email fails to send). Email is
//  the only delivery channel; there is no in-app patient inbox.
// ================================================================

require_once '../../config/db.php';
require_once '../../config/smtp.php';
require_once '../../vendor/autoload.php';
require_once '../helpers.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

requireMethod('POST');
startSession();

if (!isset($_SESSION['user_id'])) {
    jsonResponse(['success' => false, 'message' => 'Not authenticated.'], 401);
}

$role = $_SESSION['role'] ?? '';
if (!in_array($role, ['admin', 'staff'], true)) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized.'], 403);
}

$b     = getBody();
$id    = (int)($b['id'] ?? 0);
$reply = trim($b['reply'] ?? '');

if (!$id || !$reply) {
    jsonResponse(['success' => false, 'message' => 'Reply text is required.']);
}

try {
    $pdo = getDB();

    $s = $pdo->prepare('SELECT * FROM contact_messages WHERE id = ? LIMIT 1');
    $s->execute([$id]);
    $msg = $s->fetch();
    if (!$msg) {
        jsonResponse(['success' => false, 'message' => 'Message not found.'], 404);
    }

    $userId      = (int)$_SESSION['user_id'];
    $profileInfo = loadUserProfile($pdo, $userId, $role);
    $replierName = 'Cana Optical Clinic';
    if ($profileInfo && !empty($profileInfo['profile'])) {
        $p    = $profileInfo['profile'];
        $name = trim(($p['first_name'] ?? '') . ' ' . ($p['last_name'] ?? ''));
        if ($name) $replierName = $name;
    }

    $pdo->prepare('UPDATE contact_messages SET reply = ?, replied_by = ?, replied_at = NOW() WHERE id = ?')
        ->execute([$reply, $replierName, $id]);

    // Email the reply to the original sender (best-effort — don't fail the request if SMTP is down)
    $emailSent = false;
    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USERNAME;
        $mail->Password   = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = SMTP_PORT;

        $mail->setFrom(SMTP_FROM, SMTP_FROM_NAME);
        $mail->addAddress($msg['email'], $msg['name']);
        $mail->isHTML(true);
        $mail->Subject = 'Re: Your message to Cana Optical Clinic';
        $mail->Body    = replyEmailBody($msg['name'], $msg['message'], $reply, $replierName);
        $mail->AltBody = "Hi {$msg['name']},\n\n{$reply}\n\n— {$replierName}, Cana Optical Clinic";

        $mail->send();
        $emailSent = true;
    } catch (Exception $e) {
        // Non-fatal — reply is already saved
    }

    jsonResponse(['success' => true, 'emailSent' => $emailSent]);

} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Database error.'], 500);
}

function replyEmailBody(string $name, string $original, string $reply, string $replierName): string {
    $safeOriginal = nl2br(htmlspecialchars($original));
    $safeReply    = nl2br(htmlspecialchars($reply));

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Reply from Cana Optical Clinic</title>
</head>
<body style="margin:0;padding:0;background:#f0f1f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f0f1f5;padding:48px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" role="presentation"
             style="background:#ffffff;border-radius:16px;overflow:hidden;
                    box-shadow:0 4px 24px rgba(0,0,0,0.09),0 1px 4px rgba(0,0,0,0.05);
                    max-width:520px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#E8760A 0%,#C4620A 100%);padding:28px 40px;text-align:center;">
            <div style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:1px;">OPTICANA</div>
            <div style="font-size:11px;font-weight:500;letter-spacing:2px;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-top:2px;">Cana Optical Clinic</div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 8px;">
            <p style="margin:0 0 4px;font-size:14px;color:#1C1C1C;">Hi {$name},</p>
            <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
              {$replierName} from Cana Optical Clinic replied to your message:
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 20px;">
            <div style="background:#FFF8F0;border:1.5px solid #FFD9A8;border-radius:10px;padding:18px 20px;font-size:14px;color:#1C1C1C;line-height:1.65;">
              {$safeReply}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px 32px;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#9ca3af;">Your message</p>
            <div style="border-left:3px solid #e5e7eb;padding:4px 0 4px 14px;font-size:13px;color:#6b7280;line-height:1.6;">
              {$safeOriginal}
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f8f8fb;padding:18px 40px;border-top:1px solid #f0f0f4;text-align:center;">
            <p style="margin:0;font-size:11px;color:#b0b7c3;">&copy; Opticana &nbsp;&bull;&nbsp; Cana Optical Clinic</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}
