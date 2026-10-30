// Theme dots and the contents rail. No dependencies.
(function () {
  var root = document.documentElement;

  /* ---- Theme dots ---- */
  var buttons = document.querySelectorAll("[data-set-theme]");

  function current() {
    return root.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  function mark() {
    var now = current();
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.setTheme === now));
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      root.dataset.theme = b.dataset.setTheme;
      try { localStorage.setItem("theme", b.dataset.setTheme); } catch (e) {}
      mark();
    });
  });
  mark();

  /* ---- Contents rail: built from the h2 headings of a note (only on reading-main pages) ---- */
  var note = document.querySelector("main.reading-main article.note");
  var main = document.querySelector("main.reading-main");
  if (!note || !main) return;

  var headings = Array.prototype.slice.call(note.querySelectorAll("h2"));
  if (headings.length < 3) return;

  var used = {};
  headings.forEach(function (h) {
    if (h.id) { used[h.id] = true; return; }
    var base = h.textContent.toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
    var id = base, n = 2;
    while (used[id] || document.getElementById(id)) id = base + "-" + n++;
    used[id] = true;
    h.id = id;
  });

  var nav = document.createElement("nav");
  nav.className = "toc";
  nav.setAttribute("aria-label", "Contents");
  var list = document.createElement("ul");
  var links = headings.map(function (h) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
    return a;
  });
  nav.appendChild(list);
  main.appendChild(nav);

  var ticking = false;
  function update() {
    ticking = false;
    var line = window.innerHeight * 0.3;
    var active = -1;
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top <= line) active = i; else break;
    }
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) active = headings.length - 1;
    links.forEach(function (a, i) {
      if (i === active) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
