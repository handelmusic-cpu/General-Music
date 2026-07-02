/* ==========================================================================
   beatboxes.js — tappable fruit/veggie rhythm boxes.
   Each box is one beat. Tap a box to cycle its rhythm (quarter, two eighths,
   four sixteenths, triplet, rest) shown as fruit. Press Play and the app claps
   through the boxes so students hear beat & subdivision. Tempo + beat count
   are adjustable.
   ========================================================================== */

(function () {
  function render(container, h) {
    var el = h.el;
    var RH = DATA.rhythms;

    var state = {
      count: 4,
      tempo: 92,          // BPM (macro beat)
      boxes: [],          // rhythm id per box
      playing: false,
      timer: null,
      pos: 0
    };
    function defaultBoxes(n) {
      var a = [];
      for (var i = 0; i < n; i++) a.push("quarter");
      return a;
    }
    state.boxes = defaultBoxes(state.count);

    container.appendChild(h.pageHead("🍎", "Beat Boxes",
      "Tap a box to change its rhythm, then press Play to clap along."));

    // ---- Controls: beat count -------------------------------------------
    var countGroup = el("div.pill-group");
    [2, 3, 4, 6, 8].forEach(function (n) {
      var p = el("button.pill", { text: n + " beats", onclick: function () {
        state.count = n;
        state.boxes = defaultBoxes(n);
        syncPills(countGroup, n + " beats");
        stop();
        drawBoxes();
      }});
      if (n === state.count) p.classList.add("is-active");
      p.dataset.label = n + " beats";
      countGroup.appendChild(p);
    });

    // ---- Controls: tempo -------------------------------------------------
    var tempoVal = el("b", { text: state.tempo + "" });
    var tempo = el("input", {
      type: "range", min: "50", max: "160", value: state.tempo + "",
      "aria-label": "Tempo",
      oninput: function () { state.tempo = +tempo.value; tempoVal.textContent = tempo.value; }
    });
    var tempoLabel = el("label.slider", null, el("span", { text: "🐢 Tempo " }), tempo,
      el("span", null, tempoVal, el("span", { text: " BPM 🐇" })));

    var controls = el("div.card", null,
      el("div.control-row", null, el("span.hint", { text: "How many beats?" }), countGroup),
      el("div.spacer-sm"),
      el("div.control-row", null, tempoLabel)
    );
    container.appendChild(controls);

    // ---- The row(s) of beat boxes ---------------------------------------
    // 6 and 8 beats wrap onto two rows (3+3, 4+4) so they read like measures.
    var boxRows = el("div");
    var boxStage = el("div.card", null, boxRows);
    container.appendChild(boxStage);

    // ---- Play / Reset ----------------------------------------------------
    var playBtn = el("button.btn.btn--play", { html: "▶︎ Play", onclick: toggle });
    var resetBtn = el("button.btn.btn--ghost", { html: "↺ Reset", onclick: function () {
      state.boxes = defaultBoxes(state.count); stop(); drawBoxes();
    }});
    container.appendChild(el("div.control-row", null, playBtn, resetBtn));

    // ---- Legend ----------------------------------------------------------
    var legend = el("div.legend");
    RH.forEach(function (r) {
      legend.appendChild(el("span", { html: "<b>" + r.fruits + "</b> = " + escapeHtml(r.name) }));
    });
    container.appendChild(el("div.card", null,
      el("div.hint", { text: "What the fruit mean:" }), legend,
      el("div.spacer-sm"),
      el("p.hint", { text: "Tip: 🍒🍒 \"ti-ti\" fits in the same beat as one 🍐 \"ta\" — that's how we split the beat!" })
    ));

    drawBoxes();

    // ---------------------------------------------------------------------
    function rhythmById(id) {
      for (var i = 0; i < RH.length; i++) if (RH[i].id === id) return RH[i];
      return RH[0];
    }
    function cycle(id) {
      var idx = RH.map(function (r) { return r.id; }).indexOf(id);
      return RH[(idx + 1) % RH.length].id;
    }

    function perRow() {
      if (state.count === 6) return 3;   // 3 + 3
      if (state.count === 8) return 4;   // 4 + 4
      return state.count;                // everything else: one row
    }

    function drawBoxes() {
      boxRows.innerHTML = "";
      var n = perRow();
      var row = null;
      state.boxes.forEach(function (id, i) {
        if (i % n === 0) { row = el("div.beat-row"); boxRows.appendChild(row); }
        var r = rhythmById(id);
        var box = el("button.beat-box", {
          onclick: function () {
            // Change the rhythm silently — no audition sound on tap.
            state.boxes[i] = cycle(id);
            drawBoxes();
            flash(i);
          }
        },
          el("span.count", { text: (i + 1) + "" }),
          el("span.fruits", { text: r.fruits }),
          el("span.syllable", { text: r.syllable })
        );
        box.dataset.i = i;
        row.appendChild(box);
      });
    }

    function boxEl(i) { return boxRows.querySelector('.beat-box[data-i="' + i + '"]'); }

    function flash(i) {
      var b = boxEl(i);
      if (!b) return;
      b.classList.remove("flash");
      void b.offsetWidth;   // restart animation
      b.classList.add("flash");
    }

    // Schedule the little clap(s) inside one beat for a rhythm
    function playHits(r, t0, beatSec) {
      if (r.hits === 0) return; // rest — silence
      var step = beatSec / r.hits;
      for (var k = 0; k < r.hits; k++) {
        Sound.click(k === 0, t0 + k * step);
      }
    }

    // ---- Playback loop ---------------------------------------------------
    function toggle() { state.playing ? stop() : play(); }

    function play() {
      Sound.unlock();
      state.playing = true;
      state.pos = 0;
      playBtn.innerHTML = "⏸ Stop";
      playBtn.classList.remove("btn--play");
      playBtn.classList.add("btn--stop");
      tick();
    }

    function tick() {
      if (!state.playing) return;
      var beatSec = 60 / state.tempo;
      var i = state.pos % state.count;
      var r = rhythmById(state.boxes[i]);
      playHits(r, Sound.now() + 0.01, beatSec);
      flash(i);
      state.pos++;
      state.timer = setTimeout(tick, beatSec * 1000);
    }

    function stop() {
      state.playing = false;
      if (state.timer) { clearTimeout(state.timer); state.timer = null; }
      playBtn.innerHTML = "▶︎ Play";
      playBtn.classList.add("btn--play");
      playBtn.classList.remove("btn--stop");
    }

    function syncPills(row, label) {
      Array.prototype.forEach.call(row.children, function (b) {
        b.classList.toggle("is-active", b.dataset.label === label);
      });
    }

    return stop; // teardown when leaving the page
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  App.register({
    id: "beatboxes",
    title: "Beat Boxes",
    emoji: "🍎",
    desc: "Fruit & veggie boxes for beat and beat-division.",
    color: "tile--orange",
    render: render
  });
})();
