/* ==========================================================================
   bells.js — a colored xylophone / bell set with a "follow the colors"
   play-along. Tap the bars to play freely, or pick a song: the app shows the
   tune as a row of colored dots and lights up each bar in time so kids can
   play along, Boomwhacker-style.
   ========================================================================== */

(function () {
  var BARS = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
  function letter(note) { return note.charAt(0); }

  function render(container, h) {
    var el = h.el;
    var state = { song: null, playing: false, timers: [] };

    container.appendChild(h.pageHead("🔔", "Bells",
      "Tap the colored bars to play. Or pick a song and follow the colors!"));

    // ---- The bell bars (xylophone: lower notes are longer) --------------
    var barsWrap = el("div.bells-wrap");
    var bars = {};
    BARS.forEach(function (note, i) {
      var color = DATA.noteColors[letter(note)] || "#ccc";
      var heightPct = 100 - i * 6;   // low bars taller, high bars shorter
      var bar = el("button.bell-bar", { style: "--bc:" + color + ";height:" + heightPct + "%",
        onclick: function () { Sound.unlock(); playBar(note); } },
        el("span.bell-label", { text: letter(note) })
      );
      bar.dataset.note = note;
      barsWrap.appendChild(bar);
      bars[note] = bar;
    });
    container.appendChild(el("div.card", null, el("div.bells-stage", null, barsWrap)));

    // ---- Song picker -----------------------------------------------------
    var songRow = el("div.filter-row");
    DATA.bellSongs.forEach(function (song) {
      var p = el("button.pill", { text: song.name, onclick: function () { selectSong(song, p); } });
      p.dataset.label = song.name;
      songRow.appendChild(p);
    });

    var dotsRow = el("div.bell-dots");
    var playSongBtn = el("button.btn.btn--play", { html: "▶︎ Play it", style: "display:none", onclick: playSong });

    container.appendChild(el("div.card", null,
      el("div.hint", { text: "Follow the colors — pick a song:" }),
      songRow,
      el("div.spacer-sm"),
      dotsRow,
      el("div.control-row", { style: "justify-content:center" }, playSongBtn)
    ));

    container.appendChild(el("div.card", null,
      el("p.hint", { text: "Each colored dot is a bar to tap. Press \"Play it\" and the app will light the bars in time so you can play along." })
    ));

    // ---------------------------------------------------------------------
    function playBar(note, when) {
      Sound.tone(Sound.noteFreq(note), when || null, 0.7, "sine", 0.32);
      flash(note);
    }

    function flash(note) {
      var bar = bars[note];
      if (!bar) return;
      bar.classList.remove("ring");
      void bar.offsetWidth;
      bar.classList.add("ring");
      setTimeout(function () { bar.classList.remove("ring"); }, 240);
    }

    function selectSong(song, pill) {
      stopSong();
      state.song = song;
      Array.prototype.forEach.call(songRow.children, function (b) {
        b.classList.toggle("is-active", b === pill);
      });
      drawDots();
      playSongBtn.style.display = "";
    }

    function drawDots() {
      dotsRow.innerHTML = "";
      state.song.notes.forEach(function (n) {
        var note = n[0];
        var color = DATA.noteColors[letter(note)] || "#ccc";
        dotsRow.appendChild(el("span.bell-dot", { style: "background:" + color, text: letter(note) }));
      });
    }

    function playSong() {
      if (!state.song) return;
      Sound.unlock();
      stopSong();
      state.playing = true;
      playSongBtn.innerHTML = "🎶 Playing…";
      var beat = 60 / state.song.tempo;
      var t = Sound.now() + 0.15;
      var dots = dotsRow.querySelectorAll(".bell-dot");
      var elapsed = 0.15;
      state.song.notes.forEach(function (n, i) {
        var note = n[0], dur = n[1] * beat;
        playScheduled(note, t);
        // schedule the visual highlight on the wall clock
        (function (i) {
          state.timers.push(setTimeout(function () {
            flash(note);
            Array.prototype.forEach.call(dots, function (d, k) { d.classList.toggle("now", k === i); });
          }, elapsed * 1000));
        })(i);
        t += dur; elapsed += dur;
      });
      state.timers.push(setTimeout(function () {
        stopSong();
      }, elapsed * 1000 + 200));
    }

    function playScheduled(note, when) {
      Sound.tone(Sound.noteFreq(note), when, 0.7, "sine", 0.32);
    }

    function stopSong() {
      state.playing = false;
      state.timers.forEach(clearTimeout);
      state.timers = [];
      playSongBtn.innerHTML = "▶︎ Play it";
      if (dotsRow) {
        var dots = dotsRow.querySelectorAll(".bell-dot.now");
        Array.prototype.forEach.call(dots, function (d) { d.classList.remove("now"); });
      }
    }

    return stopSong;
  }

  App.register({
    id: "bells",
    title: "Bells",
    emoji: "🔔",
    desc: "A colored xylophone with a follow-the-colors play-along.",
    color: "tile--aqua",
    render: render
  });
})();
