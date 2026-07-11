/* ==========================================================================
   sound.js — tiny Web Audio engine.
   No audio files: every sound is synthesized, so the app works fully offline
   on iPads and Chromebooks. Audio must be unlocked by a user gesture (tap),
   which the activities do via Sound.unlock() on their first button press.
   ========================================================================== */

window.Sound = (function () {
  var ctx = null;

  function ac() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    }
    return ctx;
  }

  // Call inside a user gesture (tap) to satisfy mobile autoplay policies.
  function unlock() {
    var c = ac();
    if (c.state === "suspended") c.resume();
    return c;
  }

  // Percussive "click" for beats. accent = louder/higher (downbeat).
  function click(accent, when) {
    var c = ac();
    when = when || c.currentTime;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = "square";
    osc.frequency.value = accent ? 1500 : 900;
    var peak = accent ? 0.5 : 0.32;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(peak, when + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.09);
    osc.connect(gain).connect(c.destination);
    osc.start(when);
    osc.stop(when + 0.1);
  }

  // A short pitched "boop" for rhythm sounds / note previews.
  // peak (0–1) sets loudness — used by the Musical Terms dynamics demos.
  function tone(freq, when, dur, type, peak) {
    var c = ac();
    when = when || c.currentTime;
    dur = dur || 0.18;
    peak = peak == null ? 0.28 : peak;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(peak, when + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  // A quick percussive "thump" at a chosen pitch — used to give each
  // orchestra percussion instrument (timpani, snare, cymbals…) its own feel.
  function perc(freq, when, dur, type) {
    var c = ac();
    when = when || c.currentTime;
    dur = dur || 0.16;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.45, when + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  // A burst of filtered white noise — the backbone of snare/hi-hat/clap sounds.
  // flavor: "hat" (bright/short), "snare" (mid), "clap" (mid, softer).
  function noise(when, dur, peak, flavor) {
    var c = ac();
    when = when || c.currentTime;
    dur = dur || 0.1;
    peak = peak == null ? 0.3 : peak;
    var n = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, n, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
    var src = c.createBufferSource();
    src.buffer = buf;
    var gain = c.createGain();
    gain.gain.setValueAtTime(peak, when);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    if (flavor === "hat" || flavor === "snare" || flavor === "clap") {
      var hp = c.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = flavor === "hat" ? 7000 : 1400;
      src.connect(hp); hp.connect(gain);
    } else {
      src.connect(gain);
    }
    gain.connect(c.destination);
    src.start(when);
    src.stop(when + dur + 0.02);
  }

  // Load + decode an audio file once and cache the result, so real recorded
  // samples (e.g. orchestra instrument notes) can be played back like any
  // other sound. Returns a Promise<AudioBuffer>.
  var bufferCache = {};
  function loadBuffer(url) {
    if (bufferCache[url]) return bufferCache[url];
    var p = fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (data) {
        return new Promise(function (resolve, reject) {
          // decodeAudioData's callback form is the widest-compatible signature.
          ac().decodeAudioData(data, resolve, reject);
        });
      });
    bufferCache[url] = p;
    return p;
  }

  function playBuffer(buffer, when, peak) {
    var c = ac();
    when = when || c.currentTime;
    peak = peak == null ? 1 : peak;
    var src = c.createBufferSource();
    src.buffer = buffer;
    var gain = c.createGain();
    gain.gain.value = peak;
    src.connect(gain).connect(c.destination);
    src.start(when);
    return src;
  }

  // Note name (e.g. "C4") -> frequency in Hz, so the staff can sing pitches.
  var SEMITONES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function noteFreq(name) {
    var m = /^([A-G])(#|b)?(\d)$/.exec(name);
    if (!m) return 440;
    var semis = SEMITONES[m[1]];
    if (m[2] === "#") semis += 1;
    if (m[2] === "b") semis -= 1;
    var midi = semis + (parseInt(m[3], 10) + 1) * 12; // MIDI number
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function playNote(name, dur) {
    tone(noteFreq(name), null, dur || 0.5, "sine");
  }

  function now() { return ac().currentTime; }

  // Play a melody: notes is an array of [noteName, beats] ("rest" = silence).
  // Returns the total duration in seconds so callers can re-enable a button.
  function playMelody(notes, tempo) {
    unlock();
    var beat = 60 / (tempo || 100);
    var t = now() + 0.06;
    notes.forEach(function (n) {
      var name = n[0], beats = n[1];
      var dur = beats * beat;
      if (name !== "rest") {
        tone(noteFreq(name), t, Math.max(0.12, dur * 0.9), "sine");
      }
      t += dur;
    });
    return (t - now());
  }

  return {
    unlock: unlock,
    click: click,
    tone: tone,
    perc: perc,
    noise: noise,
    loadBuffer: loadBuffer,
    playBuffer: playBuffer,
    playNote: playNote,
    playMelody: playMelody,
    noteFreq: noteFreq,
    now: now
  };
})();
