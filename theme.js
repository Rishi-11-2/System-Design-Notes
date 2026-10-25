// Theme swatches + reading progress. No dependencies.
(function () {
  var root = document.documentElement;
  var buttons = document.querySelectorAll("[data-set-theme]");

  function current() {
    return (
      root.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
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

  var bar = document.getElementById("progress");
  if (bar) {
    var ticking = false;
    var update = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = "scaleX(" + ratio + ")";
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
