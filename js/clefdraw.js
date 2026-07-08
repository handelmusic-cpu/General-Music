/* ==========================================================================
   clefdraw.js — trace-the-clef drawing tool.
   A faint guide clef sits on a staff behind a canvas. Kids trace it with a
   finger or stylus (Pointer Events, so it works on iPad + Chromebook touch +
   mouse). Color swatches, brush size, undo, clear, and a guide toggle.
   ========================================================================== */

(function () {
  var COLORS = ["#ff5da2", "#ff7a59", "#ffab3d", "#7ed957", "#38bdf8", "#a06bff", "#2b2140"];

  // Hand-drawn bass clef guide (hook + two dots straddling the F line), drawn
  // as pure Canvas paths rather than the Unicode "𝄢" character — glyph
  // proportions for that character vary unpredictably across fonts/browsers,
  // so this guarantees the dots always land exactly on the F line for every
  // student, regardless of device.
  function drawBassClefGuide(ctx, x0, fY, gap, alpha) {
    var ox = x0 + 1.333 * gap;
    function px(mx) { return ox + mx * gap; }
    function py(my) { return fY + my * gap; }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#2b2140";
    ctx.fillStyle = "#2b2140";
    ctx.lineCap = "round";
    ctx.lineWidth = gap * 0.396;
    ctx.beginPath();
    ctx.moveTo(px(-0.083), py(-1.25));
    ctx.bezierCurveTo(px(0.917), py(-1.25), px(1.5), py(-0.583), px(1.5), py(0.167));
    ctx.bezierCurveTo(px(1.5), py(1.0), px(0.833), py(1.667), px(-0.167), py(1.75));
    ctx.bezierCurveTo(px(-1.0), py(1.8125), px(-1.417), py(1.333), px(-1.25), py(0.833));
    ctx.stroke();
    ctx.beginPath(); ctx.arc(px(2.0), py(-0.375), gap * 0.229, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(px(2.0), py(0.625), gap * 0.229, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function render(container, h) {
    var el = h.el;
    var state = { clef: "treble", color: COLORS[5], size: 10, showGuide: true, strokes: [], drawing: null };

    container.appendChild(h.pageHead("✏️", "Clef Drawing",
      "Trace the clef with your finger or stylus. Then try it on your own!"));

    // Clef + guide toggle
    var clefGroup = el("div.pill-group");
    [["treble", "𝄞 Treble clef"], ["bass", "𝄢 Bass clef"]].forEach(function (c) {
      var p = el("button.pill", { text: c[1], onclick: function () {
        state.clef = c[0]; syncPills(clefGroup, c[1]); redraw();
      }});
      if (c[0] === state.clef) p.classList.add("is-active");
      p.dataset.label = c[1];
      clefGroup.appendChild(p);
    });
    var guideBtn = el("button.pill.is-active", { text: "👀 Guide", onclick: function () {
      state.showGuide = !state.showGuide;
      guideBtn.classList.toggle("is-active", state.showGuide);
      redraw();
    }});
    container.appendChild(el("div.card", null, el("div.control-row", null, clefGroup, guideBtn)));

    // Color swatches + brush size
    var swatches = el("div.swatches");
    COLORS.forEach(function (c) {
      var s = el("div.swatch", { onclick: function () { state.color = c; syncSwatch(); } });
      s.style.background = c;
      s.dataset.color = c;
      if (c === state.color) s.classList.add("is-active");
      swatches.appendChild(s);
    });
    function syncSwatch() {
      Array.prototype.forEach.call(swatches.children, function (s) {
        s.classList.toggle("is-active", s.dataset.color === state.color);
      });
    }
    var sizeInput = el("input", {
      type: "range", min: "4", max: "26", value: state.size + "", "aria-label": "Brush size",
      oninput: function () { state.size = +sizeInput.value; }
    });
    container.appendChild(el("div.card", null,
      el("div.control-row", null, el("span.hint", { text: "Color:" }), swatches),
      el("div.spacer-sm"),
      el("div.control-row", null, el("label.slider", null, el("span", { text: "🖌 Brush" }), sizeInput))
    ));

    // Canvas stage — tall enough to fit a full-height clef above & below the staff
    var W = 720, Hh = 500;
    var canvas = el("canvas");
    canvas.width = W; canvas.height = Hh;
    var stage = el("div.draw-stage", null, canvas);
    container.appendChild(stage);
    var ctx = canvas.getContext("2d");

    // Buttons
    container.appendChild(el("div.control-row", null,
      el("button.btn.btn--ghost", { html: "↶ Undo", onclick: function () { state.strokes.pop(); redraw(); } }),
      el("button.btn.btn--stop", { html: "🧽 Clear", onclick: function () { state.strokes = []; redraw(); } })
    ));

    // ---- Drawing via Pointer Events -------------------------------------
    function pos(e) {
      var r = canvas.getBoundingClientRect();
      var x = (e.clientX - r.left) * (canvas.width / r.width);
      var y = (e.clientY - r.top) * (canvas.height / r.height);
      return { x: x, y: y };
    }
    canvas.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      state.drawing = { color: state.color, size: state.size, points: [pos(e)] };
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!state.drawing) return;
      e.preventDefault();
      state.drawing.points.push(pos(e));
      redraw();
    });
    function endStroke() {
      if (state.drawing) { state.strokes.push(state.drawing); state.drawing = null; redraw(); }
    }
    canvas.addEventListener("pointerup", endStroke);
    canvas.addEventListener("pointercancel", endStroke);
    canvas.addEventListener("pointerleave", endStroke);

    redraw();

    // ---- Rendering -------------------------------------------------------
    function drawStaff() {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, Hh);
      // 5 lines (numbered bottom→top: line 1 is the bottom line)
      var top = 170, gap = 42;
      ctx.strokeStyle = "#e3ddef";
      ctx.lineWidth = 3;
      for (var i = 0; i < 5; i++) {
        var y = top + i * gap;
        ctx.beginPath(); ctx.moveTo(70, y); ctx.lineTo(W - 40, y); ctx.stroke();
      }
      var gLineY = top + 3 * gap;  // 2nd line from bottom (the G line — treble spiral)
      var fLineY = top + 1 * gap;  // 2nd line from top (the F line — the bass clef's two dots straddle it)

      if (state.showGuide) {
        if (state.clef === "bass") {
          drawBassClefGuide(ctx, 70, fLineY, gap, 0.16);
        } else {
          ctx.save();
          ctx.globalAlpha = 0.16;
          ctx.fillStyle = "#2b2140";
          ctx.textBaseline = "alphabetic";
          var size = 360;
          // "frac" = where the clef's anchor (the spiral belly, ~62% down its
          // own bounding box) sits, measured from the actual rendered glyph.
          var frac = 0.62;
          ctx.font = size + "px serif";
          var m = ctx.measureText("𝄞");
          var asc = m.actualBoundingBoxAscent, desc = m.actualBoundingBoxDescent;
          var baseline = (asc && desc) ? (gLineY + asc - frac * (asc + desc)) : (gLineY + size * 0.16);
          ctx.fillText("𝄞", 96, baseline);
          ctx.restore();
        }
      }
    }

    function drawStroke(s) {
      if (!s.points.length) return;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.lineJoin = ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (var i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
      if (s.points.length === 1) { ctx.lineTo(s.points[0].x + 0.1, s.points[0].y + 0.1); }
      ctx.stroke();
    }

    function redraw() {
      drawStaff();
      state.strokes.forEach(drawStroke);
      if (state.drawing) drawStroke(state.drawing);
    }

    function syncPills(row, label) {
      Array.prototype.forEach.call(row.children, function (b) {
        b.classList.toggle("is-active", b.dataset.label === label);
      });
    }
  }

  App.register({
    id: "clefdraw",
    title: "Clef Drawing",
    emoji: "✏️",
    desc: "Trace treble & bass clefs with finger or stylus.",
    color: "tile--purple",
    render: render
  });
})();
