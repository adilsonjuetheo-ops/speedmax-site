const menuToggle = document.querySelector(".menu-toggle");
const topbar = document.querySelector(".topbar");
const reveals = document.querySelectorAll(".reveal");

if (menuToggle && topbar) {
  menuToggle.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
    const expanded = document.body.classList.contains("menu-open");
    menuToggle.setAttribute("aria-expanded", String(expanded));
  });

  topbar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

reveals.forEach((element) => observer.observe(element));
