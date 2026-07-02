/* ==========================================================================
   orchestra.js — Instruments of the Orchestra, grouped by section.
   Tap an instrument to hear a family-flavored sound (strings/woodwinds sing
   a tone, brass a brighter tone, percussion a synthesized hit) and read a
   kid-friendly blurb + fun fact.
   ========================================================================== */

(function () {
  var SECTION_COLOR = { "Strings": "#5b8cff", "Woodwinds": "#7ed957", "Brass": "#ffab3d", "Percussion": "#ff5da2" };
  var SECTION_EMOJI = { "Strings": "🎻", "Woodwinds": "🪈", "Brass": "🎺", "Percussion": "🥁" };

  // Rough pitch per instrument so low instruments sound low and high ones high.
  var PITCH = {
    "Violin": "A4", "Viola": "D4", "Cello": "G3", "Double Bass": "E2", "Harp": "C4",
    "Flute": "C5", "Clarinet": "G4", "Oboe": "A4", "Bassoon": "D3", "Saxophone": "F4",
    "Trumpet": "Bb4", "French Horn": "F3", "Trombone": "Bb3", "Tuba": "Bb2",
    "Timpani": "C3", "Snare Drum": "G4", "Bass Drum": "C2", "Cymbals": "A5", "Xylophone": "C6"
  };
  var WAVE = { "Strings": "sawtooth", "Woodwinds": "sine", "Brass": "square" };

  function render(container, h) {
    var el = h.el;
    container.appendChild(h.pageHead("🎻", "Instruments of the Orchestra",
      "Tap an instrument to hear its family sound and learn a fun fact."));

    var readout = el("div.note-readout", { html: "Tap any instrument to begin! 🎶" });
    container.appendChild(el("div.card", null, readout));

    DATA.instrumentSections.forEach(function (section) {
      var list = DATA.instruments.filter(function (i) { return i.section === section; });
      container.appendChild(el("div.orch-section-head", { style: "--sc:" + SECTION_COLOR[section] },
        el("span.orch-section-emoji", { text: SECTION_EMOJI[section] }),
        el("h3", { text: section })
      ));
      var grid = el("div.orch-grid");
      list.forEach(function (inst) {
        var card = el("button.orch-card", { style: "--sc:" + SECTION_COLOR[section], onclick: function () { play(inst, section, readout, card); } },
          el("span.orch-emoji", { text: inst.emoji }),
          el("span.orch-name", { text: inst.name })
        );
        grid.appendChild(card);
      });
      container.appendChild(grid);
    });
  }

  function play(inst, section, readout, card) {
    Sound.unlock();
    var freq = Sound.noteFreq(PITCH[inst.name] || "C4");
    if (section === "Percussion") {
      Sound.perc(freq, null, 0.5, "square");
    } else {
      Sound.tone(freq, null, 0.7, WAVE[section] || "triangle", 0.3);
    }
    card.classList.remove("flash");
    void card.offsetWidth;
    card.classList.add("flash");
    readout.innerHTML = "<b>" + inst.name + "</b> <small style='display:block'>" + inst.blurb + "</small>" +
      "<small style='display:block;color:var(--ink-soft);margin-top:4px'>💡 " + inst.fact + "</small>";
  }

  App.register({
    id: "orchestra",
    title: "Instruments of the Orchestra",
    emoji: "🎻",
    desc: "Strings, woodwinds, brass & percussion, grouped by section.",
    color: "tile--mint",
    render: render
  });
})();
