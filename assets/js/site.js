// assets/js/site.js

(function () {
  "use strict";

  // ====== helpers ======
  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function normalize(s){
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // quita acentos
  }

  // ====== Theme (light/dark/system) ======
  const root = document.documentElement;

  function applyTheme(theme){
    if(theme === "dark"){
      root.setAttribute("data-theme","dark");
    } else if(theme === "light"){
      root.removeAttribute("data-theme");
    } else {
      // system
      root.removeAttribute("data-theme");
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.setAttribute("data-theme","dark");
      }
    }
  }

  // expone setTheme global para onclick en HTML
  window.setTheme = function setTheme(theme){
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  };

  const savedTheme = localStorage.getItem("theme") || "system";
  applyTheme(savedTheme);

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if ((localStorage.getItem("theme") || "system") === "system") {
        applyTheme("system");
      }
    });
  }

  // ====== Search (solo si existe #q y tarjetas .card) ======
  const q = $("#q");
  const cards = $all(".card");

  function runSearch(){
    if(!q || cards.length === 0) return;

    const term = normalize(q.value.trim());

    cards.forEach(card => {
      const topic = normalize(card.getAttribute("data-topic") || "");
      const lis = $all("li", card);

      let anyVisible = false;

      lis.forEach(li => {
        const text = normalize(li.textContent);
        const match = !term || topic.includes(term) || text.includes(term);
        li.classList.toggle("hidden", !match);
        if (match) anyVisible = true;
      });

      // Si ninguna línea quedó visible, ocultamos toda la tarjeta
      card.classList.toggle("hidden", !anyVisible);
    });
  }

  if(q){
    q.addEventListener("input", runSearch);
  }

  // ====== Optional: auto-focus search on "/" ======
  document.addEventListener("keydown", (e) => {
    if (!q) return;
    if (e.key === "/" && (e.target === document.body || e.target === document.documentElement)) {
      e.preventDefault();
      q.focus();
    }
  });
})();
