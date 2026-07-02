/* ==========================================================================
   app.js — the small single-page "router" and shared UI helpers.
   Activities register themselves with App.register({...}). The home screen is
   built automatically from whatever is registered, so adding a new activity is
   a one-file job.
   ========================================================================== */

window.App = (function () {
  var view = null;
  var activities = [];   // registered activity descriptors
  var byId = {};
  var current = null;    // teardown fn for the active activity

  // ---- tiny DOM helper: el('div.card', {onclick:fn}, child, child...) ------
  function el(spec, attrs) {
    var parts = spec.split(/(?=[.#])/);
    var node = document.createElement(parts[0] || "div");
    for (var i = 1; i < parts.length; i++) {
      if (parts[i][0] === ".") node.classList.add(parts[i].slice(1));
      else if (parts[i][0] === "#") node.id = parts[i].slice(1);
    }
    if (attrs) {
      for (var k in attrs) {
        if (!attrs.hasOwnProperty(k)) continue;
        if (k === "html") node.innerHTML = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else if (k.slice(0, 2) === "on") node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        else if (k === "style") node.setAttribute("style", attrs[k]);
        else node.setAttribute(k, attrs[k]);
      }
    }
    for (var a = 2; a < arguments.length; a++) {
      var c = arguments[a];
      if (c == null) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x) node.appendChild(x); });
      else if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    }
    return node;
  }

  function register(descriptor) {
    activities.push(descriptor);
    byId[descriptor.id] = descriptor;
  }

  function clearView() {
    if (typeof current === "function") { try { current(); } catch (e) {} }
    current = null;
    view.innerHTML = "";
  }

  function goHome() {
    location.hash = "";
    renderHome();
  }

  // Standard page header with a Back button, used by every activity.
  function pageHead(emoji, title, subtitle) {
    return el("div.page-head", null,
      el("button.back-btn", { onclick: goHome, html: "← Home" }),
      el("span.emoji", { text: emoji }),
      el("div", null,
        el("h2", { text: title }),
        subtitle ? el("p", { text: subtitle }) : null
      )
    );
  }

  function renderHome() {
    clearView();
    var hero = el("div.hero", null,
      el("h1", { html: 'Welcome to the <span class="wave">Music Playground</span>!' }),
      el("p", { text: "Pick an activity below. Everything works with a tap — perfect for iPads, Chromebooks, and the classroom projector." })
    );
    var grid = el("div.tile-grid");
    activities.forEach(function (act) {
      var tile = el("button.tile." + act.color, {
        onclick: function () { open(act.id); },
        "aria-label": act.title
      },
        el("span.tile__emoji", { text: act.emoji }),
        el("div", null,
          el("div.tile__title", { text: act.title }),
          el("div.tile__desc", { text: act.desc })
        )
      );
      grid.appendChild(tile);
    });
    view.appendChild(hero);
    view.appendChild(grid);
    window.scrollTo(0, 0);
  }

  function open(id) {
    var act = byId[id];
    if (!act) return goHome();
    location.hash = id;
    clearView();
    // activity.render(container, helpers) may return a teardown function
    current = act.render(view, { el: el, pageHead: pageHead, goHome: goHome }) || null;
    window.scrollTo(0, 0);
  }

  function routeFromHash() {
    var id = (location.hash || "").replace(/^#/, "");
    if (id && byId[id]) open(id);
    else renderHome();
  }

  function start() {
    view = document.getElementById("view");

    document.getElementById("homeBtn").addEventListener("click", goHome);

    var fsBtn = document.getElementById("fullscreenBtn");
    fsBtn.addEventListener("click", function () {
      var d = document;
      if (!d.fullscreenElement && !d.webkitFullscreenElement) {
        var e = d.documentElement;
        (e.requestFullscreen || e.webkitRequestFullscreen || function(){}).call(e);
      } else {
        (d.exitFullscreen || d.webkitExitFullscreen || function(){}).call(d);
      }
    });

    window.addEventListener("hashchange", routeFromHash);
    routeFromHash();
  }

  return {
    register: register,
    start: start,
    el: el,
    goHome: goHome
  };
})();
