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

    // close any other open annotation for a cleaner read
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
   Quote bank data
   Note: Macbeth & A Christmas Carol quotes are public domain.
   An Inspector Calls & the Romance Anthology entries describe
   key moments/techniques rather than reproducing copyrighted text.
   ============================================ */
const QUOTES = [
  {
    text: 'macbeth', tag: 'tag-macbeth', label: 'Macbeth',
    quote: '"Is this a dagger which I see before me?"',
    note: 'Act 2, Scene 1. A hallucination just before the murder — guilt manifesting physically before Macbeth has even acted. Useful for AO2 essays on imagery and the supernatural.'
  },
  {
    text: 'macbeth', tag: 'tag-macbeth', label: 'Macbeth',
    quote: '"Out, damned spot!"',
    note: "Act 5, Scene 1. Lady Macbeth sleepwalking, guilt now literalised on her hands. Strong contrast piece against her Act 1 confidence — great for character-change questions."
  },
  {
    text: 'macbeth', tag: 'tag-macbeth', label: 'Macbeth',
    quote: '"Stars, hide your fires"',
    note: "Act 1, Scene 4. Macbeth asks darkness to hide his ambition from himself — he already knows it's wrong. Pairs well with light/dark imagery tracking across the play."
  },
  {
    text: 'carol', tag: 'tag-carol', label: 'A Christmas Carol',
    quote: '"Mankind was my business."',
    note: "Marley's ghost, Stave 1. Directly answers Scrooge's worldview before he's even challenged it — sets up the novella's central message on social responsibility."
  },
  {
    text: 'carol', tag: 'tag-carol', label: 'A Christmas Carol',
    quote: '"I will honour Christmas in my heart."',
    note: "Stave 4. The moment Scrooge's transformation is confirmed in his own words — the resolution of the redemption arc. Strong evidence for AO1 essays on change."
  },
  {
    text: 'carol', tag: 'tag-carol', label: 'A Christmas Carol',
    quote: '"Darkness was cheap, and Scrooge liked it."',
    note: 'Stave 1. Characterisation through setting — miserliness shown through environment, not just dialogue. Good example of Dickens "showing" rather than "telling".'
  },
  {
    text: 'inspector', tag: 'tag-inspector', label: 'An Inspector Calls',
    quote: 'Key moment: Birling\u2019s Titanic speech',
    note: "Birling confidently dismisses war and the Titanic as impossible just before both happen. Priestley uses dramatic irony to undercut his authority from the opening minutes."
  },
  {
    text: 'inspector', tag: 'tag-inspector', label: 'An Inspector Calls',
    quote: "Key moment: the Inspector's final warning",
    note: 'Just before the twist is revealed, the Inspector delivers a direct political message about responsibility to the next generation. Central to AO3 readings of the play.'
  },
  {
    text: 'inspector', tag: 'tag-inspector', label: 'An Inspector Calls',
    quote: "Key moment: Sheila challenges her parents",
    note: 'Sheila shifts from a compliant daughter to the character most willing to accept blame. Embodies the generational divide Priestley builds the play around.'
  },
  {
    text: 'romance', tag: 'tag-romance', label: 'Romance Anthology',
    quote: 'Technique: present vs. past tense',
    note: 'Several poems shift tense mid-poem to show how memory reshapes a relationship after it ends. Worth tracking across at least two poems for comparison questions.'
  },
  {
    text: 'romance', tag: 'tag-romance', label: 'Romance Anthology',
    quote: 'Technique: weather and natural imagery',
    note: "Storms, tides and seasons recur as metaphors for emotional intensity. A reliable angle for AO2 questions on how poets present feeling."
  },
  {
    text: 'romance', tag: 'tag-romance', label: 'Romance Anthology',
    quote: 'Technique: withholding the name',
    note: "Some poems delay naming the person being addressed until the final line, redirecting how the whole poem is read in hindsight. Good for structure-focused answers."
  },
];

const cardGrid = document.getElementById('card-grid');
const filterTabs = document.getElementById('filter-tabs');

function renderQuotes(filter) {
  cardGrid.innerHTML = '';
  const items = filter === 'all' ? QUOTES : QUOTES.filter(q => q.text === filter);

  items.forEach((q, i) => {
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

/* ============================================
   Practice question generator
   ============================================ */
const PRACTICE_QUESTIONS = {
  macbeth: {
    character: { q: 'Explore how Shakespeare presents Macbeth as a character driven by ambition.', meta: '30 marks · AO1 / AO2' },
    theme:     { q: 'Explore how guilt is presented as a powerful force in Macbeth.', meta: '30 marks · AO1 / AO2' },
    context:   { q: "Explore how a Jacobean audience's beliefs about fate and kingship shape responses to Macbeth.", meta: '30 marks · AO1 / AO3' },
    language:  { q: 'Explore how Shakespeare uses imagery of light and darkness across Macbeth.', meta: '30 marks · AO2' },
  },
  carol: {
    character: { q: "Explore how Dickens presents Scrooge's transformation across the novella.", meta: '40 marks · AO1 / AO2' },
    theme:     { q: 'Explore how Dickens presents ideas about social responsibility in A Christmas Carol.', meta: '40 marks · AO1 / AO2' },
    context:   { q: 'Explore how Victorian attitudes to poverty shape the message of A Christmas Carol.', meta: '40 marks · AO1 / AO3' },
    language:  { q: 'Explore how Dickens uses the supernatural to structure A Christmas Carol.', meta: '40 marks · AO2' },
  },
  inspector: {
    character: { q: 'Explore how Priestley presents Sheila as a character who changes across the play.', meta: '30 marks · AO1 / AO2' },
    theme:     { q: 'Explore how Priestley presents ideas about collective responsibility in An Inspector Calls.', meta: '30 marks · AO1 / AO2' },
    context:   { q: "Explore how Priestley's post-war audience would have responded to the play's political message.", meta: '30 marks · AO1 / AO3' },
    language:  { q: 'Explore how Priestley uses dramatic irony to shape the audience\u2019s view of the Birling family.', meta: '30 marks · AO2' },
  },
  romance: {
    character: { q: 'Compare how speakers are presented in two poems from the Romance anthology.', meta: '20 marks · AO1 / AO2' },
    theme:     { q: 'Compare how loss is presented in two poems from the Romance anthology.', meta: '20 marks · AO1 / AO2' },
    context:   { q: 'Compare how two poets from the Romance anthology reflect the time they were writing in.', meta: '20 marks · AO1 / AO3' },
    language:  { q: 'Compare how form and structure are used to present feeling in two poems from the Romance anthology.', meta: '20 marks · AO2' },
  },
};

const TEXT_LABELS = {
  macbeth: 'Macbeth',
  carol: 'A Christmas Carol',
  inspector: 'An Inspector Calls',
  romance: 'Romance Anthology',
};

const TEXT_TAGS = {
  macbeth: 'tag-macbeth',
  carol: 'tag-carol',
  inspector: 'tag-inspector',
  romance: 'tag-romance',
};

const practiceForm = document.getElementById('practice-form');
const practiceTag = document.getElementById('practice-tag');
const practiceQuestion = document.getElementById('practice-question');
const practiceMeta = document.getElementById('practice-meta');
const practiceCard = document.getElementById('practice-card');

practiceForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const textKey = document.getElementById('select-text').value;
  const skillKey = document.getElementById('select-skill').value;
  const result = PRACTICE_QUESTIONS[textKey][skillKey];

  practiceTag.textContent = TEXT_LABELS[textKey];
  practiceTag.className = `page-tag ${TEXT_TAGS[textKey]}`;
  practiceQuestion.textContent = result.q;
  practiceMeta.textContent = result.meta;

  practiceCard.style.transform = 'rotate(0deg)';
  requestAnimationFrame(() => {
    practiceCard.style.transform = 'rotate(0.6deg)';
  });
});
