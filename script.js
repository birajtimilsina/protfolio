// Shared key for all portfolio data saved from admin.html.
const STORAGE_KEY = 'biraj_portfolio_content';

// Default placeholders shown when no saved data exists.
const DEFAULT_CONTENT = {
  name: '[BIRAJ - INSERT YOUR NAME HERE]',
  jobTitle: '[BIRAJ - INSERT JOB TITLE HERE]',
  profileImage:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/300px-No-Image-Placeholder.svg.png',
  born: '[BIRAJ - INSERT DATE OF BIRTH HERE]',
  nationality: '[BIRAJ - INSERT NATIONALITY HERE]',
  experience: '[BIRAJ - INSERT YEARS OF EXPERIENCE HERE]',
  summary: '[BIRAJ - INSERT PROFESSIONAL SUMMARY HERE]',
  education: '[BIRAJ - INSERT EARLY LIFE AND EDUCATION DETAILS HERE]',
  career: '[BIRAJ - INSERT CAREER DETAILS HERE]',
  skills:
    '[BIRAJ - INSERT SKILL 1 HERE], [BIRAJ - INSERT SKILL 2 HERE], [BIRAJ - INSERT SKILL 3 HERE]',
  projects:
    '[BIRAJ - INSERT PROJECT 1 TITLE + BRIEF DESCRIPTION HERE]\n[BIRAJ - INSERT PROJECT 2 TITLE + BRIEF DESCRIPTION HERE]',
  email: '[BIRAJ - INSERT EMAIL HERE]',
  website: '[BIRAJ - INSERT WEBSITE URL HERE]',
  linkedin: '[BIRAJ - INSERT LINKEDIN URL HERE]',
};

/**
 * Read data from LocalStorage and safely merge with defaults.
 */
function getPortfolioContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONTENT };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONTENT, ...parsed };
  } catch {
    return { ...DEFAULT_CONTENT };
  }
}

/**
 * Populate all elements that declare a data-field attribute.
 */
function applyContent(data) {
  document.title = `${data.name} - Wikipedia`;

  document.querySelectorAll('[data-field]').forEach((el) => {
    const field = el.getAttribute('data-field');
    const value = data[field];
    if (!value) return;

    if (el.tagName === 'IMG') {
      el.src = value;
      return;
    }

    el.textContent = value;
  });

  const email = document.getElementById('contact-email');
  const website = document.getElementById('contact-website');
  const linkedin = document.getElementById('contact-linkedin');

  email.href = data.email.includes('@') ? `mailto:${data.email}` : '#';
  website.href = data.website.startsWith('http') ? data.website : '#';
  linkedin.href = data.linkedin.startsWith('http') ? data.linkedin : '#';

  renderList('skills-list', data.skills, ',');
  renderProjects(data.projects);
}

/**
 * Render simple list content split by delimiter.
 */
function renderList(listId, value, delimiter) {
  const list = document.getElementById(listId);
  list.innerHTML = '';

  value
    .split(delimiter)
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
}

/**
 * Render projects using wikipedia-like references marker [1], [2], ...
 */
function renderProjects(projectText) {
  const list = document.getElementById('projects-list');
  list.innerHTML = '';

  projectText
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = item;

      const citation = document.createElement('sup');
      citation.textContent = ` [${index + 1}]`;
      li.appendChild(citation);
      list.appendChild(li);
    });
}

/**
 * Build TOC from all H2 sections in the article.
 */
function buildTOC() {
  const headings = Array.from(document.querySelectorAll('.content-section h2'));
  const toc = document.getElementById('toc-list');
  toc.innerHTML = '';

  headings.forEach((heading, index) => {
    const section = heading.closest('section');
    if (!section.id) {
      section.id = `section-${index + 1}`;
    }

    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.textContent = `${index + 1}. ${heading.textContent}`;
    li.appendChild(link);
    toc.appendChild(li);
  });
}

/**
 * Enable hide/show toggle for TOC.
 */
function setupTOCToggle() {
  const button = document.getElementById('toc-toggle');
  const toc = document.getElementById('toc-list');

  button.addEventListener('click', () => {
    const hidden = toc.hidden;
    toc.hidden = !hidden;
    button.textContent = hidden ? 'hide' : 'show';
    button.setAttribute('aria-expanded', String(hidden));
  });
}

/**
 * Fade sections in as they enter viewport.
 */
function setupScrollAnimations() {
  const targets = document.querySelectorAll('.fade-target');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((target) => observer.observe(target));
}

applyContent(getPortfolioContent());
buildTOC();
setupTOCToggle();
setupScrollAnimations();
