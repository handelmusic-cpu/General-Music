/* ==========================================================================
   data.js — the shared content library.
   Everything here is public domain (traditional / patriotic) so teachers can
   use it freely. Each entry pairs a song or rhyme with a ready-to-play game.
   Add more by copying an object into the SONGS array — no code changes needed.
   ========================================================================== */

window.DATA = {
  categories: ["Patriotic", "Folk Song", "Nursery Rhyme", "Singing Game", "Seasonal"],

  /* Boomwhacker-style note colors (a clean rainbow, C→B) shared by the Bells
     and Song Maker so color becomes a consistent visual language for pitch. */
  noteColors: {
    C: "#ff4d4d", D: "#ff9a3d", E: "#ffd633", F: "#5ecb5e",
    G: "#3b9bff", A: "#a06bff", B: "#ff6bd0"
  },

  /* Simple, one-octave (C–C), no-sharps tunes for the Bells play-along.
     Every note fits the 8 colored bars, so kids can play by following colors. */
  bellSongs: [
    { name: "Hot Cross Buns", tempo: 96, notes: [
      ["E4",1],["D4",1],["C4",2],["E4",1],["D4",1],["C4",2],
      ["C4",.5],["C4",.5],["C4",.5],["C4",.5],["D4",.5],["D4",.5],["D4",.5],["D4",.5],
      ["E4",1],["D4",1],["C4",2] ] },
    { name: "Mary Had a Little Lamb", tempo: 104, notes: [
      ["E4",1],["D4",1],["C4",1],["D4",1],["E4",1],["E4",1],["E4",2],
      ["D4",1],["D4",1],["D4",2],["E4",1],["G4",1],["G4",2],
      ["E4",1],["D4",1],["C4",1],["D4",1],["E4",1],["E4",1],["E4",1],["E4",1],
      ["D4",1],["D4",1],["E4",1],["D4",1],["C4",2] ] },
    { name: "Twinkle, Twinkle", tempo: 108, notes: [
      ["C4",1],["C4",1],["G4",1],["G4",1],["A4",1],["A4",1],["G4",2],
      ["F4",1],["F4",1],["E4",1],["E4",1],["D4",1],["D4",1],["C4",2] ] },
    { name: "Ode to Joy", tempo: 112, notes: [
      ["E4",1],["E4",1],["F4",1],["G4",1],["G4",1],["F4",1],["E4",1],["D4",1],
      ["C4",1],["C4",1],["D4",1],["E4",1],["E4",1.5],["D4",.5],["D4",2] ] },
    { name: "Old MacDonald", tempo: 104, notes: [
      ["G4",1],["G4",1],["G4",1],["D4",1],["E4",1],["E4",1],["D4",2],
      ["B4",1],["B4",1],["A4",1],["A4",1],["G4",2] ] }
  ],

  // grade bands used for the filter chips
  grades: ["Pre-K–K", "1–2", "3–4", "5–6", "Middle"],

  songs: [
    {
      title: "The Star-Spangled Banner",
      category: "Patriotic",
      meter: "3/4",
      grades: ["5–6", "Middle"],
      focus: "Wide melodic range, dotted rhythms, dynamics",
      game: "Rocket Launch dynamics: students crouch small on low notes and rise/stretch tall as the melody climbs to \"the rocket's red glare.\" Great for hearing pitch direction and phrasing."
    },
    {
      title: "Yankee Doodle",
      category: "Patriotic",
      meter: "2/4",
      grades: ["Pre-K–K", "1–2", "3–4"],
      focus: "Steady beat, quarter & eighth notes",
      game: "Feather Pass: pass a feather (or beanbag) around the circle on each strong beat. On \"stuck a feather in his cap\" whoever holds it does a silly pose. Reinforces macro beat."
    },
    {
      title: "You're a Grand Old Flag",
      category: "Patriotic",
      meter: "4/4",
      grades: ["3–4", "5–6"],
      focus: "Strong steady beat, march feel",
      game: "Flag Parade: march the beat around the room; on each phrase-end, change direction. Add rhythm sticks tapping the beat for a marching-band feel."
    },
    {
      title: "This Land Is Your Land",
      category: "Patriotic",
      meter: "4/4",
      grades: ["3–4", "5–6", "Middle"],
      focus: "Form (verse/refrain), pickup notes",
      game: "Map Journey: assign each verse a place (redwood forest, gulf stream). Groups create a frozen picture for their verse and reveal it when the refrain returns — teaches ABA-style form."
    },
    {
      title: "My Country, 'Tis of Thee",
      category: "Patriotic",
      meter: "3/4",
      grades: ["3–4", "5–6"],
      focus: "Triple meter, legato singing",
      game: "Scarf Waltz: wave scarves in big circles, one circle per measure (1-2-3). Feeling the down-up-up of triple meter with the whole body."
    },
    {
      title: "America the Beautiful",
      category: "Patriotic",
      meter: "4/4",
      grades: ["5–6", "Middle"],
      focus: "Phrasing, breath support, melodic contour",
      game: "Phrase Painting: each singer draws the shape of a phrase in the air (up for rising, down for falling). Compare drawings to discover the melody's mountains and valleys."
    },
    {
      title: "Hot Cross Buns",
      category: "Folk Song",
      meter: "4/4",
      grades: ["Pre-K–K", "1–2"],
      focus: "Three notes (mi-re-do), quarter/eighth rhythm",
      game: "Bakery Beat Boxes: build the tune in the Beat Boxes activity — two 'buns' (eighths) for \"one-a-penny\" and one 'bun' (quarter) for \"buns.\" Then play it on bells: B-A-G."
    },
    {
      title: "Rain, Rain, Go Away",
      category: "Nursery Rhyme",
      meter: "2/4",
      grades: ["Pre-K–K"],
      focus: "So-mi (two-note) singing, steady beat",
      game: "Sun & Cloud: half the class are clouds (crouch), half are suns (tall). Sing so-mi; on \"go away\" the clouds float to the edges and suns pop up. Intro to high/low."
    },
    {
      title: "Twinkle, Twinkle, Little Star",
      category: "Nursery Rhyme",
      meter: "4/4",
      grades: ["Pre-K–K", "1–2"],
      focus: "Melodic direction, steady beat, form",
      game: "Twinkle Freeze: sway the beat while singing; on the twinkly high part, wiggle fingers like stars. Freeze on the last note and hold the 'star pose.'"
    },
    {
      title: "Bee, Bee, Bumblebee",
      category: "Nursery Rhyme",
      meter: "2/4",
      grades: ["Pre-K–K", "1–2"],
      focus: "Steady beat, rhythm of words, keeping a pulse",
      game: "Bee Pass: pass the 'bee' around the circle on the beat. On the last word the bee 'stings' — that student becomes the new leader. Classic beat-passing game."
    },
    {
      title: "Engine, Engine Number Nine",
      category: "Nursery Rhyme",
      meter: "4/4",
      grades: ["Pre-K–K", "1–2", "3–4"],
      focus: "Steady beat, rhythm reading (ta / ti-ti)",
      game: "Train Line: form a train, chug the beat with feet. Clap the rhythm of the words with hands at the same time — layering macro beat (feet) and rhythm (hands)."
    },
    {
      title: "Cobbler, Cobbler, Mend My Shoe",
      category: "Nursery Rhyme",
      meter: "2/4",
      grades: ["Pre-K–K", "1–2"],
      focus: "Steady beat, partner tapping",
      game: "Shoe Repair: partners tap the beat on each other's shoes (or knees). On \"by half past two\" hold up two fingers. Builds partner coordination and pulse."
    },
    {
      title: "Old MacDonald Had a Farm",
      category: "Folk Song",
      meter: "4/4",
      grades: ["Pre-K–K", "1–2"],
      focus: "Form (call & response), animal timbres",
      game: "Barnyard Beat Boxes: pick an animal for each box and tap the beat 'oink-oink-moo-baa.' Explore timbre by choosing a classroom instrument to be each animal's voice."
    },
    {
      title: "The Wheels on the Bus",
      category: "Folk Song",
      meter: "4/4",
      grades: ["Pre-K–K"],
      focus: "Steady beat, tempo (fast/slow), motions",
      game: "Speed Bus: sing at different tempos using the Steady Beat tool — slow for a school zone, fast on the highway. Big arm circles keep the beat with 'round and round.'"
    },
    {
      title: "London Bridge Is Falling Down",
      category: "Singing Game",
      meter: "4/4",
      grades: ["Pre-K–K", "1–2"],
      focus: "Steady beat, singing game, phrase form",
      game: "The Bridge: two students form an arch; others walk the beat under it. The arch drops on \"my fair lady\" to gently 'catch' someone, who becomes part of the bridge."
    },
    {
      title: "Ring Around the Rosie",
      category: "Singing Game",
      meter: "6/8",
      grades: ["Pre-K–K"],
      focus: "Compound feel, circle game, steady beat",
      game: "Circle & Fall: hold hands, walk the circle on the beat, and everyone 'falls down' together on the last line. A first taste of the lilting 6/8 swing."
    },
    {
      title: "A Sailor Went to Sea",
      category: "Singing Game",
      meter: "4/4",
      grades: ["1–2", "3–4"],
      focus: "Steady beat, clapping patterns, coordination",
      game: "Partner Claps: build a hand-clap routine (own hands, partner's hands) that lands on 'sea-sea-sea.' Speed it up each round for a fun challenge."
    },
    {
      title: "Bow, Wow, Wow",
      category: "Singing Game",
      meter: "2/4",
      grades: ["Pre-K–K", "1–2"],
      focus: "Steady beat, partner mirroring, so-mi-la",
      game: "Puppy Partners: stamp the beat facing a partner; on 'bow-wow-wow' point at each other three times, then spin to find a new partner for the next round."
    },
    {
      title: "John Jacob Jingleheimer Schmidt",
      category: "Folk Song",
      meter: "4/4",
      grades: ["1–2", "3–4"],
      focus: "Dynamics (loud/soft), form",
      game: "Volume Dial: use the whole word 'schmidt!' to practice dynamics — sing each repetition softer and softer, then a giant loud shout at the end."
    },
    {
      title: "Alphabet Song (ABC)",
      category: "Nursery Rhyme",
      meter: "4/4",
      grades: ["Pre-K–K"],
      focus: "Melody (same as Twinkle), phrase length",
      game: "Same Tune Detective: sing ABC, then Twinkle — students discover they share a melody! Great intro to how one tune can carry different words."
    },
    {
      title: "Pease Porridge Hot",
      category: "Nursery Rhyme",
      meter: "4/4",
      grades: ["1–2", "3–4"],
      focus: "Rests, clapping patterns, rhythm reading",
      game: "Clap & Rest: partner clap game where the rest ('hot [rest]') is a silent knee-pat. Perfect for feeling and reading the quarter rest."
    },
    {
      title: "Frère Jacques (Are You Sleeping)",
      category: "Folk Song",
      meter: "4/4",
      grades: ["1–2", "3–4", "5–6"],
      focus: "Rounds / canon, phrase form",
      game: "Sleepy Rounds: split into 2–4 groups and sing as a round. Each group 'wakes up' (stands) when they start and 'sleeps' (sits) when they finish. Visualizes canon entries."
    },
    {
      title: "Row, Row, Row Your Boat",
      category: "Folk Song",
      meter: "6/8",
      grades: ["1–2", "3–4"],
      focus: "Rounds, compound meter, steady beat",
      game: "Rowing Rounds: partners sit facing each other and 'row' arms on the beat. Then perform as a round — the rowing keeps everyone locked to the pulse."
    },
    {
      title: "Head, Shoulders, Knees and Toes",
      category: "Folk Song",
      meter: "4/4",
      grades: ["Pre-K–K"],
      focus: "Tempo (accelerando), steady beat, body map",
      game: "Faster & Faster: use the Steady Beat tool to speed up each round. Touch each body part on the beat — a favorite for tempo and coordination."
    },
    {
      title: "This Old Man",
      category: "Folk Song",
      meter: "2/4",
      grades: ["Pre-K–K", "1–2"],
      focus: "Counting, steady beat, form",
      game: "Knick-Knack Numbers: hold up the counting number each verse and pat the beat on 'knick-knack paddy-whack.' Ties number sense to musical counting."
    },
    {
      title: "Skip to My Lou",
      category: "Singing Game",
      meter: "2/4",
      grades: ["1–2", "3–4"],
      focus: "Steady beat, partner game, phrase form",
      game: "Skipping Circle: partners skip the beat around a circle; on 'skip to my Lou' find a new partner. High-energy way to internalize a strong 2/4 pulse."
    },
    {
      title: "Jingle Bells",
      category: "Seasonal",
      meter: "4/4",
      grades: ["Pre-K–K", "1–2", "3–4"],
      focus: "Steady beat, repeated rhythm, timbre (bells)",
      game: "Sleigh Ride: shake jingle bells on the beat during the verse, then on every 'jingle' word in the chorus. Explore timbre by adding sticks or shakers."
    },
    {
      title: "The Farmer in the Dell",
      category: "Singing Game",
      meter: "6/8",
      grades: ["Pre-K–K", "1–2"],
      focus: "Compound meter, circle game, phrase form",
      game: "Pick a Friend: circle walks the beat; the 'farmer' in the middle chooses the next person each verse. Gentle 6/8 lilt with a clear phrase structure."
    },
    {
      title: "Ten in the Bed",
      category: "Folk Song",
      meter: "4/4",
      grades: ["Pre-K–K", "1–2"],
      focus: "Counting down, steady beat, subtraction",
      game: "Roll Over: ten students in a 'bed'; one rolls out each verse. Everyone pats the beat while counting down — links math and steady beat."
    }
  ],

  /* Synthesized melodies (offline) keyed by song title. Each note is
     [noteName, beats]; use "rest" for silence. Songs listed here get a
     "Play tune" button in the library. Add more by copying an entry. */
  melodies: {
    "Hot Cross Buns": { tempo: 100, notes: [
      ["E4",1],["D4",1],["C4",2],["E4",1],["D4",1],["C4",2],
      ["C4",.5],["C4",.5],["C4",.5],["C4",.5],["D4",.5],["D4",.5],["D4",.5],["D4",.5],
      ["E4",1],["D4",1],["C4",2]
    ]},
    "Twinkle, Twinkle, Little Star": { tempo: 108, notes: [
      ["C4",1],["C4",1],["G4",1],["G4",1],["A4",1],["A4",1],["G4",2],
      ["F4",1],["F4",1],["E4",1],["E4",1],["D4",1],["D4",1],["C4",2],
      ["G4",1],["G4",1],["F4",1],["F4",1],["E4",1],["E4",1],["D4",2],
      ["G4",1],["G4",1],["F4",1],["F4",1],["E4",1],["E4",1],["D4",2],
      ["C4",1],["C4",1],["G4",1],["G4",1],["A4",1],["A4",1],["G4",2],
      ["F4",1],["F4",1],["E4",1],["E4",1],["D4",1],["D4",1],["C4",2]
    ]},
    "Alphabet Song (ABC)": { tempo: 108, notes: [
      ["C4",1],["C4",1],["G4",1],["G4",1],["A4",1],["A4",1],["G4",2],
      ["F4",1],["F4",1],["E4",1],["E4",1],["D4",1],["D4",1],["C4",2],
      ["G4",1],["G4",1],["F4",1],["F4",1],["E4",1],["E4",1],["D4",2],
      ["G4",1],["G4",1],["F4",1],["F4",1],["E4",1],["E4",1],["D4",2],
      ["C4",1],["C4",1],["G4",1],["G4",1],["A4",1],["A4",1],["G4",2],
      ["F4",1],["F4",1],["E4",1],["E4",1],["D4",1],["D4",1],["C4",2]
    ]},
    "Yankee Doodle": { tempo: 124, notes: [
      ["C4",.5],["C4",.5],["D4",.5],["E4",.5],["C4",.5],["E4",.5],["D4",1],
      ["C4",.5],["C4",.5],["D4",.5],["E4",.5],["C4",1],["B3",1],
      ["C4",.5],["C4",.5],["D4",.5],["E4",.5],["F4",.5],["E4",.5],["D4",.5],["C4",.5],
      ["B3",.5],["G3",.5],["A3",.5],["B3",.5],["C4",1],["C4",1]
    ]},
    "Old MacDonald Had a Farm": { tempo: 112, notes: [
      ["G4",1],["G4",1],["G4",1],["D4",1],["E4",1],["E4",1],["D4",2],
      ["B4",1],["B4",1],["A4",1],["A4",1],["G4",2],["D4",1],
      ["G4",1],["G4",1],["G4",1],["D4",1],["E4",1],["E4",1],["D4",2],
      ["B4",1],["B4",1],["A4",1],["A4",1],["G4",2]
    ]},
    "Jingle Bells": { tempo: 120, notes: [
      ["E4",1],["E4",1],["E4",2],["E4",1],["E4",1],["E4",2],
      ["E4",1],["G4",1],["C4",1],["D4",1],["E4",4]
    ]},
    "Rain, Rain, Go Away": { tempo: 104, notes: [
      ["G4",1],["E4",1],["G4",1],["E4",1],["G4",1],["G4",1],["E4",2],
      ["A4",1],["A4",1],["G4",1],["G4",1],["E4",1],["E4",1],["G4",2]
    ]},
    "This Old Man": { tempo: 116, notes: [
      ["G4",1],["E4",1],["G4",2],["G4",1],["E4",1],["G4",2],
      ["A4",1],["G4",1],["F4",1],["E4",1],["D4",1],["C4",1],
      ["E4",1],["G4",1],["E4",1],["C4",2]
    ]}
  },

  /* Rhythm 'flavors' shared by Beat Boxes. Each is one beat's worth of sound.
     Fruit/veggie emoji make the subdivisions visual and colorful. */
  rhythms: [
    { id: "quarter", fruits: "🍐",       syllable: "ta",         hits: 1, name: "Quarter note (1 sound)" },
    { id: "eighths", fruits: "🍒🍒",     syllable: "ti-ti",      hits: 2, name: "Two eighths (2 sounds)" },
    { id: "sixteenths", fruits: "🍓🍓🍓🍓", syllable: "ti-ka-ti-ka", hits: 4, name: "Four sixteenths (4 sounds)" },
    { id: "triplet", fruits: "🍇🍇🍇",   syllable: "tri-o-la",   hits: 3, name: "Triplet (3 sounds)" },
    { id: "rest",    fruits: "🥕",        syllable: "sh (rest)",  hits: 0, name: "Rest (silent)" }
  ],

  /* Ukulele chords (standard GCEA re-entrant tuning). frets/fingers are given
     left-to-right as they appear on a real chord chart: G, C, E, A strings.
     "" = open string, finger numbers are 1=index 2=middle 3=ring 4=pinky. */
  ukuleleChords: [
    { name: "C",  frets: [0, 0, 0, 3], fingers: ["", "", "", "3"], tip: "The easiest first chord — just one finger!" },
    { name: "Am", frets: [2, 0, 0, 0], fingers: ["2", "", "", ""], tip: "One finger, right next to C." },
    { name: "F",  frets: [2, 0, 1, 0], fingers: ["2", "", "1", ""], tip: "Two fingers — sounds great with C and G7." },
    { name: "G7", frets: [0, 2, 1, 2], fingers: ["", "2", "1", "3"], tip: "Wants to resolve back home to C!" },
    { name: "G",  frets: [0, 2, 3, 2], fingers: ["", "1", "3", "2"], tip: "A little trickier — three fingers." },
    { name: "A7", frets: [0, 1, 0, 0], fingers: ["", "1", "", ""], tip: "One finger — pairs nicely with D7." },
    { name: "D7", frets: [2, 2, 2, 3], fingers: ["1", "2", "3", "4"], tip: "All four fingers in a row — a fun challenge!" },
    { name: "Em", frets: [0, 4, 3, 2], fingers: ["", "4", "3", "2"], tip: "A dreamy, mysterious minor sound." }
  ],

  /* Musical terms: dynamics, tempo, and expression. Each has a "demo" the
     app can play so kids hear, not just read, what the word means. */
  termCategories: ["Dynamics", "Tempo", "Expression"],
  terms: [
    { term: "Pianissimo", abbr: "pp", category: "Dynamics", meaning: "Very soft", demo: { type: "volume", peak: 0.05 } },
    { term: "Piano", abbr: "p", category: "Dynamics", meaning: "Soft", demo: { type: "volume", peak: 0.12 } },
    { term: "Mezzo Piano", abbr: "mp", category: "Dynamics", meaning: "Medium soft", demo: { type: "volume", peak: 0.19 } },
    { term: "Mezzo Forte", abbr: "mf", category: "Dynamics", meaning: "Medium loud", demo: { type: "volume", peak: 0.27 } },
    { term: "Forte", abbr: "f", category: "Dynamics", meaning: "Loud", demo: { type: "volume", peak: 0.38 } },
    { term: "Fortissimo", abbr: "ff", category: "Dynamics", meaning: "Very loud", demo: { type: "volume", peak: 0.52 } },
    { term: "Crescendo", abbr: "cresc.", category: "Dynamics", meaning: "Gradually getting louder", demo: { type: "cresc" } },
    { term: "Decrescendo", abbr: "decresc.", category: "Dynamics", meaning: "Gradually getting softer (also called diminuendo)", demo: { type: "decresc" } },

    { term: "Largo", abbr: "", category: "Tempo", meaning: "Very slow and broad", demo: { type: "tempo", bpm: 44 } },
    { term: "Adagio", abbr: "", category: "Tempo", meaning: "Slow, at ease", demo: { type: "tempo", bpm: 64 } },
    { term: "Andante", abbr: "", category: "Tempo", meaning: "A walking pace", demo: { type: "tempo", bpm: 92 } },
    { term: "Moderato", abbr: "", category: "Tempo", meaning: "A moderate, medium speed", demo: { type: "tempo", bpm: 112 } },
    { term: "Allegro", abbr: "", category: "Tempo", meaning: "Fast and lively", demo: { type: "tempo", bpm: 138 } },
    { term: "Presto", abbr: "", category: "Tempo", meaning: "Very fast", demo: { type: "tempo", bpm: 184 } },
    { term: "Ritardando", abbr: "rit.", category: "Tempo", meaning: "Gradually slowing down", demo: { type: "rit" } },
    { term: "Accelerando", abbr: "accel.", category: "Tempo", meaning: "Gradually speeding up", demo: { type: "accel" } },

    { term: "Legato", abbr: "", category: "Expression", meaning: "Smooth and connected, no gaps between notes", demo: { type: "legato" } },
    { term: "Staccato", abbr: "", category: "Expression", meaning: "Short and detached, with space between notes", demo: { type: "staccato" } },
    { term: "Accent", abbr: "", category: "Expression", meaning: "Give that one note extra punch", demo: { type: "accent" } },
    { term: "Fermata", abbr: "", category: "Expression", meaning: "Hold the note longer than its usual length", demo: { type: "fermata" } }
  ],

  /* Orchestra instruments, grouped by family/section. */
  instrumentSections: ["Strings", "Woodwinds", "Brass", "Percussion"],
  instruments: [
    { name: "Violin", section: "Strings",
      blurb: "The smallest and highest-voiced string instrument, played with a bow tucked under the chin.",
      fact: "A violin has only 4 strings but can play thousands of different pitches!" },
    { name: "Viola", section: "Strings",
      blurb: "A little bigger than the violin, with a warmer, deeper voice.",
      fact: "Violas read a special clef (alto clef) that almost no other instrument uses!" },
    { name: "Cello", section: "Strings",
      blurb: "Big enough to rest on the floor between the player's knees.",
      fact: "The cello's rich sound is often compared to the human voice." },
    { name: "Double Bass", section: "Strings",
      blurb: "The biggest and lowest string instrument — so tall that players often stand or sit on a tall stool!",
      fact: "It's sometimes just called the 'bass' or 'contrabass.'" },
    { name: "Harp", section: "Strings",
      blurb: "A tall, triangular instrument with dozens of strings plucked by hand.",
      fact: "Orchestra harps have foot pedals that can change the pitch of every string!" },

    { name: "Flute", section: "Woodwinds",
      blurb: "A metal tube played sideways — the sound is made by blowing across a hole.",
      fact: "Even though it's metal today, it's still called a 'woodwind' because it used to be made of wood!" },
    { name: "Clarinet", section: "Woodwinds",
      blurb: "Uses a single reed to make a warm, smooth sound.",
      fact: "The clarinet has one of the widest pitch ranges of any orchestra instrument." },
    { name: "Oboe", section: "Woodwinds",
      blurb: "Uses a double reed — two thin pieces of cane that buzz together.",
      fact: "The whole orchestra tunes to the oboe's 'A' before a concert!" },
    { name: "Bassoon", section: "Woodwinds",
      blurb: "A very long double-reed instrument that folds back on itself so it's easier to hold.",
      fact: "If you unrolled its tube, a bassoon would be about 8 feet long!" },
    { name: "Saxophone", section: "Woodwinds",
      blurb: "Made of metal but played with a single reed, like a clarinet.",
      fact: "It isn't always in a classical orchestra, but it's a star in jazz and concert bands!" },

    { name: "Trumpet", section: "Brass",
      blurb: "The smallest and highest brass instrument — buzz your lips and press 3 valves.",
      fact: "Trumpets are one of the oldest instruments; early versions date back thousands of years!" },
    { name: "French Horn", section: "Brass",
      blurb: "A long, coiled tube that makes a warm, mellow sound.",
      fact: "If uncoiled, a French horn's tubing would stretch about 12 feet!" },
    { name: "Trombone", section: "Brass",
      blurb: "The only brass instrument with a slide instead of valves.",
      fact: "Players move the slide in and out to change the pitch." },
    { name: "Tuba", section: "Brass",
      blurb: "The biggest and lowest brass instrument — it provides the deep, booming bass.",
      fact: "It's the youngest member of the brass family, invented in the 1800s." },

    { name: "Timpani", section: "Percussion",
      blurb: "Large tuned drums, also called 'kettledrums' — players can change their pitch with a foot pedal!",
      fact: "Timpani are some of the only drums that play actual musical pitches." },
    { name: "Snare Drum", section: "Percussion",
      blurb: "Has metal wires called 'snares' stretched across the bottom that buzz when it's hit.",
      fact: "You'll hear it in marching bands and orchestras alike." },
    { name: "Bass Drum", section: "Percussion",
      blurb: "A huge drum with a deep, booming sound.",
      fact: "It's often used for dramatic, powerful moments in music." },
    { name: "Cymbals", section: "Percussion",
      blurb: "Two metal plates crashed together for a bright, shimmering crash.",
      fact: "A single cymbal can also be tapped with a stick for a lighter sound." },
    { name: "Xylophone", section: "Percussion",
      blurb: "Wooden bars struck with mallets to play a tune.",
      fact: "Its metal-barred cousin, the glockenspiel, sounds bright and bell-like." }
  ],

  /* Composer Spotlight — the "big three." Facts are widely documented and
     kid-friendly. Melodies are only included where we can play them with
     confidence; otherwise a "Find a recording" search link is offered. */
  composers: [
    {
      name: "Johann Sebastian Bach", short: "Bach", born: 1685, died: 1750,
      era: "Baroque", country: "Germany", color: "#5b8cff",
      facts: [
        "Bach had 20 children, and several of them grew up to be composers too!",
        "He wrote new music almost every week for his church job — hundreds of pieces called cantatas.",
        "Bach was such an amazing organist that people traveled long distances just to hear him play."
      ],
      works: ["Minuet in G", "Brandenburg Concertos", "Toccata and Fugue in D minor", "Air on the G String"],
      searchQuery: "Bach music for kids",
      // Opening phrase of "Air on the G String" (Orchestral Suite No. 3, BWV 1068),
      // melody line only. Transcribed from the public-domain Mutopia Project score
      // (mutopiaproject.org, BWV1068), grace-note ornaments simplified out.
      melody: { tempo: 56, notes: [
        ["F#5",4.5],["B5",.25],["G5",.25],["E5",.25],["D5",.25],["C#5",.25],["D5",.25],["C#5",1],["A4",1],
        ["A5",2.25],["F#5",.25],["C5",.25],["B4",.25],["E5",.25],["D#5",.25],["A5",.25],["G5",.25],
        ["G5",2.25],["E5",.25],["B4",.25],["A4",.25],["D5",.25],["C#5",.25],["G5",.25],["F#5",.25]
      ]},
      melodyCaption: "🎵 The famous opening of 'Air on the G String'"
    },
    {
      name: "Wolfgang Amadeus Mozart", short: "Mozart", born: 1756, died: 1791,
      era: "Classical", country: "Austria", color: "#ffab3d",
      facts: [
        "Mozart started composing his own music when he was only 5 years old!",
        "He performed for kings, queens, and empresses all across Europe as a child.",
        "He wrote over 600 pieces of music in his lifetime."
      ],
      works: ["Eine kleine Nachtmusik", "The Magic Flute", "Twelve Variations on 'Ah vous dirai-je, Maman'"],
      searchQuery: "Mozart music for kids",
      // Mozart's famous variations use this exact tune — reuses the Twinkle melody above.
      melodyFromSong: "Twinkle, Twinkle, Little Star",
      melodyCaption: "🎵 Mozart wrote famous variations on this exact tune!"
    },
    {
      name: "Ludwig van Beethoven", short: "Beethoven", born: 1770, died: 1827,
      era: "Classical → Romantic", country: "Germany", color: "#a06bff",
      facts: [
        "Beethoven kept composing even after he lost most of his hearing.",
        "He is said to have sawed the legs off a piano so he could feel its vibrations through the floor.",
        "The main tune from his 9th Symphony, 'Ode to Joy,' is now the official anthem of the European Union!"
      ],
      works: ["Symphony No. 5", "Symphony No. 9 (Ode to Joy)", "Für Elise", "Moonlight Sonata"],
      searchQuery: "Beethoven music for kids",
      melody: { tempo: 120, notes: [
        ["E4",1],["E4",1],["F4",1],["G4",1],["G4",1],["F4",1],["E4",1],["D4",1],
        ["C4",1],["C4",1],["D4",1],["E4",1],["E4",1.5],["D4",0.5],["D4",2]
      ]},
      melodyCaption: "🎵 The famous opening of 'Ode to Joy'"
    }
  ]
};
