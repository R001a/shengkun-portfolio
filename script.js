const revealItems = document.querySelectorAll(".reveal");
const backTop = document.querySelector(".back-top");
const navLinks = [...document.querySelectorAll(".nav a")];

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px" },
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.35 },
);

document.querySelectorAll("section[id], footer[id]").forEach((section) => {
  sectionObserver.observe(section);
});

window.addEventListener("scroll", () => {
  backTop.classList.toggle("visible", window.scrollY > 900);
});

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    img.closest("figure, .stage-frame")?.classList.add("missing-image");
  });
});
