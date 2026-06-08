/**
 * ProtoSettings — universal prototype control bar
 * Loaded via <script src="proto-settings.js"></script>
 * View (Web/Mobile) and Inspect are built-in — call ProtoSettings.init() or
 * let DOMContentLoaded do it automatically.
 * Use ProtoSettings.addGroup(...) for prototype-specific controls.
 * Visible everywhere including maxotronik.github.io.
 */
(function () {
  // Don't render the bar when loaded inside the mobile device iframe
  if (window.self !== window.top) return;

  /* ── CSS ──────────────────────────────────────────────────────────────── */
  const css = `
    #proto-settings-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 36px;
      background: #1c1d1f;
      display: flex;
      align-items: center;
      z-index: 99995;
      font-family: -apple-system, 'Inter', sans-serif;
      font-size: 11px;
      overflow: hidden;
      transition: height 180ms cubic-bezier(0.23,1,0.32,1);
      user-select: none;
    }
    #proto-settings-bar.collapsed { height: 0; }

    #proto-settings-inner {
      display: flex;
      align-items: center;
      height: 36px;
      width: 100%;
      overflow: hidden;
      padding: 0 8px 0 12px;
    }

    .ps-brand {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #55575c;
      text-transform: uppercase;
      white-space: nowrap;
      padding-right: 10px;
      flex-shrink: 0;
    }

    .ps-divider {
      width: 1px;
      height: 16px;
      background: #2e2f31;
      margin: 0 10px;
      flex-shrink: 0;
    }

    .ps-group-label {
      font-size: 10px;
      font-weight: 600;
      color: #55575c;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      margin-right: 6px;
      flex-shrink: 0;
    }

    .ps-seg {
      display: flex;
      align-items: center;
      background: #2a2b2d;
      border-radius: 6px;
      padding: 2px;
      gap: 1px;
      flex-shrink: 0;
    }
    .ps-seg-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      color: #71747a;
      font-family: inherit;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 120ms ease, color 120ms ease;
      line-height: 1;
    }
    .ps-seg-btn:hover { color: #c8cacc; }
    .ps-seg-btn.active {
      background: #3a3b3d;
      color: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }
    .ps-seg-btn .ps-icon {
      font-family: 'Material Symbols Outlined';
      font-size: 13px;
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
      line-height: 1;
    }

    .ps-toggle-btn {
      background: none;
      border: none;
      color: #71747a;
      font-family: inherit;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 120ms ease, color 120ms ease;
    }
    .ps-toggle-btn.active { background: #f26522; color: #fff; }
    .ps-toggle-btn:not(.active):hover { color: #c8cacc; background: #2a2b2d; }

    .ps-inspect-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      color: #71747a;
      font-family: inherit;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
      transition: background 120ms ease, color 120ms ease;
      flex-shrink: 0;
    }
    .ps-inspect-btn:hover { color: #c8cacc; background: #2a2b2d; }
    .ps-inspect-btn.active { background: #004e7d; color: #fff; }
    .ps-inspect-btn .ps-icon { font-family: 'Material Symbols Outlined'; font-size: 13px; line-height: 1; }

    #ps-end {
      flex: 1;
    }
    #ps-collapse-btn {
      background: none;
      border: none;
      color: #55575c;
      cursor: pointer;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      transition: color 120ms ease;
    }
    #ps-collapse-btn:hover { color: #c8cacc; }
    #ps-collapse-btn .ps-icon { font-family: 'Material Symbols Outlined'; font-size: 14px; line-height: 1; }

    #proto-settings-tab {
      position: fixed;
      top: 0; right: 24px;
      background: #1c1d1f;
      color: #55575c;
      border: none;
      border-radius: 0 0 6px 6px;
      padding: 2px 10px 4px;
      font-family: inherit;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: pointer;
      z-index: 99994;
      display: none;
      transition: color 120ms ease;
    }
    #proto-settings-tab:hover { color: #c8cacc; }
    #proto-settings-tab.visible { display: block; }

    body.proto-settings-open { padding-top: 36px; }

    /* ── Mobile device frame ──────────────────────────────────────────────── */
    #ps-device-shell {
      display: none;
      position: fixed;
      top: 36px; left: 0; right: 0; bottom: 0;
      background: #111;
      align-items: center;
      justify-content: center;
      z-index: 99990;
    }
    body.ps-mobile-view #ps-device-shell { display: flex; }
    body.ps-mobile-view { overflow: hidden; }

    #ps-device-frame {
      width: 375px;
      height: 812px;
      background: #fff;
      border-radius: 44px;
      overflow: hidden;
      position: relative;
      box-shadow:
        0 0 0 10px #1a1a1a,
        0 0 0 11px #333,
        0 30px 80px rgba(0,0,0,0.7);
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
    }

    /* Notch bar */
    #ps-device-notch {
      width: 100%;
      height: 44px;
      background: #000;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    #ps-device-notch::after {
      content: '';
      width: 120px;
      height: 28px;
      background: #000;
      border-radius: 0 0 18px 18px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    /* Status bar items */
    #ps-device-notch::before {
      content: '9:41';
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      font-family: -apple-system, sans-serif;
      z-index: 1;
    }

    /* iframe fills the remaining space */
    #ps-device-iframe {
      flex: 1;
      width: 100%;
      border: none;
      min-height: 0;
    }

    /* Home indicator */
    #ps-device-home {
      width: 100%;
      height: 28px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    #ps-device-home::after {
      content: '';
      width: 130px;
      height: 4px;
      background: #000;
      border-radius: 2px;
      opacity: 0.2;
    }

    /* Scale down if viewport too short */
    @media (max-height: 900px) {
      #ps-device-frame {
        transform-origin: center center;
        transform: scale(0.85);
      }
    }
    @media (max-height: 760px) {
      #ps-device-frame { transform: scale(0.72); }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ── State ────────────────────────────────────────────────────────────── */
  let bar, inner, tab;
  let collapsed = false;
  let mobileActive = false;
  let deviceShell = null;
  const _pendingGroups = []; // queued addGroup calls before bar is built

  /* ── Bar DOM ──────────────────────────────────────────────────────────── */
  function buildBar() {
    bar = document.createElement('div');
    bar.id = 'proto-settings-bar';
    bar.className = 'proto-ui';

    inner = document.createElement('div');
    inner.id = 'proto-settings-inner';

    const brand = document.createElement('span');
    brand.className = 'ps-brand';
    brand.textContent = 'Prototype';
    inner.appendChild(brand);

    bar.appendChild(inner);
    document.body.insertBefore(bar, document.body.firstChild);
    document.body.classList.add('proto-settings-open');

    tab = document.createElement('button');
    tab.id = 'proto-settings-tab';
    tab.textContent = 'Proto';
    tab.addEventListener('click', toggleCollapse);
    document.body.appendChild(tab);

    // Add prototype-specific groups first (left side)
    _pendingGroups.forEach(([label, controls]) => _insertGroup(label, controls));
    _pendingGroups.length = 0;

    // Built-ins always on the right: View + Inspect
    _addViewControl();
    _addInspectBtn();

    // Spacer + collapse button — always last (far right)
    const spacer = document.createElement('span');
    spacer.id = 'ps-end';
    spacer.style.cssText = 'flex:1;';
    inner.appendChild(spacer);

    const colBtn = document.createElement('button');
    colBtn.id = 'ps-collapse-btn';
    colBtn.innerHTML = '<span class="ps-icon">keyboard_arrow_up</span>';
    colBtn.title = 'Collapse';
    colBtn.addEventListener('click', toggleCollapse);
    inner.appendChild(colBtn);
  }

  function toggleCollapse() {
    collapsed = !collapsed;
    bar.classList.toggle('collapsed', collapsed);
    tab.classList.toggle('visible', collapsed);
    document.body.classList.toggle('proto-settings-open', !collapsed);
    document.getElementById('ps-collapse-btn').innerHTML =
      `<span class="ps-icon">${collapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}</span>`;
  }

  /* ── Built-in: View toggle ────────────────────────────────────────────── */
  function _addViewControl() {
    const div = document.createElement('span');
    div.className = 'ps-divider';
    inner.appendChild(div);

    const lbl = document.createElement('span');
    lbl.className = 'ps-group-label';
    lbl.textContent = 'View';
    inner.appendChild(lbl);

    const seg = document.createElement('div');
    seg.className = 'ps-seg';

    const opts = [
      { label: 'Web',    icon: 'desktop_windows', value: 'web' },
      { label: 'Mobile', icon: 'smartphone',      value: 'mobile' },
    ];

    const btns = opts.map(opt => {
      const btn = document.createElement('button');
      btn.className = 'ps-seg-btn' + (opt.value === 'web' ? ' active' : '');
      btn.innerHTML = `<span class="ps-icon">${opt.icon}</span>${opt.label}`;
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        opt.value === 'mobile' ? activateMobile() : activateWeb();
      });
      seg.appendChild(btn);
      return btn;
    });

    inner.appendChild(seg);
  }

  function activateMobile() {
    if (mobileActive) return;
    mobileActive = true;

    // Build device shell if not yet built
    if (!deviceShell) {
      deviceShell = document.createElement('div');
      deviceShell.id = 'ps-device-shell';

      const frame = document.createElement('div');
      frame.id = 'ps-device-frame';

      const notch = document.createElement('div');
      notch.id = 'ps-device-notch';

      const iframe = document.createElement('iframe');
      iframe.id = 'ps-device-iframe';
      iframe.src = location.href;
      iframe.title = 'Mobile preview';

      const home = document.createElement('div');
      home.id = 'ps-device-home';

      frame.appendChild(notch);
      frame.appendChild(iframe);
      frame.appendChild(home);
      deviceShell.appendChild(frame);
      document.body.appendChild(deviceShell);
    }

    document.body.classList.add('ps-mobile-view');
  }

  function activateWeb() {
    if (!mobileActive) return;
    mobileActive = false;
    document.body.classList.remove('ps-mobile-view');
  }

  /* ── Built-in: Inspect button ─────────────────────────────────────────── */
  function _addInspectBtn() {
    const div = document.createElement('span');
    div.className = 'ps-divider';
    inner.appendChild(div);

    const btn = document.createElement('button');
    btn.className = 'ps-inspect-btn';
    btn.innerHTML = '<span class="ps-icon">my_location</span>Inspect';
    btn.id = 'ps-inspect-btn';
    inner.appendChild(btn);

    document.addEventListener('inspectToggle', e => {
      btn.classList.toggle('active', e.detail.active);
      // Forward state to iframe when in mobile view
      const iframe = document.getElementById('ps-device-iframe');
      if (iframe) iframe.contentWindow.postMessage({ type: 'ps-inspect', active: e.detail.active }, '*');
    });
    btn.addEventListener('click', () => {
      const iframe = document.getElementById('ps-device-iframe');
      if (iframe && document.body.classList.contains('ps-mobile-view')) {
        // In mobile view: toggle inspect inside the iframe directly
        iframe.contentWindow.postMessage({ type: 'ps-inspect-toggle' }, '*');
      } else {
        document.dispatchEvent(new CustomEvent('proto-inspect-click'));
      }
    });
  }

  /* ── Internal group inserter ──────────────────────────────────────────── */
  function _insertGroup(label, controls) {
    // Insert before View divider if it exists, otherwise before spacer, otherwise append.
    // During drain: View not yet added → append. At runtime: insert before View divider.
    const viewDiv = inner.querySelector('.ps-divider');
    const ref = viewDiv || document.getElementById('ps-end') || null;
    function ins(el) {
      if (ref && ref.parentNode === inner) inner.insertBefore(el, ref);
      else inner.appendChild(el);
    }

    const div = document.createElement('span');
    div.className = 'ps-divider';
    ins(div);

    if (label) {
      const lbl = document.createElement('span');
      lbl.className = 'ps-group-label';
      lbl.textContent = label;
      ins(lbl);
    }

    controls.forEach(ctrl => {
      if (ctrl.type === 'seg') {
        const seg = document.createElement('div');
        seg.className = 'ps-seg';
        const btns = ctrl.options.map(opt => {
          const btn = document.createElement('button');
          btn.className = 'ps-seg-btn';
          if (opt.icon) btn.innerHTML = `<span class="ps-icon">${opt.icon}</span>${opt.label}`;
          else btn.textContent = opt.label;
          btn.dataset.value = opt.value ?? opt.label;
          const isDefault = ctrl.default !== undefined
            ? (opt.value ?? opt.label) === ctrl.default
            : opt === ctrl.options[0];
          if (isDefault) btn.classList.add('active');
          btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            ctrl.onChange?.(opt.value ?? opt.label);
          });
          seg.appendChild(btn);
          return btn;
        });
        ins(seg);

      } else if (ctrl.type === 'toggle') {
        const btn = document.createElement('button');
        btn.className = 'ps-toggle-btn' + (ctrl.default ? ' active' : '');
        btn.textContent = ctrl.label;
        btn.addEventListener('click', () => {
          ctrl.onChange?.(btn.classList.toggle('active'));
        });
        ins(btn);
      }
    });
  }

  /* ── Public API ───────────────────────────────────────────────────────── */
  window.ProtoSettings = {

    /**
     * addGroup(label, controls)
     * controls: [{ type:'seg'|'toggle', options, onChange, default, label }]
     * Safe to call before DOMContentLoaded — queued and flushed after bar builds.
     */
    addGroup(label, controls) {
      if (!bar) {
        _pendingGroups.push([label, controls]);
        return;
      }
      _insertGroup(label, controls);
    },

    /** @deprecated — Inspect is now built-in, calling this is a no-op */
    addInspect() {},
  };

  /* ── Init ─────────────────────────────────────────────────────────────── */
  // setTimeout 0 runs after all DOMContentLoaded handlers across all scripts,
  // guaranteeing addGroup() calls from prototypes are queued before buildBar drains them.
  function _init() { setTimeout(buildBar, 0); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

})();
