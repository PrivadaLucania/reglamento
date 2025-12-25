// assets/js/site.js
// Privada Lucania — Reglamento Interno 2024
// Bootstrap 5.3 + tema claro/oscuro/sistema + buscador (solo si existe #q)

(function () {
  "use strict";

  const root = document.documentElement;

  // ====== Helpers ======
  function $(sel, ctx = document) { return ctx.querySelector(sel); }
  function $all(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

  function normalize(s){
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // quita acentos
  }

  // ====== Theme handling ======
  // - Tu CSS: usa data-theme="dark" para variables/superficies propias
  // - Bootstrap: usa data-bs-theme="dark|light"
  function setBootstrapTheme(mode){
    // mode: "dark" | "light"
    root.setAttribute("data-bs-theme", mode);
  }

  function applyTheme(theme){
    if(theme === "dark"){
      root.setAttribute("data-theme","dark");
      setBootstrapTheme("dark");
      return;
    }

    if(theme === "light"){
      root.removeAttribute("data-theme");
      setBootstrapTheme("light");
      return;
    }

    // system
    root.removeAttribute("data-theme");

    const prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (prefersDark) {
      root.setAttribute("data-theme","dark");
      setBootstrapTheme("dark");
    } else {
      setBootstrapTheme("light");
    }
  }

  // Exponer global para tus onclick
  window.setTheme = function setTheme(theme){
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  };

  // Cargar tema guardado
  const savedTheme = localStorage.getItem("theme") || "system";
  applyTheme(savedTheme);

  // Reaccionar a cambios del sistema si está en "system"
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if ((localStorage.getItem("theme") || "system") === "system") {
        applyTheme("system");
      }
    });
  }

  // ====== Search (solo para páginas que lo tengan) ======
  const q = $("#q");
  const cards = $all("[data-topic]"); // más flexible que .card

  function runSearch(){
    if(!q || cards.length === 0) return;

    const term = normalize(q.value.trim());

    cards.forEach(card => {
      const topic = normalize(card.getAttribute("data-topic") || "");
      // buscamos elementos que se oculten (li o cualquier item)
      const items = $all("li", card);

      // Si no hay <li>, intentamos con links directos
      const nodes = items.length ? items : $all("a", card);

      let anyVisible = false;

      nodes.forEach(node => {
        const text = normalize(node.textContent);
        const match = !term || topic.includes(term) || text.includes(term);
        node.classList.toggle("d-none", !match);
        if (match) anyVisible = true;
      });

      // Oculta el bloque completo si nada coincide
      card.classList.toggle("d-none", !anyVisible);
    });
  }

  if(q){
    q.addEventListener("input", runSearch);

    // Atajo: "/" para enfocar el buscador (solo si no estás escribiendo en un input)
    document.addEventListener("keydown", (e) => {
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
      const typing = tag === "input" || tag === "textarea" || (e.target && e.target.isContentEditable);

      if (!typing && e.key === "/") {
        e.preventDefault();
        q.focus();
      }
    });
  }

  // ====== (Opcional) Marcar link activo en navbar si aplica ======
  // Si luego agregas más links, puedes reutilizarlo:
  // const path = location.pathname.split("/").pop() || "index.html";
  // $all(".navbar a.nav-link").forEach(a => {
  //   if ((a.getAttribute("href") || "").endsWith(path)) a.classList.add("active");
  // });
})();
