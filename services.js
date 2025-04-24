// Animate cards when they enter the viewport
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".service-card");
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target); // animate only once
        }
      });
    }, {
      threshold: 0.3
    });
  
    cards.forEach(card => observer.observe(card));
  });
  