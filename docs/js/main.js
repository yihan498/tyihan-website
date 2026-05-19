/* Dark mode */
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') root.setAttribute('data-theme', 'dark');
})();

document.addEventListener('DOMContentLoaded', function () {
  /* ── Hero headline typewriter ── */
  (function () {
    const h = document.querySelector('.hero-headline');
    if (!h) return;
    const fullHTML = h.innerHTML.trim();

    const positions = [];
    let i = 0;
    while (i < fullHTML.length) {
      if (fullHTML[i] === '<') {
        i = fullHTML.indexOf('>', i) + 1;
      } else {
        i++;
        positions.push(fullHTML.slice(0, i));
      }
    }

    let pos = 0;
    h.innerHTML = '<span class="hl-cursor">|</span>';

    function type() {
      if (pos >= positions.length) {
        h.innerHTML = fullHTML;
        return;
      }
      h.innerHTML = positions[pos] + '<span class="hl-cursor">|</span>';
      pos++;
      setTimeout(type, 167);
    }

    setTimeout(type, 150);
  })();


  /* ── Dark mode toggle ── */
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    const root = document.documentElement;
    function updateIcon() {
      btn.textContent = root.getAttribute('data-theme') === 'dark' ? '☀' : '○';
      btn.setAttribute('aria-label', root.getAttribute('data-theme') === 'dark' ? '切换亮色模式' : '切换暗色模式');
    }
    updateIcon();
    btn.addEventListener('click', function () {
      const isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
      updateIcon();
    });
  }

  /* ── Scroll progress bar ── */
  const bar = document.getElementById('scroll-bar');
  if (bar) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ── Back to top ── */
  const top = document.getElementById('back-to-top');
  if (top) {
    window.addEventListener('scroll', function () {
      top.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
