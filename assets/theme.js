/**
 * Theme preference: dark (Synthetic Lime / BIO Black) is default and currently forced.
 * Light mode UI exists in the nav but cannot activate yet — coming soon.
 * localStorage key is ready for when light is enabled.
 */
(function () {
	"use strict";

	var STORAGE_KEY = "joelevi-theme";
	/* Flip to true when light palette ships. */
	var LIGHT_ENABLED = false;

	function applyTheme(theme) {
		var root = document.documentElement;
		root.setAttribute("data-theme", theme);
		root.classList.toggle("theme-dark", theme === "dark");
		root.classList.toggle("theme-light", theme === "light");
		var meta = document.querySelector('meta[name="theme-color"]');
		if (meta) {
			meta.setAttribute("content", theme === "dark" ? "#06110D" : "#06110D");
		}
		syncToggle(theme);
	}

	function resolveTheme() {
		var stored = null;
		try {
			stored = localStorage.getItem(STORAGE_KEY);
		} catch (e) { /* ignore */ }

		if (!LIGHT_ENABLED) {
			/* Force dark; ignore stored light until light is enabled. */
			return "dark";
		}
		if (stored === "light" || stored === "dark") return stored;
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			return "dark";
		}
		return "light";
	}

	function syncToggle(theme) {
		var btn = document.getElementById("site-theme-toggle");
		if (!btn) return;
		btn.setAttribute("data-theme-current", theme);
		if (!LIGHT_ENABLED) {
			btn.disabled = true;
			btn.setAttribute("aria-disabled", "true");
			btn.setAttribute(
				"aria-label",
				"Color theme: dark. Light mode coming soon."
			);
			btn.setAttribute("title", "Light mode coming soon");
			return;
		}
		btn.disabled = false;
		btn.removeAttribute("aria-disabled");
		btn.setAttribute(
			"aria-label",
			theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
		);
		btn.setAttribute("title", theme === "dark" ? "Light theme" : "Dark theme");
	}

	function persist(theme) {
		if (!LIGHT_ENABLED) return;
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch (e) { /* ignore */ }
	}

	var theme = resolveTheme();
	applyTheme(theme);

	document.addEventListener("DOMContentLoaded", function () {
		syncToggle(theme);
		var btn = document.getElementById("site-theme-toggle");
		if (!btn) return;
		btn.addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (!LIGHT_ENABLED) {
				/* Light mode coming soon — stay dark. */
				applyTheme("dark");
				return;
			}
			var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
			persist(next);
			applyTheme(next);
		});
	});
})();
