/* ==========================================================================
   terms.js — Musical Terms glossary (Dynamics, Tempo, Expression).
   Every term has a "demo" so kids hear the idea, not just read a definition:
   dynamics change volume, tempo terms play a click loop at that speed, and
   expression terms shape a short phrase (smooth, detached, accented, held).
   ========================================================================== */

(function () {
  function render(container, h) {
    var el = h.el;
    var state = { cat: "All" };

    container.appendChild(h.pageHead("🔤", "Musical Terms",
      "Tap a card to read it, then tap 🔊 to hear what it means."));

    var catRow = el("div.filter-row");
    ["All"].concat(DATA.termCategories).forEach(function (c) {
      var p = el("button.pill", { text: c, onclick: function () { state.cat = c; syncPills(catRow, c); draw(); } });
      if (c === "All") p.classList.add("is-active");
      p.dataset.label = c;
      catRow.appendChild(p);
    });
    container.appendChild(catRow);

    var grid = el("div.term-grid");
    container.appendChild(grid);

    draw();

    function draw() {
      grid.innerHTML = "";
      DATA.terms.filter(function (t) { return state.cat === "All" || t.category === state.cat; })
        .forEach(function (t) {
          var card = el("div.term-card");
          card.appendChild(el("div.term-cat-tag", { text: t.category }));
          card.appendChild(el("h3", { html: t.term + (t.abbr ? " <span class='term-abbr'>" + t.abbr + "</span>" : "") }));
          card.appendChild(el("p", { text: t.meaning }));
          var demoBtn = el("button.btn.btn--purple", { html: "🔊 Hear it", style: "font-size:15px;padding:10px 20px;min-height:auto;",
            onclick: function () { playDemo(t.demo, demoBtn); } });
          card.appendChild(demoBtn);
          grid.appendChild(card);
        });
    }

    function syncPills(row, label) {
      Array.prototype.forEach.call(row.children, function (b) {
        b.classList.toggle("is-active", b.dataset.label === label);
      });
    }
  }

  // ---- Demo player: interprets a term's "demo" descriptor into sound -------
  function playDemo(demo, btn) {
    Sound.unlock();
    if (btn) { btn.disabled = true; setTimeout(function () { btn.disabled = false; }, 1800); }

    if (demo.type === "volume") {
      Sound.tone(Sound.noteFreq("G4"), null, 0.9, "sine", demo.peak);
      return;
    }
    if (demo.type === "cresc" || demo.type === "decresc") {
      var notes = ["C4", "D4", "E4", "F4", "G4"];
      var peaks = [0.05, 0.15, 0.26, 0.38, 0.52];
      if (demo.type === "decresc") peaks = peaks.slice().reverse();
      var t = Sound.now() + 0.05;
      notes.forEach(function (n, i) {
        Sound.tone(Sound.noteFreq(n), t + i * 0.32, 0.34, "sine", peaks[i]);
      });
      return;
    }
    if (demo.type === "tempo") {
      var beatSec = 60 / demo.bpm;
      var t0 = Sound.now() + 0.05;
      for (var b = 0; b < 4; b++) Sound.click(b === 0, t0 + b * beatSec);
      return;
    }
    if (demo.type === "rit" || demo.type === "accel") {
      var interval = demo.type === "rit" ? 0.32 : 0.62;
      var factor = demo.type === "rit" ? 1.28 : 0.72;
      var when = Sound.now() + 0.05;
      for (var i = 0; i < 5; i++) {
        Sound.click(i === 0, when);
        when += interval;
        interval *= factor;
      }
      return;
    }
    if (demo.type === "legato") {
      var mel = ["C4", "D4", "E4", "F4"];
      var step = 0.34;
      var tl = Sound.now() + 0.05;
      mel.forEach(function (n, i) { Sound.tone(Sound.noteFreq(n), tl + i * step, step * 1.35, "sine", 0.26); });
      return;
    }
    if (demo.type === "staccato") {
      var mel2 = ["C4", "D4", "E4", "F4"];
      var step2 = 0.34;
      var ts = Sound.now() + 0.05;
      mel2.forEach(function (n, i) { Sound.tone(Sound.noteFreq(n), ts + i * step2, 0.09, "triangle", 0.3); });
      return;
    }
    if (demo.type === "accent") {
      var mel3 = ["C4", "C4", "C4", "C4"];
      var peaks3 = [0.16, 0.16, 0.5, 0.16];
      var step3 = 0.3;
      var ta = Sound.now() + 0.05;
      mel3.forEach(function (n, i) { Sound.tone(Sound.noteFreq(n), ta + i * step3, 0.22, "triangle", peaks3[i]); });
      return;
    }
    if (demo.type === "fermata") {
      var tf = Sound.now() + 0.05;
      Sound.tone(Sound.noteFreq("C4"), tf, 0.28, "sine", 0.28);
      Sound.tone(Sound.noteFreq("D4"), tf + 0.36, 0.28, "sine", 0.28);
      Sound.tone(Sound.noteFreq("E4"), tf + 0.72, 1.7, "sine", 0.32); // held long — the fermata
      return;
    }
  }

  App.register({
    id: "terms",
    title: "Musical Terms",
    emoji: "🔤",
    desc: "Dynamics, tempo & expression — read it, then hear it.",
    color: "tile--grape",
    render: render
  });
})();
