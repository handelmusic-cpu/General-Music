/* ==========================================================================
   orchestra.js — Instruments of the Orchestra, grouped by section.
   Tap an instrument to hear a REAL recorded note (from the Philharmonia
   Orchestra's free sample library — see the credit line at the bottom of
   the page) and read a kid-friendly blurb + fun fact. Harp, Timpani, and
   Xylophone aren't in that library, so they get a hand-tuned synthesized
   sound instead — everything else is a genuine recording.
   Icons are hand-drawn SVG (not emoji) so every instrument looks distinct —
   no more identical drum icons or a piano standing in for a xylophone.
   ========================================================================== */

(function () {
  var SECTION_COLOR = { "Strings": "#5b8cff", "Woodwinds": "#7ed957", "Brass": "#ffab3d", "Percussion": "#ff5da2" };
  var SECTION_ICON_KEY = { "Strings": "Violin", "Woodwinds": "Flute", "Brass": "Trumpet", "Percussion": "Xylophone" };

  // Instruments with a real Philharmonia Orchestra recording under audio/instruments/.
  var SAMPLE_FILE = {
    "Violin": "violin", "Viola": "viola", "Cello": "cello", "Double Bass": "double-bass",
    "Flute": "flute", "Clarinet": "clarinet", "Oboe": "oboe", "Bassoon": "bassoon", "Saxophone": "saxophone",
    "Trumpet": "trumpet", "French Horn": "french-horn", "Trombone": "trombone", "Tuba": "tuba",
    "Snare Drum": "snare-drum", "Bass Drum": "bass-drum", "Cymbals": "cymbals"
  };

  // The 3 instruments Philharmonia doesn't offer get a hand-tuned synth voice.
  var SYNTH_PITCH = { "Harp": "Eb4", "Timpani": "F2", "Xylophone": "C6" };

  function synthPlay(name) {
    var freq = Sound.noteFreq(SYNTH_PITCH[name]);
    var t = Sound.now() + 0.02;
    if (name === "Harp") {
      // A plucked-string feel: fundamental + a bright, fast-decaying harmonic.
      Sound.tone(freq, t, 1.1, "triangle", 0.32);
      Sound.tone(freq * 2, t, 0.18, "sine", 0.14);
      Sound.tone(freq * 3, t, 0.09, "sine", 0.07);
    } else if (name === "Timpani") {
      // A low resonant body plus a soft pitched thump on top.
      Sound.tone(freq, t, 0.9, "sine", 0.4);
      Sound.tone(freq / 2, t, 0.7, "sine", 0.22);
    } else if (name === "Xylophone") {
      // A bright wooden click (mallet knock) plus a very short-decaying tone.
      Sound.tone(freq * 2, t, 0.05, "square", 0.16);
      Sound.tone(freq, t, 0.28, "triangle", 0.34);
    }
  }

  function render(container, h) {
    var el = h.el;
    container.appendChild(h.pageHead("🎻", "Instruments of the Orchestra",
      "Tap an instrument to hear a real recording and learn a fun fact."));

    var readout = el("div.note-readout", { html: "Tap any instrument to begin! 🎶" });
    container.appendChild(el("div.card", null, readout));

    // Prefetch every real sample in the background so the first tap plays instantly.
    Object.keys(SAMPLE_FILE).forEach(function (name) {
      Sound.loadBuffer("audio/instruments/" + SAMPLE_FILE[name] + ".mp3").catch(function () {});
    });

    DATA.instrumentSections.forEach(function (section) {
      var list = DATA.instruments.filter(function (i) { return i.section === section; });
      container.appendChild(el("div.orch-section-head", { style: "--sc:" + SECTION_COLOR[section] },
        el("span.orch-section-emoji", { html: iconSVG(SECTION_ICON_KEY[section], "#fff") }),
        el("h3", { text: section })
      ));
      var grid = el("div.orch-grid");
      list.forEach(function (inst) {
        var card = el("button.orch-card", { style: "--sc:" + SECTION_COLOR[section], onclick: function () { play(inst, readout, card); } },
          el("span.orch-icon", { html: iconSVG(inst.name) }),
          el("span.orch-name", { text: inst.name })
        );
        grid.appendChild(card);
      });
      container.appendChild(grid);
    });

    container.appendChild(el("p.orch-credit", {
      html: "🎵 Real instrument recordings courtesy of the <a href=\"https://philharmonia.co.uk/resources/sound-samples/\" target=\"_blank\" rel=\"noopener noreferrer\">Philharmonia Orchestra</a> sound sample library (CC BY-SA)."
    }));
  }

  function play(inst, readout, card) {
    Sound.unlock();
    var sampleName = SAMPLE_FILE[inst.name];
    if (sampleName) {
      Sound.loadBuffer("audio/instruments/" + sampleName + ".mp3")
        .then(function (buf) { Sound.playBuffer(buf); })
        .catch(function () {});
    } else {
      synthPlay(inst.name);
    }
    card.classList.remove("flash");
    void card.offsetWidth;
    card.classList.add("flash");
    readout.innerHTML = "<b>" + inst.name + "</b> <small style='display:block'>" + inst.blurb + "</small>" +
      "<small style='display:block;color:var(--ink-soft);margin-top:4px'>💡 " + inst.fact + "</small>";
  }

  // ---- Hand-drawn instrument icons (SVG, not emoji) ------------------------
  // Every instrument gets its own distinct silhouette so nothing looks like a
  // duplicate. `c` lets a caller recolor an icon (used for the white section
  // header badges); each icon otherwise ships with its own natural colors.
  function iconSVG(name, c) {
    var body = ICON_BODY[name];
    if (!body) return "";
    return '<svg viewBox="' + ICON_VIEWBOX[name] + '" class="orch-svg">' + (c ? recolor(body, c) : body) + '</svg>';
  }
  function recolor(svgBody, c) {
    return svgBody.replace(/#(?:5b8cff|7ed957|ffab3d|ff5da2|a9702a|d9a441|d98b1e|c96b3a|8a5a1e|2b2140|a9832a)\b/g, c);
  }

  var ICON_VIEWBOX = {
    "Violin": "0 0 36 90", "Viola": "0 0 40 100", "Cello": "0 0 48 132", "Double Bass": "0 0 52 142", "Harp": "0 0 34 122",
    "Flute": "0 0 90 32", "Clarinet": "0 0 40 98", "Oboe": "0 0 34 90", "Bassoon": "0 0 38 128", "Saxophone": "0 0 52 130",
    "Trumpet": "0 0 88 34", "French Horn": "0 0 90 100", "Trombone": "0 0 76 40", "Tuba": "0 0 140 120",
    "Timpani": "0 0 90 108", "Snare Drum": "0 0 76 66", "Bass Drum": "0 0 150 135", "Cymbals": "0 0 96 70", "Xylophone": "0 0 100 96"
  };

  var ICON_BODY = {
    Violin:
      '<line x1="18" y1="0" x2="18" y2="20" stroke="#5b8cff" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="12" cy="4" r="3" fill="#5b8cff"/><circle cx="24" cy="4" r="3" fill="#5b8cff"/>' +
      '<path d="M18,18 C8,18 4,26 6,34 C7,39 11,40 11,45 C11,50 4,53 4,64 C4,78 12,86 18,86 C24,86 32,78 32,64 C32,53 25,50 25,45 C25,40 29,39 30,34 C32,26 28,18 18,18 Z" fill="#5b8cff"/>' +
      '<line x1="2" y1="30" x2="34" y2="70" stroke="#2b2140" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>',

    Viola:
      '<line x1="20" y1="0" x2="20" y2="22" stroke="#5b8cff" stroke-width="4.5" stroke-linecap="round"/>' +
      '<circle cx="13" cy="4" r="3.3" fill="#5b8cff"/><circle cx="27" cy="4" r="3.3" fill="#5b8cff"/>' +
      '<path d="M20,20 C9,20 4,29 6,38 C7,43 12,44 12,50 C12,56 4,59 4,71 C4,87 13,96 20,96 C27,96 36,87 36,71 C36,59 28,56 28,50 C28,44 33,43 34,38 C36,29 31,20 20,20 Z" fill="#5b8cff"/>',

    Cello:
      '<line x1="24" y1="0" x2="24" y2="26" stroke="#5b8cff" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="16" cy="4" r="3.8" fill="#5b8cff"/><circle cx="32" cy="4" r="3.8" fill="#5b8cff"/>' +
      '<path d="M24,24 C10,24 4,35 7,46 C8,52 14,53 14,60 C14,67 4,71 4,85 C4,104 15,114 24,114 C33,114 44,104 44,85 C44,71 34,67 34,60 C34,53 40,52 41,46 C44,35 38,24 24,24 Z" fill="#5b8cff"/>' +
      '<line x1="24" y1="114" x2="24" y2="130" stroke="#5b8cff" stroke-width="3" stroke-linecap="round"/>',

    "Double Bass":
      '<line x1="26" y1="0" x2="26" y2="26" stroke="#5b8cff" stroke-width="5.5" stroke-linecap="round"/>' +
      '<circle cx="17" cy="4" r="4" fill="#5b8cff"/><circle cx="35" cy="4" r="4" fill="#5b8cff"/>' +
      '<path d="M26,24 L10,38 C6,42 6,48 9,52 C11,56 16,56 16,64 C16,72 4,76 4,92 C4,112 16,124 26,124 C36,124 48,112 48,92 C48,76 36,72 36,64 C36,56 41,56 43,52 C46,48 46,42 42,38 Z" fill="#5b8cff"/>' +
      '<line x1="26" y1="124" x2="26" y2="140" stroke="#5b8cff" stroke-width="3.3" stroke-linecap="round"/>',

    Harp:
      '<path d="M4,0 C24,4 30,20 30,40 L30,120 L14,120 C10,90 4,60 4,0 Z" fill="none" stroke="#5b8cff" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<line x1="10" y1="18" x2="24" y2="16" stroke="#5b8cff" stroke-width="2"/>' +
      '<line x1="9" y1="34" x2="25" y2="32" stroke="#5b8cff" stroke-width="2"/>' +
      '<line x1="8" y1="50" x2="26" y2="48" stroke="#5b8cff" stroke-width="2"/>' +
      '<line x1="8" y1="66" x2="26" y2="64" stroke="#5b8cff" stroke-width="2"/>' +
      '<line x1="8" y1="82" x2="25" y2="80" stroke="#5b8cff" stroke-width="2"/>' +
      '<line x1="9" y1="98" x2="24" y2="96" stroke="#5b8cff" stroke-width="2"/>',

    Flute:
      '<rect x="0" y="10" width="90" height="12" rx="6" fill="#7ed957"/>' +
      '<circle cx="14" cy="16" r="3.5" fill="#fff"/>' +
      '<circle cx="34" cy="16" r="2.6" fill="#fff"/><circle cx="46" cy="16" r="2.6" fill="#fff"/><circle cx="58" cy="16" r="2.6" fill="#fff"/><circle cx="70" cy="16" r="2.6" fill="#fff"/>',

    Clarinet:
      '<path d="M14,0 L26,0 L26,10 L14,10 Z" fill="#2b2140"/>' +
      '<rect x="12" y="9" width="16" height="72" rx="3" fill="#2b2140"/>' +
      '<circle cx="20" cy="26" r="2.4" fill="#7ed957"/><circle cx="20" cy="38" r="2.4" fill="#7ed957"/><circle cx="20" cy="50" r="2.4" fill="#7ed957"/><circle cx="20" cy="62" r="2.4" fill="#7ed957"/>' +
      '<path d="M12,80 C10,92 14,98 20,98 C26,98 30,92 28,80 Z" fill="#2b2140"/>',

    Oboe:
      '<line x1="18" y1="0" x2="18" y2="10" stroke="#a9702a" stroke-width="3.4" stroke-linecap="round"/>' +
      '<line x1="24" y1="0" x2="24" y2="10" stroke="#a9702a" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M12,10 L30,10 L26,86 L16,86 Z" fill="#a9702a"/>' +
      '<circle cx="21" cy="28" r="2.2" fill="#7ed957"/><circle cx="21" cy="42" r="2.2" fill="#7ed957"/><circle cx="21" cy="56" r="2.2" fill="#7ed957"/><circle cx="21" cy="70" r="2.2" fill="#7ed957"/>',

    Bassoon:
      '<path d="M8,110 C6,60 6,10 14,4 C18,1 24,4 24,12 L24,60" fill="none" stroke="#a9702a" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M32,110 L32,20" fill="none" stroke="#a9702a" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M8,110 C8,120 12,124 20,124 C28,124 32,120 32,110" fill="none" stroke="#a9702a" stroke-width="13" stroke-linecap="round"/>' +
      '<line x1="24" y1="6" x2="34" y2="0" stroke="#8a5a1e" stroke-width="4" stroke-linecap="round"/>',

    Saxophone:
      '<path d="M20,0 L28,6" stroke="#d9a441" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M24,4 C40,10 46,30 40,55 C34,80 10,85 8,105 C6,120 16,128 28,122" fill="none" stroke="#d9a441" stroke-width="10" stroke-linecap="round"/>' +
      '<circle cx="30" cy="35" r="2.4" fill="#fff"/><circle cx="36" cy="48" r="2.4" fill="#fff"/><circle cx="33" cy="63" r="2.4" fill="#fff"/><circle cx="22" cy="78" r="2.4" fill="#fff"/>',

    Trumpet:
      '<rect x="0" y="14" width="60" height="10" rx="5" fill="#ffab3d"/>' +
      '<path d="M60,10 C78,10 84,16 84,20 C84,24 78,30 60,30 Z" fill="#ffab3d"/>' +
      '<rect x="16" y="2" width="7" height="14" rx="3" fill="#ffab3d"/><rect x="28" y="2" width="7" height="14" rx="3" fill="#ffab3d"/><rect x="40" y="2" width="7" height="14" rx="3" fill="#ffab3d"/>' +
      '<circle cx="19.5" cy="0" r="3.4" fill="#ffab3d"/><circle cx="31.5" cy="0" r="3.4" fill="#ffab3d"/><circle cx="43.5" cy="0" r="3.4" fill="#ffab3d"/>',

    "French Horn":
      '<g transform="translate(20,4)">' +
      '<circle cx="34" cy="34" r="30" fill="none" stroke="#ffab3d" stroke-width="9"/>' +
      '<circle cx="34" cy="34" r="15" fill="none" stroke="#ffab3d" stroke-width="7"/>' +
      '<path d="M8,50 C-4,58 -10,74 4,86 C14,95 30,90 30,78" fill="none" stroke="#ffab3d" stroke-width="9" stroke-linecap="round"/>' +
      '<path d="M4,86 C-2,92 -14,92 -18,84" fill="none" stroke="#ffab3d" stroke-width="9" stroke-linecap="round"/>' +
      '</g>',

    Trombone:
      '<rect x="0" y="10" width="40" height="8" rx="4" fill="#ffab3d"/>' +
      '<rect x="0" y="22" width="40" height="8" rx="4" fill="#ffab3d"/>' +
      '<rect x="34" y="6" width="8" height="26" rx="3" fill="#d98b1e"/>' +
      '<path d="M40,8 C60,8 68,14 68,19 C68,24 60,30 40,30 Z" fill="#ffab3d"/>',

    Tuba:
      '<g transform="translate(6,16)">' +
      '<circle cx="42" cy="52" r="38" fill="none" stroke="#ffab3d" stroke-width="16"/>' +
      '<path d="M62,20 C68,4 82,-8 96,0 C108,7 106,22 92,24 C80,26 70,18 66,26" fill="none" stroke="#ffab3d" stroke-width="16" stroke-linecap="round"/>' +
      '<path d="M92,0 C104,-6 118,-4 122,8 C126,18 116,26 104,20 Z" fill="#ffab3d"/>' +
      '<rect x="30" y="82" width="8" height="15" rx="3" fill="#d98b1e"/><rect x="42" y="84" width="8" height="15" rx="3" fill="#d98b1e"/><rect x="54" y="82" width="8" height="15" rx="3" fill="#d98b1e"/>' +
      '</g>',

    Timpani:
      '<path d="M8,30 C8,55 22,62 44,62 C66,62 80,55 80,30 L74,84 C74,96 60,102 44,102 C28,102 14,96 14,84 Z" fill="#c96b3a"/>' +
      '<ellipse cx="44" cy="30" rx="36" ry="14" fill="#f0e4d0" stroke="#2b2140" stroke-width="3"/>' +
      '<line x1="6" y1="88" x2="0" y2="100" stroke="#2b2140" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="82" y1="88" x2="88" y2="100" stroke="#2b2140" stroke-width="4" stroke-linecap="round"/>',

    "Snare Drum":
      '<rect x="0" y="20" width="76" height="30" rx="4" fill="#e8e3f0" stroke="#2b2140" stroke-width="3"/>' +
      '<line x1="4" y1="30" x2="72" y2="30" stroke="#a89fc2" stroke-width="1.6"/><line x1="4" y1="40" x2="72" y2="40" stroke="#a89fc2" stroke-width="1.6"/>' +
      '<ellipse cx="38" cy="20" rx="38" ry="8" fill="#fff" stroke="#2b2140" stroke-width="3"/>' +
      '<line x1="10" y1="0" x2="50" y2="26" stroke="#a9702a" stroke-width="4.5" stroke-linecap="round"/>' +
      '<line x1="60" y1="0" x2="24" y2="24" stroke="#a9702a" stroke-width="4.5" stroke-linecap="round"/>',

    "Bass Drum":
      '<g transform="translate(10,10)">' +
      '<rect x="10" y="30" width="70" height="90" rx="6" fill="#f7f3ea" stroke="#2b2140" stroke-width="4"/>' +
      '<rect x="10" y="30" width="70" height="16" rx="6" fill="#c96b3a"/><rect x="10" y="104" width="70" height="16" rx="6" fill="#c96b3a"/>' +
      '<line x1="10" y1="75" x2="80" y2="75" stroke="#e3ddef" stroke-width="3"/>' +
      '<circle cx="45" cy="75" r="22" fill="none" stroke="#d3cdbd" stroke-width="3"/>' +
      '<line x1="90" y1="20" x2="130" y2="52" stroke="#a9702a" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="134" cy="56" r="12" fill="#2b2140"/>' +
      '</g>',

    Cymbals:
      '<g transform="translate(6,4)">' +
      '<ellipse cx="28" cy="34" rx="34" ry="30" fill="#e8c560" stroke="#a9832a" stroke-width="2.6"/>' +
      '<ellipse cx="56" cy="34" rx="34" ry="30" fill="#f3d879" stroke="#a9832a" stroke-width="2.6" opacity="0.94"/>' +
      '<circle cx="28" cy="34" r="6" fill="#a9832a"/><circle cx="56" cy="34" r="6" fill="#a9832a"/>' +
      '</g>',

    Xylophone:
      '<g transform="translate(2,2)">' +
      '<rect x="0" y="0" width="16" height="90" rx="4" fill="#ff5da2"/>' +
      '<rect x="20" y="8" width="16" height="74" rx="4" fill="#ffab3d"/>' +
      '<rect x="40" y="16" width="16" height="60" rx="4" fill="#ffd23f"/>' +
      '<rect x="60" y="24" width="16" height="48" rx="4" fill="#7ed957"/>' +
      '<rect x="80" y="32" width="16" height="36" rx="4" fill="#38bdf8"/>' +
      '</g>'
  };

  App.register({
    id: "orchestra",
    title: "Instruments of the Orchestra",
    emoji: "🎻",
    desc: "Strings, woodwinds, brass & percussion, grouped by section.",
    color: "tile--mint",
    render: render
  });
})();
