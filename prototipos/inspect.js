(function () {
  const inIframe = window.self !== window.top;
  const CSS = `
    .inspect-fab {
      position: fixed;
      bottom: 80px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      background: #1c1d1f;
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 16px 8px 12px;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      z-index: 99998;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      user-select: none;
      transition: background 0.1s;
      opacity: 0.6;
    }
    .inspect-fab:hover { background: #333436; opacity: 1; }
    .inspect-fab.active { background: #004e7d; opacity: 1; }
    @media (max-width: 900px) { .inspect-fab { right: 16px; padding: 8px 12px; font-size: 0; gap: 0; } .inspect-fab svg { width: 18px; height: 18px; } }
    .inspect-fab svg { width: 15px; height: 15px; flex-shrink: 0; }

    /* Highlight overlay — sits on top of the hovered element */
    .inspect-overlay {
      position: fixed;
      pointer-events: none;
      z-index: 99997;
      box-sizing: border-box;
      display: none;
      border: 2px solid #f26522;
      border-radius: 3px;
      background: rgba(242, 101, 34, 0.12);
    }
    .inspect-overlay.visible { display: block; }

    /* Label chip above the highlight */
    .inspect-label {
      position: absolute;
      bottom: calc(100% + 4px);
      left: 0;
      background: #f26522;
      color: white;
      font-family: 'Inter', -apple-system, monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 4px;
      white-space: nowrap;
      line-height: 18px;
      pointer-events: none;
    }

    /* Toast */
    .inspect-toast {
      position: fixed;
      bottom: 52px;
      left: 50%;
      transform: translateX(-50%) translateY(6px);
      background: #1c1d1f;
      color: white;
      padding: 7px 14px;
      border-radius: 8px;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 12px;
      font-weight: 500;
      z-index: 99999;
      opacity: 0;
      transition: opacity 0.15s, transform 0.15s;
      pointer-events: none;
      white-space: nowrap;
    }
    .inspect-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

    body.inspect-mode,
    body.inspect-mode * { cursor: crosshair !important; }
  `;

  const CURSOR_ICON = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 2.5L7.2 13.5L9.4 9.4L13.5 7.2L2.5 2.5Z" fill="white"/>
    <path d="M9.4 9.4L13 13" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;

  let active = false;
  let fab = null;
  let overlay, label, toast, toastTimer;

  function init() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Inside the mobile device iframe: no FAB, no PSB — controlled via postMessage
    if (!inIframe) {
      if (window.ProtoSettings) {
        document.addEventListener('proto-inspect-click', toggle);
      } else {
        fab = document.createElement('button');
        fab.className = 'inspect-fab proto-ui';
        fab.innerHTML = CURSOR_ICON + ' Inspect';
        fab.addEventListener('click', toggle);
        document.body.appendChild(fab);
      }
    }

    // Highlight overlay
    overlay = document.createElement('div');
    overlay.className = 'inspect-overlay';
    label = document.createElement('span');
    label.className = 'inspect-label';
    overlay.appendChild(label);
    document.body.appendChild(overlay);

    // Toast
    toast = document.createElement('div');
    toast.className = 'inspect-toast';
    document.body.appendChild(toast);

    document.addEventListener('mouseover', onHover, true);
    document.addEventListener('mouseout', onOut, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && active) deactivate(); });

    // When running inside the mobile device iframe, respond to PSB postMessages
    if (window.self !== window.top) {
      window.addEventListener('message', e => {
        if (e.data && e.data.type === 'ps-inspect-toggle') toggle();
        if (e.data && e.data.type === 'ps-inspect') e.data.active ? activate() : deactivate();
      });
    }
  }

  function toggle() { active ? deactivate() : activate(); }

  function activate() {
    active = true;
    document.body.classList.add('inspect-mode');
    if (fab) { fab.classList.add('active'); fab.innerHTML = CURSOR_ICON + ' Exit'; }
    document.dispatchEvent(new CustomEvent('inspectToggle', { detail: { active: true } }));
  }

  function deactivate() {
    active = false;
    document.body.classList.remove('inspect-mode');
    if (fab) { fab.classList.remove('active'); fab.innerHTML = CURSOR_ICON + ' Inspect'; }
    document.dispatchEvent(new CustomEvent('inspectToggle', { detail: { active: false } }));
    overlay.classList.remove('visible');
  }

  function isOwn(el) {
    return overlay.contains(el) || toast.contains(el) || (fab && fab.contains(el));
  }

  // Returns "#id" if element has id, else ".class.list", else tag
  function getId(el) {
    if (el.id) return '#' + el.id;
    const classes = [...el.classList].filter(c => c !== 'inspect-mode');
    if (classes.length) return '.' + classes.join('.');
    return el.tagName.toLowerCase();
  }

  function onHover(e) {
    if (!active || isOwn(e.target)) return;
    const r = e.target.getBoundingClientRect();
    overlay.style.left   = r.left + 'px';
    overlay.style.top    = r.top + 'px';
    overlay.style.width  = r.width + 'px';
    overlay.style.height = r.height + 'px';

    const name = getId(e.target);
    label.textContent = name;

    // Flip label below if not enough space above
    const labelH = 22;
    if (r.top < labelH + 6) {
      label.style.bottom = 'auto';
      label.style.top = 'calc(100% + 4px)';
    } else {
      label.style.top = 'auto';
      label.style.bottom = 'calc(100% + 4px)';
    }

    overlay.classList.add('visible');
  }

  function onOut(e) {
    if (!active || isOwn(e.target)) return;
    overlay.classList.remove('visible');
  }

  function onClick(e) {
    if (!active || isOwn(e.target)) return;
    e.preventDefault();
    e.stopPropagation();

    const name = getId(e.target);
    navigator.clipboard.writeText(name)
      .then(() => showToast('Copied ' + name))
      .catch(() => showToast(name));

    deactivate();
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  if (location.hostname === 'maxotronik.github.io') {
    const hide = () => document.querySelectorAll('.proto-ui').forEach(el => el.style.display = 'none');
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hide);
    else hide();
  }
})();
