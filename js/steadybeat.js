/* ==========================================================================
   steadybeat.js — a bright metronome + tap-along game.
   A big bouncing dot keeps the beat with sound. Kids tap the giant pad in time;
   the app cheers when their taps land close to the beat. Adjustable tempo and
   beats-per-measure, with an accented downbeat.
   ========================================================================== */

(function () {
  function render(container, h) {
    var el = h.el;
    var state = { tempo: 90, beats: 4, playing: false, timer: null, beat: 0, lastBeatTime: 0, hits: 0, good: 0 };

    container.appendChild(h.pageHead("🥁", "Steady Beat",
      "Watch the dot, feel the pulse, and tap along in time!"));

    // Tempo + meter controls
    var tempoVal = el("b", { text: state.tempo + "" });
    var tempo = el("input", { type: "range", min: "20", max: "500", value: state.tempo + "", "aria-label": "Tempo",
      oninput: function () { state.tempo = +tempo.value; tempoVal.textContent = tempo.value; } });
    var meterGroup = el("div.pill-group");
    [2, 3, 4, 6].forEach(function (n) {
      var p = el("button.pill", { text: n + "/4", onclick: function () {
        state.beats = n; syncPills(meterGroup, n + "/4");
      }});
      if (n === state.beats) p.classList.add("is-active");
      p.dataset.label = n + "/4";
      meterGroup.appendChild(p);
    });
    container.appendChild(el("div.card", null,
      el("div.control-row", null, el("label.slider", null, el("span", { text: "🐢 Tempo " }), tempo,
        el("span", null, tempoVal, el("span", { text: " BPM 🐇" })))),
      el("div.spacer-sm"),
      el("div.control-row", null, el("span.hint", { text: "Beats per measure:" }), meterGroup)
    ));

    // Bouncing dots row
    var dotsRow = el("div.beat-row", { style: "gap:14px" });
    var dots = [];
    function buildDots() {
      dotsRow.innerHTML = "";
      dots = [];
      for (var i = 0; i < state.beats; i++) {
        var d = el("div", { style: dotStyle(false) });
        dotsRow.appendChild(d);
        dots.push(d);
      }
    }
    function dotStyle(active) {
      return "width:54px;height:54px;border-radius:50%;transition:transform .08s, background .08s;" +
        "background:" + (active ? "var(--pink)" : "#e3ddef") + ";box-shadow:var(--shadow-sm);";
    }

    // Big tap pad
    var pad = el("button", {
      style: "width:100%;min-height:200px;border:none;border-radius:26px;cursor:pointer;" +
        "background:linear-gradient(150deg,#8be86a,var(--lime));color:#fff;font-family:var(--font-round);" +
        "font-weight:800;font-size:32px;box-shadow:var(--shadow);",
      html: "👆 TAP<br><span style='font-size:16px;font-weight:700;opacity:.9'>tap here on every beat</span>",
      onclick: onTap
    });

    var score = el("div.note-readout", { html: "Press ▶︎ Start, then tap along!" });

    var startBtn = el("button.btn.btn--play", { html: "▶︎ Start", onclick: toggle });
    container.appendChild(el("div.card", null, dotsRow, el("div.spacer-sm"), score, pad));
    container.appendChild(el("div.control-row", null, startBtn));

    buildDots();

    // ---- Metronome -------------------------------------------------------
    function toggle() { state.playing ? stop() : start(); }

    function start() {
      Sound.unlock();
      state.playing = true; state.beat = 0; state.hits = 0; state.good = 0;
      startBtn.innerHTML = "⏸ Stop";
      startBtn.classList.remove("btn--play"); startBtn.classList.add("btn--stop");
      score.innerHTML = "Tap along! 🎯";
      tick();
    }

    function tick() {
      if (!state.playing) return;
      var i = state.beat % state.beats;
      var accent = i === 0;
      Sound.click(accent, Sound.now() + 0.005);
      state.lastBeatTime = performance.now();
      dots.forEach(function (d, k) { d.style.cssText = dotStyle(false); });
      var active = dots[i];
      active.style.cssText = dotStyle(true) + "transform:scale(1.35);";
      setTimeout(function () { if (active) active.style.transform = "scale(1)"; }, 120);
      state.beat++;
      state.timer = setTimeout(tick, (60 / state.tempo) * 1000);
    }

    function onTap() {
      Sound.unlock();
      Sound.tone(660, null, 0.09, "square");
      if (!state.playing) return;
      var beatMs = (60 / state.tempo) * 1000;
      var diff = Math.abs(performance.now() - state.lastBeatTime);
      diff = Math.min(diff, beatMs - diff); // distance to nearest beat
      state.hits++;
      if (diff < beatMs * 0.18) {
        state.good++;
        score.innerHTML = "🌟 Right on the beat! <small>" + state.good + " / " + state.hits + " on target</small>";
      } else if (diff < beatMs * 0.32) {
        score.innerHTML = "👍 Close! Keep going. <small>" + state.good + " / " + state.hits + " on target</small>";
      } else {
        score.innerHTML = "🎵 Listen for the pulse… <small>" + state.good + " / " + state.hits + " on target</small>";
      }
    }

    function stop() {
      state.playing = false;
      if (state.timer) { clearTimeout(state.timer); state.timer = null; }
      startBtn.innerHTML = "▶︎ Start";
      startBtn.classList.add("btn--play"); startBtn.classList.remove("btn--stop");
      dots.forEach(function (d) { d.style.cssText = dotStyle(false); });
      if (state.hits > 0) {
        var pct = Math.round((state.good / state.hits) * 100);
        score.innerHTML = "Great job! <small>You hit " + pct + "% of the beats on target.</small>";
      }
    }

    function syncPills(row, label) {
      Array.prototype.forEach.call(row.children, function (b) {
        b.classList.toggle("is-active", b.dataset.label === label);
      });
    }

    return stop; // teardown
  }

  App.register({
    id: "steadybeat",
    title: "Steady Beat",
    emoji: "🥁",
    desc: "Bouncing-dot metronome and tap-along game.",
    color: "tile--teal",
    render: render
  });
})();
