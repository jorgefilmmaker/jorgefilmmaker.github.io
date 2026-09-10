// Tiny cinematic parallax / reveal
const hero = document.querySelector('.hero-image');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (hero && y < window.innerHeight * 1.2) {
    hero.style.transform = `translateY(${y * 0.08}px) scale(1.05)`;
  }
});

const items = document.querySelectorAll('.project, .statement, .about-grid, .reel-frame');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });

items.forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .8s ease, transform .8s ease';
  io.observe(el);
});

const style = document.createElement('style');
style.textContent = `.is-visible{opacity:1!important;transform:translateY(0)!important}`;
document.head.appendChild(style);
