#!/usr/bin/env node
/* ==========================================================================
   build/bundle.js — packs the whole app into one self-contained HTML file.

   Why: the normal app loads css/js as separate files and fetches audio
   samples over HTTP, which needs a web server (or the installed PWA). This
   produces a single .html that works by itself — double-click it, email it,
   put it on a USB stick — with the CSS, every js/*.js file, and all the
   instrument recordings inlined. No network, no install, no server.

   It reads index.html and follows its own <link>/<script> tags rather than
   hardcoding a file list, so it can't silently drift out of sync as activities
   are added. Run: node build/bundle.js  →  writes dist/music-playground.html
   ========================================================================== */

var fs = require("fs");
var path = require("path");

var ROOT = path.join(__dirname, "..");
var OUT_DIR = path.join(ROOT, "dist");
var OUT_FILE = path.join(OUT_DIR, "music-playground.html");

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), "utf8"); }
function readBinary(rel) { return fs.readFileSync(path.join(ROOT, rel)); }

function mimeFor(file) {
  var ext = path.extname(file).toLowerCase();
  return { ".png": "image/png", ".mp3": "audio/mpeg", ".json": "application/json" }[ext] || "application/octet-stream";
}

function dataUri(rel) {
  return "data:" + mimeFor(rel) + ";base64," + readBinary(rel).toString("base64");
}

function main() {
  var html = read("index.html");

  // ---- Swap the "download an offline copy" footer link for a note, since
  // in this file it's pointing at itself.
  var DOWNLOAD_LINK =
    '<span class="app-footer__sep">·</span>\n' +
    '    <a href="dist/music-playground.html" download>⬇ Download an offline copy</a>';
  if (!html.includes(DOWNLOAD_LINK)) throw new Error("download-link text has changed — update DOWNLOAD_LINK in build/bundle.js");
  html = html.replace(
    DOWNLOAD_LINK,
    '<span class="app-footer__sep">·</span>\n    <span>📄 this is that offline copy</span>'
  );

  // ---- Inline the stylesheet -------------------------------------------
  html = html.replace(
    /<link rel="stylesheet" href="css\/styles\.css" \/>/,
    "<style>\n" + read("css/styles.css") + "\n</style>"
  );

  // ---- Inline icons + manifest as data: URIs (small, and keeps every
  // <link> in the document actually resolving instead of 404-ing offline).
  html = html.replace(/href="(icons\/[^"]+|manifest\.json)"/g, function (m, rel) {
    return 'href="' + dataUri(rel) + '"';
  });

  // ---- Drop remote-only bits that make no sense in a standalone file:
  //   - Google Fonts <link> (no network -> just dead weight/console noise;
  //     the CSS already falls back to system fonts).
  //   - PostHog analytics snippet (this file may be redistributed by hand;
  //     phoning home from a copy nobody is serving isn't appropriate here).
  //   - the service worker registration (file:// can't register one).
  var SW_BLOCK =
    "\n    if ('serviceWorker' in navigator) {\n" +
    "      window.addEventListener('load', function () {\n" +
    "        navigator.serviceWorker.register('sw.js').catch(function () {});\n" +
    "      });\n" +
    "    }";
  if (!html.includes(SW_BLOCK)) throw new Error("service worker block text has changed — update SW_BLOCK in build/bundle.js");
  html = html
    .replace(/\s*<link rel="preconnect"[^>]*>\n/g, "")
    .replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^>]*>\n/g, "")
    .replace(/<!-- Usage analytics[\s\S]*?<\/script>\n/, "")
    .replace(SW_BLOCK, "");

  // ---- Embedded audio: base64 every instrument sample, keyed by the exact
  // relative path orchestra.js already requests, so js/sound.js's
  // __EMBEDDED_AUDIO__ lookup (see sound.js loadBuffer) redirects transparently.
  var audioDir = path.join(ROOT, "audio", "instruments");
  var audioMap = {};
  fs.readdirSync(audioDir).sort().forEach(function (file) {
    var rel = "audio/instruments/" + file;
    audioMap[rel] = dataUri(rel);
  });
  var audioScript =
    "<script>\n" +
    "  // Every instrument sample, inlined — see js/sound.js loadBuffer().\n" +
    "  window.__EMBEDDED_AUDIO__ = " + JSON.stringify(audioMap) + ";\n" +
    "</script>\n";

  // ---- Inline every js/*.js the page loads, in the order index.html lists
  // them, so activity registration order (which matters for the home grid)
  // is preserved exactly.
  html = html.replace(/<script src="(js\/[^"]+\.js)"><\/script>/g, function (m, rel) {
    return "<script>\n// ---- " + rel + " ----\n" + read(rel) + "\n</script>";
  });

  // Audio map must exist before any activity can call Sound.loadBuffer(), so
  // place it right before the first inlined app script.
  html = html.replace(/<script>\n\/\/ ---- js\/data\.js ----/, audioScript + "$&");

  html = "<!-- GENERATED FILE — do not hand-edit. Built from index.html, css/, js/, and\n" +
    "     audio/instruments/ by build/bundle.js. To update: node build/bundle.js -->\n" +
    html;

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);
  fs.writeFileSync(OUT_FILE, html);

  var kb = Math.round(fs.statSync(OUT_FILE).size / 1024);
  console.log("Wrote " + path.relative(ROOT, OUT_FILE) + " (" + kb + " KB)");
}

main();
