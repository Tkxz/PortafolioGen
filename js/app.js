const $ = (id) => document.getElementById(id);

const state = {
  selectedTheme: 'nivel-ingeniero',
  aiMode: 'json',
  user: null,
  portfolios: [],
  userTemplates: [],
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function notify(message, type = 'info') {
  const container = $('toastContainer');
  if (!container) return;
  const palette = {
    success: 'border-emerald-500/30 bg-emerald-950/95 text-emerald-100',
    error: 'border-red-500/30 bg-red-950/95 text-red-100',
    warning: 'border-amber-500/30 bg-amber-950/95 text-amber-100',
    info: 'border-cyan-500/30 bg-slate-950/95 text-slate-100',
  };
  const toast = document.createElement('div');
  toast.className = `border ${palette[type] || palette.info} rounded-xl px-4 py-3 shadow-2xl backdrop-blur text-sm translate-y-2 opacity-0 transition-all duration-200`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 220);
  }, 3200);
}

function updateJsonValidation() {
  const field = $('jsonData');
  const status = $('jsonValidation');
  if (!field || !status) return false;
  try {
    const data = JSON.parse(field.value);
    if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error();
    status.className = 'text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5';
    status.innerHTML = '<span class="status-dot bg-emerald-500"></span> JSON válido';
    return true;
  } catch {
    status.className = 'text-[11px] font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5';
    status.innerHTML = '<span class="status-dot bg-red-500"></span> JSON inválido';
    return false;
  }
}

function updateAiCharCount() {
  const field = $('aiRawText');
  const counter = $('aiCharCount');
  if (!field || !counter) return;
  counter.textContent = `${field.value.length} / 30000`;
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      state.user = null;
      state.portfolios = [];
      state.userTemplates = [];
      renderProfileArea();
      renderMyPortfoliosBox();
      renderMyTemplatesBox();
      renderThemeGrid();
    }
    throw new Error(body.error || body.detail || `Error ${response.status}`);
  }

  return body;
}

function getUserThemeKey(id) {
  return `user-${id}`;
}

function getAllThemes() {
  const themes = { ...PORTFOLIO_THEMES };
  state.userTemplates.forEach((tpl) => {
    themes[getUserThemeKey(tpl.id)] = {
      id: getUserThemeKey(tpl.id),
      name: tpl.name,
      description: tpl.description || 'Plantilla personalizada creada con IA.',
      swatches: Array.isArray(tpl.swatches) && tpl.swatches.length ? tpl.swatches : ['#0f172a', '#06b6d4', '#f8fafc'],
      template: tpl.template,
      userTemplateId: tpl.id,
    };
  });
  return themes;
}

function getSelectedTheme() {
  const themes = getAllThemes();
  return themes[state.selectedTheme] || themes['nivel-ingeniero'];
}

function renderThemeGrid() {
  const grid = $('themeGrid');
  if (!grid) return;
  grid.innerHTML = '';

  Object.values(getAllThemes()).forEach((theme) => {
    const selected = theme.id === state.selectedTheme;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `text-left p-4 rounded-xl border-2 transition duration-300 ${
      selected
        ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
    }`;

    const badge = theme.userTemplateId
      ? '<span class="text-[10px] uppercase tracking-wider bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 px-2 py-0.5 rounded-full">IA</span>'
      : '';

    card.innerHTML = `
      <div class="flex items-center justify-between gap-2 mb-3">
        <div class="flex items-center gap-2">
          ${(theme.swatches || []).slice(0, 3).map((color) => `
            <span title="${escapeHtml(color)}" style="display:inline-block;width:16px;height:16px;min-width:16px;min-height:16px;border-radius:9999px;background-color:${color};border:1px solid rgba(255,255,255,0.25);box-shadow:0 0 7px ${color}55;flex-shrink:0;"></span>
          `).join('')}
        </div>
        ${badge}
      </div>
      <span class="block font-semibold text-white text-sm mb-1">${escapeHtml(theme.name)}</span>
      <span class="text-xs leading-relaxed ${selected ? 'text-cyan-300' : 'text-slate-500'}">${escapeHtml(theme.description)}</span>
    `;

    card.addEventListener('click', () => {
      state.selectedTheme = theme.id;
      renderThemeGrid();
    });

    grid.appendChild(card);
  });
}

function setAiMode(mode) {
  state.aiMode = mode === 'template' ? 'template' : 'json';
  const jsonBtn = $('aiModeJson');
  const templateBtn = $('aiModeTemplate');
  const textarea = $('aiRawText');
  const help = $('aiModeHelp');
  const generateBtn = $('aiGenerateBtn');

  const active = 'rounded-lg py-2 px-2 text-xs font-bold bg-fuchsia-600 text-white transition-all shadow-lg shadow-fuchsia-600/20';
  const inactive = 'rounded-lg py-2 px-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all';

  jsonBtn.className = state.aiMode === 'json' ? active : inactive;
  templateBtn.className = state.aiMode === 'template' ? active : inactive;

  if (state.aiMode === 'json') {
    textarea.placeholder = 'Ej: Soy desarrollador backend junior. Manejo Python, FastAPI, MySQL...';
    help.textContent = 'Pega tu CV o descripción profesional. La IA lo convertirá al JSON que usa tu portafolio.';
    generateBtn.textContent = 'Organizar con IA';
  } else {
    textarea.placeholder = 'Ej: Quiero una página negra y roja, hero centrado, tarjetas glassmorphism, animaciones suaves al hacer scroll, proyectos en dos columnas...';
    help.textContent = 'Describe cómo quieres la página: colores, animaciones, posiciones, tipografía, estilo y secciones. Se usará el JSON actual como contenido.';
    generateBtn.textContent = 'Generar página con IA';
  }

  $('aiStatus').textContent = '';
}

function showGenerationOverlay() {
  const overlay = $('pageGenerationOverlay');
  const bar = $('pageGenerationBar');
  const text = $('pageGenerationText');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  bar.style.width = '8%';
  text.textContent = 'Analizando colores, estructura y animaciones...';

  setTimeout(() => {
    if (!overlay.classList.contains('hidden')) {
      bar.style.width = '42%';
      text.textContent = 'Construyendo la estructura de tu portafolio...';
    }
  }, 700);
  setTimeout(() => {
    if (!overlay.classList.contains('hidden')) {
      bar.style.width = '72%';
      text.textContent = 'Aplicando estilos y detalles visuales...';
    }
  }, 1600);
  setTimeout(() => {
    if (!overlay.classList.contains('hidden')) {
      bar.style.width = '90%';
      text.textContent = 'Terminando tu plantilla personalizada...';
    }
  }, 2400);
}

async function hideGenerationOverlay() {
  const overlay = $('pageGenerationOverlay');
  const bar = $('pageGenerationBar');
  if (!overlay) return;
  bar.style.width = '100%';
  await sleep(250);
  overlay.classList.add('hidden');
  bar.style.width = '0%';
}

function openAuthModal(mode = 'login') {
  $('authModal').classList.remove('hidden');
  switchAuthTab(mode);
  setTimeout(() => (mode === 'login' ? $('loginEmail') : $('registerName'))?.focus(), 0);
}

function closeAuthModal() {
  $('authModal').classList.add('hidden');
}

function switchAuthTab(mode) {
  const login = mode === 'login';
  $('loginForm').classList.toggle('hidden', !login);
  $('registerForm').classList.toggle('hidden', login);
  $('loginTab').className = `auth-tab rounded-lg py-2 text-sm font-semibold ${login ? 'bg-cyan-600 text-white' : 'text-slate-600 dark:text-slate-300'}`;
  $('registerTab').className = `auth-tab rounded-lg py-2 text-sm font-semibold ${!login ? 'bg-cyan-600 text-white' : 'text-slate-600 dark:text-slate-300'}`;
  setAuthStatus('');
}

function setAuthStatus(message, type = 'error') {
  const el = $('authStatus');
  el.textContent = message;
  el.className = `text-sm min-h-[1.25rem] mb-4 ${type === 'success' ? 'text-emerald-500' : 'text-red-500'}`;
}

function renderProfileArea() {
  const box = $('profileArea');
  if (!box) return;

  if (!state.user) {
    box.innerHTML = `<button id="openAuthBtn" class="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg transition">👤 Iniciar sesión</button>`;
    $('openAuthBtn').addEventListener('click', () => openAuthModal('login'));
    return;
  }

  box.innerHTML = `
    <span class="text-sm text-slate-700 dark:text-slate-300 hidden md:inline">Hola, ${escapeHtml(state.user.name)}</span>
    <button id="logoutBtn" class="text-xs bg-slate-200 dark:bg-slate-800 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg transition">Salir</button>
  `;
  $('logoutBtn').addEventListener('click', () => logout(true));
}

async function handleLogin(e) {
  e.preventDefault();
  setAuthStatus('');
  try {
    const result = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: $('loginEmail').value.trim(), password: $('loginPassword').value }),
    });
    state.user = result.user;
    closeAuthModal();
    renderProfileArea();
    await loadUserData();
  } catch (err) {
    setAuthStatus(err.message);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  setAuthStatus('');
  try {
    const result = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: $('registerName').value.trim(),
        email: $('registerEmail').value.trim(),
        password: $('registerPassword').value,
      }),
    });
    state.user = result.user;
    closeAuthModal();
    renderProfileArea();
    await loadUserData();
  } catch (err) {
    setAuthStatus(err.message);
  }
}

async function logout(showMessage = true) {
  try {
    await api('/api/auth/logout', { method: 'POST' });
  } catch (err) {
    console.error(err);
  }
  state.user = null;
  state.portfolios = [];
  state.userTemplates = [];
  if (state.selectedTheme.startsWith('user-')) state.selectedTheme = 'nivel-ingeniero';
  renderProfileArea();
  renderMyPortfoliosBox();
  renderMyTemplatesBox();
  renderThemeGrid();
  if (showMessage) alert('Sesión cerrada.');
}

async function restoreSession() {
  try {
    const result = await api('/api/auth/me');
    state.user = result.user || null;
    if (state.user) await loadUserData();
  } catch {
    state.user = null;
  }
}

async function loadUserData() {
  await Promise.all([loadTemplatesFromDb(), loadPortfoliosFromDb()]);
  renderThemeGrid();
}

async function loadPortfoliosFromDb() {
  if (!state.user) {
    state.portfolios = [];
    renderMyPortfoliosBox();
    return;
  }
  try {
    const result = await api('/api/portfolios');
    state.portfolios = result.portfolios || [];
  } catch (err) {
    state.portfolios = [];
    console.error(err);
  }
  renderMyPortfoliosBox();
}

async function loadTemplatesFromDb() {
  if (!state.user) {
    state.userTemplates = [];
    renderMyTemplatesBox();
    return;
  }
  try {
    const result = await api('/api/templates');
    state.userTemplates = result.templates || [];
  } catch (err) {
    state.userTemplates = [];
    console.error(err);
  }
  renderMyTemplatesBox();
}

function renderMyPortfoliosBox() {
  const list = $('myPortfoliosList');
  if (!list) return;

  if (!state.user) {
    list.innerHTML = `<div class="text-sm text-slate-500 space-y-2"><p>Inicia sesión para guardar y recuperar portafolios desde MySQL.</p><button id="historyLoginBtn" class="text-cyan-500 hover:underline">Iniciar sesión</button></div>`;
    $('historyLoginBtn').addEventListener('click', () => openAuthModal('login'));
    return;
  }

  if (!state.portfolios.length) {
    list.innerHTML = '<p class="text-sm text-slate-500">No tienes portafolios guardados en la base de datos.</p>';
    return;
  }

  const themes = getAllThemes();
  list.innerHTML = state.portfolios.map((p) => `
    <div class="flex items-center justify-between gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
      <div class="min-w-0">
        <p class="text-sm font-medium text-slate-200 truncate">${escapeHtml(p.title)}</p>
        <p class="text-xs text-slate-500">${escapeHtml(themes[p.theme]?.name || p.theme)}</p>
      </div>
      <div class="flex gap-1 shrink-0">
        <button data-load="${p.id}" class="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded">Cargar</button>
        <button data-delete="${p.id}" class="text-xs bg-red-950 hover:bg-red-900 text-red-300 px-2 py-1 rounded">Eliminar</button>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-load]').forEach((btn) => btn.addEventListener('click', () => loadPortfolio(btn.dataset.load)));
  list.querySelectorAll('[data-delete]').forEach((btn) => btn.addEventListener('click', () => deletePortfolio(btn.dataset.delete)));
}

function renderMyTemplatesBox() {
  const list = $('myTemplatesList');
  if (!list) return;

  if (!state.user) {
    list.innerHTML = '<p class="text-sm text-slate-500">Tus plantillas personalizadas aparecerán aquí cuando inicies sesión.</p>';
    return;
  }

  if (!state.userTemplates.length) {
    list.innerHTML = '<p class="text-sm text-slate-500">Todavía no has generado plantillas con IA.</p>';
    return;
  }

  list.innerHTML = state.userTemplates.map((tpl) => `
    <div class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-3 space-y-2">
      <div class="flex items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="text-sm font-medium text-slate-200 truncate">${escapeHtml(tpl.name)}</p>
          <p class="text-xs text-slate-500 line-clamp-2">${escapeHtml(tpl.description)}</p>
        </div>
        <div class="flex gap-1">
          <button data-use-template="${tpl.id}" class="text-xs bg-fuchsia-950 hover:bg-fuchsia-900 text-fuchsia-300 px-2 py-1 rounded">Usar</button>
          <button data-delete-template="${tpl.id}" class="text-xs bg-red-950 hover:bg-red-900 text-red-300 px-2 py-1 rounded">✕</button>
        </div>
      </div>
      <div class="flex gap-1.5">${(tpl.swatches || []).slice(0, 3).map((c) => `<span style="width:14px;height:14px;border-radius:999px;background:${c};border:1px solid rgba(255,255,255,.2)"></span>`).join('')}</div>
    </div>
  `).join('');

  list.querySelectorAll('[data-use-template]').forEach((btn) => btn.addEventListener('click', () => {
    state.selectedTheme = getUserThemeKey(btn.dataset.useTemplate);
    renderThemeGrid();
    $('app-core').scrollIntoView({ behavior: 'smooth' });
  }));

  list.querySelectorAll('[data-delete-template]').forEach((btn) => btn.addEventListener('click', () => deleteTemplate(btn.dataset.deleteTemplate)));
}

async function saveCurrentPortfolio() {
  if (!state.user) {
    openAuthModal('login');
    setAuthStatus('Inicia sesión para guardar tu portafolio.');
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse($('jsonData').value);
  } catch {
    notify('El JSON tiene un error de formato.', 'error');
    return;
  }
  delete parsed.fotoUrl;

  try {
    await api('/api/portfolios', {
      method: 'POST',
      body: JSON.stringify({ title: parsed.nombre || 'Mi portafolio', theme: state.selectedTheme, data: parsed }),
    });
    await loadPortfoliosFromDb();
    notify('Portafolio guardado correctamente.', 'success');
  } catch (err) {
    notify(err.message, 'error');
  }
}

function loadPortfolio(id) {
  const found = state.portfolios.find((p) => String(p.id) === String(id));
  if (!found) return;
  $('jsonData').value = JSON.stringify(found.data, null, 2);
  updateJsonValidation();
  state.selectedTheme = getAllThemes()[found.theme] ? found.theme : 'nivel-ingeniero';
  renderThemeGrid();
  $('app-core').scrollIntoView({ behavior: 'smooth' });
}

async function deletePortfolio(id) {
  if (!confirm('¿Eliminar este portafolio de MySQL?')) return;
  try {
    await api(`/api/portfolios/${encodeURIComponent(id)}`, { method: 'DELETE' });
    await loadPortfoliosFromDb();
  } catch (err) {
    notify(err.message, 'error');
  }
}

async function deleteTemplate(id) {
  if (!confirm('¿Eliminar esta plantilla personalizada?')) return;
  try {
    await api(`/api/templates/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (state.selectedTheme === getUserThemeKey(id)) state.selectedTheme = 'nivel-ingeniero';
    await loadTemplatesFromDb();
    renderThemeGrid();
  } catch (err) {
    notify(err.message, 'error');
  }
}

async function generateJsonMode(rawText, status, btn) {
  const result = await api('/api/ai/generate', {
    method: 'POST',
    body: JSON.stringify({ text: rawText, mode: 'json' }),
  });
  if (result.data) delete result.data.fotoUrl;
  $('jsonData').value = JSON.stringify(result.data, null, 2);
  updateJsonValidation();
  status.textContent = '¡Listo! Revisa el JSON generado.';
  status.className = 'text-xs text-emerald-400 text-center';
  btn.textContent = 'Organizar con IA';
}

async function generateTemplateMode(rawText, status, btn) {
  let profileData;
  try {
    profileData = JSON.parse($('jsonData').value);
  } catch {
    throw new Error('El JSON del portafolio no es válido. Corrígelo antes de generar la página.');
  }
  delete profileData.fotoUrl;

  showGenerationOverlay();
  const started = Date.now();

  try {
    const result = await api('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ text: rawText, mode: 'template', profile_data: profileData }),
    });

    const elapsed = Date.now() - started;
    if (elapsed < 3000) await sleep(3000 - elapsed);

    const generated = result.data;
    const saved = await api('/api/templates', {
      method: 'POST',
      body: JSON.stringify({
        name: generated.name,
        description: generated.description,
        prompt: rawText,
        swatches: generated.swatches,
        template: generated.template,
      }),
    });

    await loadTemplatesFromDb();
    state.selectedTheme = getUserThemeKey(saved.id);
    renderThemeGrid();
    status.textContent = `Plantilla “${saved.name}” creada, guardada en tu perfil y seleccionada.`;
    status.className = 'text-xs text-emerald-400 text-center';
  } finally {
    await hideGenerationOverlay();
    btn.textContent = 'Generar página con IA';
  }
}

async function handleAiGenerate() {
  const rawText = $('aiRawText').value.trim();
  const status = $('aiStatus');
  const btn = $('aiGenerateBtn');

  if (!state.user) {
    status.textContent = 'Inicia sesión para usar la IA.';
    status.className = 'text-xs text-amber-400 text-center';
    openAuthModal('login');
    return;
  }

  if (rawText.length < 20) {
    status.textContent = 'Escribe al menos 20 caracteres.';
    status.className = 'text-xs text-amber-400 text-center';
    return;
  }

  btn.disabled = true;
  btn.textContent = state.aiMode === 'template' ? 'Diseñando...' : 'Generando...';
  status.textContent = state.aiMode === 'template' ? 'Creando una plantilla personalizada...' : 'Procesando con IA...';
  status.className = 'text-xs text-slate-500 text-center';

  try {
    if (state.aiMode === 'template') {
      await generateTemplateMode(rawText, status, btn);
    } else {
      await generateJsonMode(rawText, status, btn);
    }
  } catch (err) {
    status.textContent = err.message;
    status.className = 'text-xs text-red-400 text-center';
    if (!$('pageGenerationOverlay').classList.contains('hidden')) await hideGenerationOverlay();
  } finally {
    btn.disabled = false;
    btn.textContent = state.aiMode === 'template' ? 'Generar página con IA' : 'Organizar con IA';
  }
}

function handleDownload(e) {
  e.preventDefault();

  let data;
  try {
    data = JSON.parse($('jsonData').value);
  } catch {
    notify('El JSON tiene un error de formato.', 'error');
    return;
  }
  delete data.fotoUrl;

  const theme = getSelectedTheme();
  if (!theme) {
    notify('No se encontró la plantilla seleccionada.', 'error');
    return;
  }

  let htmlFinal;
  try {
    htmlFinal = Handlebars.compile(theme.template)(data);
  } catch (err) {
    console.error(err);
    notify('La plantilla tiene un error y no se pudo compilar.', 'error');
    return;
  }

  const blob = new Blob([htmlFinal], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const fileName = (data.nombre || 'portafolio')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  a.href = url;
  a.download = `portafolio-${fileName}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('successBox').classList.remove('hidden');
  notify('HTML generado y listo para publicar.', 'success');
}

async function init() {
  renderThemeGrid();
  setAiMode('json');
  await restoreSession();
  renderProfileArea();
  renderMyPortfoliosBox();
  renderMyTemplatesBox();
  renderThemeGrid();
  updateJsonValidation();
  updateAiCharCount();

  $('jsonData')?.addEventListener('input', updateJsonValidation);
  $('aiRawText')?.addEventListener('input', updateAiCharCount);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('authModal')?.classList.contains('hidden')) closeAuthModal();
  });

  $('generatorForm')?.addEventListener('submit', handleDownload);
  $('saveBtn')?.addEventListener('click', saveCurrentPortfolio);
  $('aiGenerateBtn')?.addEventListener('click', handleAiGenerate);
  $('aiModeJson')?.addEventListener('click', () => setAiMode('json'));
  $('aiModeTemplate')?.addEventListener('click', () => setAiMode('template'));
  $('loginForm')?.addEventListener('submit', handleLogin);
  $('registerForm')?.addEventListener('submit', handleRegister);
  $('loginTab')?.addEventListener('click', () => switchAuthTab('login'));
  $('registerTab')?.addEventListener('click', () => switchAuthTab('register'));
  $('closeAuthModal')?.addEventListener('click', closeAuthModal);
  $('authModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'authModal') closeAuthModal();
  });
}

document.addEventListener('DOMContentLoaded', init);
