/* =====================================================
 * PORTFOLIO — Rafael Negrão de Souza
 * JavaScript vanilla, sem dependências.
 * ===================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------
   * 0. IDIOMA (en / pt) — strings que vivem no JS
   * --------------------------------------------------- */
  const I18N = {
    terminal: {
      en: [
        { cls: "t-cmd", prompt: "$", text: "whoami" },
        { cls: "t-out", text: "Data Engineer, from requirement to deploy" },
        { cls: "t-cmd", prompt: "$", text: "python etl_pipeline.py --run" },
        { cls: "t-ok", text: "✓ 1.2M rows processed in 4.3s" },
        { cls: "t-cmd", prompt: "$", text: "git push origin main" },
        { cls: "t-ok", text: "✓ deploy complete" },
      ],
      pt: [
        { cls: "t-cmd", prompt: "$", text: "whoami" },
        { cls: "t-out", text: "Data Engineer, do requisito ao deploy" },
        { cls: "t-cmd", prompt: "$", text: "python etl_pipeline.py --run" },
        { cls: "t-ok", text: "✓ 1.2M linhas processadas em 4.3s" },
        { cls: "t-cmd", prompt: "$", text: "git push origin main" },
        { cls: "t-ok", text: "✓ deploy concluído" },
      ],
    },
    theme: {
      en: { toLight: "Switch to light theme", toDark: "Switch to dark theme" },
      pt: { toLight: "Ativar tema claro", toDark: "Ativar tema escuro" },
    },
    nav: {
      en: { open: "Open navigation menu", close: "Close navigation menu" },
      pt: { open: "Abrir menu de navegação", close: "Fechar menu de navegação" },
    },
  };

  function getPreferredLang() {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "en" || saved === "pt") return saved;
    } catch (e) {
      /* localStorage indisponível */
    }
    return "pt"; // português como padrão
  }

  let currentLang = getPreferredLang();

  /* ---------------------------------------------------
   * 1. ANO DINÂMICO NO FOOTER
   * --------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------
   * 2. TOGGLE DE TEMA (claro / escuro) com persistência
   * --------------------------------------------------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function initParticleBackground() {
    const canvas = document.getElementById("bg-particles");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

      const count = Math.min(220, Math.max(80, Math.round((window.innerWidth * window.innerHeight) / 16000)));
      particles = Array.from({ length: count }, function () {
        return {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 0.9 + 0.35,
          alpha: Math.random() * 0.13 + 0.05,
        };
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    resizeCanvas();
    drawParticles();

    window.addEventListener("resize", function () {
      resizeCanvas();
      drawParticles();
    }, { passive: true });
  }

  initParticleBackground();

  function getPreferredTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    // Fallback para preferência do sistema
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      const t = I18N.theme[currentLang];
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? t.toLight : t.toDark
      );
    }
  }

  // Aplica o tema inicial (o inline script no <head> já evitou o flash)
  applyTheme(getPreferredTheme());

  function persistTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* localStorage indisponível — ignora */
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function (event) {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Sem suporte à View Transitions API (ou movimento reduzido):
      // troca direta, sem animação de bolha.
      if (!document.startViewTransition || prefersReducedMotion) {
        applyTheme(next);
        persistTheme(next);
        return;
      }

      // Ponto de origem da bolha. Preferimos o ponto real do toque/clique
      // (event.clientX/Y); no teclado, sem coordenadas, caímos no centro
      // do botão. As coordenadas de clique/rect são relativas à *visual
      // viewport*, mas a View Transition desenha o snapshot na *layout
      // viewport* — no mobile a barra de URL/zoom desloca as duas, então
      // somamos o offset para a bolha nascer exatamente no ícone.
      const rect = themeToggle.getBoundingClientRect();
      const vv = window.visualViewport;
      const offsetX = vv ? vv.offsetLeft : 0;
      const offsetY = vv ? vv.offsetTop : 0;
      let x = rect.left + rect.width / 2;
      let y = rect.top + rect.height / 2;
      if (event.clientX || event.clientY) {
        x = event.clientX;
        y = event.clientY;
      }
      x += offsetX;
      y += offsetY;
      // Raio final = distância até o canto mais distante da tela.
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // Desliga o fade de cor do body durante a troca: a bolha deve
      // revelar o tema novo já "pronto", sem o fundo transicionando junto.
      root.classList.add("theme-switching");

      const transition = document.startViewTransition(function () {
        applyTheme(next);
      });

      transition.finished.finally(function () {
        root.classList.remove("theme-switching");
      });

      transition.ready.then(function () {
        document.documentElement.animate(
          {
            clipPath: [
              "circle(0px at " + x + "px " + y + "px)",
              "circle(" + endRadius + "px at " + x + "px " + y + "px)",
            ],
          },
          {
            duration: 550,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });

      persistTheme(next);
    });
  }

  /* ---------------------------------------------------
   * 3. MENU MOBILE (hambúrguer)
   * --------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", I18N.nav[currentLang].open);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? I18N.nav[currentLang].close : I18N.nav[currentLang].open
      );
    });

    // Fecha o menu ao clicar em um link
    navMenu.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Fecha com a tecla ESC (acessibilidade / teclado)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------------------------------------------------
   * 4. HEADER COM BORDA AO ROLAR
   * --------------------------------------------------- */
  const header = document.querySelector(".site-header");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------------------------------------------
   * 5. FADE-IN DAS SEÇÕES (IntersectionObserver)
   * --------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    // Sem animação: revela tudo imediatamente
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // anima só uma vez
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------
   * 6. CONTADORES ANIMADOS DAS MÉTRICAS
   * --------------------------------------------------- */
  const counters = document.querySelectorAll(
    ".card__metric-value[data-count-to]"
  );

  const formatNum = function (n) {
    const locale = currentLang === "en" ? "en-US" : "pt-BR";
    return Math.round(n).toLocaleString(locale);
  };

  const counterSuffix = function (el) {
    return (
      el.getAttribute("data-suffix-" + currentLang) ||
      el.dataset.suffix ||
      ""
    );
  };

  const counterFinalText = function (el) {
    const target = parseFloat(el.dataset.countTo);
    const prefix = el.dataset.prefix || "";
    return prefix + formatNum(target) + counterSuffix(el);
  };

  if (counters.length) {
    const runCount = function (el) {
      const target = parseFloat(el.dataset.countTo);
      const prefix = el.dataset.prefix || "";
      const suffix = counterSuffix(el);

      if (reduceMotion) {
        el.textContent = prefix + formatNum(target) + suffix;
        return;
      }

      const duration = 1400;
      const start = performance.now();

      const tick = function (now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = prefix + formatNum(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + formatNum(target) + suffix;
      };

      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCount);
    } else {
      const countObserver = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCount(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach(function (el) {
        countObserver.observe(el);
      });
    }
  }

  /* ---------------------------------------------------
   * 7. TERMINAL QUE DIGITA SOZINHO
   * --------------------------------------------------- */
  const termOut = document.querySelector("[data-terminal-out]");
  let termTimer = null;
  let termRun = 0; // token p/ cancelar o ciclo anterior ao trocar idioma

  const escapeHtml = function (s) {
    return s.replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  };

  const renderLine = function (l, partial) {
    const txt = partial !== undefined ? partial : l.text;
    const promptHtml = l.prompt
      ? '<span class="t-prompt">' + l.prompt + "</span> "
      : "";
    return (
      '<span class="' + l.cls + '">' + promptHtml + escapeHtml(txt) + "</span>"
    );
  };

  function startTerminal() {
    if (!termOut) return;

    // Cancela qualquer ciclo em andamento
    termRun++;
    const myRun = termRun;
    if (termTimer) {
      clearTimeout(termTimer);
      termTimer = null;
    }

    const lines = I18N.terminal[currentLang];

    if (reduceMotion) {
      termOut.innerHTML = lines.map(function (l) {
        return renderLine(l);
      }).join("\n");
      return;
    }

    const done = [];
    let li = 0;
    let ci = 0;

    const step = function () {
      if (myRun !== termRun) return; // outro idioma assumiu o terminal

      if (li >= lines.length) {
        // pausa e reinicia o ciclo
        termTimer = setTimeout(function () {
          if (myRun !== termRun) return;
          done.length = 0;
          li = 0;
          ci = 0;
          step();
        }, 2800);
        return;
      }

      const line = lines[li];

      if (ci <= line.text.length) {
        const partial = line.text.slice(0, ci);
        termOut.innerHTML =
          done.join("\n") +
          (done.length ? "\n" : "") +
          renderLine(line, partial);
        ci++;
        termTimer = setTimeout(step, line.prompt ? 42 : 16);
      } else {
        done.push(renderLine(line));
        li++;
        ci = 0;
        termTimer = setTimeout(step, line.prompt ? 280 : 700);
      }
    };

    step();
  }

  /* ---------------------------------------------------
   * 8. PROJETOS — "Ver mais" abre um modal com o case study
   * --------------------------------------------------- */
  const modal = document.getElementById("projectModal");
  const moreButtons = document.querySelectorAll(".card__more");

  if (modal && moreButtons.length) {
    const modalTitle = modal.querySelector(".modal__title");
    const modalCompany = modal.querySelector(".modal__company");
    const modalBody = modal.querySelector(".modal__body");
    const closeEls = modal.querySelectorAll("[data-modal-close]");
    let lastFocused = null;

    function openModal(card) {
      const titleEl = card.querySelector(".card__title");
      const companyEl = card.querySelector(".card__company");
      const details = card.querySelector(".card__details");
      modalTitle.textContent = titleEl ? titleEl.textContent : "";
      modalCompany.textContent = companyEl ? companyEl.textContent : "";
      modalBody.innerHTML = details ? details.innerHTML : "";

      lastFocused = document.activeElement;
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      const closeBtn = modal.querySelector(".modal__close");
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    moreButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const card = btn.closest(".card");
        if (card) openModal(card);
      });
    });

    closeEls.forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  /* ---------------------------------------------------
   * 9. IDIOMA — aplica/troca EN ↔ PT
   * --------------------------------------------------- */
  const langToggle = document.getElementById("langToggle");
  const i18nEls = document.querySelectorAll("[data-en][data-pt]");

  function applyLang(lang) {
    currentLang = lang === "pt" ? "pt" : "en";

    // <html lang> para acessibilidade / SEO
    root.setAttribute("lang", currentLang === "en" ? "en" : "pt-BR");

    // Troca o conteúdo de todos os elementos marcados
    i18nEls.forEach(function (el) {
      const val = el.getAttribute("data-" + currentLang);
      if (val != null) el.innerHTML = val;
    });

    // Botões do seletor: marca o ativo
    if (langToggle) {
      langToggle.querySelectorAll(".lang-toggle__opt").forEach(function (opt) {
        opt.classList.toggle(
          "is-active",
          opt.getAttribute("data-lang") === currentLang
        );
      });
    }

    // Aria-labels dependentes de idioma
    applyTheme(root.getAttribute("data-theme") || "dark");
    if (navToggle) {
      const isOpen = navMenu && navMenu.classList.contains("is-open");
      navToggle.setAttribute(
        "aria-label",
        isOpen ? I18N.nav[currentLang].close : I18N.nav[currentLang].open
      );
    }

    // Reformata as métricas no locale/sufixo do idioma atual
    counters.forEach(function (el) {
      el.textContent = counterFinalText(el);
    });

    // Reinicia o terminal já no novo idioma
    startTerminal();
  }

  function persistLang(lang) {
    try {
      localStorage.setItem("lang", lang);
    } catch (e) {
      /* localStorage indisponível — ignora */
    }
  }

  if (langToggle) {
    langToggle.addEventListener("click", function (e) {
      const opt = e.target.closest(".lang-toggle__opt");
      let next;
      if (opt && opt.getAttribute("data-lang")) {
        next = opt.getAttribute("data-lang");
      } else {
        next = currentLang === "en" ? "pt" : "en";
      }
      if (next === currentLang) return;
      applyLang(next);
      persistLang(next);
    });
  }

  // Estado inicial (português por padrão; também dispara o terminal)
  applyLang(currentLang);
})();
