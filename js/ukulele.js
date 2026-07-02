/* ==========================================================================
   ukulele.js — beginner ukulele chord chart.
   Shows 8 common chords as diagrams (standard GCEA re-entrant tuning) with
   finger numbers, plus a "Strum" button that plays the chord so kids can
   check their ears against their fingers.
   ========================================================================== */

(function () {
  var SVGNS = "http://www.w3.org/2000/svg";
  var STRINGS = ["G", "C", "E", "A"];      // left → right, matches a real chord chart
  var OPEN = ["G4", "C4", "E4", "A4"];     // standard ukulele tuning (re-entrant high G)
  var MAX_FRET = 4;

  function svgEl(name, attrs) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }

  function diagram(chord) {
    var W = 160, H = 190;
    var x0 = 24, x1 = 136, y0 = 34, fretH = 34;
    var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, class: "uke-diagram" });

    // String labels
    STRINGS.forEach(function (s, i) {
      var x = x0 + (i / 3) * (x1 - x0);
      svg.appendChild(svgEl("text", { x: x, y: 16, "text-anchor": "middle", "font-size": 15,
        "font-family": "'Baloo 2', sans-serif", "font-weight": "800", fill: "#5a4f73" })).textContent = s;
    });

    // Nut (thick top line) + 4 frets
    svg.appendChild(svgEl("line", { x1: x0, y1: y0, x2: x1, y2: y0, stroke: "#2b2140", "stroke-width": 5 }));
    for (var f = 1; f <= MAX_FRET; f++) {
      var y = y0 + f * fretH;
      svg.appendChild(svgEl("line", { x1: x0, y1: y, x2: x1, y2: y, stroke: "#d9d2e6", "stroke-width": 2 }));
    }
    // 4 vertical strings
    STRINGS.forEach(function (s, i) {
      var x = x0 + (i / 3) * (x1 - x0);
      svg.appendChild(svgEl("line", { x1: x, y1: y0, x2: x, y2: y0 + MAX_FRET * fretH, stroke: "#2b2140", "stroke-width": 2 }));
    });

    // Finger dots / open-string circles
    chord.frets.forEach(function (fret, i) {
      var x = x0 + (i / 3) * (x1 - x0);
      if (fret === 0) {
        svg.appendChild(svgEl("circle", { cx: x, cy: y0 - 12, r: 6, fill: "none", stroke: "#2b2140", "stroke-width": 2.5 }));
      } else {
        var y = y0 + (fret - 0.5) * fretH;
        svg.appendChild(svgEl("circle", { cx: x, cy: y, r: 11, fill: "#ff5da2" }));
        var fingerLabel = svgEl("text", { x: x, y: y + 5, "text-anchor": "middle", "font-size": 13,
          "font-family": "'Baloo 2', sans-serif", "font-weight": "800", fill: "#fff" });
        fingerLabel.textContent = chord.fingers[i] || "";
        svg.appendChild(fingerLabel);
      }
    });

    return svg;
  }

  function render(container, h) {
    var el = h.el;
    container.appendChild(h.pageHead("🎸", "Ukulele Chords",
      "Eight beginner chords with finger numbers. Tap Strum to hear each one."));

    container.appendChild(el("div.card", null,
      el("p.hint", { text: "Finger numbers: 1 = index, 2 = middle, 3 = ring, 4 = pinky. An open circle means play that string open (no finger)." })
    ));

    var grid = el("div.uke-grid");
    DATA.ukuleleChords.forEach(function (chord) {
      var strumBtn = el("button.btn.btn--play", { html: "🔊 Strum", style: "font-size:16px;padding:10px 20px;min-height:auto;", onclick: function () {
        strum(chord);
      }});
      var card = el("div.uke-card", null,
        el("h3", { text: chord.name }),
        diagram(chord),
        el("p.uke-tip", { text: chord.tip }),
        strumBtn
      );
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  function strum(chord) {
    Sound.unlock();
    var t0 = Sound.now() + 0.03;
    chord.frets.forEach(function (fret, i) {
      var openFreq = Sound.noteFreq(OPEN[i]);
      var freq = openFreq * Math.pow(2, fret / 12);
      Sound.tone(freq, t0 + i * 0.035, 0.9, "triangle", 0.24);
    });
  }

  App.register({
    id: "ukulele",
    title: "Ukulele Chords",
    emoji: "🎸",
    desc: "Beginner chord diagrams with finger numbers.",
    color: "tile--coral",
    render: render
  });
})();
