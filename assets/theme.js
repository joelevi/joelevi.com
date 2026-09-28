/**
 * Theme preference: dark (Synthetic Lime / BIO Black) ↔ light (Toxic Violet / Soft Chrome).
 * Persists override in localStorage ("joelevi-theme"). Without override, follows
 * prefers-color-scheme and listens for system changes.
 */
(function () {
	"use strict";

	var STORAGE_KEY = "joelevi-theme";
	var LIGHT_ENABLED = true;
	var THEME_COLOR = { dark: "#06110D", light: "#F1F2F7" };

	function getStored() {
		try {
			return localStorage.getItem(STORAGE_KEY);
		} catch (e) {
			return null;
		}
	}

	function hasOverride() {
		var stored = getStored();
		return stored === "light" || stored === "dark";
	}

	function systemTheme() {
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
			return "light";
		}
		return "dark";
	}

	function resolveTheme() {
		if (!LIGHT_ENABLED) return "dark";
		if (hasOverride()) return getStored();
		return systemTheme();
	}

	function applyTheme(theme) {
		var root = document.documentElement;
		root.setAttribute("data-theme", theme);
		root.classList.toggle("theme-dark", theme === "dark");
		root.classList.toggle("theme-light", theme === "light");
		var meta = document.querySelector('meta[name="theme-color"]');
		if (meta) {
			meta.setAttribute("content", THEME_COLOR[theme] || THEME_COLOR.dark);
		}
		var ms = document.querySelector('meta[name="msapplication-navbutton-color"]');
		if (ms) {
			ms.setAttribute("content", THEME_COLOR[theme] || THEME_COLOR.dark);
		}
		syncToggle(theme);
	}

	function syncToggle(theme) {
		var btn = document.getElementById("site-theme-toggle");
		if (!btn) return;
		btn.setAttribute("data-theme-current", theme);
		if (!LIGHT_ENABLED) {
			btn.disabled = true;
			btn.setAttribute("aria-disabled", "true");
			btn.setAttribute("aria-label", "Color theme: dark. Light mode coming soon.");
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
		syncToggle(document.documentElement.getAttribute("data-theme") || theme);
		var btn = document.getElementById("site-theme-toggle");
		if (!btn) return;
		btn.addEventListener("click", function (e) {
			e.preventDefault();
			e.stopPropagation();
			if (!LIGHT_ENABLED) {
				applyTheme("dark");
				return;
			}
			var next =
				document.documentElement.getAttribute("data-theme") === "dark"
					? "light"
					: "dark";
			persist(next);
			applyTheme(next);
		});
	});

	/* Follow system only when the user has not set an override. */
	if (LIGHT_ENABLED && window.matchMedia) {
		var mq = window.matchMedia("(prefers-color-scheme: light)");
		var onChange = function () {
			if (hasOverride()) return;
			applyTheme(systemTheme());
		};
		if (typeof mq.addEventListener === "function") {
			mq.addEventListener("change", onChange);
		} else if (typeof mq.addListener === "function") {
			mq.addListener(onChange);
		}
	}
})();
