// Gym Growth HQ Website

console.log("Gym Growth HQ Loaded 🚀");

// Smooth animation on page load
window.addEventListener("load", () => {
  document.body.style.opacity = "1";
});

document.body.style.opacity = "0";
document.body.style.transition = "opacity 0.8s ease";

// Highlight active menu while scrolling
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// Button animation
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "scale(1.05)";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
  });
});
