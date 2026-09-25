const $ = (id) => document.getElementById(id);

const state = {
  selectedTheme: 'nivel-ingeniero',
  user: null,
  portfolios: []
};

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

async function api(path, options = {}) {
  const headers = {
    ...(options.headers || {})
  };

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: 'include'
  });

  if (response.status === 204) {
    return null;
  }

  const body = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      body.detail ||
      body.error ||
      `Error ${response.status}`
    );
  }

  return body;
}

function renderThemeGrid() {
  const grid = $('themeGrid');

  if (!grid) return;

  grid.innerHTML = '';

  Object.values(PORTFOLIO_THEMES).forEach((theme) => {
    const selected =
      theme.id === state.selectedTheme;

    const card =
      document.createElement('button');

    card.type = 'button';

    card.className =
      `text-left p-4 rounded-xl border-2 transition duration-300 ${
        selected
          ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
      }`;

    card.innerHTML = `
      <div class="flex items-center gap-2 mb-3">
        ${theme.swatches.map((color) => `
          <span
            title="${color}"
            style="
              display:inline-block;
              width:16px;
              height:16px;
              min-width:16px;
              min-height:16px;
              border-radius:9999px;
              background-color:${color};
              border:1px solid rgba(255,255,255,0.25);
              box-shadow:0 0 7px ${color}55;
              flex-shrink:0;
            ">
          </span>
        `).join('')}
      </div>

      <span class="block font-semibold text-white text-sm mb-1">
        ${escapeHtml(theme.name)}
      </span>

      <span class="text-xs leading-relaxed ${
        selected
          ? 'text-cyan-300'
          : 'text-slate-500'
      }">
        ${escapeHtml(theme.description)}
      </span>
    `;

    card.addEventListener('click', () => {
      state.selectedTheme = theme.id;
      renderThemeGrid();
    });

    grid.appendChild(card);
  });
}

function openAuthModal(mode = 'login') {
  $('authModal').classList.remove('hidden');

  switchAuthTab(mode);
}

function closeAuthModal() {
  $('authModal').classList.add('hidden');
}

function switchAuthTab(mode) {
  const login = mode === 'login';

  $('loginForm').classList.toggle(
    'hidden',
    !login
  );

  $('registerForm').classList.toggle(
    'hidden',
    login
  );

  $('loginTab').className =
    `auth-tab rounded-lg py-2 text-sm font-semibold ${
      login
        ? 'bg-cyan-600 text-white'
        : 'text-slate-600 dark:text-slate-300'
    }`;

  $('registerTab').className =
    `auth-tab rounded-lg py-2 text-sm font-semibold ${
      !login
        ? 'bg-cyan-600 text-white'
        : 'text-slate-600 dark:text-slate-300'
    }`;

  setAuthStatus('');
}

function setAuthStatus(
  message,
  type = 'error'
) {
  const el = $('authStatus');

  el.textContent = message;

  el.className =
    `text-sm min-h-[1.25rem] mb-4 ${
      type === 'success'
        ? 'text-emerald-500'
        : 'text-red-500'
    }`;
}

function renderProfileArea() {
  const box = $('profileArea');

  if (!box) return;

  if (!state.user) {
    box.innerHTML = `
      <button
        id="openAuthBtn"
        class="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg transition">
        👤 Iniciar sesión
      </button>
    `;

    $('openAuthBtn').addEventListener(
      'click',
      () => openAuthModal('login')
    );

    return;
  }

  box.innerHTML = `
    <span class="text-sm text-slate-700 dark:text-slate-300 hidden md:inline">
      Hola, ${escapeHtml(state.user.name)}
    </span>

    <button
      id="logoutBtn"
      class="text-xs bg-slate-200 dark:bg-slate-800 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg transition">
      Salir
    </button>
  `;

  $('logoutBtn').addEventListener(
    'click',
    logout
  );
}

async function handleLogin(e) {
  e.preventDefault();

  setAuthStatus('');

  try {
    const result = await api(
      '/api/auth/login',
      {
        method: 'POST',

        body: JSON.stringify({
          email: $('loginEmail').value.trim(),
          password: $('loginPassword').value
        })
      }
    );

    state.user = result.user;

    $('loginPassword').value = '';

    closeAuthModal();

    renderProfileArea();

    await loadPortfoliosFromDb();

  } catch (err) {
    setAuthStatus(err.message);
  }
}

async function handleRegister(e) {
  e.preventDefault();

  setAuthStatus('');

  try {
    const result = await api(
      '/api/auth/register',
      {
        method: 'POST',

        body: JSON.stringify({
          name: $('registerName').value.trim(),
          email: $('registerEmail').value.trim(),
          password: $('registerPassword').value
        })
      }
    );

    state.user = result.user;

    $('registerPassword').value = '';

    closeAuthModal();

    renderProfileArea();

    await loadPortfoliosFromDb();

  } catch (err) {
    setAuthStatus(err.message);
  }
}

async function logout() {
  try {
    await api(
      '/api/auth/logout',
      {
        method: 'POST'
      }
    );

  } catch (err) {
    console.error(err);
  }

  state.user = null;
  state.portfolios = [];

  renderProfileArea();
  renderMyPortfoliosBox();
}

async function restoreSession() {
  try {
    const result = await api(
      '/api/auth/me'
    );

    state.user =
      result.user || null;

    if (state.user) {
      await loadPortfoliosFromDb();
    }

  } catch (err) {
    console.error(
      'No se pudo restaurar la sesión:',
      err
    );

    state.user = null;
  }
}

async function loadPortfoliosFromDb() {
  if (!state.user) {
    state.portfolios = [];

    renderMyPortfoliosBox();

    return;
  }

  try {
    const result = await api(
      '/api/portfolios'
    );

    state.portfolios =
      result.portfolios || [];

  } catch (err) {
    state.portfolios = [];

    console.error(err);
  }

  renderMyPortfoliosBox();
}

function renderMyPortfoliosBox() {
  const list = $('myPortfoliosList');

  if (!list) return;

  if (!state.user) {
    list.innerHTML = `
      <div class="text-sm text-slate-500 space-y-2">

        <p>
          Inicia sesión para guardar y recuperar
          portafolios desde MySQL.
        </p>

        <button
          id="historyLoginBtn"
          class="text-cyan-500 hover:underline">
          Iniciar sesión
        </button>

      </div>
    `;

    $('historyLoginBtn').addEventListener(
      'click',
      () => openAuthModal('login')
    );

    return;
  }

  if (!state.portfolios.length) {
    list.innerHTML = `
      <p class="text-sm text-slate-500">
        No tienes portafolios guardados
        en la base de datos.
      </p>
    `;

    return;
  }

  list.innerHTML = state.portfolios
    .map((p) => `
      <div
        class="flex items-center justify-between gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">

        <div class="min-w-0">

          <p class="text-sm font-medium text-slate-200 truncate">
            ${escapeHtml(p.title)}
          </p>

          <p class="text-xs text-slate-500">
            ${
              escapeHtml(
                PORTFOLIO_THEMES[p.theme]?.name
                || p.theme
              )
            }
          </p>

        </div>

        <div class="flex gap-1 shrink-0">

          <button
            data-load="${p.id}"
            class="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded">
            Cargar
          </button>

          <button
            data-delete="${p.id}"
            class="text-xs bg-red-950 hover:bg-red-900 text-red-300 px-2 py-1 rounded">
            Eliminar
          </button>

        </div>

      </div>
    `)
    .join('');

  list
    .querySelectorAll('[data-load]')
    .forEach((btn) => {

      btn.addEventListener(
        'click',
        () => loadPortfolio(
          btn.dataset.load
        )
      );
    });

  list
    .querySelectorAll('[data-delete]')
    .forEach((btn) => {

      btn.addEventListener(
        'click',
        () => deletePortfolio(
          btn.dataset.delete
        )
      );
    });
}

async function saveCurrentPortfolio() {
  if (!state.user) {
    openAuthModal('login');

    setAuthStatus(
      'Inicia sesión para guardar tu portafolio.'
    );

    return;
  }

  let parsed;

  try {
    parsed = JSON.parse(
      $('jsonData').value
    );

  } catch {
    alert(
      'El JSON tiene un error de formato.'
    );

    return;
  }

  delete parsed.fotoUrl;

  try {
    await api(
      '/api/portfolios',
      {
        method: 'POST',

        body: JSON.stringify({
          title:
            parsed.nombre ||
            'Mi portafolio',

          theme:
            state.selectedTheme,

          data:
            parsed
        })
      }
    );

    await loadPortfoliosFromDb();

    alert(
      'Portafolio guardado correctamente.'
    );

  } catch (err) {
    alert(err.message);
  }
}

function loadPortfolio(id) {
  const found =
    state.portfolios.find(
      (p) =>
        String(p.id) ===
        String(id)
    );

  if (!found) return;

  const data = {
    ...found.data
  };

  delete data.fotoUrl;

  $('jsonData').value =
    JSON.stringify(
      data,
      null,
      2
    );

  state.selectedTheme =
    found.theme ||
    'nivel-ingeniero';

  renderThemeGrid();

  const appCore =
    $('app-core');

  if (appCore) {
    appCore.scrollIntoView({
      behavior: 'smooth'
    });
  }
}

async function deletePortfolio(id) {
  if (
    !confirm(
      '¿Eliminar este portafolio de MySQL?'
    )
  ) {
    return;
  }

  try {
    await api(
      `/api/portfolios/${encodeURIComponent(id)}`,
      {
        method: 'DELETE'
      }
    );

    await loadPortfoliosFromDb();

  } catch (err) {
    alert(err.message);
  }
}

async function handleAiGenerate() {
  const rawText =
    $('aiRawText').value.trim();

  const status =
    $('aiStatus');

  const btn =
    $('aiGenerateBtn');

  if (!state.user) {
    status.textContent =
      'Inicia sesión para usar la IA.';

    status.className =
      'text-xs text-amber-400 text-center';

    openAuthModal('login');

    return;
  }

  if (rawText.length < 20) {
    status.textContent =
      'Escribe al menos 20 caracteres.';

    status.className =
      'text-xs text-amber-400 text-center';

    return;
  }

  btn.disabled = true;

  btn.textContent =
    'Generando...';

  status.textContent =
    'Procesando con IA...';

  try {
    const result = await api(
      '/api/ai/generate',
      {
        method: 'POST',

        body: JSON.stringify({
          text: rawText
        })
      }
    );

    if (result.data) {
      delete result.data.fotoUrl;
    }

    $('jsonData').value =
      JSON.stringify(
        result.data,
        null,
        2
      );

    status.textContent =
      '¡Listo! Revisa el JSON generado.';

    status.className =
      'text-xs text-emerald-400 text-center';

  } catch (err) {
    status.textContent =
      err.message;

    status.className =
      'text-xs text-red-400 text-center';

  } finally {
    btn.disabled = false;

    btn.textContent =
      'Organizar con IA';
  }
}

function handleDownload(e) {
  e.preventDefault();

  let data;

  try {
    data =
      JSON.parse(
        $('jsonData').value
      );

  } catch {
    alert(
      '¡Error en el formato JSON!'
    );

    return;
  }

  delete data.fotoUrl;

  const theme =
    PORTFOLIO_THEMES[state.selectedTheme] ||
    PORTFOLIO_THEMES['nivel-ingeniero'];

  if (!theme) {
    alert(
      'No se encontró la plantilla seleccionada.'
    );

    return;
  }

  const htmlFinal =
    Handlebars.compile(
      theme.template
    )(data);

  const blob =
    new Blob(
      [htmlFinal],
      {
        type: 'text/html'
      }
    );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement('a');

  const fileName =
    (data.nombre || 'portafolio')
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      );

  a.href = url;

  a.download =
    `portafolio-${fileName}.html`;

  document.body.appendChild(a);

  a.click();

  a.remove();

  setTimeout(
    () =>
      URL.revokeObjectURL(url),
    1000
  );

  const successBox =
    $('successBox');

  if (successBox) {
    successBox.classList.remove(
      'hidden'
    );
  }
}

async function init() {
  renderThemeGrid();

  await restoreSession();

  renderProfileArea();

  renderMyPortfoliosBox();

  $('generatorForm')
    ?.addEventListener(
      'submit',
      handleDownload
    );

  $('saveBtn')
    ?.addEventListener(
      'click',
      saveCurrentPortfolio
    );

  $('aiGenerateBtn')
    ?.addEventListener(
      'click',
      handleAiGenerate
    );

  $('loginForm')
    ?.addEventListener(
      'submit',
      handleLogin
    );

  $('registerForm')
    ?.addEventListener(
      'submit',
      handleRegister
    );

  $('loginTab')
    ?.addEventListener(
      'click',
      () =>
        switchAuthTab('login')
    );

  $('registerTab')
    ?.addEventListener(
      'click',
      () =>
        switchAuthTab('register')
    );

  $('closeAuthModal')
    ?.addEventListener(
      'click',
      closeAuthModal
    );

  $('authModal')
    ?.addEventListener(
      'click',
      (e) => {

        if (
          e.target.id ===
          'authModal'
        ) {
          closeAuthModal();
        }
      }
    );
}

document.addEventListener(
  'DOMContentLoaded',
  init
);