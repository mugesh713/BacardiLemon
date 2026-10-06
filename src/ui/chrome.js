import { BRAND, CONTACT, PRODUCTS } from '../brand.js';

/**
 * Shared page chrome — header, products submenu, mobile drawer and footer.
 * Rendered here rather than duplicated across thirteen HTML files.
 */

const NAV = [
  ['Home', 'index.html'],
  ['About Us', 'about.html'],
  ['Products', 'products.html', true],
  ['Quality & Sourcing', 'quality.html'],
  ['Export Markets', 'markets.html'],
  ['Insights', 'insights.html'],
  ['Contact', 'contact.html'],
];

const PRODUCT_FILES = PRODUCTS.map((p) => p.file);

function currentPage() {
  const f = location.pathname.split('/').pop();
  return !f || f === '' ? 'index.html' : f;
}

function submenuHTML() {
  return `<div class="subnav" role="menu">${
    PRODUCTS.map((p) => `
      <a class="subnav__item" role="menuitem" href="${p.file}">
        <span class="subnav__dot" style="--pc:${p.accent}"></span>
        <span>${p.name}</span>${p.primary ? '<em class="subnav__tag">Primary focus</em>' : ''}
      </a>`).join('')
  }</div>`;
}

function headerHTML(here) {
  const links = NAV.map(([label, href, hasSub]) => {
    // Product detail pages keep the Products tab lit.
    const active = href === here || (hasSub && PRODUCT_FILES.includes(here));
    if (!hasSub) {
      return `<a class="nav__link${active ? ' is-current' : ''}" href="${href}">${label}</a>`;
    }
    return `<span class="nav__group" data-subnav>
      <a class="nav__link${active ? ' is-current' : ''}" href="${href}" aria-haspopup="true" aria-expanded="false">${label}<i class="nav__caret" aria-hidden="true"></i></a>
      ${submenuHTML()}
    </span>`;
  }).join('');

  return `
  <div class="header__inner">
    <a href="index.html" class="logo">
      <img src="${BRAND.logo}" alt="${BRAND.short || ''}" class="site-logo-img" />
    </a>
    <nav class="nav" aria-label="Main navigation">${links}</nav>
    <button class="burger" data-burger aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-drawer"><span></span><span></span><span></span></button>
  </div>`;
}

function drawerHTML(here) {
  const main = "<nav aria-label=\"Mobile navigation\">" + NAV.map(([label, href]) =>
    `<a class="drawer__link${href === here ? ' is-current' : ''}" href="${href}">${label}</a>`).join('');
  return `${main}</nav>`;
}

function footerHTML() {
  const products = PRODUCTS.map((p) => `<li><a href="${p.file}">${p.name}</a></li>`).join('');
  const nav = NAV.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('');

  return `
  <div class="wrap">
    <div class="footer__logo" data-gl="logo" aria-hidden="true"></div>
    <p class="footer__claim h3">Indian spices.<br />Global markets.</p>

    <div class="footer__cols">
      <div class="footer__col">
        <h4>Contact</h4>
        <address class="footer__addr">
          ${BRAND.name}<br />
          ${CONTACT.addressLines.join('<br />')}<br /><br />
          <a href="${CONTACT.phoneHref}">${CONTACT.phone}</a><br />
          <a href="mailto:${CONTACT.email}">${CONTACT.email}</a><br /><br />
          ${CONTACT.hours}
        </address>
      </div>
      <div class="footer__col"><h4>Products</h4><ul>${products}</ul></div>
      <div class="footer__col"><h4>Navigate</h4><ul>${nav}</ul></div>
      <div class="footer__col">
        <h4>Enquiries</h4>
        <p class="body" style="color:#ffffffb0">
          Share your product, quantity, packaging and destination and we will
          review the requirement and reply.
        </p>
      </div>
    </div>

    <div class="footer__bottom mono">
      <span>© 2026 ${BRAND.name}</span><span class="spacer"></span>
      <span>${BRAND.tagline}</span>
    </div>
  </div>`;
}

function chatHTML() {
  return `
    <aside class="site-chat" aria-label="MIDLANE contact options">
      <a class="site-chat__whatsapp" href="${CONTACT.phoneHref}" target="_blank" rel="noopener" aria-label="Chat with MIDLANE on WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.08 0C5.54 0 .22 5.32.22 11.87c0 2.09.55 4.13 1.59 5.92L.12 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.42h.01c6.54 0 11.86-5.32 11.86-11.87 0-3.17-1.23-6.15-3.45-8.38ZM12.09 21.7h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.84 9.84 0 0 1-1.51-5.19c0-5.42 4.41-9.83 9.84-9.83a9.8 9.8 0 0 1 6.96 2.88 9.82 9.82 0 0 1 2.88 6.97c0 5.41-4.4 9.82-9.81 9.82Zm5.39-7.36c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.19.29-.75.95-.92 1.14-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.58-.9-2.17-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3 .15.2 2.04 3.11 4.94 4.36.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34Z"/></svg>
      </a>
    </aside>`;
}

/** Keyboard and touch support for the products submenu. */
function wireSubnav() {
  document.querySelectorAll('[data-subnav]').forEach((group) => {
    const trigger = group.querySelector('.nav__link');
    if (!trigger) return;
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        group.querySelector('.subnav__item')?.focus();
      }
    });
    // On touch the first tap opens the menu rather than navigating.
    trigger.addEventListener('click', (e) => {
      if (!window.matchMedia('(hover: none)').matches) return;
      if (!group.classList.contains('is-open')) {
        e.preventDefault();
        group.classList.add('is-open');
      }
    });
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('[data-subnav].is-open').forEach((g) => {
      if (!g.contains(e.target)) g.classList.remove('is-open');
    });
  });
}

export function initChrome() {
  const here = currentPage();

  const header = document.querySelector('[data-chrome="header"]');
  if (header) {
    header.className = 'header';
    header.setAttribute('data-header', '');
    header.innerHTML = headerHTML(here);
  }

  const drawer = document.querySelector('[data-chrome="drawer"]');
  if (drawer) {
    drawer.className = 'drawer';
    drawer.setAttribute('data-drawer', '');
    drawer.innerHTML = drawerHTML(here);
  }

  const footer = document.querySelector('[data-chrome="footer"]');
  if (footer) {
    footer.className = 'footer dark';
    footer.innerHTML = footerHTML();
  }

  const word = document.querySelector('.loader__word');
  if (word) word.textContent = BRAND.name;

  wireSubnav();
  document.body.insertAdjacentHTML('beforeend', chatHTML());
}
