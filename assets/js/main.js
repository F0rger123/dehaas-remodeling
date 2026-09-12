(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const gsapReady = window.gsap && window.ScrollTrigger;
  if (gsapReady) gsap.registerPlugin(ScrollTrigger);

  /* ---------------- sticky header ---------------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- mobile nav ---------------- */
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".mobile-panel");
  if (toggle && panel) {
    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      panel.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
    });
    panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------------- word/char split for headline stagger ---------------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((w) => `<span class="split-word"><span class="split-inner">${w}</span></span>`)
      .join(" ");
  });

  /* ---------------- scroll reveal (GSAP if available, CSS fallback otherwise) ---------------- */
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  if (gsapReady && !reduceMotion) {
    revealEls.forEach((el, i) => {
      const isSplit = el.matches("[data-split]");
      gsap.set(el, { autoAlpha: 1 });
      if (isSplit) {
        gsap.from(el.querySelectorAll(".split-inner"), {
          yPercent: 130,
          rotate: 6,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      } else {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          rotateX: -8,
          transformPerspective: 700,
          duration: 0.85,
          delay: (i % 6) * 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      }
    });
  } else if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.setProperty("--i", i % 8);
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------- hero / media parallax depth ---------------- */
  if (gsapReady && !reduceMotion) {
    document.querySelectorAll("[data-parallax]").forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -8 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: img.closest("[data-parallax-wrap]") || img.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
    });
  }

  /* ---------------- animated counters ---------------- */
  const counters = document.querySelectorAll("[data-count-to]");
  if ("IntersectionObserver" in window && counters.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.getAttribute("data-count-to"));
      const suffix = el.getAttribute("data-suffix") || "";
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------------- 3D pointer tilt ---------------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".tilt").forEach((card) => {
      const strength = parseFloat(card.getAttribute("data-tilt-strength") || "10");
      let raf = null;
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg) translateZ(0)`;
          card.style.setProperty("--glare-x", `${(px + 0.5) * 100}%`);
          card.style.setProperty("--glare-y", `${(py + 0.5) * 100}%`);
        });
      };
      const reset = () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
      };
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", reset);
    });
  }

  /* ---------------- magnetic buttons ---------------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      const pull = 0.35;
      const onMove = (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${mx * pull}px, ${my * pull}px)`;
      };
      const reset = () => { btn.style.transform = ""; };
      btn.addEventListener("pointermove", onMove);
      btn.addEventListener("pointerleave", reset);
    });
  }

  /* ---------------- cursor-follow glow on dark sections ---------------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".glow-surface").forEach((section) => {
      const onMove = (e) => {
        const r = section.getBoundingClientRect();
        section.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
        section.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
      };
      section.addEventListener("pointermove", onMove);
    });
  }

  /* ---------------- custom cursor dot ---------------- */
  if (finePointer && !reduceMotion) {
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.appendChild(dot);
    let dx = window.innerWidth / 2, dy = window.innerHeight / 2, tx = dx, ty = dy;
    window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; dot.classList.add("is-active"); });
    const hoverables = "a, button, .tilt, input, select, textarea";
    document.addEventListener("pointerover", (e) => { if (e.target.closest(hoverables)) dot.classList.add("is-big"); });
    document.addEventListener("pointerout", (e) => { if (e.target.closest(hoverables)) dot.classList.remove("is-big"); });
    const loop = () => {
      dx += (tx - dx) * 0.18;
      dy += (ty - dy) * 0.18;
      dot.style.transform = `translate(${dx}px, ${dy}px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ---------------- lightbox ---------------- */
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector("img");
    const lbCap = lightbox.querySelector("figcaption");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const openLightbox = (src, alt, caption) => {
      lbImg.src = src;
      lbImg.alt = alt || "";
      lbCap.textContent = caption || "";
      lightbox.classList.add("is-open");
      document.body.classList.add("menu-open");
    };
    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };
    document.querySelectorAll("[data-lightbox]").forEach((item) => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        const full = item.getAttribute("data-full") || img.src;
        const cap = item.getAttribute("data-caption") || "";
        openLightbox(full, img.alt, cap);
      });
    });
    closeBtn?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ---------------- faq accordion ---------------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    btn?.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      item.closest(".faq-list")?.querySelectorAll(".faq-item").forEach((i) => i.setAttribute("data-open", "false"));
      item.setAttribute("data-open", String(!isOpen));
    });
  });

  /* ---------------- estimate form (static hand-off) ----------------
     No backend is wired up yet. Set ESTIMATE_RECIPIENT to the business's
     real inbox (or swap this handler for a form service such as
     Formspree / Netlify Forms) before this site goes live. Until then,
     submitting opens the visitor's email client with the request
     pre-filled so it still reaches a human. */
  const ESTIMATE_RECIPIENT = "";
  const form = document.querySelector("#estimate-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const success = document.querySelector(".form-success");
      const data = new FormData(form);
      const subject = encodeURIComponent(`Estimate request — ${data.get("name") || "New lead"}`);
      const bodyLines = [
        `Name: ${data.get("name") || ""}`,
        `Phone: ${data.get("phone") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Project type: ${data.get("project") || ""}`,
        `Address: ${data.get("address") || ""}`,
        "",
        `Details: ${data.get("message") || ""}`,
      ];
      const body = encodeURIComponent(bodyLines.join("\n"));
      window.location.href = `mailto:${ESTIMATE_RECIPIENT}?subject=${subject}&body=${body}`;
      if (success) success.classList.add("is-visible");
      form.reset();
    });
  }
})();
