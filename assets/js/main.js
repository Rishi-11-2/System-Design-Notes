// System Design Notes & Engineering Blog - Main Application Script
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initReadingProgress();
  initSearchAndFilter();
  initTableOfContents();
  initCodeCopy();
  initBackToTop();
  initMermaid();
});

// Theme Management
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
  
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

// Reading Progress Bar
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
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
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">No matching notes found</h3>
          <p>Try searching with different keywords like "Aurora", "Kafka", "Spanner", "Redis", or "Sharding".</p>
        </div>
      `;
      return;
    }

    articlesGrid.innerHTML = filtered.map(article => `
      <a href="posts/${article.slug}" class="article-card">
        <div class="card-top">
          <span class="card-category">${escapeHtml(article.category)}</span>
          <span class="card-meta-time">⏱️ ${escapeHtml(article.readTime)}</span>
        </div>
        <h3 class="card-title">${escapeHtml(article.title)}</h3>
        <p class="card-excerpt">${escapeHtml(article.excerpt)}</p>
        <div class="card-tags">
          ${article.tags.map(tag => `<span class="card-tag">#${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="card-footer">
          <span>📅 ${escapeHtml(article.date)}</span>
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

// Initialize Mermaid.js
function initMermaid() {
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#1e1f1c',
        primaryColor: '#F92672',
        primaryTextColor: '#F8F8F2',
        primaryBorderColor: '#F92672',
        lineColor: '#66D9EF',
        secondaryColor: '#272822',
        tertiaryColor: '#3e3d32',
        noteBkgColor: '#272822',
        noteTextColor: '#F8F8F2'
      }
    });
  }
}

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
