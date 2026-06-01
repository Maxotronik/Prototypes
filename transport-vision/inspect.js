(function () {
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
    }
    .inspect-fab { opacity: 0.6; }
    .inspect-fab:hover { background: #333436; opacity: 1; }
    .inspect-fab.active { background: #004e7d; opacity: 1; }
    @media (max-width: 900px) { .inspect-fab { right: 16px; padding: 8px 12px; font-size: 0; gap: 0; } .inspect-fab svg { width: 18px; height: 18px; } }
    .inspect-fab svg { width: 15px; height: 15px; flex-shrink: 0; }

    .inspect-ring {
      position: fixed;
      pointer-events: none;
      z-index: 99997;
      border: 2px solid #004e7d;
      border-radius: 3px;
      background: rgba(0, 78, 125, 0.07);
      box-sizing: border-box;
      display: none;
    }
    .inspect-ring.visible { display: block; }

    .inspect-ring-label {
      position: absolute;
      top: -22px;
      left: 0;
      background: #004e7d;
      color: white;
      font-family: 'Inter', -apple-system, monospace;
      font-size: 11px;
      font-weight: 500;
      padding: 2px 7px;
      border-radius: 4px;
      white-space: nowrap;
      line-height: 18px;
    }

    .inspect-toast {
      position: fixed;
      bottom: 68px;
      right: 20px;
      background: #1c1d1f;
      color: white;
      padding: 8px 14px;
      border-radius: 8px;
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 13px;
      font-weight: 500;
      z-index: 99999;
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.15s, transform 0.15s;
      pointer-events: none;
      white-space: nowrap;
    }
    .inspect-toast.show { opacity: 1; transform: translateY(0); }

    body.inspect-mode,
    body.inspect-mode * { cursor: crosshair !important; }
  `;

  const CURSOR_ICON = `<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 2.5L7.2 13.5L9.4 9.4L13.5 7.2L2.5 2.5Z" fill="white"/>
    <path d="M9.4 9.4L13 13" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;

  let active = false;
  let fab, ring, ringLabel, toast, toastTimer;

  function init() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    fab = document.createElement('button');
    fab.className = 'inspect-fab';
    fab.innerHTML = CURSOR_ICON + ' Inspect';
    fab.addEventListener('click', toggle);
    document.body.appendChild(fab);

    ring = document.createElement('div');
    ring.className = 'inspect-ring';
    ringLabel = document.createElement('span');
    ringLabel.className = 'inspect-ring-label';
    ring.appendChild(ringLabel);
    document.body.appendChild(ring);

    toast = document.createElement('div');
    toast.className = 'inspect-toast';
    document.body.appendChild(toast);

    document.addEventListener('mouseover', onHover, true);
    document.addEventListener('mouseout', onOut, true);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && active) deactivate(); });
  }

  function toggle() {
    active ? deactivate() : activate();
  }

  function activate() {
    active = true;
    document.body.classList.add('inspect-mode');
    fab.classList.add('active');
    fab.innerHTML = CURSOR_ICON + ' Exit';
  }

  function deactivate() {
    active = false;
    document.body.classList.remove('inspect-mode');
    fab.classList.remove('active');
    fab.innerHTML = CURSOR_ICON + ' Inspect';
    ring.classList.remove('visible');
  }

  function isOwn(el) {
    return fab.contains(el) || ring.contains(el) || toast.contains(el);
  }

  function getName(el) {
    const classes = [...el.classList].filter(Boolean);
    if (classes.length) return '.' + classes.join('.');
    if (el.id) return '#' + el.id;
    return el.tagName.toLowerCase();
  }

  function onHover(e) {
    if (!active || isOwn(e.target)) return;
    const r = e.target.getBoundingClientRect();
    ring.style.left   = r.left + 'px';
    ring.style.top    = r.top + 'px';
    ring.style.width  = r.width + 'px';
    ring.style.height = r.height + 'px';
    ringLabel.textContent = getName(e.target);
    ring.classList.add('visible');
  }

  function onOut(e) {
    if (!active || isOwn(e.target)) return;
    ring.classList.remove('visible');
  }

  function onClick(e) {
    if (!active || isOwn(e.target)) return;
    e.preventDefault();
    e.stopPropagation();

    const name = getName(e.target);
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
})();
