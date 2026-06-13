/* =====================================================
 * PORTFOLIO — Rafael Negrão de Souza
 * JavaScript vanilla, sem dependências.
 * ===================================================== */

(function () {
  "use strict";

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
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
      );
    }
  }

  // Aplica o tema inicial (o inline script no <head> já evitou o flash)
  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* localStorage indisponível — ignora */
      }
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
    navToggle.setAttribute("aria-label", "Abrir menu de navegação");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
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
  const counters = document.querySelectorAll(".card__metric-value[data-count-to]");

  if (counters.length) {
    const formatNum = function (n) {
      return Math.round(n).toLocaleString("pt-BR");
    };

    const runCount = function (el) {
      const target = parseFloat(el.dataset.countTo);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";

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

  if (termOut) {
    const lines = [
      { cls: "t-cmd", prompt: "$", text: "whoami" },
      { cls: "t-out", text: "Data Engineer, do requisito ao deploy" },
      { cls: "t-cmd", prompt: "$", text: "python etl_pipeline.py --run" },
      { cls: "t-ok", text: "✓ 1.2M linhas processadas em 4.3s" },
      { cls: "t-cmd", prompt: "$", text: "git push origin main" },
      { cls: "t-ok", text: "✓ deploy concluído" },
    ];

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
      return '<span class="' + l.cls + '">' + promptHtml + escapeHtml(txt) + "</span>";
    };

    if (reduceMotion) {
      termOut.innerHTML = lines
        .map(function (l) {
          return renderLine(l);
        })
        .join("\n");
    } else {
      const done = [];
      let li = 0;
      let ci = 0;

      const step = function () {
        if (li >= lines.length) {
          // pausa e reinicia o ciclo
          setTimeout(function () {
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
          setTimeout(step, line.prompt ? 42 : 16);
        } else {
          done.push(renderLine(line));
          li++;
          ci = 0;
          setTimeout(step, line.prompt ? 280 : 700);
        }
      };

      step();
    }
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

})();
