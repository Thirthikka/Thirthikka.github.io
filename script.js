// Wait for the page to load before running anything
document.addEventListener("DOMContentLoaded", () => {

  // ---- Footer year ----
  document.getElementById("year").textContent = new Date().getFullYear();

  // ---- Mobile menu ----
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // ---- Scroll reveal ----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("visible"); revealObserver.unobserve(en.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // ---- Active nav link: highlights the section currently in view ----
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  // ---- Back-to-top button ----
  const toTop = document.getElementById("toTop");
  window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 500), { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ---- Placeholder links should not jump to the top of the page ----
  document.querySelectorAll("a.placeholder").forEach((a) =>
    a.addEventListener("click", (e) => e.preventDefault()));

  // ---- Contact form validation ----
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const rules = {
    name:    (v) => v.trim().length >= 2 ? "" : "Enter your name (at least 2 characters).",
    email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address.",
    subject: (v) => v.trim().length >= 3 ? "" : "Enter a subject (at least 3 characters).",
    message: (v) => v.trim().length >= 10 ? "" : "Write a message of at least 10 characters.",
  };
  const check = (field) => {
    const input = form.elements[field];
    const msg = rules[field](input.value);
    document.getElementById(field + "Err").textContent = msg;
    input.classList.toggle("invalid", !!msg);
    input.setAttribute("aria-invalid", !!msg);
    return !msg;
  };
  Object.keys(rules).forEach((f) => form.elements[f].addEventListener("blur", () => check(f)));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";
    const allValid = Object.keys(rules).map(check).every(Boolean);
    if (!allValid) { form.querySelector(".invalid").focus(); return; }

    // No backend here, so open the visitor's email app with the message filled in.
    // For real delivery, replace this with a fetch() call to Formspree, Netlify Forms, etc.
    const body = `${form.message.value}\n\nFrom: ${form.name.value} (${form.email.value})`;
    window.location.href = `mailto:thirthikkaks23@gmail.com?subject=${encodeURIComponent(form.subject.value)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Your email app should open with the message ready to send.";
    form.reset();
  });
});
