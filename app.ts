interface PortfolioConfig {
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  whatsappNumber: string;
}

const PORTFOLIO_CONFIG: PortfolioConfig = {
  email: "arunaakash114@gmail.com",
  phone: "+91 63690 84994",
  linkedinUrl: "",
  githubUrl: "",
  whatsappNumber: "916369084994"
};

function initializeWebsite(): void {
  initializeNavigation();
  initializeTheme();
  initializeTypingAnimation();
  initializeScrollReveal();
  initializeActiveNavigation();
  initializeContactForm();
  initializeBackToTop();
  initializeDynamicYear();
  initializeConfiguredLinks();
  initializeResumeDownload();
}

function initializeNavigation(): void {
  const menuToggle = document.querySelector<HTMLButtonElement>("#menu-toggle");
  const navigation = document.querySelector<HTMLElement>("#primary-navigation");
  if (!menuToggle || !navigation) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    menuToggle.innerHTML = `<i class="bi ${isOpen ? "bi-x-lg" : "bi-list"}"></i>`;
  });

  navigation.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      menuToggle.innerHTML = '<i class="bi bi-list"></i>';
    });
  });
}

function initializeTheme(): void {
  const toggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
  if (!toggle) return;
  const root = document.documentElement;
  let savedTheme: string | null = null;
  try {
    savedTheme = localStorage.getItem("portfolio-theme");
  } catch (error) {
    console.warn("Theme preference could not be read from local storage.", error);
  }
  const initialTheme = savedTheme === "dark" ? "dark" : "light";
  root.dataset.theme = initialTheme;
  updateThemeButton(toggle, initialTheme);

  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    updateThemeButton(toggle, nextTheme);
    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch (error) {
      console.warn("Theme preference could not be saved to local storage.", error);
    }
  });
}

function updateThemeButton(button: HTMLButtonElement, theme: string): void {
  const darkMode = theme === "dark";
  button.setAttribute("aria-label", darkMode ? "Switch to light theme" : "Switch to dark theme");
  button.innerHTML = `<i class="bi ${darkMode ? "bi-sun" : "bi-moon-stars"}"></i>`;
}

function initializeTypingAnimation(): void {
  const target = document.querySelector<HTMLElement>("#typing-text");
  if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const phrases = ["Android & iOS Apps", "Delivery Operations", "Team Management", "React, Angular & Ionic"];
  let phraseIndex = 0;
  let characterIndex = phrases[0].length;
  let deleting = false;

  const type = (): void => {
    const phrase = phrases[phraseIndex];
    characterIndex += deleting ? -1 : 1;
    target.textContent = phrase.slice(0, characterIndex);
    let delay = deleting ? 55 : 95;
    if (!deleting && characterIndex === phrase.length) {
      deleting = true;
      delay = 1500;
    } else if (deleting && characterIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 300;
    }
    window.setTimeout(type, delay);
  };
  window.setTimeout(type, 1800);
}

function initializeScrollReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  elements.forEach((element) => {
    const revealGroup = element.closest(".row, .about-grid, .workflow");
    const siblings = revealGroup
      ? Array.from(revealGroup.querySelectorAll<HTMLElement>(".reveal")).filter((sibling) => sibling.parentElement === element.parentElement)
      : [];
    const siblingIndex = siblings.indexOf(element);
    if (siblingIndex > 0) element.style.setProperty("--reveal-delay", `${Math.min(siblingIndex * 100, 400)}ms`);

    const effect = element.classList.contains("about-copy") || element.matches(".col-lg-5")
      ? "left"
      : element.classList.contains("highlight-grid") || element.matches(".col-lg-7")
        ? "right"
        : element.classList.contains("timeline") || element.classList.contains("github-panel")
          ? "zoom"
          : "";
    if (effect) element.dataset.revealEffect = effect;
  });

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
}

function initializeActiveNavigation(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-links a"));
  const sections = links
    .map((link) => document.querySelector<HTMLElement>(link.hash))
    .filter((section): section is HTMLElement => section !== null);
  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  sections.forEach((section) => observer.observe(section));
}

function initializeContactForm(): void {
  const form = document.querySelector<HTMLFormElement>("#contact-form");
  const status = document.querySelector<HTMLElement>("#form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!PORTFOLIO_CONFIG.email.trim()) {
      status.textContent = "The contact form is ready, but the recipient email address has not been configured in app.js.";
      status.setAttribute("role", "alert");
      return;
    }

    const values = new FormData(form);
    const name = String(values.get("name") ?? "").trim();
    const sender = String(values.get("email") ?? "").trim();
    const subject = String(values.get("subject") ?? "").trim();
    const message = String(values.get("message") ?? "").trim();
    const body = `From: ${name} (${sender})%0D%0A%0D%0A${encodeURIComponent(message)}`;
    const mailto = `mailto:${encodeURIComponent(PORTFOLIO_CONFIG.email.trim())}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;
    status.textContent = "Your email app has been opened with the message. Send it there to complete delivery.";
    status.setAttribute("role", "status");
  });
}

function initializeBackToTop(): void {
  const button = document.querySelector<HTMLButtonElement>("#back-to-top");
  if (!button) return;
  const updateScrollState = (): void => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
    button.style.setProperty("--water-level", `${progress * 100}%`);
    button.classList.toggle("visible", window.scrollY > 500);
  };
  let scrollFrame = 0;
  const scheduleUpdate = (): void => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      updateScrollState();
    });
  };
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  updateScrollState();
  button.addEventListener("click", () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
  });
}

function initializeDynamicYear(): void {
  const year = document.querySelector<HTMLElement>("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function initializeConfiguredLinks(): void {
  setConfiguredLink("#github-link", PORTFOLIO_CONFIG.githubUrl, "GitHub profile");
  setConfiguredLink("#footer-github", PORTFOLIO_CONFIG.githubUrl, "GitHub profile");
  setConfiguredLink("#linkedin-contact", PORTFOLIO_CONFIG.linkedinUrl, "LinkedIn");
  setConfiguredLink("#footer-linkedin", PORTFOLIO_CONFIG.linkedinUrl, "LinkedIn profile");

  const emailContact = document.querySelector<HTMLElement>("#email-contact");
  if (emailContact && PORTFOLIO_CONFIG.email.trim()) {
    const value = emailContact.querySelector("strong");
    if (value) value.innerHTML = `<a href="mailto:${encodeURIComponent(PORTFOLIO_CONFIG.email.trim())}">${escapeHtml(PORTFOLIO_CONFIG.email.trim())}</a>`;
  }
  setConfiguredLink("#footer-email", PORTFOLIO_CONFIG.email ? `mailto:${PORTFOLIO_CONFIG.email}` : "", "Email Arun");

  const phoneContact = document.querySelector<HTMLElement>("#phone-contact");
  if (phoneContact && PORTFOLIO_CONFIG.phone.trim()) {
    const value = phoneContact.querySelector("strong");
    if (value) value.innerHTML = `<a href="tel:${encodeURIComponent(PORTFOLIO_CONFIG.phone.trim())}">${escapeHtml(PORTFOLIO_CONFIG.phone.trim())}</a>`;
  } else if (phoneContact) {
    phoneContact.hidden = true;
  }

  const whatsapp = document.querySelector<HTMLAnchorElement>("#whatsapp-link");
  if (whatsapp && PORTFOLIO_CONFIG.whatsappNumber.trim()) {
    whatsapp.href = `https://wa.me/${encodeURIComponent(PORTFOLIO_CONFIG.whatsappNumber.trim())}`;
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
  } else if (whatsapp) {
    whatsapp.hidden = true;
  }
}

function setConfiguredLink(selector: string, url: string, label: string): void {
  const element = document.querySelector<HTMLAnchorElement | HTMLElement>(selector);
  if (!element || !url.trim()) return;
  if (element instanceof HTMLAnchorElement) {
    element.href = url.trim();
    if (/^https:\/\//i.test(url.trim())) {
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    }
  } else {
    const value = element.querySelector("strong");
    if (value) value.innerHTML = `<a href="${escapeHtml(url.trim())}" target="_blank" rel="noopener noreferrer">View LinkedIn profile</a>`;
  }
  element.setAttribute("aria-label", label);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return entities[character];
  });
}

function initializeResumeDownload(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-download-resume]").forEach((button) => {
    button.addEventListener("click", () => {
      const resume = [
        "ARUN KUMAR M",
        "Delivery Head @ Eron Techno Solutions | Team Management | Delivery Operations | Software Developer | Mobile App Developer - Android & iOS",
        "Coimbatore, Tamil Nadu, India",
        "Phone: +91 63690 84994",
        "Email: arunaakash114@gmail.com",
        "",
        "PROFESSIONAL SUMMARY",
        "Delivery Head at Eron Techno Solutions with experience in team management, delivery operations, frontend development, and Android and iOS applications. Technical background includes React.js, Angular, Ionic, and project engineering.",
        "",
        "EXPERIENCE",
        "Delivery Head — Eron Techno Solutions Pvt. Ltd., Coimbatore | Apr 2024–Present",
        "Leading team management and delivery operations for web and Android/iOS applications. Supporting delivery planning, cross-functional collaboration, and product execution.",
        "",
        "Front End Developer — Altus Technologies, Coimbatore | Dec 2022–Mar 2024",
        "Developed responsive web and mobile applications with React.js, Angular, and Ionic; collaborated with cross-functional teams, wrote maintainable code, and optimized performance.",
        "",
        "Project Engineer — Barani Hydraulics India Private Limited, Coimbatore | Jun 2019–Sep 2022",
        "Planned project scope, schedules, and budgets; monitored progress; and contributed to manufacturing process, equipment, and tool improvements. Conducted feasibility studies and cost-benefit analyses.",
        "",
        "TECHNICAL SKILLS",
        "React.js 18, JavaScript ES6+, HTML5, CSS3, React Router, Redux, React Hooks, Angular 17, TypeScript, Node.js, UI/UX, Figma, Ionic Framework 7, Cordova, Capacitor, Android Studio, Xcode, GitHub, Windows, macOS.",
        "",
        "EDUCATION",
        "Bachelor of Mechanical Engineering — Jai Shriram Engineering College, Tiruppur | Aug 2015–Apr 2019 | CGPA: 7.62 | First Class",
        "Higher Secondary School — Bishop Ubagaraswamy School, Tiruppur | Apr 2014–Mar 2015 | 78%",
        "",
        "SELECTED PROJECTS",
        "Mobile applications: SVCF LTD (finance management); Dream Treasure (property marketplace); SSM Gas (cylinder booking); EzGarage (garage and car-wash management); TryowBOT (WhatsApp Business automation); SSM Bharat (LPG booking and tracking).",
        "Web applications: Real Estate Web Application; EzBuy Marketplace; Business API Web Application.",
        "",
        "LANGUAGES",
        "Tamil, English, and Malayalam."
      ].join("\r\n");
      const blob = new Blob([resume], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Arun-Kumar-M-Resume.txt";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  });
}

document.addEventListener("DOMContentLoaded", initializeWebsite);
