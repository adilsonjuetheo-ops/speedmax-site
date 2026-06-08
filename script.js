const menuToggle = document.querySelector(".menu-toggle");
const topbar = document.querySelector(".topbar");
const reveals = document.querySelectorAll(".reveal");
const faqQuestions = document.querySelectorAll(".faq-question");
const testimonialTrack = document.getElementById("testimonialTrack");
const prevTestimonial = document.getElementById("prevTestimonial");
const nextTestimonial = document.getElementById("nextTestimonial");
const whatsappWidget = document.getElementById("whatsappWidget");
const whatsappClose = document.getElementById("whatsappClose");

if (menuToggle && topbar) {
  menuToggle.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(document.body.classList.contains("menu-open")));
  });

  topbar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

window.addEventListener(
  "scroll",
  () => {
    if (!topbar) {
      return;
    }

    topbar.classList.toggle("is-scrolled", window.scrollY > 30);
  },
  { passive: true }
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

reveals.forEach((element) => revealObserver.observe(element));

faqQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item?.querySelector(".faq-answer");

    if (!item || !answer) {
      return;
    }

    const isOpen = item.classList.contains("is-open");

    document.querySelectorAll(".faq-item").forEach((faqItem) => {
      faqItem.classList.remove("is-open");
      const faqAnswer = faqItem.querySelector(".faq-answer");
      if (faqAnswer) {
        faqAnswer.style.maxHeight = "0px";
      }
    });

    if (!isOpen) {
      item.classList.add("is-open");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

if (testimonialTrack && prevTestimonial && nextTestimonial) {
  const cards = Array.from(testimonialTrack.children);
  let index = 0;

  const getPerView = () => {
    if (window.innerWidth <= 840) {
      return 1;
    }

    if (window.innerWidth <= 1100) {
      return 2;
    }

    return 3;
  };

  const updateSlider = () => {
    const perView = getPerView();
    const maxIndex = Math.max(0, cards.length - perView);
    index = Math.min(index, maxIndex);

    const firstCard = cards[0];
    if (!firstCard) {
      return;
    }

    const gap = 24;
    const offset = index * (firstCard.getBoundingClientRect().width + gap);
    testimonialTrack.style.transform = `translateX(-${offset}px)`;

    prevTestimonial.disabled = index === 0;
    nextTestimonial.disabled = index === maxIndex;
  };

  prevTestimonial.addEventListener("click", () => {
    index -= 1;
    updateSlider();
  });

  nextTestimonial.addEventListener("click", () => {
    index += 1;
    updateSlider();
  });

  window.addEventListener("resize", updateSlider);
  updateSlider();
}

if (whatsappWidget && whatsappClose) {
  whatsappClose.addEventListener("click", () => {
    whatsappWidget.classList.add("is-hidden");
  });
}
