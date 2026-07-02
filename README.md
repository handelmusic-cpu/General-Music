# 🎵 Music Playground

A bright, tap-friendly web app that helps elementary music teachers play games with
public-domain and patriotic songs & rhymes — plus interactive tools for beat, staff,
and clef basics. Built for iPads, Chromebooks, and the classroom projector. No login,
no installs, works offline.

## Activities
- **🎵 Song & Game Library** — searchable public-domain songs & rhymes, each with a ready-to-play classroom game, meter, grade band, and skills. Filter by category or grade.
- **🍎 Beat Boxes** — tap fruit/veggie boxes to build rhythms (quarter, eighths, sixteenths, triplet, rest); press Play and it claps along. Adjustable beats and tempo. Great for beat *and* beat-division.
- **🎼 Staff Basics** — treble & bass staff. Tap any line or space to drop a note, hear the pitch, and learn its name, with the classic mnemonics.
- **✏️ Clef Drawing** — trace treble & bass clefs over a faint guide with finger or stylus. Color swatches, brush size, undo, clear.
- **🥁 Steady Beat** — a bouncing-dot metronome and tap-along game that cheers when kids land on the beat.

## How to open it
**On this Mac:** double-click `index.html` — it opens in your browser. That's it.

**For sound:** the first tap on any button turns the sound on (browsers require a tap
before playing audio). Everything is silent, offline-friendly synthesized sound — no
downloads.

## Putting it on classroom iPads / Chromebooks
Because it's just files, you can share it several easy ways:
1. **Google Sites / Google Drive** — upload the folder and share the link.
2. **Netlify Drop** (free): go to app.netlify.com/drop and drag this whole folder in — you get a shareable web link in seconds.
3. **Your school's web server** — copy the folder into the web root.
4. **Add to Home Screen** — on an iPad, open the link in Safari → Share → "Add to Home Screen" for an app-like icon.

## Adding your own songs & games
Open `js/data.js` and copy one of the entries in the `songs` list. Change the title,
`category`, `meter`, `grades`, `focus`, and `game` text. Save and refresh — no coding
needed. The categories and grade filters update automatically.

To add a brand-new *activity* (like Solfège hand signs or a note-name quiz), copy any
file in `js/` such as `js/steadybeat.js`, and it will register a new colorful tile on
the home screen by itself.

## Files
```
index.html          the page shell (loads everything)
css/styles.css      all the bright styling
js/data.js          song/rhyme + game library and rhythm definitions  ← edit content here
js/sound.js         synthesized metronome clicks & note pitches
js/app.js           home screen + simple navigation
js/library.js       Song & Game Library
js/beatboxes.js     Beat Boxes
js/staff.js         Staff Basics
js/clefdraw.js      Clef Drawing
js/steadybeat.js    Steady Beat
```

Everything is public domain or original, so you're free to use and share it with students.
