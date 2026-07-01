/* ============================================
   Mobile nav toggle
   ============================================ */
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================
   Hero annotation toggles
   ============================================ */
document.querySelectorAll('.ann').forEach(btn => {
  btn.addEventListener('click', () => {
    const noteId = btn.dataset.note;
    const note = document.getElementById(noteId);
    const willOpen = !btn.classList.contains('is-open');

    document.querySelectorAll('.ann.is-open').forEach(other => {
      if (other !== btn) {
        other.classList.remove('is-open');
        document.getElementById(other.dataset.note)?.classList.remove('is-visible');
      }
    });

    btn.classList.toggle('is-open', willOpen);
    note?.classList.toggle('is-visible', willOpen);
  });
});

/* ============================================
   Data loading
   Quote bank + practice questions now live in
   /data/quotes.json and /data/practice-questions.json
   so they're easy to edit without touching this file.

   NOTE: fetch() needs the page served over http(s), not
   opened directly as a file:// path. Use VS Code's
   "Live Server" extension (or any local server) when
   editing these files.
   ============================================ */
let QUOTES = [];
let PRACTICE = { textMeta: {}, questions: {} };

async function loadData() {
  try {
    const [quotesRes, practiceRes] = await Promise.all([
      fetch('data/quotes.json'),
      fetch('data/practice-questions.json'),
    ]);

    if (!quotesRes.ok || !practiceRes.ok) {
      throw new Error('One or more data files failed to load.');
    }

    QUOTES = await quotesRes.json();
    PRACTICE = await practiceRes.json();

    initQuoteBank();
    initPracticeGenerator();
  } catch (err) {
    console.error('Failed to load site data:', err);
    showDataError();
  }
}

function showDataError() {
  const cardGrid = document.getElementById('card-grid');
  if (cardGrid) {
    cardGrid.innerHTML = `
      <p style="font-family: var(--font-body); color: var(--red-pen); grid-column: 1 / -1;">
        Couldn't load the quote bank data. If you're viewing this file directly
        (file://), run it through a local server instead — e.g. VS Code's
        "Live Server" extension — since browsers block JSON fetches from local files.
      </p>`;
  }
}

/* ============================================
   Quote bank rendering + filtering
   ============================================ */
function initQuoteBank() {
  const cardGrid = document.getElementById('card-grid');
  const filterTabs = document.getElementById('filter-tabs');

  function renderQuotes(filter) {
    cardGrid.innerHTML = '';
    const items = filter === 'all' ? QUOTES : QUOTES.filter(q => q.text === filter);

    items.forEach((q) => {
      const card = document.createElement('div');
      card.className = 'flip-card';
      card.innerHTML = `
        <div class="flip-card-inner" tabindex="0" role="button"
             aria-label="Flip card to reveal analysis for: ${q.quote}">
          <div class="flip-face flip-front">
            <p class="quote-text">${q.quote}</p>
            <div class="quote-meta">
              <span>${q.label}</span>
              <span class="flip-hint">tap to flip ↻</span>
            </div>
          </div>
          <div class="flip-face flip-back">
            <span class="label">Why it matters</span>
            <p>${q.note}</p>
          </div>
        </div>
      `;
      cardGrid.appendChild(card);
    });

    cardGrid.querySelectorAll('.flip-card-inner').forEach(inner => {
      const toggle = () => inner.parentElement.classList.toggle('is-flipped');
      inner.addEventListener('click', toggle);
      inner.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  filterTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-tab');
    if (!btn) return;

    filterTabs.querySelectorAll('.filter-tab').forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');

    renderQuotes(btn.dataset.filter);
  });

  renderQuotes('all');
}

/* ============================================
   Practice question generator
   ============================================ */
function initPracticeGenerator() {
  const practiceForm = document.getElementById('practice-form');
  const practiceTag = document.getElementById('practice-tag');
  const practiceQuestion = document.getElementById('practice-question');
  const practiceMeta = document.getElementById('practice-meta');
  const practiceCard = document.getElementById('practice-card');

  practiceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const textKey = document.getElementById('select-text').value;
    const skillKey = document.getElementById('select-skill').value;
    const result = PRACTICE.questions[textKey][skillKey];
    const meta = PRACTICE.textMeta[textKey];

    practiceTag.textContent = meta.label;
    practiceTag.className = `page-tag ${meta.tag}`;
    practiceQuestion.textContent = result.q;
    practiceMeta.textContent = result.meta;

    practiceCard.style.transform = 'rotate(0deg)';
    requestAnimationFrame(() => {
      practiceCard.style.transform = 'rotate(0.6deg)';
    });
  });
}

/* ============================================
   Kick everything off
   ============================================ */
loadData();
