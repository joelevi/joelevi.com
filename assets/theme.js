/**
 * Themes removed — blue/white only. Kept as a harmless stub so older
 * <script defer src="/assets/theme.js"> tags on inner pages do not 404.
 */
(function () {
	"use strict";
	var meta = document.querySelector('meta[name="theme-color"]');
	if (meta) meta.setAttribute("content", "#2F6FED");
	document.documentElement.removeAttribute("data-theme");
	document.documentElement.classList.remove("theme-dark", "theme-light");
	document.querySelectorAll("#site-theme-toggle, .site-nav__theme").forEach(function (el) {
		el.remove();
	});
})();
