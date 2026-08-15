/* ==========================================================================
   composers.js — Composer Spotlight.
   A timeline shows when each composer lived, and each card has kid-friendly
   facts, famous works, and — where we can play it with confidence — a short
   synthesized excerpt. Otherwise a "Find a recording" link goes deeper.
   ========================================================================== */

(function () {
  var TIMELINE_START = 1650, TIMELINE_END = 1950;
  var ZOOM_MIN = 1, ZOOM_MAX = 10, ZOOM_STEP = 0.5;
  // Label text doesn't shrink as the timeline widens, so composers born in
  // the same or nearby years (Bach/Handel both 1685; the cluster of
  // Bartók/Kodály/Stravinsky in the 1880s) would still collide at any zoom
  // level if every label sat at the same height. Cycling labels through a
  // few vertical rows — in chronological order, so neighbors in time land
  // on different rows — fixes that independently of zoom.
  var LABEL_ROWS = 4, LABEL_ROW_STEP = 20, LABEL_BASE_OFFSET = 28;

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function touchDist(touches) {
    var dx = touches[0].clientX - touches[1].clientX;
    var dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function render(container, h) {
    var el = h.el;
    container.appendChild(h.pageHead("🎼", "Composer Spotlight",
      "Meet many of history's most famous composers."));

    // ---- Timeline (pinch/scroll/button-zoomable) --------------------------
    // Dot positions are set as a % of the bar's own width, so zooming is just
    // widening the bar inside a horizontally-scrolling wrapper — every dot's
    // "left:x%" stays correct with no repositioning math needed.
    var state = { zoom: 1 };

    var scrollWrap = el("div.timeline-scroll");
    var bar = el("div.timeline-bar");
    DATA.composers.forEach(function (c, i) {
      var leftPct = ((c.born - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100;
      leftPct = Math.max(3, Math.min(97, leftPct));
      var row = i % LABEL_ROWS;
      var labelOffset = LABEL_BASE_OFFSET + row * LABEL_ROW_STEP;
      var dot = el("div.timeline-dot", { style: "left:" + leftPct + "%;--dc:" + c.color },
        el("span.timeline-dot-label", { text: c.short, style: "top:-" + labelOffset + "px" })
      );
      bar.appendChild(dot);
    });
    scrollWrap.appendChild(bar);

    function applyZoom() {
      bar.style.width = (state.zoom * 100) + "%";
      zoomLabel.textContent = state.zoom.toFixed(1) + "×";
    }

    var zoomOutBtn = el("button.timeline-zoom-btn", { html: "－", "aria-label": "Zoom out", onclick: function () {
      state.zoom = clamp(state.zoom - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX);
      applyZoom();
    }});
    var zoomLabel = el("button.timeline-zoom-btn.timeline-zoom-label", { text: "1.0×", "aria-label": "Reset zoom", onclick: function () {
      state.zoom = 1; applyZoom(); scrollWrap.scrollLeft = 0;
    }});
    var zoomInBtn = el("button.timeline-zoom-btn", { html: "＋", "aria-label": "Zoom in", onclick: function () {
      state.zoom = clamp(state.zoom + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX);
      applyZoom();
    }});

    // Trackpad pinch (and ctrl+scroll) sends wheel events with ctrlKey set.
    scrollWrap.addEventListener("wheel", function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      state.zoom = clamp(state.zoom + (e.deltaY > 0 ? -0.15 : 0.15), ZOOM_MIN, ZOOM_MAX);
      applyZoom();
    }, { passive: false });

    // Two-finger touch pinch. One-finger touches are left alone so the
    // wrapper's native horizontal scroll (touch-action: pan-x) still works.
    var pinch = null;
    scrollWrap.addEventListener("touchstart", function (e) {
      if (e.touches.length === 2) pinch = { dist: touchDist(e.touches), zoom: state.zoom };
    }, { passive: true });
    scrollWrap.addEventListener("touchmove", function (e) {
      if (!pinch || e.touches.length !== 2) return;
      e.preventDefault();
      state.zoom = clamp(pinch.zoom * (touchDist(e.touches) / pinch.dist), ZOOM_MIN, ZOOM_MAX);
      applyZoom();
    }, { passive: false });
    scrollWrap.addEventListener("touchend", function (e) {
      if (e.touches.length < 2) pinch = null;
    });

    applyZoom();

    var timeline = el("div.composer-timeline", null,
      scrollWrap,
      el("div.timeline-zoom-controls", null, zoomOutBtn, zoomLabel, zoomInBtn)
    );
    container.appendChild(el("div.card", null,
      el("div.hint", { text: "Who lived when? Pinch, ctrl+scroll, or use the buttons to zoom in." }), timeline
    ));

    // ---- Composer cards -------------------------------------------------
    var grid = el("div.composer-grid");
    DATA.composers.forEach(function (c) {
      var avatar = el("div.composer-avatar", { style: "--ac:" + c.color, text: c.short.charAt(0) });
      var factsList = el("ul.composer-facts");
      c.facts.forEach(function (f) { factsList.appendChild(el("li", { text: f })); });

      var worksLine = el("p.composer-works", { html: "🎵 <b>Famous works:</b> " + c.works.map(escapeHtml).join(" · ") });

      var actions = el("div.song-actions");
      if (c.melody || c.melodyFromSong) {
        var playBtn = el("button.mini-btn.mini-btn--play", { html: "🔊 " + (c.melodyCaption || "Hear a melody"), onclick: function () {
          if (playBtn.disabled) return;
          var mel = c.melody || DATA.melodies[c.melodyFromSong];
          var secs = Sound.playMelody(mel.notes, mel.tempo);
          playBtn.disabled = true; playBtn.style.opacity = "0.55";
          var was = playBtn.innerHTML; playBtn.innerHTML = "🎶 Playing…";
          setTimeout(function () { playBtn.disabled = false; playBtn.style.opacity = "1"; playBtn.innerHTML = was; }, (secs + 0.3) * 1000);
        }});
        actions.appendChild(playBtn);
      }
      var url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(c.searchQuery);
      actions.appendChild(el("a.mini-btn.mini-btn--link", { href: url, target: "_blank", rel: "noopener noreferrer", html: "🎬 Find a recording" }));

      var card = el("div.composer-card", { style: "--ac:" + c.color },
        avatar,
        el("div.composer-info", null,
          el("h3", { text: c.name }),
          el("div.composer-meta", { text: c.era + " · " + c.country + " · " + c.born + "–" + c.died }),
          factsList,
          worksLine,
          actions
        )
      );
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  App.register({
    id: "composers",
    title: "Composer Spotlight",
    emoji: "🎼",
    desc: "Meet Bach, Mozart, Beethoven & more.",
    color: "tile--gold",
    render: render
  });
})();
