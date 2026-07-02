/* ==========================================================================
   composers.js — Composer Spotlight (Bach, Mozart, Beethoven).
   A timeline shows when each composer lived, and each card has kid-friendly
   facts, famous works, and — where we can play it with confidence — a short
   synthesized excerpt. Otherwise a "Find a recording" link goes deeper.
   ========================================================================== */

(function () {
  var TIMELINE_START = 1650, TIMELINE_END = 1850;

  function render(container, h) {
    var el = h.el;
    container.appendChild(h.pageHead("🎼", "Composer Spotlight",
      "Meet three of history's most famous composers."));

    // ---- Timeline ----------------------------------------------------
    var timeline = el("div.composer-timeline");
    var bar = el("div.timeline-bar");
    DATA.composers.forEach(function (c) {
      var leftPct = ((c.born - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100;
      leftPct = Math.max(3, Math.min(97, leftPct));
      var dot = el("div.timeline-dot", { style: "left:" + leftPct + "%;--dc:" + c.color },
        el("span.timeline-dot-label", { text: c.short })
      );
      bar.appendChild(dot);
    });
    timeline.appendChild(bar);
    container.appendChild(el("div.card", null,
      el("div.hint", { text: "Who lived when?" }), timeline
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
    desc: "Meet Bach, Mozart & Beethoven.",
    color: "tile--gold",
    render: render
  });
})();
