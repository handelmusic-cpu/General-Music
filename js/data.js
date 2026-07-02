/* ==========================================================================
   data.js — the shared content library.
   Everything here is public domain (traditional / patriotic) so teachers can
   use it freely. Each entry pairs a song or rhyme with a ready-to-play game.
   Add more by copying an object into the SONGS array — no code changes needed.
   ========================================================================== */

window.DATA = {
  categories: ["Patriotic", "Folk Song", "Nursery Rhyme", "Singing Game", "Seasonal"],

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
  ]
};
