function showSection(id) {
  // Hide all sections first
  const sections = document.querySelectorAll('.home-section, .service-section, .about-section, .contact-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  // Show the clicked section
  const section = document.getElementById(id);
  section.classList.add('active');
}
function showTech(tabId) {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tech-content');

  tabs.forEach(tab => tab.classList.remove('active'));
  contents.forEach(content => content.style.display = 'none');

  document.querySelector(`#${tabId}`).style.display = 'block';
  event.target.classList.add('active');
}

  window.addEventListener("scroll", function () {
    const section = document.querySelector(".about-container");
    const sectionTop = section.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight / 1.2;

    if (sectionTop < triggerPoint) {
      section.classList.add("reveal");
    }
  });
  window.addEventListener('scroll', () => {
    const serviceSection = document.querySelector('.services-left');
    const sectionPos = serviceSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.3;

    if (sectionPos < screenPos) {
      serviceSection.classList.add('show');
    }
  });
  window.addEventListener("scroll", () => {
    const heroContent = document.querySelector(".hero-content");
    const position = heroContent.getBoundingClientRect().top;
    const screenHeight = window.innerHeight;
  
    if (position < screenHeight - 100) {
      heroContent.classList.add("reveal");
    }
  });
  window.addEventListener("load", () => {
    document.querySelector(".hero-content").classList.add("reveal");
  });
function showTech(sectionId) {
  const allTechSections = document.querySelectorAll('.tech-content');
  allTechSections.forEach((section) => {
    section.classList.remove('active');
  });

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');

    // Scroll into view with smooth behavior
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Update active tab styling (optional)
  const allTabs = document.querySelectorAll('.tech-tabs .tab');
  allTabs.forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
}
window.addEventListener('DOMContentLoaded', () => {
  const heroImg = document.querySelector('.hero-image img');
  heroImg.classList.add('reveal');
});
function showAboutSection() {
  // Hide all sections
  const sections = document.querySelectorAll('.home-section, .service-section, .contact-section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  // Show about section and add animation
  const aboutSection = document.getElementById('about');
  aboutSection.classList.add('active');
  aboutSection.classList.remove('reveal'); // Reset animation

  // Trigger animation
  setTimeout(() => {
    aboutSection.classList.add('reveal');
  }, 50);
}

