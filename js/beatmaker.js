/* ==========================================================================
   beatmaker.js — a drum-machine step sequencer with animated characters.
   Each row is a percussion sound with a little cartoon "player" that bounces
   and hits in time whenever its step fires — inspired by Chrome Music Lab's
   Rhythm experiment. Tap the steps to build a beat, press Play, and watch the
   band play along.
   ========================================================================== */

(function () {
  var STEPS = 16;

  // Each drummer: a character emoji, a color, and how to make its sound.
  var KIT = [
    { name: "Hi-Hat", emoji: "🐱", color: "#2dd4bf", play: function (t) { Sound.noise(t, 0.05, 0.28, "hat"); } },
    { name: "Clap",   emoji: "🐸", color: "#7ed957", play: function (t) { Sound.noise(t, 0.09, 0.4, "clap"); Sound.noise(t + 0.02, 0.06, 0.3, "clap"); } },
    { name: "Snare",  emoji: "🐰", color: "#ff5da2", play: function (t) { Sound.noise(t, 0.16, 0.4, "snare"); Sound.perc(190, t, 0.10, "triangle"); } },
    { name: "Kick",   emoji: "🐵", color: "#5b8cff", play: function (t) { Sound.perc(72, t, 0.22, "sine"); Sound.perc(48, t, 0.28, "sine"); } }
  ];

  function render(container, h) {
    var el = h.el;
    var state = { tempo: 100, grid: KIT.map(function () { return new Array(STEPS).fill(false); }),
                  playing: false, pos: 0, timer: null };

    container.appendChild(h.pageHead("🥁", "Beat Maker",
      "Tap the squares to build a beat — the band plays along when you press Play!"));

    var tempoVal = el("b", { text: state.tempo + "" });
    var tempo = el("input", { type: "range", min: "60", max: "168", value: state.tempo + "", "aria-label": "Tempo",
      oninput: function () { state.tempo = +tempo.value; tempoVal.textContent = tempo.value; } });
    container.appendChild(el("div.card", null,
      el("div.control-row", null, el("label.slider", null, el("span", { text: "🐢 Tempo " }), tempo,
        el("span", null, tempoVal, el("span", { text: " BPM 🐇" }))))
    ));

    // ---- The rows of drummers + steps -----------------------------------
    var board = el("div.bm-board");
    KIT.forEach(function (inst, r) {
      var row = el("div.bm-row");
      var char = el("div.bm-char", { style: "--ic:" + inst.color },
        el("span.bm-char-emoji", { text: inst.emoji }),
        el("span.bm-char-name", { text: inst.name })
      );
      char.dataset.r = r;
      row.appendChild(char);

      var steps = el("div.bm-steps");
      for (var c = 0; c < STEPS; c++) {
        (function (c) {
          var cell = el("div.bm-step");
          if (c % 4 === 0 && c > 0) cell.classList.add("beatstart");
          cell.dataset.r = r; cell.dataset.c = c;
          cell.addEventListener("pointerdown", function (e) {
            e.preventDefault();
            Sound.unlock();
            state.grid[r][c] = !state.grid[r][c];
            cell.classList.toggle("on", state.grid[r][c]);
            if (state.grid[r][c]) { cell.style.setProperty("--ic", inst.color); inst.play(Sound.now() + 0.01); hit(r); }
          });
          steps.appendChild(cell);
        })(c);
      }
      row.appendChild(steps);
      board.appendChild(row);
    });
    container.appendChild(el("div.card", null, board));

    // ---- Play / Clear ----------------------------------------------------
    var playBtn = el("button.btn.btn--play", { html: "▶︎ Play", onclick: toggle });
    var clearBtn = el("button.btn.btn--stop", { html: "🧽 Clear", onclick: function () {
      state.grid = KIT.map(function () { return new Array(STEPS).fill(false); });
      stop(); redrawCells();
    }});
    container.appendChild(el("div.control-row", { style: "justify-content:center" }, playBtn, clearBtn));

    container.appendChild(el("div.card", null,
      el("p.hint", { text: "Try this starter beat: tap Kick on squares 1 and 5, Snare on 5 and 13, and Hi-Hat on every other square. Press Play!" })
    ));

    // ---------------------------------------------------------------------
    function redrawCells() {
      var cells = board.querySelectorAll(".bm-step");
      Array.prototype.forEach.call(cells, function (cell) {
        var on = state.grid[+cell.dataset.r][+cell.dataset.c];
        cell.classList.toggle("on", on);
        if (on) cell.style.setProperty("--ic", KIT[+cell.dataset.r].color);
      });
    }

    function hit(r) {
      var char = board.querySelector('.bm-char[data-r="' + r + '"]');
      if (!char) return;
      char.classList.remove("hit");
      void char.offsetWidth;   // restart the bounce animation
      char.classList.add("hit");
    }

    function toggle() { state.playing ? stop() : play(); }

    function play() {
      Sound.unlock();
      state.playing = true; state.pos = 0;
      playBtn.innerHTML = "⏸ Stop";
      playBtn.classList.remove("btn--play"); playBtn.classList.add("btn--stop");
      step();
    }

    function step() {
      if (!state.playing) return;
      var c = state.pos % STEPS;
      highlightColumn(c);
      KIT.forEach(function (inst, r) {
        if (state.grid[r][c]) { inst.play(Sound.now() + 0.01); hit(r); }
      });
      state.pos++;
      state.timer = setTimeout(step, (30 / state.tempo) * 1000);
    }

    function highlightColumn(c) {
      var cells = board.querySelectorAll(".bm-step");
      Array.prototype.forEach.call(cells, function (cell) {
        cell.classList.toggle("col-playing", +cell.dataset.c === c);
      });
    }

    function stop() {
      state.playing = false;
      if (state.timer) { clearTimeout(state.timer); state.timer = null; }
      playBtn.innerHTML = "▶︎ Play";
      playBtn.classList.add("btn--play"); playBtn.classList.remove("btn--stop");
      var cells = board.querySelectorAll(".col-playing");
      Array.prototype.forEach.call(cells, function (cell) { cell.classList.remove("col-playing"); });
    }

    return stop;
  }

  App.register({
    id: "beatmaker",
    title: "Beat Maker",
    emoji: "🥁",
    desc: "Build a beat and watch a band of characters play it.",
    color: "tile--berry",
    render: render
  });
})();
