/* ==========================================================================
   piano.js — a tappable two-octave piano (C4–C6).
   Tap keys to hear the pitch and see its name. Toggle note-name labels for
   beginners. Works with touch, stylus, and mouse.
   ========================================================================== */

(function () {
  var WHITE = ["C4","D4","E4","F4","G4","A4","B4","C5","D5","E5","F5","G5","A5","B5","C6"];
  // Each black key sits after the given white-key index.
  var BLACK = [
    { n: "C#4", after: 0 }, { n: "D#4", after: 1 }, { n: "F#4", after: 3 },
    { n: "G#4", after: 4 }, { n: "A#4", after: 5 },
    { n: "C#5", after: 7 }, { n: "D#5", after: 8 }, { n: "F#5", after: 10 },
    { n: "G#5", after: 11 }, { n: "A#5", after: 12 }
  ];

  function render(container, h) {
    var el = h.el;
    var state = { showLabels: true };

    container.appendChild(h.pageHead("🎹", "Piano Keyboard",
      "Tap the keys to hear each note. Turn labels on or off to practice."));

    var labelBtn = el("button.pill.is-active", { text: "🔤 Note names", onclick: function () {
      state.showLabels = !state.showLabels;
      labelBtn.classList.toggle("is-active", state.showLabels);
      updateLabels();
    }});
    container.appendChild(el("div.card", null, el("div.control-row", null, labelBtn)));

    var readout = el("div.note-readout", { html: "Tap a key to play! 🎶" });
    var pianoWrap = el("div.piano-wrap");
    var piano = el("div.piano");
    pianoWrap.appendChild(piano);
    container.appendChild(el("div.card", null, readout, pianoWrap));

    container.appendChild(el("div.card", null,
      el("p.hint", { text: "The white keys spell C-D-E-F-G-A-B and repeat. Two white keys with a black key between them are a whole step; touching keys are a half step." })
    ));

    // ---- Build white keys ----
    var whiteEls = [];
    WHITE.forEach(function (note) {
      var key = el("div.pkey-white", null, el("span.lbl", { text: prettied(note) }));
      key.dataset.note = note;
      attachPlay(key, note);
      piano.appendChild(key);
      whiteEls.push(key);
    });

    // ---- Build black keys (absolute-positioned over the whites) ----
    var whiteW = 100 / WHITE.length;         // width of one white key in %
    var blackW = whiteW * 0.62;
    BLACK.forEach(function (b) {
      var key = el("div.pkey-black", null, el("span.lbl", { text: prettied(b.n) }));
      key.dataset.note = b.n;
      var centerPct = (b.after + 1) * whiteW;  // boundary between two whites
      key.style.width = blackW + "%";
      key.style.left = (centerPct - blackW / 2) + "%";
      attachPlay(key, b.n);
      piano.appendChild(key);
    });

    updateLabels();

    function attachPlay(key, note) {
      function play(e) {
        if (e) e.preventDefault();
        Sound.unlock();
        Sound.playNote(note, 0.9);
        readout.innerHTML = "🎵 <b>" + prettied(note) + "</b>";
        key.classList.add("active");
        setTimeout(function () { key.classList.remove("active"); }, 180);
      }
      key.addEventListener("pointerdown", play);
    }

    function updateLabels() {
      var labels = piano.querySelectorAll(".lbl");
      Array.prototype.forEach.call(labels, function (l) {
        l.style.visibility = state.showLabels ? "visible" : "hidden";
      });
    }
  }

  // "C#4" -> "C♯", "C4" -> "C" for a friendly label.
  function prettied(note) {
    return note.replace("#", "♯").replace(/\d/, "");
  }

  App.register({
    id: "piano",
    title: "Piano Keyboard",
    emoji: "🎹",
    desc: "Tap a two-octave keyboard and hear every note.",
    color: "tile--indigo",
    render: render
  });
})();
