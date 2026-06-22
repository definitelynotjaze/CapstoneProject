// ================================================================
//  OPTICANA — pages.js
//  All page renderer functions. Each returns an HTML string.
//  Uses window.icon(), window.state, window.navigate() etc.
// ================================================================

// ── Shared helpers ──────────────────────────────────────────────
function ic(name, cls = 'icon')  { return window.icon(name, cls) }
function st()                    { return window.state }

function badge(status) {
  const map = {
    pending:     'badge-pending',     approved:    'badge-approved',
    cancelled:   'badge-cancelled',   disapproved: 'badge-disapproved',
    completed:   'badge-completed',   active:      'badge-active',
    inactive:    'badge-inactive',    admin:       'badge-admin',
    staff:       'badge-staff',       doctor:      'badge-doctor',
    patient:     'badge-patient'
  }
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return `<span class="badge ${map[status] || ''}">${label}</span>`
}

function initials(name) {
  return name.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase()
}

function avatar(name, cls = 'patient-avatar', photoUrl = null) {
  if (photoUrl) return `<div class="${cls}" style="padding:0;overflow:hidden;background:transparent"><img src="${photoUrl}" alt="${name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block"></div>`
  return `<div class="${cls}">${initials(name)}</div>`
}

function fmtDate(d) {
  if (!d || d === '—') return '—'
  const dt = new Date(d)
  return isNaN(dt) ? d : dt.toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' })
}

function apptActions(a, role) {
  if (role === 'patient') return ''
  if (role === 'doctor')  return `
    <div style="display:flex;gap:4px">
      <button class="btn-icon" title="View Details" onclick="window.viewAppt('${a.id}')">${ic('eye','icon-sm')}</button>
      <button class="btn-icon" title="Patient Record" onclick="window.navigate('patient-view',{patientId:'${a.patientId}',patientName:'${a.patientName}'})">${ic('user','icon-sm')}</button>
    </div>`
  const rescheduleFlag = a.rescheduleRequest ? `<span title="Patient requested reschedule" style="display:inline-flex;align-items:center;gap:3px;font-size:.68rem;font-weight:600;color:#C2410C;background:#FFF7ED;border:1px solid #FED7AA;border-radius:999px;padding:1px 7px;white-space:nowrap">${ic('refresh-cw','icon-xs')} Reschedule Req.</span>` : ''
  return `
    <div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap">
      ${rescheduleFlag}
      <button class="btn-icon" title="View Details" onclick="window.viewAppt('${a.id}')">${ic('eye','icon-sm')}</button>
      ${a.status === 'pending' ? `
        <button class="btn-icon" title="Approve" style="color:#059669" onclick="window.approveAppt('${a.id}')">${ic('check','icon-sm')}</button>
        <button class="btn-icon" title="Disapprove" style="color:#D97706" onclick="window.disapproveAppt('${a.id}')">${ic('x-circle','icon-sm')}</button>
        <button class="btn-icon" title="Reschedule" onclick="window.rescheduleAppt('${a.id}')">${ic('refresh-cw','icon-sm')}</button>
        <button class="btn-icon" title="Cancel Appointment" style="color:#DC2626" onclick="window.confirmCancelAppt('${a.id}')">${ic('x','icon-sm')}</button>` : ''}
      ${a.status === 'approved' ? `
        <button class="btn-icon" title="Mark Completed" style="color:#059669" onclick="window.markApptCompleted('${a.id}')">${ic('check-circle','icon-sm')}</button>
        <button class="btn-icon" title="Reschedule" onclick="window.rescheduleAppt('${a.id}')">${ic('refresh-cw','icon-sm')}</button>
        <button class="btn-icon" title="Cancel" style="color:#DC2626" onclick="window.confirmCancelAppt('${a.id}')">${ic('x','icon-sm')}</button>` : ''}
    </div>`
}

function appointmentsTable(list, role, tbodyId = 'appt-tbody') {
  if (!list.length) return `<div class="table-empty">No appointments found.</div>`
  return `
    <table class="tbl">
      <colgroup>
        <col style="width:6%"><col style="width:18%"><col style="width:18%">
        <col style="width:12%"><col style="width:10%"><col style="width:16%">
        <col style="width:20%">
      </colgroup>
      <thead><tr>
        <th>ID</th>
        <th data-sort-key="patient" data-sort-type="text">Patient</th>
        <th>Doctor</th>
        <th data-sort-key="date" data-sort-type="date">Date</th>
        <th>Time</th><th>Type</th>
        ${role !== 'patient' ? '<th>Actions</th>' : ''}
      </tr></thead>
      <tbody id="${tbodyId}">
        ${list.map(a => `<tr data-search="${(a.patientName||'').toLowerCase()} ${String(a.patientId||'').toLowerCase()} ${(a.doctorName||'').toLowerCase()} ${(a.type||'').toLowerCase()}" data-appt-status="${a.status}" data-sort-patient="${(a.patientName||'').toLowerCase()}" data-sort-date="${a.date}">
          <td><code style="font-size:.75rem;color:#9CA3AF">${a.id}</code></td>
          <td><div class="patient-name-cell">
            ${avatar(a.patientName, 'patient-avatar', patients.find(p=>p.id===a.patientId)?.photoUrl || null)}
            <div class="patient-name-info"><strong>${a.patientName}</strong><span>${a.patientId}</span></div>
          </div></td>
          <td style="font-size:.82rem">${a.doctorName}</td>
          <td style="font-size:.82rem">${fmtDate(a.date)}</td>
          <td style="font-size:.82rem;white-space:nowrap">${a.time}</td>
          <td style="font-size:.82rem">${a.type}</td>
          ${role !== 'patient' ? `<td>${apptActions(a, role)}</td>` : ''}
        </tr>`).join('')}
      </tbody>
    </table>`
}

// ════════════════════════════════════════════════════════════════
//  ADMIN — DASHBOARD
// ════════════════════════════════════════════════════════════════
function pageAdminDashboard() {
  window.state.afterRender = () => {
    window._charts.initAppointmentsChart()
    window._charts.initPatientGrowthChart()
    window.updateAdminDashboard()
  }

  // ── Real stat values ──────────────────────────────────────────
  const _todayStr   = new Date().toISOString().split('T')[0]
  const _todayCnt   = appointments.filter(a => a.date === _todayStr && !['cancelled','disapproved'].includes(a.status)).length
  const _completedCnt = appointments.filter(a => a.status === 'completed').length
  const _cancelledCnt = appointments.filter(a => a.status === 'cancelled').length
  const _totalDocs  = doctors.length
  const _availDocs  = doctors.filter(d => d.status === 'active' && d.available).length
  const STATS = {
    patients:    { value: String(patients.length),       delta: `${patients.filter(p=>p.status==='active').length} active`,  deltaColor: '#10B981' },
    appointments:{ value: String(appointments.length),   delta: `${appointments.filter(a=>a.status==='pending').length} pending`, deltaColor: '#10B981' },
    doctors:     { value: `${_availDocs}/${_totalDocs}`, delta: 'Available today',        deltaColor: '#9CA3AF' },
    today:       { value: String(_todayCnt),             delta: 'Scheduled for today',      deltaColor: '#9CA3AF' },
    completed:   { value: String(_completedCnt),         delta: 'Total completed',          deltaColor: '#10B981' },
    cancelled:   { value: String(_cancelledCnt),         delta: 'Total cancelled',          deltaColor: '#EF4444' }
  }

  // ── Real doctor availability ───────────────────────────────────
  const MOCK_DOCTORS = doctors.map(d => ({
    name: d.name, spec: d.specialization,
    days: d.days.join(', '), available: d.available && d.status === 'active'
  }))

  // ── Real recent appointments ───────────────────────────────────
  const MOCK_APPTS = [...appointments]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 6)
    .map(a => ({
      patient: a.patientName,
      doctor:  a.doctorName.replace('Dr. ', '').split(' ').pop(),
      date:    new Date(a.date + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }),
      status:  a.status
    }))

  // ── Real activity feed ─────────────────────────────────────────
  const _iconForType  = t => ({ appointment:'calendar', examination:'eye', patient:'user', login:'log-out', report:'file-text', schedule:'clock', settings:'settings', account:'shield', archive:'archive' }[t] || 'activity')
  const _colorForType = t => ({ appointment:'orange', examination:'blue', patient:'green', login:'purple', report:'blue', schedule:'orange', settings:'orange', account:'red', archive:'red' }[t] || 'orange')
  const _relTime = ts => {
    const diff = Date.now() - new Date(ts.replace(' ','T')).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return mins <= 1 ? 'Just now' : `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
    const days = Math.floor(hrs / 24)
    return days === 1 ? 'Yesterday' : `${days} days ago`
  }
  const MOCK_ACTIVITY = activityLog.slice(0, 5).map(a => ({
    icon: _iconForType(a.type), iconColor: _colorForType(a.type),
    user: a.user, action: a.action, time: _relTime(a.timestamp)
  }))

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Welcome back, ${st().user?.firstName}. Here's your clinic overview.</p>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <span style="font-size:.78rem;color:#9CA3AF">${new Date().toLocaleDateString('en-PH',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</span>
    </div>
  </div>
  <div class="page-body">

    <!-- ── 6 Stat Cards ────────────────────────────────────── -->
    <div class="stats-grid-6">

      <div class="stat-card stat-card--clickable" onclick="window.navigate('patient-list')" title="View all patients">
        <div class="stat-info">
          <div class="stat-label">Total Patients</div>
          <div class="stat-value" id="admin-stat-patients">${STATS.patients.value}</div>
          <div class="stat-delta" style="color:${STATS.patients.deltaColor}">${STATS.patients.delta}</div>
        </div>
        <div class="stat-icon orange">${ic('users','icon-lg')}</div>
      </div>

      <div class="stat-card stat-card--clickable" onclick="window.navigate('appointments')" title="View appointments">
        <div class="stat-info">
          <div class="stat-label">Total Appointments</div>
          <div class="stat-value" id="admin-stat-appts">${STATS.appointments.value}</div>
          <div class="stat-delta" style="color:${STATS.appointments.deltaColor}">${STATS.appointments.delta}</div>
        </div>
        <div class="stat-icon blue">${ic('calendar','icon-lg')}</div>
      </div>

      <div class="stat-card stat-card--clickable" onclick="window.navigate('schedule')" title="View doctor schedule">
        <div class="stat-info">
          <div class="stat-label">Doctors Available</div>
          <div class="stat-value" id="admin-stat-doctors">${STATS.doctors.value}</div>
          <div class="stat-delta" style="color:${STATS.doctors.deltaColor}">${STATS.doctors.delta}</div>
        </div>
        <div class="stat-icon green">${ic('user','icon-lg')}</div>
      </div>

      <div class="stat-card stat-card--clickable" onclick="window.navigate('appointments',{filter:'today'})" title="View today's appointments">
        <div class="stat-info">
          <div class="stat-label">Today's Appointments</div>
          <div class="stat-value" id="admin-stat-today">${STATS.today.value}</div>
          <div class="stat-delta" style="color:${STATS.today.deltaColor}">${STATS.today.delta}</div>
        </div>
        <div class="stat-icon purple">${ic('clock','icon-lg')}</div>
      </div>

      <div class="stat-card stat-card--clickable" onclick="window.navigate('appointments',{filter:'completed'})" title="View completed consultations">
        <div class="stat-info">
          <div class="stat-label">Completed Consultations</div>
          <div class="stat-value" id="admin-stat-completed">${STATS.completed.value}</div>
          <div class="stat-delta" style="color:${STATS.completed.deltaColor}">${STATS.completed.delta}</div>
        </div>
        <div class="stat-icon teal">${ic('check-circle','icon-lg')}</div>
      </div>

      <div class="stat-card stat-card--clickable" onclick="window.navigate('appointments',{filter:'cancelled'})" title="View cancelled appointments">
        <div class="stat-info">
          <div class="stat-label">Cancelled</div>
          <div class="stat-value" id="admin-stat-cancelled">${STATS.cancelled.value}</div>
          <div class="stat-delta" style="color:${STATS.cancelled.deltaColor}">${STATS.cancelled.delta}</div>
        </div>
        <div class="stat-icon red">${ic('x','icon-lg')}</div>
      </div>

    </div>

    <!-- ── Charts Row ──────────────────────────────────────── -->
    <div class="grid-2" style="margin-bottom:20px">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Monthly Appointments</div>
            <div class="card-subtitle" id="admin-chart-range-label">Last 6 months</div>
          </div>
          <select id="admin-chart-range-select" class="form-select" style="width:auto;padding:6px 32px 6px 12px;font-size:.78rem" onchange="window.updateAdminCharts()">
            <option value="3">Last 3 Months</option>
            <option value="6" selected>Last 6 Months</option>
            <option value="12">Last 12 Months</option>
          </select>
        </div>
        <div class="card-body"><div class="chart-wrap"><canvas id="chart-appointments"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Patient Growth</div>
            <div class="card-subtitle">New registrations per month</div>
          </div>
          <div class="chart-legend-dot orange"></div>
        </div>
        <div class="card-body"><div class="chart-wrap"><canvas id="chart-growth"></canvas></div></div>
      </div>
    </div>

    <!-- ── Bottom Row: Doctor Availability + Recent Appointments ── -->
    <div class="grid-2" style="margin-bottom:20px">

      <!-- Doctor Availability -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Doctor Availability</div>
            <div class="card-subtitle">Current status</div>
          </div>
          <button class="btn-ghost" onclick="window.navigate('schedule')"
                  style="font-size:.75rem;padding:4px 12px">View Schedule</button>
        </div>
        <div class="card-body" id="admin-doctors-list">
          ${MOCK_DOCTORS.map(d => `
          <div class="doctor-avail-item">
            <div class="doctor-avail-info">
              <div class="avail-dot ${d.available ? 'available' : 'unavailable'}"></div>
              <div>
                <div style="font-size:.85rem;font-weight:600;color:#1C1C1C">
                  ${d.name}
                </div>
                <div style="font-size:.75rem;color:#9CA3AF">${d.spec} &bull; ${d.days}</div>
              </div>
            </div>
            ${badge(d.available ? 'active' : 'inactive')}
          </div>`).join('')}
        </div>
      </div>

      <!-- Recent Appointments -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Recent Appointments</div>
            <div class="card-subtitle">Latest activity</div>
          </div>
          <button class="btn-ghost" onclick="window.navigate('appointments')"
                  style="font-size:.75rem;padding:4px 12px">View All</button>
        </div>
        <div class="card-body" style="padding:0">
          <table class="tbl">
            <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
            <tbody id="admin-appts-tbody">
              ${MOCK_APPTS.map(a => `<tr>
                <td style="font-size:.82rem;font-weight:600">${a.patient}</td>
                <td style="font-size:.78rem;color:#6B7280">${a.doctor}</td>
                <td style="font-size:.78rem;color:#6B7280;white-space:nowrap">${a.date}</td>
                <td>${badge(a.status)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ── Recent Activity ─────────────────────────────────── -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Recent Activity</div>
          <div class="card-subtitle">Latest system events</div>
        </div>
        <button class="btn-ghost" onclick="window.navigate('activity-log')"
                style="font-size:.75rem;padding:4px 12px">View All</button>
      </div>
      <div class="card-body" id="admin-activity-feed">
        ${MOCK_ACTIVITY.map(a => `
        <div class="activity-item">
          <div class="activity-icon-wrap ${a.iconColor}">${ic(a.icon,'icon-sm')}</div>
          <div class="activity-content">
            <div class="activity-action">
              <strong>${a.user}</strong> ${a.action}
            </div>
            <div class="activity-meta">${a.time}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>

  </div>`
}

// ════════════════════════════════════════════════════════════════
//  ADMIN — USER MANAGEMENT
// ════════════════════════════════════════════════════════════════
function pageAdminUsers() {
  const allUsers = getAllUsers()
  const filter   = st().params.userFilter || 'all'

  const filtered = filter === 'all' ? allUsers : allUsers.filter(u => u.role.toLowerCase() === filter)

  window.state.afterRender = () => { window.initPagination('users-tbody'); window.initSortable('users-tbody') }
  const tabs = ['all','admin','staff','doctor','patient']

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">User Management</h1>
      <p class="page-subtitle">Manage system accounts and access roles</p>
    </div>
    <button class="btn-primary" onclick="window.openAddUserModal()">
      ${ic('plus','icon-sm')} Add User
    </button>
  </div>
  <div class="page-body">
    <div class="table-wrap">
      <div class="filter-tabs">
        ${tabs.map(t => `
          <button class="filter-tab${filter===t?' active':''}"
                  onclick="window.navigate('admin-users',{userFilter:'${t}'})">
            ${t.charAt(0).toUpperCase()+t.slice(1)}
            <span style="margin-left:4px;font-size:.7rem;color:${filter===t?'#E8760A':'#9CA3AF'}">
              (${t==='all'?allUsers.length:allUsers.filter(u=>u.role.toLowerCase()===t).length})
            </span>
          </button>`).join('')}
      </div>
      <div class="table-toolbar">
        <span class="table-title">${filtered.length} user${filtered.length!==1?'s':''}</span>
        <div class="table-actions">
          <div class="search-input-wrap">
            ${ic('search','icon-sm')}
            <input class="search-input" placeholder="Search users…"
                   oninput="window.filterTable(this,'users-tbody')">
          </div>
        </div>
      </div>
      <table class="tbl">
        <colgroup>
          <col style="width:22%"><col style="width:26%"><col style="width:14%">
          <col style="width:12%"><col style="width:10%"><col style="width:16%">
        </colgroup>
        <thead><tr>
          <th data-sort-key="name" data-sort-type="text">Name</th>
          <th>Email</th><th>Contact</th><th>Role</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody id="users-tbody">
          ${filtered.map(u => `<tr data-search="${(u.name||'').toLowerCase()} ${(u.email||'').toLowerCase()}" data-sort-name="${(u.name||'').toLowerCase()}">
            <td><div class="patient-name-cell">
              ${avatar(u.name, 'patient-avatar', u.photoUrl || null)}
              <div class="patient-name-info"><strong>${u.name}</strong><span>${u.id}</span></div>
            </div></td>
            <td style="font-size:.82rem">${u.email}</td>
            <td style="font-size:.82rem">${u.contact || '—'}</td>
            <td>${badge(u.role.toLowerCase())}</td>
            <td>${badge(u.status || 'active')}</td>
            <td><div style="display:flex;gap:6px;align-items:center;flex-wrap:nowrap">
              <button class="btn-icon" title="Edit" onclick="window.editUserModal('${u.id}','${u.role}')">${ic('edit','icon-sm')}</button>
              <button class="btn-icon" title="Archive" style="color:#d97706;border-color:#fef3c7" onclick="window.archiveUserConfirm('${u.id}','${(u.name||'').replace(/'/g,"\\'")}')"> ${ic('archive','icon-sm')}</button>
            </div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  SHARED — APPOINTMENTS (Admin + Staff + Doctor)
// ════════════════════════════════════════════════════════════════
function pageAppointments() {
  const { role, filter, user } = st()

  // Default to 'pending' when no filter is set (or 'all')
  const activeFilter = (filter && filter !== 'all') ? filter : 'pending'
  // Sync state so sidebar highlights the correct sub-item
  if (activeFilter !== filter) window.state.filter = activeFilter

  let list = [...appointments]
  if (role === 'doctor') list = list.filter(a => a.doctorId === user.id)

  if (activeFilter === 'today') {
    const todayStr = new Date().toISOString().split('T')[0]
    list = list.filter(a => a.date === todayStr && !['cancelled', 'disapproved'].includes(a.status))
  } else {
    list = list.filter(a => a.status === activeFilter)
  }

  const titleMap = {
    today:       "Today's Appointments",
    pending:     'Pending Appointments',
    approved:    'Approved Appointments',
    cancelled:   'Cancelled Appointments',
    disapproved: 'Disapproved Appointments',
    completed:   'Completed Appointments'
  }
  const subtitleMap = {
    today:       "View appointments scheduled for today",
    pending:     'Review and manage pending appointment requests',
    approved:    'View and manage approved appointments',
    cancelled:   'View cancelled appointment records',
    disapproved: 'View disapproved appointment records',
    completed:   'View completed appointment records'
  }

  const title    = role === 'doctor' ? 'My Patient Appointments' : (titleMap[activeFilter] || 'Appointments')
  const subtitle = role === 'doctor' ? 'Appointments assigned to you' : (subtitleMap[activeFilter] || 'Manage and track appointment requests')

  window.state.afterRender = () => { window.initPagination('appt-tbody'); window.initSortable('appt-tbody') }

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">${title}</h1>
      <p class="page-subtitle">${subtitle}</p>
    </div>
    ${role !== 'doctor' ? `<button class="btn-primary" onclick="window.openCreateApptModal()">${ic('plus','icon-sm')} New Appointment</button>` : ''}
  </div>
  <div class="page-body">
    <div class="table-wrap">
      <div class="table-toolbar">
        <span class="table-title">${list.length} record${list.length!==1?'s':''}</span>
        <div class="table-actions">
          <div class="search-input-wrap">
            ${ic('search','icon-sm')}
            <input class="search-input" placeholder="Search patient or doctor…"
                   oninput="window.filterApptTable(this)">
          </div>
        </div>
      </div>
      ${appointmentsTable(list, role)}
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  SHARED — PATIENT LIST (Admin + Staff + Doctor)
// ════════════════════════════════════════════════════════════════
function pagePatientList() {
  const { role, filter } = st()
  const canEdit    = role === 'admin' || role === 'staff'
  const canArchive = role === 'admin'
  const statusFilter = (filter && ['active','inactive'].includes(filter)) ? filter : 'all'

  let list = [...patients]
  if (statusFilter === 'active')   list = list.filter(p => (p.status || 'active') === 'active')
  if (statusFilter === 'inactive') list = list.filter(p => (p.status || 'active') === 'inactive')

  window.state.afterRender = () => { window.initPagination('patients-tbody'); window.initSortable('patients-tbody') }

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Patient Records</h1>
      <p class="page-subtitle">Browse and manage patient profiles</p>
    </div>
    <div style="display:flex;gap:8px">
      ${role !== 'doctor' ? `<button class="btn-primary" onclick="window.openAddPatientModal()">
        ${ic('plus','icon-sm')} Add Patient</button>` : ''}
      <button class="btn-secondary" onclick="window.navigate('qr-scanner')">
        ${ic('qr','icon-sm')} QR Scanner
      </button>
    </div>
  </div>
  <div class="page-body">
    <div class="table-wrap">
      <div class="filter-tabs">
        ${[['all','All'],['active','Active'],['inactive','Inactive']].map(([key,lbl]) => `
          <button class="filter-tab${statusFilter===key?' active':''}"
                  onclick="window.navigate('patient-list',{filter:'${key}'})">${lbl}</button>`).join('')}
      </div>
      <div class="table-toolbar">
        <span class="table-title">${list.length} patient${list.length!==1?'s':''}</span>
        <div class="table-actions">
          <div class="search-input-wrap">
            ${ic('search','icon-sm')}
            <input class="search-input" placeholder="Search by name, ID…"
                   oninput="window.filterTable(this,'patients-tbody')">
          </div>
        </div>
      </div>
      <table class="tbl">
        <colgroup>
          <col style="width:22%"><col style="width:7%"><col style="width:9%">
          <col style="width:14%"><col style="width:14%"><col style="width:10%"><col style="width:24%">
        </colgroup>
        <thead><tr>
          <th data-sort-key="name" data-sort-type="text">Patient</th>
          <th>Age</th><th>Gender</th><th>Contact</th>
          <th data-sort-key="visit" data-sort-type="date">Last Visit</th>
          <th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody id="patients-tbody">
          ${list.map(p => `<tr data-search="${(p.name||'').toLowerCase()} ${String(p.id||'').toLowerCase()} ${(p.contact||'').toLowerCase()}" data-sort-name="${(p.name||'').toLowerCase()}" data-sort-visit="${p.lastVisit && p.lastVisit !== '—' ? p.lastVisit : ''}">
            <td><div class="patient-name-cell">
              ${avatar(p.name, 'patient-avatar', p.photoUrl || null)}
              <div class="patient-name-info"><strong>${p.name}</strong><span>${p.id}</span></div>
            </div></td>
            <td style="font-size:.82rem">${p.age}</td>
            <td style="font-size:.82rem">${p.gender}</td>
            <td style="font-size:.82rem">${p.contact}</td>
            <td style="font-size:.82rem">${fmtDate(p.lastVisit)}</td>
            <td>${badge(p.status || 'active')}</td>
            <td><div style="display:flex;gap:4px;align-items:center;flex-wrap:nowrap">
              <button class="btn-icon" title="View Profile"
                      onclick="window.navigate('patient-view',{patientId:'${p.id}',patientName:'${p.name}'})">
                ${ic('eye','icon-sm')}
              </button>
              ${canEdit ? `
              <button class="btn-icon" title="Edit Patient" onclick="window.openEditPatientModal('${p.id}')">
                ${ic('edit','icon-sm')}
              </button>` : ''}
              ${canArchive ? `
              <button class="btn-icon" title="Archive Patient" style="color:#d97706;border-color:#fef3c7"
                      onclick="window.confirmArchivePatient('${p.id}')">
                ${ic('archive','icon-sm')}
              </button>` : ''}
            </div></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  SHARED — PATIENT VIEW (Admin, Staff, Doctor)
// ════════════════════════════════════════════════════════════════
function pagePatientView() {
  const { role, params } = st()
  const p = getPatientById(params.patientId)
  if (!p) return `<div class="page-body"><div class="alert-error">No matching patient record found. Please verify the patient ID or search again.</div></div>`

  const patientAppts = appointments.filter(a => a.patientId === p.id)
  const canEdit      = role === 'admin' || role === 'staff'
  const pStatus      = p.status || 'active'

  window.state.afterRender = () => {
    ['pv-consult-tbody', 'pv-rx-tbody', 'pv-appt-tbody'].forEach(id => {
      window.initPagination(id)
      window.initSortable(id)
    })
  }

  // ── Tab panel helper ─────────────────────────────────────────
  const panel = (id, content, active = false) =>
    `<div id="ptab-${id}" class="ptab-panel" style="${active ? '' : 'display:none'}">${content}</div>`

  // ── Consultation History panel ───────────────────────────────
  const consultationsPanel = p.consultations.length ? `
    <div class="table-wrap" style="box-shadow:none;border:1px solid #f3f4f6">
    <table class="tbl">
      <colgroup>
        <col style="width:12%"><col style="width:16%"><col style="width:12%">
        <col style="width:18%"><col style="width:24%"><col style="width:18%">
      </colgroup>
      <thead><tr>
        <th data-sort-key="date" data-sort-type="date">Date</th>
        <th data-sort-key="doctor" data-sort-type="text">Doctor</th>
        <th>Type</th><th>Diagnosis</th><th>Prescription</th><th>Remarks</th>
      </tr></thead>
      <tbody id="pv-consult-tbody">
        ${p.consultations.map(c => `<tr data-search="${(c.doctor||'').toLowerCase()} ${(c.diagnosis||'').toLowerCase()} ${(c.type||'').toLowerCase()}" data-sort-date="${c.date}" data-sort-doctor="${(c.doctor||'').toLowerCase()}">
          <td style="font-size:.78rem;white-space:nowrap">${fmtDate(c.date)}</td>
          <td style="font-size:.78rem">${c.doctor}</td>
          <td style="font-size:.78rem">${c.type}</td>
          <td style="font-size:.78rem;font-weight:600">${c.diagnosis}</td>
          <td style="font-size:.75rem;font-family:monospace">${c.prescription}</td>
          <td style="font-size:.75rem;color:#6B7280">${c.remarks}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>` : `<div class="table-empty">No consultation records.</div>`

  // ── Prescriptions panel ──────────────────────────────────────
  const rxList = p.prescriptions || []
  const prescriptionsPanel = rxList.length ? `
    <div class="table-wrap" style="box-shadow:none;border:1px solid #f3f4f6">
    <table class="tbl">
      <colgroup>
        <col style="width:10%"><col style="width:14%"><col style="width:12%">
        <col style="width:12%"><col style="width:14%"><col style="width:30%"><col style="width:8%">
      </colgroup>
      <thead><tr>
        <th data-sort-key="date" data-sort-type="date">Date</th>
        <th data-sort-key="doctor" data-sort-type="text">Doctor</th>
        <th>OD</th><th>OS</th><th>Lens Type</th><th>Remarks</th><th></th>
      </tr></thead>
      <tbody id="pv-rx-tbody">
        ${rxList.map(rx => `<tr data-search="${(rx.doctor||'').toLowerCase()} ${(rx.lensType||'').toLowerCase()}" data-sort-date="${rx.date}" data-sort-doctor="${(rx.doctor||'').toLowerCase()}">
          <td style="font-size:.78rem;white-space:nowrap">${fmtDate(rx.date)}</td>
          <td style="font-size:.78rem">${rx.doctor}</td>
          <td style="font-size:.73rem;font-family:monospace">${rx.od.sph} ${rx.od.cyl} ×${rx.od.axis}</td>
          <td style="font-size:.73rem;font-family:monospace">${rx.os.sph} ${rx.os.cyl} ×${rx.os.axis}</td>
          <td style="font-size:.78rem">${rx.lensType}</td>
          <td style="font-size:.75rem;color:#6B7280">${rx.remarks}</td>
          <td><button class="btn-icon" title="Print" onclick="window.print()">${ic('printer','icon-sm')}</button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>` : `<div class="table-empty">No prescriptions on file. Prescription records are created during optical examinations.</div>`

  // ── Examinations nested in consultations ─────────────────────
  const examsContent = p.examinations.length ? p.examinations.map(e => `
    <div style="padding:16px 20px;border-bottom:1px solid #F3F4F6">
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <div>
          <span style="font-size:.82rem;font-weight:700;color:#1C1C1C">${fmtDate(e.date)}</span>
          <span style="font-size:.75rem;color:#9CA3AF;margin-left:8px">by ${e.doctor}</span>
        </div>
        ${role !== 'patient' ? `<button class="btn-ghost" onclick="window.navigate('examination',{patientId:'${p.id}',examId:'${e.id}'})"
          style="font-size:.75rem;padding:4px 10px">${ic('eye','icon-sm')} View Full</button>` : ''}
      </div>
      <div class="eye-grid" style="margin-bottom:8px">
        <div class="eye-header"></div>
        <div class="eye-header">SPH</div><div class="eye-header">CYL</div>
        <div class="eye-header">AXIS</div><div class="eye-header">VA</div>
        <div class="eye-label">OD (Right)</div>
        <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.od.sph}</div>
        <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.od.cyl}</div>
        <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.od.axis}</div>
        <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.od.va}</div>
        <div class="eye-label">OS (Left)</div>
        <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.os.sph}</div>
        <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.os.cyl}</div>
        <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.os.axis}</div>
        <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.os.va}</div>
      </div>
      <div style="font-size:.78rem;color:#374151"><strong>Diagnosis:</strong> ${e.diagnosis}</div>
      <div style="font-size:.78rem;color:#374151"><strong>Recommendation:</strong> ${e.recommendation}</div>
      <div style="font-size:.78rem;color:#9CA3AF;margin-top:4px">${e.remarks}</div>
    </div>`).join('') : `<div class="table-empty">No examination records yet. Records are created when a doctor completes a patient consultation.</div>`

  return `
  <div class="page-header">
    <div class="page-header-left" style="display:flex;align-items:center;gap:12px">
      <button class="btn-icon" onclick="window.navigate('patient-list')" title="Back">
        ${ic('chevron-left','icon')}
      </button>
      <div>
        <h1 class="page-title">Patient Profile</h1>
        <p class="page-subtitle">${p.id} &bull; Registered ${fmtDate(p.registeredDate)}</p>
      </div>
    </div>
    ${canEdit ? `<div style="display:flex;gap:8px">
      <button class="btn-secondary" onclick="window.openEditPatientModal('${p.id}')">
        ${ic('edit','icon-sm')} Edit Profile
      </button>
      <button class="btn-primary" onclick="window.navigate('appointments',{filter:'all'})">
        ${ic('calendar','icon-sm')} Schedule Appointment
      </button>
    </div>` : ''}
  </div>

  <div class="page-body">

    <!-- ── Profile Header Card ─────────────────────────────── -->
    <div class="card" style="margin-bottom:20px;overflow:hidden">
      <div style="display:flex;gap:24px;padding:24px;flex-wrap:wrap;align-items:flex-start">

        <!-- Left: Avatar + QR -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:14px;min-width:140px">
          <div style="width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,#E8760A,#F5A44D);
                      display:flex;align-items:center;justify-content:center;
                      font-size:1.8rem;font-weight:800;color:#fff;letter-spacing:-.02em;
                      box-shadow:0 4px 16px rgba(232,118,10,.35);overflow:hidden">
            ${p.photoUrl ? `<img src="${p.photoUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">` : initials(p.name)}
          </div>
          <div style="border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1);border:1px solid #e5e7eb;">
            ${window.mockQRSvg(p.qrData, 120)}
          </div>
          <button class="btn-secondary" style="font-size:.72rem;padding:4px 10px;justify-content:center"
                  onclick="window.showPatientQRModal('${p.id}')">
            ${ic('printer','icon-sm')} Print QR
          </button>
        </div>

        <!-- Right: Patient info -->
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap">
            <div style="font-size:1.5rem;font-weight:800;color:#1C1C1C;letter-spacing:-.02em">${p.name}</div>
            ${badge(pStatus)}
          </div>
          <div style="font-size:.82rem;color:#6B7280;margin-bottom:16px">
            Patient ID: <strong style="color:#1C1C1C;font-family:monospace">${p.id}</strong>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">
            ${[
              [ic('user','icon-sm'), 'Age / Gender',  `${p.age} yrs, ${p.gender}`],
              [ic('phone','icon-sm'),'Contact',        p.contact],
              [ic('mail','icon-sm'), 'Email',          p.email],
              [ic('calendar','icon-sm'),'Last Visit',  fmtDate(p.lastVisit)],
              [ic('map-pin','icon-sm'),'Address',      p.address],
              [ic('activity','icon-sm'),'Blood Type',  p.bloodType],
            ].map(([icn,lbl,val]) => `
              <div style="background:#F9FAFB;border-radius:8px;padding:10px 12px">
                <div style="display:flex;align-items:center;gap:6px;font-size:.68rem;color:#9CA3AF;margin-bottom:3px;text-transform:uppercase;letter-spacing:.04em">
                  ${icn} ${lbl}
                </div>
                <div style="font-size:.84rem;font-weight:600;color:#1C1C1C">${val}</div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Stats strip -->
        <div style="display:flex;flex-direction:column;gap:8px;min-width:120px">
          ${[
            ['Appointments', patientAppts.length, '#E8760A'],
            ['Consultations', p.consultations.length, '#059669'],
            ['Examinations', p.examinations.length, '#2563EB'],
            ['Prescriptions', (p.prescriptions||[]).length, '#7C3AED']
          ].map(([lbl,val,col]) => `
            <div style="background:#F9FAFB;border-radius:8px;padding:10px 14px;text-align:center">
              <div style="font-size:1.4rem;font-weight:800;color:${col}">${val}</div>
              <div style="font-size:.68rem;color:#9CA3AF;margin-top:1px">${lbl}</div>
            </div>`).join('')}
        </div>

      </div>
    </div>

    <!-- ── Tabs ──────────────────────────────────────────────── -->
    <div class="table-wrap">
      <div class="filter-tabs" style="padding:0 16px">
        ${[
          ['personal',      'Personal Info'],
          ['history',       'Medical History'],
          ['consultations', 'Consultations'],
          ['prescriptions', 'Prescriptions'],
          ['appointments',  'Appointments']
        ].map(([key, lbl], i) => `
          <button class="filter-tab ptab-btn${i===0?' active':''}" data-tab="${key}"
                  onclick="window.switchPatientTab('${key}')">${lbl}</button>`).join('')}
      </div>

      <div style="padding:20px">

        ${panel('personal', `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            ${[
              ['Date of Birth',   fmtDate(p.dob)],
              ['Age',             `${p.age} years old`],
              ['Gender',          p.gender],
              ['Blood Type',      p.bloodType],
              ['Contact Number',  p.contact],
              ['Email Address',   p.email],
              ['Address',         p.address],
              ['Occupation',      p.occupation || '—'],
              ['Registered',      fmtDate(p.registeredDate)],
              ['Last Visit',      fmtDate(p.lastVisit)],
            ].map(([k,v]) => `
              <div class="info-item">
                <div class="info-key">${k}</div>
                <div class="info-val">${v}</div>
              </div>`).join('')}
          </div>`, true)}

        ${panel('history', `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
            <div>
              <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#E8760A;margin-bottom:12px">
                ${ic('activity','icon-sm')} Medical History
              </div>
              <div style="background:#FFFBF5;border:1px solid #FFE4C0;border-radius:8px;padding:14px;font-size:.85rem;line-height:1.7;color:#374151">
                ${p.medicalHistory || 'No medical history on record.'}
              </div>
            </div>
            <div>
              <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#E8760A;margin-bottom:12px">
                ${ic('eye','icon-sm')} Optical History
              </div>
              <div style="background:#FFFBF5;border:1px solid #FFE4C0;border-radius:8px;padding:14px;font-size:.85rem;line-height:1.7;color:#374151">
                ${p.opticalHistory || 'No optical history on record.'}
              </div>
            </div>
          </div>
          <div style="margin-top:20px">
            <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#6B7280;margin-bottom:12px">
              Optical Examination Records (${p.examinations.length})
            </div>
            ${examsContent}
          </div>`)}

        ${panel('consultations', `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
            <div style="font-size:.88rem;color:#6B7280">${p.consultations.length} consultation record${p.consultations.length!==1?'s':''}</div>
            ${canEdit ? `<button class="btn-secondary" onclick="window.openAddConsultationModal('${p.id}')">
              ${ic('plus','icon-sm')} Add Consultation
            </button>` : ''}
          </div>
          ${consultationsPanel}`)}

        ${panel('prescriptions', `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
            <div style="font-size:.88rem;color:#6B7280">${rxList.length} prescription record${rxList.length!==1?'s':''}</div>
          </div>
          ${prescriptionsPanel}`)}

        ${panel('appointments', `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
            <div style="font-size:.88rem;color:#6B7280">${patientAppts.length} appointment${patientAppts.length!==1?'s':''} total</div>
            ${canEdit ? `<button class="btn-primary" onclick="window.openCreateApptModal()">
              ${ic('plus','icon-sm')} New Appointment
            </button>` : ''}
          </div>
          <div class="table-wrap" style="box-shadow:none;border:1px solid #f3f4f6">${appointmentsTable(patientAppts, role, 'pv-appt-tbody')}</div>`)}

      </div>
    </div>

  </div>`
}

// ════════════════════════════════════════════════════════════════
//  SHARED — CONTACT MESSAGES INBOX (Admin, Staff)
// ════════════════════════════════════════════════════════════════
function pageContactMessages() {
  const { filter } = st()
  const statusFilter = ['unread', 'archived'].includes(filter) ? filter : 'all'

  let list = contactMessages.filter(m => statusFilter === 'archived' ? !!m.archivedAt : !m.archivedAt)
  if (statusFilter === 'unread') list = list.filter(m => !m.isRead)

  const unreadCount = contactMessages.filter(m => !m.isRead && !m.archivedAt).length

  window.state.afterRender = () => { window.initPagination('contact-tbody'); window.initSortable('contact-tbody') }

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Contact Messages</h1>
      <p class="page-subtitle">Messages submitted through the website's contact form</p>
    </div>
    <div style="display:flex;gap:8px">
      ${unreadCount > 0 ? `<button class="btn-secondary" onclick="window.markAllContactRead()">
        ${ic('check', 'icon-sm')} Mark All as Read</button>` : ''}
    </div>
  </div>
  <div class="page-body">
    <div class="table-wrap">
      <div class="filter-tabs">
        ${[['all', 'All'], ['unread', 'Unread'], ['archived', 'Archived']].map(([key, lbl]) => `
          <button class="filter-tab${statusFilter === key ? ' active' : ''}"
                  onclick="window.navigate('contact-messages',{filter:'${key}'})">
            ${lbl}${key === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>`).join('')}
      </div>
      <div class="table-toolbar">
        <span class="table-title">${list.length} message${list.length !== 1 ? 's' : ''}</span>
        <div class="table-actions">
          <div class="search-input-wrap">
            ${ic('search', 'icon-sm')}
            <input class="search-input" placeholder="Search by name, email, message…"
                   oninput="window.filterTable(this,'contact-tbody')">
          </div>
        </div>
      </div>
      ${list.length === 0 ? `
        <div style="text-align:center;padding:60px 20px;color:#9CA3AF">
          <p style="font-size:.88rem">No ${statusFilter === 'unread' ? 'unread ' : statusFilter === 'archived' ? 'archived ' : ''}messages${statusFilter === 'all' ? ' yet' : ''}.</p>
        </div>` : `
      <table class="tbl">
        <colgroup>
          <col style="width:22%"><col style="width:13%"><col style="width:39%"><col style="width:13%"><col style="width:13%">
        </colgroup>
        <thead><tr>
          <th data-sort-key="from" data-sort-type="text">From</th>
          <th>Service</th><th>Message</th>
          <th data-sort-key="received" data-sort-type="date">Received</th>
          <th></th>
        </tr></thead>
        <tbody id="contact-tbody">
          ${list.map(m => {
            const excerpt = (m.message || '').length > 90 ? m.message.slice(0, 90) + '…' : (m.message || '')
            return `<tr data-search="${(m.name || '').toLowerCase()} ${(m.email || '').toLowerCase()} ${(m.message || '').toLowerCase()}"
                        data-sort-from="${(m.name || '').toLowerCase()}" data-sort-received="${m.createdAt || ''}"
                        class="${!m.isRead ? 'msg-unread' : ''}" style="cursor:pointer"
                        onclick="window.openContactMessageModal(${m.id})">
              <td><div class="patient-name-cell">
                ${!m.isRead ? '<span class="msg-dot" title="Unread"></span>' : ''}
                ${avatar(m.name, 'patient-avatar')}
                <div class="patient-name-info"><strong>${m.name}</strong><span>${m.email}</span></div>
              </div></td>
              <td style="font-size:.82rem">${m.service || '—'}</td>
              <td style="font-size:.82rem;color:#6b7280">
                ${excerpt}
                ${m.reply ? `<span style="display:inline-flex;align-items:center;gap:3px;margin-left:8px;font-size:.68rem;font-weight:600;color:#059669;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:999px;padding:1px 8px;white-space:nowrap">${ic('check', 'icon-xs')} Replied</span>` : ''}
              </td>
              <td style="font-size:.78rem;color:#9ca3af;white-space:nowrap">${window._notifTimeAgo(m.createdAt)}</td>
              <td onclick="event.stopPropagation()">
                <div style="display:flex;gap:4px;align-items:center;flex-wrap:nowrap">
                  <button class="btn-icon" title="${m.archivedAt ? 'Move back to inbox' : 'Archive'}"
                          onclick="window.toggleContactMessageArchive(${m.id})">
                    ${ic(m.archivedAt ? 'rotate-ccw' : 'archive', 'icon-sm')}
                  </button>
                  <button class="btn-icon" title="Delete" style="color:#DC2626"
                          onclick="window.confirmDeleteContactMessage(${m.id})">
                    ${ic('trash-2', 'icon-sm')}
                  </button>
                </div>
              </td>
            </tr>`
          }).join('')}
        </tbody>
      </table>
      `}
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  QR SCANNER PAGE
// ════════════════════════════════════════════════════════════════
function pageQRScanner() {
  window.state.afterRender = () => { if (window._qrRenderStats) window._qrRenderStats() }
  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">QR Code Scanner</h1>
      <p class="page-subtitle">Scan a patient QR code for instant profile access</p>
    </div>
    <button class="btn-secondary" onclick="window.navigate('patient-list')">
      ${ic('chevron-left','icon-sm')} Back to Patient List
    </button>
  </div>
  <div class="page-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start">

      <!-- Camera / scan area -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">${ic('qr','icon-sm')} Camera Scanner</div>
        </div>
        <div class="card-body">
          <!-- Camera area -->
          <div id="qr-camera-area" style="border:2px dashed #E5E7EB;border-radius:12px;padding:48px 24px;
                text-align:center;background:#FAFAFA;margin-bottom:16px;position:relative;min-height:320px;
                overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <!-- Idle placeholder -->
            <div id="qr-cam-idle" style="display:flex;flex-direction:column;align-items:center">
              <div style="width:64px;height:64px;border-radius:50%;background:#F3F4F6;
                          display:flex;align-items:center;justify-content:center;margin-bottom:16px;color:#9CA3AF">
                ${ic('qr','icon-xl')}
              </div>
              <div style="font-size:1rem;font-weight:700;color:#374151;margin-bottom:6px">Click "Start Camera" to Scan</div>
              <div style="font-size:.82rem;color:#9CA3AF;max-width:280px;line-height:1.6">
                Point the camera at a patient QR code. Keep it steady and well-lit — detection is automatic.
              </div>
            </div>
            <!-- Scanning status bar (shown when camera active) -->
            <div id="qr-scanning-bar" style="display:none;position:absolute;top:0;left:0;right:0;z-index:10;
                 background:rgba(10,10,20,.78);padding:7px 12px;border-radius:8px 8px 0 0;
                 align-items:center;gap:8px">
              <div id="qr-scan-pulse" style="width:9px;height:9px;border-radius:50%;background:#22C55E;
                   flex-shrink:0;transition:background .08s"></div>
              <span id="qr-scan-bar-text" style="font-size:.73rem;color:#fff;font-weight:600;letter-spacing:.02em">
                Scanning for QR code…
              </span>
            </div>
            <!-- html5-qrcode renders its own video + scan box into this container -->
            <div id="qr-reader" style="display:none;width:100%"></div>
            <!-- Lookup status -->
            <div id="qr-scan-status" style="display:none;position:absolute;bottom:10px;left:0;right:0;
                 text-align:center;font-size:.75rem;font-weight:600;color:#fff;
                 background:rgba(0,0,0,.55);padding:5px 10px;border-radius:0 0 10px 10px"></div>
          </div>
          <!-- Camera control buttons -->
          <div style="display:flex;gap:8px;margin-bottom:8px">
            <button id="qr-start-btn" class="btn-primary" style="flex:1;justify-content:center"
                    onclick="window.openQRCameraScanner()">
              ${ic('camera','icon-sm')} Start Camera
            </button>
            <button id="qr-stop-btn" class="btn-secondary" style="flex:1;justify-content:center;display:none"
                    onclick="window.stopQRCamera()">
              ${ic('x','icon-sm')} Stop Camera
            </button>
          </div>
          <!-- Live status caption — updated by JS -->
          <div id="qr-status-caption" style="display:none;font-size:.76rem;color:#6B7280;text-align:center;margin-bottom:10px;line-height:1.5;min-height:1.1em"></div>

          <!-- Divider -->
          <div style="display:flex;align-items:center;gap:10px;margin:4px 0 12px">
            <div style="flex:1;height:1px;background:#E5E7EB"></div>
            <span style="font-size:.7rem;color:#9CA3AF;font-weight:600;text-transform:uppercase;letter-spacing:.06em">or upload image</span>
            <div style="flex:1;height:1px;background:#E5E7EB"></div>
          </div>

          <!-- Upload drop zone -->
          <div id="qr-upload-zone"
               style="border:2px dashed #E5E7EB;border-radius:10px;padding:22px 16px;text-align:center;
                      cursor:pointer;transition:border-color .15s,background .15s;background:#FAFAFA;margin-bottom:10px"
               onclick="document.getElementById('qr-file-input').click()"
               ondragover="event.preventDefault();this.style.borderColor='#E8760A';this.style.background='#FFF8F2'"
               ondragleave="this.style.borderColor='#E5E7EB';this.style.background='#FAFAFA'"
               ondrop="event.preventDefault();this.style.borderColor='#E5E7EB';this.style.background='#FAFAFA';window.processQRImageFile(event.dataTransfer.files[0])">
            <div id="qr-upload-idle">
              <div style="color:#9CA3AF;margin-bottom:8px">${ic('upload-cloud','icon-lg')}</div>
              <div style="font-size:.85rem;font-weight:600;color:#374151;margin-bottom:3px">Click to upload or drag &amp; drop</div>
              <div style="font-size:.74rem;color:#9CA3AF">PNG, JPG, WEBP — any QR code image</div>
            </div>
            <img id="qr-upload-preview" style="display:none;max-width:100%;max-height:160px;border-radius:8px;margin:0 auto;object-fit:contain">
            <div id="qr-upload-status" style="display:none;margin-top:8px;font-size:.8rem"></div>
          </div>
          <input type="file" id="qr-file-input" accept="image/*" style="display:none"
                 onchange="window.processQRImageFile(this.files[0]);this.value=''">
        </div>
      </div>

      <!-- Manual search + result -->
      <div style="display:flex;flex-direction:column;gap:16px">

        <!-- Manual search -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">${ic('search','icon-sm')} Manual Search</div>
          </div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:12px">
            <div class="form-group" style="margin:0">
              <label class="form-label">Patient ID or Name</label>
              <div class="search-input-wrap">
                ${ic('search','icon-sm')}
                <input id="qr-search-input" class="search-input" placeholder="e.g. P001 or Maria Santos"
                       oninput="window.liveSearchPatient(this.value)">
              </div>
            </div>
            <button class="btn-primary" onclick="window.searchPatientManual()">
              ${ic('search','icon-sm')} Search Patient
            </button>
            <div id="qr-live-results" style="display:none;max-height:200px;overflow-y:auto;border:1px solid #E5E7EB;border-radius:8px"></div>
          </div>
        </div>

        <!-- Scan result card (hidden until triggered) -->
        <div id="qr-result-card" style="display:none">
          <div class="card" style="border:2px solid #E8760A">
            <div class="card-header" style="background:#FFFBF5;border-bottom:1px solid #FFE4C0">
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:8px;height:8px;border-radius:50%;background:#22C55E;animation:pulse 1.5s infinite"></div>
                <div class="card-title" style="color:#E8760A">Patient Found</div>
              </div>
            </div>
            <div class="card-body" id="qr-result-body">
              <!-- Populated by JS -->
            </div>
          </div>
        </div>

        <!-- Quick stats -->
        <div class="card">
          <div class="card-header"><div class="card-title">Scanner Stats Today</div></div>
          <div class="card-body">
            ${[['Scans Today','qr-stat-total'],['Patients Found','qr-stat-found'],['Not Found','qr-stat-notfound']].map(([l,id]) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #F9FAFB">
                <span style="font-size:.82rem;color:#6B7280">${l}</span>
                <strong id="${id}" style="font-size:.9rem;color:#1C1C1C">0</strong>
              </div>`).join('')}
          </div>
        </div>

      </div>
    </div>
  </div>
  <style>
    @keyframes pulse {
      0%,100% { opacity: 1 }
      50%      { opacity: .3 }
    }
    @keyframes qrDotPulse {
      0%,100% { transform: scale(1);   opacity: 1 }
      50%      { transform: scale(1.5); opacity: .5 }
    }
  </style>`
}

// ════════════════════════════════════════════════════════════════
//  SHARED — DOCTOR SCHEDULE
// ════════════════════════════════════════════════════════════════
function pageSchedule() {
  const { role, params } = st()
  const canEdit  = role === 'admin' || role === 'staff'

  const now    = new Date()
  const todayY = now.getFullYear()
  const todayM = now.getMonth()
  const todayD = now.getDate()

  const year  = params?.schedYear  ?? todayY
  const month = params?.schedMonth ?? todayM
  const today = year === todayY && month === todayM ? todayD : -1

  const monthName  = new Date(year, month, 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })

  // All 5 doctors from branch-data.js
  const allDocs  = typeof getAvailableDoctors === 'function' ? getAvailableDoctors() : []
  const firstDoc = allDocs[0]

  window.state.afterRender = () => {
    window.schedGoMonth(todayY, todayM)
    if (firstDoc) window.switchScheduleDoctor(firstDoc.id)
  }

  // Build calendar cells coloured by this doctor's availability
  function buildDocCalendar(doctor) {
    const weekdays  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    const firstDay  = new Date(year, month, 1).getDay()
    const daysInMon = new Date(year, month + 1, 0).getDate()

    const apptsByDate = {}
    appointments.filter(a => a.doctorName === doctor.name).forEach(a => {
      if (!apptsByDate[a.date]) apptsByDate[a.date] = []
      apptsByDate[a.date].push({ time: a.time, patientName: a.patientName, status: a.status })
    })

    let cells = ''
    for (let i = 0; i < firstDay; i++) cells += `<div class="cal-day other-month"></div>`
    for (let d = 1; d <= daysInMon; d++) {
      const dow     = new Date(year, month, d).getDay()
      const dayName = weekdays[dow]
      const isToday = d === today
      const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
      const dayAppts = apptsByDate[dateStr] || []

      const avail = (doctor.availableDays || []).includes(dayName)
      const cls   = avail ? (isToday ? 'today avail' : 'avail') : (isToday ? 'today' : 'blocked')

      const dotCls   = dayAppts.length ? ' has-appts' : ''
      const hoverEvt = dayAppts.length
        ? `onmouseenter="window.showCalTip(this,'${JSON.stringify(dayAppts).replace(/'/g,'&#39;').replace(/"/g,'&quot;')}')" onmouseleave="window.hideCalTip()"`
        : ''

      cells += `<div class="cal-day ${cls}${dotCls}" ${hoverEvt}>${d}</div>`
    }
    return cells
  }

  // Build full panel for one doctor
  function buildDocPanel(doctor) {
    const daysLabel = (doctor.availableDays || []).join(', ')
    const calCells  = buildDocCalendar(doctor)
    const todayStr  = now.toISOString().split('T')[0]
    const docAppts  = appointments.filter(a =>
      a.date === todayStr && a.status === 'approved' && a.doctorName === doctor.name)

    return `
    <div id="sched-panel-${doctor.id}" class="sched-doctor-panel" style="display:none">
      <div class="card" style="margin-bottom:16px">
        <div class="card-body" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          ${avatar(doctor.name, 'profile-avatar-lg', doctor.photoUrl || null)}
          <div style="flex:1;min-width:0">
            <div style="font-size:1rem;font-weight:700;color:#1C1C1C">${doctor.name}</div>
            <div style="font-size:.8rem;color:#6B7280;margin-top:2px">${doctor.specialization}</div>
            <div style="display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap">
              <span style="font-size:.75rem;color:#6B7280">${ic('clock','icon-sm')} ${daysLabel}</span>
            </div>
          </div>
          ${canEdit ? `
          <div style="display:flex;gap:8px;flex-shrink:0">
            <button class="btn-ghost" style="font-size:.78rem"
                    onclick="window.openBlockDateModal('${doctor.name.replace(/'/g,'&#39;')}')">
              ${ic('x','icon-sm')} Block Date
            </button>
            <button class="btn-secondary" style="font-size:.78rem"
                    onclick="window.openSetScheduleModal('${doctor.id}')">
              ${ic('edit','icon-sm')} Edit Schedule
            </button>
          </div>` : ''}
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title sched-month-title"></div>
            <div style="display:flex;gap:4px">
              <button class="btn-icon sched-prev" title="Previous month">${ic('chevron-left','icon-sm')}</button>
              <button class="btn-icon sched-today" style="font-size:.7rem;font-weight:700;width:auto;padding:0 8px;color:#E8760A;border-color:#E8760A">Today</button>
              <button class="btn-icon sched-next" title="Next month">${ic('chevron-right','icon-sm')}</button>
            </div>
          </div>
          <div class="card-body">
            <div class="calendar-grid" style="margin-bottom:8px">
              ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="cal-day-header">${d}</div>`).join('')}
            </div>
            <div class="calendar-grid" id="sched-cal-${doctor.id}">${calCells}</div>
            <div style="display:flex;gap:14px;margin-top:16px;flex-wrap:wrap">
              <div style="display:flex;align-items:center;gap:6px;font-size:.75rem;color:#6B7280">
                <div style="width:10px;height:10px;background:#E8760A;border-radius:50%"></div>Today
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:.75rem;color:#6B7280">
                <div style="width:10px;height:10px;background:#ECFDF5;border:1.5px solid #10B981;border-radius:2px"></div>Available
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:.75rem;color:#6B7280">
                <div style="width:10px;height:10px;background:#FFEBEE;border-radius:2px"></div>Unavailable
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Today's Appointments</div></div>
          <div class="card-body" style="padding:0">
            ${docAppts.length
              ? `<table class="tbl"><thead><tr><th>Patient</th><th>Time</th><th>Type</th></tr></thead><tbody>
                  ${docAppts.map(a=>`<tr>
                    <td style="font-size:.82rem;font-weight:600">${a.patientName}</td>
                    <td style="font-size:.78rem;white-space:nowrap">${a.time}</td>
                    <td style="font-size:.78rem;color:#6B7280">${a.type}</td>
                  </tr>`).join('')}
                </tbody></table>`
              : `<div class="table-empty">No appointments today for this doctor.</div>`}
          </div>
        </div>
      </div>
    </div>`
  }

  const allPanels = allDocs.map(d => buildDocPanel(d)).join('')

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Doctor Schedule</h1>
      <p class="page-subtitle">View and manage doctor availability</p>
    </div>
    ${canEdit ? `<button class="btn-primary" onclick="window.openSetScheduleModal()">${ic('plus','icon-sm')} Set Availability</button>` : ''}
  </div>
  <div class="page-body">

    <!-- Doctor selector cards -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-body" style="padding:16px">
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${allDocs.map(d => `
          <button class="doctor-sel-card sched-tab" data-doc="${d.id}"
                  onclick="window.switchScheduleDoctor('${d.id}')">
            <div class="doc-card-avatar" ${d.photoUrl ? 'style="overflow:hidden;padding:0"' : ''}>
              ${d.photoUrl ? `<img src="${d.photoUrl}" alt="${d.name}" style="width:100%;height:100%;object-fit:cover;object-position:top;border-radius:50%;display:block">` : initials(d.name)}
            </div>
            <div>
              <div class="doc-card-name">${d.name.replace('Dr. ','')}</div>
              <div class="doc-card-spec">${d.specialization}</div>
            </div>
          </button>`).join('')}
        </div>
      </div>
    </div>

    <!-- Per-doctor panels (JS shows/hides) -->
    <div id="sched-panels">${allPanels}</div>

  </div>`
}

// ════════════════════════════════════════════════════════════════
//  ADMIN — REPORTS
// ════════════════════════════════════════════════════════════════
function pageAdminReports() {
  const today      = new Date().toISOString().split('T')[0]
  const monthStart = today.slice(0,8) + '01'

  window.state.afterRender = () => {
    window.exportReportCSV = () => {
      const table = document.querySelector('#rpt-table-area table')
      if (!table) { window.toast('Generate a report first, then export.', 'error'); return }
      const rows = Array.from(table.querySelectorAll('tr'))
      const csv = rows.map(row =>
        Array.from(row.querySelectorAll('th, td'))
          .map(cell => '"' + cell.textContent.trim().replace(/"/g, '""') + '"')
          .join(',')
      ).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      const sel = document.getElementById('rpt-type')
      const label = sel?.selectedOptions[0]?.text || 'report'
      a.download = 'opticana-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.csv'
      a.click()
      window.toast('Report exported as CSV.', 'success')
    }

    window.printReport = () => {
      const table = document.querySelector('#rpt-table-area table')
      if (!table) { window.toast('Generate a report first, then print.', 'error'); return }

      const typeSel   = document.getElementById('rpt-type')
      const typeLabel = typeSel?.selectedOptions[0]?.text || 'Report'
      const from = document.getElementById('rpt-from')?.value || ''
      const to   = document.getElementById('rpt-to')?.value || ''
      const ci   = (typeof clinicInfo !== 'undefined') ? clinicInfo : {}
      const fmtD = d => d ? new Date(d).toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' }) : ''
      const rangePart = (from && to) ? fmtD(from) + ' \u2013 ' + fmtD(to) : from ? 'From ' + fmtD(from) : 'All Dates'
      const now = new Date().toLocaleString('en-PH', { month:'long', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit' })

      // Clone table \u2014 all rows, remove pagination visibility class
      const tClone = table.cloneNode(true)
      tClone.querySelectorAll('.pg-hidden').forEach(r => r.classList.remove('pg-hidden'))
      const rowCount = tClone.querySelectorAll('tbody tr').length

      // Capture charts as images before opening the new window
      const lCanvas = document.getElementById('rpt-chart-left')
      const rCanvas = document.getElementById('rpt-chart-right')
      const lImg    = lCanvas ? lCanvas.toDataURL('image/png') : ''
      const rImg    = rCanvas ? rCanvas.toDataURL('image/png') : ''
      const lTitle  = document.getElementById('rpt-chart-left-title')?.textContent  || ''
      const rTitle  = document.getElementById('rpt-chart-right-title')?.textContent || ''
      const hasCharts = !!(lImg || rImg)

      const chartHTML = hasCharts ? `
        <div class="page-break">
          <div class="section-header">
            <div class="section-title">Charts &amp; Summaries \u2014 ${typeLabel}</div>
            <div class="section-sub">${rangePart}</div>
          </div>
          <div class="chart-grid">
            ${lImg ? `<div class="chart-box"><div class="chart-label">${lTitle}</div><img src="${lImg}" class="chart-img"></div>` : ''}
            ${rImg ? `<div class="chart-box"><div class="chart-label">${rTitle}</div><img src="${rImg}" class="chart-img"></div>` : ''}
          </div>
        </div>` : ''

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${typeLabel} \u2014 ${ci.name || 'Clinic'}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 9pt; color: #111; padding: 18px 22px; background: #fff; }

  /* \u2500\u2500 Clinic header \u2500\u2500 */
  .hdr          { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 10px; }
  .clinic-name  { font-size: 14pt; font-weight: 700; letter-spacing: -.02em; }
  .clinic-sub   { font-size: 7.5pt; color: #555; margin-top: 3px; }
  .hdr-right    { text-align: right; }
  .hdr-tag      { font-size: 6.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #888; }

  /* \u2500\u2500 Report meta \u2500\u2500 */
  .rpt-title    { font-size: 11pt; font-weight: 700; margin-bottom: 2px; }
  .rpt-meta     { font-size: 7.5pt; color: #555; margin-bottom: 14px; }
  .rpt-meta span { margin-right: 12px; }

  /* \u2500\u2500 Table \u2500\u2500 */
  table { width: 100%; border-collapse: collapse; font-size: 8pt; }
  thead tr { background: #f3f4f6 !important; }
  th { padding: 6px 8px; text-align: left; font-size: 7.5pt; font-weight: 700; border: 1px solid #d1d5db; background: #f3f4f6; }
  td { padding: 5px 8px; border: 1px solid #e5e7eb; vertical-align: top; line-height: 1.35; }
  tbody tr:nth-child(even) td { background: #fafafa; }
  code { font-family: 'Courier New', monospace; font-size: 7.5pt; }

  /* \u2500\u2500 Badges \u2500\u2500 */
  .badge { display: inline-block; padding: 1px 7px; border-radius: 20px; font-size: 7pt; font-weight: 700; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .badge-pending     { background: #FFF3E0; color: #E8891C; }
  .badge-approved    { background: #E8F5E9; color: #2E7D32; }
  .badge-cancelled   { background: #FFEBEE; color: #C62828; }
  .badge-inactive    { background: #FFEBEE; color: #C62828; }
  .badge-disapproved { background: #fef2f2; color: #991b1b; }
  .badge-completed   { background: #F5F5F5; color: #616161; }
  .badge-active      { background: #E3F2FD; color: #1565C0; }
  .badge-admin       { background: #EDE9FE; color: #5B21B6; }
  .badge-staff       { background: #DBEAFE; color: #1D4ED8; }
  .badge-doctor      { background: #E8F5E9; color: #2E7D32; }
  .badge-patient     { background: #FFF0DC; color: #92400E; }

  /* \u2500\u2500 Charts \u2500\u2500 */
  .page-break   { page-break-before: always; }
  .section-header { border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 14px; }
  .section-title  { font-size: 11pt; font-weight: 700; }
  .section-sub    { font-size: 7.5pt; color: #666; margin-top: 2px; }
  .chart-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .chart-box    { border: 1px solid #e5e7eb; border-radius: 4px; padding: 12px; }
  .chart-label  { font-size: 8.5pt; font-weight: 700; margin-bottom: 8px; }
  .chart-img    { width: 100%; height: auto; display: block; }

  /* \u2500\u2500 Print \u2500\u2500 */
  @media print {
    body { padding: 0; }
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
</style>
</head>
<body>
  <div class="hdr">
    <div>
      <div class="clinic-name">${ci.name || 'Cana Optical Clinic'}</div>
      <div class="clinic-sub">${ci.address || ''}</div>
      <div class="clinic-sub">${[ci.phone ? 'Tel: ' + ci.phone : '', ci.email || ''].filter(Boolean).join('\u2002\u00b7\u2002')}</div>
    </div>
    <div class="hdr-right">
      <div class="hdr-tag">Official Report</div>
      <div class="clinic-sub" style="margin-top:4px">Clinic Management System</div>
    </div>
  </div>

  <div class="rpt-title">${typeLabel}</div>
  <div class="rpt-meta">
    <span>Date Range: ${rangePart}</span>
    <span>Total Records: ${rowCount}</span>
    <span>Printed: ${now}</span>
  </div>

  ${tClone.outerHTML}
  ${chartHTML}
</body>
</html>`

      const win = window.open('', '_blank', 'width=960,height=720,scrollbars=yes')
      if (!win) { window.toast('Pop-ups are blocked. Allow pop-ups for this site and try again.', 'error'); return }
      win.document.open()
      win.document.write(html)
      win.document.close()
      win.focus()
      // Give the browser time to render the images before opening the print dialog
      setTimeout(() => { win.print(); win.close() }, 600)
    }
  }

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Reports Module</h1>
      <p class="page-subtitle">Generate reports and view trend summaries for clinic operations.</p>
    </div>
  </div>
  <div class="page-body">

    <!-- Filter Card -->
    <div class="card" id="rpt-filter-card" style="margin-bottom:20px;padding:20px 24px">
      <div style="display:flex;gap:12px;align-items:flex-end;flex-wrap:wrap">
        <div>
          <label style="display:block;font-size:.72rem;font-weight:600;color:#374151;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Report Type</label>
          <select id="rpt-type" class="form-input" style="width:252px">
            <option value="">\u2014 Select Report Type \u2014</option>
            <option value="patient-visit">Patient Visit History Report</option>
            <option value="diagnosis-history">Diagnosis History Report</option>
            <option value="prescription-records">Prescription Records Report</option>
            <option value="daily-appointment">Daily Appointment Report</option>
            <option value="completed-appts">Completed Appointment Report</option>
            <option value="cancelled-appts">Cancelled Appointment Report</option>
          </select>
        </div>
        <div>
          <label style="display:block;font-size:.72rem;font-weight:600;color:#374151;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">Start Date</label>
          <input type="date" id="rpt-from" class="form-input" value="${monthStart}" style="width:148px">
        </div>
        <div>
          <label style="display:block;font-size:.72rem;font-weight:600;color:#374151;margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em">End Date</label>
          <input type="date" id="rpt-to" class="form-input" value="${today}" style="width:148px">
        </div>
        <button class="btn-primary" id="rpt-gen-btn" onclick="window.generateReport()"
                style="display:flex;align-items:center;gap:7px;padding:10px 20px;height:40px">
          ${ic('bar-chart','icon-sm')} Generate Report
        </button>
        <button class="btn-secondary rpt-no-print" onclick="window.printReport()"
                style="display:flex;align-items:center;gap:7px;padding:9px 16px;height:40px">
          ${ic('printer','icon-sm')} Print
        </button>
        <button class="rpt-no-print" onclick="window.resetReport()"
                style="background:none;border:none;padding:9px 14px;height:40px;cursor:pointer;font-family:'Poppins',sans-serif;
                       font-size:.82rem;color:#6b7280;border-radius:8px;display:flex;align-items:center;gap:6px;
                       transition:background .15s"
                onmouseenter="this.style.background='#f3f4f6'" onmouseleave="this.style.background='none'">
          ${ic('x','icon-sm')} Reset
        </button>
      </div>
    </div>

    <!-- Report Results Wrap -->
    <div class="table-wrap" id="rpt-results-wrap" style="margin-bottom:24px">
      <div id="rpt-table-header" style="display:none;padding:16px 20px;border-bottom:1px solid #e5e7eb"></div>
      <div id="rpt-table-area">
        <div style="text-align:center;padding:56px 24px;color:#9CA3AF">
          <div style="font-size:.9rem;font-weight:500;color:#6b7280;margin-bottom:6px">No report generated yet</div>
          <div style="font-size:.8rem;color:#9ca3af">Select a report type and click <strong>Generate Report</strong> to view data.</div>
        </div>
      </div>
    </div>

    <!-- Charts Section (hidden until report generated) -->
    <div id="rpt-trends-section" style="display:none">
      <div style="display:flex;align-items:center;gap:9px;margin-bottom:4px">
        ${ic('bar-chart','icon-sm')}
        <span style="font-size:1.1rem;font-weight:700;color:#1f2937">Charts and Summaries</span>
      </div>
      <p style="font-size:.85rem;color:#6b7280;margin:0 0 20px">Charts and graphs based on generated report data above.</p>

      <div class="grid-2" style="margin-bottom:16px">
        <div class="card">
          <div class="card-header"><div><div class="card-title" id="rpt-chart-left-title">&nbsp;</div></div></div>
          <div class="card-body">
            <div style="height:260px;position:relative"><canvas id="rpt-chart-left"></canvas></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div><div class="card-title" id="rpt-chart-right-title">&nbsp;</div></div></div>
          <div class="card-body">
            <div style="height:260px;position:relative"><canvas id="rpt-chart-right"></canvas></div>
          </div>
        </div>
      </div>
    </div>

  </div>`
}

// ════════════════════════════════════════════════════════════════
//  ADMIN — SETTINGS
// ════════════════════════════════════════════════════════════════
function pageAdminSettings() {
  const validSections = ['profile', 'clinic', 'services', 'consultation', 'archives']
  const sec = validSections.includes(st().filter) ? st().filter : 'clinic'

  // ── Section: My Profile ──────────────────────────────────────
  function sectionProfile() {
    const { user } = st()
    const adm = admins.find(a => a.id === user?.id) || user || {}
    const admName = adm.name || `${adm.firstName || ''} ${adm.lastName || ''}`.trim() || 'Administrator'

    const pwField = (id, placeholder) => `
      <div style="position:relative">
        <input type="password" class="form-input" id="${id}" placeholder="${placeholder}" style="padding-right:40px">
        <button type="button" onclick="window.togglePwVisibility('${id}',this)"
                style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9CA3AF;padding:2px;display:flex;align-items:center">
          ${ic('eye','icon-sm')}
        </button>
      </div>`

    return `
    <style>
      @media (min-width: 1024px) { .ad-sett-col { display: grid !important; grid-template-columns: 55fr 45fr; gap: 20px; align-items: start; } }
    </style>
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">My Profile</h1>
        <p class="page-subtitle">Manage your personal account details.</p>
      </div>
    </div>
    <div class="page-body">

      <!-- Profile Banner -->
      <div class="card" style="padding:28px 32px;margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
          <div style="position:relative;flex-shrink:0">
            <label for="ad-photo-input" style="cursor:pointer;display:block;width:80px;height:80px;border-radius:50%;overflow:hidden;position:relative">
              <div id="ad-avatar" style="width:80px;height:80px;border-radius:50%;background:#E8760A;color:#fff;font-size:1.5rem;font-weight:700;display:flex;align-items:center;justify-content:center;overflow:hidden">
                ${user.photoUrl
                  ? `<img src="${user.photoUrl}" alt="Photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">`
                  : initials(admName)}
              </div>
              <div style="position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,0);display:flex;align-items:center;justify-content:center;transition:background .2s"
                   onmouseover="this.style.background='rgba(0,0,0,.45)'"
                   onmouseout="this.style.background='rgba(0,0,0,0)'"></div>
            </label>
            <label for="ad-photo-input" style="position:absolute;bottom:0;right:0;width:24px;height:24px;border-radius:50%;background:#E8760A;border:2px solid #fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2)">
              ${ic('camera','icon-sm')}
            </label>
            <input type="file" id="ad-photo-input" accept="image/*" style="display:none"
                   onchange="window.handlePhotoUpload(this,'ad-avatar')">
          </div>
          <div style="flex:1;min-width:160px">
            <div style="font-size:1.2rem;font-weight:700;color:#1C1C1C">${admName}</div>
            <div style="font-size:.85rem;color:#E8760A;font-weight:600;margin-top:3px">Administrator</div>
            <div style="font-size:.82rem;color:#6B7280;margin-top:4px">${adm.email || ''}</div>
            <div style="font-size:.82rem;color:#6B7280">${adm.contact || ''}</div>
          </div>
          <label for="ad-photo-input" class="btn-secondary" style="flex-shrink:0;cursor:pointer">
            ${ic('camera','icon-sm')} Change Photo
          </label>
        </div>
      </div>

      <div class="ad-sett-col" style="display:flex;flex-direction:column;gap:20px">

        <!-- LEFT: Personal Info -->
        <div class="card" style="padding:28px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
            <div style="color:#E8760A">${ic('user','icon-sm')}</div>
            <div style="font-size:1.05rem;font-weight:700;color:#1C1C1C">Personal Information</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input class="form-input" id="ad-fname" value="${adm.firstName || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input class="form-input" id="ad-lname" value="${adm.lastName || ''}">
              </div>
            </div>
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input class="form-input" type="email" id="ad-email" value="${adm.email || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input class="form-input" id="ad-phone" value="${adm.contact || ''}">
              </div>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:4px">
              <button class="btn-primary" onclick="window.saveUserProfile()">
                ${ic('check','icon-sm')} Save Changes
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT: Security -->
        <div class="card" style="padding:28px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <div style="color:#E8760A">${ic('shield','icon-sm')}</div>
            <div style="font-size:1.05rem;font-weight:700;color:#1C1C1C">Security</div>
          </div>
          <div style="font-size:.82rem;color:#9CA3AF;margin-bottom:20px">Change your account password</div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="form-group">
              <label class="form-label">Current Password</label>
              ${pwField('ad-curpw','Enter current password')}
            </div>
            <div class="form-group">
              <label class="form-label">New Password</label>
              ${pwField('ad-newpw','Minimum 8 characters')}
            </div>
            <div class="form-group">
              <label class="form-label">Confirm New Password</label>
              ${pwField('ad-confpw','Repeat new password')}
              <div id="ad-pw-err" style="color:#DC2626;font-size:.75rem;margin-top:5px;display:none">Passwords do not match.</div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:6px;font-size:.78rem;color:#9CA3AF">
              ${ic('info','icon-sm')} Minimum 8 characters with at least one number and one letter.
            </div>
            <div style="display:flex;justify-content:flex-end">
              <button class="btn-primary"
                      onclick="window.validateSettingsPassword('ad-newpw','ad-confpw','ad-pw-err','ad-curpw')">
                ${ic('lock','icon-sm')} Update Password
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>`
  }

  // ── Section: Clinic Information ─────────────────────────────
  function sectionClinic() {
    return `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Clinic Information</h1>
        <p class="page-subtitle">Manage clinic details displayed across the system.</p>
      </div>
    </div>
    <div class="page-body">
      <div class="card" style="padding:24px 28px">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Clinic Name <span class="req">*</span></label>
            <input class="form-input" id="ci-name" value="${clinicInfo.name.replace(/"/g,'&quot;')}">
          </div>
          <div class="form-group">
            <label class="form-label">Contact Number</label>
            <input class="form-input" id="ci-phone" value="${clinicInfo.phone.replace(/"/g,'&quot;')}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Clinic Address</label>
          <input class="form-input" id="ci-address" value="${clinicInfo.address.replace(/"/g,'&quot;')}">
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Email Address <span class="req">*</span></label>
            <input class="form-input" type="email" id="ci-email" value="${clinicInfo.email.replace(/"/g,'&quot;')}">
          </div>
          <div class="form-group">
            <label class="form-label">Operating Hours</label>
            <input class="form-input" id="ci-hours" value="${clinicInfo.hours.replace(/"/g,'&quot;')}">
          </div>
        </div>

        <div style="border-top:1px solid #F3F4F6;margin:20px 0 16px"></div>
        <div style="font-size:.85rem;font-weight:600;color:#374151;margin-bottom:12px">Clinic Logo</div>
        <div style="display:flex;align-items:center;gap:16px">
          <div style="width:60px;height:60px;border-radius:50%;background:#FFF0DC;border:1.5px solid #FFD9A8;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0">
            <img id="ci-logo-preview" src="${clinicInfo.logoUrl || 'brand_assests/cana logo.png'}" style="width:50px;height:50px;object-fit:contain">
          </div>
          <div>
            <label for="ci-logo-input" style="cursor:pointer">
              <div class="btn-secondary" style="display:inline-flex;align-items:center;gap:6px;font-size:.8rem;padding:7px 14px">
                ${ic('upload','icon-sm')} Upload New Logo
              </div>
            </label>
            <div style="font-size:.72rem;color:#9CA3AF;margin-top:4px">PNG, JPG, SVG</div>
            <input type="file" id="ci-logo-input" accept="image/*" style="display:none"
                   onchange="window.handleLogoUpload(this,'ci-logo-preview')">
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;margin-top:24px">
          <button class="btn-primary" onclick="window.saveClinicInfo()">
            ${ic('check','icon-sm')} Save Changes
          </button>
        </div>
      </div>
    </div>`
  }

  // ── Section: Services ────────────────────────────────────────
  function sectionServices() {
    function svcStatusBadge(s) {
      return s === 'active'
        ? `<span style="background:#D1FAE5;color:#065F46;font-size:.72rem;font-weight:600;padding:2px 10px;border-radius:20px">Active</span>`
        : `<span style="background:#F3F4F6;color:#6B7280;font-size:.72rem;font-weight:600;padding:2px 10px;border-radius:20px">Inactive</span>`
    }
    return `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Services Management</h1>
        <p class="page-subtitle">Configure the appointment types and services offered by the clinic.</p>
      </div>
    </div>
    <div class="page-body">

      <!-- Add New Service form -->
      <div class="card" style="padding:20px 24px;margin-bottom:16px">
        <div style="font-size:.9rem;font-weight:700;color:#1C1C1C;margin-bottom:16px">${ic('plus-circle','icon-sm')} Add New Service</div>
        <div class="form-row-2">
          <div class="form-group" style="margin-bottom:10px">
            <label class="form-label">Service Name <span class="req">*</span></label>
            <input class="form-input" id="svc-name" placeholder="e.g. Eye Examination">
          </div>
          <div class="form-group" style="margin-bottom:10px">
            <label class="form-label">Description</label>
            <input class="form-input" id="svc-desc" placeholder="Brief description of the service">
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Duration (minutes)</label>
            <input class="form-input" type="number" id="svc-duration" value="30" min="5" max="240">
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Status</label>
            <select class="form-select" id="svc-status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:16px">
          <button class="btn-primary" onclick="window.addService()">
            ${ic('plus','icon-sm')} Add Service
          </button>
        </div>
      </div>

      <!-- Services table -->
      <div class="table-wrap">
        <div class="table-toolbar">
          <span class="table-title" id="svc-count">${CLINIC_SERVICES.length} service${CLINIC_SERVICES.length !== 1 ? 's' : ''}</span>
        </div>
        <table class="tbl" style="table-layout:fixed">
          <colgroup>
            <col style="width:5%"><col style="width:20%"><col style="width:32%">
            <col style="width:10%"><col style="width:11%"><col style="width:12%">
          </colgroup>
          <thead><tr>
            <th>#</th>
            <th data-sort-key="name" data-sort-type="text">Service Name</th>
            <th>Description</th>
            <th>Duration</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody id="services-tbody">
            ${CLINIC_SERVICES.map((s, i) => `
            <tr data-search="${s.name.toLowerCase()} ${s.description.toLowerCase()}" data-sort-name="${s.name.toLowerCase()}">
              <td style="color:#9CA3AF;font-size:.75rem">${i + 1}</td>
              <td><strong style="font-size:.83rem">${s.name}</strong></td>
              <td style="font-size:.78rem;color:#6B7280;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:0">${s.description}</td>
              <td style="font-size:.82rem">${s.duration} min</td>
              <td>${svcStatusBadge(s.status)}</td>
              <td>
                <div style="display:flex;gap:4px;align-items:center;flex-wrap:nowrap">
                  <button class="btn-icon" title="Edit" onclick="window.editServiceModal(${s.id})">${ic('edit','icon-sm')}</button>
                  <button class="btn-icon" title="Archive" style="color:#D97706;border-color:#FEF3C7" onclick="window.archiveServiceConfirm(${s.id},'${s.name.replace(/'/g,"\\'")}')">
                    ${ic('archive','icon-sm')}
                  </button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`
  }

  // ── Section: Consultation Settings ──────────────────────────
  function sectionConsultation() {
    const cs = consultationSettings
    function timeOpts(selected) {
      const slots = []
      for (let h = 7; h <= 21; h++) {
        for (const m of [0, 30]) {
          const hh   = h % 12 === 0 ? 12 : h % 12
          const ampm = h < 12 ? 'AM' : 'PM'
          const lbl  = `${hh}:${m === 0 ? '00' : '30'} ${ampm}`
          slots.push(`<option${lbl === selected ? ' selected' : ''}>${lbl}</option>`)
        }
      }
      return slots.join('')
    }
    const durationOpts = ['15 min','20 min','25 min','30 min','45 min','60 min']
    const maxAdvOpts   = ['1 week','2 weeks','1 month','2 months','3 months']
    const minAdvOpts   = ['Same day','1 day','2 days','3 days']
    const allDays      = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    return `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Consultation Settings</h1>
        <p class="page-subtitle">Configure appointment scheduling rules and clinic policies.</p>
      </div>
    </div>
    <div class="page-body" style="display:flex;flex-direction:column;gap:16px">

      <!-- Scheduling Rules -->
      <div class="card" style="padding:20px 24px">
        <div style="font-size:.9rem;font-weight:700;color:#1C1C1C;margin-bottom:4px">Scheduling Rules</div>
        <div style="font-size:.78rem;color:#9CA3AF;margin-bottom:16px">Set default scheduling parameters for the clinic.</div>
        <div class="form-row-2">
          <div class="form-group" style="margin-bottom:12px">
            <label class="form-label">Default Consultation Duration</label>
            <select class="form-select" id="cs-duration">
              ${durationOpts.map(o => `<option${o === cs.defaultDuration ? ' selected' : ''}>${o}</option>`).join('')}
            </select>
            <div style="font-size:.72rem;color:#9CA3AF;margin-top:4px">Default time allocated per appointment slot.</div>
          </div>
          <div class="form-group" style="margin-bottom:12px">
            <label class="form-label">Maximum Advance Booking</label>
            <select class="form-select" id="cs-adv-max">
              ${maxAdvOpts.map(o => `<option${o === cs.maxAdvanceBooking ? ' selected' : ''}>${o}</option>`).join('')}
            </select>
            <div style="font-size:.72rem;color:#9CA3AF;margin-top:4px">How far in advance patients can book appointments.</div>
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Minimum Advance Booking</label>
            <select class="form-select" id="cs-adv-min">
              ${minAdvOpts.map(o => `<option${o === cs.minAdvanceBooking ? ' selected' : ''}>${o}</option>`).join('')}
            </select>
            <div style="font-size:.72rem;color:#9CA3AF;margin-top:4px">Earliest a patient can book before the appointment date.</div>
          </div>
          <div class="form-group" style="margin-bottom:0">
            <label class="form-label">Max Appointments Per Doctor Per Day</label>
            <input class="form-input" type="number" id="cs-max-appt" value="${cs.maxApptsPerDoctorPerDay}" min="1" max="50">
            <div style="font-size:.72rem;color:#9CA3AF;margin-top:4px">Limits the number of appointments a doctor can receive per day.</div>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:16px">
          <button class="btn-primary" onclick="window.saveSchedulingRules()">
            ${ic('check','icon-sm')} Save Scheduling Rules
          </button>
        </div>
      </div>

      <!-- Operating Hours -->
      <div class="card" style="padding:20px 24px">
        <div style="font-size:.9rem;font-weight:700;color:#1C1C1C;margin-bottom:4px">Clinic Operating Hours</div>
        <div style="font-size:.78rem;color:#9CA3AF;margin-bottom:16px">Set the standard consultation hours for the clinic.</div>

        <div class="form-row-2" style="margin-bottom:12px">
          <div>
            <div style="font-size:.8rem;font-weight:600;color:#374151;margin-bottom:8px">Morning Session</div>
            <div style="display:flex;gap:10px">
              <div class="form-group" style="flex:1;margin-bottom:0">
                <label class="form-label">Start</label>
                <select class="form-select" id="cs-am-start">${timeOpts(cs.morningStart)}</select>
              </div>
              <div class="form-group" style="flex:1;margin-bottom:0">
                <label class="form-label">End</label>
                <select class="form-select" id="cs-am-end">${timeOpts(cs.morningEnd)}</select>
              </div>
            </div>
          </div>
          <div>
            <div style="font-size:.8rem;font-weight:600;color:#374151;margin-bottom:8px">Afternoon Session</div>
            <div style="display:flex;gap:10px">
              <div class="form-group" style="flex:1;margin-bottom:0">
                <label class="form-label">Start</label>
                <select class="form-select" id="cs-pm-start">${timeOpts(cs.afternoonStart)}</select>
              </div>
              <div class="form-group" style="flex:1;margin-bottom:0">
                <label class="form-label">End</label>
                <select class="form-select" id="cs-pm-end">${timeOpts(cs.afternoonEnd)}</select>
              </div>
            </div>
          </div>
        </div>

        <label style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:6px">
          <input type="checkbox" id="cs-lunch-break" ${cs.lunchBreak ? 'checked' : ''} style="width:15px;height:15px;accent-color:#E8760A">
          <span style="font-size:.82rem;font-weight:500;color:#374151">Lunch break between sessions</span>
        </label>
        <div style="font-size:.75rem;color:#9CA3AF;margin-bottom:16px">Break: ${cs.morningEnd} – ${cs.afternoonStart} (auto-calculated)</div>

        <div style="font-size:.8rem;font-weight:600;color:#374151;margin-bottom:8px">Clinic Days</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:6px">
          ${allDays.map(d => `
          <label style="display:inline-flex;align-items:center;gap:5px;cursor:pointer;padding:5px 10px;border-radius:8px;border:1px solid #E5E7EB;background:#fff;font-size:.8rem">
            <input type="checkbox" class="cs-clinic-day" value="${d}" ${cs.clinicDays.includes(d) ? 'checked' : ''} style="accent-color:#E8760A;width:14px;height:14px">
            ${d.slice(0,3)}
          </label>`).join('')}
        </div>
        <div style="font-size:.72rem;color:#9CA3AF;margin-bottom:16px">Days the clinic is open for consultations. Individual doctor schedules may vary.</div>

        <div style="display:flex;justify-content:flex-end">
          <button class="btn-primary" onclick="window.saveOperatingHours()">
            ${ic('check','icon-sm')} Save Operating Hours
          </button>
        </div>
      </div>
    </div>`
  }

  // ── Section: Archives ────────────────────────────────────────
  function sectionArchives() {
    const arcFilter = st().archivesFilter || 'all'
    const tabs = ['all','Patient','Appointment','Account','Examination']
    const list = arcFilter === 'all' ? archivedRecords : archivedRecords.filter(r => r.type === arcFilter)
    const typeBadge = t => {
      const map = { Patient:'#DBEAFE:#1D4ED8', Appointment:'#FEF3C7:#d97706', Account:'#EDE9FE:#5B21B6', Examination:'#D1FAE5:#065F46' }
      const [bg, col] = (map[t] || '#F3F4F6:#374151').split(':')
      return `<span style="background:${bg};color:${col};font-size:.68rem;font-weight:700;padding:2px 10px;border-radius:20px;letter-spacing:.04em">${t}</span>`
    }
    return `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Archives</h1>
        <p class="page-subtitle">View and manage archived records. Only archived records can be permanently deleted.</p>
      </div>
    </div>
    <div class="page-body">
      <div class="table-wrap">
        <div class="filter-tabs" style="padding:12px 20px 0;border-bottom:1px solid #f3f4f6">
          ${tabs.map(t => `<button class="filter-tab${arcFilter===t||(t==='all'&&arcFilter==='all')?' active':''}"
            onclick="window.state.archivesFilter='${t}';window.renderPage()">${t==='all'?'All':t+'s'}</button>`).join('')}
        </div>
        <div class="table-toolbar" style="padding:12px 20px">
          <span class="table-title">${list.length} archived record${list.length!==1?'s':''}</span>
          <div class="table-actions">
            <div class="search-input-wrap">
              ${ic('search','icon-sm')}
              <input class="search-input" placeholder="Search by name…" oninput="window.filterTable(this,'archives-tbody')">
            </div>
          </div>
        </div>
        ${list.length ? `
        <table class="tbl" style="table-layout:fixed;min-width:700px">
          <colgroup>
            <col style="width:10%"><col style="width:26%"><col style="width:13%"><col style="width:27%"><col style="width:12%"><col style="width:12%">
          </colgroup>
          <thead><tr>
            <th>Type</th>
            <th data-sort-key="name" data-sort-type="text">Name / ID</th>
            <th>Archived By</th><th>Reason</th>
            <th data-sort-key="date" data-sort-type="date">Date</th>
            <th>Actions</th>
          </tr></thead>
          <tbody id="archives-tbody">
            ${list.map(r => `<tr data-search="${r.name.toLowerCase()} ${r.refId.toLowerCase()} ${r.archivedBy.toLowerCase()}" data-sort-name="${r.name.toLowerCase()}" data-sort-date="${r.date}">
              <td style="white-space:nowrap">${typeBadge(r.type)}</td>
              <td style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:0">
                <span style="font-size:.82rem;font-weight:600;color:#1f2937">${r.name}</span>
                <span style="font-size:.72rem;color:#9ca3af;margin-left:5px">${r.refId}</span>
              </td>
              <td style="font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:0">${r.archivedBy}</td>
              <td style="font-size:.78rem;color:#6b7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:0" title="${r.reason}">${r.reason}</td>
              <td style="font-size:.78rem;white-space:nowrap">${r.date}</td>
              <td style="white-space:nowrap">
                <div style="display:flex;gap:4px;align-items:center;flex-wrap:nowrap">
                  <button class="btn-icon" title="View" onclick="window.viewArchivedRecord('${r.id}')">${ic('eye','icon-sm')}</button>
                  <button class="btn-icon" title="Restore" style="color:#16a34a;border-color:#d1fae5" onclick="window.confirmRestore('${r.id}','${r.name.replace(/'/g,"\\'")}')">${ic('rotate-ccw','icon-sm')}</button>
                  <button class="btn-icon" title="Delete Forever" style="color:#dc2626;border-color:#fee2e2" onclick="window.confirmPermDelete('${r.id}','${r.name.replace(/'/g,"\\'")}')">${ic('trash','icon-sm')}</button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>` : `
        <div class="table-empty" style="padding:40px">No archived records${arcFilter!=='all'?' of this type':''}.</div>`}
      </div>
    </div>`
  }

  if (sec === 'archives') window.state.afterRender = () => { window.initPagination('archives-tbody'); window.initSortable('archives-tbody') }
  if (sec === 'services') window.state.afterRender = () => { window.initPagination('services-tbody'); window.initSortable('services-tbody') }

  const sections = { profile: sectionProfile, clinic: sectionClinic, services: sectionServices, consultation: sectionConsultation, archives: sectionArchives }
  return (sections[sec] || sections.clinic)()
}

// ════════════════════════════════════════════════════════════════
//  ADMIN — ACTIVITY LOG
// ════════════════════════════════════════════════════════════════
function pageActivityLog() {
  const typeBadgeStyle = {
    login:       'background:#EFF6FF;color:#1D4ED8',
    appointment: 'background:#FFF7ED;color:#C2410C',
    patient:     'background:#F0FDF4;color:#15803D',
    examination: 'background:#FAF5FF;color:#7E22CE',
    report:      'background:#F0FDFA;color:#0F766E',
    account:     'background:#EEF2FF;color:#4338CA',
    schedule:    'background:#FEFCE8;color:#A16207',
    settings:    'background:#F9FAFB;color:#374151',
    archive:     'background:#FFF1F2;color:#BE123C'
  }
  function logTypeBadge(type) {
    const style = typeBadgeStyle[type] || 'background:#F3F4F6;color:#6B7280'
    const label = type.charAt(0).toUpperCase() + type.slice(1)
    return `<span style="display:inline-flex;align-items:center;padding:2px 9px;border-radius:999px;font-size:.72rem;font-weight:600;${style}">${label}</span>`
  }

  const today      = new Date().toISOString().split('T')[0]
  const monthStart = today.slice(0,8) + '01'

  window.state.afterRender = () => { window.initPagination('log-tbody'); window.initSortable('log-tbody'); window.applyLogFilters() }

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Activity Log</h1>
      <p class="page-subtitle">System-wide audit trail of all actions</p>
    </div>
    <button class="btn-secondary" onclick="window.exportLog()">${ic('download','icon-sm')} Export Log</button>
  </div>
  <div class="page-body">
    <div class="table-wrap">

      <!-- ── Filter bar ── -->
      <div style="padding:12px 16px;border-bottom:1px solid #F3F4F6;display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
        <div class="form-group" style="margin:0;flex:0 0 auto">
          <label class="form-label" style="font-size:.72rem">Role</label>
          <select id="log-role-filter" class="form-select" style="width:auto;padding:7px 38px 7px 12px;font-size:.82rem"
                  onchange="window.applyLogFilters()">
            <option value="">All Roles</option>
            <option>Admin</option><option>Staff</option><option>Doctor</option><option>Patient</option>
          </select>
        </div>
        <div class="form-group" style="margin:0;flex:0 0 auto">
          <label class="form-label" style="font-size:.72rem">Action Type</label>
          <select id="log-type-filter" class="form-select" style="width:auto;padding:7px 38px 7px 12px;font-size:.82rem"
                  onchange="window.applyLogFilters()">
            <option value="">All Types</option>
            <option value="login">Login</option>
            <option value="appointment">Appointment</option>
            <option value="patient">Patient</option>
            <option value="examination">Examination</option>
            <option value="report">Report</option>
            <option value="account">Account</option>
            <option value="schedule">Schedule</option>
            <option value="settings">Settings</option>
            <option value="archive">Archive</option>
          </select>
        </div>
        <div class="form-group" style="margin:0;flex:0 0 auto">
          <label class="form-label" style="font-size:.72rem">From Date</label>
          <input type="date" id="log-date-from" class="form-input" value="${monthStart}" style="width:150px;padding:7px 10px"
                 onchange="window.applyLogFilters()">
        </div>
        <div class="form-group" style="margin:0;flex:0 0 auto">
          <label class="form-label" style="font-size:.72rem">To Date</label>
          <input type="date" id="log-date-to" class="form-input" value="${today}" style="width:150px;padding:7px 10px"
                 onchange="window.applyLogFilters()">
        </div>
        <div class="search-input-wrap" style="flex:1;min-width:180px;align-self:flex-end">
          ${ic('search','icon-sm')}
          <input id="log-search" class="search-input" placeholder="Search user or action…"
                 oninput="window.applyLogFilters()">
        </div>
        <button class="btn-ghost" style="font-size:.78rem;align-self:flex-end" onclick="window.clearLogFilters()">
          ${ic('x','icon-sm')} Clear Filters
        </button>
        <button class="btn-danger" style="font-size:.78rem;align-self:flex-end" onclick="window.clearAllLogs()">
          ${ic('trash-2','icon-sm')} Clear All Logs
        </button>
      </div>

      ${activityLog.length ? `
      <div class="table-toolbar" style="padding:10px 16px">
        <span class="table-title" id="log-count">${activityLog.length} log entries</span>
      </div>
      <table class="tbl">
        <colgroup>
          <col style="width:5%"><col style="width:16%"><col style="width:9%">
          <col style="width:38%"><col style="width:18%"><col style="width:14%">
        </colgroup>
        <thead><tr>
          <th>#</th>
          <th data-sort-key="user" data-sort-type="text">User</th>
          <th>Role</th><th>Action</th>
          <th data-sort-key="ts" data-sort-type="date">Timestamp</th>
          <th>Type</th>
        </tr></thead>
        <tbody id="log-tbody">
          ${activityLog.map((l,i) => `<tr
            data-search="${l.user.toLowerCase()} ${l.action.toLowerCase()}"
            data-role="${l.role.toLowerCase()}"
            data-type="${l.type}"
            data-ts="${l.timestamp}"
            data-sort-user="${l.user.toLowerCase()}"
            data-sort-ts="${l.timestamp}">
            <td style="color:#9CA3AF;font-size:.75rem">${i+1}</td>
            <td><div class="patient-name-cell">${avatar(l.user)}<strong style="font-size:.82rem">${l.user}</strong></div></td>
            <td>${badge(l.role.toLowerCase())}</td>
            <td style="font-size:.82rem;max-width:380px">${l.action}</td>
            <td style="font-size:.75rem;color:#9CA3AF;white-space:nowrap">${l.timestamp}</td>
            <td>${logTypeBadge(l.type)}</td>
          </tr>`).join('')}
          <tr id="log-empty-row" style="display:none">
            <td colspan="6"><div class="table-empty">No activities found.</div></td>
          </tr>
        </tbody>
      </table>
      ` : `<div class="table-empty">No activities found.</div>`}
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  STAFF — DASHBOARD
// ════════════════════════════════════════════════════════════════
function pageStaffDashboard() {
  const pending  = appointments.filter(a => a.status === 'pending')
  const approved = appointments.filter(a => a.status === 'approved')

  window.state.afterRender = () => {
    window._charts.initStaffOverviewChart()
    window.updateStaffDashboard()
  }

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Staff Dashboard</h1>
      <p class="page-subtitle">Welcome, ${st().user?.firstName}. Manage today's clinic operations.</p>
    </div>
  </div>
  <div class="page-body">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-info"><div class="stat-label">Pending Approval</div><div class="stat-value" id="staff-stat-pending">${pending.length}</div><div class="stat-delta" style="color:#F59E0B">Needs review</div></div>
        <div class="stat-icon orange">${ic('clock','icon-lg')}</div>
      </div>
      <div class="stat-card">
        <div class="stat-info"><div class="stat-label">Approved Today</div><div class="stat-value" id="staff-stat-approved">${approved.length}</div></div>
        <div class="stat-icon green">${ic('check-circle','icon-lg')}</div>
      </div>
      <div class="stat-card">
        <div class="stat-info"><div class="stat-label">Total Patients</div><div class="stat-value" id="staff-stat-patients">${patients.length}</div></div>
        <div class="stat-icon blue">${ic('users','icon-lg')}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">Weekly Appointments</div></div>
        <div class="card-body"><div class="chart-wrap"><canvas id="chart-staff-overview"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">Pending Approvals</div>
          <button class="btn-ghost" onclick="window.navigate('appointments',{filter:'pending'})"
                  style="font-size:.75rem;padding:4px 10px">View All</button>
        </div>
        <div class="card-body" style="padding:0">
          ${pending.length ? `<table class="tbl"><thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Action</th></tr></thead><tbody id="staff-appts-tbody">
            ${pending.slice(0,5).map(a=>`<tr>
              <td style="font-size:.82rem;font-weight:600">${a.patientName}</td>
              <td style="font-size:.78rem;color:#6B7280">${a.doctorName.replace('Dr. ','')}</td>
              <td style="font-size:.78rem">${fmtDate(a.date)}</td>
              <td><button class="btn-success" onclick="window.approveAppt('${a.id}')">Approve</button></td>
            </tr>`).join('')}
          </tbody></table>` : `<div class="table-empty" id="staff-appts-tbody">No pending appointments.</div>`}
        </div>
      </div>
    </div>

  </div>`
}

// ════════════════════════════════════════════════════════════════
//  DOCTOR — DASHBOARD
// ════════════════════════════════════════════════════════════════
function pageDoctorDashboard() {
  const { user } = st()
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr  = new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

  const todayStr  = new Date().toISOString().split('T')[0]
  const timeVal   = t => { if (!t) return 0; const cl = t.includes('PM') && !t.startsWith('12'), [h,m] = t.replace(/ [AP]M$/,'').split(':').map(Number); return (cl ? h+12 : (t.includes('AM') && h===12 ? 0 : h))*60+m }

  const todayList    = appointments.filter(a => a.date === todayStr && !['cancelled','disapproved'].includes(a.status))
                         .sort((a,b) => timeVal(a.time) - timeVal(b.time))
  const upcomingList = appointments.filter(a => a.date > todayStr && ['approved','pending'].includes(a.status))
  const weekStart    = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartStr = weekStart.toISOString().split('T')[0]
  const thisWeek     = appointments.filter(a => a.status === 'completed' && a.date >= weekStartStr).length
  const pendingAppts = appointments.filter(a => a.status === 'pending').length

  const nextUp = upcomingList[0]
  const nextLabel = nextUp ? `Next: ${nextUp.time}, ${nextUp.patientName}` : 'No upcoming'

  const recentDone = appointments.filter(a => a.status === 'completed')
    .sort((a,b) => b.date.localeCompare(a.date)).slice(0, 5)

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">${greeting}, ${user?.name || 'Doctor'}</h1>
      <p class="page-subtitle">Here's your clinic overview for today.</p>
    </div>
    <span style="font-size:.78rem;color:#9CA3AF">${dateStr}</span>
  </div>
  <div class="page-body">

    <!-- Stat Cards -->
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card stat-card--clickable" onclick="window.navigate('doctor-appointments',{filter:'today'})">
        <div class="stat-info">
          <div class="stat-label">Patients Today</div>
          <div class="stat-value">${todayList.length}</div>
          <div class="stat-delta" style="color:#9CA3AF">${todayList.length ? `${todayList.filter(a=>a.status==='completed').length} completed` : 'None scheduled'}</div>
        </div>
        <div class="stat-icon orange">${ic('users','icon-lg')}</div>
      </div>
      <div class="stat-card stat-card--clickable" onclick="window.navigate('doctor-appointments',{filter:'upcoming'})">
        <div class="stat-info">
          <div class="stat-label">Upcoming Appointments</div>
          <div class="stat-value">${upcomingList.length}</div>
          <div class="stat-delta" style="color:#9CA3AF;font-size:.7rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${nextLabel}</div>
        </div>
        <div class="stat-icon blue">${ic('calendar','icon-lg')}</div>
      </div>
      <div class="stat-card stat-card--clickable" onclick="window.navigate('doctor-appointments',{filter:'completed'})">
        <div class="stat-info">
          <div class="stat-label">Completed This Week</div>
          <div class="stat-value">${thisWeek}</div>
          <div class="stat-delta" style="color:#10B981">${thisWeek ? 'Consultations done' : 'None this week'}</div>
        </div>
        <div class="stat-icon green">${ic('eye','icon-lg')}</div>
      </div>
      <div class="stat-card stat-card--clickable" onclick="window.navigate('doctor-appointments',{filter:'today'})">
        <div class="stat-info">
          <div class="stat-label">Pending Approval</div>
          <div class="stat-value">${pendingAppts}</div>
          <div class="stat-delta" style="color:${pendingAppts ? '#E8891C' : '#9CA3AF'}">${pendingAppts ? 'Awaiting admin approval' : 'All approved'}</div>
        </div>
        <div class="stat-icon red">${ic('clock','icon-lg')}</div>
      </div>
    </div>

    <!-- Today's Patients -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-header">
        <div class="card-title">${ic('calendar','icon-sm')} Today's Patients</div>
        <button class="btn-ghost" style="font-size:.75rem;padding:4px 10px"
                onclick="window.navigate('doctor-appointments',{filter:'today'})">View All</button>
      </div>
      ${todayList.length ? `
      <div style="overflow-x:auto">
      <table class="tbl">
        <colgroup>
          <col style="width:24%"><col style="width:11%"><col style="width:22%">
          <col style="width:15%"><col style="width:28%">
        </colgroup>
        <thead><tr><th>Patient</th><th>Time</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${todayList.map(a => `<tr>
            <td><div class="patient-name-cell">
              ${avatar(a.patientName, 'patient-avatar', patients.find(p=>p.id===a.patientId)?.photoUrl || null)}
              <div class="patient-name-info"><strong>${a.patientName}</strong><span>${a.patientId}</span></div>
            </div></td>
            <td style="font-size:.82rem;font-weight:600;white-space:nowrap">${a.time}</td>
            <td style="font-size:.82rem">${a.type}</td>
            <td>${badge(a.status)}</td>
            <td>${a.status === 'completed'
              ? `<button class="btn-ghost" style="font-size:.75rem;padding:4px 10px" onclick="window.navigate('patient-view',{patientId:'${a.patientId}',patientName:'${a.patientName}'})">${ic('eye','icon-sm')} View Record</button>`
              : `<button class="btn-primary btn-sm" onclick="window.startExamFromAppt('${a.id}','${a.patientId}')">${ic('check','icon-sm')} Start Consultation</button>`
            }</td>
          </tr>`).join('')}
        </tbody>
      </table>
      </div>` : `<div class="table-empty">No patients scheduled for today.</div>`}
    </div>

    <!-- Recent Completed Appointments -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">${ic('check-circle','icon-sm')} Recent Completed</div>
        <button class="btn-ghost" style="font-size:.75rem;padding:4px 10px"
                onclick="window.navigate('doctor-appointments',{filter:'completed'})">View All</button>
      </div>
      ${recentDone.length ? `
      <div style="overflow-x:auto">
      <table class="tbl">
        <colgroup>
          <col style="width:28%"><col style="width:18%"><col style="width:30%"><col style="width:12%"><col style="width:12%">
        </colgroup>
        <thead><tr><th>Patient</th><th>Date</th><th>Type</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${recentDone.map(a => `<tr>
            <td><div class="patient-name-cell">
              ${avatar(a.patientName, 'patient-avatar', patients.find(p=>p.id===a.patientId)?.photoUrl || null)}
              <div class="patient-name-info"><strong>${a.patientName}</strong></div>
            </div></td>
            <td style="font-size:.78rem;color:#6B7280;white-space:nowrap">${fmtDate(a.date)}</td>
            <td style="font-size:.78rem">${a.type}</td>
            <td>${badge(a.status)}</td>
            <td><button class="btn-icon" title="View" onclick="window.navigate('patient-view',{patientId:'${a.patientId}',patientName:'${a.patientName}'})">${ic('eye','icon-sm')}</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
      </div>` : `<div class="table-empty">No completed appointments yet.</div>`}
    </div>

  </div>`
}


// ════════════════════════════════════════════════════════════════
//  DOCTOR — MY APPOINTMENTS
// ════════════════════════════════════════════════════════════════
function pageDoctorAppointments() {
  const { filter } = st()
  const activeFilter = (filter && filter !== 'all') ? filter : 'today'
  if (activeFilter !== filter) window.state.filter = activeFilter

  const todayStr = new Date().toISOString().split('T')[0]
  const timeVal  = t => { if (!t) return 0; const cl = t.includes('PM') && !t.startsWith('12'), [h,m] = t.replace(/ [AP]M$/,'').split(':').map(Number); return (cl ? h+12 : (t.includes('AM') && h===12 ? 0 : h))*60+m }

  const todayList    = appointments.filter(a => a.date === todayStr && !['cancelled','disapproved'].includes(a.status))
                         .sort((a,b) => timeVal(a.time) - timeVal(b.time))
  const upcomingList = appointments.filter(a => a.date > todayStr && ['approved','pending'].includes(a.status))
                         .sort((a,b) => a.date.localeCompare(b.date) || timeVal(a.time) - timeVal(b.time))
  const completedList = appointments.filter(a => a.status === 'completed')
                         .sort((a,b) => b.date.localeCompare(a.date))

  window.state.afterRender = () => { window.initPagination('doc-appt-tbody'); window.initSortable('doc-appt-tbody') }

  let list
  if (activeFilter === 'today')     list = todayList
  else if (activeFilter === 'upcoming') list = upcomingList
  else                                  list = completedList

  const titleMap = {
    today:     "Today's Appointments",
    upcoming:  'Upcoming Appointments',
    completed: 'Completed Appointments'
  }
  const subMap = {
    today:     'Your consultation schedule for today.',
    upcoming:  'Confirmed appointments on your schedule.',
    completed: 'Past completed consultations.'
  }

  const docActions = a => {
    const viewBtn  = `<button class="btn-icon" title="View Details" onclick="window.viewAppt('${a.id}')">${ic('eye','icon-sm')}</button>`
    const recBtn   = `<button class="btn-icon" title="Patient Record" onclick="window.navigate('patient-view',{patientId:'${a.patientId}',patientName:'${a.patientName}'})">${ic('user','icon-sm')}</button>`
    if (a.status === 'completed') return `<div style="display:flex;gap:4px">${viewBtn}${recBtn}</div>`
    const startBtn = `<button class="btn-icon" title="Start Consultation" style="color:#E8760A"
      onclick="window.startExamFromAppt('${a.id}','${a.patientId}')">${ic('check','icon-sm')}</button>`
    return `<div style="display:flex;gap:4px">${viewBtn}${recBtn}${startBtn}</div>`
  }

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">${titleMap[activeFilter]}</h1>
      <p class="page-subtitle">${subMap[activeFilter]}</p>
    </div>
  </div>
  <div class="page-body">
    <div class="table-wrap">
      <div class="table-toolbar">
        <span class="table-title">${list.length} record${list.length !== 1 ? 's' : ''}</span>
        <div class="table-actions">
          <div class="search-input-wrap">
            ${ic('search','icon-sm')}
            <input class="search-input" placeholder="Search patient or type…"
                   oninput="window.filterTable(this,'doc-appt-tbody')">
          </div>
        </div>
      </div>
      <table class="tbl">
        <colgroup>
          <col style="width:7%"><col style="width:22%"><col style="width:12%">
          <col style="width:10%"><col style="width:20%"><col style="width:13%"><col style="width:16%">
        </colgroup>
        <thead><tr>
          <th>ID</th>
          <th data-sort-key="patient" data-sort-type="text">Patient</th>
          <th data-sort-key="date" data-sort-type="date">Date</th>
          <th>Time</th><th>Type</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody id="doc-appt-tbody">
          ${list.length ? list.map(a => `<tr data-search="${(a.patientName||'').toLowerCase()} ${(a.type||'').toLowerCase()}" data-sort-patient="${(a.patientName||'').toLowerCase()}" data-sort-date="${a.date}">
            <td><code style="font-size:.73rem;color:#9CA3AF">${a.id}</code></td>
            <td><div class="patient-name-cell">
              ${avatar(a.patientName, 'patient-avatar', patients.find(p=>p.id===a.patientId)?.photoUrl || null)}
              <div class="patient-name-info"><strong>${a.patientName}</strong><span>${a.patientId}</span></div>
            </div></td>
            <td style="font-size:.82rem;white-space:nowrap">${fmtDate(a.date)}</td>
            <td style="font-size:.82rem;white-space:nowrap">${a.time}</td>
            <td style="font-size:.82rem">${a.type}</td>
            <td>${badge(a.status)}</td>
            <td>${docActions(a)}</td>
          </tr>`).join('')
          : `<tr><td colspan="7"><div class="table-empty">No appointments found.</div></td></tr>`}
        </tbody>
      </table>
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  DOCTOR — MY SCHEDULE (read-only)
// ════════════════════════════════════════════════════════════════
function pageDoctorSchedule() {
  const { user } = st()
  const doc = doctors.find(d => d.id === user?.id) || doctors[0]

  const now    = new Date()
  const todayY = now.getFullYear()
  const todayM = now.getMonth()

  // Must be set BEFORE the return
  window.state.afterRender = () => window.docSchedGoMonth(todayY, todayM)

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">My Schedule</h1>
      <p class="page-subtitle">Your consultation schedule and availability.</p>
    </div>
  </div>
  <div class="page-body">

    <!-- Doctor Info Card -->
    <div class="card" style="margin-bottom:20px;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.07)">
      <div class="card-body" style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
        <div class="profile-avatar-lg" style="width:56px;height:56px;font-size:1.2rem;flex-shrink:0">${initials(doc.name)}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:1rem;font-weight:700;color:#1C1C1C">${doc.name}</div>
          <div style="font-size:.82rem;color:#6B7280;margin-top:2px">${doc.specialization}</div>
          <div style="display:flex;flex-wrap:wrap;gap:18px;margin-top:10px">
            <span style="font-size:.78rem;color:#6B7280;display:flex;align-items:center;gap:5px">
              ${ic('calendar','icon-sm')} Available: ${(doc.days || []).join(', ')}
            </span>
            <span style="font-size:.78rem;color:#6B7280;display:flex;align-items:center;gap:5px">
              ${ic('clock','icon-sm')} ${doc.hours}
            </span>
            <span style="font-size:.78rem;color:#6B7280;display:flex;align-items:center;gap:5px">
              ${ic('mail','icon-sm')} ${doc.email}
            </span>
          </div>
        </div>
        <span style="background:#dcfce7;color:#16a34a;font-size:.72rem;font-weight:700;padding:4px 12px;border-radius:20px">Active</span>
      </div>
    </div>

    <!-- Calendar + Schedule Panel -->
    <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:24px;align-items:start">

      <!-- Calendar -->
      <div class="card">
        <div class="card-header">
          <div class="card-title" id="doc-sched-title"></div>
          <div style="display:flex;gap:4px">
            <button class="btn-icon" id="doc-sched-prev" title="Previous month">${ic('chevron-left','icon-sm')}</button>
            <button class="btn-icon" id="doc-sched-today"
                    style="font-size:.7rem;font-weight:700;width:auto;padding:0 8px;color:#E8760A;border-color:#E8760A">Today</button>
            <button class="btn-icon" id="doc-sched-next" title="Next month">${ic('chevron-right','icon-sm')}</button>
          </div>
        </div>
        <div class="card-body">
          <div class="calendar-grid" style="margin-bottom:8px">
            ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div class="cal-day-header">${d}</div>`).join('')}
          </div>
          <div class="calendar-grid" id="doc-sched-cal"></div>
          <div style="display:flex;gap:14px;margin-top:14px;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:5px;font-size:.72rem;color:#6B7280">
              <div style="width:12px;height:12px;border-radius:3px;background:#ECFDF5;border:1px solid #6EE7B7"></div> Available
            </div>
            <div style="display:flex;align-items:center;gap:5px;font-size:.72rem;color:#6B7280">
              <div style="width:12px;height:12px;border-radius:3px;background:#E8760A"></div> Today
            </div>
            <div style="display:flex;align-items:center;gap:5px;font-size:.72rem;color:#6B7280">
              <div style="width:12px;height:12px;border-radius:3px;background:#F3F4F6"></div> Not Scheduled
            </div>
            <div style="display:flex;align-items:center;gap:5px;font-size:.72rem;color:#6B7280">
              <div style="width:6px;height:6px;border-radius:50%;background:#E8760A;margin:3px"></div> Has Appointments
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Panel -->
      <div class="card" style="position:sticky;top:24px">
        <div class="card-header">
          <div class="card-title" id="doc-sched-list-title">Schedule</div>
        </div>
        <div id="doc-sched-list" style="padding:0"></div>
      </div>

    </div>

    <!-- Upcoming Appointments This Week -->
    <div class="card" style="margin-top:24px">
      <div class="card-header">
        <div>
          <div class="card-title">Upcoming Appointments This Week</div>
          <div class="card-subtitle">Apr 7–11, 2026</div>
        </div>
      </div>
      <div style="overflow-x:auto">
        <table class="tbl">
          <thead><tr><th>Date</th><th>Time</th><th>Patient</th><th>Service Type</th></tr></thead>
          <tbody>
            <tr><td style="font-size:.82rem;white-space:nowrap;font-weight:600">Apr 7 (Mon)</td><td style="font-size:.82rem">9:00 AM</td><td style="font-size:.82rem;font-weight:600">Maria Santos</td><td style="font-size:.82rem;color:#6B7280">Eye Examination</td></tr>
            <tr><td style="font-size:.82rem;white-space:nowrap;font-weight:600">Apr 7 (Mon)</td><td style="font-size:.82rem">10:30 AM</td><td style="font-size:.82rem;font-weight:600">Carlo Mendoza</td><td style="font-size:.82rem;color:#6B7280">Follow-up Consultation</td></tr>
            <tr><td style="font-size:.82rem;white-space:nowrap;font-weight:600">Apr 7 (Mon)</td><td style="font-size:.82rem">2:00 PM</td><td style="font-size:.82rem;font-weight:600">Ana Garcia</td><td style="font-size:.82rem;color:#6B7280">Eye Examination</td></tr>
            <tr><td style="font-size:.82rem;white-space:nowrap;font-weight:600">Apr 9 (Wed)</td><td style="font-size:.82rem">9:00 AM</td><td style="font-size:.82rem;font-weight:600">Jose Reyes</td><td style="font-size:.82rem;color:#6B7280">Eye Examination</td></tr>
            <tr><td style="font-size:.82rem;white-space:nowrap;font-weight:600">Apr 9 (Wed)</td><td style="font-size:.82rem">11:00 AM</td><td style="font-size:.82rem;font-weight:600">Rosa Dela Cruz</td><td style="font-size:.82rem;color:#6B7280">Eye Examination</td></tr>
            <tr><td style="font-size:.82rem;white-space:nowrap;font-weight:600">Apr 11 (Fri)</td><td style="font-size:.82rem">9:30 AM</td><td style="font-size:.82rem;font-weight:600">Benjamin Torres</td><td style="font-size:.82rem;color:#6B7280">Vision Screening</td></tr>
            <tr><td style="font-size:.82rem;white-space:nowrap;font-weight:600">Apr 11 (Fri)</td><td style="font-size:.82rem">1:00 PM</td><td style="font-size:.82rem;font-weight:600">Maria Santos</td><td style="font-size:.82rem;color:#6B7280">Follow-up Consultation</td></tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>`
}

// ════════════════════════════════════════════════════════════════
//  DOCTOR — SETTINGS
// ════════════════════════════════════════════════════════════════
function pageDoctorSettings() {
  const { user } = st()
  const doc = doctors.find(d => d.id === user?.id) || user || {}

  const docName = doc.name || `${doc.firstName || ''} ${doc.lastName || ''}`.trim() || 'Doctor'

  const pwField = (id, placeholder) => `
    <div style="position:relative">
      <input type="password" class="form-input" id="${id}" placeholder="${placeholder}" style="padding-right:40px">
      <button type="button" onclick="window.togglePwVisibility('${id}',this)"
              style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9CA3AF;padding:2px;display:flex;align-items:center">
        ${ic('eye','icon-sm')}
      </button>
    </div>`

  return `
  <style>
    @media (min-width: 1024px) { .doc-sett-col { display: grid !important; grid-template-columns: 55fr 45fr; gap: 20px; align-items: start; } }
  </style>
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your profile and account preferences</p>
    </div>
  </div>
  <div class="page-body">

    <!-- Profile Banner -->
    <div class="card" style="padding:28px 32px;margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">

        <!-- Clickable avatar -->
        <div style="position:relative;flex-shrink:0">
          <label for="doc-photo-input" style="cursor:pointer;display:block;width:80px;height:80px;border-radius:50%;overflow:hidden;position:relative">
            <div id="doc-avatar" style="width:80px;height:80px;border-radius:50%;background:#E8760A;color:#fff;font-size:1.5rem;font-weight:700;display:flex;align-items:center;justify-content:center;overflow:hidden">
              ${user.photoUrl
                ? `<img src="${user.photoUrl}" alt="Photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">`
                : initials(docName)}
            </div>
            <div style="position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,0);display:flex;align-items:center;justify-content:center;transition:background .2s"
                 onmouseover="this.style.background='rgba(0,0,0,.45)'"
                 onmouseout="this.style.background='rgba(0,0,0,0)'"></div>
          </label>
          <label for="doc-photo-input" style="position:absolute;bottom:0;right:0;width:24px;height:24px;border-radius:50%;background:#E8760A;border:2px solid #fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2)">
            ${ic('camera','icon-sm')}
          </label>
          <input type="file" id="doc-photo-input" accept="image/*" style="display:none"
                 onchange="window.handlePhotoUpload(this,'doc-avatar')">
        </div>

        <div style="flex:1;min-width:160px">
          <div style="font-size:1.2rem;font-weight:700;color:#1C1C1C">${docName}</div>
          <div style="font-size:.85rem;color:#E8760A;font-weight:600;margin-top:3px">${doc.specialization || 'Optometrist'}</div>
          <div style="font-size:.82rem;color:#6B7280;margin-top:4px">${doc.email || ''}</div>
          <div style="font-size:.82rem;color:#6B7280">${doc.contact || ''}</div>
        </div>
        <label for="doc-photo-input" class="btn-secondary" style="flex-shrink:0;cursor:pointer">
          ${ic('camera','icon-sm')} Change Photo
        </label>
      </div>
    </div>

    <div class="doc-sett-col" style="display:flex;flex-direction:column;gap:20px">

      <!-- LEFT: Personal Info -->
      <div class="card" style="padding:28px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
          <div style="color:#E8760A">${ic('user','icon-sm')}</div>
          <div style="font-size:1.05rem;font-weight:700;color:#1C1C1C">Personal Information</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input class="form-input" id="doc-fname" value="${doc.firstName || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input class="form-input" id="doc-lname" value="${doc.lastName || ''}">
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input class="form-input" type="email" id="doc-email" value="${doc.email || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input class="form-input" id="doc-phone" value="${doc.contact || ''}">
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:4px;color:#9CA3AF">
                ${ic('lock','icon-sm')} Specialization
              </label>
              <input class="form-input" value="${doc.specialization || 'Optometrist'}" disabled
                     style="background:#F9FAFB;color:#9CA3AF;cursor:not-allowed">
              <span style="font-size:.7rem;color:#9CA3AF;margin-top:3px;display:block">Contact admin to update.</span>
            </div>
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:4px;color:#9CA3AF">
                ${ic('lock','icon-sm')} PRC License No.
              </label>
              <input class="form-input" value="PRC-0001-2024" disabled
                     style="background:#F9FAFB;color:#9CA3AF;cursor:not-allowed">
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:4px">
            <button class="btn-primary" onclick="window.saveUserProfile()">
              ${ic('check','icon-sm')} Save Changes
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Security -->
      <div class="card" style="padding:28px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <div style="color:#E8760A">${ic('shield','icon-sm')}</div>
          <div style="font-size:1.05rem;font-weight:700;color:#1C1C1C">Security</div>
        </div>
        <div style="font-size:.82rem;color:#9CA3AF;margin-bottom:20px">Change your account password</div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            ${pwField('doc-curpw','Enter current password')}
          </div>
          <div class="form-group">
            <label class="form-label">New Password</label>
            ${pwField('doc-newpw','Minimum 8 characters')}
          </div>
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            ${pwField('doc-confpw','Repeat new password')}
            <div id="doc-pw-err" style="color:#DC2626;font-size:.75rem;margin-top:5px;display:none">Passwords do not match.</div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:6px;font-size:.78rem;color:#9CA3AF">
            ${ic('info','icon-sm')} Minimum 8 characters with at least one number and one letter.
          </div>
          <div style="display:flex;justify-content:flex-end">
            <button class="btn-primary"
                    onclick="window.validateSettingsPassword('doc-newpw','doc-confpw','doc-pw-err','doc-curpw')">
              ${ic('lock','icon-sm')} Update Password
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  DOCTOR — OPTICAL EXAMINATION
// ════════════════════════════════════════════════════════════════
function pageExamination() {
  const { params } = st()
  const p = getPatientById(params.patientId)
  const lastExam = p && p.examinations.length ? p.examinations[p.examinations.length - 1] : null
  const _p = (obj, key) => (obj && obj[key]) || ''
  const pre = lastExam ? lastExam : {
    od: {sph:'',cyl:'',axis:'',va:'',add:''}, os: {sph:'',cyl:'',axis:'',va:'',add:''},
    iop: {od:'',os:''}, pd:'', lensType:'', diagnosis:'', recommendation:'', testResults:'', remarks:''
  }

  return `
  <div class="page-header">
    <div class="page-header-left" style="display:flex;align-items:center;gap:12px">
      <button class="btn-icon" onclick="window.navigate('patient-list')">${ic('chevron-left','icon')}</button>
      <div>
        <h1 class="page-title">Optical Examination</h1>
        <p class="page-subtitle">${p ? p.name + ' · ' + p.id : 'Select a patient'}</p>
      </div>
    </div>
    ${p ? `<div style="display:flex;gap:8px">
      <button class="btn-secondary" onclick="window.printExaminationForm('${p.id}')">${ic('printer','icon-sm')} Print</button>
      <button class="btn-primary" onclick="window.saveExamination('${p.id}')">${ic('check','icon-sm')} Save Examination</button>
    </div>` : ''}
  </div>
  <div class="page-body">
  ${!p ? `
    <div class="card"><div class="card-body">
      <div class="alert-info">${ic('info','icon-sm')} Select a patient from Patient Records to begin an examination.</div>
      <div style="margin-top:16px">
        <button class="btn-primary" onclick="window.navigate('patient-list')">${ic('users','icon-sm')} Go to Patient List</button>
      </div>
    </div></div>` : `
    <div class="card" style="margin-bottom:20px">
      <div class="profile-hero" style="padding:20px 24px">
        <div class="profile-avatar-lg" style="width:56px;height:56px;font-size:1.3rem">${initials(p.name)}</div>
        <div>
          <div class="profile-info-name" style="font-size:1.2rem">${p.name}</div>
          <div class="profile-info-meta">
            <span class="profile-meta-item">${ic('user','icon-sm')} ${p.gender}, ${p.age} yrs</span>
            <span class="profile-meta-item">${ic('phone','icon-sm')} ${p.contact}</span>
            <span class="profile-meta-item">${ic('calendar','icon-sm')} Last Visit: ${fmtDate(p.lastVisit)}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><div class="card-title">Visual Acuity &amp; Refraction</div><div class="card-subtitle">Enter OD (right eye) and OS (left eye) values</div></div>
      <div class="card-body">
        <div class="eye-grid" style="margin-bottom:12px">
          <div></div>
          <div class="eye-header">SPH</div>
          <div class="eye-header">CYL</div>
          <div class="eye-header">AXIS</div>
          <div class="eye-header">VA</div>

          <div class="eye-label">OD (Right)</div>
          <input id="ex-od-sph"  class="form-input" value="${_p(pre.od,'sph')}"  placeholder="e.g. -1.25">
          <input id="ex-od-cyl"  class="form-input" value="${_p(pre.od,'cyl')}"  placeholder="e.g. -0.50">
          <input id="ex-od-axis" class="form-input" value="${_p(pre.od,'axis')}" placeholder="e.g. 90">
          <input id="ex-od-va"   class="form-input" value="${_p(pre.od,'va')}"   placeholder="e.g. 20/40">

          <div class="eye-label">OS (Left)</div>
          <input id="ex-os-sph"  class="form-input" value="${_p(pre.os,'sph')}"  placeholder="e.g. -1.00">
          <input id="ex-os-cyl"  class="form-input" value="${_p(pre.os,'cyl')}"  placeholder="e.g. 0.00">
          <input id="ex-os-axis" class="form-input" value="${_p(pre.os,'axis')}" placeholder="e.g. 0">
          <input id="ex-os-va"   class="form-input" value="${_p(pre.os,'va')}"   placeholder="e.g. 20/30">
        </div>
        <div class="form-row-3" style="margin-top:12px">
          <div class="form-group">
            <label class="form-label">ADD — OD</label>
            <input id="ex-od-add" class="form-input" value="${_p(pre.od,'add')}" placeholder="e.g. +1.50">
          </div>
          <div class="form-group">
            <label class="form-label">ADD — OS</label>
            <input id="ex-os-add" class="form-input" value="${_p(pre.os,'add')}" placeholder="e.g. +1.50">
          </div>
          <div class="form-group">
            <label class="form-label">PD (mm)</label>
            <input id="ex-pd" class="form-input" value="${pre.pd||''}" placeholder="e.g. 62/60">
          </div>
        </div>
        <div class="form-row-3" style="margin-top:12px">
          <div class="form-group">
            <label class="form-label">IOP — OD (mmHg)</label>
            <input id="ex-iop-od" class="form-input" value="${_p(pre.iop,'od')}" placeholder="Normal: 10–21">
          </div>
          <div class="form-group">
            <label class="form-label">IOP — OS (mmHg)</label>
            <input id="ex-iop-os" class="form-input" value="${_p(pre.iop,'os')}" placeholder="Normal: 10–21">
          </div>
          <div class="form-group"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">Clinical Assessment &amp; Prescription</div></div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:16px">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label">Diagnosis</label>
            <input id="ex-diagnosis" class="form-input" value="${pre.diagnosis||''}" placeholder="e.g. Myopia, Mild Astigmatism">
          </div>
          <div class="form-group">
            <label class="form-label">Lens Type</label>
            <select id="ex-lens-type" class="form-input">
              ${['—','Single Vision','Bifocal','Progressive','Contact Lens','Reading Glasses','Safety Glasses','Computer Lenses'].map(lt =>
                `<option value="${lt}" ${(pre.lensType||'—')===lt?'selected':''}>${lt}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Prescription / Lens Recommendation</label>
          <input id="ex-recommendation" class="form-input" value="${pre.recommendation||''}" placeholder="e.g. Single Vision Lenses, Anti-Reflective Coating">
        </div>
        <div class="form-group">
          <label class="form-label">Test Results</label>
          <input id="ex-test-results" class="form-input" value="${pre.testResults||''}" placeholder="e.g. Visual fields: Normal. Color vision: Normal.">
        </div>
        <div class="form-group">
          <label class="form-label">Remarks / Additional Notes</label>
          <textarea id="ex-remarks" class="form-textarea" placeholder="Clinical observations, follow-up instructions…">${pre.remarks||''}</textarea>
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end">
          <button class="btn-secondary" onclick="window.printExaminationForm('${p.id}')">${ic('printer','icon-sm')} Print Form</button>
          <button class="btn-primary" onclick="window.saveExamination('${p.id}')">${ic('check','icon-sm')} Save Examination</button>
        </div>
      </div>
    </div>`}
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  EXAM RECORDS LIST  (Admin / Staff / Doctor)
// ════════════════════════════════════════════════════════════════
function pageExamRecords() {
  const { role, filter, user } = st()

  // For doctor role: always show only their own records
  const docFilter = role === 'doctor'
    ? (user?.name || 'Dr. Ruziel Palaje')
    : (filter && filter !== 'all') ? filter : 'all'

  const allExams = getExamRecords()

  const filtered      = docFilter === 'all' ? allExams : allExams.filter(e => e.doctor === docFilter)
  const uniqueDoctors = [...new Set(allExams.map(e => e.doctor))]

  // Stats: doctors see only their own counts; admin/staff see clinic-wide
  const statBase = role === 'doctor' ? filtered : allExams

  window.state.afterRender = () => { window.initPagination('exam-records-tbody'); window.initSortable('exam-records-tbody') }

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Examination Records</h1>
      <p class="page-subtitle">${role === 'doctor' ? 'Your optical examination history.' : 'Complete history of optical examinations.'}</p>
    </div>
    ${role !== 'patient' ? `<button class="btn-primary" onclick="window.navigate('patient-list')">
      ${ic('plus','icon-sm')} New Examination</button>` : ''}
  </div>
  <div class="page-body">
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card">
        <div class="stat-icon orange">${ic('file-text','icon-sm')}</div>
        <div class="stat-info"><div class="stat-value">${statBase.length}</div><div class="stat-label">${role === 'doctor' ? 'My Exams' : 'Total Exams'}</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">${ic('check-circle','icon-sm')}</div>
        <div class="stat-info"><div class="stat-value">${statBase.filter(e=>e.status==='completed').length}</div><div class="stat-label">Completed</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:#DBEAFE;color:#2563EB">${ic('users','icon-sm')}</div>
        <div class="stat-info"><div class="stat-value">${new Set(statBase.map(e=>e.patientId)).size}</div><div class="stat-label">Patients Examined</div></div>
      </div>
      ${role !== 'doctor' ? `<div class="stat-card">
        <div class="stat-icon" style="background:#EDE9FE;color:#7C3AED">${ic('user','icon-sm')}</div>
        <div class="stat-info"><div class="stat-value">${uniqueDoctors.length}</div><div class="stat-label">Examining Doctors</div></div>
      </div>` : ''}
    </div>
    <div class="table-wrap">
      <div class="table-toolbar">
        <span class="table-title">${filtered.length} record${filtered.length!==1?'s':''}</span>
        <div class="table-actions">
          <div class="search-input-wrap">
            ${ic('search','icon-sm')}
            <input class="search-input" placeholder="Search patient or diagnosis…"
                   oninput="window.filterTable(this,'exam-records-tbody')">
          </div>
          ${role !== 'doctor' ? `<select class="form-select" style="width:auto;padding:7px 12px;font-size:.82rem"
                  onchange="window.navigate('exam-records',{filter:this.value})">
            <option value="all"${docFilter==='all'?' selected':''}>All Doctors</option>
            ${uniqueDoctors.map(d=>`<option value="${d}"${docFilter===d?' selected':''}>${d}</option>`).join('')}
          </select>` : ''}
        </div>
      </div>
      <table class="tbl">
        <colgroup>
          <col style="width:8%"><col style="width:18%"><col style="width:16%"><col style="width:10%">
          <col style="width:14%"><col style="width:12%"><col style="width:8%"><col style="width:14%">
        </colgroup>
        <thead><tr>
          <th>Exam ID</th>
          <th data-sort-key="patient" data-sort-type="text">Patient</th>
          <th>Doctor</th>
          <th data-sort-key="date" data-sort-type="date">Date</th>
          <th>Diagnosis</th><th>Lens Type</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody id="exam-records-tbody">
          ${filtered.map(e => `<tr data-search="${e.patientName.toLowerCase()} ${(e.diagnosis||'').toLowerCase()} ${e.doctor.toLowerCase()}" data-sort-patient="${e.patientName.toLowerCase()}" data-sort-date="${e.date}">
            <td><code style="font-size:.73rem;color:#9CA3AF">${e.id}</code></td>
            <td><div class="patient-name-cell">
              ${avatar(e.patientName)}
              <div class="patient-name-info"><strong>${e.patientName}</strong><span>${e.patientId}</span></div>
            </div></td>
            <td style="font-size:.82rem">${e.doctor}</td>
            <td style="font-size:.82rem;white-space:nowrap">${fmtDate(e.date)}</td>
            <td style="font-size:.82rem;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${e.diagnosis}">${e.diagnosis}</td>
            <td style="font-size:.78rem;color:#6B7280">${e.lensType || '—'}</td>
            <td>${badge(e.status || 'completed')}</td>
            <td style="white-space:nowrap">
              <button class="btn-icon" title="View Details"
                      onclick="window.viewExamRecord('${e.id}')">
                ${ic('eye','icon-sm')}
              </button>
              <button class="btn-icon" title="Print"
                      onclick="window.printExamRecord('${e.id}')"
                      style="margin-left:2px">
                ${ic('printer','icon-sm')}
              </button>
              ${(role === 'admin' || role === 'doctor') ? `
              <button class="btn-icon" title="Generate Clearance"
                      style="color:#0891b2;margin-left:2px"
                      onclick="window.generateClearanceFromRecord('${e.id}')">
                ${ic('award','icon-sm')}
              </button>` : ''}
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  NEW EXAMINATION FORM  (Doctor)
// ════════════════════════════════════════════════════════════════
function pageNewExamination() {
  if (state.role !== 'doctor') {
    return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:16px;text-align:center">
      <div style="width:64px;height:64px;border-radius:50%;background:#FFF7ED;display:flex;align-items:center;justify-content:center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8891C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div>
        <div style="font-size:1.15rem;font-weight:700;color:#1f2937;margin-bottom:6px">Access Restricted</div>
        <div style="font-size:.875rem;color:#6B7280;max-width:320px">Only doctors can start a new consultation. Please contact the assigned doctor to begin the examination.</div>
      </div>
      <button class="btn-ghost" onclick="window.history.back()" style="margin-top:8px">Go Back</button>
    </div>`
  }

  const { params } = st()
  const p = getPatientById(params?.patientId)

  if (!p) {
    const { role, user } = st()
    const todayStr = new Date().toISOString().split('T')[0]
    const todayLabel = new Date(todayStr + 'T00:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })

    const todayAppts = appointments.filter(a => a.date === todayStr && !['cancelled','disapproved'].includes(a.status))
    // Sort by time
    const timeVal = t => { const [h,m] = (t||'0:00').replace(' AM','').replace(' PM','').split(':').map(Number); return (t.includes('PM') && h !== 12 ? h+12 : (t.includes('AM') && h === 12 ? 0 : h)) * 60 + m }
    todayAppts.sort((a, b) => timeVal(a.time) - timeVal(b.time))

    // Initials helper
    const initials = name => name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase()
    const avatarColors = ['#E8891C','#3B82F6','#10B981','#8B5CF6','#EF4444','#F59E0B','#06B6D4']
    const avatarColor  = name => avatarColors[name.charCodeAt(0) % avatarColors.length]

    state.afterRender = () => {
      const inp = document.getElementById('walkin-search-input')
      if (inp) inp.addEventListener('input', () => {
        const q = inp.value.trim().toLowerCase()
        document.querySelectorAll('.walkin-pt-card').forEach(c => {
          c.style.display = (!q || c.dataset.name.includes(q) || c.dataset.id.includes(q)) ? '' : 'none'
        })
      })
    }

    // SVG calendar icon (no emoji, works cross-platform)
    const calSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`

    const apptCardHTML = todayAppts.length
      ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          ${todayAppts.map(a => {
            const isDone = a.status === 'completed'
            const bgColor = avatarColor(a.patientName)
            const statusBadge = isDone
              ? `<span style="background:#f3f4f6;color:#6b7280;font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:20px;letter-spacing:.03em">Completed</span>`
              : `<span style="background:#FFF7ED;color:#C2410C;font-size:.65rem;font-weight:700;padding:2px 8px;border-radius:20px;letter-spacing:.03em">Approved</span>`
            const actionBtn = isDone
              ? `<button onclick="window.navigate('patient-view',{patientId:'${a.patientId}',patientName:'${a.patientName.replace(/'/g,"\\'")}'})"
                         style="width:100%;padding:8px;border-radius:8px;border:1.5px solid #e5e7eb;background:white;color:#6b7280;font-size:.78rem;font-weight:600;cursor:pointer;transition:background .15s;text-align:center"
                         onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
                   View Record
                 </button>`
              : `<button onclick="window.startExamFromAppt('${a.id}')"
                         style="width:100%;padding:8px;border-radius:8px;border:none;background:#E8891C;color:white;font-size:.78rem;font-weight:600;cursor:pointer;transition:opacity .15s;text-align:center"
                         onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
                   Start Examination
                 </button>`
            return `
            <div style="border:1.5px solid #e5e7eb;border-radius:12px;padding:18px;background:white;transition:border-color .15s,box-shadow .15s;display:flex;flex-direction:column;gap:10px"
                 onmouseover="this.style.borderColor='#E8891C';this.style.boxShadow='0 4px 12px rgba(232,137,28,0.1)'"
                 onmouseout="this.style.borderColor='#e5e7eb';this.style.boxShadow='none'">
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:38px;height:38px;border-radius:50%;background:${bgColor};color:white;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0">${initials(a.patientName)}</div>
                <div style="min-width:0">
                  <div style="font-size:.9rem;font-weight:700;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.patientName}</div>
                  <div style="font-size:.72rem;color:#6b7280;margin-top:1px">${a.patientId} &nbsp;·&nbsp; ${a.time}</div>
                </div>
              </div>
              <div>
                <div style="font-size:.75rem;color:#374151;font-weight:500;margin-bottom:5px">${a.type}</div>
                ${role === 'admin' ? `<div style="font-size:.72rem;color:#9ca3af;margin-bottom:6px">${a.doctorName}</div>` : ''}
                ${statusBadge}
              </div>
              ${actionBtn}
            </div>`
          }).join('')}
        </div>`
      : `<div style="text-align:center;padding:36px 20px">
          <div style="width:52px;height:52px;border-radius:50%;background:#FFF7ED;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:#E8891C">
            ${calSVG}
          </div>
          <div style="font-size:.9rem;font-weight:600;color:#374151;margin-bottom:6px">No scheduled consultations for today.</div>
          <div style="font-size:.8rem;color:#9ca3af;margin-bottom:18px;line-height:1.6">Examination records are created from confirmed appointments.</div>
          <button class="btn-secondary" style="font-size:.82rem" onclick="window.navigate('appointments')">
            ${ic('calendar','icon-sm')} View My Schedule
          </button>
        </div>`

    // Walk-in cards — avatar + name + select button, rendered once, filtered via search
    const walkinCardsHTML = [...patients].map(pt => {
      const bgC = avatarColor(pt.name)
      return `
      <div class="walkin-pt-card"
           data-name="${pt.name.toLowerCase()}"
           data-id="${pt.id.toLowerCase()}"
           style="border:1.5px solid #e5e7eb;border-radius:10px;padding:14px;background:#fafafa;display:flex;flex-direction:column;gap:8px;transition:border-color .15s,box-shadow .15s"
           onmouseover="this.style.borderColor='#E8891C';this.style.boxShadow='0 2px 8px rgba(232,137,28,0.1)'"
           onmouseout="this.style.borderColor='#e5e7eb';this.style.boxShadow='none'">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:30px;height:30px;border-radius:50%;background:${bgC};color:white;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:700;flex-shrink:0">${initials(pt.name)}</div>
          <div style="min-width:0">
            <div style="font-size:.82rem;font-weight:600;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${pt.name}</div>
            <div style="font-size:.68rem;color:#9ca3af;margin-top:1px">${pt.id} · ${pt.age || '—'} yrs · ${pt.gender || '—'}</div>
          </div>
        </div>
        <button onclick="window.startExamFromAppt(null,'${pt.id}')"
                style="width:100%;padding:5px;border-radius:6px;border:1.5px solid #E8891C;background:white;color:#E8891C;font-size:.72rem;font-weight:600;cursor:pointer;transition:background .15s,color .15s"
                onmouseover="this.style.background='#E8891C';this.style.color='white'"
                onmouseout="this.style.background='white';this.style.color='#E8891C'">
          Select
        </button>
      </div>`
    }).join('')

    return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">New Examination</h1>
      <p class="page-subtitle">Select a patient from today's consultations to begin.</p>
    </div>
  </div>
  <div class="page-body">
    <div style="max-width:900px;width:100%;margin:0 auto">

      <!-- Today's appointments card -->
      <div style="background:white;border:1px solid #e5e7eb;border-radius:14px;padding:20px 24px;margin-bottom:16px">

        <!-- Card header -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:${todayAppts.length ? '20px' : '0'}">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:32px;height:32px;border-radius:8px;background:#FFF7ED;display:flex;align-items:center;justify-content:center;color:#E8891C;flex-shrink:0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div>
              <div style="font-size:.9rem;font-weight:700;color:#111827">Today's Appointments</div>
              <div style="font-size:.72rem;color:#9ca3af">${todayLabel}</div>
            </div>
          </div>
          <span style="background:#f3f4f6;color:#374151;font-size:.72rem;font-weight:600;padding:3px 10px;border-radius:20px">${todayAppts.length} patient${todayAppts.length !== 1 ? 's' : ''}</span>
        </div>

        ${apptCardHTML}

      </div>

      <!-- Walk-in section — collapsed by default -->
      <div style="background:white;border:1px solid #e5e7eb;border-radius:14px;padding:14px 24px">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:.82rem;color:#6b7280">Need to examine a walk-in patient?</span>
          <button onclick="window.toggleWalkinSearch()"
                  id="walkin-toggle-btn"
                  style="font-size:.8rem;color:#E8891C;background:none;border:none;cursor:pointer;font-weight:600;display:flex;align-items:center;gap:4px;padding:0">
            ${ic('search','icon-sm')}
            <span id="walkin-toggle-label">Search Other Patients ›</span>
          </button>
        </div>

        <!-- Hidden by default; revealed by toggleWalkinSearch() -->
        <div id="walkin-search-section" style="display:none;margin-top:14px">
          <div style="position:relative;margin-bottom:12px">
            <div style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none;display:flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input id="walkin-search-input" class="form-input" placeholder="Search patient by name or ID…"
                   style="padding-left:36px;border-radius:10px;font-size:.88rem">
          </div>
          <!-- Scrollable patient list — does NOT expand the page -->
          <div style="border:1px solid #e5e7eb;border-radius:10px;padding:12px;max-height:280px;overflow-y:auto;background:#f9fafb">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              ${walkinCardsHTML}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>`
  }

  const today    = new Date().toISOString().split('T')[0]
  const lastExam = p.examinations.length ? p.examinations[0] : null
  const pre      = lastExam || { od:{sph:'',cyl:'',axis:'',va:'',add:''}, os:{sph:'',cyl:'',axis:'',va:'',add:''}, iop:{od:'',os:''}, pd:'' }

  // Schedule wizard init after DOM is ready
  state.afterRender = () => { window._examPatientId = p.id; examWizInit() }

  const fl = (label, req=false) =>
    `<label style="font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;font-weight:600;display:block;margin-bottom:6px">${label}${req ? ' <span style="color:#ef4444">*</span>' : ''}</label>`
  const inp = 'border-radius:8px;padding:10px 14px;font-size:.9rem'

  const STEPS = [
    { n:1, icon:'user',      label:'Patient Info',    sub:'Basic details'        },
    { n:2, icon:'eye',       label:'Visual Exam',     sub:'Measurements'         },
    { n:3, icon:'activity',  label:'Diagnosis',       sub:'Clinical findings'    },
    { n:4, icon:'clipboard', label:'Results',         sub:'Recommendations'      },
    { n:5, icon:'package',   label:'Dispensing',      sub:'Payment & release'    },
    { n:6, icon:'file-text', label:'Review',          sub:'Prescription preview' },
  ]

  const stepperHTML = `
  <div id="wiz-stepper" style="display:flex;align-items:center;background:white;border-radius:12px;border:1px solid #e5e7eb;padding:20px 24px;margin-bottom:20px;overflow-x:auto;gap:0">
    ${STEPS.map((s, i) => `
      <div style="display:flex;align-items:center;${i < STEPS.length - 1 ? 'flex:1;' : ''}min-width:0">
        <div id="wiz-pill-${s.n}" onclick="examWizJump(${s.n})"
             style="display:flex;align-items:center;gap:8px;cursor:pointer;min-width:0;padding:4px 4px;border-radius:8px;transition:background 0.2s;overflow:hidden"
             onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='transparent'">
          <div id="wiz-circle-${s.n}"
               style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:700;flex-shrink:0;transition:all 0.3s;${s.n === 1 ? 'background:#E8891C;color:white;box-shadow:0 2px 8px rgba(232,137,28,0.35)' : 'background:#f3f4f6;color:#9ca3af;border:2px solid #e5e7eb'}">${s.n}</div>
          <div style="min-width:0;overflow:hidden">
            <div style="font-size:.72rem;font-weight:${s.n === 1 ? '700' : '500'};color:${s.n === 1 ? '#1f2937' : '#9ca3af'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color 0.3s">${s.label}</div>
            <div style="font-size:.62rem;color:${s.n === 1 ? '#6b7280' : '#d1d5db'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color 0.3s">${s.sub}</div>
          </div>
        </div>
        ${i < STEPS.length - 1 ? `<div id="wiz-line-${s.n}" style="flex:1;height:2px;background:#e5e7eb;margin:0 4px;border-radius:2px;transition:background 0.3s;min-width:6px"></div>` : ''}
      </div>`).join('')}
  </div>`

  // ── Step 1: Patient Information ──────────────────────────────
  const step1 = `
  <div style="background:white;border-radius:12px;border:1px solid #e5e7eb;padding:28px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
      <div style="width:36px;height:36px;border-radius:50%;background:#E8891C;color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ic('user','icon-sm')}</div>
      <div>
        <div style="font-size:.95rem;font-weight:700;color:#1f2937">Patient Information</div>
        <div style="font-size:.75rem;color:#6b7280;margin-top:1px">Basic details for this examination record</div>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:16px">
      ${fl('Patient Name', true)}
      <input id="ne-patient-name" class="form-input" style="${inp}" value="${p.name}" placeholder="Full name">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
      <div class="form-group" style="margin:0">
        ${fl('Examination Date')}
        <input id="ne-date" type="date" class="form-input" style="${inp}" value="${today}">
      </div>
      <div class="form-group" style="margin:0">
        ${fl('Patient ID')}
        <input id="ne-patient-id" class="form-input" style="${inp}" value="${p.id}" placeholder="P-2024-XXX">
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
      <div class="form-group" style="margin:0">
        ${fl('Age')}
        <input id="ne-age" class="form-input" style="${inp}" value="${p.age || ''}" placeholder="e.g. 34">
      </div>
      <div class="form-group" style="margin:0">
        ${fl('Contact Number')}
        <input id="ne-contact" class="form-input" style="${inp}" value="${p.contact || ''}" placeholder="09XX XXX XXXX">
      </div>
    </div>
    <div class="form-group" style="margin-bottom:16px">
      ${fl('Company / Employer')}
      <input id="ne-employer" class="form-input" style="${inp}" value="${p.occupation || ''}" placeholder="Optional">
    </div>
    <div class="form-group" style="margin:0">
      ${fl('Medical / Optical History')}
      <textarea id="ne-history" class="form-textarea" style="${inp};resize:vertical;width:100%;min-height:80px" placeholder="Previous conditions, medications, relevant history...">${(p.medicalHistory || '') + (p.medicalHistory && p.opticalHistory ? '\n\n' : '') + (p.opticalHistory || '')}</textarea>
    </div>
  </div>`

  // ── Step 2: Visual Examination ───────────────────────────────
  const step2 = `
  <div style="background:white;border-radius:12px;border:1px solid #e5e7eb;padding:28px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
      <div style="width:36px;height:36px;border-radius:50%;background:#E8891C;color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ic('eye','icon-sm')}</div>
      <div>
        <div style="font-size:.95rem;font-weight:700;color:#1f2937">Visual Examination</div>
        <div style="font-size:.75rem;color:#6b7280;margin-top:1px">Enter optical measurements for both eyes</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:20px">
      <div class="form-group" style="margin:0">
        ${fl('NVA')}
        <input id="ne-nva" class="form-input" style="${inp}" placeholder="e.g. 20/20">
      </div>
      <div class="form-group" style="margin:0">
        ${fl('NNVA')}
        <input id="ne-nnva" class="form-input" style="${inp}" placeholder="e.g. 20/30">
      </div>
      <div class="form-group" style="margin:0">
        ${fl('RX')}
        <input id="ne-rx" class="form-input" style="${inp}" placeholder="e.g. -2.00">
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div style="border:1px solid #e5e7eb;border-left:4px solid #22c55e;border-radius:12px;padding:20px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
          <div style="width:24px;height:24px;border-radius:50%;background:#dcfce7;display:flex;align-items:center;justify-content:center"><div style="width:8px;height:8px;border-radius:50%;background:#16a34a"></div></div>
          <div><div style="font-size:.88rem;font-weight:700;color:#1f2937">Right Eye</div><div style="font-size:.7rem;color:#6b7280">OD — Oculus Dexter</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group" style="margin:0">${fl('Sphere')}<input id="ne-od-sph" class="form-input" style="${inp}" value="${pre.od.sph}" placeholder="+/- 0.00"></div>
          <div class="form-group" style="margin:0">${fl('Cylinder')}<input id="ne-od-cyl" class="form-input" style="${inp}" value="${pre.od.cyl}" placeholder="+/- 0.00"></div>
          <div class="form-group" style="margin:0">${fl('Axis')}<input id="ne-od-axis" class="form-input" style="${inp}" value="${pre.od.axis}" placeholder="0-180"></div>
          <div class="form-group" style="margin:0">${fl('VA')}<input id="ne-od-va" class="form-input" style="${inp}" value="${pre.od.va}" placeholder="20/20"></div>
        </div>
        <input id="ne-od-add" type="hidden" value="${pre.od.add || ''}">
      </div>
      <div style="border:1px solid #e5e7eb;border-left:4px solid #E8891C;border-radius:12px;padding:20px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
          <div style="width:24px;height:24px;border-radius:50%;background:#fff8f0;display:flex;align-items:center;justify-content:center"><div style="width:8px;height:8px;border-radius:50%;background:#E8891C"></div></div>
          <div><div style="font-size:.88rem;font-weight:700;color:#1f2937">Left Eye</div><div style="font-size:.7rem;color:#6b7280">OS — Oculus Sinister</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group" style="margin:0">${fl('Sphere')}<input id="ne-os-sph" class="form-input" style="${inp}" value="${pre.os.sph}" placeholder="+/- 0.00"></div>
          <div class="form-group" style="margin:0">${fl('Cylinder')}<input id="ne-os-cyl" class="form-input" style="${inp}" value="${pre.os.cyl}" placeholder="+/- 0.00"></div>
          <div class="form-group" style="margin:0">${fl('Axis')}<input id="ne-os-axis" class="form-input" style="${inp}" value="${pre.os.axis}" placeholder="0-180"></div>
          <div class="form-group" style="margin:0">${fl('VA')}<input id="ne-os-va" class="form-input" style="${inp}" value="${pre.os.va}" placeholder="20/20"></div>
        </div>
        <input id="ne-os-add" type="hidden" value="${pre.os.add || ''}">
      </div>
    </div>
    <div style="display:none">
      <input id="ne-iop-od" value="${pre.iop?.od || ''}">
      <input id="ne-iop-os" value="${pre.iop?.os || ''}">
      <input id="ne-pd" value="${pre.pd || ''}">
    </div>
  </div>`

  // ── Step 3: Diagnosis ────────────────────────────────────────
  const step3 = `
  <div style="background:white;border-radius:12px;border:1px solid #e5e7eb;padding:28px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
      <div style="width:36px;height:36px;border-radius:50%;background:#E8891C;color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ic('activity','icon-sm')}</div>
      <div>
        <div style="font-size:.95rem;font-weight:700;color:#1f2937">Diagnosis</div>
        <div style="font-size:.75rem;color:#6b7280;margin-top:1px">Final clinical findings</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
      <div class="form-group" style="margin:0">
        ${fl('Final Visual Acuity (Final VA)')}
        <input id="ne-final-va" class="form-input" style="${inp}" placeholder="e.g. 20/20">
      </div>
      <div class="form-group" style="margin:0">
        ${fl('Diagnosis', true)}
        <input id="ne-diagnosis" class="form-input" style="${inp}" value="${lastExam?.diagnosis || ''}" placeholder="e.g. Myopia with mild astigmatism">
      </div>
    </div>
    <div class="form-group" style="margin-bottom:16px">
      ${fl('Test Results')}
      <textarea id="ne-test-results" class="form-textarea" style="${inp};resize:vertical;width:100%;min-height:80px" placeholder="Additional test findings...">${lastExam?.testResults || ''}</textarea>
    </div>
    <div class="form-group" style="margin:0">
      ${fl('Prescription Details')}
      <textarea id="ne-rx-details" class="form-textarea" style="${inp};resize:vertical;width:100%;min-height:80px" placeholder="Prescription notes and details...">${lastExam?.prescriptionDetails || ''}</textarea>
    </div>
  </div>`

  // ── Step 4: Results and Recommendations ─────────────────────
  const step4 = `
  <div style="background:white;border-radius:12px;border:1px solid #e5e7eb;padding:28px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
      <div style="width:36px;height:36px;border-radius:50%;background:#E8891C;color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ic('clipboard','icon-sm')}</div>
      <div>
        <div style="font-size:.95rem;font-weight:700;color:#1f2937">Results and Recommendations</div>
        <div style="font-size:.75rem;color:#6b7280;margin-top:1px">Clinical recommendations for the patient</div>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:18px">
      ${fl('Ishihara Test Result')}
      <div style="display:flex;gap:8px;margin-top:8px">
        <input type="radio" name="ne-ishihara" id="r-ish-n" value="Normal" checked style="display:none"
               onchange="window._syncRadioPills('ne-ishihara')">
        <input type="radio" name="ne-ishihara" id="r-ish-d" value="Deficient" style="display:none"
               onchange="window._syncRadioPills('ne-ishihara')">
        <label for="r-ish-n" id="rb-ish-n"
               style="display:inline-flex;align-items:center;gap:7px;padding:7px 18px;border-radius:8px;font-size:.85rem;font-weight:600;border:1.5px solid #E8891C;background:#FFF7ED;color:#C4720E;cursor:pointer;user-select:none;transition:background .2s,border-color .2s,color .2s,box-shadow .2s;transform:translateZ(0)">
          <span style="width:14px;height:14px;border-radius:50%;border:2px solid #E8891C;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .2s">
            <span style="width:7px;height:7px;border-radius:50%;background:#E8891C;display:block;transition:background .2s,transform .2s cubic-bezier(.34,1.56,.64,1);transform:scale(1)"></span>
          </span>Normal</label>
        <label for="r-ish-d" id="rb-ish-d"
               style="display:inline-flex;align-items:center;gap:7px;padding:7px 18px;border-radius:8px;font-size:.85rem;font-weight:600;border:1.5px solid #e5e7eb;background:#f9fafb;color:#6b7280;cursor:pointer;user-select:none;transition:background .2s,border-color .2s,color .2s,box-shadow .2s;transform:translateZ(0)">
          <span style="width:14px;height:14px;border-radius:50%;border:2px solid #d1d5db;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .2s">
            <span style="width:7px;height:7px;border-radius:50%;background:transparent;display:block;transition:background .2s,transform .2s cubic-bezier(.34,1.56,.64,1);transform:scale(0)"></span>
          </span>Deficient</label>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:18px">
      ${fl('Eyeglass Recommendation')}
      <div style="display:flex;gap:8px;margin-top:8px">
        <input type="radio" name="ne-eyeglass" id="r-eg-y" value="Yes" checked style="display:none"
               onchange="window._syncRadioPills('ne-eyeglass')">
        <input type="radio" name="ne-eyeglass" id="r-eg-n" value="No" style="display:none"
               onchange="window._syncRadioPills('ne-eyeglass')">
        <label for="r-eg-y" id="rb-eg-y"
               style="display:inline-flex;align-items:center;gap:7px;padding:7px 18px;border-radius:8px;font-size:.85rem;font-weight:600;border:1.5px solid #E8891C;background:#FFF7ED;color:#C4720E;cursor:pointer;user-select:none;transition:background .2s,border-color .2s,color .2s,box-shadow .2s;transform:translateZ(0)">
          <span style="width:14px;height:14px;border-radius:50%;border:2px solid #E8891C;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .2s">
            <span style="width:7px;height:7px;border-radius:50%;background:#E8891C;display:block;transition:background .2s,transform .2s cubic-bezier(.34,1.56,.64,1);transform:scale(1)"></span>
          </span>Yes</label>
        <label for="r-eg-n" id="rb-eg-n"
               style="display:inline-flex;align-items:center;gap:7px;padding:7px 18px;border-radius:8px;font-size:.85rem;font-weight:600;border:1.5px solid #e5e7eb;background:#f9fafb;color:#6b7280;cursor:pointer;user-select:none;transition:background .2s,border-color .2s,color .2s,box-shadow .2s;transform:translateZ(0)">
          <span style="width:14px;height:14px;border-radius:50%;border:2px solid #d1d5db;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .2s">
            <span style="width:7px;height:7px;border-radius:50%;background:transparent;display:block;transition:background .2s,transform .2s cubic-bezier(.34,1.56,.64,1);transform:scale(0)"></span>
          </span>No</label>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
      <div class="form-group" style="margin:0">
        ${fl('Frame Selection')}
        <input id="ne-frame" class="form-input" style="${inp}" value="${lastExam?.frameSelection || ''}" placeholder="e.g. Ray-Ban Classic">
      </div>
      <div class="form-group" style="margin:0">
        ${fl('Lens Type / Contact Lens')}
        <select id="ne-lens-type" class="form-select" style="${inp}">
          <option value="">Select lens type</option>
          ${['Single Vision','Bifocal','Progressive','Contact Lens','Photochromic'].map(t => `<option${lastExam?.lensType === t ? ' selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:16px">
      ${fl('Lens Material')}
      <select id="ne-lens-material" class="form-select" style="${inp}">
        ${['CR-39','Polycarbonate','High Index','Trivex'].map(m => `<option${lastExam?.lensMaterial === m ? ' selected' : ''}>${m}</option>`).join('')}
      </select>
    </div>
    <div class="form-group" style="margin-bottom:18px">
      ${fl('Lens Coatings')}
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:8px">
        ${[['Anti-Reflective','ar'],['Blue Light Filter','bl'],['Photochromic','ph'],['Scratch Resistant','sr']].map(([lbl, key]) =>
          `<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:.88rem;font-weight:500"><input type="checkbox" id="ne-coat-${key}" value="${lbl}" ${(lastExam?.lensCoating || []).includes(lbl) ? 'checked' : ''} style="accent-color:#E8891C;width:15px;height:15px"> ${lbl}</label>`
        ).join('')}
      </div>
    </div>
    <div class="form-group" style="margin:0">
      ${fl('Remarks')}
      <textarea id="ne-remarks" class="form-textarea" style="${inp};resize:vertical;width:100%;min-height:80px" placeholder="Additional clinical notes and recommendations...">${lastExam?.remarks || ''}</textarea>
    </div>
  </div>`

  // ── Step 5: Dispensing Information ──────────────────────────
  const step5 = `
  <div style="background:white;border-radius:12px;border:1px solid #e5e7eb;padding:28px">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
      <div style="width:36px;height:36px;border-radius:50%;background:#E8891C;color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ic('package','icon-sm')}</div>
      <div>
        <div style="font-size:.95rem;font-weight:700;color:#1f2937">Dispensing Information</div>
        <div style="font-size:.75rem;color:#6b7280;margin-top:1px">Eyeglass release and payment details</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
      <div class="form-group" style="margin:0">
        ${fl('Total Amount (PHP)')}
        <input id="ne-total" type="number" class="form-input" style="${inp}" value="0.00" placeholder="0.00">
      </div>
      <div class="form-group" style="margin:0">
        ${fl('Account Number')}
        <input id="ne-account" class="form-input" style="${inp}" placeholder="Account #">
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="form-group" style="margin:0">
        ${fl('Dispensed Date')}
        <input id="ne-dispensed-date" type="date" class="form-input" style="${inp}" value="${today}">
      </div>
      <div class="form-group" style="margin:0">
        ${fl('Received By')}
        <input id="ne-received-by" class="form-input" style="${inp}" placeholder="Full name">
      </div>
    </div>
  </div>`

  // ── Step 6: Prescription Review ──────────────────────────────
  const step6 = `
  <div style="background:white;border-radius:12px;border:1px solid #e5e7eb;padding:28px" id="rx-preview-wrapper">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:36px;height:36px;border-radius:50%;background:#E8891C;color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ic('file-text','icon-sm')}</div>
        <div>
          <div style="font-size:.95rem;font-weight:700;color:#1f2937">Prescription Summary</div>
          <div style="font-size:.75rem;color:#6b7280;margin-top:1px">Auto-generated from your entries</div>
        </div>
      </div>
      <span style="font-size:.65rem;font-weight:700;color:#E8891C;letter-spacing:.06em;text-transform:uppercase;padding:3px 10px;background:#fff8f0;border:1px solid #fed7aa;border-radius:20px;white-space:nowrap">AUTO-GENERATED</span>
    </div>
    <div style="border:1.5px dashed #d1d5db;border-radius:10px;padding:24px" id="ne-rx-preview">
      <div style="text-align:center;color:#9CA3AF;font-size:.84rem;padding:16px">Loading preview...</div>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px">
      <button class="btn-secondary" onclick="window.updateRxPreview(window._examPatientId)">${ic('refresh-cw','icon-sm')} Refresh</button>
      <button class="btn-secondary" onclick="window.printNewExamDraft(window._examPatientId)">${ic('printer','icon-sm')} Print Prescription</button>
    </div>
  </div>`

  const stepsHTML = [step1, step2, step3, step4, step5, step6]
    .map((html, i) => `<div id="wiz-step-${i + 1}" style="${i === 0 ? '' : 'display:none'}">${html}</div>`).join('')

  const navHTML = `
  <div id="wiz-nav" style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;background:white;border-radius:12px;border:1px solid #e5e7eb;padding:16px 20px">
    <button id="wiz-btn-back" onclick="examWizGo(-1)"
            style="display:none;align-items:center;gap:8px;padding:10px 20px;background:white;color:#374151;border:1.5px solid #d1d5db;border-radius:8px;font-family:'Poppins',sans-serif;font-size:.88rem;font-weight:600;cursor:pointer;transition:background 0.15s"
            onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
      ${ic('chevron-left','icon-sm')} Back
    </button>
    <div id="wiz-step-label" style="font-size:.8rem;color:#6b7280;font-weight:600">Step 1 of 6: Patient Info</div>
    <div style="display:flex;gap:10px;align-items:center">
      <button id="wiz-btn-next" onclick="examWizGo(1)"
              style="display:inline-flex;align-items:center;gap:8px;padding:10px 24px;background:#E8891C;color:white;border:none;border-radius:8px;font-family:'Poppins',sans-serif;font-size:.88rem;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(232,137,28,0.3);transition:background 0.25s"
              onmouseover="this.style.background='#C4720E'" onmouseout="this.style.background='#E8891C'">
        Next ${ic('chevron-right','icon-sm')}
      </button>
      <button id="wiz-btn-save" onclick="window.saveNewExam(window._examPatientId)"
              style="display:none;align-items:center;gap:8px;padding:10px 24px;background:#16a34a;color:white;border:none;border-radius:8px;font-family:'Poppins',sans-serif;font-size:.88rem;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(22,163,74,0.3);transition:background 0.25s"
              onmouseover="this.style.background='#15803d'" onmouseout="this.style.background='#16a34a'">
        ${ic('check','icon-sm')} Save Examination
      </button>
      <button id="wiz-btn-print" onclick="window.printNewExamDraft(window._examPatientId)"
              style="display:none;align-items:center;gap:8px;padding:10px 20px;background:white;color:#374151;border:1.5px solid #d1d5db;border-radius:8px;font-family:'Poppins',sans-serif;font-size:.88rem;font-weight:600;cursor:pointer;transition:background 0.15s"
              onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">
        ${ic('printer','icon-sm')} Print
      </button>
    </div>
  </div>`

  const _dob = p.dob ? new Date(p.dob+'T00:00:00').toLocaleDateString('en-PH',{year:'numeric',month:'short',day:'numeric'}) : '—'

  const rightColumn = `
  <div style="background:white;border-radius:12px;border:1px solid #e5e7eb;padding:20px">
    <!-- Patient Profile -->
    <div style="text-align:center;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #f3f4f6">
      <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#E8760A,#F5A44D);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:1.5rem;font-weight:800;color:#fff;letter-spacing:-.02em;box-shadow:0 4px 14px rgba(232,118,10,.3);overflow:hidden">${p.photoUrl ? `<img src="${p.photoUrl}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">` : initials(p.name)}</div>
      <div style="font-size:1rem;font-weight:800;color:#1f2937;margin-bottom:2px">${p.name}</div>
      <div style="font-size:.75rem;font-family:monospace;color:#9CA3AF;margin-bottom:6px">${p.id}</div>
      <span style="display:inline-block;background:#dcfce7;color:#16a34a;font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:2px 10px;border-radius:20px">${p.status || 'Active'}</span>
      ${p.occupation ? `<div style="font-size:.72rem;color:#9CA3AF;margin-top:6px">${p.occupation}</div>` : ''}
    </div>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${[
        [ic('user','icon-sm'),     'Gender / Age',    `${p.gender||'—'}, ${p.age ? p.age+' yrs' : '—'}`],
        [ic('calendar','icon-sm'), 'Date of Birth',   _dob],
        [ic('phone','icon-sm'),    'Contact Number',  p.contact || '—'],
        [ic('calendar','icon-sm'), 'Last Visit',      (p.lastVisit && p.lastVisit !== '—') ? new Date(p.lastVisit+'T00:00:00').toLocaleDateString('en-PH',{year:'numeric',month:'short',day:'numeric'}) : '—'],
        [ic('activity','icon-sm'), 'Blood Type',      p.bloodType || '—'],
        [ic('activity','icon-sm'), 'Known Condition', p.medicalHistory ? p.medicalHistory.split('.')[0] : 'None on record'],
      ].map(([iconHtml, label, val]) => `
        <div style="display:flex;align-items:flex-start;gap:10px">
          <span style="color:#9ca3af;flex-shrink:0;margin-top:2px">${iconHtml}</span>
          <div>
            <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#9CA3AF;margin-bottom:2px">${label}</div>
            <div style="font-size:.82rem;font-weight:600;color:#1f2937">${val}</div>
          </div>
        </div>`).join('')}
    </div>
  </div>
  <div style="background:white;border-radius:12px;border:1px solid #e5e7eb;padding:20px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
      <div style="color:#E8891C">${ic('clock','icon-sm')}</div>
      <span style="font-size:.88rem;font-weight:700;color:#1f2937">Consultation Timeline</span>
      <span style="margin-left:auto;font-size:.72rem;color:#9CA3AF">${p.consultations.length} records</span>
    </div>
    ${p.consultations.length ? `
    <div style="position:relative;padding-left:22px">
      <div style="position:absolute;left:6px;top:10px;bottom:10px;width:2px;background:#e5e7eb;border-radius:2px"></div>
      ${p.consultations.slice(0, 5).map((c, i) => `
      <div style="position:relative;margin-bottom:${i < Math.min(p.consultations.length, 5) - 1 ? '18px' : '0'}">
        <div style="position:absolute;left:-22px;top:3px;width:14px;height:14px;border-radius:50%;
                    background:${i === 0 ? '#E8891C' : 'white'};border:2px solid ${i === 0 ? '#E8891C' : '#d1d5db'};z-index:1;
                    box-shadow:${i === 0 ? '0 0 0 3px rgba(232,137,28,0.15)' : 'none'}"></div>
        <div style="cursor:pointer" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='block'?'none':'block'">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:6px">
            <div>
              <div style="font-size:.8rem;font-weight:700;color:#1f2937">${c.date}</div>
              <div style="font-size:.72rem;color:#6b7280;margin-bottom:2px">${c.doctor}</div>
              <div style="font-size:.78rem;font-weight:600;color:#374151">${c.diagnosis}</div>
            </div>
            ${i === 0 ? `<span style="font-size:.58rem;font-weight:700;color:#E8891C;background:#fff8f0;border:1px solid #fed7aa;border-radius:20px;padding:2px 7px;white-space:nowrap;flex-shrink:0">Latest</span>` : ''}
          </div>
        </div>
        <div style="display:none;margin-top:6px">
          <div style="background:#f9fafb;border-radius:6px;padding:8px;font-size:.72rem;line-height:1.6;color:#6b7280;font-family:monospace">${c.prescription || '—'}</div>
        </div>
      </div>`).join('')}
    </div>` : `<div style="text-align:center;color:#9CA3AF;font-size:.82rem;padding:12px 0">No prior consultations.</div>`}
  </div>`

  return `
  <div class="page-header">
    <div class="page-header-left">
      <div style="display:flex;align-items:center;gap:12px">
        <button class="btn-icon" onclick="window.navigate('new-examination')" title="Back">${ic('chevron-left','icon')}</button>
        <div>
          <h1 class="page-title" style="font-size:1.4rem">Optical Examination Record</h1>
          <p class="page-subtitle">Patient: <strong>${p.name}</strong> &nbsp;·&nbsp; ${p.id}</p>
        </div>
      </div>
    </div>
    <div class="page-header-right">
      <button class="btn-secondary" style="font-size:.82rem" onclick="window.navigate('new-examination')">
        ${ic('refresh-cw','icon-sm')} Change Patient
      </button>
    </div>
  </div>

  <div class="page-body">
  <div style="display:grid;grid-template-columns:1fr 300px;gap:20px;align-items:start;max-width:100%;overflow:hidden">

    <!-- LEFT: Wizard -->
    <div style="min-width:0;overflow:hidden">
      ${stepperHTML}
      <div id="wiz-steps-container" style="position:relative">
        ${stepsHTML}
      </div>
      ${navHTML}
    </div>

    <!-- RIGHT: Patient Info + Timeline -->
    <div style="display:flex;flex-direction:column;gap:16px;position:sticky;top:24px;min-width:0;width:300px;max-width:300px">
      ${rightColumn}
    </div>

  </div>

  <style>
    @media print {
      #sidebar, .topbar, .page-header, #rx-preview-wrapper .btn-secondary,
      #rx-preview-wrapper ~ * { display: none !important; }
      #rx-preview-wrapper { border: 1px solid #ccc !important; page-break-inside: avoid; box-shadow: none !important; }
      body { background: white; }
    }
  </style>

  </div>`
}


// ════════════════════════════════════════════════════════════════
//  PATIENT — EXAMINATION HISTORY
// ════════════════════════════════════════════════════════════════
function pagePatientExamHistory() {
  const { user } = st()
  const myExams = user ? patients.find(p => p.id === user.id)?.examinations || [] : []
  const sorted  = [...myExams].sort((a,b) => b.date.localeCompare(a.date))

  window.state.afterRender = () => { window.initPagination('pt-exam-tbody'); window.initSortable('pt-exam-tbody') }

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">My Examination History</h1>
      <p class="page-subtitle">Your complete optical examination records</p>
    </div>
  </div>
  <div class="page-body">

    ${sorted.length ? `
    <div class="table-wrap">
      <div class="table-toolbar">
        <span class="table-title">${sorted.length} examination${sorted.length!==1?'s':''}</span>
        <div class="table-actions">
          <div class="search-input-wrap">
            ${ic('search','icon-sm')}
            <input class="search-input" placeholder="Search by diagnosis or doctor…"
                   oninput="window.filterTable(this,'pt-exam-tbody')">
          </div>
        </div>
      </div>
      <table class="tbl">
        <colgroup>
          <col style="width:12%"><col style="width:18%"><col style="width:26%">
          <col style="width:16%"><col style="width:12%"><col style="width:16%">
        </colgroup>
        <thead><tr>
          <th data-sort-key="date" data-sort-type="date">Date</th>
          <th data-sort-key="doctor" data-sort-type="text">Doctor</th>
          <th>Diagnosis</th><th>Lens Type</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody id="pt-exam-tbody">
          ${sorted.map(e => `<tr data-search="${e.doctor.toLowerCase()} ${(e.diagnosis||'').toLowerCase()}" data-sort-date="${e.date}" data-sort-doctor="${e.doctor.toLowerCase()}">
            <td style="font-size:.82rem;white-space:nowrap;font-weight:600">${fmtDate(e.date)}</td>
            <td style="font-size:.82rem">${e.doctor}</td>
            <td style="font-size:.82rem;font-weight:600;color:#1C1C1C">${e.diagnosis}</td>
            <td style="font-size:.78rem;color:#6B7280">${e.lensType || '—'}</td>
            <td>${badge(e.status || 'completed')}</td>
            <td>
              <div style="display:flex;gap:4px">
                <button class="btn-icon" title="View Full Exam"
                        onclick="window.viewExamDetail('${user.id}','${e.id}')">
                  ${ic('eye','icon-sm')}
                </button>
                <button class="btn-icon" title="View Prescription"
                        onclick="window.viewPrescriptionModal('${user.id}','${e.id}')">
                  ${ic('file-text','icon-sm')}
                </button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>` : `
    <div class="table-empty" style="padding:48px">
      No examination records yet. Records will appear here after your first consultation.<br>
      <button class="btn-primary" style="margin-top:16px"
              onclick="window.navigate('patient-appts',{filter:'request'})">Book an Appointment</button>
    </div>`}
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  PATIENT — DASHBOARD
// ════════════════════════════════════════════════════════════════
function pagePatientDashboard() {
  const { user } = st()
  const myAppts  = appointments.filter(a => a.patientId === user.id)
  const upcoming = myAppts.filter(a => ['pending','approved'].includes(a.status))
    .sort((a,b) => a.date.localeCompare(b.date))
  const nextAppt = upcoming[0] || null
  const show3    = upcoming.slice(0, 3)

  const patient  = patients.find(p => p.id === user.id)
  const lastExam = patient?.examinations?.sort((a,b) => b.date.localeCompare(a.date))[0] || null

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">My Dashboard</h1>
      <p class="page-subtitle">Manage your appointments and view your records</p>
    </div>
  </div>
  <div class="page-body">

    <div class="welcome-banner" style="margin-bottom:20px">
      <div class="welcome-banner-text">
        <h2>Hello, ${user.firstName}!</h2>
        <p>Your patient ID is <strong style="color:#E8760A">${user.id}</strong> &bull; QR Code ready below</p>
        <div style="display:flex;gap:8px;margin-top:12px;position:relative;z-index:1">
          <button class="btn-primary" onclick="window.navigate('patient-appts',{filter:'request'})">${ic('plus','icon-sm')} Book Appointment</button>
          <button class="btn-secondary" style="background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);color:#fff"
                  onclick="window.navigate('patient-records')">${ic('file-text','icon-sm')} My Records</button>
        </div>
      </div>
      <div class="welcome-qr-mini">
        <div style="border-radius:8px;overflow:hidden;">
          ${window.mockQRSvg(user.qrData, 112)}
        </div>
        <div style="font-size:.65rem;color:#6B7280;text-align:center;margin-top:4px">Your QR</div>
      </div>
    </div>

    ${nextAppt ? `
    <div style="border-left:4px solid #E8760A;background:#FFF8F0;border-radius:0 10px 10px 0;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div style="flex:1;min-width:0">
        <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#E8760A;margin-bottom:2px">Next Appointment</div>
        <div style="font-size:.95rem;font-weight:700;color:#1C1C1C">${nextAppt.doctorName}</div>
        <div style="font-size:.8rem;color:#6B7280;margin-top:2px">${fmtDate(nextAppt.date)} &bull; ${nextAppt.time} &bull; ${nextAppt.type}</div>
      </div>
      <div>${badge(nextAppt.status)}</div>
      <button class="btn-secondary" style="font-size:.8rem;padding:6px 14px"
              onclick="window.navigate('patient-appts')">${ic('calendar','icon-sm')} View All</button>
    </div>` : ''}

    <!-- Quick Links -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px">
      <button onclick="window.navigate('patient-appts',{filter:'request'})"
              style="display:flex;align-items:center;gap:12px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;padding:14px 16px;cursor:pointer;text-align:left;transition:border-color .2s,box-shadow .2s"
              onmouseover="this.style.borderColor='#E8760A';this.style.boxShadow='0 2px 8px rgba(232,118,10,.1)'"
              onmouseout="this.style.borderColor='#E5E7EB';this.style.boxShadow='none'">
        <div style="width:36px;height:36px;border-radius:8px;background:#FFF0DC;display:flex;align-items:center;justify-content:center;color:#E8760A;flex-shrink:0">${ic('plus','icon-sm')}</div>
        <div>
          <div style="font-size:.85rem;font-weight:600;color:#1C1C1C">Book Appointment</div>
          <div style="font-size:.72rem;color:#9CA3AF">Request a new visit</div>
          <div style="font-size:.68rem;color:#9CA3AF;margin-top:3px;display:flex;align-items:center;gap:3px">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="10" height="10"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Book at least 1 day in advance
          </div>
        </div>
      </button>
      <button onclick="window.navigate('patient-prescriptions')"
              style="display:flex;align-items:center;gap:12px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;padding:14px 16px;cursor:pointer;text-align:left;transition:border-color .2s,box-shadow .2s"
              onmouseover="this.style.borderColor='#E8760A';this.style.boxShadow='0 2px 8px rgba(232,118,10,.1)'"
              onmouseout="this.style.borderColor='#E5E7EB';this.style.boxShadow='none'">
        <div style="width:36px;height:36px;border-radius:8px;background:#ECFDF5;display:flex;align-items:center;justify-content:center;color:#059669;flex-shrink:0">${ic('file-text','icon-sm')}</div>
        <div><div style="font-size:.85rem;font-weight:600;color:#1C1C1C">Prescriptions</div><div style="font-size:.72rem;color:#9CA3AF">View your prescriptions</div></div>
      </button>
      <button onclick="window.navigate('doctor-availability')"
              style="display:flex;align-items:center;gap:12px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;padding:14px 16px;cursor:pointer;text-align:left;transition:border-color .2s,box-shadow .2s"
              onmouseover="this.style.borderColor='#E8760A';this.style.boxShadow='0 2px 8px rgba(232,118,10,.1)'"
              onmouseout="this.style.borderColor='#E5E7EB';this.style.boxShadow='none'">
        <div style="width:36px;height:36px;border-radius:8px;background:#EFF6FF;display:flex;align-items:center;justify-content:center;color:#3B82F6;flex-shrink:0">${ic('calendar','icon-sm')}</div>
        <div><div style="font-size:.85rem;font-weight:600;color:#1C1C1C">Doctor Availability</div><div style="font-size:.72rem;color:#9CA3AF">Check doctor schedules</div></div>
      </button>
    </div>

    <div class="grid-sidebar">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Upcoming Appointments</div>
          <button class="btn-ghost" onclick="window.navigate('patient-appts')"
                  style="font-size:.75rem;padding:4px 10px">View All</button>
        </div>
        ${show3.length ? `
        <div style="overflow-x:auto">
        <table class="tbl" style="table-layout:fixed">
          <colgroup>
            <col style="width:26%"><col style="width:22%"><col style="width:18%"><col style="width:18%"><col style="width:16%">
          </colgroup>
          <thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr></thead>
          <tbody>
            ${show3.map(a => `<tr>
              <td style="font-size:.82rem;font-weight:500">${a.doctorName}</td>
              <td style="font-size:.82rem">${fmtDate(a.date)}</td>
              <td style="font-size:.82rem;white-space:nowrap">${a.time}</td>
              <td style="font-size:.78rem;color:#6B7280">${a.type}</td>
              <td>${badge(a.status)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        </div>` : `
        <div class="table-empty">No upcoming appointments.<br>
          <button class="btn-primary" style="margin-top:12px" onclick="window.navigate('patient-appts',{filter:'request'})">Book an Appointment</button>
        </div>`}
      </div>

      <div class="gap-y">
        <div class="qr-display-card">
          <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9CA3AF;margin-bottom:12px">My QR Code</div>
          <div style="font-size:.8rem;color:#6B7280;margin-bottom:10px">Show this QR at the clinic for quick check-in.</div>
          <div class="qr-patient-id">${user.qrData}</div>
          <div style="display:flex;gap:8px;margin-top:14px">
            <button class="btn-secondary" style="flex:1;justify-content:center" onclick="window.navigate('patient-qr')">
              ${ic('qr','icon-sm')} View Full QR
            </button>
            <button class="btn-primary" style="flex:1;justify-content:center" onclick="window.navigate('patient-appts',{filter:'request'})">
              ${ic('plus','icon-sm')} Book
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">Recent Record</div></div>
          <div class="card-body">
            ${lastExam ? `
              <div style="font-size:.75rem;color:#9CA3AF;margin-bottom:4px">${fmtDate(lastExam.date)}</div>
              <div style="font-size:.88rem;font-weight:700;color:#1C1C1C;margin-bottom:4px">${lastExam.diagnosis}</div>
              <div style="font-size:.78rem;color:#6B7280">${lastExam.doctor}</div>
              <div style="font-family:monospace;font-size:.75rem;color:#374151;margin-top:6px">
                OD ${lastExam.od.sph} ${lastExam.od.cyl} &times;${lastExam.od.axis}<br>
                OS ${lastExam.os.sph} ${lastExam.os.cyl} &times;${lastExam.os.axis}
              </div>
              <button class="btn-ghost" style="margin-top:10px;width:100%;justify-content:center"
                      onclick="window.navigate('patient-exam-history')">${ic('eye','icon-sm')} View Exam History</button>
            ` : `<div style="text-align:center;color:#9CA3AF;font-size:.82rem">No records yet.</div>`}
          </div>
        </div>
      </div>
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  PATIENT — APPOINTMENTS
// ════════════════════════════════════════════════════════════════
function pagePatientAppts() {
  const { user, filter } = st()
  const tab     = filter === 'request' ? 'request' : 'history'
  const myAppts = appointments.filter(a => a.patientId === user.id)

  const cnt = s => myAppts.filter(a => a.status === s).length
  const subTabs = ['all','approved','pending','completed','cancelled','disapproved']

  if (tab === 'request') {
    window.state.afterRender = () => window.amcInit()
  } else {
    window.state.afterRender = () => { window.initPagination('pt-appt-tbody'); window.initSortable('pt-appt-tbody') }
  }

  const _minAdv = minAdvanceDays()
  const advanceNoticeHtml = _minAdv === 0
    ? `You can book for <strong>today</strong> or any future date.`
    : `Appointments must be booked <strong>at least ${_minAdv} day${_minAdv > 1 ? 's' : ''} in advance.</strong><br>
       ${_minAdv === 1 ? 'Same-day booking is not available.' : `Booking less than ${_minAdv} days ahead is not available.`} Please select a valid date from the calendar below.`

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Appointments</h1>
      <p class="page-subtitle">Request new appointments or view your history</p>
    </div>
  </div>
  <div class="page-body">

    <div class="filter-tabs" style="margin-bottom:20px;border-bottom:1px solid #E5E7EB;position:sticky;top:0;z-index:5;background:#f5f6fa">
      <button class="filter-tab${tab==='request'?' active':''}"
              onclick="window.navigate('patient-appts',{filter:'request'})">
        ${ic('plus','icon-sm')} Request Appointment
      </button>
      <button class="filter-tab${tab==='history'?' active':''}"
              onclick="window.navigate('patient-appts',{filter:'history'})">
        ${ic('calendar','icon-sm')} My History
      </button>
    </div>

    ${tab === 'request' ? `
    <style>
      /* ── Wizard layout ── */
      .wiz-layout { display:grid; grid-template-columns:1.7fr 1fr; gap:24px; align-items:start; }
      .wiz-step { display:none; animation:none; }
      .wiz-step.active { display:block; }
      @keyframes wiz-in-right { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
      @keyframes wiz-in-left  { from { opacity:0; transform:translateX(-30px); } to { opacity:1; transform:translateX(0); } }
      .wiz-anim-right { animation: wiz-in-right .3s ease forwards; }
      .wiz-anim-left  { animation: wiz-in-left  .3s ease forwards; }
      /* ── Progress stepper ── */
      .wiz-stepper { display:flex; align-items:center; margin-bottom:24px; }
      .wiz-step-item { display:flex; flex-direction:column; align-items:center; flex:1; position:relative; }
      .wiz-step-item:not(:last-child)::after { content:''; position:absolute; top:14px; left:50%; width:100%;
        height:2px; background:#e5e7eb; z-index:0; transition:background .3s; }
      .wiz-step-item.done:not(:last-child)::after { background:#E8760A; }
      .wiz-circle { width:28px; height:28px; border-radius:50%; border:2px solid #e5e7eb; background:#fff;
        display:flex; align-items:center; justify-content:center; font-size:.72rem; font-weight:700;
        color:#9CA3AF; z-index:1; position:relative; transition:all .25s; flex-shrink:0; }
      .wiz-step-item.done .wiz-circle { background:#E8760A; border-color:#E8760A; color:#fff; }
      .wiz-step-item.active .wiz-circle { border-color:#E8760A; color:#E8760A;
        box-shadow:0 0 0 4px rgba(232,118,10,.15); }
      .wiz-step-label { font-size:.68rem; color:#9CA3AF; margin-top:5px; font-weight:500; }
      .wiz-step-item.done .wiz-step-label,
      .wiz-step-item.active .wiz-step-label { color:#E8760A; font-weight:600; }
      /* ── Step nav ── */
      .wiz-nav { display:flex; align-items:center; justify-content:space-between; margin-top:20px; }
      .wiz-btn-back { background:none; border:none; font-family:'Poppins',sans-serif; font-size:.85rem;
        color:#6B7280; cursor:pointer; padding:8px 0; display:flex; align-items:center; gap:5px; }
      .wiz-btn-back:hover { color:#374151; }
      .wiz-btn-next { font-family:'Poppins',sans-serif; font-size:.88rem; font-weight:600; cursor:pointer;
        padding:11px 28px; border-radius:8px; border:none; background:#E8760A; color:#fff;
        display:flex; align-items:center; gap:7px; transition:opacity .2s,background .2s; }
      .wiz-btn-next:disabled { opacity:.38; cursor:not-allowed; }
      .wiz-btn-next:not(:disabled):hover { background:#C4620A; }
      /* ── Doctor cards ── */
      .doc-card { display:flex; align-items:center; gap:14px; padding:16px 20px; border-radius:10px;
        border:1.5px solid #e5e7eb; background:#fff; cursor:pointer; margin-bottom:12px;
        transition:border-color .15s,background .15s; width:100%; text-align:left;
        font-family:'Poppins',sans-serif; }
      .doc-card:hover { border-color:#E8760A; background:#FFFBF5; }
      .doc-card.selected { border-color:#E8760A; background:#FFF7ED; }
      .doc-card-avatar { width:40px; height:40px; border-radius:50%; background:#FFF0DC;
        display:flex; align-items:center; justify-content:center; font-size:.78rem;
        font-weight:700; color:#E8760A; flex-shrink:0; }
      /* ── Type cards ── */
      .appt-type-card { text-align:left; padding:16px; border-radius:10px; border:1.5px solid #e5e7eb;
        background:#fff; cursor:pointer; font-family:'Poppins',sans-serif;
        transition:border-color .15s,background .15s; width:100%; }
      .appt-type-card:hover { border-color:#E8760A; background:#FFFBF5; }
      .appt-type-card.selected { border-color:#E8760A; background:#FFF7ED; }
      /* ── Time slots ── */
      .time-slot { padding:9px 14px; border-radius:8px; border:1.5px solid #e5e7eb; background:#fff;
        font-family:'Poppins',sans-serif; font-size:.82rem; cursor:pointer; transition:all .15s; white-space:nowrap; }
      .time-slot:hover:not(.taken) { border-color:#E8760A; }
      .time-slot.selected { background:#E8760A; color:#fff; border-color:#E8760A; }
      .time-slot.taken { background:#F3F4F6; color:#9CA3AF; cursor:default; text-decoration:line-through; }
      /* ── Mini calendar ── */
      .appt-mini-cal { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; }
      .amc-hdr { text-align:center; font-size:.65rem; font-weight:700; color:#9CA3AF; padding:4px 0; text-transform:uppercase; }
      .amc-day { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:6px;
        font-size:.8rem; cursor:pointer; transition:all .15s; position:relative; color:#374151; }
      .amc-day:hover:not(.amc-past):not(.amc-empty):not(.amc-far) { background:#FFF0DC; }
      .amc-day.amc-avail { background:#ECFDF5; color:#065F46; font-weight:600; }
      .amc-day.amc-today { outline:2px solid #E8760A; font-weight:700; }
      .amc-day.amc-selected { background:#E8760A !important; color:#fff !important; font-weight:700; }
      .amc-day.amc-past { opacity:.35; cursor:default; }
      .amc-day.amc-far { opacity:.3; cursor:default; background:#f9fafb; }
      .amc-day.amc-empty { cursor:default; }
      .amc-day.amc-holiday { background:#FFF1F2; color:#f43f5e; cursor:default; font-weight:600; flex-direction:column; justify-content:center; aspect-ratio:unset; min-height:46px; gap:1px; padding:3px 2px; }
      .amc-holiday-lbl { font-size:.42rem; line-height:1.2; text-align:center; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; font-weight:500; padding:0 1px; }
      /* ── Summary sidebar ── */
      .sum-row { display:flex; align-items:flex-start; gap:10px; margin-bottom:14px; }
      .sum-icon { width:28px; height:28px; border-radius:7px; background:#FFF0DC; display:flex; align-items:center;
        justify-content:center; flex-shrink:0; color:#E8760A; margin-top:1px; }
      .sum-label { font-size:.68rem; text-transform:uppercase; letter-spacing:.05em; color:#9CA3AF; margin-bottom:2px; }
      .sum-val { font-size:.85rem; font-weight:600; color:#1C1C1C; }
      .sum-val.empty { color:#9CA3AF; font-weight:400; }
      /* ── Review step ── */
      .rev-row { display:flex; align-items:flex-start; gap:14px; padding:14px 0; border-bottom:1px solid #f3f4f6; }
      .rev-row:last-child { border-bottom:none; }
      .rev-icon { width:32px; height:32px; border-radius:8px; background:#FFF0DC; display:flex; align-items:center;
        justify-content:center; color:#E8760A; flex-shrink:0; }
      .rev-label { font-size:.68rem; text-transform:uppercase; letter-spacing:.06em; color:#9CA3AF; margin-bottom:3px; }
      .rev-val { font-size:.9rem; font-weight:600; color:#1C1C1C; }
      .rev-edit { font-size:.72rem; color:#E8760A; background:none; border:none; cursor:pointer;
        font-family:'Poppins',sans-serif; margin-left:auto; padding:0; flex-shrink:0; align-self:center; }
      .rev-edit:hover { text-decoration:underline; }
    </style>

    <div class="wiz-layout">

      <!-- ── LEFT: WIZARD ── -->
      <div>

        <!-- Progress Stepper -->
        <div class="wiz-stepper" id="wiz-stepper">
          ${['Date','Doctor','Time','Type','Review'].map((lbl,i) => `
          <div class="wiz-step-item${i===0?' active':''}" id="wiz-si-${i}">
            <div class="wiz-circle" id="wiz-c-${i}">${i+1}</div>
            <div class="wiz-step-label">${lbl}</div>
          </div>`).join('')}
        </div>

        <!-- Step 1: Date -->
        <div class="wiz-step active card" id="wiz-step-0">
          <div class="card-body">
            <div style="margin-bottom:16px">
              <div style="font-size:1.1rem;font-weight:700;color:#1C1C1C;margin-bottom:4px">When would you like to visit?</div>
              <div style="font-size:.85rem;color:#6B7280">Select your preferred consultation date.</div>
            </div>
            <!-- Doctor pre-fill banner — shown only when coming from Doctor Availability -->
            <div id="amc-prefill-banner" style="display:none;background:#FFF8F0;border-left:3px solid #E8760A;border-radius:8px;padding:12px 16px;margin-bottom:16px;align-items:center;gap:10px">
              <svg viewBox="0 0 24 24" fill="none" stroke="#E8760A" stroke-width="2" width="16" height="16" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
              <div style="font-size:.82rem;color:#92400e;line-height:1.5">
                Booking with <strong id="amc-prefill-doc-name"></strong>. Only their available days are shown. Select your preferred date below.
              </div>
            </div>
            <div style="background:#eff6ff;border-left:3px solid #3b82f6;border-radius:8px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:flex-start;gap:10px">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" width="16" height="16" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>
              <div style="font-size:.82rem;color:#1e40af;line-height:1.5">
                ${advanceNoticeHtml}
              </div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
              <button class="btn-icon" id="amc-prev" onclick="window.amcGoMonth(-1)">${ic('chevron-left','icon-sm')}</button>
              <span id="amc-month-label" style="font-size:.88rem;font-weight:700;color:#1C1C1C"></span>
              <button class="btn-icon" id="amc-next" onclick="window.amcGoMonth(1)">${ic('chevron-right','icon-sm')}</button>
            </div>
            <div class="appt-mini-cal">
              ${['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d=>`<div class="amc-hdr">${d}</div>`).join('')}
            </div>
            <div class="appt-mini-cal" id="amc-cells"></div>
            <div style="display:flex;gap:12px;margin-top:12px;flex-wrap:wrap">
              <span style="display:flex;align-items:center;gap:5px;font-size:.7rem;color:#6B7280"><span style="width:10px;height:10px;border-radius:3px;background:#ECFDF5;border:1px solid #6EE7B7;display:inline-block"></span>Available</span>
              <span style="display:flex;align-items:center;gap:5px;font-size:.7rem;color:#6B7280"><span style="width:10px;height:10px;border-radius:3px;background:#E8760A;display:inline-block"></span>Today / Selected</span>
              <span style="display:flex;align-items:center;gap:5px;font-size:.7rem;color:#6B7280"><span style="width:10px;height:10px;border-radius:3px;background:#F3F4F6;display:inline-block"></span>Unavailable</span>
              <span style="display:flex;align-items:center;gap:5px;font-size:.7rem;color:#6B7280"><span style="width:10px;height:10px;border-radius:3px;background:#FFF1F2;border:1px solid #fda4af;display:inline-block"></span>PH Holiday</span>
            </div>
            <div class="wiz-nav">
              <span></span>
              <button class="wiz-btn-next" id="wiz-next-0" disabled onclick="window.wizGo(1)">
                Continue ${ic('chevron-right','icon-sm')}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Doctor -->
        <div class="wiz-step card" id="wiz-step-1">
          <div class="card-body">
            <div style="margin-bottom:16px">
              <div style="font-size:1.1rem;font-weight:700;color:#1C1C1C;margin-bottom:4px">Choose your doctor</div>
              <div style="font-size:.85rem;color:#6B7280">Showing doctors available on <strong id="wiz-date-lbl2" style="color:#1C1C1C"></strong></div>
            </div>
            <div id="wiz-doctor-cards"></div>
            <input type="hidden" id="appt-doctor" value="">
            <div class="wiz-nav">
              <button class="wiz-btn-back" onclick="window.wizGo(-1)">${ic('chevron-left','icon-sm')} Back</button>
              <button class="wiz-btn-next" id="wiz-next-1" disabled onclick="window.wizGo(1)">
                Continue ${ic('chevron-right','icon-sm')}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Time -->
        <div class="wiz-step card" id="wiz-step-2">
          <div class="card-body">
            <div style="margin-bottom:16px">
              <div style="font-size:1.1rem;font-weight:700;color:#1C1C1C;margin-bottom:4px">Pick a time</div>
              <div style="font-size:.85rem;color:#6B7280">Available slots for <strong id="wiz-doc-lbl3" style="color:#1C1C1C"></strong> on <strong id="wiz-date-lbl3" style="color:#1C1C1C"></strong></div>
            </div>
            <div id="appt-time-slots"></div>
            <input type="hidden" id="appt-time" value="">
            <div class="wiz-nav">
              <button class="wiz-btn-back" onclick="window.wizGo(-1)">${ic('chevron-left','icon-sm')} Back</button>
              <button class="wiz-btn-next" id="wiz-next-2" disabled onclick="window.wizGo(1)">
                Continue ${ic('chevron-right','icon-sm')}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 4: Type + Notes -->
        <div class="wiz-step card" id="wiz-step-3">
          <div class="card-body">
            <div style="margin-bottom:16px">
              <div style="font-size:1.1rem;font-weight:700;color:#1C1C1C;margin-bottom:4px">What do you need?</div>
              <div style="font-size:.85rem;color:#6B7280">Select the type of consultation.</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
              ${CLINIC_SERVICES.filter(s => s.status === 'active').map((s, i) => `
              <button class="appt-type-card${i === 0 ? ' selected' : ''}"
                      onclick="window.selectApptType('${s.name.replace(/'/g,"\\'")}',this)">
                <div style="display:flex;align-items:center;gap:7px;margin-bottom:5px">
                  <span style="color:#E8760A">${ic(s.icon || 'eye','icon-sm')}</span>
                  <span style="font-size:.83rem;font-weight:600;color:#1C1C1C">${s.name}</span>
                </div>
                <div style="font-size:.73rem;color:#9CA3AF;line-height:1.4">${s.description}</div>
              </button>`).join('')}
            </div>
            <input type="hidden" id="appt-type" value="${CLINIC_SERVICES.filter(s => s.status === 'active')[0]?.name || 'Eye Examination'}">
            <div style="margin-bottom:4px">
              <label style="font-size:.78rem;font-weight:600;color:#374151">Notes / Reason for Visit <span style="font-weight:400;color:#9CA3AF">(optional)</span></label>
            </div>
            <textarea id="appt-notes" class="form-textarea" rows="3"
                      placeholder="Describe your symptoms or reason for the visit…"></textarea>
            <div class="wiz-nav">
              <button class="wiz-btn-back" onclick="window.wizGo(-1)">${ic('chevron-left','icon-sm')} Back</button>
              <button class="wiz-btn-next" onclick="window.wizGo(1)">
                Review Booking ${ic('chevron-right','icon-sm')}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 5: Review -->
        <div class="wiz-step card" id="wiz-step-4">
          <div class="card-body">
            <div style="margin-bottom:16px">
              <div style="font-size:1.1rem;font-weight:700;color:#1C1C1C;margin-bottom:4px">Review your appointment</div>
              <div style="font-size:.85rem;color:#6B7280">Please confirm the details below.</div>
            </div>
            <div style="border:1px solid #f3f4f6;border-radius:10px;padding:4px 16px;margin-bottom:16px">
              <div class="rev-row">
                <div class="rev-icon">${ic('calendar','icon-sm')}</div>
                <div style="flex:1"><div class="rev-label">Date</div><div class="rev-val" id="rev-date">—</div></div>
                <button class="rev-edit" onclick="window.wizJump(0)">Edit</button>
              </div>
              <div class="rev-row">
                <div class="rev-icon">${ic('user','icon-sm')}</div>
                <div style="flex:1"><div class="rev-label">Doctor</div><div class="rev-val" id="rev-doctor">—</div></div>
                <button class="rev-edit" onclick="window.wizJump(1)">Edit</button>
              </div>
              <div class="rev-row">
                <div class="rev-icon">${ic('clock','icon-sm')}</div>
                <div style="flex:1"><div class="rev-label">Time</div><div class="rev-val" id="rev-time">—</div></div>
                <button class="rev-edit" onclick="window.wizJump(2)">Edit</button>
              </div>
              <div class="rev-row">
                <div class="rev-icon">${ic('file-text','icon-sm')}</div>
                <div style="flex:1"><div class="rev-label">Type</div><div class="rev-val" id="rev-type">—</div></div>
                <button class="rev-edit" onclick="window.wizJump(3)">Edit</button>
              </div>
              <div class="rev-row">
                <div class="rev-icon">${ic('activity','icon-sm')}</div>
                <div style="flex:1"><div class="rev-label">Notes</div><div class="rev-val" id="rev-notes" style="font-weight:400;font-style:italic;color:#6B7280">No notes provided</div></div>
              </div>
            </div>
            <div style="font-size:.75rem;color:#9CA3AF;line-height:1.5;margin-bottom:16px;display:flex;align-items:flex-start;gap:6px">
              ${ic('info','icon-sm')} Your appointment request will be reviewed by clinic staff to confirm doctor availability and scheduling. You will be notified once confirmed.
            </div>
            <div class="wiz-nav">
              <button class="wiz-btn-back" onclick="window.wizGo(-1)">${ic('chevron-left','icon-sm')} Back</button>
              <button class="wiz-btn-next" id="appt-submit-btn" onclick="window.requestAppointment()" style="padding:12px 32px">
                ${ic('check','icon-sm')} Submit Request
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- ── RIGHT: BOOKING SUMMARY ── -->
      <div style="position:sticky;top:24px">
        <div class="card" style="border-radius:12px;border:1px solid #e5e7eb">
          <div class="card-body" style="padding:20px">
            <div style="font-size:.9rem;font-weight:700;color:#1C1C1C;margin-bottom:18px;display:flex;align-items:center;gap:7px">
              ${ic('calendar','icon-sm')} Booking Summary
            </div>
            <div class="sum-row">
              <div class="sum-icon">${ic('calendar','icon-sm')}</div>
              <div><div class="sum-label">Date</div><div class="sum-val empty" id="sum-date">Not selected yet</div></div>
            </div>
            <div class="sum-row">
              <div class="sum-icon">${ic('user','icon-sm')}</div>
              <div><div class="sum-label">Doctor</div><div class="sum-val empty" id="sum-doctor">Not selected yet</div></div>
            </div>
            <div class="sum-row">
              <div class="sum-icon">${ic('clock','icon-sm')}</div>
              <div><div class="sum-label">Time</div><div class="sum-val empty" id="sum-time">Not selected yet</div></div>
            </div>
            <div class="sum-row" style="margin-bottom:0">
              <div class="sum-icon">${ic('file-text','icon-sm')}</div>
              <div><div class="sum-label">Type</div><div class="sum-val" id="sum-type">Eye Examination</div></div>
            </div>
            <div style="border-top:1px solid #f3f4f6;margin:16px 0"></div>
            <div style="font-size:.73rem;color:#9CA3AF;line-height:1.5" id="sum-hint">
              ${ic('info','icon-sm')} Fill in all steps to submit your request.
            </div>
          </div>
        </div>
      </div>

    </div>
    ` : `
    <div class="table-wrap">
      <div class="filter-tabs" style="padding:12px 16px 0">
        ${subTabs.map(t => `
          <button class="filter-tab pt-appt-tab${t==='all'?' active':''}" data-tab="${t}"
                  onclick="window.filterPatientAppts('${t}')">
            ${t.charAt(0).toUpperCase()+t.slice(1)}${t!=='all'?` <span style="font-size:.72rem;background:#F3F4F6;color:#6B7280;border-radius:10px;padding:1px 6px;margin-left:3px">${cnt(t)}</span>`:''}
          </button>`).join('')}
      </div>
      <div class="table-toolbar">
        <span class="table-title">My Appointment History (${myAppts.length})</span>
        <div class="table-actions">
          <div class="search-input-wrap">
            ${ic('search','icon-sm')}
            <input class="search-input" placeholder="Search…" oninput="window.filterTable(this,'pt-appt-tbody')">
          </div>
        </div>
      </div>
      ${myAppts.length ? `
      <table class="tbl" style="table-layout:fixed">
        <colgroup>
          <col style="width:24%"><col style="width:15%"><col style="width:12%"><col style="width:22%"><col style="width:14%"><col style="width:13%">
        </colgroup>
        <thead><tr>
          <th data-sort-key="doctor" data-sort-type="text">Doctor</th>
          <th data-sort-key="date" data-sort-type="date">Date</th>
          <th>Time</th><th>Type</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody id="pt-appt-tbody">
          ${myAppts.map(a => `<tr data-search="${a.doctorName.toLowerCase()} ${a.type.toLowerCase()}" data-appt-status="${a.status}" data-sort-doctor="${a.doctorName.toLowerCase()}" data-sort-date="${a.date}">
            <td style="font-size:.82rem;font-weight:500">${a.doctorName}</td>
            <td style="font-size:.82rem">${fmtDate(a.date)}</td>
            <td style="font-size:.82rem;white-space:nowrap">${a.time}</td>
            <td style="font-size:.82rem">${a.type}</td>
            <td>${badge(a.status)}</td>
            <td>
              <div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap">
                <button class="btn-icon" title="View Details" onclick="window.viewAppt('${a.id}')">${ic('eye','icon-sm')}</button>
                ${(a.status==='pending'||a.status==='approved') ? `
                  ${a.rescheduleRequest ? `<span title="Reschedule request pending" style="display:inline-flex;align-items:center;gap:3px;font-size:.68rem;font-weight:600;color:#C2410C;background:#FFF7ED;border:1px solid #FED7AA;border-radius:999px;padding:1px 7px;white-space:nowrap">${ic('refresh-cw','icon-xs')} Requested</span>` : `<button class="btn-icon" title="Request Reschedule" style="color:#D97706" onclick="window.requestReschedule('${a.id}')">${ic('refresh-cw','icon-sm')}</button>`}
                  <button class="btn-icon" title="Cancel Appointment" style="color:#DC2626" onclick="window.confirmCancelAppt('${a.id}')">${ic('x-circle','icon-sm')}</button>` : ''}
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>` : `<div class="table-empty">No appointment history yet.</div>`}
    </div>`}
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  PATIENT — MY RECORDS (read-only)
// ════════════════════════════════════════════════════════════════
function pagePatientRecords() {
  const { user } = st()

  window.state.afterRender = () => { window.initPagination('pt-rec-tbody'); window.initSortable('pt-rec-tbody') }

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">My Medical Records</h1>
      <p class="page-subtitle">Read-only view of your consultation and examination history</p>
    </div>
    <button class="btn-secondary" onclick="window.print()">${ic('printer','icon-sm')} Print Records</button>
  </div>
  <div class="page-body">
    <div class="alert-info" style="margin-bottom:20px">
      ${ic('info','icon-sm')} Your medical records are maintained by clinic staff and doctors. Contact the clinic to request corrections.
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><div class="card-title">Consultation History</div></div>
      ${user.consultations.length ? `
      <div class="table-wrap" style="box-shadow:none;border:1px solid #f3f4f6">
      <table class="tbl">
        <colgroup>
          <col style="width:12%"><col style="width:16%"><col style="width:12%">
          <col style="width:18%"><col style="width:24%"><col style="width:18%">
        </colgroup>
        <thead><tr>
          <th data-sort-key="date" data-sort-type="date">Date</th>
          <th data-sort-key="doctor" data-sort-type="text">Doctor</th>
          <th>Type</th><th>Diagnosis</th><th>Prescription</th><th>Remarks</th>
        </tr></thead>
        <tbody id="pt-rec-tbody">
          ${user.consultations.map(c=>`<tr data-search="${(c.doctor||'').toLowerCase()} ${(c.diagnosis||'').toLowerCase()} ${(c.type||'').toLowerCase()}" data-sort-date="${c.date}" data-sort-doctor="${(c.doctor||'').toLowerCase()}">
            <td style="font-size:.78rem;white-space:nowrap">${fmtDate(c.date)}</td>
            <td style="font-size:.82rem">${c.doctor}</td>
            <td style="font-size:.78rem">${c.type}</td>
            <td style="font-size:.85rem;font-weight:600">${c.diagnosis}</td>
            <td style="font-family:monospace;font-size:.75rem">${c.prescription}</td>
            <td style="font-size:.75rem;color:#6B7280">${c.remarks}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      </div>` : `<div class="table-empty">No consultation records.</div>`}
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">Optical Examination Records</div></div>
      ${user.examinations.length ? user.examinations.map(e=>`
      <div style="padding:18px 20px;border-bottom:1px solid #F3F4F6">
        <div style="font-size:.85rem;font-weight:700;color:#1C1C1C;margin-bottom:4px">${fmtDate(e.date)} &bull; ${e.doctor}</div>
        <div class="eye-grid" style="margin:10px 0">
          <div></div>
          <div class="eye-header">SPH</div><div class="eye-header">CYL</div>
          <div class="eye-header">AXIS</div><div class="eye-header">VA</div>
          <div class="eye-label">OD</div>
          <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.od.sph}</div>
          <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.od.cyl}</div>
          <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.od.axis}</div>
          <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.od.va}</div>
          <div class="eye-label">OS</div>
          <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.os.sph}</div>
          <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.os.cyl}</div>
          <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.os.axis}</div>
          <div style="font-family:monospace;font-size:.82rem;text-align:center">${e.os.va}</div>
        </div>
        <div style="font-size:.78rem"><strong>Diagnosis:</strong> ${e.diagnosis}</div>
        <div style="font-size:.78rem"><strong>Recommendation:</strong> ${e.recommendation}</div>
        <div style="font-size:.75rem;color:#9CA3AF;margin-top:4px">${e.remarks}</div>
      </div>`).join('') : `<div class="table-empty">No examination records yet. Records are created when a doctor completes a patient consultation.</div>`}
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  PATIENT — QR CODE PAGE
// ════════════════════════════════════════════════════════════════
function pagePatientQR() {
  const { user } = st()

  const steps = [
    ['Show at Reception',  'Present this QR at the clinic reception desk for instant identity verification.'],
    ['Fast Check-in',      'Staff will scan your QR to pull up your full patient record automatically.'],
    ['Keep it Private',    'Do not share your QR code with others. It is uniquely linked to your patient account.'],
    ['Download & Print',   'You may download or print your QR code to bring a physical copy to your appointment.']
  ]

  return `
  <style>
    @media print {
      body * { visibility: hidden; }
      .qr-print-area, .qr-print-area * { visibility: visible; }
      .qr-print-area {
        position: absolute;
        left: 50%; top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-family: 'Poppins', sans-serif;
      }
    }
    @media (min-width: 1024px) {
      .qr-two-col { display: grid !important; grid-template-columns: 2fr 3fr; gap: 20px; }
    }
  </style>

  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">My QR Code</h1>
      <p class="page-subtitle">Your personal identification QR for quick clinic check-in</p>
    </div>
  </div>
  <div class="page-body">
    <div class="qr-two-col" style="display:flex;flex-direction:column;gap:20px">

      <!-- LEFT: QR Card -->
      <div class="card" style="padding:32px;display:flex;flex-direction:column;align-items:center;text-align:center">
        <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9CA3AF;margin-bottom:20px">Patient Identification QR</div>

        <!-- Print-only area -->
        <div class="qr-print-area" style="display:contents">
          <div style="font-size:.8rem;font-weight:700;letter-spacing:.05em;color:#6B7280;margin-bottom:12px;display:none" class="print-clinic-name">CANA OPTICAL CLINIC</div>
          <div id="pt-qr-container" style="border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);display:inline-block">
            ${window.mockQRSvg(user.qrData, 160)}
          </div>
          <div style="margin-top:18px">
            <div style="font-size:1.1rem;font-weight:700;color:#1C1C1C">${user.name}</div>
            <div style="font-size:.85rem;color:#6B7280;margin-top:4px">Patient ID: ${user.id}</div>
          </div>
          <div style="font-size:.75rem;color:#9CA3AF;margin-top:8px;display:none" class="print-hint">Present this QR code at the reception desk for quick check-in.</div>
        </div>

        <div style="display:flex;gap:12px;margin-top:24px;width:100%">
          <button class="btn-secondary" style="flex:1;justify-content:center;border-radius:8px"
                  onclick="window.downloadQR('pt-qr-container','${user.id}')">
            ${ic('download','icon-sm')} Download
          </button>
          <button class="btn-primary" style="flex:1;justify-content:center;border-radius:8px"
                  onclick="window.printQR('pt-qr-container','${user.name}','${user.id}','${user.qrData}')">
            ${ic('printer','icon-sm')} Print
          </button>
        </div>
      </div>

      <!-- RIGHT: Instructions -->
      <div class="card" style="padding:32px">
        <div style="font-size:1.1rem;font-weight:700;color:#1C1C1C;margin-bottom:24px">How to use your QR Code</div>
        <div style="position:relative">
          ${steps.map(([title, desc], i) => `
          <div style="display:flex;gap:16px;${i < steps.length - 1 ? 'margin-bottom:20px' : ''}">
            <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
              <div style="width:28px;height:28px;border-radius:50%;background:#E8760A;color:#fff;font-size:.78rem;font-weight:700;display:flex;align-items:center;justify-content:center">${i+1}</div>
              ${i < steps.length - 1 ? `<div style="width:2px;flex:1;background:repeating-linear-gradient(to bottom,#E5E7EB 0,#E5E7EB 4px,transparent 4px,transparent 8px);margin-top:4px;min-height:24px"></div>` : ''}
            </div>
            <div style="padding-top:4px${i < steps.length - 1 ? ';padding-bottom:20px' : ''}">
              <div style="font-size:.95rem;font-weight:600;color:#1C1C1C;margin-bottom:4px">${title}</div>
              <div style="font-size:.85rem;color:#6B7280;line-height:1.5">${desc}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>

    </div>
  </div>
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  STAFF — SETTINGS
// ════════════════════════════════════════════════════════════════
function pageStaffSettings() {
  const { user } = st()
  const staffMember = staff.find(s => s.id === user?.id) || user || {}
  const staffName = staffMember.name || `${staffMember.firstName || ''} ${staffMember.lastName || ''}`.trim() || 'Staff'

  const pwField = (id, placeholder) => `
    <div style="position:relative">
      <input type="password" class="form-input" id="${id}" placeholder="${placeholder}" style="padding-right:40px">
      <button type="button" onclick="window.togglePwVisibility('${id}',this)"
              style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9CA3AF;padding:2px;display:flex;align-items:center">
        ${ic('eye','icon-sm')}
      </button>
    </div>`

  return `
  <style>
    @media (min-width: 1024px) { .staff-sett-col { display: grid !important; grid-template-columns: 55fr 45fr; gap: 20px; align-items: start; } }
  </style>
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your profile and account preferences</p>
    </div>
  </div>
  <div class="page-body">

    <!-- Profile Banner -->
    <div class="card" style="padding:28px 32px;margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">

        <!-- Clickable avatar -->
        <div style="position:relative;flex-shrink:0">
          <label for="st-photo-input" style="cursor:pointer;display:block;width:80px;height:80px;border-radius:50%;overflow:hidden;position:relative">
            <div id="st-avatar" style="width:80px;height:80px;border-radius:50%;background:#E8760A;color:#fff;font-size:1.5rem;font-weight:700;display:flex;align-items:center;justify-content:center;overflow:hidden">
              ${user.photoUrl
                ? `<img src="${user.photoUrl}" alt="Photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">`
                : initials(staffName)}
            </div>
            <div style="position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,0);display:flex;align-items:center;justify-content:center;transition:background .2s"
                 onmouseover="this.style.background='rgba(0,0,0,.45)'"
                 onmouseout="this.style.background='rgba(0,0,0,0)'"></div>
          </label>
          <label for="st-photo-input" style="position:absolute;bottom:0;right:0;width:24px;height:24px;border-radius:50%;background:#E8760A;border:2px solid #fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2)">
            ${ic('camera','icon-sm')}
          </label>
          <input type="file" id="st-photo-input" accept="image/*" style="display:none"
                 onchange="window.handlePhotoUpload(this,'st-avatar')">
        </div>

        <div style="flex:1;min-width:160px">
          <div style="font-size:1.2rem;font-weight:700;color:#1C1C1C">${staffName}</div>
          <div style="font-size:.85rem;color:#E8760A;font-weight:600;margin-top:3px">Staff &bull; ${staffMember.id || ''}</div>
          <div style="font-size:.82rem;color:#6B7280;margin-top:4px">${staffMember.email || ''}</div>
          <div style="font-size:.82rem;color:#6B7280">${staffMember.contact || ''}</div>
        </div>
        <label for="st-photo-input" class="btn-secondary" style="flex-shrink:0;cursor:pointer">
          ${ic('camera','icon-sm')} Change Photo
        </label>
      </div>
    </div>

    <div class="staff-sett-col" style="display:flex;flex-direction:column;gap:20px">

      <!-- LEFT: Personal Info -->
      <div class="card" style="padding:28px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
          <div style="color:#E8760A">${ic('user','icon-sm')}</div>
          <div style="font-size:1.05rem;font-weight:700;color:#1C1C1C">Personal Information</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input class="form-input" id="st-fname" value="${staffMember.firstName || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input class="form-input" id="st-lname" value="${staffMember.lastName || ''}">
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input class="form-input" type="email" id="st-email" value="${staffMember.email || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input class="form-input" id="st-phone" value="${staffMember.contact || ''}">
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:4px">
            <button class="btn-primary" onclick="window.saveUserProfile()">
              ${ic('check','icon-sm')} Save Changes
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Security -->
      <div class="card" style="padding:28px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <div style="color:#E8760A">${ic('shield','icon-sm')}</div>
          <div style="font-size:1.05rem;font-weight:700;color:#1C1C1C">Security</div>
        </div>
        <div style="font-size:.82rem;color:#9CA3AF;margin-bottom:20px">Change your account password</div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            ${pwField('st-curpw','Enter current password')}
          </div>
          <div class="form-group">
            <label class="form-label">New Password</label>
            ${pwField('st-newpw','Minimum 8 characters')}
          </div>
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            ${pwField('st-confpw','Repeat new password')}
            <div id="st-pw-err" style="color:#DC2626;font-size:.75rem;margin-top:5px;display:none">Passwords do not match.</div>
          </div>
          <div style="display:flex;align-items:flex-start;gap:6px;font-size:.78rem;color:#9CA3AF">
            ${ic('info','icon-sm')} Minimum 8 characters with at least one number and one letter.
          </div>
          <div style="display:flex;justify-content:flex-end">
            <button class="btn-primary"
                    onclick="window.validateSettingsPassword('st-newpw','st-confpw','st-pw-err','st-curpw')">
              ${ic('lock','icon-sm')} Update Password
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  PATIENT — PRESCRIPTIONS
// ════════════════════════════════════════════════════════════════
function pagePatientPrescriptions() {
  const { user } = st()
  const patient = patients.find(p => p.id === user.id)
  const rxList  = patient?.prescriptions || []
  const sorted  = [...rxList].sort((a,b) => b.date.localeCompare(a.date))

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">My Prescriptions</h1>
      <p class="page-subtitle">Your optical prescription history from Cana Optical Clinic</p>
    </div>
  </div>
  <div class="page-body">
    ${sorted.length ? sorted.map((rx, idx) => `
    <div class="card" style="margin-bottom:16px">
      <div class="card-header" style="flex-wrap:wrap;gap:8px">
        <div>
          <div class="card-title">Prescription #${rx.id}</div>
          <div style="font-size:.78rem;color:#9CA3AF;margin-top:2px">${fmtDate(rx.date)} &bull; ${rx.doctor}</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn-secondary" style="font-size:.8rem;padding:6px 14px"
                  onclick="window.navigate('patient-exam-history')">${ic('eye','icon-sm')} View Exam</button>
          <button class="btn-secondary" style="font-size:.8rem;padding:6px 14px"
                  onclick="window.printPrescriptionCard('rx-card-${idx}')">
            ${ic('printer','icon-sm')} Print
          </button>
        </div>
      </div>
      <div class="card-body" id="rx-card-${idx}">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
          <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:14px">
            <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#E8760A;margin-bottom:10px">OD — Right Eye</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center">
              <div>
                <div style="font-size:.65rem;color:#9CA3AF;margin-bottom:2px">SPH</div>
                <div style="font-family:monospace;font-size:.95rem;font-weight:700;color:#1C1C1C">${rx.od.sph}</div>
              </div>
              <div>
                <div style="font-size:.65rem;color:#9CA3AF;margin-bottom:2px">CYL</div>
                <div style="font-family:monospace;font-size:.95rem;font-weight:700;color:#1C1C1C">${rx.od.cyl}</div>
              </div>
              <div>
                <div style="font-size:.65rem;color:#9CA3AF;margin-bottom:2px">AXIS</div>
                <div style="font-family:monospace;font-size:.95rem;font-weight:700;color:#1C1C1C">${rx.od.axis || '—'}</div>
              </div>
            </div>
          </div>
          <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:14px">
            <div style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#3B82F6;margin-bottom:10px">OS — Left Eye</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center">
              <div>
                <div style="font-size:.65rem;color:#9CA3AF;margin-bottom:2px">SPH</div>
                <div style="font-family:monospace;font-size:.95rem;font-weight:700;color:#1C1C1C">${rx.os.sph}</div>
              </div>
              <div>
                <div style="font-size:.65rem;color:#9CA3AF;margin-bottom:2px">CYL</div>
                <div style="font-family:monospace;font-size:.95rem;font-weight:700;color:#1C1C1C">${rx.os.cyl}</div>
              </div>
              <div>
                <div style="font-size:.65rem;color:#9CA3AF;margin-bottom:2px">AXIS</div>
                <div style="font-family:monospace;font-size:.95rem;font-weight:700;color:#1C1C1C">${rx.os.axis || '—'}</div>
              </div>
            </div>
          </div>
        </div>
        <div style="font-size:.82rem;color:#374151"><strong>Lens Type:</strong> ${rx.lensType}</div>
        <div style="font-size:.8rem;color:#6B7280;margin-top:6px"><strong>Remarks:</strong> ${rx.remarks}</div>
      </div>
    </div>`).join('') : `
    <div class="table-empty" style="padding:56px">
      No prescriptions on file yet. Prescription records are created during optical examinations.<br>
      <button class="btn-primary" style="margin-top:16px"
              onclick="window.navigate('patient-appts',{filter:'request'})">Book an Appointment</button>
    </div>`}
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  PATIENT — NOTIFICATIONS
// ════════════════════════════════════════════════════════════════
function pagePatientNotifications() {
  const notifs = window._notifications || []

  const typeIcon  = { approved:'check-circle', cancelled:'x-circle', disapproved:'x-circle', rescheduled:'calendar', new_appointment:'calendar', reschedule_request:'alert-circle', welcome:'star', reminder:'clock', record:'eye', prescription:'file-text', info:'info' }
  const typeColor = { approved:'#059669', cancelled:'#EF4444', disapproved:'#EF4444', rescheduled:'#3B82F6', new_appointment:'#E8760A', reschedule_request:'#D97706', welcome:'#8B5CF6', reminder:'#D97706', record:'#E8760A', prescription:'#3B82F6', info:'#6B7280' }
  const typeBg    = { approved:'#ECFDF5', cancelled:'#FEF2F2', disapproved:'#FEF2F2', rescheduled:'#EFF6FF', new_appointment:'#FFF0DC', reschedule_request:'#FFF3CD', welcome:'#F5F3FF', reminder:'#FFF3CD', record:'#FFF0DC', prescription:'#EFF6FF', info:'#F3F4F6' }

  const unreadCount = notifs.filter(n => !n.isRead).length

  const emptyHtml = `
    <div style="text-align:center;padding:48px 24px;color:#9CA3AF">
      ${ic('bell','icon-lg')}
      <p style="margin:12px 0 4px;font-size:.9rem;font-weight:600;color:#6B7280">No notifications</p>
      <p style="font-size:.8rem;margin:0">You're all caught up!</p>
    </div>`

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Notifications</h1>
      <p class="page-subtitle">Stay updated on your appointments and records</p>
    </div>
    ${unreadCount ? `
    <button class="btn-secondary" onclick="window.markAllNotifsRead()">
      ${ic('check','icon-sm')} Mark All as Read
    </button>` : ''}
  </div>
  <div class="page-body">
    <div class="card">
      ${notifs.length ? notifs.map(n => `
      <div id="notif-${n.id}" onclick="window.markNotifRead(${n.id})"
           style="display:flex;align-items:flex-start;gap:14px;padding:16px 20px;border-bottom:1px solid #F3F4F6;cursor:pointer;transition:background .15s;${n.isRead ? '' : 'background:#FAFAF8'}"
           onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='${n.isRead ? 'transparent' : '#FAFAF8'}'">
        <div style="width:38px;height:38px;border-radius:50%;background:${typeBg[n.type]||'#F3F4F6'};display:flex;align-items:center;justify-content:center;color:${typeColor[n.type]||'#6B7280'};flex-shrink:0;margin-top:1px">
          ${ic(typeIcon[n.type] || 'info','icon-sm')}
        </div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
            <span style="font-size:.87rem;font-weight:${n.isRead ? '500' : '700'};color:#1C1C1C">${n.title}</span>
            ${n.isRead ? '' : `<span style="width:7px;height:7px;border-radius:50%;background:#E8760A;flex-shrink:0;display:inline-block"></span>`}
          </div>
          <p style="font-size:.8rem;color:#6B7280;margin:0;line-height:1.5">${n.body}</p>
          <div style="font-size:.72rem;color:#9CA3AF;margin-top:4px">${window._notifTimeAgo ? window._notifTimeAgo(n.createdAt) : n.createdAt}</div>
        </div>
      </div>`).join('') : emptyHtml}
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  PATIENT — SETTINGS
// ════════════════════════════════════════════════════════════════
function pagePatientSettings() {
  const { user } = st()
  const patient = patients.find(p => p.id === user.id)

  const regDate = patient?.registeredDate
    ? new Date(patient.registeredDate).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })
    : '—'
  const dob = patient?.dob
    ? new Date(patient.dob).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'

  const pwField = (id, placeholder) => `
    <div style="position:relative">
      <input type="password" class="form-input" id="${id}" placeholder="${placeholder}" style="padding-right:40px">
      <button type="button" onclick="window.togglePwVisibility('${id}',this)"
              style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9CA3AF;padding:2px;display:flex;align-items:center">
        ${ic('eye','icon-sm')}
      </button>
    </div>`

  return `
  <style>
    @media (min-width: 1024px) { .pt-sett-col { display: grid !important; grid-template-columns: 55fr 45fr; gap: 20px; align-items: start; } }
  </style>
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your account and personal information</p>
    </div>
  </div>
  <div class="page-body">

    <!-- Profile Banner -->
    <div class="card" style="padding:28px 32px;margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">

        <!-- Clickable avatar -->
        <div style="position:relative;flex-shrink:0">
          <label for="pt-photo-input" style="cursor:pointer;display:block;width:80px;height:80px;border-radius:50%;overflow:hidden;position:relative">
            <div id="pt-avatar" style="width:80px;height:80px;border-radius:50%;background:#E8760A;color:#fff;font-size:1.5rem;font-weight:700;display:flex;align-items:center;justify-content:center;overflow:hidden">
              ${user.photoUrl
                ? `<img src="${user.photoUrl}" alt="Photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block">`
                : initials(user.name)}
            </div>
            <!-- Camera overlay -->
            <div style="position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,0);display:flex;align-items:center;justify-content:center;transition:background .2s"
                 onmouseover="this.style.background='rgba(0,0,0,.45)'"
                 onmouseout="this.style.background='rgba(0,0,0,0)'">
              <span style="color:#fff;opacity:0;transition:opacity .2s;pointer-events:none"
                    onmouseover="this.style.opacity='1'"
                    onmouseout="this.style.opacity='0'">
                ${ic('camera','icon-sm')}
              </span>
            </div>
          </label>
          <!-- Camera badge -->
          <label for="pt-photo-input" style="position:absolute;bottom:0;right:0;width:24px;height:24px;border-radius:50%;background:#E8760A;border:2px solid #fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2)">
            ${ic('camera','icon-sm')}
          </label>
          <input type="file" id="pt-photo-input" accept="image/*" style="display:none"
                 onchange="window.handlePhotoUpload(this,'pt-avatar')">
        </div>

        <div style="flex:1;min-width:160px">
          <div style="font-size:1.2rem;font-weight:700;color:#1C1C1C">${user.name}</div>
          <div style="font-size:.85rem;color:#E8760A;font-weight:600;margin-top:3px">Patient ID: ${user.id}</div>
          <div style="font-size:.82rem;color:#6B7280;margin-top:4px">${patient?.email || user.email}</div>
          <div style="font-size:.82rem;color:#6B7280">${patient?.contact || ''}</div>
          <div style="font-size:.75rem;color:#9CA3AF;margin-top:5px">Member since ${regDate}</div>
        </div>
        <label for="pt-photo-input" class="btn-secondary" style="flex-shrink:0;cursor:pointer">
          ${ic('camera','icon-sm')} Change Photo
        </label>
      </div>
    </div>

    <!-- Two-column area -->
    <div class="pt-sett-col" style="display:flex;flex-direction:column;gap:20px">

      <!-- LEFT: Personal Information -->
      <div class="card" style="padding:28px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
          <div style="color:#E8760A">${ic('user','icon-sm')}</div>
          <div style="font-size:1.05rem;font-weight:700;color:#1C1C1C">Personal Information</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input type="text" class="form-input" value="${patient?.firstName || user.firstName}" id="sett-first">
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input type="text" class="form-input" value="${patient?.lastName || user.lastName}" id="sett-last">
            </div>
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label">Contact Number</label>
              <input type="text" class="form-input" value="${patient?.contact || ''}" id="sett-contact">
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" value="${patient?.email || user.email}" id="sett-email">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Complete Address</label>
            <input type="text" class="form-input" value="${patient?.address || ''}" id="sett-address">
          </div>
          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:4px;color:#9CA3AF">
                ${ic('lock','icon-sm')} Date of Birth
              </label>
              <input type="text" class="form-input" value="${dob}" disabled
                     style="background:#F9FAFB;color:#9CA3AF;cursor:not-allowed">
            </div>
            <div class="form-group">
              <label class="form-label" style="display:flex;align-items:center;gap:4px;color:#9CA3AF">
                ${ic('lock','icon-sm')} Gender
              </label>
              <input type="text" class="form-input" value="${patient?.gender || '—'}" disabled
                     style="background:#F9FAFB;color:#9CA3AF;cursor:not-allowed">
            </div>
          </div>
          <div style="background:#FFF7ED;border-left:3px solid #E8760A;border-radius:0 6px 6px 0;padding:10px 14px;display:flex;align-items:flex-start;gap:8px;font-size:.8rem;color:#92400E">
            ${ic('info','icon-sm')} Contact the clinic to update your date of birth, gender, or medical history.
          </div>
          <div style="display:flex;justify-content:flex-end">
            <button class="btn-primary" onclick="window.savePatientSettings()">
              ${ic('check','icon-sm')} Save Changes
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT column -->
      <div style="display:flex;flex-direction:column;gap:20px">

        <!-- Security Card -->
        <div class="card" style="padding:28px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <div style="color:#E8760A">${ic('shield','icon-sm')}</div>
            <div style="font-size:1.05rem;font-weight:700;color:#1C1C1C">Security</div>
          </div>
          <div style="font-size:.82rem;color:#9CA3AF;margin-bottom:20px">Change your account password</div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="form-group">
              <label class="form-label">Current Password</label>
              ${pwField('sett-curpw','Enter current password')}
            </div>
            <div class="form-group">
              <label class="form-label">New Password</label>
              ${pwField('sett-newpw','Minimum 8 characters')}
            </div>
            <div class="form-group">
              <label class="form-label">Confirm New Password</label>
              ${pwField('sett-confpw','Repeat new password')}
              <div id="sett-pw-err" style="color:#DC2626;font-size:.75rem;margin-top:5px;display:none">Passwords do not match.</div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:6px;font-size:.78rem;color:#9CA3AF">
              ${ic('info','icon-sm')} Minimum 8 characters with at least one number and one letter.
            </div>
            <div style="display:flex;justify-content:flex-end">
              <button class="btn-primary"
                      onclick="window.validateSettingsPassword('sett-newpw','sett-confpw','sett-pw-err')">
                ${ic('lock','icon-sm')} Update Password
              </button>
            </div>
          </div>
        </div>

        <!-- QR Code mini card -->
        <div class="card" style="padding:24px;text-align:center">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;justify-content:center">
            <div style="color:#E8760A">${ic('qr','icon-sm')}</div>
            <div style="font-size:1.05rem;font-weight:700;color:#1C1C1C">My QR Code</div>
          </div>
          <div id="sett-qr-container" style="display:inline-block;border-radius:8px;overflow:hidden;border:1px solid #E5E7EB">
            ${window.mockQRSvg(user.qrData, 120)}
          </div>
          <div style="font-size:.88rem;font-weight:700;color:#E8760A;margin-top:10px">${user.id}</div>
          <div style="display:flex;gap:8px;margin-top:12px;justify-content:center">
            <button class="btn-secondary" style="font-size:.78rem;padding:6px 14px"
                    onclick="window.downloadQR('sett-qr-container','${user.id}')">
              ${ic('download','icon-sm')} Download
            </button>
            <button class="btn-secondary" style="font-size:.78rem;padding:6px 14px"
                    onclick="window.printQR('sett-qr-container','${user.name}','${user.id}','${user.qrData}')">
              ${ic('printer','icon-sm')} Print
            </button>
          </div>
          <button class="btn-ghost" style="margin-top:12px;width:100%;justify-content:center;font-size:.78rem"
                  onclick="window.navigate('patient-qr')">
            ${ic('qr','icon-sm')} View Full QR Page
          </button>
        </div>

      </div>
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  COMING SOON — Generic placeholder for unbuilt pages
// ════════════════════════════════════════════════════════════════
function pageComingSoon() {
  const pageLabel = (() => {
    const labels = {
      'create-appointment':    'Create Appointment',
      'add-patient':           'Add Patient',
      'staff-settings':        'Settings',
      'doctor-appointments':   'My Appointments',
      'new-examination':       'New Examination',
      'exam-records':          'Examination Records',
      'doctor-schedule':       'My Schedule',
      'doctor-settings':       'Settings',
      'doctor-availability':   'Doctor Availability',
      'patient-prescriptions': 'Prescriptions',
      'patient-exam-history':  'Examination History',
      'patient-notifications': 'Notifications',
      'patient-settings':      'Settings'
    }
    return labels[window.state.page] || window.state.page || 'This Page'
  })()
  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">${pageLabel}</h1>
      <p class="page-subtitle">This section is under development.</p>
    </div>
  </div>
  <div class="page-body">
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:320px;gap:20px;text-align:center">
      <div style="width:80px;height:80px;border-radius:20px;background:#FFF0DC;display:flex;align-items:center;justify-content:center">
        ${ic('clock','icon-lg')}
      </div>
      <div>
        <h2 style="font-size:1.25rem;font-weight:700;color:#1C1C1C;margin-bottom:6px">${pageLabel} — Coming Soon</h2>
        <p style="font-size:0.875rem;color:#9CA3AF;max-width:360px;line-height:1.6">
          This page is being built. Full functionality will be available in the next development phase.
        </p>
      </div>
      <span style="padding:6px 16px;border-radius:20px;background:#F3F4F6;color:#6B7280;font-size:.78rem;font-weight:600">In Development</span>
    </div>
  </div>`
}

// ════════════════════════════════════════════════════════════════
//  PATIENT — DOCTOR AVAILABILITY
// ════════════════════════════════════════════════════════════════
function pagePatientDoctorAvail() {
  const now        = new Date()
  const baseYear   = now.getFullYear()
  const baseMonth  = now.getMonth()
  const todayDate  = now.getDate()
  const allDocs    = typeof getAvailableDoctors === 'function' ? getAvailableDoctors() : []
  const firstDoc   = allDocs[0]

  // Per-doctor calendar view state: { [docId]: { year, month } }
  window._patCalState = window._patCalState || {}

  window.state.afterRender = () => {
    // Reset all calendar states to current month on page load
    allDocs.forEach(d => { window._patCalState[d.id] = { year: baseYear, month: baseMonth } })
    if (firstDoc) window.switchPatDocDoctor(firstDoc.id)
  }

  // Build calendar cells for any given year/month
  function buildPatDocCalendar(doctor, viewYear, viewMonth) {
    const weekdays    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    const firstDay    = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMon   = new Date(viewYear, viewMonth + 1, 0).getDate()
    const isBaseMonth = viewYear === baseYear && viewMonth === baseMonth
    const maxBookDate = new Date(baseYear, baseMonth + 3, todayDate)
    const selDate     = window._patCalState?.[doctor.id]?.selectedDate || ''
    const phHolidays  = typeof getPHHolidays === 'function' ? getPHHolidays(viewYear) : {}

    const apptsByDate = {}
    appointments.filter(a => a.doctorName === doctor.name).forEach(a => {
      if (!apptsByDate[a.date]) apptsByDate[a.date] = []
      apptsByDate[a.date].push({ time: a.time, patientName: a.patientName, status: a.status })
    })

    let cells = ''
    for (let i = 0; i < firstDay; i++) cells += `<div class="cal-day other-month"></div>`
    for (let d = 1; d <= daysInMon; d++) {
      const dow         = new Date(viewYear, viewMonth, d).getDay()
      const dayName     = weekdays[dow]
      const isToday     = isBaseMonth && d === todayDate
      const isPast      = new Date(viewYear, viewMonth, d) < new Date(baseYear, baseMonth, todayDate)
      const isFar       = new Date(viewYear, viewMonth, d) > maxBookDate
      const dateStr     = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
      const dayAppts    = apptsByDate[dateStr] || []
      const avail       = (doctor.availableDays || []).includes(dayName)
      const isSel       = dateStr === selDate
      const isHoliday   = !!phHolidays[dateStr]
      const holidayName = phHolidays[dateStr] || ''
      const daysOut     = Math.round((new Date(viewYear, viewMonth, d) - new Date(baseYear, baseMonth, todayDate)) / 86400000)
      const tooSoon     = daysOut >= 0 && daysOut < minAdvanceDays()

      let cls = 'cal-day'
      if (isSel)                          cls += ' today'
      else if (isToday)                   cls += ' today'
      else if (isHoliday && !isPast)      cls += ' cal-holiday'
      else if (isHoliday && isPast)       cls += ' blocked'
      else if (avail)                     cls += ' avail'
      else                                cls += ' blocked'

      const dotCls    = dayAppts.length ? ' has-appts' : ''
      const dimStyle  = (isPast || isFar || (tooSoon && !isToday)) ? 'opacity:.35;pointer-events:none;' : ''
      const selStyle  = isSel && !isToday ? 'outline:3px solid #E8760A;outline-offset:1px;' : ''
      const styleAttr = (dimStyle || selStyle) ? ` style="${dimStyle}${selStyle}"` : ''
      const titleAttr = tooSoon   ? `title="${minAdvanceTooltip()}"` :
                        isHoliday ? `title="Clinic closed: ${holidayName}"` : ''
      const hoverEvt  = !tooSoon && !isPast && !isFar && !isHoliday && dayAppts.length
        ? `onmouseenter="window.showCalTip(this,'${JSON.stringify(dayAppts).replace(/'/g,'&#39;').replace(/"/g,'&quot;')}')" onmouseleave="window.hideCalTip()"`
        : ''
      const clickEvt  = avail && !tooSoon && !isPast && !isFar && !isHoliday
        ? `onclick="window.patCalSelectDate('${doctor.id}','${dateStr}')"`
        : ''

      const inner = isHoliday && !isPast
        ? `${d}<span class="cal-holiday-lbl">${holidayName}</span>`
        : String(d)
      cells += `<div class="${cls}${dotCls}"${styleAttr} ${hoverEvt} ${clickEvt} ${titleAttr}>${inner}</div>`
    }
    return cells
  }

  // Re-render just the calendar grid + nav when navigating months (delta=0 = re-render in place)
  window.patCalNavMonth = function(docId, delta) {
    const doc = allDocs.find(d => d.id === docId)
    if (!doc) return
    if (!window._patCalState[docId]) window._patCalState[docId] = { year: baseYear, month: baseMonth }

    let { year, month, selectedDate } = window._patCalState[docId]
    month += delta
    if (month > 11) { year++; month = 0 }
    if (month < 0)  { year--; month = 11 }

    // Clamp: no earlier than baseMonth, no later than baseMonth+2
    const offset = (year - baseYear) * 12 + (month - baseMonth)
    if (delta !== 0 && (offset < 0 || offset > 2)) return

    // Preserve selectedDate when updating state
    window._patCalState[docId] = { year, month, selectedDate: selectedDate || '' }

    // Re-render nav header
    const navEl = document.getElementById(`pat-cal-nav-${docId}`)
    if (navEl) navEl.innerHTML = buildCalNav(doc, year, month)

    // Re-render grid
    const gridEl = document.getElementById(`pat-cal-grid-${docId}`)
    if (gridEl) gridEl.innerHTML = buildPatDocCalendar(doc, year, month)
  }

  // Select a date on the availability calendar — highlights cell, shows booking popover
  window.patCalSelectDate = function(docId, dateStr) {
    if (!window._patCalState[docId]) window._patCalState[docId] = { year: baseYear, month: baseMonth }
    window._patCalState[docId].selectedDate = dateStr

    // Re-render grid so selected cell highlights
    window.patCalNavMonth(docId, 0)

    // Show booking popover
    const doc      = allDocs.find(d => d.id === docId)
    if (!doc) return
    const dt       = new Date(dateStr + 'T00:00:00')
    const dayFull  = dt.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })
    const gridEl   = document.getElementById('pat-cal-grid-' + docId)
    if (!gridEl) return

    // Remove any existing popover
    const existing = document.getElementById('pat-cal-popover-' + docId)
    if (existing) existing.remove()

    const pop = document.createElement('div')
    pop.id = 'pat-cal-popover-' + docId
    pop.style.cssText = 'position:relative;margin-top:10px;background:#fff;border:1.5px solid #E8760A;border-radius:10px;padding:14px 16px;box-shadow:0 4px 16px rgba(0,0,0,.1)'
    pop.innerHTML = `
      <button onclick="document.getElementById('pat-cal-popover-${docId}').remove();window._patCalState['${docId}'].selectedDate='';window.patCalNavMonth('${docId}',0)"
              style="position:absolute;top:8px;right:10px;background:none;border:none;cursor:pointer;color:#9CA3AF;font-size:1rem;line-height:1">✕</button>
      <div style="font-size:.72rem;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Selected Date</div>
      <div style="font-size:.88rem;font-weight:700;color:#1C1C1C;margin-bottom:2px">${dayFull}</div>
      <div style="font-size:.78rem;color:#6B7280;margin-bottom:12px">${doc.name} &nbsp;·&nbsp; 8:00 AM – 5:00 PM</div>
      <button onclick="window.patCalBookAppt('${docId}')"
              style="width:100%;background:#E8760A;color:#fff;border:none;border-radius:8px;padding:9px 0;font-size:.85rem;font-weight:600;cursor:pointer;font-family:inherit;transition:background .15s"
              onmouseover="this.style.background='#C4620A'" onmouseout="this.style.background='#E8760A'">
        Book This Date →
      </button>`
    gridEl.insertAdjacentElement('afterend', pop)
  }

  // Navigate to the appointment wizard with doctor + optional date pre-filled
  window.patCalBookAppt = function(docId) {
    const doc   = allDocs.find(d => d.id === docId)
    if (!doc) return
    const state = window._patCalState?.[docId]
    window._patCalPrefill = {
      doctorId:   String(doc.id),
      doctorName: doc.name,
      doctorSpec: doc.specialization,
      doctorDays: doc.availableDays || [],
      date:       state?.selectedDate || ''
    }
    window.navigate('patient-appts', { filter: 'request' })
  }

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

  function buildCalNav(doctor, viewYear, viewMonth) {
    const offset    = (viewYear - baseYear) * 12 + (viewMonth - baseMonth)
    const canPrev   = offset > 0
    const canNext   = offset < 2
    const label     = MONTH_NAMES[viewMonth] + ' ' + viewYear
    const btnBase   = 'background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:6px;display:flex;align-items:center;justify-content:center;transition:background .15s'
    const btnActive = 'color:#374151'
    const btnDim    = 'color:#D1D5DB;cursor:default'
    return `
      <button onclick="window.patCalNavMonth('${doctor.id}',-1)" style="${btnBase};${canPrev ? btnActive : btnDim}"
              ${!canPrev ? 'disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span style="font-size:.85rem;font-weight:600;color:#1C1C1C;min-width:130px;text-align:center">${label}</span>
      <button onclick="window.patCalNavMonth('${doctor.id}',1)" style="${btnBase};${canNext ? btnActive : btnDim}"
              ${!canNext ? 'disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
      </button>`
  }

  function buildPatDocPanel(doctor) {
    const daysLabel  = (doctor.availableDays || []).join(', ')
    const viewYear   = baseYear
    const viewMonth  = baseMonth
    const calCells   = buildPatDocCalendar(doctor, viewYear, viewMonth)

    // Compute next available date (skip today — must book 1 day in advance)
    const weekdayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    let nextAvail = null
    for (let offset = 1; offset <= 90; offset++) {
      const d = new Date(baseYear, baseMonth, todayDate + offset)
      if ((doctor.availableDays || []).includes(weekdayNames[d.getDay()])) {
        nextAvail = d
        break
      }
    }
    const nextAvailStr = nextAvail
      ? nextAvail.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
        + ' (' + weekdayNames[nextAvail.getDay()].slice(0,3) + ')'
      : '—'

    return `
    <div id="pat-doc-panel-${doctor.id}" class="pat-doc-panel" style="display:none">
      <div class="card">

        <!-- Doctor header row -->
        <div class="card-body" style="display:flex;align-items:center;gap:16px;padding-bottom:14px;flex-wrap:wrap">
          <div class="profile-avatar-lg" style="width:52px;height:52px;font-size:1.1rem;flex-shrink:0">${initials(doctor.name)}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:1rem;font-weight:700;color:#1C1C1C">${doctor.name}</div>
            <div style="font-size:.8rem;color:#6B7280;margin-top:2px">${doctor.specialization} &nbsp;·&nbsp; ${daysLabel}</div>
          </div>
          <button class="btn-primary" style="flex-shrink:0;font-size:.82rem"
                  onclick="window.patCalBookAppt('${doctor.id}')">
            ${ic('plus','icon-sm')} Book Appointment
          </button>
        </div>

        <div style="height:1px;background:#F3F4F6;margin:0 20px"></div>

        <!-- Two-column: calendar + details -->
        <div class="card-body" style="display:grid;grid-template-columns:1.4fr 1fr;gap:24px;align-items:start">

          <!-- Left: navigable calendar -->
          <div>
            <!-- Month nav -->
            <div id="pat-cal-nav-${doctor.id}" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
              ${buildCalNav(doctor, viewYear, viewMonth)}
            </div>
            <div class="calendar-grid" style="margin-bottom:4px">
              ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="cal-day-header">${d}</div>`).join('')}
            </div>
            <div id="pat-cal-grid-${doctor.id}" class="calendar-grid">${calCells}</div>
            <div style="display:flex;gap:14px;margin-top:12px;flex-wrap:wrap">
              <div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:#6B7280">
                <div style="width:10px;height:10px;background:#E8760A;border-radius:50%"></div>Today
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:#6B7280">
                <div style="width:10px;height:10px;background:#ECFDF5;border:1.5px solid #10B981;border-radius:2px"></div>Available
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:#6B7280">
                <div style="width:10px;height:10px;background:#F3F4F6;border-radius:2px"></div>Unavailable
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:.72rem;color:#6B7280">
                <div style="width:10px;height:10px;background:#FFF1F2;border:1px solid #fda4af;border-radius:2px"></div>PH Holiday
              </div>
            </div>
          </div>

          <!-- Right: schedule details -->
          <div style="display:flex;flex-direction:column;gap:12px">

            <div style="background:#F9FAFB;border-radius:10px;padding:14px 16px">
              <div style="font-size:.68rem;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Consultation Hours</div>
              <div style="display:flex;flex-direction:column;gap:7px">
                <div style="display:flex;align-items:center;gap:8px">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E8760A" stroke-width="2" width="13" height="13" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span style="font-size:.8rem;color:#374151">Morning: 8:00 AM – 12:00 PM</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E8760A" stroke-width="2" width="13" height="13" style="flex-shrink:0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span style="font-size:.8rem;color:#374151">Afternoon: 1:00 PM – 5:00 PM</span>
                </div>
              </div>
            </div>

            <div style="background:#F9FAFB;border-radius:10px;padding:14px 16px">
              <div style="font-size:.68rem;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Available Days</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px">
                ${(doctor.availableDays || []).map(d=>`<span style="background:#FFF0DC;color:#E8760A;font-size:.72rem;font-weight:600;padding:3px 10px;border-radius:20px">${d}</span>`).join('')}
              </div>
            </div>

            <div style="background:#F9FAFB;border-radius:10px;padding:14px 16px">
              <div style="font-size:.68rem;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Next Available Slot</div>
              <div style="display:flex;align-items:center;gap:8px">
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" width="14" height="14" style="flex-shrink:0"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span style="font-size:.82rem;color:#166534;font-weight:600">${nextAvailStr}</span>
              </div>
              <div style="font-size:.75rem;color:#6B7280;margin-top:4px">Starting 8:00 AM</div>
            </div>

            <div style="background:#eff6ff;border-left:3px solid #3b82f6;border-radius:8px;padding:10px 14px;display:flex;align-items:flex-start;gap:8px">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" width="14" height="14" style="flex-shrink:0;margin-top:1px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>
              <span style="font-size:.75rem;color:#1e40af;line-height:1.5">Appointments must be booked at least 1 day in advance. Maximum booking window is 3 months.</span>
            </div>

          </div>
        </div>

      </div>
    </div>`
  }

  const allPanels = allDocs.map(d => buildPatDocPanel(d)).join('')

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">Doctor Availability</h1>
      <p class="page-subtitle">View schedules and book an appointment with your preferred doctor</p>
    </div>
  </div>
  <div class="page-body">

    <!-- Doctor cards -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-body" style="padding:16px">
        <div id="pat-doc-tabs" style="display:flex;flex-wrap:wrap;gap:10px;align-items:stretch">
          ${allDocs.map(d => `
          <button class="doctor-sel-card pat-doc-tab" data-doc="${d.id}"
                  onclick="window.switchPatDocDoctor('${d.id}')">
            <div class="doc-card-avatar" ${d.photoUrl ? 'style="overflow:hidden;padding:0"' : ''}>
              ${d.photoUrl ? `<img src="${d.photoUrl}" alt="${d.name}" style="width:100%;height:100%;object-fit:cover;object-position:top;border-radius:50%;display:block">` : initials(d.name)}
            </div>
            <div>
              <div class="doc-card-name">${d.name.replace('Dr. ','')}</div>
              <div class="doc-card-spec">${d.specialization}</div>
              ${d.availableDays?.length ? `<div style="font-size:.68rem;color:#E8760A;margin-top:3px;font-weight:600">${d.availableDays.join(', ')}</div>` : ''}
            </div>
          </button>`).join('')}
        </div>
      </div>
    </div>

    <!-- Per-doctor panels -->
    <div id="pat-doc-panels">${allPanels}</div>

  </div>`
}

// ════════════════════════════════════════════════════════════════
//  QR SCANNER PAGE
// ════════════════════════════════════════════════════════════════
function pageScanQR() {
  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">QR Scanner</h1>
      <p class="page-subtitle">Scan a patient QR code for instant record lookup.</p>
    </div>
  </div>
  <div class="page-body">
    <div style="display:flex;flex-direction:column;align-items:center;gap:24px;max-width:480px;margin:0 auto">
      <div class="card" style="width:100%">
        <div class="card-header"><div class="card-title">Scan Patient QR Code</div></div>
        <div class="card-body" style="display:flex;flex-direction:column;align-items:center;gap:20px;padding:32px 24px">
          <div style="width:200px;height:200px;border:2px dashed #E5E7EB;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:#F9FAFB;color:#9CA3AF">
            ${ic('qr','icon-lg')}
            <span style="font-size:.78rem">Camera preview</span>
          </div>
          <p style="font-size:.82rem;color:#6B7280;text-align:center;line-height:1.6">
            Point the camera at a patient's QR code to automatically pull up their record.
          </p>
          <button class="btn-primary" onclick="window.openQRScanner && window.openQRScanner()">
            ${ic('qr','icon-sm')} Open Camera Scanner
          </button>
        </div>
      </div>
      <div class="card" style="width:100%">
        <div class="card-header"><div class="card-title">Manual Lookup</div></div>
        <div class="card-body" style="display:flex;flex-direction:column;gap:14px">
          <div class="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-sm" style="color:#9CA3AF;flex-shrink:0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" class="search-input" id="qr-manual-input" placeholder="Enter Patient ID (e.g. P001)">
          </div>
          <button class="btn-secondary" style="width:100%" onclick="
            const v = document.getElementById('qr-manual-input').value.trim();
            if(v) window.navigate('patient-view',{patientId:v,patientName:'Patient '+v});
            else window.toast('Enter a patient ID.','error')">Look Up Patient</button>
        </div>
      </div>
    </div>
  </div>`
}
