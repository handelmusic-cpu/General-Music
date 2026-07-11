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

  // Fire one custom event per activity/Home view. Guarded so a blocked or
  // slow-to-load analytics script can never break navigation.
  function trackView(id, title) {
    try {
      if (window.posthog) posthog.capture("activity_opened", { activity: id || "home", title: title || "Home" });
    } catch (e) {}
  }

  function renderHome() {
    clearView();
    trackView("home", "Home");
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
    trackView(id, act.title);
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

    initInstallBanner();
  }

  // ---- "Add to Home Screen" banner --------------------------------------
  // Chromebooks/Android/desktop Chrome fire beforeinstallprompt, so we can
  // trigger the real install flow. iPad Safari has no such event, so we show
  // simple manual instructions instead. Dismissal is remembered so it
  // doesn't nag on every visit.
  var DISMISS_KEY = "mp_install_dismissed_v1";
  var deferredInstallPrompt = null;

  function isStandalone() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
      window.navigator.standalone === true;
  }
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function initInstallBanner() {
    if (isStandalone()) return;
    var dismissed = false;
    try { dismissed = !!localStorage.getItem(DISMISS_KEY); } catch (e) {}
    if (dismissed) return;

    var banner = null;

    function showBanner(mode) {
      if (banner) return;
      banner = el("div.install-banner", null,
        el("span.install-banner__icon", { text: "📲" }),
        el("div.install-banner__text", null,
          el("b", { text: "Add Music Playground to your Home Screen!" }),
          el("span", { text: mode === "ios"
            ? " Tap the Share icon below, then \"Add to Home Screen.\""
            : " One tap to open, and it works offline too." })
        ),
        mode === "prompt" ? el("button.install-banner__btn", { text: "Install", onclick: doInstall }) : null,
        el("button.install-banner__close", { text: "✕", "aria-label": "Dismiss", onclick: dismissBanner })
      );
      document.body.appendChild(banner);
    }

    function dismissBanner() {
      if (banner) { banner.remove(); banner = null; }
      try { localStorage.setItem(DISMISS_KEY, "1"); } catch (e) {}
    }

    function doInstall() {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.finally(function () {
        deferredInstallPrompt = null;
        dismissBanner();
      });
    }

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredInstallPrompt = e;
      showBanner("prompt");
    });

    if (isIOS()) {
      setTimeout(function () { showBanner("ios"); }, 1500);
    }
  }

  // ---- "Magic Link" sharing helpers -----------------------------------
  // Creations are encoded into a URL query param (?key=...) so a shared link
  // reopens the exact grid — no server needed, perfect for static hosting.

  function readParam(key) {
    try { return new URLSearchParams(location.search).get(key); }
    catch (e) { return null; }
  }

  // Read a param, then strip it from the address bar so navigating away and
  // back doesn't keep reloading the shared creation over the student's edits.
  function consumeParam(key) {
    var params;
    try { params = new URLSearchParams(location.search); } catch (e) { return null; }
    if (!params.has(key)) return null;
    var value = params.get(key);
    params.delete(key);
    var s = params.toString();
    history.replaceState(null, "", location.pathname + (s ? "?" + s : "") + location.hash);
    return value;
  }

  function shareUrl(hashId, key, value) {
    return location.origin + location.pathname + "?" + key + "=" + encodeURIComponent(value) + "#" + hashId;
  }

  // Pack/unpack a "010110…" bit string as compact hex for short URLs.
  function bitsToHex(bits) {
    var hex = "";
    for (var i = 0; i < bits.length; i += 4) {
      var chunk = bits.substr(i, 4);
      while (chunk.length < 4) chunk += "0";
      hex += parseInt(chunk, 2).toString(16);
    }
    return hex;
  }
  function hexToBits(hex, len) {
    var bits = "";
    for (var i = 0; i < hex.length; i++) {
      var v = parseInt(hex.charAt(i), 16);
      if (isNaN(v)) v = 0;
      bits += ("000" + v.toString(2)).slice(-4);
    }
    while (bits.length < len) bits += "0";
    return bits.slice(0, len);
  }

  // Build the "Save My …" button + a reveal box that copies the link.
  // opts: { label, hashId, key, thing ("song"/"beat"), getValue: fn -> string }
  function shareControl(opts) {
    var box = el("div.share-box", { style: "display:none" });
    var btn = el("button.btn.btn--blue", { html: opts.label, onclick: function () {
      var url = shareUrl(opts.hashId, opts.key, opts.getValue());
      box.style.display = "";
      box.innerHTML = "";
      box.appendChild(el("div.share-msg", {
        html: "✨ Ta-da! Here's your <b>Magic Link</b> — it's copied! Paste it in a message, or open it later to hear your " + opts.thing + " again."
      }));
      var input = el("input.share-input", { type: "text", value: url, readonly: "readonly", "aria-label": "Your magic link" });
      input.addEventListener("focus", function () { input.select(); });
      box.appendChild(input);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).catch(function () {});
      }
      setTimeout(function () { input.focus(); input.select(); }, 30);
    }});
    return el("div", null, btn, box);
  }

  return {
    register: register,
    start: start,
    el: el,
    goHome: goHome,
    readParam: readParam,
    consumeParam: consumeParam,
    shareUrl: shareUrl,
    bitsToHex: bitsToHex,
    hexToBits: hexToBits,
    shareControl: shareControl
  };
})();
