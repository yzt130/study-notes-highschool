/* =====================================================
   app.js — DeepNotes Application Logic
   ===================================================== */

'use strict';

/* ─── State ─── */
const state = {
  activeFilter: 'all',
  activeGrade: 'all',
  searchQuery: '',
  viewMode: 'grid',   // 'grid' | 'list'
};

/* ─── DOM References ─── */
const dom = {
  starCanvas:     document.getElementById('starCanvas'),
  subjectsGrid:   document.getElementById('subjectsGrid'),
  notesGrid:      document.getElementById('notesGrid'),
  emptyState:     document.getElementById('emptyState'),
  filterChips:    document.getElementById('filterChips'),
  searchInput:    document.getElementById('searchInput'),
  clearSearch:    document.getElementById('clearSearch'),
  gridViewBtn:    document.getElementById('gridViewBtn'),
  listViewBtn:    document.getElementById('listViewBtn'),
  pdfModal:       document.getElementById('pdfModal'),
  pdfFrame:       document.getElementById('pdfFrame'),
  modalTitle:     document.getElementById('modalTitle'),
  modalDownload:  document.getElementById('modalDownload'),
  modalClose:     document.getElementById('modalClose'),
  siteHeader:     document.querySelector('.site-header'),
  hamburger:      document.getElementById('hamburger'),
  mainNav:        document.getElementById('mainNav'),
  statSubjects:   document.getElementById('statSubjects'),
  statNotes:      document.getElementById('statNotes'),
  statPdf:        document.getElementById('statPdf'),
  navLinks:       document.querySelectorAll('.nav-link'),
};

/* ═══════════════════════════════════════
   STARFIELD CANVAS
═══════════════════════════════════════ */
function initStarfield() {
  const canvas = dom.starCanvas;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, stars, animId;

  const STAR_COUNT = 220;
  const TWINKLE_SPEED = 0.006;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x:       Math.random() * W,
      y:       Math.random() * H,
      r:       Math.random() * 1.6 + 0.2,
      alpha:   Math.random(),
      delta:   (Math.random() - 0.5) * TWINKLE_SPEED,
      speed:   Math.random() * 0.05 + 0.01,   // drift speed
      drift:   (Math.random() - 0.5) * 0.15,  // x drift
    }));
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      // Twinkle
      s.alpha += s.delta;
      if (s.alpha <= 0 || s.alpha >= 1) {
        s.delta *= -1;
        s.alpha = Math.max(0, Math.min(1, s.alpha));
      }

      // Very slow upward drift (deep sea feel)
      s.y -= s.speed;
      s.x += s.drift * 0.05;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }

      // Draw star with glow
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
      glow.addColorStop(0, `rgba(180, 220, 255, ${s.alpha})`);
      glow.addColorStop(0.4, `rgba(100, 180, 255, ${s.alpha * 0.4})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 230, 255, ${s.alpha})`;
      ctx.fill();
    }

    animId = requestAnimationFrame(drawStars);
  }

  function init() {
    resize();
    createStars();
    drawStars();
  }

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });

  init();
}

/* ═══════════════════════════════════════
   SUBJECTS GRID
═══════════════════════════════════════ */
function renderSubjects() {
  if (!dom.subjectsGrid) return;

  dom.subjectsGrid.innerHTML = SUBJECTS.map(s => {
    const count = NOTES.filter(n => n.subject === s.id).length;
    return `
      <div
        class="subject-card reveal"
        data-subject="${s.id}"
        style="--card-color: ${s.color[0]}22"
      >
        <span class="subject-icon">${s.icon}</span>
        <span class="subject-name">${s.name}</span>
        <span class="subject-count">${count} ghi chú</span>
        <div class="grade-links">
          <button class="grade-btn" data-subject="${s.id}" data-grade="10">Lớp 10</button>
          <button class="grade-btn" data-subject="${s.id}" data-grade="11">Lớp 11</button>
          <button class="grade-btn" data-subject="${s.id}" data-grade="12">Lớp 12</button>
        </div>
      </div>
    `;
  }).join('');

  // Attach events
  dom.subjectsGrid.querySelectorAll('.grade-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const subject = btn.dataset.subject;
      const grade = btn.dataset.grade;
      filterBySubjectAndGrade(subject, grade);
      document.getElementById('notes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  
  dom.subjectsGrid.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => {
      const subject = card.dataset.subject;
      filterBySubjectAndGrade(subject, 'all');
      document.getElementById('notes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ═══════════════════════════════════════
   FILTER CHIPS
═══════════════════════════════════════ */
function renderFilterChips() {
  if (!dom.filterChips) return;

  const subjects = [...new Set(NOTES.map(n => n.subject))];

  const chips = [
    `<button class="chip active" data-filter="all">Tất cả</button>`,
    ...subjects.map(subjectId => {
      const subject = SUBJECTS.find(s => s.id === subjectId);
      if (!subject) return '';
      return `<button class="chip" data-filter="${subjectId}">${subject.icon} ${subject.name}</button>`;
    }),
  ].join('');

  dom.filterChips.innerHTML = chips;

  dom.filterChips.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      filterBySubjectAndGrade(chip.dataset.filter, state.activeGrade);
    });
  });

  const gradeChips = document.getElementById('gradeChips');
  if (gradeChips) {
    gradeChips.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        filterBySubjectAndGrade(state.activeFilter, chip.dataset.grade);
      });
    });
  }
}

/* ═══════════════════════════════════════
   NOTES GRID
═══════════════════════════════════════ */
function getFilteredNotes() {
  let notes = [...NOTES];

  if (state.activeFilter !== 'all') {
    notes = notes.filter(n => n.subject === state.activeFilter);
  }
  
  if (state.activeGrade !== 'all') {
    notes = notes.filter(n => String(n.grade) === String(state.activeGrade));
  }

  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    notes = notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.description?.toLowerCase().includes(q) ||
      SUBJECTS.find(s => s.id === n.subject)?.name.toLowerCase().includes(q)
    );
  }

  return notes;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function renderNotes() {
  if (!dom.notesGrid) return;

  const notes = getFilteredNotes();

  if (notes.length === 0) {
    dom.notesGrid.innerHTML = '';
    dom.emptyState.style.display = 'block';
    return;
  }

  dom.emptyState.style.display = 'none';

  dom.notesGrid.innerHTML = notes.map((note, i) => {
    const subject = SUBJECTS.find(s => s.id === note.subject);
    const accentFrom = subject?.color[0] || '#1e87d6';
    const accentTo   = subject?.color[1] || '#0d3b6e';

    return `
      <article
        class="note-card reveal"
        data-id="${note.id}"
        data-file="${note.file || ''}"
        style="animation-delay: ${i * 0.06}s"
        role="button"
        tabindex="0"
        aria-label="Xem: ${note.title}"
      >
        <div class="note-card-top" style="--card-accent-from: ${accentFrom}; --card-accent-to: ${accentTo}"></div>
        <div class="note-card-body">
          <span class="note-subject-badge">
            ${subject?.icon || '📄'} ${subject?.name || note.subject}
          </span>
          <h3 class="note-title">${escapeHtml(note.title)}</h3>
          ${note.description ? `<p class="note-desc">${escapeHtml(note.description)}</p>` : ''}
        </div>
        <div class="note-card-footer">
          <div class="note-meta">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${formatDate(note.date)}
            ${note.pages ? `<span>· ${note.pages} trang</span>` : ''}
          </div>
          <div class="note-actions">
            ${note.file ? `
              <button
                class="note-action-btn view-note-btn"
                data-file="${note.file}"
                data-title="${escapeHtml(note.title)}"
                aria-label="Xem tài liệu"
                title="Xem"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <a
                class="note-action-btn"
                href="${note.file}"
                download
                aria-label="Tải về"
                title="Tải về"
                onclick="event.stopPropagation()"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            ` : `
              <span class="note-action-btn" style="opacity:0.3;cursor:default" title="Chưa có file">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </span>
            `}
          </div>
        </div>
      </article>
    `;
  }).join('');

  // View button events
  dom.notesGrid.querySelectorAll('.view-note-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPdfModal(btn.dataset.file, btn.dataset.title);
    });
  });

  // Card click (open PDF)
  dom.notesGrid.querySelectorAll('.note-card').forEach(card => {
    card.addEventListener('click', () => {
      const file = card.dataset.file;
      if (file) {
        const note = NOTES.find(n => String(n.id) === card.dataset.id);
        openPdfModal(file, note?.title || 'Xem tài liệu');
      }
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    });
  });

  // Reveal animation
  requestAnimationFrame(triggerReveal);
}

/* ═══════════════════════════════════════
   FILTER HELPER
═══════════════════════════════════════ */
function filterBySubjectAndGrade(subjectId, gradeId) {
  state.activeFilter = subjectId;
  state.activeGrade = gradeId;
  
  dom.filterChips?.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.filter === subjectId);
  });
  
  const gradeChips = document.getElementById('gradeChips');
  gradeChips?.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.grade === String(gradeId));
  });
  
  renderNotes();
}

/* ═══════════════════════════════════════
   PDF MODAL
═══════════════════════════════════════ */
function openPdfModal(file, title) {
  if (!dom.pdfModal) return;
  dom.modalTitle.textContent = title || 'Xem tài liệu';
  dom.pdfFrame.src = file;
  dom.modalDownload.href = file;
  dom.pdfModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  if (!dom.pdfModal) return;
  dom.pdfModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    dom.pdfFrame.src = '';
  }, 300);
}

/* ═══════════════════════════════════════
   STATS
═══════════════════════════════════════ */
function updateStats() {
  const pdfCount = NOTES.filter(n => !!n.file).length;

  animateCount(dom.statSubjects, SUBJECTS.length);
  animateCount(dom.statNotes, NOTES.length);
  animateCount(dom.statPdf, pdfCount);
}

function animateCount(el, target) {
  if (!el) return;
  const duration = 1200;
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(eased * target);
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ═══════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════ */
function triggerReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════
   ACTIVE NAV ON SCROLL
═══════════════════════════════════════ */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dom.navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
}

/* ═══════════════════════════════════════
   HEADER SCROLL EFFECT
═══════════════════════════════════════ */
function initHeaderScroll() {
  const onScroll = () => {
    dom.siteHeader?.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ═══════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════ */
function initHamburger() {
  dom.hamburger?.addEventListener('click', () => {
    dom.mainNav?.classList.toggle('open');
  });

  // Close on link click
  dom.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      dom.mainNav?.classList.remove('open');
    });
  });
}

/* ═══════════════════════════════════════
   VIEW TOGGLE
═══════════════════════════════════════ */
function initViewToggle() {
  dom.gridViewBtn?.addEventListener('click', () => {
    state.viewMode = 'grid';
    dom.notesGrid?.classList.remove('list-view');
    dom.gridViewBtn.classList.add('active');
    dom.listViewBtn?.classList.remove('active');
  });

  dom.listViewBtn?.addEventListener('click', () => {
    state.viewMode = 'list';
    dom.notesGrid?.classList.add('list-view');
    dom.listViewBtn.classList.add('active');
    dom.gridViewBtn?.classList.remove('active');
  });
}

/* ═══════════════════════════════════════
   SEARCH
═══════════════════════════════════════ */
function initSearch() {
  let debounceTimer;

  dom.searchInput?.addEventListener('input', () => {
    state.searchQuery = dom.searchInput.value;
    dom.clearSearch?.classList.toggle('visible', state.searchQuery.length > 0);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(renderNotes, 200);
  });

  dom.clearSearch?.addEventListener('click', () => {
    dom.searchInput.value = '';
    state.searchQuery = '';
    dom.clearSearch.classList.remove('visible');
    renderNotes();
    dom.searchInput.focus();
  });
}

/* ═══════════════════════════════════════
   MODAL EVENTS
═══════════════════════════════════════ */
function initModal() {
  dom.modalClose?.addEventListener('click', closePdfModal);

  dom.pdfModal?.addEventListener('click', (e) => {
    if (e.target === dom.pdfModal) closePdfModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePdfModal();
  });
}

/* ═══════════════════════════════════════
   UTILITY
═══════════════════════════════════════ */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ═══════════════════════════════════════
   MAIN INIT
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  renderSubjects();
  renderFilterChips();
  renderNotes();
  updateStats();
  initHeaderScroll();
  initScrollSpy();
  initHamburger();
  initViewToggle();
  initSearch();
  initModal();

  // Initial reveal
  requestAnimationFrame(triggerReveal);

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
