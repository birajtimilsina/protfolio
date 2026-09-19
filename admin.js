const STORAGE_KEY = 'biraj_portfolio_content';
// NOTE: This is intentionally simple per requirement (hardcoded password).
const ADMIN_PASSWORD = 'admin123';
const AUTH_FLAG = 'biraj_portfolio_admin_unlocked';

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

const authOverlay = document.getElementById('auth-overlay');
const authForm = document.getElementById('auth-form');
const authError = document.getElementById('auth-error');
const passwordInput = document.getElementById('admin-password');
const adminForm = document.getElementById('admin-form');
const saveStatus = document.getElementById('save-status');
const resetButton = document.getElementById('reset-defaults');
const logoutButton = document.getElementById('logout-admin');

// Load previously saved content and merge with defaults to avoid missing fields.
function getStoredContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONTENT };
    return { ...DEFAULT_CONTENT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONTENT };
  }
}

// Fill each input/textarea with either saved content or placeholders.
function populateForm(content) {
  Object.keys(DEFAULT_CONTENT).forEach((field) => {
    const input = document.getElementById(field);
    if (input) {
      input.value = content[field] ?? DEFAULT_CONTENT[field];
    }
  });
}

// Convert all current form values into one object and persist to LocalStorage.
function saveForm(event) {
  event.preventDefault();
  const payload = {};

  Object.keys(DEFAULT_CONTENT).forEach((field) => {
    const input = document.getElementById(field);
    payload[field] = input ? input.value.trim() : DEFAULT_CONTENT[field];
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  saveStatus.textContent = 'Saved successfully. Open index.html to review the changes.';
}

// Remove saved content so the portfolio falls back to default placeholders.
function resetToDefaults() {
  localStorage.removeItem(STORAGE_KEY);
  populateForm(DEFAULT_CONTENT);
  saveStatus.textContent = 'Reset complete. Placeholder content restored.';
}

// Explicit lock button: clears session flag and re-opens password overlay.
function lockAdmin() {
  sessionStorage.removeItem(AUTH_FLAG);
  authOverlay.hidden = false;
  passwordInput.value = '';
  passwordInput.focus();
}

// Only skip password prompt if this browser tab already authenticated.
function unlockIfAuthenticated() {
  const isUnlocked = sessionStorage.getItem(AUTH_FLAG) === 'true';
  authOverlay.hidden = isUnlocked;
  if (!isUnlocked) {
    passwordInput.focus();
  }
}

// Password gate handler for admin access.
authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (passwordInput.value === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_FLAG, 'true');
    authOverlay.hidden = true;
    authError.textContent = '';
    document.getElementById('name').focus();
    return;
  }

  authError.textContent = 'Incorrect password.';
});

adminForm.addEventListener('submit', saveForm);
resetButton.addEventListener('click', resetToDefaults);
logoutButton.addEventListener('click', lockAdmin);

populateForm(getStoredContent());
unlockIfAuthenticated();
