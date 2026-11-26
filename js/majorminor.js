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
      "Listen to a chord or a short tune and decide: major or minor?"));

    // What major / minor mean — a friendly reminder card.
    container.appendChild(el("div.card", null,
      el("div.row-wrap", null,
                el("div", null,
          el("p", { html: "<b>Major sounds bright.</b> Happy, sunny, cheerful." })
        )
      ),
      el("div.spacer-sm"),
      el("div.row-wrap", null,
                el("div", null,
          el("p", { html: "<b>Minor sounds mysterious.</b> Shadowy, spooky, or a little sad." })
        )
      )
    ));

    // Big "play the sound" button.
    var listenBtn = el("button.big-pad.big-pad--listen", {
      html: "<span>Play the sound</span><span class='big-pad__sub'>Tap again to hear it once more</span>",
      onclick: function () { playCurrent(); }
    });
    container.appendChild(el("div.card", null, listenBtn));

    // Feedback readout.
    var readout = el("div.note-readout", { html: "Tap <b>Play the sound</b> to begin." });
    container.appendChild(readout);

    // The two answer buttons.
    var majorBtn = el("button.btn.btn--sun", {
      html: "<span>Major</span><span class='btn__sub'>bright</span>",
      style: "flex:1;min-height:96px;font-size:24px;",
      onclick: function () { answer(false); }
    });
    var minorBtn = el("button.btn.btn--purple", {
      html: "<span>Minor</span><span class='btn__sub'>mysterious</span>",
      style: "flex:1;min-height:96px;font-size:24px;",
      onclick: function () { answer(true); }
    });
    container.appendChild(el("div.control-row", { style: "align-items:stretch" }, majorBtn, minorBtn));

    // Next button (hidden until an answer is given).
    var nextBtn = el("button.btn.btn--play", { html: "Next sound", style: "display:none", onclick: newRound });
    var scoreLine = el("div.hint", { text: "Score: 0 / 0", style: "text-align:center;margin-top:8px" });
    container.appendChild(el("div.control-row", { style: "justify-content:center" }, nextBtn));
    container.appendChild(scoreLine);

    newRound();

    // ---------------------------------------------------------------------
    function newRound() {
      state.root = ROOTS[Math.floor(Math.random() * ROOTS.length)];
      state.minor = Math.random() < 0.5;
      state.answered = false;
      readout.innerHTML = "Listen carefully. Major or minor?";
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
      var desc = state.minor ? "mysterious and shadowy" : "bright and happy";
      if (correct) {
        readout.innerHTML = "Yes! That was <b>" + realName + "</b>, " + desc + ".";
        Sound.tone(880, null, 0.12, "square");
      } else {
        readout.innerHTML = "So close! That one was actually <b>" + realName + "</b>, " + desc + ".";
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
    desc: "Hear a chord or tune and decide which it is.",
    color: "tile--yellow",
    render: render
  });
})();
