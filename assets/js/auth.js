// ================================================================
//  OPTICANA — auth.js
//  Login, register, logout — backed by PHP API endpoints.
//  API base: /api/auth/  (relative, works with any sub-path)
// ================================================================

// ── Login ────────────────────────────────────────────────────────
function _showLoginError(msg) {
  const errEl  = document.getElementById('login-error')
  const errMsg = document.getElementById('login-error-msg')
  clearTimeout(window._loginErrTimer)
  errMsg.textContent   = msg
  errEl.style.display  = 'flex'
  window._loginErrTimer = setTimeout(() => { errEl.style.display = 'none' }, 5000)
}

async function handleLogin() {
  const email   = document.getElementById('login-email').value.trim()
  const pass    = document.getElementById('login-password').value
  document.getElementById('login-error').style.display = 'none'
  clearTimeout(window._loginErrTimer)

  if (!email || !pass) {
    _showLoginError(
      !email && !pass ? 'Please fill in your email and password.'
    : !email          ? 'Please enter your email address.'
    :                   'Please enter your password.'
    )
    return
  }

  const btn = document.getElementById('login-btn')
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; btn.style.opacity = '0.8' }

  try {
    const res  = await fetch('api/auth/login.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password: pass }),
    })
    const data = await res.json()

    if (!data.success) {
      _showLoginError(data.message || 'The email or password you entered is incorrect. Please try again.')
      _shakeCard()
      document.getElementById('login-password').value = ''
      if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; btn.style.opacity = '1' }
      return
    }

    _bootAfterAuth(data.role, data.user)
  } catch (_) {
    // PHP not available — fall back to client-side credential check
    const match = _clientSideLogin(email, pass)
    if (match) {
      _bootAfterAuth(match.role, match.user)
    } else {
      _showLoginError('The email or password you entered is incorrect. Please try again.')
      _shakeCard()
      document.getElementById('login-password').value = ''
    }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; btn.style.opacity = '1' }
  }
}

// ── Logout ───────────────────────────────────────────────────────
async function logout() {
  try { await fetch('api/auth/logout.php', { method: 'POST' }) } catch (_) {}

  if (window.closeModal) window.closeModal()

  window.state.role            = null
  window.state.user            = null
  window.state.page            = null
  window.state.params          = {}
  window.state.filter          = 'all'
  window.state.selectedRole    = 'admin'
  window.state.sidebarCollapsed = false

  document.getElementById('app-shell').style.display   = 'none'
  document.getElementById('login-screen').style.display = 'flex'
  document.getElementById('login-email').value          = ''
  document.getElementById('login-password').value       = ''
  document.getElementById('login-error').style.display  = 'none'
}

// ── Register ─────────────────────────────────────────────────────
async function handleRegister() {
  const first   = document.getElementById('reg-first').value.trim()
  const last    = document.getElementById('reg-last').value.trim()
  const dob     = document.getElementById('reg-dob').value
  const gender  = document.getElementById('reg-gender').value
  const address = document.getElementById('reg-address').value.trim()
  const contact = document.getElementById('reg-contact').value.trim()
  const blood   = document.getElementById('reg-blood').value
  const email   = document.getElementById('reg-email').value.trim()
  const pass    = document.getElementById('reg-password').value
  const confirm = document.getElementById('reg-confirm').value

  const errEl  = document.getElementById('reg-error')
  const errMsg = document.getElementById('reg-error-msg')
  errEl.style.display = 'none'

  const required = [first, last, dob, gender, address, contact, email, pass, confirm]
  if (required.some(v => !v)) {
    errMsg.textContent = 'Please complete all required fields before proceeding.'
    errEl.style.display = 'flex'; return
  }
  if (pass !== confirm) {
    errMsg.textContent = 'The passwords you entered do not match. Please re-enter your password.'
    errEl.style.display = 'flex'; return
  }
  if (pass.length < 8) {
    errMsg.textContent = 'Password must be at least 8 characters.'
    errEl.style.display = 'flex'; return
  }

  const regBtn = document.getElementById('reg-submit-btn')
  if (regBtn) { regBtn.disabled = true; regBtn.textContent = 'Creating account…' }

  try {
    const res  = await fetch('api/auth/register.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ firstName: first, lastName: last, dob, gender, address, contact, bloodType: blood, email, password: pass }),
    })
    const data = await res.json()

    if (!data.success) {
      errMsg.textContent  = data.message || 'Registration failed. Please try again.'
      errEl.style.display = 'flex'
      return
    }

    // Also push into in-memory patients array so dashboard pages work
    const p = data.user
    patients.push({
      id: p.id, firstName: p.firstName, lastName: p.lastName,
      name: p.name, gender: p.gender, dob: p.dob, age: p.age,
      contact: p.contact, email: p.email, password: '',
      address: p.address, bloodType: p.bloodType,
      registeredDate: p.registeredDate, lastVisit: '—',
      qrData: p.qrData, status: 'active', occupation: '',
      medicalHistory: '', opticalHistory: '',
      consultations: [], examinations: [], prescriptions: [],
    })

    window._showRegistrationQRModal(data.user)
  } catch (_) {
    errMsg.textContent  = 'Network error. Please check your connection and try again.'
    errEl.style.display = 'flex'
  } finally {
    if (regBtn) { regBtn.disabled = false; regBtn.textContent = 'Create Account' }
  }
}

// ── Session restore (called from index.html on page load) ─────────
async function restoreSession() {
  try {
    const res  = await fetch('api/auth/me.php')
    const data = await res.json()
    if (!data.success) return // no active session — login screen stays as-is

    // Sync in-memory state with the logged-in user so pages.js works
    const { role, user } = data
    if (role === 'patient') {
      const idx = patients.findIndex(p => p.id === user.id)
      if (idx === -1) patients.push({ ...user, password: '' })
    }

    _bootAfterAuth(role, user)
  } catch (_) {
    // PHP not available — leave the login screen showing
  }
}

// ── Screen switching ──────────────────────────────────────────────
function showRegister() {
  document.getElementById('login-screen').style.display    = 'none'
  document.getElementById('register-screen').style.display = 'flex'
  ;['reg-first','reg-last','reg-dob','reg-address','reg-contact','reg-email','reg-password','reg-confirm']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = '' })
  document.getElementById('reg-gender').value = ''
  document.getElementById('reg-blood').value  = ''
  document.getElementById('reg-error').style.display = 'none'
}

function showLogin() {
  document.getElementById('register-screen').style.display  = 'none'
  document.getElementById('forgot-screen').style.display    = 'none'
  document.getElementById('login-screen').style.display     = 'flex'
}
window.showLogin = showLogin

function showForgotPassword() {
  document.getElementById('login-screen').style.display  = 'none'
  document.getElementById('forgot-screen').style.display = 'flex'
  fpUpdateDots(1)
  document.querySelectorAll('.fp-step').forEach(s => { s.classList.remove('active'); s.style.display = 'none'; s.style.opacity = '0' })
  const s1 = document.getElementById('fp-step-1')
  s1.style.display = 'block'
  requestAnimationFrame(() => requestAnimationFrame(() => { s1.style.transition = 'opacity 0.3s ease'; s1.style.opacity = '1'; s1.classList.add('active') }))
  const emailEl = document.getElementById('fp-s1-email')
  if (emailEl) { emailEl.value = ''; emailEl.classList.remove('error') }
  document.getElementById('fp-s1-error').classList.remove('show')
  window._fpStep = 1
  window._fpEmail = ''
  clearInterval(window._fpResendCooldownInterval)
  window._fpResendCooldownLeft = 0
}

// ── Forgot Password flow ──────────────────────────────────────────
window._fpStep = 1
window._fpEmail = ''
window._fpResetToken = ''
window._fpTimerInterval = null
window._fpTimeLeft = 300
window._fpResendCooldownInterval = null
window._fpResendCooldownLeft = 0

function fpGoToStep(step) {
  const curId = window._fpStep === 3.5 ? 'fp-step-3b' : 'fp-step-' + window._fpStep
  const cur = document.getElementById(curId)
  if (cur) { cur.style.opacity = '0'; cur.style.transition = 'opacity 0.3s ease' }
  setTimeout(() => {
    if (cur) { cur.classList.remove('active'); cur.style.display = 'none' }
    const nextId = step === 3.5 ? 'fp-step-3b' : 'fp-step-' + step
    const next = document.getElementById(nextId)
    if (!next) return
    next.style.opacity = '0'; next.style.display = 'block'
    window._fpStep = step
    if (step === 5) {
      const c = document.getElementById('fp-success-circle')
      if (c) { c.classList.remove('fp-success-anim'); void c.offsetWidth; c.classList.add('fp-success-anim') }
    }
    if (step === 3) fpStartTimer()
    fpUpdateDots(step)
    requestAnimationFrame(() => requestAnimationFrame(() => { next.style.transition = 'opacity 0.3s ease'; next.style.opacity = '1'; next.classList.add('active') }))
  }, 300)
}

function fpUpdateDots(step) {
  const wrap = document.getElementById('fp-progress-dots')
  if (!wrap) return
  // hide dots on terminal/error steps
  wrap.style.display = (step === 5 || step === 3.5) ? 'none' : 'flex'
  // step → which dot is active (1-based)
  const active = { 1:1, 2:2, 3:2, 4:3, 5:4 }[step] || 1
  for (let i = 1; i <= 4; i++) {
    const d = document.getElementById('fp-dot-' + i)
    if (!d) continue
    d.className = 'fp-dot' + (i === active ? ' active' : i < active ? ' done' : '')
  }
}

async function fpS1Submit() {
  const emailEl = document.getElementById('fp-s1-email')
  const errEl   = document.getElementById('fp-s1-error')
  const btn     = document.getElementById('fp-s1-btn')
  emailEl.classList.remove('error'); errEl.classList.remove('show')
  if (!emailEl.value.trim()) { emailEl.classList.add('error'); errEl.classList.add('show'); emailEl.focus(); return }
  window._fpEmail = emailEl.value.trim()
  btn.disabled = true; btn.innerHTML = '<div class="fp-spinner"></div> Sending…'
  try {
    const res  = await fetch('api/auth/forgot-password.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: window._fpEmail }),
    })
    const data = await res.json()
    if (!data.success) {
      errEl.textContent = data.message || 'Failed to send email. Please try again.'
      errEl.classList.add('show')
      return
    }
    document.getElementById('fp-s2-email').textContent = window._fpEmail
    document.getElementById('fp-s3-email').textContent = window._fpEmail
    fpGoToStep(2)
  } catch (_) {
    errEl.textContent = 'Network error. Please check your connection.'
    errEl.classList.add('show')
  } finally {
    btn.disabled = false; btn.innerHTML = 'Submit'
  }
}

async function fpS3Submit() {
  const inputs = document.querySelectorAll('#fp-otp-row .otp-input')
  const errEl  = document.getElementById('fp-s3-error')
  const btn    = document.getElementById('fp-s3-btn')
  const code   = [...inputs].map(i => i.value).join('')
  inputs.forEach(i => i.classList.remove('error')); errEl.classList.remove('show')
  if (code.length < 6) { inputs.forEach(i => { if (!i.value) i.classList.add('error') }); errEl.classList.add('show'); return }
  btn.disabled = true; btn.innerHTML = '<div class="fp-spinner"></div> Verifying…'
  try {
    const res  = await fetch('api/auth/verify-otp.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: window._fpEmail, otp: code }),
    })
    const data = await res.json()
    if (!data.success) {
      btn.disabled = false; btn.innerHTML = 'Verify OTP'
      fpGoToStep(3.5)
      return
    }
    window._fpResetToken = data.token
    clearInterval(window._fpTimerInterval)
    document.querySelectorAll('#fp-otp-row .otp-input').forEach(i => { i.value = ''; i.classList.remove('error') })
    document.getElementById('fp-s3-error').classList.remove('show')
    btn.disabled = false; btn.innerHTML = 'Verify OTP'
    fpGoToStep(4)
  } catch (_) {
    errEl.textContent = 'Network error. Please try again.'
    errEl.classList.add('show')
    btn.disabled = false; btn.innerHTML = 'Verify OTP'
  }
}

async function fpS4Submit() {
  const pw1  = document.getElementById('fp-s4-pw1')
  const pw2  = document.getElementById('fp-s4-pw2')
  const err1 = document.getElementById('fp-s4-err1')
  const err2 = document.getElementById('fp-s4-err2')
  const btn  = document.getElementById('fp-s4-btn')
  pw1.classList.remove('error'); pw2.classList.remove('error'); err1.classList.remove('show'); err2.classList.remove('show')
  let valid = true
  if (!pw1.value) { pw1.classList.add('error'); err1.textContent = 'Please enter a new password.'; err1.classList.add('show'); valid = false }
  else if (pw1.value.length < 8) { pw1.classList.add('error'); err1.textContent = 'Password must be at least 8 characters.'; err1.classList.add('show'); valid = false }
  if (!pw2.value) { pw2.classList.add('error'); err2.textContent = 'Please confirm your password.'; err2.classList.add('show'); valid = false }
  else if (pw1.value && pw2.value !== pw1.value) { pw2.classList.add('error'); err2.textContent = 'Passwords do not match.'; err2.classList.add('show'); valid = false }
  if (!valid) return
  btn.disabled = true; btn.innerHTML = '<div class="fp-spinner"></div> Saving…'
  try {
    const res  = await fetch('api/auth/reset-password.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: window._fpResetToken, password: pw1.value }),
    })
    const data = await res.json()
    if (!data.success) {
      err1.textContent = data.message || 'Password reset failed. Please start over.'
      err1.classList.add('show')
      pw1.classList.add('error')
      return
    }
    fpGoToStep(5)
  } catch (_) {
    err1.textContent = 'Network error. Please try again.'
    err1.classList.add('show')
  } finally {
    btn.disabled = false; btn.innerHTML = 'Reset Password'
  }
}

function fpRetryOTP() {
  document.querySelectorAll('#fp-otp-row .otp-input').forEach(i => { i.value = ''; i.classList.remove('error') })
  document.getElementById('fp-s3-error').classList.remove('show')
  document.getElementById('fp-s3-btn').disabled = false
  document.getElementById('fp-s3-btn').innerHTML = 'Verify OTP'
  document.getElementById('fp-otp-timer').classList.remove('expired')
  document.getElementById('fp-otp-timer').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Expires in <span id="fp-timer-display">5:00</span>'
  const cur = document.getElementById('fp-step-3b')
  cur.style.opacity = '0'
  setTimeout(() => {
    cur.classList.remove('active'); cur.style.display = 'none'; window._fpStep = 3
    const next = document.getElementById('fp-step-3')
    next.style.opacity = '0'; next.style.display = 'block'
    requestAnimationFrame(() => requestAnimationFrame(() => { next.style.transition = 'opacity 0.3s ease'; next.style.opacity = '1'; next.classList.add('active'); fpStartTimer() }))
  }, 300)
}

async function fpResendOTP() {
  if (window._fpResendCooldownLeft > 0) return
  fpStartResendCooldown()
  document.getElementById('fp-otp-timer').classList.remove('expired')
  document.getElementById('fp-otp-timer').innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Expires in <span id="fp-timer-display">5:00</span>'
  document.querySelectorAll('#fp-otp-row .otp-input').forEach(i => { i.value = ''; i.classList.remove('error') })
  document.getElementById('fp-s3-error').classList.remove('show')
  try {
    await fetch('api/auth/forgot-password.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: window._fpEmail }),
    })
  } catch (_) { /* fail silently — timer still restarts */ }
  document.querySelectorAll('#fp-otp-row .otp-input')[0].focus()
  fpStartTimer()
}

function fpStartTimer() {
  clearInterval(window._fpTimerInterval)
  window._fpTimeLeft = 300
  function tick() {
    const display = document.getElementById('fp-timer-display')
    const timerEl = document.getElementById('fp-otp-timer')
    if (!display) { clearInterval(window._fpTimerInterval); return }
    const m = Math.floor(window._fpTimeLeft / 60), s = window._fpTimeLeft % 60
    display.textContent = m + ':' + String(s).padStart(2, '0')
    if (window._fpTimeLeft <= 0) {
      clearInterval(window._fpTimerInterval)
      timerEl.classList.add('expired')
      timerEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Code expired'
    }
    window._fpTimeLeft--
  }
  tick()
  window._fpTimerInterval = setInterval(tick, 1000)
}

function fpStartResendCooldown() {
  const btn = document.querySelector('.fp-resend-link')
  if (!btn) return
  clearInterval(window._fpResendCooldownInterval)
  window._fpResendCooldownLeft = 60
  btn.disabled = true
  function tick() {
    if (!btn.isConnected) { clearInterval(window._fpResendCooldownInterval); window._fpResendCooldownLeft = 0; return }
    const s = window._fpResendCooldownLeft
    btn.textContent = 'Resend in 0:' + String(s).padStart(2, '0')
    if (s <= 0) {
      clearInterval(window._fpResendCooldownInterval)
      btn.disabled = false
      btn.textContent = 'Resend Code'
      return
    }
    window._fpResendCooldownLeft--
  }
  tick()
  window._fpResendCooldownInterval = setInterval(tick, 1000)
}

// Init OTP inputs for forgot-password
;(function() {
  function setupFpOTP() {
    const inputs = document.querySelectorAll('#fp-otp-row .otp-input')
    inputs.forEach((input, idx) => {
      input.addEventListener('input', e => {
        const val = e.target.value.replace(/\D/g, '')
        e.target.value = val ? val[0] : ''
        if (val && idx < 5) inputs[idx + 1].focus()
      })
      input.addEventListener('keydown', e => { if (e.key === 'Backspace' && !e.target.value && idx > 0) inputs[idx - 1].focus() })
      input.addEventListener('paste', e => {
        e.preventDefault()
        const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '')
        ;[...pasted].slice(0, 6).forEach((ch, i) => { if (inputs[idx + i]) inputs[idx + i].value = ch })
        inputs[Math.min(idx + pasted.length, 5)].focus()
      })
    })
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupFpOTP)
  else setupFpOTP()
})()

function fpTogglePw(inputId, iconId) {
  const EYE_OPEN   = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
  const EYE_CLOSED = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
  const input = document.getElementById(inputId)
  const icon  = document.getElementById(iconId)
  if (input.type === 'password') { input.type = 'text'; icon.innerHTML = EYE_CLOSED }
  else { input.type = 'password'; icon.innerHTML = EYE_OPEN }
}

// ── Private helpers ───────────────────────────────────────────────
function _bootAfterAuth(role, user) {
  window.state.role         = role
  window.state.user         = user
  window.state.selectedRole = role

  document.getElementById('login-screen').style.display    = 'none'
  document.getElementById('register-screen').style.display = 'none'
  document.getElementById('app-shell').style.display       = 'flex'

  window.bootShell(role, user)

  // Load real data from backend (non-blocking)
  _syncAppointments()
  _syncNotifications()
  _syncClinicSettings()
  _syncServices()
  if (role === 'admin') { _syncActivityLog(); _syncStaff(); _syncArchives() }
  if (role === 'staff') _syncStaff()
  if (['admin', 'staff', 'doctor'].includes(role)) { _syncPatients(); _syncDoctors() }
  if (['admin', 'staff'].includes(role)) _syncContactMessages()
}

// Pages that show appointments list — need full re-render when data changes
const _APPT_PAGES = new Set([
  'appointments','patient-appts','doctor-appointments'
])

async function _syncAppointments(rerender = true) {
  try {
    const r = await fetch('api/appointments/index.php')
    if (!r.ok) return
    const d = await r.json()
    if (!d.success || !Array.isArray(d.appointments)) return
    // Replace the mock array in-place so all existing references stay valid
    appointments.splice(0, appointments.length, ...d.appointments)
    const page = window.state?.page
    if (rerender && _APPT_PAGES.has(page)) { window.renderPage(); return }
    // Update dashboard stat cards and charts without a full re-render
    if (page === 'admin-dashboard' && window.updateAdminDashboard) window.updateAdminDashboard()
    if (page === 'staff-dashboard' && window.updateStaffDashboard) window.updateStaffDashboard()
    if (page === 'doctor-dashboard' && window.renderPage) window.renderPage()
    if (page === 'patient-dashboard' && window.renderPage) window.renderPage()
  } catch (_) { /* keep mock data on network failure */ }
}
window._syncAppointments = _syncAppointments

// ── Patients sync ────────────────────────────────────────────────
async function _syncPatients() {
  try {
    const r = await fetch('api/patients/index.php')
    if (!r.ok) return
    const d = await r.json()
    if (!d.success || !Array.isArray(d.patients)) return
    patients.splice(0, patients.length, ...d.patients)
    // Re-render page if it shows patients list
    const p = window.state?.page
    if (p === 'patient-list') { window.renderPage(); return }
    if (p === 'new-examination' && window.state?.params?.patientId) { window.renderPage(); return }
    // Update dashboard stat without full re-render
    if (p === 'admin-dashboard' && window.updateAdminDashboard) window.updateAdminDashboard()
    if (p === 'staff-dashboard' && window.updateStaffDashboard) window.updateStaffDashboard()
    if (p === 'admin-users' && window.renderPage) window.renderPage()
  } catch (_) {}
}
window._syncPatients = _syncPatients

// ── Doctors sync ──────────────────────────────────────────────────
async function _syncDoctors() {
  try {
    const r = await fetch('api/doctors/index.php')
    if (!r.ok) return
    const d = await r.json()
    if (!d.success || !Array.isArray(d.doctors)) return
    doctors.splice(0, doctors.length, ...d.doctors)
    const _dp = window.state?.page
    if (_dp === 'admin-dashboard' && window.updateAdminDashboard) window.updateAdminDashboard()
    if (_dp === 'staff-dashboard' && window.updateStaffDashboard) window.updateStaffDashboard()
    if (_dp === 'schedule' && window.renderPage) window.renderPage()
    if (_dp === 'admin-users' && window.renderPage) window.renderPage()
  } catch (_) { /* keep mock data on network failure */ }
}
window._syncDoctors = _syncDoctors

// ── Staff & Admin sync ────────────────────────────────────────────
async function _syncStaff() {
  try {
    const r = await fetch('api/staff/index.php')
    if (!r.ok) return
    const d = await r.json()
    if (!d.success) return
    if (Array.isArray(d.staff))  staff.splice(0,  staff.length,  ...d.staff)
    if (Array.isArray(d.admins)) admins.splice(0, admins.length, ...d.admins)
    // Re-render user management page if currently open so photos appear
    if (window.state?.page === 'admin-users' && window.renderPage) window.renderPage()
  } catch (_) {}
}
window._syncStaff = _syncStaff

// ── Archived records sync ─────────────────────────────────────────
async function _syncArchives() {
  try {
    const r = await fetch('api/archive/index.php')
    if (!r.ok) return
    const d = await r.json()
    if (!d.success || !Array.isArray(d.records)) return
    archivedRecords.splice(0, archivedRecords.length, ...d.records)
    if (window.state?.page === 'admin-settings' && window.state?.params?.filter === 'archives' && window.renderPage) window.renderPage()
  } catch (_) {}
}
window._syncArchives = _syncArchives

// ── Contact messages sync ──────────────────────────────────────────
window._contactUnreadCount = 0

async function _syncContactMessages() {
  try {
    const r = await fetch('api/contact/index.php')
    if (!r.ok) return
    const d = await r.json()
    if (!d.success || !Array.isArray(d.messages)) return
    contactMessages.splice(0, contactMessages.length, ...d.messages)
    window._contactUnreadCount = d.unread_count || 0
    if (window._updateSidebarBadges) window._updateSidebarBadges()
    if (window.state?.page === 'contact-messages' && window.renderPage) window.renderPage()
  } catch (_) {}
}
window._syncContactMessages = _syncContactMessages

// ── Clinic settings + services sync ─────────────────────────────────
const _CLINIC_SETTINGS_PAGES = new Set([
  'admin-settings', 'doctor-availability', 'patient-appts', 'patient-dashboard'
])

async function _syncClinicSettings() {
  try {
    const r = await fetch('api/clinic/settings.php')
    if (!r.ok) return
    const d = await r.json()
    if (!d.success || !d.settings) return
    const s = d.settings
    Object.assign(clinicInfo, {
      name: s.name, tagline: s.tagline, address: s.address, phone: s.phone,
      mobile: s.mobile, email: s.email, hours: s.hours, tinNo: s.tinNo, phicNo: s.phicNo,
      logoUrl: s.logoUrl
    })
    Object.assign(consultationSettings, {
      defaultDuration: s.defaultDuration, maxAdvanceBooking: s.maxAdvanceBooking,
      minAdvanceBooking: s.minAdvanceBooking, maxApptsPerDoctorPerDay: s.maxApptsPerDoctorPerDay,
      morningStart: s.morningStart, morningEnd: s.morningEnd,
      afternoonStart: s.afternoonStart, afternoonEnd: s.afternoonEnd,
      lunchBreak: s.lunchBreak, clinicDays: s.clinicDays
    })
    if (s.logoUrl) window._clinicLogoUrl = s.logoUrl
    if (window.renderSidebar) window.renderSidebar()
    if (window.renderTopbar) window.renderTopbar()
    if (_CLINIC_SETTINGS_PAGES.has(window.state?.page) && window.renderPage) window.renderPage()
  } catch (_) {}
}
window._syncClinicSettings = _syncClinicSettings

async function _syncServices() {
  try {
    const r = await fetch('api/services/index.php')
    if (!r.ok) return
    const d = await r.json()
    if (!d.success || !Array.isArray(d.services)) return
    CLINIC_SERVICES.splice(0, CLINIC_SERVICES.length, ...d.services)
    _svcNextId = Math.max(0, ...d.services.map(s => s.id)) + 1
    if (_CLINIC_SETTINGS_PAGES.has(window.state?.page) && window.renderPage) window.renderPage()
  } catch (_) {}
}
window._syncServices = _syncServices

// ── Notifications sync ────────────────────────────────────────────
window._notifications = []
window._unreadCount   = 0

async function _syncNotifications() {
  try {
    const r = await fetch('api/notifications/index.php')
    if (!r.ok) return
    const d = await r.json()
    if (!d.success) return
    window._notifications = d.notifications || []
    window._unreadCount   = d.unread_count  || 0
    if (window._updateNotifUI) window._updateNotifUI()
  } catch (_) {}
}
window._syncNotifications = _syncNotifications

// ── Activity log sync ─────────────────────────────────────────────
async function _syncActivityLog() {
  try {
    const r = await fetch('api/activity/log.php')
    if (!r.ok) return
    const d = await r.json()
    if (!d.success || !Array.isArray(d.logs)) return
    activityLog.splice(0, activityLog.length, ...d.logs)
    const page = window.state?.page
    if (page === 'activity-log') window.renderPage()
    else if (page === 'admin-dashboard' && window.updateAdminDashboard) window.updateAdminDashboard()
  } catch (_) {}
}
window._syncActivityLog = _syncActivityLog

function _clientSideLogin(email, pass) {
  const sources = [
    { list: typeof admins  !== 'undefined' ? admins  : [], role: 'admin'   },
    { list: typeof doctors !== 'undefined' ? doctors : [], role: 'doctor'  },
    { list: typeof staff   !== 'undefined' ? staff   : [], role: 'staff'   },
    { list: typeof patients!== 'undefined' ? patients: [], role: 'patient' },
  ]
  for (const { list, role } of sources) {
    const u = list.find(x => x.email === email && x.password === pass)
    if (u) {
      const user = Object.assign({}, u)
      delete user.password
      return { role, user }
    }
  }
  return null
}

function _shakeCard() {
  const card = document.querySelector('.login-card')
  if (!card) return
  card.classList.remove('login-shake')
  void card.offsetWidth
  card.classList.add('login-shake')
  card.addEventListener('animationend', () => card.classList.remove('login-shake'), { once: true })
}

function toggleLoginPw() {
  const input = document.getElementById('login-password')
  const icon  = document.getElementById('login-eye-icon')
  const EYE_OPEN   = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
  const EYE_CLOSED = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
  if (input.type === 'password') { input.type = 'text'; icon.innerHTML = EYE_CLOSED }
  else { input.type = 'password'; icon.innerHTML = EYE_OPEN }
}
