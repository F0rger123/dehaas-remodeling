(() => {
  "use strict";

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

  /* ---------------- scroll reveal ---------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
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
