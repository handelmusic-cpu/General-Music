/* ==========================================================================
   library.js — searchable library of public-domain songs & rhymes, each
   paired with a classroom game. Filter by category & grade band, or search.
   ========================================================================== */

(function () {
  var CAT_COLORS = {
    "Patriotic": "var(--blue)",
    "Folk Song": "var(--lime)",
    "Nursery Rhyme": "var(--pink)",
    "Singing Game": "var(--purple)",
    "Seasonal": "var(--orange)"
  };

  function render(container, h) {
    var el = h.el;
    var state = { q: "", cat: "All", grade: "All" };

    container.appendChild(h.pageHead("🎵", "Song & Game Library",
      "Public-domain songs, rhymes & a game to play with each one."));

    // Search bar
    var input = el("input", {
      type: "search",
      placeholder: "Search songs, rhymes, or skills…",
      "aria-label": "Search songs",
      oninput: function () { state.q = input.value.toLowerCase(); draw(); }
    });
    var searchBar = el("div.search-bar", null, el("span.mag", { text: "🔍" }), input);
    container.appendChild(searchBar);

    // Filter chips: categories
    var catRow = el("div.filter-row");
    ["All"].concat(DATA.categories).forEach(function (c) {
      catRow.appendChild(chip(c, function () { state.cat = c; syncChips(catRow, c); draw(); }, c === "All"));
    });
    container.appendChild(catRow);

    // Filter chips: grades
    var gradeRow = el("div.filter-row");
    ["All"].concat(DATA.grades).forEach(function (g) {
      gradeRow.appendChild(chip(g, function () { state.grade = g; syncChips(gradeRow, g); draw(); }, g === "All"));
    });
    container.appendChild(gradeRow);

    var grid = el("div.song-grid");
    container.appendChild(grid);

    function chip(label, onclick, active) {
      var b = el("button.pill", { text: label, onclick: onclick });
      if (active) b.classList.add("is-active");
      b.dataset.label = label;
      return b;
    }
    function syncChips(row, label) {
      Array.prototype.forEach.call(row.children, function (b) {
        b.classList.toggle("is-active", b.dataset.label === label);
      });
    }

    function matches(song) {
      if (state.cat !== "All" && song.category !== state.cat) return false;
      if (state.grade !== "All" && song.grades.indexOf(state.grade) === -1) return false;
      if (state.q) {
        var hay = (song.title + " " + song.category + " " + song.focus + " " + song.game).toLowerCase();
        if (hay.indexOf(state.q) === -1) return false;
      }
      return true;
    }

    function draw() {
      grid.innerHTML = "";
      var list = DATA.songs.filter(matches);
      if (!list.length) {
        grid.appendChild(el("div.empty-note", { text: "No songs match yet — try clearing a filter. 🎶" }));
        return;
      }
      list.forEach(function (song) {
        var card = el("div.song-card");
        card.style.borderTopColor = CAT_COLORS[song.category] || "var(--sky)";
        card.appendChild(el("h3", { text: song.title }));

        var tags = el("div.tags", null,
          el("span.tag.tag--cat", { text: song.category }),
          el("span.tag.tag--meter", { text: song.meter }),
          el("span.tag.tag--grade", { text: song.grades.join(" · ") })
        );
        card.appendChild(tags);
        card.appendChild(el("div.focus", { html: "🎯 <b>Skills:</b> " + escapeHtml(song.focus) }));
        card.appendChild(el("div.game", { html: "<b>Play this:</b> " + escapeHtml(song.game) }));

        // Listen row: synthesized tune (offline) + a link to find a recording.
        var actions = el("div.song-actions");
        var mel = DATA.melodies[song.title];
        if (mel) {
          var tuneBtn = el("button.mini-btn.mini-btn--play", { html: "🔊 Play tune", onclick: function () {
            if (tuneBtn.disabled) return;
            var secs = Sound.playMelody(mel.notes, mel.tempo);
            tuneBtn.disabled = true;
            tuneBtn.style.opacity = "0.55";
            var was = tuneBtn.innerHTML;
            tuneBtn.innerHTML = "🎶 Playing…";
            setTimeout(function () {
              tuneBtn.disabled = false; tuneBtn.style.opacity = "1"; tuneBtn.innerHTML = was;
            }, (secs + 0.3) * 1000);
          }});
          actions.appendChild(tuneBtn);
        }
        var url = "https://www.youtube.com/results?search_query=" +
          encodeURIComponent(song.title + " song for kids");
        actions.appendChild(el("a.mini-btn.mini-btn--link", {
          href: url, target: "_blank", rel: "noopener noreferrer", html: "🎬 Find a recording"
        }));
        card.appendChild(actions);

        grid.appendChild(card);
      });
    }

    draw();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  App.register({
    id: "library",
    title: "Song & Game Library",
    emoji: "🎵",
    desc: "Public-domain songs & rhymes with a game for each.",
    color: "tile--pink",
    render: render
  });
})();
