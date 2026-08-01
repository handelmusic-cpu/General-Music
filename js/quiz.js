/* ==========================================================================
   quiz.js — Quiz Mode: five quick quizzes (Note Names, Musical Terms,
   Clef Names, Rhythm Reading, Composers), each with Easy/Medium/Hard.
   Multiple-choice quizzes give instant feedback and auto-advance. Rhythm
   Reading is tap/spacebar-along instead, graded with a generous timing
   window since small human timing wobble is expected. Every run ends on a
   score sheet that can be downloaded as an image (or just screenshotted).
   ========================================================================== */

(function () {
  var SVGNS = "http://www.w3.org/2000/svg";
  function svgEl(name, attrs) {
    var n = document.createElementNS(SVGNS, name);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sample(arr, n) { return shuffle(arr).slice(0, n); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ---- Note Names: mini staff for drawing a single note -------------------
  var STAFF_Y = [90, 102, 114, 126, 138, 150, 162, 174, 186];
  var STAFF_SPACE = 2 * (STAFF_Y[1] - STAFF_Y[0]);
  var NOTE_CLEFS = {
    treble: { shape: "treble", anchorIdx: 6, notes: ["F5", "E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4"],
      ledgerBelow: { name: "C4", offset: 1 } },
    bass: { shape: "bass", anchorIdx: 2, notes: ["A3", "G3", "F3", "E3", "D3", "C3", "B2", "A2", "G2"],
      ledgerAbove: { name: "C4", offset: -1 } }
  };

  function drawNoteStaff(wrap, clefKey, slotIdx, isLedger) {
    var clef = NOTE_CLEFS[clefKey];
    var W = 260, H = 150, x0 = 20, x1 = 240;
    var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, class: "staff-svg", width: W });
    [0, 2, 4, 6, 8].forEach(function (idx) {
      svg.appendChild(svgEl("line", { x1: x0, y1: STAFF_Y[idx], x2: x1, y2: STAFF_Y[idx],
        stroke: "#2b2140", "stroke-width": 3, "stroke-linecap": "round" }));
    });
    svg.appendChild(svgEl("path", {
      d: Clefs[clef.shape].d, fill: "#2b2140",
      transform: "translate(26," + STAFF_Y[clef.anchorIdx] + ") scale(" + STAFF_SPACE + ")"
    }));
    var cx = 190, y;
    if (isLedger) {
      var half = clef.ledgerBelow ? clef.ledgerBelow.offset : clef.ledgerAbove.offset;
      y = clef.ledgerBelow ? STAFF_Y[8] + STAFF_SPACE : STAFF_Y[0] - STAFF_SPACE;
      svg.appendChild(svgEl("line", { x1: cx - 20, y1: y, x2: cx + 20, y2: y,
        stroke: "#2b2140", "stroke-width": 3, "stroke-linecap": "round" }));
    } else {
      y = STAFF_Y[slotIdx];
    }
    svg.appendChild(svgEl("line", { x1: cx + 14, y1: y, x2: cx + 14, y2: y - 55,
      stroke: "#a06bff", "stroke-width": 3 }));
    svg.appendChild(svgEl("ellipse", { cx: cx, cy: y, rx: 14, ry: 10.5, fill: "#a06bff",
      stroke: "#7a45d6", "stroke-width": 2, transform: "rotate(-20 " + cx + " " + y + ")" }));
    wrap.innerHTML = "";
    wrap.appendChild(svg);
  }

  // ---- Rhythm reading: reuse the same note glyphs as Rhythm Flashcards ----
  var RNOTEHEAD = '<ellipse cx="{cx}" cy="82" rx="{r}" ry="{ry}" fill="#2b2140" transform="rotate(-18 {cx} 82)"/>';
  var RSTEM = '<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#2b2140"/>';
  function rtpl(s, vals) { return s.replace(/\{(\w+)\}/g, function (_, k) { return vals[k]; }); }
  var RICONS = {
    quarter: '<svg viewBox="0 0 40 96" class="rnote-svg">' + rtpl(RNOTEHEAD, { cx: 16, r: 14, ry: 10.5 }) + rtpl(RSTEM, { x: 27, y: 14, w: 6, h: 70 }) + '</svg>',
    eighths: '<svg viewBox="0 0 106 96" class="rnote-svg">' +
      rtpl(RNOTEHEAD, { cx: 16, r: 14, ry: 10.5 }) + rtpl(RSTEM, { x: 27, y: 20, w: 6, h: 64 }) +
      rtpl(RNOTEHEAD, { cx: 76, r: 14, ry: 10.5 }) + rtpl(RSTEM, { x: 87, y: 20, w: 6, h: 64 }) +
      rtpl(RSTEM, { x: 27, y: 20, w: 66, h: 10 }) + '</svg>',
    rest: '<svg viewBox="0 0 40 70" class="rnote-svg">' +
      '<path d="M 26,6 C 30,12 20,16 24,22 L 8,36 L 28,46 L 10,58 C 6,62 8,66 14,64" ' +
      'fill="none" stroke="#2b2140" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  var RVALUES = {
    quarter: { icon: RICONS.quarter, syl: "ta", hits: [0] },
    eighths: { icon: RICONS.eighths, syl: "ti-ti", hits: [0, 0.5] },
    rest: { icon: RICONS.rest, syl: "sh", hits: [] }
  };
  var RHYTHM_POOLS = {
    "Easy": ["quarter", "quarter", "rest"],
    "Medium": ["quarter", "eighths", "rest"],
    "Hard": ["quarter", "eighths", "eighths", "rest"]
  };
  // Timing tolerance is generous on purpose — this is meant to build
  // confidence, not penalize normal human timing wobble.
  var RHYTHM_TOLERANCE_MS = { "Easy": 400, "Medium": 300, "Hard": 220 };
  var RHYTHM_TEMPO = { "Easy": 72, "Medium": 84, "Hard": 96 };

  // ---- Category definitions -------------------------------------------
  // Each category builds its own question list. A question is either
  // { type:"mc", prompt(el fn)->node, options:[...], correctIndex, correctText }
  // or { type:"rhythm", card:[...], tempo }.
  var CATEGORIES = {
    "Note Names": {
      emoji: "🎵", color: "tile--sky",
      blurb: "Name the note on the staff.",
      build: function (level, n) {
        var qs = [];
        for (var i = 0; i < n; i++) {
          var clefKey, isLedger = false, slotIdx = 0;
          if (level === "Easy") { clefKey = "treble"; slotIdx = Math.floor(Math.random() * 9); }
          else if (level === "Medium") { clefKey = pick(["treble", "bass"]); slotIdx = Math.floor(Math.random() * 9); }
          else { clefKey = pick(["treble", "bass"]); isLedger = Math.random() < 0.3; if (!isLedger) slotIdx = Math.floor(Math.random() * 9); }
          var clef = NOTE_CLEFS[clefKey];
          var correctName = isLedger ? "C4" : clef.notes[slotIdx];
          var correctLetter = correctName.charAt(0);
          var letters = ["C", "D", "E", "F", "G", "A", "B"];
          var optCount = level === "Hard" ? 3 : 4;
          var options = sample(letters.filter(function (l) { return l !== correctLetter; }), optCount - 1);
          options.push(correctLetter);
          options = shuffle(options);
          qs.push({
            type: "mc",
            draw: function (ck, si, led) { return function (wrap) { drawNoteStaff(wrap, ck, si, led); }; }(clefKey, slotIdx, isLedger),
            question: "What note is this?",
            options: options,
            correctText: correctLetter,
            onReveal: function (name) { return function () { Sound.playNote(name, 0.7); }; }(correctName)
          });
        }
        return qs;
      }
    },
    "Musical Terms": {
      emoji: "🔤", color: "tile--grape",
      blurb: "Match the term to its meaning.",
      build: function (level, n) {
        var pool = level === "Easy" ? DATA.terms.filter(function (t) { return t.category === "Dynamics"; })
          : level === "Medium" ? DATA.terms.filter(function (t) { return t.category !== "Expression"; })
          : DATA.terms;
        var used = sample(pool, Math.min(n, pool.length));
        while (used.length < n) used.push(pick(pool));
        return used.map(function (t) {
          var askForTerm = level === "Hard" && Math.random() < 0.5;
          var distractPool = DATA.terms.filter(function (x) { return x !== t; });
          var distractors = sample(distractPool, 3);
          var options, correctText, questionText;
          if (askForTerm) {
            questionText = "Which term means: “" + t.meaning + "”?";
            options = shuffle(distractors.map(function (d) { return d.term; }).concat([t.term]));
            correctText = t.term;
          } else {
            questionText = "What does “" + t.term + (t.abbr ? " (" + t.abbr + ")" : "") + "” mean?";
            options = shuffle(distractors.map(function (d) { return d.meaning; }).concat([t.meaning]));
            correctText = t.meaning;
          }
          return { type: "mc", question: questionText, options: options, correctText: correctText };
        });
      }
    },
    "Clef Names": {
      emoji: "🎼", color: "tile--indigo",
      blurb: "Identify the clef.",
      build: function (level, n) {
        var extraNames = { "Alto Clef": true, "Tenor Clef": true, "Percussion Clef": true, "Soprano Clef": true };
        var extraPool = Object.keys(extraNames);
        var optCount = level === "Easy" ? 2 : level === "Medium" ? 3 : 4;
        var qs = [];
        for (var i = 0; i < n; i++) {
          var shapeKey = pick(["treble", "bass"]);
          var correctText = shapeKey === "treble" ? "Treble Clef" : "Bass Clef";
          var otherReal = shapeKey === "treble" ? "Bass Clef" : "Treble Clef";
          var options = [correctText];
          if (optCount >= 2) options.push(otherReal);
          if (optCount > 2) options = options.concat(sample(extraPool, optCount - 2));
          options = shuffle(options);
          qs.push({
            type: "mc",
            draw: function (sk) { return function (wrap) {
              var W = 140, H = 150;
              var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, class: "staff-svg", width: 140 });
              [0, 1, 2, 3, 4].forEach(function (li) {
                var y = 40 + li * 18;
                svg.appendChild(svgEl("line", { x1: 10, y1: y, x2: 130, y2: y, stroke: "#2b2140", "stroke-width": 3, "stroke-linecap": "round" }));
              });
              var anchorY = sk === "treble" ? 40 + 3 * 18 : 40 + 1 * 18;
              svg.appendChild(svgEl("path", { d: Clefs[sk].d, fill: "#2b2140", transform: "translate(46," + anchorY + ") scale(36)" }));
              wrap.innerHTML = ""; wrap.appendChild(svg);
            }; }(shapeKey),
            question: "What is the name of this clef?",
            options: options,
            correctText: correctText
          });
        }
        return qs;
      }
    },
    "Composers": {
      emoji: "🎼", color: "tile--gold",
      blurb: "Composer facts & famous works.",
      build: function (level, n) {
        var wellKnown = ["Johann Sebastian Bach", "Wolfgang Amadeus Mozart", "Ludwig van Beethoven",
          "Pyotr Ilyich Tchaikovsky", "George Frideric Handel", "Antonio Vivaldi"];
        var pool = level === "Easy" ? DATA.composers.filter(function (c) { return wellKnown.indexOf(c.name) !== -1; })
          : DATA.composers;
        var qs = [];
        for (var i = 0; i < n; i++) {
          var c = pick(pool);
          var useFact = level === "Hard" && Math.random() < 0.5;
          var options, questionText, correctText;
          if (useFact && c.facts && c.facts.length) {
            var fact = pick(c.facts);
            questionText = "Which composer: “" + fact + "”?";
            var distractors = sample(DATA.composers.filter(function (x) { return x !== c; }), 3).map(function (d) { return d.short; });
            options = shuffle(distractors.concat([c.short]));
            correctText = c.short;
          } else {
            var work = pick(c.works);
            questionText = "Who composed “" + work + "”?";
            var pool2 = level === "Easy" ? pool : DATA.composers;
            var distractors2 = sample(pool2.filter(function (x) { return x !== c; }), 3).map(function (d) { return d.short; });
            options = shuffle(distractors2.concat([c.short]));
            correctText = c.short;
          }
          qs.push({ type: "mc", question: questionText, options: options, correctText: correctText });
        }
        return qs;
      }
    },
    "Rhythm Reading": {
      emoji: "🥁", color: "tile--lime",
      blurb: "Tap or press spacebar along with the rhythm.",
      build: function (level, n) {
        var pool = RHYTHM_POOLS[level];
        var tempo = RHYTHM_TEMPO[level];
        var qs = [];
        for (var i = 0; i < n; i++) {
          var card = [];
          for (var b = 0; b < 4; b++) card.push(pick(pool));
          if (card.every(function (v) { return v === "rest"; })) card[0] = "quarter";
          qs.push({ type: "rhythm", card: card, tempo: tempo });
        }
        return qs;
      }
    }
  };

  var QUESTIONS_PER_QUIZ = 8;
  var RHYTHM_QUESTIONS_PER_QUIZ = 5;
  var LEVELS = ["Easy", "Medium", "Hard"];

  function render(container, h) {
    var el = h.el;
    container.appendChild(h.pageHead("❓", "Quiz Mode",
      "Pick a topic and a difficulty, then see how you do!"));

    var stage = el("div");
    container.appendChild(stage);

    var state = null;
    var activeCleanup = null;
    showMenu();

    function cleanupActive() {
      if (activeCleanup) { activeCleanup(); activeCleanup = null; }
    }

    // ===================================================================
    function showMenu() {
      cleanupActive();
      state = null;
      stage.innerHTML = "";
      var grid = el("div.quiz-menu-grid");
      Object.keys(CATEGORIES).forEach(function (catName) {
        var cat = CATEGORIES[catName];
        var levelRow = el("div.pill-group");
        LEVELS.forEach(function (lv) {
          levelRow.appendChild(el("button.pill", { text: lv, onclick: function () { startQuiz(catName, lv); } }));
        });
        grid.appendChild(el("div.card.quiz-cat-card", null,
          el("div.quiz-cat-head", null, el("span.quiz-cat-emoji", { text: cat.emoji }), el("h3", { text: catName })),
          el("p.hint", { text: cat.blurb }),
          levelRow
        ));
      });
      stage.appendChild(grid);
    }

    function startQuiz(catName, level) {
      Sound.unlock();
      var cat = CATEGORIES[catName];
      var isRhythm = catName === "Rhythm Reading";
      var count = isRhythm ? RHYTHM_QUESTIONS_PER_QUIZ : QUESTIONS_PER_QUIZ;
      var questions = cat.build(level, count);
      state = {
        catName: catName, level: level, questions: questions, qIndex: 0,
        results: [], score: 0, maxScore: 0
      };
      showQuestion();
    }

    function progressBar() {
      var pct = Math.round((state.qIndex / state.questions.length) * 100);
      return el("div.quiz-progress-track", null,
        el("div.quiz-progress-fill", { style: "width:" + pct + "%" })
      );
    }

    function showQuestion() {
      cleanupActive();
      stage.innerHTML = "";
      var q = state.questions[state.qIndex];
      var head = el("div.control-row", { style: "justify-content:space-between;align-items:center" },
        el("span.hint", { text: state.catName + " · " + state.level }),
        el("span.hint", { text: "Question " + (state.qIndex + 1) + " of " + state.questions.length })
      );
      stage.appendChild(head);
      stage.appendChild(progressBar());

      if (q.type === "mc") stage.appendChild(renderMC(q));
      else stage.appendChild(renderRhythm(q));
    }

    function renderMC(q) {
      var card = el("div.card");
      if (q.draw) {
        var wrap = el("div.staff-wrap", { style: "display:flex;justify-content:center" });
        card.appendChild(wrap);
        q.draw(wrap);
      }
      card.appendChild(el("h3", { text: q.question, style: "margin-top:0" }));
      var optsWrap = el("div.quiz-options");
      var answered = false;
      q.options.forEach(function (opt) {
        var btn = el("button.quiz-option-btn", { text: opt, onclick: function () {
          if (answered) return;
          answered = true;
          var correct = opt === q.correctText;
          Array.prototype.forEach.call(optsWrap.children, function (b) {
            if (b.textContent === q.correctText) b.classList.add("is-correct");
            else b.classList.add("is-disabled");
          });
          if (!correct) btn.classList.add("is-wrong");
          if (q.onReveal) q.onReveal();
          recordResult({
            prompt: q.question, chosen: opt, correctText: q.correctText,
            isCorrect: correct, pointsEarned: correct ? 1 : 0, maxPoints: 1
          });
          Sound.tone(correct ? 880 : 220, null, correct ? 0.12 : 0.18, correct ? "square" : "sawtooth");
          setTimeout(advance, 900);
        }});
        optsWrap.appendChild(btn);
      });
      card.appendChild(optsWrap);
      return card;
    }

    function renderRhythm(q) {
      var card = el("div.card.rhythm-card");
      var readout = el("p.hint", { text: "Tap “Start”, listen to the 4-click count-in, then tap the button (or press spacebar) in time with each beat below." });
      card.appendChild(readout);

      var beatsRow = el("div.rhythm-beats");
      q.card.forEach(function (id) {
        var v = RVALUES[id];
        beatsRow.appendChild(el("div.rbeat", null, el("div.glyph", { html: v.icon }), el("div.syl", { text: v.syl })));
      });
      card.appendChild(beatsRow);

      var tapBtn = el("button.btn.btn--play", { html: "👏 Start", style: "min-width:160px" });
      var statusLine = el("p.hint", { text: "" });
      card.appendChild(el("div.control-row", { style: "justify-content:center" }, tapBtn));
      card.appendChild(statusLine);

      var running = false, done = false, expected = [], taps = [], keyHandler = null, endTimer = null;

      function cellFor(i) { return beatsRow.children[i]; }

      function begin() {
        if (running || done) return;
        running = true;
        // tapBtn stays enabled while running — it doubles as the tap target,
        // so disabling it here would swallow every click meant as a beat tap.
        Array.prototype.forEach.call(beatsRow.children, function (c) { c.classList.remove("hit", "miss", "close"); });
        statusLine.textContent = "Get ready…";
        var beatSec = 60 / q.tempo;
        var t0 = Sound.now() + 0.1;
        for (var c = 0; c < 4; c++) Sound.click(c === 0, t0 + c * beatSec);
        var patternStart = t0 + 4 * beatSec;
        expected = [];
        q.card.forEach(function (id, i) {
          RVALUES[id].hits.forEach(function (f) {
            expected.push({ time: patternStart + (i + f) * beatSec, beatIndex: i, matched: false });
          });
        });
        taps = [];
        var msUntilStart = (patternStart - Sound.now()) * 1000;
        setTimeout(function () { if (running) statusLine.textContent = "Tap along now! 🥁"; }, Math.max(0, msUntilStart));
        var totalMs = msUntilStart + (q.card.length * beatSec * 1000) + 400;
        endTimer = setTimeout(finish, totalMs);
        keyHandler = function (e) { if (e.code === "Space") { e.preventDefault(); registerTap(); } };
        window.addEventListener("keydown", keyHandler);
      }

      function registerTap() {
        if (!running) return;
        taps.push(performance.now());
      }

      function finish() {
        if (done) return;
        running = false;
        done = true;
        if (keyHandler) window.removeEventListener("keydown", keyHandler);
        tapBtn.disabled = true;
        tapBtn.style.opacity = "0.5";
        var tolerance = RHYTHM_TOLERANCE_MS[state.level];
        var expectedMs = expected.map(function (e) { return { ms: (e.time - Sound.now()) * 1000 + performance.now(), beatIndex: e.beatIndex, matched: false }; });
        var hits = 0, close = 0;
        taps.forEach(function (tapMs) {
          var best = null, bestDiff = Infinity;
          expectedMs.forEach(function (e) {
            if (e.matched) return;
            var diff = Math.abs(tapMs - e.ms);
            if (diff < bestDiff) { bestDiff = diff; best = e; }
          });
          if (best && bestDiff <= tolerance) { best.matched = true; hits++; }
          else if (best && bestDiff <= tolerance * 1.8) { best.matched = true; close++; }
        });
        expectedMs.forEach(function (e) {
          var cell = cellFor(e.beatIndex);
          if (!cell) return;
          if (e.matched) cell.classList.add("hit"); else cell.classList.add("miss");
        });
        var maxPoints = expectedMs.length;
        var pointsEarned = hits + close * 0.5;
        var pct = maxPoints ? Math.round((pointsEarned / maxPoints) * 100) : 100;
        statusLine.innerHTML = "Result: <b>" + hits + " on time</b>" + (close ? ", " + close + " close" : "") +
          (maxPoints - hits - close > 0 ? ", " + (maxPoints - hits - close) + " missed" : "") + " — " + pct + "%";
        recordResult({
          prompt: "Rhythm pattern " + (state.qIndex + 1),
          chosen: hits + "/" + maxPoints + " on time",
          correctText: maxPoints + "/" + maxPoints + " on time",
          isCorrect: pointsEarned >= maxPoints * 0.8,
          pointsEarned: pointsEarned, maxPoints: maxPoints
        });
        var nextBtn = el("button.btn.btn--blue", { html: "Next →", onclick: advance });
        card.appendChild(el("div.control-row", { style: "justify-content:center" }, nextBtn));
      }

      // The same button both starts the pattern and, once running, doubles
      // as the tap target — so kids don't need to hunt for a second control.
      tapBtn.addEventListener("click", function () { Sound.unlock(); registerTap(); begin(); });

      activeCleanup = function () {
        running = false;
        if (keyHandler) window.removeEventListener("keydown", keyHandler);
        if (endTimer) clearTimeout(endTimer);
      };

      return card;
    }

    function recordResult(r) {
      state.results.push(r);
      state.score += r.pointsEarned;
      state.maxScore += r.maxPoints;
    }

    function advance() {
      state.qIndex++;
      if (state.qIndex >= state.questions.length) showResults();
      else showQuestion();
    }

    function showResults() {
      cleanupActive();
      stage.innerHTML = "";
      var pct = state.maxScore ? Math.round((state.score / state.maxScore) * 100) : 0;
      var grade = pct >= 90 ? "🌟 Excellent!" : pct >= 70 ? "👍 Good job!" : pct >= 50 ? "🙂 Keep practicing!" : "💪 Try again!";

      var sheet = el("div.card.quiz-sheet", { id: "quizScoreSheet" },
        el("h3", { text: "Quiz Results", style: "margin-top:0" }),
        el("p.hint", { text: state.catName + " · " + state.level + " · " + new Date().toLocaleDateString() }),
        el("div.quiz-score-big", { text: Math.round(state.score * 10) / 10 + " / " + state.maxScore + " (" + pct + "%)" }),
        el("div.quiz-grade", { text: grade })
      );

      var list = el("ul.quiz-review-list");
      state.results.forEach(function (r) {
        list.appendChild(el("li", { class: r.isCorrect ? "is-correct" : "is-wrong" },
          el("span", { text: (r.isCorrect ? "✅ " : "❌ ") + r.prompt }),
          el("span.quiz-review-detail", { text: r.isCorrect ? "" : "Your answer: " + r.chosen + " · Correct: " + r.correctText })
        ));
      });
      sheet.appendChild(list);
      stage.appendChild(sheet);

      var downloadBtn = el("button.btn.btn--blue", { html: "⬇ Download score sheet", onclick: function () { downloadScoreSheet(state, pct, grade); } });
      var tryAgainBtn = el("button.btn.btn--play", { html: "🔁 Try again", onclick: function () { startQuiz(state.catName, state.level); } });
      var menuBtn = el("button.btn.btn--ghost", { html: "🏠 Quiz menu", onclick: showMenu });
      stage.appendChild(el("div.control-row", { style: "justify-content:center;margin-top:14px" }, downloadBtn, tryAgainBtn, menuBtn));
      stage.appendChild(el("p.hint", { text: "Tip: you can also just take a screenshot of this screen!", style: "text-align:center;margin-top:10px" }));
    }

    return cleanupActive;
  }

  // ---- Score-sheet image export (canvas -> PNG download) ------------------
  function downloadScoreSheet(state, pct, grade) {
    var W = 800, lineH = 30;
    var lines = state.results.map(function (r) {
      return (r.isCorrect ? "✓ " : "✗ ") + r.prompt +
        (r.isCorrect ? "" : "  (you: " + r.chosen + " / correct: " + r.correctText + ")");
    });
    var H = 260 + lines.length * lineH + 40;
    var canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff7ee"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#2b2140";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText("Quiz Results", 30, 55);
    ctx.font = "600 18px sans-serif";
    ctx.fillStyle = "#5a4f73";
    ctx.fillText(state.catName + " · " + state.level + " · " + new Date().toLocaleDateString(), 30, 85);
    ctx.fillStyle = "#2b2140";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText(Math.round(state.score * 10) / 10 + " / " + state.maxScore + "  (" + pct + "%)", 30, 145);
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(grade, 30, 182);
    ctx.strokeStyle = "#e3ddef"; ctx.beginPath(); ctx.moveTo(30, 200); ctx.lineTo(W - 30, 200); ctx.stroke();
    ctx.font = "16px sans-serif";
    var y = 232;
    lines.forEach(function (line) {
      ctx.fillStyle = line.charAt(0) === "✓" ? "#1f9d55" : "#c0392b";
      wrapText(ctx, line, 30, y, W - 60, lineH);
      y += lineH;
    });
    var url = canvas.toDataURL("image/png");
    var a = document.createElement("a");
    a.href = url;
    a.download = "quiz-score-" + state.catName.replace(/\s+/g, "-").toLowerCase() + "-" + state.level.toLowerCase() + ".png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(" "), line = "";
    for (var i = 0; i < words.length; i++) {
      var test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        line = words[i] + " ";
        y += lineHeight;
      } else line = test;
    }
    ctx.fillText(line, x, y);
  }

  App.register({
    id: "quiz",
    title: "Quiz Mode",
    emoji: "❓",
    desc: "Note names, terms, clefs, rhythm & composers — Easy to Hard.",
    color: "tile--berry",
    render: render
  });
})();
