/* =========================================================
   STRIPE PAYMENT LINKS
   ---------------------------------------------------------
   1. Stripe Dashboard → Product catalog → create each product
      (coaching = recurring monthly price, plans = one-time price).
   2. Payment Links → create a link per product.
      Under "After payment" choose "Don't show confirmation page"
      → redirect to https://YOUR-DOMAIN/thanks.html
   3. Paste each link below (starts with https://buy.stripe.com/).
   Empty links fall back to the contact form, so nothing breaks.
   ========================================================= */
const STRIPE_LINKS = {
  // Personalized coaching (recurring / monthly)
  swimCoaching:  "", // $165 / month
  fullTriathlon: "", // $300 / month
  videoAnalysis: "", // $300 one-time

  // Workout plans (one-time)
  block703:     "", // 3 Week 70.3 Swim Block, $50
  ironmanPrep:  "", // 5 Big Ironman Prep Swims, $28
  aerobicSpeed: "", // Aerobic with Speed Development, $40
  technique:    "", // Technique Improvement, $28
  threshold:    "", // Threshold Development, $40
};

// Wire up buy buttons
document.querySelectorAll("[data-stripe]").forEach((el) => {
  const url = STRIPE_LINKS[el.dataset.stripe];
  if (url && url.startsWith("https://buy.stripe.com/")) {
    el.href = url;
    el.rel = "noopener";
  } else {
    // Not configured yet: preselect the right option in the contact form
    el.addEventListener("click", () => {
      const select = document.getElementById("interest");
      const card = el.closest(".card, .plan");
      const title = card && card.querySelector("h3")?.textContent.trim();
      if (!select || !title) return;
      const match = [...select.options].find((o) => o.text === title);
      select.value = match ? match.text : "A workout plan";
    });
  }
});

// Mobile navigation
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
const setNav = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
};
toggle.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) { setNav(false); toggle.focus(); }
});
window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => { if (e.matches) setNav(false); });

// Header shadow on scroll
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Inline email validation (friendly, only after the user has typed)
const form = document.querySelector(".contact-form");
if (form) {
  const email = form.querySelector("#email");
  const error = form.querySelector("#email-error");
  const validate = () => {
    const ok = email.validity.valid;
    email.setAttribute("aria-invalid", String(!ok));
    error.hidden = ok;
    return ok;
  };
  email.addEventListener("blur", () => { if (email.value) validate(); });
  email.addEventListener("input", () => { if (email.getAttribute("aria-invalid") === "true") validate(); });
  form.addEventListener("submit", (e) => {
    if (!validate()) { e.preventDefault(); email.focus(); }
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

// Hero photo slider (version B): auto-advances, arrows, progress bars, pauses on hover/focus
const hero = document.querySelector(".hero-b");
if (hero) {
  const slides = [...hero.querySelectorAll(".slide")];
  const bars = [...hero.querySelectorAll(".bar-btn")];
  const dots = [...hero.querySelectorAll(".dot-btn")];
  const MS = 5000;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0, timer = null, paused = false;
  hero.style.setProperty("--slide-ms", MS + "ms");

  // Load photos 2-5 only after the page is ready (faster first paint)
  const loadImg = (img) => {
    if (!img || !img.dataset.src) return;
    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
    delete img.dataset.src; delete img.dataset.srcset;
  };
  const loadAll = () => slides.forEach((s) => loadImg(s.querySelector("img")));
  if (document.readyState === "complete") setTimeout(loadAll, 300);
  else window.addEventListener("load", () => setTimeout(loadAll, 300), { once: true });

  const show = (n) => {
    i = (n + slides.length) % slides.length;
    loadImg(slides[i].querySelector("img"));
    slides.forEach((s, k) => { s.classList.toggle("is-active", k === i); s.setAttribute("aria-hidden", String(k !== i)); });
    bars.forEach((b, k) => {
      b.classList.remove("is-active");
      b.classList.toggle("is-done", k < i);
      b.setAttribute("aria-current", String(k === i));
    });
    dots.forEach((d, k) => { d.classList.toggle("is-active", k === i); d.setAttribute("aria-current", String(k === i)); });
    void bars[i].offsetWidth;            // restart the progress animation
    bars[i].classList.add("is-active");
    schedule();
  };
  const schedule = () => {
    clearTimeout(timer);
    if (!reduce && !paused) timer = setTimeout(() => show(i + 1), MS);
  };
  const pause = (p) => { paused = p; hero.classList.toggle("is-paused", p); if (p) clearTimeout(timer); else show(i); };

  hero.querySelectorAll(".slide-arrow").forEach((btn) => btn.addEventListener("click", () => show(i + Number(btn.dataset.dir))));
  bars.forEach((b, k) => b.addEventListener("click", () => show(k)));
  dots.forEach((d, k) => d.addEventListener("click", () => show(k)));
  const ui = hero.querySelector(".hero-side");
  ui.addEventListener("mouseenter", () => pause(true));
  ui.addEventListener("mouseleave", () => pause(false));
  ui.addEventListener("focusin", (e) => { if (e.target.matches(":focus-visible")) pause(true); });
  ui.addEventListener("focusout", () => { if (paused && !ui.matches(":hover")) pause(false); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) clearTimeout(timer); else schedule(); });
  // swipe on touch devices
  let x0 = null;
  hero.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50 && e.target.closest(".slider, .hero-shade, .hero-b-grid, .slide-dots") && !e.target.closest("a, button, input")) show(i + (dx < 0 ? 1 : -1));
  }, { passive: true });
  show(0);
}

// Logo: always go to the top of the first page
const logo = document.querySelector(".logo");
if (logo && document.getElementById("top")) {
  logo.addEventListener("click", (e) => {
    e.preventDefault();
    setNav(false);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.replaceState(null, "", location.pathname);
  });
}
