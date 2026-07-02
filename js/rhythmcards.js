/* ==========================================================================
   rhythmcards.js — rhythm flashcards / echo-clap.
   Shows a 4-beat rhythm using note symbols and syllables. "Clap it for me"
   plays the pattern (with a count-in) so students can echo it back; "New card"
   deals a fresh one. Easy / Medium / Hard change which rhythms appear.
   ========================================================================== */

(function () {
  // One beat's worth of rhythm. hits = onset positions within the beat (0–1).
  var VALUES = {
    quarter:   { glyph: "♩",       syl: "ta",           hits: [0] },
    eighths:   { glyph: "♫",       syl: "ti-ti",        hits: [0, 0.5] },
    sixteenths:{ glyph: "♬♬", syl: "ti-ka-ti-ka",  hits: [0, .25, .5, .75] },
    tiri:      { glyph: "♩♪", syl: "ta  ti",       hits: [0, 0.5] }, // shown as quarter+eighth feel
    rest:      { glyph: "𝄽", syl: "sh",           hits: [] }
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
    var tempo = el("input", { type: "range", min: "50", max: "140", value: state.tempo + "", "aria-label": "Tempo",
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
          el("div.glyph", { text: v.glyph }),
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
