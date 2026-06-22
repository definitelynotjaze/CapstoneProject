;(function () {
  'use strict'

  // Per-tbody state: { key, dir }
  var _sort = {}

  // ── Inject CSS once ───────────────────────────────────────────────
  var _styled = false
  function ensureCSS() {
    if (_styled) return
    _styled = true
    var s = document.createElement('style')
    s.textContent =
      '.th-sortable{cursor:pointer;user-select:none;white-space:nowrap}' +
      '.th-sortable:hover{color:#E8891C}' +
      '.th-sortable .sort-icon{display:inline-flex;margin-left:4px;opacity:.4;vertical-align:-2px}' +
      '.th-sortable.th-sort-asc .sort-icon,.th-sortable.th-sort-desc .sort-icon{opacity:1;color:#E8891C}' +
      '.th-sortable.th-sort-desc .sort-icon{transform:rotate(180deg)}'
    document.head.appendChild(s)
  }

  var ICON = '<svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><polyline points="6 9 12 15 18 9"/></svg>'

  // ── Public: init ──────────────────────────────────────────────────
  // Call from afterRender, after the table is in the DOM. Wires up any
  // <th data-sort-key="..." data-sort-type="text|date|number"> headers
  // found in the same table as the given tbody.
  function initSortable(tbodyId) {
    ensureCSS()
    var tbody = document.getElementById(tbodyId)
    if (!tbody) return
    var table = tbody.closest('table')
    if (!table) return

    var st = _sort[tbodyId]

    table.querySelectorAll('th[data-sort-key]').forEach(function (th) {
      th.classList.add('th-sortable')
      if (!th.querySelector('.sort-icon')) th.insertAdjacentHTML('beforeend', ICON)
      th.onclick = function () { _toggleSort(tbodyId, th) }
      th.classList.remove('th-sort-asc', 'th-sort-desc')
      if (st && st.key === th.getAttribute('data-sort-key')) {
        th.classList.add(st.dir === 1 ? 'th-sort-asc' : 'th-sort-desc')
      }
    })

    // Re-apply a previously chosen sort (e.g. after the table re-rendered)
    if (st) _applySort(tbodyId, st.key, st.type, st.dir)
  }

  function _toggleSort(tbodyId, th) {
    var key  = th.getAttribute('data-sort-key')
    var type = th.getAttribute('data-sort-type') || 'text'
    var prev = _sort[tbodyId]
    var dir  = (prev && prev.key === key) ? -prev.dir : 1

    var table = th.closest('table')
    table.querySelectorAll('th[data-sort-key]').forEach(function (h) {
      h.classList.remove('th-sort-asc', 'th-sort-desc')
    })
    th.classList.add(dir === 1 ? 'th-sort-asc' : 'th-sort-desc')

    _sort[tbodyId] = { key: key, type: type, dir: dir }
    _applySort(tbodyId, key, type, dir)
  }

  function _applySort(tbodyId, key, type, dir) {
    var tbody = document.getElementById(tbodyId)
    if (!tbody) return
    var rows = Array.from(tbody.querySelectorAll('tr[data-search]'))
    rows.sort(function (a, b) {
      var av = _val(a, key, type), bv = _val(b, key, type)
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
    rows.forEach(function (r) { tbody.appendChild(r) })

    // Let pagination recompute which rows show on the current page
    if (window.refreshPagination) window.refreshPagination(tbodyId)
  }

  function _val(row, key, type) {
    var raw = row.getAttribute('data-sort-' + key) || ''
    if (type === 'number') return parseFloat(raw) || 0
    if (type === 'date')   return raw ? (Date.parse(raw) || 0) : 0
    return raw.toLowerCase()
  }

  window.initSortable = initSortable
})()
