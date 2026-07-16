/* ==========================================================================
   rhythmcards.js — rhythm flashcards / echo-clap.
   Shows a 4-beat rhythm using note symbols and syllables. "Clap it for me"
   plays the pattern (with a count-in) so students can echo it back; "New card"
   deals a fresh one. Easy / Medium / Hard change which rhythms appear.
   ========================================================================== */

(function () {
  // Hand-drawn SVG note icons rather than Unicode music characters ("♩♫♬𝄽")
  // — those glyphs render inconsistently (or as a missing-tofu box, as with
  // the quarter rest) depending on the device's installed fonts. These are
  // plain vector shapes, so they look identical and correct everywhere.
  var NOTEHEAD = '<ellipse cx="{cx}" cy="82" rx="{r}" ry="{ry}" fill="#2b2140" transform="rotate(-18 {cx} 82)"/>';
  var STEM = '<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#2b2140"/>';
  function tpl(s, vals) { return s.replace(/\{(\w+)\}/g, function (_, k) { return vals[k]; }); }

  var ICONS = {
    quarter: '<svg viewBox="0 0 40 96" class="rnote-svg">' +
      tpl(NOTEHEAD, { cx: 16, r: 14, ry: 10.5 }) +
      tpl(STEM, { x: 27, y: 14, w: 6, h: 70 }) +
      '</svg>',
    eighths: '<svg viewBox="0 0 106 96" class="rnote-svg">' +
      tpl(NOTEHEAD, { cx: 16, r: 14, ry: 10.5 }) + tpl(STEM, { x: 27, y: 20, w: 6, h: 64 }) +
      tpl(NOTEHEAD, { cx: 76, r: 14, ry: 10.5 }) + tpl(STEM, { x: 87, y: 20, w: 6, h: 64 }) +
      tpl(STEM, { x: 27, y: 20, w: 66, h: 10 }) + // flat beam joining both stems
      '</svg>',
    sixteenths: '<svg viewBox="0 0 180 96" class="rnote-svg">' +
      [16, 62, 108, 154].map(function (cx) {
        return tpl(NOTEHEAD, { cx: cx, r: 13, ry: 9.5 }) + tpl(STEM, { x: cx + 10, y: 16, w: 5.5, h: 66 });
      }).join("") +
      tpl(STEM, { x: 26, y: 16, w: 143.5, h: 9 }) + tpl(STEM, { x: 26, y: 29, w: 143.5, h: 9 }) + // double flat beam
      '</svg>',
    rest: '<svg viewBox="0 0 40 70" class="rnote-svg">' +
      '<path d="M 26,6 C 30,12 20,16 24,22 L 8,36 L 28,46 L 10,58 C 6,62 8,66 14,64" ' +
      'fill="none" stroke="#2b2140" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
  };

  // One beat's worth of rhythm. hits = onset positions within the beat (0–1).
  var VALUES = {
    quarter:    { icon: ICONS.quarter,    syl: "ta",          hits: [0] },
    eighths:    { icon: ICONS.eighths,    syl: "ti-ti",       hits: [0, 0.5] },
    sixteenths: { icon: ICONS.sixteenths, syl: "ti-ka-ti-ka", hits: [0, .25, .5, .75] },
    rest:       { icon: ICONS.rest,       syl: "sh",          hits: [] }
  };
  var LEVELS = {
    "Easy":   ["quarter", "quarter", "eighths", "rest"],
    "Medium": ["quarter", "eighths", "eighths", "sixteenths", "rest"],
    "Hard":   ["quarter", "eighths", "sixteenths", "sixteenths", "rest", "eighths"]
  };

  function render(container, h) {
    var el = h.el;
    var state = { level: "Easy", tempo: 88, card: [], playing: false, timers: [] };

    container.appendChild(h.pageHead("🥁", "Rhythm Flashcards",
      "Read the rhythm, then clap it back after the app claps it for you."));

    // Level + tempo
    var levelGroup = el("div.pill-group");
    Object.keys(LEVELS).forEach(function (lv) {
      var p = el("button.pill", { text: lv, onclick: function () {
        state.level = lv; syncPills(levelGroup, lv); deal();
      }});
      if (lv === state.level) p.classList.add("is-active");
      p.dataset.label = lv;
      levelGroup.appendChild(p);
    });
    var tempoVal = el("b", { text: state.tempo + "" });
    var tempo = el("input", { type: "range", min: "20", max: "500", value: state.tempo + "", "aria-label": "Tempo",
      oninput: function () { state.tempo = +tempo.value; tempoVal.textContent = tempo.value; } });
    container.appendChild(el("div.card", null,
      el("div.control-row", null, el("span.hint", { text: "Level:" }), levelGroup),
      el("div.spacer-sm"),
      el("div.control-row", null, el("label.slider", null, el("span", { text: "🐢 Tempo " }), tempo,
        el("span", null, tempoVal, el("span", { text: " BPM 🐇" }))))
    ));

    // The card
    var beatsRow = el("div.rhythm-beats");
    container.appendChild(el("div.card.rhythm-card", null, beatsRow));

    // Controls
    var clapBtn = el("button.btn.btn--play", { html: "👏 Clap it for me", onclick: playCard });
    var newBtn = el("button.btn.btn--blue", { html: "🃏 New card", onclick: deal });
    container.appendChild(el("div.control-row", { style: "justify-content:center" }, clapBtn, newBtn));

    container.appendChild(el("div.card", null,
      el("p.hint", { text: "How to use it: deal a card, tap \"Clap it for me,\" listen through the count-in (4 clicks), then have students echo-clap the pattern back. Say the syllables together first!" })
    ));

    deal();

    // ---------------------------------------------------------------------
    function deal() {
      stop();
      var pool = LEVELS[state.level];
      state.card = [];
      for (var i = 0; i < 4; i++) {
        var pick = pool[Math.floor(Math.random() * pool.length)];
        state.card.push(pick);
      }
      // Avoid an all-rest card.
      if (state.card.every(function (v) { return v === "rest"; })) state.card[0] = "quarter";
      draw();
    }

    function draw() {
      beatsRow.innerHTML = "";
      state.card.forEach(function (id, i) {
        var v = VALUES[id];
        var cell = el("div.rbeat", null,
          el("div.glyph", { html: v.icon }),
          el("div.syl", { text: v.syl })
        );
        cell.dataset.i = i;
        beatsRow.appendChild(cell);
      });
    }

    function flash(i) {
      var cell = beatsRow.querySelector('.rbeat[data-i="' + i + '"]');
      if (!cell) return;
      cell.classList.add("hit");
      setTimeout(function () { cell.classList.remove("hit"); }, 220);
    }

    function playCard() {
      Sound.unlock();
      stop();
      state.playing = true;
      var beatSec = 60 / state.tempo;
      var t0 = Sound.now() + 0.1;

      // Count-in: 4 soft clicks (accent on 1).
      for (var c = 0; c < 4; c++) Sound.click(c === 0, t0 + c * beatSec);

      // The pattern starts after the count-in.
      var start = t0 + 4 * beatSec;
      state.card.forEach(function (id, i) {
        var v = VALUES[id];
        v.hits.forEach(function (f) {
          Sound.click(f === 0 && i === 0, start + (i + f) * beatSec);
        });
        // schedule the visual flash (real timer, relative to now)
        var ms = ((start + i * beatSec) - Sound.now()) * 1000;
        state.timers.push(setTimeout(function () { flash(i); }, Math.max(0, ms)));
      });
      // reset playing flag after it finishes
      state.timers.push(setTimeout(function () { state.playing = false; }, ((start + 4 * beatSec) - Sound.now()) * 1000));
    }

    function stop() {
      state.playing = false;
      state.timers.forEach(clearTimeout);
      state.timers = [];
    }

    function syncPills(row, label) {
      Array.prototype.forEach.call(row.children, function (b) {
        b.classList.toggle("is-active", b.dataset.label === label);
      });
    }

    return stop;
  }

  App.register({
    id: "rhythmcards",
    title: "Rhythm Flashcards",
    emoji: "🥁",
    desc: "Echo-clap 4-beat rhythm cards at three levels.",
    color: "tile--lime",
    render: render
  });
})();
