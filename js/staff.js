/* ==========================================================================
   staff.js — interactive staff basics with two modes.
     • Explore: tap any line or space and it names the note, hears it, and can
       label every line/space with the classic mnemonics.
     • Quiz: the app shows a mystery note; the student taps the letter they
       think it is and gets instant feedback plus a running score.
   ========================================================================== */

(function () {
  var SVGNS = "http://www.w3.org/2000/svg";

  // Vertical positions (y) for the 9 staff slots, top -> bottom.
  // index 0 = top line (line 5) ... index 8 = bottom line (line 1).
  var Y = [90, 102, 114, 126, 138, 150, 162, 174, 186];

  var CLEFS = {
    treble: {
      glyph: "𝄞", glyphSize: 230, anchorIdx: 6, anchorFrac: 0.62, // spiral on the G line (2nd from bottom)
      notes: ["F5", "E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4"],
      lineMnemonic: "Every Good Boy Does Fine (E-G-B-D-F, bottom→top)",
      spaceMnemonic: "F-A-C-E (bottom→top) spells FACE"
    },
    bass: {
      glyph: "𝄢", glyphSize: 150, anchorIdx: 2, anchorFrac: 0.24, // dots on the F line (2nd from top)
      notes: ["A3", "G3", "F3", "E3", "D3", "C3", "B2", "A2", "G2"],
      lineMnemonic: "Good Boys Do Fine Always (G-B-D-F-A, bottom→top)",
      spaceMnemonic: "All Cows Eat Grass (A-C-E-G, bottom→top)"
    }
  };

  // Offscreen canvas so we can measure the clef glyph and align it to a line.
  var measureCanvas = document.createElement("canvas");
  var mctx = measureCanvas.getContext("2d");
  function clefBaseline(glyph, size, targetY, frac) {
    mctx.font = size + "px serif";
    var m = mctx.measureText(glyph);
    var asc = m.actualBoundingBoxAscent, desc = m.actualBoundingBoxDescent;
    if (asc && desc) return targetY + asc - frac * (asc + desc);
    return targetY + size * 0.16; // fallback if metrics are unavailable
  }

  function svgEl(name, attrs) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }

  // Hand-drawn bass clef (hook + two dots straddling the F line). Drawn as
  // pure vector shapes rather than the Unicode "𝄢" character, whose glyph
  // proportions vary unpredictably across fonts/browsers — this guarantees
  // the dots always land exactly on the F line everywhere.
  function bassClefGroup(x0, fY, gap) {
    var ox = x0 + 1.333 * gap;
    function px(mx) { return ox + mx * gap; }
    function py(my) { return fY + my * gap; }
    var d = "M " + px(-0.083) + "," + py(-1.25) +
      " C " + px(0.917) + "," + py(-1.25) + " " + px(1.5) + "," + py(-0.583) + " " + px(1.5) + "," + py(0.167) +
      " C " + px(1.5) + "," + py(1.0) + " " + px(0.833) + "," + py(1.667) + " " + px(-0.167) + "," + py(1.75) +
      " C " + px(-1.0) + "," + py(1.8125) + " " + px(-1.417) + "," + py(1.333) + " " + px(-1.25) + "," + py(0.833);
    var g = svgEl("g", {});
    g.appendChild(svgEl("path", { d: d, fill: "none", stroke: "#2b2140",
      "stroke-width": gap * 0.396, "stroke-linecap": "round" }));
    g.appendChild(svgEl("circle", { cx: px(2.0), cy: py(-0.375), r: gap * 0.229, fill: "#2b2140" }));
    g.appendChild(svgEl("circle", { cx: px(2.0), cy: py(0.625), r: gap * 0.229, fill: "#2b2140" }));
    return g;
  }

  function render(container, h) {
    var el = h.el;
    var state = { clef: "treble", mode: "explore", showLabels: false,
                  placedSlot: null, quizSlot: null, answered: false, score: 0, total: 0 };

    container.appendChild(h.pageHead("🎼", "Staff Basics", "Learn the lines and spaces of the staff."));

    // ---- Mode + clef controls -------------------------------------------
    var modeGroup = el("div.pill-group");
    [["explore", "👆 Explore"], ["quiz", "❓ Quiz Me"]].forEach(function (c) {
      var p = el("button.pill", { text: c[1], onclick: function () {
        state.mode = c[0]; syncPills(modeGroup, c[1]); rebuild();
      }});
      if (c[0] === state.mode) p.classList.add("is-active");
      p.dataset.label = c[1];
      modeGroup.appendChild(p);
    });

    var clefGroup = el("div.pill-group");
    [["treble", "𝄞 Treble"], ["bass", "𝄢 Bass"]].forEach(function (c) {
      var p = el("button.pill", { text: c[1], onclick: function () {
        state.clef = c[0]; syncPills(clefGroup, c[1]);
        state.placedSlot = null;
        if (state.mode === "quiz") newQuestion(); else draw();
      }});
      if (c[0] === state.clef) p.classList.add("is-active");
      p.dataset.label = c[1];
      clefGroup.appendChild(p);
    });

    var labelBtn = el("button.pill", { text: "🔤 Show note names", onclick: function () {
      state.showLabels = !state.showLabels;
      labelBtn.classList.toggle("is-active", state.showLabels);
      draw();
    }});

    container.appendChild(el("div.card", null,
      el("div.control-row", null, modeGroup),
      el("div.spacer-sm"),
      el("div.control-row", null, clefGroup, labelBtn)
    ));

    // ---- Staff + readout -------------------------------------------------
    var readout = el("div.note-readout", { html: "&nbsp;" });
    var wrap = el("div.staff-wrap");
    container.appendChild(el("div.card", null, readout, wrap));

    // ---- Quiz answer buttons (letters) ----------------------------------
    var LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
    var answersRow = el("div.control-row", { style: "justify-content:center" });
    LETTERS.forEach(function (L) {
      answersRow.appendChild(el("button.letter-btn", { text: L, onclick: function () { answerLetter(L); } }));
    });
    var nextBtn = el("button.btn.btn--play", { html: "Next note →", style: "display:none", onclick: newQuestion });
    var scoreLine = el("div.hint", { text: "Score: 0 / 0", style: "text-align:center;margin-top:8px" });
    var quizCard = el("div.card", null, answersRow, el("div.spacer-sm"),
      el("div.control-row", { style: "justify-content:center" }, nextBtn), scoreLine);
    container.appendChild(quizCard);

    // ---- Mnemonics -------------------------------------------------------
    var mnemonicCard = el("div.card");
    container.appendChild(mnemonicCard);

    rebuild();

    // =====================================================================
    function rebuild() {
      var quiz = state.mode === "quiz";
      quizCard.style.display = quiz ? "" : "none";
      labelBtn.style.display = quiz ? "none" : "";
      if (quiz) { newQuestion(); }
      else {
        state.quizSlot = null; state.answered = false;
        readout.innerHTML = "Tap any line or space to hear it and see its name. 🎵";
        draw();
      }
    }

    function drawNote(svg, slot, color) {
      var y = Y[slot], cx = 430;
      var stem = svgEl("line", { x1: cx + 14, y1: y, x2: cx + 14, y2: y - 60,
        stroke: color.stroke, "stroke-width": 3 });
      var head = svgEl("ellipse", { cx: cx, cy: y, rx: 15, ry: 11, fill: color.fill,
        stroke: color.stroke, "stroke-width": 2, transform: "rotate(-20 " + cx + " " + y + ")" });
      svg.appendChild(stem);
      svg.appendChild(head);
    }

    function draw() {
      wrap.innerHTML = "";
      var clef = CLEFS[state.clef];
      var W = 720, H = 300, x0 = 60, x1 = 680;
      var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, class: "staff-svg", width: W });

      [0, 2, 4, 6, 8].forEach(function (idx) {
        svg.appendChild(svgEl("line", { x1: x0, y1: Y[idx], x2: x1, y2: Y[idx],
          stroke: "#2b2140", "stroke-width": 3, "stroke-linecap": "round" }));
      });

      if (state.clef === "bass") {
        svg.appendChild(bassClefGroup(x0, Y[clef.anchorIdx], 24));
      } else {
        var baseline = clefBaseline(clef.glyph, clef.glyphSize, Y[clef.anchorIdx], clef.anchorFrac);
        var clefText = svgEl("text", { x: 66, y: baseline, "font-size": clef.glyphSize,
          fill: "#2b2140", "font-family": "serif" });
        clefText.textContent = clef.glyph;
        svg.appendChild(clefText);
      }

      // Labels only make sense in Explore (would give away the Quiz answer).
      if (state.mode === "explore" && state.showLabels) {
        Y.forEach(function (y, idx) {
          var isLine = idx % 2 === 0;
          var t = svgEl("text", { x: 700, y: y + 6, "font-size": 20, "text-anchor": "end",
            fill: isLine ? "#5b8cff" : "#ff5da2", "font-family": "'Baloo 2', sans-serif", "font-weight": "800" });
          t.textContent = clef.notes[idx].replace(/\d/, "");
          svg.appendChild(t);
        });
      }

      // Show the current note (explore = placed, quiz = mystery note).
      if (state.mode === "quiz" && state.quizSlot != null) {
        drawNote(svg, state.quizSlot, { fill: "#a06bff", stroke: "#7a45d6" });
      } else if (state.mode === "explore" && state.placedSlot != null) {
        drawNote(svg, state.placedSlot, { fill: "#ff7a59", stroke: "#c94a2a" });
      }

      // Clickable bands (Explore only).
      if (state.mode === "explore") {
        var bandH = 12;
        Y.forEach(function (y, idx) {
          var band = svgEl("rect", { x: x0, y: y - bandH / 2, width: (x1 - x0), height: bandH,
            fill: "transparent", style: "cursor:pointer" });
          function place() {
            state.placedSlot = idx;
            draw();
            announce(idx);
            Sound.playNote(clef.notes[idx], 0.7);
          }
          band.addEventListener("click", place);
          band.addEventListener("touchstart", function (e) { e.preventDefault(); place(); }, { passive: false });
          svg.appendChild(band);
        });
      }

      wrap.appendChild(svg);

      mnemonicCard.innerHTML = "";
      mnemonicCard.appendChild(el("div.hint", { text: "Remember the names:" }));
      mnemonicCard.appendChild(el("p", { html: "🟦 <b>Lines:</b> " + clef.lineMnemonic }));
      mnemonicCard.appendChild(el("p", { html: "🟥 <b>Spaces:</b> " + clef.spaceMnemonic }));
    }

    function announce(idx) {
      var clef = CLEFS[state.clef];
      var name = clef.notes[idx];
      var pretty = name.replace(/(\d)/, "");
      var isLine = idx % 2 === 0;
      readout.innerHTML = "That's <span style='color:" + (isLine ? "#5b8cff" : "#ff5da2") + "'>" + pretty +
        "</span>! <small>" + (isLine ? "a LINE note" : "a SPACE note") + " · octave " + name.replace(/\D/g, "") + "</small>";
    }

    // ---- Quiz logic ------------------------------------------------------
    function newQuestion() {
      var clef = CLEFS[state.clef];
      state.quizSlot = Math.floor(Math.random() * 9);
      state.answered = false;
      nextBtn.style.display = "none";
      setLetters(true);
      readout.innerHTML = "🤔 What note is this? Tap a letter.";
      draw();
      Sound.playNote(clef.notes[state.quizSlot], 0.7); // let them hear it too
    }

    function answerLetter(L) {
      if (state.answered || state.quizSlot == null) return;
      state.answered = true;
      state.total++;
      var clef = CLEFS[state.clef];
      var correct = clef.notes[state.quizSlot].charAt(0);
      var isLine = state.quizSlot % 2 === 0;
      if (L === correct) {
        state.score++;
        readout.innerHTML = "🌟 Yes! That's <span style='color:#7ed957'>" + correct + "</span> — " +
          (isLine ? "a line note." : "a space note.");
        Sound.tone(880, null, 0.12, "square");
      } else {
        readout.innerHTML = "Not quite — that one is <span style='color:#ff5da2'>" + correct + "</span>. " +
          "You picked " + L + ".";
        Sound.tone(220, null, 0.18, "sawtooth");
      }
      Sound.playNote(clef.notes[state.quizSlot], 0.7);
      scoreLine.textContent = "Score: " + state.score + " / " + state.total;
      nextBtn.style.display = "";
      setLetters(false);
    }

    function setLetters(on) {
      Array.prototype.forEach.call(answersRow.children, function (b) {
        b.disabled = !on;
        b.style.opacity = on ? "1" : "0.5";
      });
    }

    function syncPills(row, label) {
      Array.prototype.forEach.call(row.children, function (b) {
        b.classList.toggle("is-active", b.dataset.label === label);
      });
    }
  }

  App.register({
    id: "staff",
    title: "Staff Basics",
    emoji: "🎼",
    desc: "Explore the staff, or quiz yourself on note names.",
    color: "tile--sky",
    render: render
  });
})();
