<?php
// ================================================================
//  OPTICANA — config/smtp.php
//  SMTP credentials for outgoing email (PHPMailer).
//  For Gmail: enable 2FA, then generate an App Password at
//  https://myaccount.google.com/apppasswords
// ================================================================

define('SMTP_HOST',      'smtp.gmail.com');
define('SMTP_PORT',      587);                          // TLS
define('SMTP_USERNAME',  'jcjcarlos892@gmail.com');  // sender Gmail address
define('SMTP_PASSWORD',  'ncpyohmvfhnnskiq');                           // Gmail App Password (16-char, no spaces)
define('SMTP_FROM',      'jcjcarlos892@gmail.com');
define('SMTP_FROM_NAME', 'Opticana Clinic');
