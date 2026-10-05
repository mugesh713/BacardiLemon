import { gsap } from './scroll.js';

/**
 * Shared navigation behaviour.
 * Desktop navigation remains unchanged; mobile uses the full-screen drawer.
 */
export function initNav() {
  const header = document.querySelector('[data-header]');
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');

  if (!header) return;

  const closeMenu = () => {
    document.documentElement.classList.remove('nav-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  };

  const onScroll = () => {
    header.classList.toggle('is-stuck', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const open = document.documentElement.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));

      if (open) {
        const links = drawer.querySelectorAll('.drawer__link, .drawer__sub');
        gsap.fromTo(
          links,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.045,
            ease: 'power3.out',
            delay: 0.08
          }
        );
      }
    });

    // Close the mobile menu after selecting any menu item.
    drawer.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link) closeMenu();
    });
  }

  // Close with Escape for accessibility.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  // Highlight the section currently in view.
  const links = [...document.querySelectorAll('[data-nav-link]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle(
            'is-current',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => io.observe(section));
  }
}
