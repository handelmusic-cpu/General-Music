/* ==========================================================================
   majorminor.js — "Major or Minor?" listening game.
   The app plays a chord (rolled up, then all together) and the student decides:
   is it MAJOR (bright & happy, like sunshine) or MINOR (mysterious & shadowy)?
   Big two-button choice, instant feedback, and a running score.
   ========================================================================== */

(function () {
  // Comfortable starting notes so chords stay in a pleasant range.
  var ROOTS = ["C4", "D4", "E4", "F4", "G4", "A3", "Bb3"];

  function render(container, h) {
    var el = h.el;
    var state = { root: "C4", minor: false, answered: false, score: 0, total: 0 };

    container.appendChild(h.pageHead("🎧", "Major or Minor?",
      "Listen to the sound. Is it bright and happy, or mysterious and shadowy?"));

    // What major / minor mean — a friendly reminder card.
    container.appendChild(el("div.card", null,
      el("div.row-wrap", null,
        el("span.big-emoji-badge", { text: "☀️" }),
        el("div", null,
          el("p", { html: "<b>Major = bright.</b> Sounds happy, sunny, and cheerful — like a big smile." })
        )
      ),
      el("div.spacer-sm"),
      el("div.row-wrap", null,
        el("span.big-emoji-badge", { text: "🌙" }),
        el("div", null,
          el("p", { html: "<b>Minor = mysterious.</b> Sounds shadowy, spooky, or a little sad — like a secret in the dark." })
        )
      )
    ));

    // Big "play the sound" button.
    var listenBtn = el("button", {
      style: "width:100%;min-height:150px;border:none;border-radius:26px;cursor:pointer;" +
        "background:linear-gradient(150deg,#c79bff,#7fb0ff);color:#fff;font-family:var(--font-round);" +
        "font-weight:800;font-size:30px;box-shadow:var(--shadow);",
      html: "🔊 Play the Sound<br><span style='font-size:16px;font-weight:700;opacity:.9'>tap to listen (tap again to hear it once more)</span>",
      onclick: function () { playCurrent(); }
    });
    container.appendChild(el("div.card", null, listenBtn));

    // Feedback readout.
    var readout = el("div.note-readout", { html: "Tap <b>Play the Sound</b> to begin! 🎵" });
    container.appendChild(readout);

    // The two answer buttons.
    var majorBtn = el("button.btn", {
      html: "☀️ Major<br><span style='font-size:14px;font-weight:700;opacity:.95'>bright &amp; happy</span>",
      style: "flex:1;min-height:96px;font-size:24px;background:linear-gradient(150deg,#ffe27a,#ffab3d);",
      onclick: function () { answer(false); }
    });
    var minorBtn = el("button.btn.btn--purple", {
      html: "🌙 Minor<br><span style='font-size:14px;font-weight:700;opacity:.95'>mysterious &amp; shadowy</span>",
      style: "flex:1;min-height:96px;font-size:24px;",
      onclick: function () { answer(true); }
    });
    container.appendChild(el("div.control-row", { style: "align-items:stretch" }, majorBtn, minorBtn));

    // Next button (hidden until an answer is given).
    var nextBtn = el("button.btn.btn--play", { html: "Next sound →", style: "display:none", onclick: newRound });
    var scoreLine = el("div.hint", { text: "Score: 0 / 0", style: "text-align:center;margin-top:8px" });
    container.appendChild(el("div.control-row", { style: "justify-content:center" }, nextBtn));
    container.appendChild(scoreLine);

    newRound();

    // ---------------------------------------------------------------------
    function newRound() {
      state.root = ROOTS[Math.floor(Math.random() * ROOTS.length)];
      state.minor = Math.random() < 0.5;
      state.answered = false;
      readout.innerHTML = "Listen carefully… ☀️ or 🌙 ?";
      nextBtn.style.display = "none";
      setEnabled(true);
      playCurrent();
    }

    function playCurrent() {
      Sound.unlock();
      var root = Sound.noteFreq(state.root);
      var third = root * Math.pow(2, (state.minor ? 3 : 4) / 12); // minor 3rd vs major 3rd
      var fifth = root * Math.pow(2, 7 / 12);
      var t = Sound.now() + 0.06;
      var step = 0.26;
      // Roll the chord upward…
      Sound.tone(root, t, 0.32, "triangle");
      Sound.tone(third, t + step, 0.32, "triangle");
      Sound.tone(fifth, t + 2 * step, 0.32, "triangle");
      // …then play all three together and let it ring.
      var ct = t + 3 * step;
      Sound.tone(root, ct, 1.3, "triangle");
      Sound.tone(third, ct, 1.3, "triangle");
      Sound.tone(fifth, ct, 1.3, "triangle");
    }

    function answer(pickedMinor) {
      if (state.answered) return;
      state.answered = true;
      state.total++;
      var correct = pickedMinor === state.minor;
      if (correct) state.score++;
      var realName = state.minor ? "Minor" : "Major";
      var desc = state.minor ? "mysterious &amp; shadowy 🌙" : "bright &amp; happy ☀️";
      if (correct) {
        readout.innerHTML = "🌟 Yes! That was <b>" + realName + "</b> — " + desc + ".";
        Sound.tone(880, null, 0.12, "square");
      } else {
        readout.innerHTML = "So close! That one was actually <b>" + realName + "</b> — " + desc + ".";
        Sound.tone(220, null, 0.18, "sawtooth");
      }
      scoreLine.textContent = "Score: " + state.score + " / " + state.total;
      setEnabled(false);
      nextBtn.style.display = "";
    }

    function setEnabled(on) {
      [majorBtn, minorBtn].forEach(function (b) {
        b.disabled = !on;
        b.style.opacity = on ? "1" : "0.55";
      });
    }
  }

  App.register({
    id: "majorminor",
    title: "Major or Minor?",
    emoji: "🎧",
    desc: "Listen and decide: bright (major) or mysterious (minor)?",
    color: "tile--yellow",
    render: render
  });
})();
