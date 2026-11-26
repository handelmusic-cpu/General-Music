/* ==========================================================================
   externalapps.js — tiles for standalone companion apps.
   mõdScore and mõdRïff are full apps in their own right (own libraries, own
   design system), vendored here as static folders under apps/. Rather than
   force them into the shared activity shell, their tiles just open the app
   in a new tab — see App.register's `external` handling in app.js.
   ========================================================================== */

(function () {
  App.register({
    id: "modscore",
    title: "mõdScore",
    emoji: "📝",
    desc: "Write sheet music and play it back. Opens in a new tab.",
    color: "tile--indigo",
    external: "apps/modscore/index.html"
  });

  App.register({
    id: "modriff",
    title: "mõdRïff",
    emoji: "🎛️",
    desc: "A groovebox where every part stays in key. Opens in a new tab.",
    color: "tile--rainbow",
    external: "apps/modriff/index.html"
  });
})();
