/* ==========================================================================
   songmaker.js — a tap-the-grid melody sequencer (Chrome Music Lab style).
   Rows are pitches (colored like Boomwhackers), columns are steps. Tap cells
   to place notes, press Play and a playhead sweeps across, looping. Defaults
   to a pentatonic scale so there are no "wrong" notes — everything a kid taps
   sounds good together.
   ========================================================================== */

(function () {
  var SCALES = {
    "Pentatonic": ["C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"],
    "Major":      ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]
  };
  var VOICES = {
    "Bells":   { type: "sine",     peak: 0.32 },
    "Marimba": { type: "triangle", peak: 0.30 },
    "Organ":   { type: "square",   peak: 0.18 }
  };
  var COLS = 16;

  function letter(note) { return note.charAt(0); }

  function render(container, h) {
    var el = h.el;
    var state = { scale: "Pentatonic", voice: "Bells", tempo: 120,
                  rows: SCALES["Pentatonic"], grid: null, playing: false, pos: 0, timer: null };

    function blankGrid() {
      var g = [];
      for (var r = 0; r < state.rows.length; r++) { g.push(new Array(COLS).fill(false)); }
      return g;
    }
    state.grid = blankGrid();

    container.appendChild(h.pageHead("🎶", "Song Maker",
      "Tap the squares to make a tune, then press Play. It loops!"));

    // ---- Controls --------------------------------------------------------
    var scaleGroup = pillGroup(Object.keys(SCALES), state.scale, function (v) {
      state.scale = v; state.rows = SCALES[v]; state.grid = blankGrid(); stop(); drawGrid();
    });
    var voiceGroup = pillGroup(Object.keys(VOICES), state.voice, function (v) { state.voice = v; });

    var tempoVal = el("b", { text: state.tempo + "" });
    var tempo = el("input", { type: "range", min: "60", max: "180", value: state.tempo + "", "aria-label": "Tempo",
      oninput: function () { state.tempo = +tempo.value; tempoVal.textContent = tempo.value; } });

    container.appendChild(el("div.card", null,
      el("div.control-row", null, el("span.hint", { text: "Notes:" }), scaleGroup,
        el("span.hint", { text: "Sound:" }), voiceGroup),
      el("div.spacer-sm"),
      el("div.control-row", null, el("label.slider", null, el("span", { text: "🐢 Tempo " }), tempo,
        el("span", null, tempoVal, el("span", { text: " BPM 🐇" }))))
    ));

    // ---- Grid ------------------------------------------------------------
    var gridWrap = el("div.sm-gridwrap");
    var gridEl = el("div.sm-grid");
    gridWrap.appendChild(gridEl);
    container.appendChild(el("div.card", null, gridWrap));

    // ---- Play / Clear ----------------------------------------------------
    var playBtn = el("button.btn.btn--play", { html: "▶︎ Play", onclick: toggle });
    var clearBtn = el("button.btn.btn--stop", { html: "🧽 Clear", onclick: function () {
      state.grid = blankGrid(); stop(); drawGrid();
    }});
    container.appendChild(el("div.control-row", { style: "justify-content:center" }, playBtn, clearBtn));

    container.appendChild(el("div.card", null,
      el("p.hint", { text: "Tip: try tapping a few squares in a staircase going up — then press Play and listen to your melody climb!" })
    ));

    drawGrid();

    // ---------------------------------------------------------------------
    // Rows are drawn top (highest pitch) to bottom (lowest), like a staff.
    function drawGrid() {
      gridEl.innerHTML = "";
      for (var r = state.rows.length - 1; r >= 0; r--) {
        (function (r) {
          var note = state.rows[r];
          var color = DATA.noteColors[letter(note)] || "#ccc";
          var row = el("div.sm-row");
          row.appendChild(el("span.sm-rowlabel", { text: letter(note), style: "color:" + color }));
          for (var c = 0; c < COLS; c++) {
            (function (c) {
              var cell = el("div.sm-cell");
              if (c % 4 === 0 && c > 0) cell.classList.add("beatstart");
              if (state.grid[r][c]) { cell.classList.add("on"); cell.style.setProperty("--cc", color); }
              cell.dataset.r = r; cell.dataset.c = c;
              cell.addEventListener("pointerdown", function (e) {
                e.preventDefault();
                Sound.unlock();
                state.grid[r][c] = !state.grid[r][c];
                if (state.grid[r][c]) {
                  cell.classList.add("on"); cell.style.setProperty("--cc", color);
                  voicePlay(note);
                } else {
                  cell.classList.remove("on");
                }
              });
              row.appendChild(cell);
            })(c);
          }
          gridEl.appendChild(row);
        })(r);
      }
    }

    function voicePlay(note, when) {
      var v = VOICES[state.voice];
      var stepSec = 30 / state.tempo;
      Sound.tone(Sound.noteFreq(note), when || null, Math.max(0.18, stepSec * 1.6), v.type, v.peak);
    }

    // ---- Playback --------------------------------------------------------
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
      var c = state.pos % COLS;
      highlightColumn(c);
      for (var r = 0; r < state.rows.length; r++) {
        if (state.grid[r][c]) voicePlay(state.rows[r], Sound.now() + 0.01);
      }
      state.pos++;
      state.timer = setTimeout(step, (30 / state.tempo) * 1000);
    }

    function highlightColumn(c) {
      var cells = gridEl.querySelectorAll(".sm-cell");
      Array.prototype.forEach.call(cells, function (cell) {
        cell.classList.toggle("col-playing", +cell.dataset.c === c);
      });
    }

    function stop() {
      state.playing = false;
      if (state.timer) { clearTimeout(state.timer); state.timer = null; }
      playBtn.innerHTML = "▶︎ Play";
      playBtn.classList.add("btn--play"); playBtn.classList.remove("btn--stop");
      var cells = gridEl.querySelectorAll(".col-playing");
      Array.prototype.forEach.call(cells, function (cell) { cell.classList.remove("col-playing"); });
    }

    function pillGroup(labels, active, onpick) {
      var group = el("div.pill-group");
      labels.forEach(function (lb) {
        var p = el("button.pill", { text: lb, onclick: function () { syncPills(group, lb); onpick(lb); } });
        if (lb === active) p.classList.add("is-active");
        p.dataset.label = lb;
        group.appendChild(p);
      });
      return group;
    }
    function syncPills(row, label) {
      Array.prototype.forEach.call(row.children, function (b) {
        b.classList.toggle("is-active", b.dataset.label === label);
      });
    }

    return stop;
  }

  App.register({
    id: "songmaker",
    title: "Song Maker",
    emoji: "🎶",
    desc: "Tap a grid to make a melody — pentatonic, so it always sounds good.",
    color: "tile--rainbow",
    render: render
  });
})();
