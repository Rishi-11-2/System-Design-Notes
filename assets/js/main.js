// System Design Notes & Engineering Blog - Main Application Script
// Implements Array UI (ape-design) Interactions, Search, KaTeX & Mermaid

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initReadingProgress();
  initSearchAndFilter();
  initTableOfContents();
  initCodeCopy();
  initBackToTop();
  initMermaid();
  initKaTeX();
  initCodeHighlight();
});

window.addEventListener('load', () => {
  initMermaid();
  initKaTeX();
  initCodeHighlight();
});

// Highlight.js Code Highlighting Initializer
function initCodeHighlight() {
  if (typeof hljs !== 'undefined') {
    hljs.highlightAll();
  }
}
window.initCodeHighlight = initCodeHighlight;

// KaTeX Math Rendering Initializer (Pure HTML Mode to Prevent Duplicate MathML)
function initKaTeX() {
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'annotation', 'annotation-xml'],
      ignoredClasses: ['katex', 'mermaid'],
      output: 'html',
      throwOnError: false
    });
  }
}
window.initKaTeX = initKaTeX;

// Theme Management: Light, Dark & Sepia Themes
function initTheme() {
  const themes = ["light", "dark", "sepia"];
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const swatches = document.querySelectorAll('[data-set-theme]');
  const prefersDark = (typeof window.matchMedia === 'function') 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches 
    : false;
  
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (e) {}

  // Default to saved theme, or system dark/light preference if not set
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  // Support 3-dot swatches
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const theme = swatch.dataset.setTheme;
      if (theme) {
        applyTheme(theme);
        try {
          localStorage.setItem('theme', theme);
        } catch (e) {}
      }
    });
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = root.dataset.theme || (prefersDark ? 'dark' : 'light');
      const currentIndex = themes.indexOf(currentTheme);
      const nextTheme = themes[(currentIndex !== -1 ? currentIndex + 1 : 0) % themes.length];
      applyTheme(nextTheme);
      try {
        localStorage.setItem('theme', nextTheme);
      } catch (e) {}
    });
  }

  // Follow system theme changes if user has not explicitly locked a theme in localStorage
  if (typeof window.matchMedia === 'function') {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (mediaQuery && mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', (e) => {
          let hasSaved = false;
          try {
            hasSaved = !!localStorage.getItem('theme');
          } catch (err) {}
          if (!hasSaved) {
            applyTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
    } catch (e) {}
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.setAttribute('data-theme', theme);

  // Update swatches pressed state
  const swatches = document.querySelectorAll('[data-set-theme]');
  swatches.forEach(s => {
    s.setAttribute('aria-pressed', String(s.dataset.setTheme === theme));
  });

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('.theme-icon');
    const themeIcons = {
      light: '☀️',
      dark: '🌙',
      sepia: '📜'
    };
    if (icon) {
      icon.textContent = themeIcons[theme] || '☀️';
    }
    const themeTooltips = {
      light: 'Light Theme (Click for Dark)',
      dark: 'Dark Theme (Click for Sepia)',
      sepia: 'Sepia Theme (Click for Light)'
    };
    toggleBtn.setAttribute('data-tooltip', themeTooltips[theme] || `Theme: ${theme}`);
    toggleBtn.setAttribute('aria-label', `Theme toggle: currently ${theme}`);
  }
}

// Reading Progress Bar
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  const bar = document.getElementById('progress');
  if (!progressBar && !bar) return;

  let ticking = false;
  const update = function () {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (progressBar) {
      progressBar.style.width = `${ratio * 100}%`;
    }
    if (bar) {
      bar.style.transform = "scaleX(" + ratio + ")";
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

// Search and Filtering (for Home/Index Page)
function initSearchAndFilter() {
  const searchInput = document.getElementById('search-input');
  const articlesGrid = document.getElementById('articles-grid');
  const filterChips = document.querySelectorAll('.filter-chip');
  const resultsCount = document.getElementById('results-count');

  if (!articlesGrid || typeof ARTICLES_DATA === 'undefined') return;

  let activeCategory = 'all';
  let searchQuery = '';

  // Render initial articles
  renderArticles();

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderArticles();
    });

    // Keyboard shortcut / or Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      } else if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchQuery = '';
        searchInput.blur();
        renderArticles();
      }
    });
  }

  // Filter chips click
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category');
      renderArticles();
    });
  });

  function renderArticles() {
    const filtered = ARTICLES_DATA.filter(article => {
      const matchesCategory = activeCategory === 'all' || article.categorySlug === activeCategory;
      const matchesSearch = !searchQuery || 
        article.title.toLowerCase().includes(searchQuery) ||
        article.excerpt.toLowerCase().includes(searchQuery) ||
        article.category.toLowerCase().includes(searchQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery));
      return matchesCategory && matchesSearch;
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${filtered.length} of ${ARTICLES_DATA.length} notes`;
    }

    if (filtered.length === 0) {
      articlesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 0.75rem;">🔍</div>
          <h3 style="color: var(--text-heading); margin-bottom: 0.5rem; font-family: var(--font-heading);">No matching notes found</h3>
          <p style="font-size: 0.9rem;">Try searching for "Aurora", "Spanner", "Kafka", "Consistent Hashing", or "Redis".</p>
        </div>
      `;
      return;
    }

    articlesGrid.innerHTML = filtered.map(article => `
      <a href="posts/${article.slug}" class="article-card">
        <div class="card-top">
          <span class="card-category aui-badge">${escapeHtml(article.category)}</span>
        </div>
        <h3 class="card-title">${escapeHtml(article.title)}</h3>
        <p class="card-excerpt">${escapeHtml(article.excerpt)}</p>
        <div class="card-tags">
          ${article.tags.map(tag => `<span class="card-tag">#${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="card-footer">
          <span class="read-btn">Read Notes →</span>
        </div>
      </a>
    `).join('');
  }
}

// Table of Contents Active ScrollSpy
function initTableOfContents() {
  const tocLinks = document.querySelectorAll('.toc-list a');
  if (tocLinks.length === 0) return;

  const headings = Array.from(document.querySelectorAll('.prose h2, .prose h3'));
  if (headings.length === 0) return;

  function updateActiveToc() {
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      if (heading.offsetTop <= scrollPos) {
        currentId = heading.getAttribute('id');
        break;
      }
    }

    if (!currentId && headings.length > 0) {
      currentId = headings[0].getAttribute('id');
    }

    tocLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveToc, { passive: true });
  updateActiveToc();
}

// Copy to Clipboard for Code Blocks
function initCodeCopy() {
  document.querySelectorAll('.btn-copy').forEach(button => {
    button.addEventListener('click', () => {
      const wrapper = button.closest('.code-wrapper');
      const codeElement = wrapper ? wrapper.querySelector('pre code') : null;
      if (!codeElement) return;

      const codeText = codeElement.innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.borderColor = 'var(--primary)';
        button.style.color = 'var(--primary)';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.borderColor = '';
          button.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Initialize Mermaid.js with Theme-Adaptive Palette (Light, Dark & Sepia)
async function initMermaid() {
  if (typeof mermaid !== 'undefined') {
    const root = document.documentElement;
    const prefersDark = (typeof window.matchMedia === 'function') 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches 
      : false;
    const currentTheme = root.dataset.theme || (prefersDark ? 'dark' : 'light');
    
    const isDark = currentTheme === 'dark';
    const bkgColor = isDark ? '#222226' : (currentTheme === 'sepia' ? '#faf4e6' : '#ffffff');
    const primaryCol = isDark ? '#7fb5b5' : (currentTheme === 'sepia' ? '#8a4b2a' : '#2f6f73');
    const textCol = isDark ? '#d8d8d8' : (currentTheme === 'sepia' ? '#433422' : '#2b2b2b');
    const borderCol = isDark ? '#333338' : (currentTheme === 'sepia' ? '#e0d3b8' : '#e6dfd3');
    const lineCol = isDark ? '#7fb5b5' : (currentTheme === 'sepia' ? '#8a4b2a' : '#2f6f73');

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        darkMode: isDark,
        background: bkgColor,
        primaryColor: primaryCol,
        primaryTextColor: textCol,
        primaryBorderColor: borderCol,
        lineColor: lineCol,
        secondaryColor: bkgColor,
        tertiaryColor: bkgColor,
        noteBkgColor: bkgColor,
        noteTextColor: textCol,
        noteBorderColor: borderCol,
        actorBkg: bkgColor,
        actorBorder: primaryCol,
        actorTextColor: textCol,
        actorLineColor: borderCol,
        signalColor: primaryCol,
        signalTextColor: textCol,
        labelBoxBkgColor: bkgColor,
        labelBoxBorderColor: borderCol,
        labelTextColor: textCol,
        loopTextColor: textCol,
        altSectionBkgColor: bkgColor,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }
    });
    try {
      await mermaid.run();
    } catch (err) {
      console.warn('Mermaid rendering error:', err);
    }
  }
}
window.initMermaid = initMermaid;

// Helper: Escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
