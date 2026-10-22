/* ============================================================
   BUBU Studio · macOS-Desktop Window Manager
   ============================================================ */

(function() {
  'use strict';

  let zCounter = 100;
  const openWindows = new Set();
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  /* ============ CLOCK ============ */
  function updateClock() {
    const el = document.getElementById('menubar-clock');
    if (!el) return;
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    el.textContent = `${days[now.getDay()]} ${h}:${m}`;
  }
  updateClock();
  setInterval(updateClock, 30000);

  /* ============ WINDOW OPEN/CLOSE ============ */
  function openWindow(id) {
    const win = document.getElementById('window-' + id);
    if (!win) return;

    const wasMinimized = win.classList.contains('window--minimized');
    win.classList.remove('window--minimized');

    if (!win.classList.contains('window--open')) {
      win.classList.add('window--open');
      win.setAttribute('aria-hidden', 'false');
      openWindows.add(id);

      // Position window — cascade for new opens, skip on mobile
      if (!isMobile()) {
        positionWindow(win);
      }
    }

    bringToFront(win);
  }

  function closeWindow(win) {
    win.classList.remove('window--open');
    win.classList.remove('window--max');
    win.setAttribute('aria-hidden', 'true');
    win.style.transform = '';
    win.style.top = '';
    win.style.left = '';
    win.style.width = '';
    win.style.height = '';
    openWindows.delete(win.dataset.windowId);
  }

  function minimizeWindow(win) {
    win.classList.add('window--minimized');
  }

  function toggleMaximize(win) {
    if (isMobile()) return;
    win.classList.toggle('window--max');
  }

  function bringToFront(win) {
    zCounter++;
    win.style.zIndex = zCounter;
  }

  function positionWindow(win) {
    if (win.dataset.positioned === '1') {
      bringToFront(win);
      return;
    }
    win.dataset.positioned = '1';

    const count = openWindows.size;
    const offset = (count - 1) * 28;
    const baseTop = 60;
    const baseLeft = 80;

    // For piece windows, use larger size
    const isPiece = win.querySelector('.window__body--piece');
    if (isPiece) {
      win.style.width = '640px';
    }

    // Center initial position, then cascade
    const winWidth = win.offsetWidth || 580;
    const winHeight = Math.min(win.offsetHeight || 500, window.innerHeight - 160);

    const maxLeft = window.innerWidth - winWidth - 40;
    const maxTop = window.innerHeight - winHeight - 120;

    let left = Math.min(baseLeft + offset, maxLeft);
    let top = Math.min(baseTop + offset, maxTop);

    // First-opened window: anchor center-left so it sits next to the icon grid
    // without covering the rightmost icons.
    if (count === 1) {
      left = Math.max(40, (window.innerWidth - winWidth) / 2 - 80);
      top = 60;
    }

    win.style.left = left + 'px';
    win.style.top = top + 'px';
  }

  /* ============ DRAG ============ */
  function makeDraggable(win) {
    const chrome = win.querySelector('.window__chrome');
    if (!chrome) return;

    let startX, startY, startLeft, startTop, dragging = false;

    function onDown(e) {
      if (e.target.classList.contains('tl')) return;
      if (win.classList.contains('window--max')) return;
      if (isMobile()) return;

      const point = e.touches ? e.touches[0] : e;
      startX = point.clientX;
      startY = point.clientY;

      const rect = win.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      dragging = true;
      bringToFront(win);

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
      e.preventDefault();
    }

    function onMove(e) {
      if (!dragging) return;
      const point = e.touches ? e.touches[0] : e;
      const dx = point.clientX - startX;
      const dy = point.clientY - startY;

      let newLeft = startLeft + dx;
      let newTop = startTop + dy;

      // Constrain
      const maxLeft = window.innerWidth - 80;
      const minLeft = 80 - win.offsetWidth;
      const minTop = 28;
      const maxTop = window.innerHeight - 80;

      newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
      newTop = Math.max(minTop, Math.min(maxTop, newTop));

      win.style.left = newLeft + 'px';
      win.style.top = newTop + 'px';
      if (e.touches) e.preventDefault();
    }

    function onUp() {
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }

    chrome.addEventListener('mousedown', onDown);
    chrome.addEventListener('touchstart', onDown, { passive: false });
  }

  /* ============ DESKTOP ICON DRAG ============ */
  // Loose desktop grid — icons breathe across the full desktop instead of clustering top-left.
  const GRID_X = 210;   // horizontal step (icon width + generous gap)
  const GRID_Y = 210;   // vertical step
  const PAD_X = 60;     // matches .icon-grid padding on desktop
  const PAD_Y = 0;

  // In-memory store. Persists for the session but not across reloads.
  // Preview iframe blocks Web Storage APIs.
  const iconPositions = {};

  function loadIconPositions() {
    return iconPositions;
  }

  function saveIconPositions(positions) {
    Object.assign(iconPositions, positions);
  }

  function iconKey(el) {
    return el.dataset.window || el.getAttribute('href') || el.querySelector('.icon__label')?.textContent || '';
  }

  function applyIconPosition(el, x, y) {
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  function initDesktopIcons() {
    if (isMobile()) return;
    const grid = document.querySelector('.icon-grid');
    if (!grid) return;
    const saved = loadIconPositions();
    const icons = grid.querySelectorAll('.icon');

    icons.forEach(icon => {
      icon.setAttribute('draggable', 'false');
      icon.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));
      const key = iconKey(icon);
      let x, y;
      if (saved[key]) {
        x = saved[key].x;
        y = saved[key].y;
      } else {
        // Initialize from --row / --col on the inline style
        const style = icon.getAttribute('style') || '';
        const rowMatch = style.match(/--row:\s*(\d+)/);
        const colMatch = style.match(/--col:\s*(\d+)/);
        const row = rowMatch ? parseInt(rowMatch[1]) : 1;
        const col = colMatch ? parseInt(colMatch[1]) : 1;
        // Linear column mapping: col N -> N-1 slot along the top of the desktop
        x = (col - 1) * GRID_X;
        y = (row - 1) * GRID_Y;
      }
      applyIconPosition(icon, x, y);
      makeIconDraggable(icon, grid);
    });
  }

  function makeIconDraggable(icon, grid) {
    let startX = 0, startY = 0;
    let origLeft = 0, origTop = 0;
    let dragging = false;
    let moved = false;
    let pointerId = null;
    const DRAG_THRESHOLD = 5;

    function onPointerDown(e) {
      if (isMobile()) return;
      if (e.button !== undefined && e.button !== 0) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = parseFloat(icon.style.left) || 0;
      origTop = parseFloat(icon.style.top) || 0;
      dragging = true;
      moved = false;
      try { icon.setPointerCapture(pointerId); } catch (err) {}
      icon.addEventListener('pointermove', onPointerMove);
      icon.addEventListener('pointerup', onPointerUp);
      icon.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (!moved) {
        moved = true;
        icon.classList.add('is-dragging');
      }
      e.preventDefault();
      let nx = origLeft + dx;
      let ny = origTop + dy;
      // Clamp within grid bounds
      const gridRect = grid.getBoundingClientRect();
      const iconW = icon.offsetWidth;
      const iconH = icon.offsetHeight;
      const maxX = gridRect.width - iconW - PAD_X * 2;
      const maxY = gridRect.height - iconH;
      nx = Math.max(0, Math.min(nx, maxX));
      ny = Math.max(0, Math.min(ny, maxY));
      applyIconPosition(icon, nx, ny);
    }

    function onPointerUp(e) {
      if (!dragging) return;
      icon.removeEventListener('pointermove', onPointerMove);
      icon.removeEventListener('pointerup', onPointerUp);
      icon.removeEventListener('pointercancel', onPointerUp);
      try { icon.releasePointerCapture(pointerId); } catch (err) {}
      dragging = false;

      if (moved) {
        // Snap to grid
        const curLeft = parseFloat(icon.style.left) || 0;
        const curTop = parseFloat(icon.style.top) || 0;
        const snapX = Math.round(curLeft / GRID_X) * GRID_X;
        const snapY = Math.round(curTop / GRID_Y) * GRID_Y;
        applyIconPosition(icon, snapX, snapY);
        icon.classList.remove('is-dragging');
        // Persist
        const positions = loadIconPositions();
        positions[iconKey(icon)] = { x: snapX, y: snapY };
        saveIconPositions(positions);
        // Suppress the click that follows the drag
        const suppress = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
        icon.addEventListener('click', suppress, { capture: true, once: true });
        setTimeout(() => icon.removeEventListener('click', suppress, true), 50);
      }
      moved = false;
    }

    icon.addEventListener('pointerdown', onPointerDown);
  }

  initDesktopIcons();

  /* ============ WORK PAGE SCATTER DRAG ============ */
  // On work.html, .scatter items are positioned by --x/--y (percent). Convert to pixels and
  // allow free dragging. On mobile the CSS overrides to static, so we skip.
  function initWorkScatter() {
    if (isMobile()) return;
    const canvas = document.getElementById('workCanvas');
    if (!canvas) return;
    const scatters = canvas.querySelectorAll('.scatter');
    if (!scatters.length) return;

    // Convert each item's --x/--y percent to absolute pixel left/top.
    // Keep translate(-50%, -50%) via CSS so the item stays centered on its anchor.
    const rect = canvas.getBoundingClientRect();
    scatters.forEach(s => {
      const style = s.getAttribute('style') || '';
      const xMatch = style.match(/--x:\s*([\d.]+)%/);
      const yMatch = style.match(/--y:\s*([\d.]+)%/);
      const xPct = xMatch ? parseFloat(xMatch[1]) : 50;
      const yPct = yMatch ? parseFloat(yMatch[1]) : 50;
      const px = (xPct / 100) * rect.width;
      const py = (yPct / 100) * rect.height;
      // Preserve scale (keep the --scale CSS var untouched via style.setProperty)
      s.style.left = px + 'px';
      s.style.top = py + 'px';
      // Remove the percent vars so subsequent drags use px only
      s.style.setProperty('--x', px + 'px');
      s.style.setProperty('--y', py + 'px');
      s.setAttribute('draggable', 'false');
      s.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));
      makeScatterDraggable(s, canvas);
    });
  }

  function makeScatterDraggable(scatter, canvas) {
    let startX = 0, startY = 0;
    let origLeft = 0, origTop = 0;
    let dragging = false;
    let moved = false;
    let pointerId = null;
    const DRAG_THRESHOLD = 5;

    function onPointerDown(e) {
      if (isMobile()) return;
      if (e.button !== undefined && e.button !== 0) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = parseFloat(scatter.style.left) || 0;
      origTop = parseFloat(scatter.style.top) || 0;
      dragging = true;
      moved = false;
      try { scatter.setPointerCapture(pointerId); } catch (err) {}
      scatter.addEventListener('pointermove', onPointerMove);
      scatter.addEventListener('pointerup', onPointerUp);
      scatter.addEventListener('pointercancel', onPointerUp);
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      if (!moved) {
        moved = true;
        scatter.classList.add('is-dragging');
      }
      e.preventDefault();
      let nx = origLeft + dx;
      let ny = origTop + dy;
      const cRect = canvas.getBoundingClientRect();
      const sRect = scatter.getBoundingClientRect();
      const halfW = sRect.width / 2;
      const halfH = sRect.height / 2;
      nx = Math.max(halfW, Math.min(nx, cRect.width - halfW));
      ny = Math.max(halfH, Math.min(ny, cRect.height - halfH));
      scatter.style.left = nx + 'px';
      scatter.style.top = ny + 'px';
    }

    function onPointerUp(e) {
      if (!dragging) return;
      scatter.removeEventListener('pointermove', onPointerMove);
      scatter.removeEventListener('pointerup', onPointerUp);
      scatter.removeEventListener('pointercancel', onPointerUp);
      try { scatter.releasePointerCapture(pointerId); } catch (err) {}
      dragging = false;
      if (moved) {
        scatter.classList.remove('is-dragging');
        // Suppress the click that follows the drag
        const suppress = (ev) => { ev.stopPropagation(); ev.preventDefault(); };
        scatter.addEventListener('click', suppress, { capture: true, once: true });
        setTimeout(() => scatter.removeEventListener('click', suppress, true), 50);
      }
      moved = false;
    }

    scatter.addEventListener('pointerdown', onPointerDown);
  }

  initWorkScatter();

  /* ============ HASH ROUTING (open a window when arriving from work.html) ============ */
  function openFromHash() {
    const raw = window.location.hash.replace('#', '').trim();
    if (!raw) return;
    const target = document.querySelector('[data-window-id="' + raw + '"]');
    if (target) openWindow(raw);
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  /* ============ EVENT WIRING ============ */
  // Desktop icons + dock items
  document.querySelectorAll('[data-window]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openWindow(el.dataset.window);
    });
  });

  // Window controls + body action buttons
  document.querySelectorAll('.window').forEach(win => {
    makeDraggable(win);

    // Click anywhere in window brings to front
    win.addEventListener('mousedown', () => bringToFront(win));

    win.querySelectorAll('.tl').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        if (action === 'close') closeWindow(win);
        else if (action === 'minimize') minimizeWindow(win);
        else if (action === 'maximize') toggleMaximize(win);
      });
    });

    // Double-click titlebar to maximize
    const chrome = win.querySelector('.window__chrome');
    if (chrome) {
      chrome.addEventListener('dblclick', (e) => {
        if (!e.target.classList.contains('tl')) toggleMaximize(win);
      });
    }
  });

  // Internal "open another window" buttons
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => openWindow(btn.dataset.open));
  });

  // Hint banner
  const hint = document.getElementById('hint');
  const hintClose = document.getElementById('hint-close');
  if (hintClose) {
    hintClose.addEventListener('click', () => hint.classList.add('hidden'));
  }
  setTimeout(() => { if (hint) hint.classList.add('hidden'); }, 9000);

  /* ============ GALLERY RENDERING ============ */
  function renderGallery(id, items) {
    const el = document.getElementById(id);
    if (!el || !Array.isArray(items)) return;
    el.innerHTML = items.map(p => {
      const altText = `${p.title} by Jan Fechner from the Liquid Mountains collection`;
      const titleText = `${p.title}. A study by Jan Fechner. Liquid Mountains collection. BUBU Studio.`;
      return `
      <figure class="gallery__piece">
        <div class="gallery__img-wrap">
          <img src="assets/gallery/${p.file}" alt="${altText}" title="${titleText}" loading="lazy">
        </div>
        <figcaption>
          <span class="cap-title">${p.title}</span>
          <span class="cap-text">${p.text}</span>
        </figcaption>
      </figure>`;
    }).join('');
  }

  const data = window.BUBU_DATA || {};
  renderGallery('atelier-gallery', data.ATELIER_PIECES);
  renderGallery('outdoor-gallery', data.LANDSCAPE_INSTALLATIONS);

  // Gallery window: combine all pieces from atelier + landscape
  const allPieces = [].concat(data.ATELIER_PIECES || [], data.LANDSCAPE_INSTALLATIONS || []);
  renderGallery('all-gallery', allPieces);

  /* ============ AUTO-OPEN ============ */
  // No auto-open. The hint toast invites the visitor to click an icon
  // so the full desktop and all icons remain visible on first load.

  // ESC to close focused window
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openWins = document.querySelectorAll('.window--open');
      if (openWins.length === 0) return;
      // close topmost
      let top = openWins[0];
      let topZ = parseInt(top.style.zIndex) || 0;
      openWins.forEach(w => {
        const z = parseInt(w.style.zIndex) || 0;
        if (z > topZ) { top = w; topZ = z; }
      });
      closeWindow(top);
    }
  });

})();
