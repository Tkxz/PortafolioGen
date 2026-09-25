/**
 * Temas disponibles para el portafolio generado.
 * Cada tema es un objeto con metadata (para la UI del selector) y un `template`
 * en formato Handlebars que se compila con los datos del usuario (JSON).
 */

const PORTFOLIO_THEMES = {
  'nivel-ingeniero': {
    id: 'nivel-ingeniero',
    name: 'Nivel Ingeniero',
    description: 'One-page premium: hero, stack, experiencia y proyectos con animaciones GSAP. Para perfiles senior.',
    swatches: ['#090909', '#C1121F', '#F8F9FA'],
    notes:
      'Admite campos opcionales extra: estado, cvUrl, email, redes {github, linkedin, twitter}, experiencia [] y tecnologias []. Sin ellos también se ve bien, solo con nombre/subtitulo/biografia/habilidades/proyectos.',
    template: `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Portafolio de {{nombre}}, {{subtitulo}}.">
    <meta name="theme-color" content="#090909">
    <title>{{nombre}} | {{subtitulo}}</title>

    <meta property="og:title" content="{{nombre}} | {{subtitulo}}">
    <meta property="og:description" content="{{biografia}}">
    <meta property="og:type" content="website">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">

    <script src="https://unpkg.com/@phosphor-icons/web"></script>

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        dark: '#090909',
                        darker: '#161616',
                        redMain: '#C1121F',
                        redBright: '#E63946',
                        light: '#F8F9FA',
                        grayText: '#B0B0B0'
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <style>
        :root {
            --bg-color: #090909;
            --text-color: #F8F9FA;
            --primary: #C1121F;
            --accent: #E63946;
        }
        body { background-color: var(--bg-color); color: var(--text-color); overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::selection { background-color: var(--accent); color: var(--text-color); }
        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: var(--bg-color); }
        ::-webkit-scrollbar-thumb { background: var(--darker); border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb:hover { background: var(--primary); }
        .glass-nav { background: rgba(9, 9, 9, 0.6); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255, 255, 255, 0.03); }
        .glass-card { background: linear-gradient(145deg, rgba(22, 22, 22, 0.8), rgba(9, 9, 9, 0.9)); border: 1px solid rgba(176, 176, 176, 0.05); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .glass-card:hover { border-color: rgba(230, 57, 70, 0.4); transform: translateY(-5px); box-shadow: 0 15px 35px -10px rgba(230, 57, 70, 0.15); }
        .btn-primary { position: relative; background: linear-gradient(90deg, var(--primary), var(--accent)); border: 1px solid transparent; transition: all 0.3s ease; z-index: 1; }
        .btn-primary::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: inherit; border-radius: inherit; filter: blur(12px); opacity: 0.4; z-index: -1; transition: opacity 0.3s ease; }
        .btn-primary:hover::before { opacity: 0.8; }
        .btn-primary:hover { transform: scale(1.02); }
        .btn-secondary { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease; }
        .btn-secondary:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2); }
        .grid-bg { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 50px 50px; mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%); -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%); z-index: -1; pointer-events: none; }
        .timeline-dot { position: relative; }
        .timeline-dot::after { content: ''; position: absolute; left: -33px; top: 6px; width: 12px; height: 12px; border-radius: 50%; background: var(--bg-color); border: 2px solid var(--accent); z-index: 10; box-shadow: 0 0 10px rgba(230, 57, 70, 0.5); }
    </style>
</head>
<body class="antialiased selection:bg-redBright selection:text-white">

    <header class="fixed w-full top-0 z-50 glass-nav transition-all duration-300">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="#" class="font-display font-bold text-xl tracking-tight flex items-center gap-2" aria-label="Inicio">
                <span class="w-8 h-8 rounded-lg bg-redMain flex items-center justify-center text-sm"><i class="ph ph-code"></i></span>
                <span>{{nombre}}</span>
            </a>
            <nav class="hidden md:flex gap-8 text-sm font-medium text-grayText">
                <a href="#about" class="hover:text-white transition-colors">Sobre mí</a>
                <a href="#tech" class="hover:text-white transition-colors">Tecnologías</a>
                {{#if experiencia}}<a href="#experience" class="hover:text-white transition-colors">Experiencia</a>{{/if}}
                <a href="#projects" class="hover:text-white transition-colors">Proyectos</a>
                {{#if email}}<a href="#contact" class="hover:text-white transition-colors">Contacto</a>{{/if}}
            </nav>
            {{#if email}}
            <a href="#contact" class="hidden md:block btn-primary px-5 py-2 rounded-full text-sm font-semibold">Hablemos</a>
            {{else}}
            <a href="#projects" class="hidden md:block btn-primary px-5 py-2 rounded-full text-sm font-semibold">Ver Proyectos</a>
            {{/if}}
        </div>
    </header>

    <section id="about" class="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div class="grid-bg"></div>
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-redMain/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div class="max-w-5xl mx-auto px-6 w-full z-10">
            <div class="flex flex-col items-start hero-content">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
                    <span class="w-2 h-2 rounded-full bg-redBright animate-pulse"></span>
                    <span class="text-xs font-medium text-grayText tracking-wide uppercase">{{subtitulo}}</span>
                </div>
                <h1 class="font-display font-bold text-5xl md:text-7xl leading-tight mb-6">{{nombre}}</h1>
                <p class="text-lg text-grayText max-w-xl mb-10 leading-relaxed font-light">{{biografia}}</p>
                <div class="flex flex-wrap gap-4">
                    <a href="#projects" class="btn-primary px-8 py-3.5 rounded-full font-medium flex items-center gap-2">
                        Ver Proyectos <i class="ph ph-arrow-right"></i>
                    </a>
                    {{#if cvUrl}}
                    <a href="{{cvUrl}}" target="_blank" class="btn-secondary px-8 py-3.5 rounded-full font-medium flex items-center gap-2">
                        <i class="ph ph-download-simple"></i> Descargar CV
                    </a>
                    {{/if}}
                </div>
            </div>

        </div>

        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
            <span class="text-xs text-grayText uppercase tracking-widest">Scroll</span>
            <i class="ph ph-caret-down text-white"></i>
        </div>
    </section>

    <section id="tech" class="py-24 relative z-10">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-16 gs-reveal">
                <h2 class="font-display font-bold text-3xl md:text-5xl mb-4">Habilidades Dominadas</h2>
                <p class="text-grayText max-w-2xl mx-auto">Dominio profundo en herramientas modernas, priorizando rendimiento y seguridad.</p>
            </div>

            {{#if tecnologias}}
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {{#each tecnologias}}
                <div class="glass-card p-6 rounded-xl flex flex-col items-center justify-center gap-3 text-center gs-reveal">
                    <i class="ph ph-{{this.icono}} text-4xl text-grayText"></i>
                    <h3 class="font-medium text-sm">{{this.titulo}}</h3>
                    <p class="text-xs text-grayText">{{this.detalle}}</p>
                </div>
                {{/each}}
            </div>
            {{else}}
            <div class="flex flex-wrap justify-center gap-3 gs-reveal">
                {{#each habilidades}}
                <span class="glass-card px-4 py-2 rounded-full text-sm text-light">{{this}}</span>
                {{/each}}
            </div>
            {{/if}}
        </div>
    </section>

    {{#if experiencia}}
    <section id="experience" class="py-24 bg-darker/30 relative">
        <div class="max-w-4xl mx-auto px-6">
            <h2 class="font-display font-bold text-3xl md:text-5xl mb-16 gs-reveal">Trayectoria Profesional</h2>
            <div class="border-l border-white/10 pl-8 space-y-12 ml-4">
                {{#each experiencia}}
                <div class="timeline-dot gs-reveal">
                    <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h3 class="font-display font-bold text-xl text-white">{{this.cargo}}</h3>
                        <span class="text-redBright text-sm font-medium bg-redMain/10 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">{{this.periodo}}</span>
                    </div>
                    <p class="text-lg text-grayText mb-4">{{this.empresa}}</p>
                    <p class="text-sm text-grayText/80 leading-relaxed mb-4">{{this.descripcion}}</p>
                    {{#if this.tags}}
                    <div class="flex flex-wrap gap-2">
                        {{#each this.tags}}
                        <span class="text-xs border border-white/10 bg-white/5 px-2 py-1 rounded text-grayText">{{this}}</span>
                        {{/each}}
                    </div>
                    {{/if}}
                </div>
                {{/each}}
            </div>
        </div>
    </section>
    {{/if}}

    <section id="projects" class="py-32">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-end mb-16 gs-reveal">
                <div>
                    <h2 class="font-display font-bold text-3xl md:text-5xl mb-4">Proyectos Destacados</h2>
                    <p class="text-grayText max-w-xl">Casos de estudio donde la lógica de ingeniería se encuentra con el diseño de interfaces de alto nivel.</p>
                </div>
                {{#if redes.github}}
                <a href="{{redes.github}}" target="_blank" class="text-redBright hover:text-white transition-colors flex items-center gap-2 text-sm font-medium mt-4 md:mt-0">
                    Ver en GitHub <i class="ph ph-arrow-right"></i>
                </a>
                {{/if}}
            </div>

            <div class="grid md:grid-cols-2 gap-8">
                {{#each proyectos}}
                <div class="glass-card rounded-2xl overflow-hidden group gs-reveal">
                    <div class="h-64 overflow-hidden relative">
                        {{#if this.imagen}}
                        <div class="absolute inset-0 bg-darker/40 group-hover:bg-transparent transition-colors z-10"></div>
                        <img src="{{this.imagen}}" alt="{{this.titulo}}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out">
                        {{else}}
                        <div class="w-full h-full bg-gradient-to-br from-darker to-dark flex items-center justify-center">
                            <i class="ph ph-terminal-window text-6xl text-white/10"></i>
                        </div>
                        {{/if}}
                    </div>
                    <div class="p-8">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="font-display font-bold text-2xl group-hover:text-redBright transition-colors">{{this.titulo}}</h3>
                            <a href="{{this.enlace}}" target="_blank" aria-label="Ver proyecto" class="text-grayText hover:text-white transition-colors"><i class="ph ph-arrow-up-right text-2xl"></i></a>
                        </div>
                        <p class="text-sm text-grayText mb-6 leading-relaxed">{{this.descripcion}}</p>
                        {{#if this.tags}}
                        <div class="flex flex-wrap gap-2">
                            {{#each this.tags}}
                            <span class="text-xs bg-white/5 text-grayText px-2 py-1 rounded">{{this}}</span>
                            {{/each}}
                        </div>
                        {{/if}}
                    </div>
                </div>
                {{/each}}
            </div>
        </div>
    </section>

    {{#if email}}
    <section id="contact" class="py-24 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-redMain/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div class="max-w-3xl mx-auto px-6 text-center z-10 relative gs-reveal">
            <h2 class="font-display font-bold text-4xl md:text-6xl mb-6">Iniciemos un <br>Proyecto.</h2>
            <p class="text-grayText mb-10 max-w-xl mx-auto">¿Buscas escalar tu arquitectura tecnológica o llevar la experiencia de usuario de tu producto al siguiente nivel? Conversemos.</p>

            <div class="flex flex-wrap justify-center gap-4 mb-10">
                <a href="mailto:{{email}}" class="btn-primary px-8 py-3.5 rounded-full font-medium flex items-center gap-2">
                    <i class="ph ph-envelope-simple"></i> {{email}}
                </a>
            </div>

            <div class="flex justify-center gap-4">
                {{#if redes.github}}
                <a href="{{redes.github}}" target="_blank" class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-grayText hover:text-white hover:border-redBright transition-colors" aria-label="GitHub"><i class="ph ph-github-logo text-xl"></i></a>
                {{/if}}
                {{#if redes.linkedin}}
                <a href="{{redes.linkedin}}" target="_blank" class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-grayText hover:text-white hover:border-redBright transition-colors" aria-label="LinkedIn"><i class="ph ph-linkedin-logo text-xl"></i></a>
                {{/if}}
                {{#if redes.instagram}}
                <a href="{{redes.instagram}}" target="_blank" class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-grayText hover:text-white hover:border-redBright transition-colors" aria-label="Twitter/X"><i class="ph ph-twitter-logo text-xl"></i></a>
                {{/if}}
            </div>
        </div>
    </section>
    {{/if}}

    <footer class="border-t border-white/5 py-12 relative z-10 bg-darker/50">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="font-display font-bold text-xl tracking-tight flex items-center gap-2">
                <span class="w-6 h-6 rounded bg-redMain flex items-center justify-center"><i class="ph ph-code text-[10px]"></i></span>
                <span>{{nombre}}</span>
            </div>
            <p class="text-sm text-grayText">&copy; <span id="year"></span>. Diseñado y desarrollado con excelencia técnica.</p>
            <div class="flex gap-4">
                {{#if redes.github}}<a href="{{redes.github}}" target="_blank" class="text-grayText hover:text-white transition-colors" aria-label="GitHub"><i class="ph ph-github-logo text-xl"></i></a>{{/if}}
                {{#if redes.linkedin}}<a href="{{redes.linkedin}}" target="_blank" class="text-grayText hover:text-white transition-colors" aria-label="LinkedIn"><i class="ph ph-linkedin-logo text-xl"></i></a>{{/if}}
                {{#if redes.twitter}}<a href="{{redes.twitter}}" target="_blank" class="text-grayText hover:text-white transition-colors" aria-label="Twitter/X"><i class="ph ph-twitter-logo text-xl"></i></a>{{/if}}
            </div>
        </div>
    </footer>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.32/dist/lenis.min.js"></script>

    <script>
        var yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        if (window.Lenis && window.gsap) {
            var lenis = new Lenis({
                duration: 1.2,
                easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
                smooth: true,
                smoothTouch: false,
            });
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);

            gsap.registerPlugin(ScrollTrigger);
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
            gsap.ticker.lagSmoothing(0);

            var heroTl = gsap.timeline();
            heroTl.from('.glass-nav', { y: -100, opacity: 0, duration: 1, ease: 'power3.out' })
                .from('.hero-content > *', { y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }, '-=0.5')
                ;

            document.querySelectorAll('.gs-reveal').forEach(function (elem) {
                gsap.fromTo(elem, { autoAlpha: 0, y: 50 }, {
                    duration: 1, autoAlpha: 1, y: 0, ease: 'power3.out',
                    scrollTrigger: { trigger: elem, start: 'top 85%', toggleActions: 'play none none reverse' }
                });
            });
        }
    </script>
</body>
</html>`,
  },

  'terminal-red': {
    id: 'terminal-red',
    name: 'Terminal Red',
    description: 'Intro cinemática tipo bootloader, terminal interactiva y editor de código animado. Alto impacto.',
    swatches: ['#050505', '#C1121F', '#FF2D55'],
    notes:
      'Admite los mismos campos opcionales que "Nivel Ingeniero" (estado, cvUrl, email, redes, experiencia[]) más "sobreMi" (bio extendida) y "ubicacion". Incluye una intro animada tipo boot y una terminal interactiva.',
    template: `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{nombre}} | {{subtitulo}}</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        black: { DEFAULT: "#050505", secondary: "#111111" },
                        red: { primary: "#C1121F", bright: "#FF2D55" },
                        gray: { DEFAULT: "#B8B8B8" }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                    },
                    animation: {
                        'marquee': 'marquee 20s linear infinite',
                        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    },
                    keyframes: {
                        marquee: {
                            '0%': { transform: 'translateX(0%)' },
                            '100%': { transform: 'translateX(-50%)' },
                        }
                    }
                }
            }
        }
    </script>

    <style type="text/tailwindcss">
        @layer base {
            body {
                @apply bg-black text-white font-sans overflow-x-hidden selection:bg-red-primary selection:text-white;
                background-image:
                    linear-gradient(to right, rgba(17, 17, 17, 0.5) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(17, 17, 17, 0.5) 1px, transparent 1px);
                background-size: 40px 40px;
            }
        }

        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }

        .bg-code-snippet {
            @apply fixed text-white/5 font-mono text-sm pointer-events-none select-none z-0;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .blink-cursor { animation: blinkCursor 1s steps(1) infinite; }
        @keyframes blinkCursor { 50% { opacity: 0; } }
    </style>

    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.27/bundled/lenis.min.js"></script>
</head>
<body class="relative">

    <div class="bg-code-snippet top-20 left-10">if(success) { deploy(); }</div>
    <div class="bg-code-snippet bottom-20 right-10">SELECT * FROM projects;</div>
    <div class="bg-code-snippet top-1/2 left-5 rotate-90 tracking-widest">101010101</div>

    <div id="data-source" hidden>
        <span data-field="whoami">{{#if sobreMi}}{{sobreMi}}{{else}}{{biografia}}{{/if}}</span>
        <span data-field="status">{{#if estado}}{{estado}}{{else}}Optimizando rendimiento y shippeando código en producción.{{/if}}</span>
        <span class="skill-chip">{{#each habilidades}}{{this}}||{{/each}}</span>
    </div>

    <div id="bootloader" class="fixed inset-0 z-50 bg-black flex flex-col justify-end p-12 font-mono text-sm transition-opacity duration-1000">
        <div id="boot-text" class="space-y-2 text-gray"></div>
    </div>

    <div id="main-content" class="opacity-0 transition-opacity duration-1000">

        <nav id="navbar" class="fixed top-0 w-full z-40 transition-all duration-300 bg-transparent border-b border-transparent py-6">
            <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <a href="#" class="font-mono font-bold text-xl tracking-tighter">
                    <span class="text-red-primary">&lt;</span>{{nombre}}<span class="text-red-primary">/&gt;</span>
                </a>
                <ul class="hidden md:flex gap-8 text-sm font-medium text-gray">
                    <li><a href="#" class="hover:text-white transition-colors">Inicio</a></li>
                    <li><a href="#about" class="hover:text-white transition-colors">Sobre mí</a></li>
                    {{#if experiencia}}<li><a href="#experience" class="hover:text-white transition-colors">Experiencia</a></li>{{/if}}
                    <li><a href="#projects" class="hover:text-white transition-colors">Proyectos</a></li>
                    {{#if email}}<li><a href="#contact" class="hover:text-white transition-colors">Contacto</a></li>{{/if}}
                </ul>
                {{#if redes.github}}
                <a href="{{redes.github}}" target="_blank" class="hidden md:flex px-4 py-2 border border-white/10 rounded hover:border-red-primary/50 text-sm transition-colors items-center gap-2">
                    <i data-lucide="github" class="w-4 h-4"></i> GitHub
                </a>
                {{/if}}
            </div>
        </nav>

        <section class="relative min-h-screen flex items-center pt-20 overflow-hidden">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div class="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
                <div class="gsap-hero-left">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black-secondary border border-white/10 mb-6 font-mono text-xs text-gray">
                        <span class="w-2 h-2 rounded-full bg-red-bright animate-pulse-fast"></span>
                        {{subtitulo}}
                    </div>
                    <h1 class="text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray to-red-primary">
                        {{nombre}}
                    </h1>
                    <p class="text-gray text-lg mb-10 max-w-lg leading-relaxed">{{biografia}}</p>
                    <div class="flex flex-wrap gap-4">
                        <a href="#projects" class="group relative px-6 py-3 bg-white text-black font-medium rounded-lg transition-transform hover:scale-105 flex items-center gap-2">
                            Ver Proyectos <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                        </a>
                        {{#if cvUrl}}
                        <a href="{{cvUrl}}" target="_blank" class="px-6 py-3 bg-black-secondary text-white font-medium rounded-lg border border-white/10 hover:border-red-primary/50 transition-colors flex items-center gap-2">
                            <i data-lucide="download" class="w-4 h-4"></i> CV
                        </a>
                        {{/if}}
                    </div>
                </div>

                <div class="gsap-hero-right relative hidden lg:block">
                    <div class="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        <div class="flex items-center gap-2 px-4 py-3 bg-black-secondary/60 border-b border-white/5">
                            <span class="w-3 h-3 rounded-full bg-red-500"></span>
                            <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                            <span class="w-3 h-3 rounded-full bg-green-500"></span>
                            <i data-lucide="braces" class="w-3.5 h-3.5 text-gray ml-2"></i>
                            <span class="font-mono text-xs text-gray">developer.config.js</span>
                        </div>
                        <div class="p-6 font-mono text-sm leading-relaxed">
                            <div class="hero-code-line"><span class="text-red-bright">const</span> <span class="text-white">developer</span> <span class="text-gray">=</span> <span class="text-gray">{</span></div>
                            <div class="hero-code-line pl-4"><span class="text-white/70">name:</span> <span class="text-green-400">"{{nombre}}"</span><span class="text-gray">,</span></div>
                            <div class="hero-code-line pl-4"><span class="text-white/70">role:</span> <span class="text-green-400">"{{subtitulo}}"</span><span class="text-gray">,</span></div>
                            <div class="hero-code-line pl-4"><span class="text-white/70">stack:</span> <span class="text-gray">[</span></div>
                            {{#each habilidades}}
                            <div class="hero-code-line pl-8"><span class="text-green-400">"{{this}}"</span><span class="text-gray">,</span></div>
                            {{/each}}
                            <div class="hero-code-line pl-4"><span class="text-gray">],</span></div>
                            <div class="hero-code-line pl-4"><span class="text-white/70">status:</span> <span class="text-green-400">"shipping code"</span></div>
                            <div class="hero-code-line"><span class="text-gray">}</span><span class="text-gray">;</span></div>
                            <div class="hero-code-line mt-3"><span class="text-red-primary">~ $</span> <span class="blink-cursor text-white">_</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="w-full overflow-hidden bg-black-secondary/50 border-y border-white/5 py-6 flex">
            <div class="flex whitespace-nowrap gap-16 px-8 items-center animate-marquee w-max">
                {{#each habilidades}}
                <span class="text-gray/50 font-mono text-xl font-bold tracking-widest uppercase hover:text-red-primary transition-colors">{{this}}</span>
                {{/each}}
                {{#each habilidades}}
                <span class="text-gray/50 font-mono text-xl font-bold tracking-widest uppercase hover:text-red-primary transition-colors">{{this}}</span>
                {{/each}}
            </div>
        </div>

        <section id="about" class="py-32 px-6 max-w-7xl mx-auto">
            <div class="gsap-reveal grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
                <div class="bg-black-secondary rounded-xl border border-white/10 overflow-hidden shadow-2xl shadow-black h-[350px] flex flex-col">
                    <div class="flex items-center px-4 py-3 bg-black border-b border-white/5 shrink-0">
                        <div class="flex space-x-2">
                            <div class="w-3 h-3 rounded-full bg-red-500"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div class="mx-auto text-xs font-mono text-gray">guest@portfolio:~</div>
                    </div>
                    <div id="terminal-content" class="p-6 font-mono text-sm overflow-y-auto no-scrollbar flex-1 text-gray"></div>
                </div>

                <div>
                    <h2 class="text-4xl font-bold mb-6">Ingeniería <span class="text-gray">Detrás del Diseño.</span></h2>
                    <p class="text-gray leading-relaxed mb-6">{{#if sobreMi}}{{sobreMi}}{{else}}{{biografia}}{{/if}}</p>
                    <div class="grid grid-cols-2 gap-4 font-mono text-sm">
                        <div class="p-4 border border-white/10 rounded-lg bg-black-secondary"><span class="text-red-bright block text-2xl mb-2">{{habilidades.length}}+</span>Tecnologías</div>
                        <div class="p-4 border border-white/10 rounded-lg bg-black-secondary"><span class="text-red-bright block text-2xl mb-2">{{proyectos.length}}</span>Proyectos</div>
                    </div>
                </div>
            </div>
        </section>

        {{#if experiencia}}
        <section id="experience" class="py-24 px-6 bg-black-secondary/30 border-y border-white/5">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-3xl font-bold mb-16 text-center">Trayectoria Técnica</h2>
                <div class="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                    {{#each experiencia}}
                    <div class="gsap-reveal relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div class="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black text-red-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                            <div class="w-2 h-2 bg-red-primary rounded-full shadow-[0_0_10px_#C1121F]"></div>
                        </div>
                        <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-white/5 bg-black hover:border-red-primary/30 transition-colors">
                            <h3 class="font-bold text-lg mb-2">{{this.cargo}}</h3>
                            <div class="font-mono text-xs text-red-bright mb-4">{{this.empresa}} // {{this.periodo}}</div>
                            <p class="text-sm text-gray leading-relaxed">{{this.descripcion}}</p>
                            {{#if this.tags}}
                            <div class="flex flex-wrap gap-2 mt-4">
                                {{#each this.tags}}
                                <span class="text-xs font-mono bg-white/5 px-2 py-1 rounded text-gray">{{this}}</span>
                                {{/each}}
                            </div>
                            {{/if}}
                        </div>
                    </div>
                    {{/each}}
                </div>
            </div>
        </section>
        {{/if}}

        <section id="projects" class="py-32 px-6 max-w-7xl mx-auto">
            <div class="flex justify-between items-end mb-16">
                <h2 class="text-4xl font-bold">Proyectos<br/><span class="text-gray">Destacados.</span></h2>
                {{#if redes.github}}
                <a href="{{redes.github}}" target="_blank" class="text-sm font-mono hover:text-red-primary transition-colors flex gap-2 items-center">
                    Ver en GitHub <i data-lucide="external-link" class="w-4 h-4"></i>
                </a>
                {{/if}}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {{#each proyectos}}
                <div class="gsap-reveal group rounded-2xl border border-white/10 bg-black-secondary overflow-hidden hover:border-red-primary/50 transition-all duration-500">
                    <div class="h-48 bg-gradient-to-br from-black to-[#111] border-b border-white/5 relative overflow-hidden flex items-center justify-center">
                        <i data-lucide="{{#if this.icono}}{{this.icono}}{{else}}code-2{{/if}}" class="w-12 h-12 text-white/10 group-hover:scale-110 transition-transform duration-500 group-hover:text-red-primary/20"></i>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="font-bold text-xl">{{this.titulo}}</h3>
                            <a href="{{this.enlace}}" target="_blank" aria-label="Ver proyecto" class="text-gray hover:text-white transition-colors"><i data-lucide="arrow-up-right" class="w-5 h-5"></i></a>
                        </div>
                        <p class="text-sm text-gray mb-6 leading-relaxed min-h-[60px]">{{this.descripcion}}</p>
                        {{#if this.tags}}
                        <div class="flex flex-wrap gap-2">
                            {{#each this.tags}}
                            <span class="text-xs font-mono bg-white/5 px-2 py-1 rounded text-gray">{{this}}</span>
                            {{/each}}
                        </div>
                        {{/if}}
                    </div>
                </div>
                {{/each}}
            </div>
        </section>

        {{#if email}}
        <section id="contact" class="py-24 px-6 max-w-4xl mx-auto">
            <div class="gsap-reveal p-10 rounded-3xl border border-white/10 bg-gradient-to-b from-black-secondary to-black relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 bg-red-primary/10 rounded-full blur-[80px]"></div>
                <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 class="text-3xl font-bold mb-4">Iniciar Sistema.</h2>
                        <p class="text-gray mb-8">Abierto a nuevos desafíos arquitectónicos y desarrollo de interfaces premium.</p>
                        <div class="space-y-4">
                            <div class="flex items-center gap-4 text-gray"><i data-lucide="mail" class="w-4 h-4 text-red-primary"></i> {{email}}</div>
                            <div class="flex items-center gap-4 text-gray"><i data-lucide="map-pin" class="w-4 h-4 text-red-primary"></i> {{#if ubicacion}}{{ubicacion}}{{else}}Remoto / Global{{/if}}</div>
                        </div>
                    </div>
                    <div class="bg-black rounded-xl border border-white/10 p-6 font-mono text-sm flex flex-col justify-between">
                        <div class="text-gray space-y-1">
                            <p><span class="text-red-primary">~ $</span> contact --send</p>
                            <p class="text-white/60">&gt; Redactando mensaje para {{nombre}}...</p>
                            <p class="text-white/60">&gt; destino: {{email}}</p>
                        </div>
                        <a href="mailto:{{email}}" class="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray transition-colors mt-6 text-center">Enviar Email</a>
                    </div>
                </div>
            </div>
        </section>
        {{/if}}

        <footer class="border-t border-white/10 bg-black relative mt-12">
            <div id="footer-line" class="absolute top-0 left-0 h-[1px] bg-red-primary w-full origin-left scale-x-0"></div>
            <div class="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="font-mono text-sm text-gray">&copy; <span id="year"></span> // {{nombre}}</div>
                <div class="flex gap-6 text-gray">
                    {{#if redes.github}}<a href="{{redes.github}}" target="_blank" aria-label="GitHub"><i data-lucide="github" class="w-5 h-5 hover:text-white transition-colors cursor-pointer"></i></a>{{/if}}
                    {{#if redes.linkedin}}<a href="{{redes.linkedin}}" target="_blank" aria-label="LinkedIn"><i data-lucide="linkedin" class="w-5 h-5 hover:text-white transition-colors cursor-pointer"></i></a>{{/if}}
                </div>
            </div>
        </footer>

    </div>

    <script>
        lucide.createIcons();

        var yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        function readField(name) {
            var el = document.querySelector('[data-field="' + name + '"]');
            return el ? el.textContent.trim() : '';
        }
        var skillsList = (document.querySelector('.skill-chip') ? document.querySelector('.skill-chip').textContent : '')
            .split('||').map(function (s) { return s.trim(); }).filter(Boolean);

        var bootSequence = [
            "Initializing Kernel...",
            "Loading Core Components...",
            "Mounting Database... [OK]",
            "Validating CSS Layouts... [OK]",
            "Resolving Dependencies...",
            "<span class='text-red-bright'>System Ready.</span>"
        ];

        var bootTextContainer = document.getElementById('boot-text');
        var bootloader = document.getElementById('bootloader');
        var mainContent = document.getElementById('main-content');
        var step = 0;

        function typeBootLoader() {
            if (step < bootSequence.length) {
                var div = document.createElement('div');
                div.innerHTML = '<span class="text-red-primary">&gt;</span> ' + bootSequence[step];
                bootTextContainer.appendChild(div);
                step++;
                setTimeout(typeBootLoader, Math.random() * 400 + 200);
            } else {
                setTimeout(function () {
                    bootloader.classList.add('opacity-0');
                    setTimeout(function () {
                        bootloader.style.display = 'none';
                        mainContent.classList.remove('opacity-0');
                        startTerminalWhenVisible();
                        initAnimations();
                    }, 1000);
                }, 800);
            }
        }
        window.onload = function () { typeBootLoader(); };

        var navbar = document.getElementById('navbar');
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-black/60', 'backdrop-blur-xl', 'border-white/10', 'py-4');
                navbar.classList.remove('bg-transparent', 'border-transparent', 'py-6');
            } else {
                navbar.classList.remove('bg-black/60', 'backdrop-blur-xl', 'border-white/10', 'py-4');
                navbar.classList.add('bg-transparent', 'border-transparent', 'py-6');
            }
        });

        var terminalCommands = [
            { cmd: "whoami", out: readField('whoami') },
            { cmd: "cat skills.txt", out: skillsList.join(', ') },
            { cmd: "status --current", out: readField('status') }
        ];

        var terminalContent = document.getElementById('terminal-content');
        var currentCmdIndex = 0;

        function runTerminal() {
            if (currentCmdIndex >= terminalCommands.length) return;
            var currentItem = terminalCommands[currentCmdIndex];
            var block = document.createElement('div');
            block.className = 'mb-4';
            var cmdLine = document.createElement('div');
            cmdLine.className = 'text-white';
            cmdLine.innerHTML = '<span class="text-red-primary">~ $</span> <span class="typing"></span>';
            var outLine = document.createElement('div');
            outLine.className = 'text-gray mt-1 opacity-0';
            outLine.innerText = currentItem.out;
            block.appendChild(cmdLine);
            block.appendChild(outLine);
            terminalContent.appendChild(block);

            var typingSpan = cmdLine.querySelector('.typing');
            var charIndex = 0;
            function typeChar() {
                if (charIndex < currentItem.cmd.length) {
                    typingSpan.textContent += currentItem.cmd.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, 100);
                } else {
                    setTimeout(function () {
                        outLine.classList.remove('opacity-0');
                        currentCmdIndex++;
                        terminalContent.scrollTop = terminalContent.scrollHeight;
                        setTimeout(runTerminal, 1000);
                    }, 500);
                }
            }
            typeChar();
        }

        function startTerminalWhenVisible() {
            var terminalEl = document.getElementById('terminal-content');
            if (!terminalEl) return;
            if ('IntersectionObserver' in window) {
                var obs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            runTerminal();
                            obs.disconnect();
                        }
                    });
                }, { threshold: 0.3 });
                obs.observe(terminalEl);
            } else {
                runTerminal();
            }
        }

        function initAnimations() {
            if (window.Lenis) {
                var lenis = new Lenis({
                    duration: 1.2,
                    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
                    smooth: true,
                });
                function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
                requestAnimationFrame(raf);
            }

            if (window.gsap && window.ScrollTrigger) {
                gsap.registerPlugin(ScrollTrigger);

                gsap.from(".gsap-hero-left", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
                gsap.from(".gsap-hero-right", { scale: 0.9, opacity: 0, filter: "blur(10px)", duration: 1, delay: 0.3, ease: "power3.out" });
                gsap.from(".hero-code-line", { opacity: 0, x: -10, duration: 0.4, stagger: 0.08, delay: 0.7, ease: "power2.out" });

                gsap.utils.toArray('.gsap-reveal').forEach(function (element) {
                    gsap.from(element, {
                        scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none none" },
                        y: 40,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power3.out"
                    });
                });

                gsap.to("#footer-line", {
                    scrollTrigger: { trigger: "footer", start: "top 90%" },
                    scaleX: 1,
                    duration: 1,
                    ease: "power3.inOut"
                });
            }
        }
    </script>
</body>
</html>`,
  },

  'blue label': {
    id: 'blue label',
    name: 'Blue Label',
    description: 'Estética ciberpunk azul neón y glassmorphism futurista con animaciones sutiles y alto contraste.',
    swatches: ['#030712', '#0284C7', '#38BDF8'],
    notes:
      'Compatible con los campos del JSON (estado, cvUrl, email, redes, experiencia, tecnologias/habilidades y proyectos).',
    template: `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{nombre}} | {{subtitulo}}</title>
    <meta name="description" content="Portafolio de {{nombre}}, {{subtitulo}}.">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">

    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        darkBg: '#030712',
                        cardBg: '#0b1329',
                        blueNeon: '#0284C7',
                        cyanGlow: '#38BDF8',
                        accentBlue: '#1d4ed8'
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif']
                    }
                }
            }
        }
    </script>

    <style>
        body { background-color: #030712; color: #f3f4f6; overflow-x: hidden; }
        .glass-blue { background: rgba(11, 19, 41, 0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(56, 189, 248, 0.15); }
        .glass-blue:hover { border-color: rgba(56, 189, 248, 0.4); box-shadow: 0 0 25px -5px rgba(2, 132, 199, 0.3); }
        .glow-text { text-shadow: 0 0 20px rgba(56, 189, 248, 0.5); }
        .bg-grid-pattern { background-image: radial-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px); background-size: 32px 32px; }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
</head>
<body class="bg-darkBg text-gray-100 font-sans selection:bg-cyanGlow selection:text-black">

    <header class="fixed top-0 w-full z-50 glass-blue border-b border-white/5 py-4">
        <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <a href="#" class="font-display font-bold text-xl tracking-wider text-cyanGlow flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-cyanGlow animate-ping"></span>
                <span>{{nombre}}</span>
            </a>
            <nav class="hidden md:flex gap-8 text-sm text-gray-300 font-medium">
                <a href="#about" class="hover:text-cyanGlow transition-colors">Sobre mí</a>
                <a href="#tech" class="hover:text-cyanGlow transition-colors">Stack</a>
                {{#if experiencia}}<a href="#experience" class="hover:text-cyanGlow transition-colors">Experiencia</a>{{/if}}
                <a href="#projects" class="hover:text-cyanGlow transition-colors">Proyectos</a>
                {{#if email}}<a href="#contact" class="hover:text-cyanGlow transition-colors">Contacto</a>{{/if}}
            </nav>
            {{#if email}}
            <a href="#contact" class="bg-gradient-to-r from-blueNeon to-cyanGlow text-black font-semibold px-5 py-2 rounded-full hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all">Contacto</a>
            {{/if}}
        </div>
    </header>

    <section id="about" class="relative min-h-screen flex items-center pt-24 bg-grid-pattern overflow-hidden">
        <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blueNeon/20 blur-[140px] rounded-full pointer-events-none"></div>

        <div class="max-w-5xl mx-auto px-6 z-10 w-full py-12">
            <div class="hero-left">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyanGlow/30 bg-blueNeon/10 text-cyanGlow text-xs font-mono mb-6">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                    <span>{{subtitulo}}</span>
                </div>
                <h1 class="font-display text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                    <span class="bg-gradient-to-r from-white via-cyan-100 to-cyanGlow bg-clip-text text-transparent glow-text">{{nombre}}</span>
                </h1>
                <p class="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">{{biografia}}</p>
                <div class="flex flex-wrap gap-4">
                    <a href="#projects" class="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blueNeon to-cyanGlow text-black font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                        Explorar Trabajos <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </a>
                    {{#if cvUrl}}
                    <a href="{{cvUrl}}" target="_blank" class="px-8 py-3.5 rounded-xl glass-blue border border-cyanGlow/30 text-cyanGlow font-semibold flex items-center gap-2 hover:bg-cyanGlow/10 transition-colors">
                        <i data-lucide="file-down" class="w-4 h-4"></i> CV
                    </a>
                    {{/if}}
                </div>
            </div>

        </div>
    </section>

    <section id="tech" class="py-24 border-t border-white/5 relative z-10">
        <div class="max-w-7xl mx-auto px-6">
            <h2 class="font-display text-3xl md:text-5xl font-bold text-center mb-16 text-cyanGlow gs-reveal">Stack de Tecnologías</h2>

            {{#if tecnologias}}
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {{#each tecnologias}}
                <div class="glass-blue p-6 rounded-2xl flex flex-col items-center text-center gap-3 gs-reveal">
                    <i data-lucide="{{#if this.icono}}{{this.icono}}{{else}}code-2{{/if}}" class="w-8 h-8 text-cyanGlow"></i>
                    <h3 class="font-semibold text-sm">{{this.titulo}}</h3>
                    <p class="text-xs text-gray-400">{{this.detalle}}</p>
                </div>
                {{/each}}
            </div>
            {{else}}
            <div class="flex flex-wrap justify-center gap-3 gs-reveal">
                {{#each habilidades}}
                <span class="glass-blue px-5 py-2.5 rounded-full text-sm font-medium text-cyanGlow border border-cyanGlow/20">{{this}}</span>
                {{/each}}
            </div>
            {{/if}}
        </div>
    </section>

    {{#if experiencia}}
    <section id="experience" class="py-24 border-t border-white/5 bg-cardBg/40">
        <div class="max-w-4xl mx-auto px-6">
            <h2 class="font-display text-3xl md:text-5xl font-bold mb-16 text-center text-cyanGlow gs-reveal">Trayectoria</h2>
            <div class="space-y-8">
                {{#each experiencia}}
                <div class="glass-blue p-8 rounded-2xl border border-cyanGlow/20 gs-reveal">
                    <div class="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
                        <h3 class="font-display font-bold text-xl text-white">{{this.cargo}}</h3>
                        <span class="text-xs font-mono text-cyanGlow bg-blueNeon/20 px-3 py-1 rounded-full border border-cyanGlow/30 w-fit">{{this.periodo}}</span>
                    </div>
                    <p class="text-cyanGlow/80 text-sm font-semibold mb-3">{{this.empresa}}</p>
                    <p class="text-gray-400 text-sm leading-relaxed mb-4">{{this.descripcion}}</p>
                    {{#if this.tags}}
                    <div class="flex flex-wrap gap-2">
                        {{#each this.tags}}
                        <span class="text-xs bg-white/5 text-gray-300 px-2.5 py-1 rounded-md border border-white/10">{{this}}</span>
                        {{/each}}
                    </div>
                    {{/if}}
                </div>
                {{/each}}
            </div>
        </div>
    </section>
    {{/if}}

    <section id="projects" class="py-24 border-t border-white/5">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-end mb-16 gs-reveal">
                <div>
                    <h2 class="font-display text-3xl md:text-5xl font-bold text-cyanGlow mb-4">Proyectos Destacados</h2>
                    <p class="text-gray-400 max-w-lg">Soluciones construidas con altos estándares técnicos e interfaz refinada.</p>
                </div>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {{#each proyectos}}
                <div class="glass-blue rounded-2xl overflow-hidden flex flex-col justify-between gs-reveal">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="font-display font-bold text-xl text-white hover:text-cyanGlow transition-colors">{{this.titulo}}</h3>
                            <a href="{{this.enlace}}" target="_blank" aria-label="Ver proyecto" class="text-cyanGlow hover:scale-110 transition-transform">
                                <i data-lucide="external-link" class="w-5 h-5"></i>
                            </a>
                        </div>
                        <p class="text-sm text-gray-400 mb-6 leading-relaxed">{{this.descripcion}}</p>
                    </div>
                    <div class="p-6 pt-0">
                        {{#if this.tags}}
                        <div class="flex flex-wrap gap-2">
                            {{#each this.tags}}
                            <span class="text-xs font-mono bg-cyanGlow/10 text-cyanGlow px-2 py-1 rounded border border-cyanGlow/20">{{this}}</span>
                            {{/each}}
                        </div>
                        {{/if}}
                    </div>
                </div>
                {{/each}}
            </div>
        </div>
    </section>

    {{#if email}}
    <section id="contact" class="py-24 border-t border-white/5 relative overflow-hidden">
        <div class="max-w-3xl mx-auto px-6 text-center relative z-10 gs-reveal">
            <h2 class="font-display text-4xl md:text-6xl font-extrabold mb-6 text-cyanGlow">Trabajemos juntos.</h2>
            <p class="text-gray-400 mb-10 max-w-xl mx-auto">Si deseas desarrollar un proyecto o colaborar en una nueva iniciativa, no dudes en escribirme.</p>
            <a href="mailto:{{email}}" class="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blueNeon to-cyanGlow text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-all">
                <i data-lucide="mail" class="w-5 h-5"></i> {{email}}
            </a>
        </div>
    </section>
    {{/if}}

    <footer class="border-t border-white/5 py-8 bg-darkBg">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>&copy; <span id="year"></span> {{nombre}}. Todos los derechos reservados.</p>
            <div class="flex gap-4">
                {{#if redes.github}}<a href="{{redes.github}}" target="_blank" class="hover:text-cyanGlow transition-colors"><i data-lucide="github" class="w-5 h-5"></i></a>{{/if}}
                {{#if redes.linkedin}}<a href="{{redes.linkedin}}" target="_blank" class="hover:text-cyanGlow transition-colors"><i data-lucide="linkedin" class="w-5 h-5"></i></a>{{/if}}
            </div>
        </div>
    </footer>

    <script>
        lucide.createIcons();
        var yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        if (window.gsap) {
            gsap.from('.hero-left', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' });
            gsap.from('.hero-right', { scale: 0.95, opacity: 0, duration: 1.2, delay: 0.2, ease: 'power3.out' });

            if (window.ScrollTrigger) {
                gsap.registerPlugin(ScrollTrigger);
                gsap.utils.toArray('.gs-reveal').forEach(function (el) {
                    gsap.from(el, {
                        scrollTrigger: { trigger: el, start: 'top 85%' },
                        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
                    });
                });
            }
        }
    </script>
</body>
</html>`,
  },
};