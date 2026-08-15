/* ==========================================================================
   externalapps.js — tiles for standalone companion apps.
   MōdScore and MōdRiff are full apps in their own right (own libraries, own
   design system), vendored here as static folders under apps/. Rather than
   force them into the shared activity shell, their tiles just open the app
   in a new tab — see App.register's `external` handling in app.js.
   ========================================================================== */

(function () {
  App.register({
    id: "modscore",
    title: "MōdScore",
    emoji: "📝",
    desc: "Full music notation editor & player. Opens in a new tab.",
    color: "tile--indigo",
    external: "apps/modscore/index.html"
  });

  App.register({
    id: "modriff",
    title: "MōdRiff",
    emoji: "🎛️",
    desc: "Sample-based riff & groove maker. Opens in a new tab.",
    color: "tile--rainbow",
    external: "apps/modriff/index.html"
  });
})();
