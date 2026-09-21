(function () {
	"use strict";

	var nav = document.querySelector(".site-nav");
	if (!nav) return;

	var toggle = nav.querySelector(".site-nav__toggle");
	var panel = nav.querySelector(".site-nav__panel");
	if (!toggle || !panel) return;

	function setOpen(open) {
		nav.classList.toggle("is-open", open);
		toggle.setAttribute("aria-expanded", open ? "true" : "false");
		toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
		if (open) {
			panel.removeAttribute("hidden");
		} else {
			panel.setAttribute("hidden", "");
		}
	}

	function isOpen() {
		return toggle.getAttribute("aria-expanded") === "true";
	}

	toggle.addEventListener("click", function (e) {
		e.stopPropagation();
		setOpen(!isOpen());
	});

	document.addEventListener("click", function (e) {
		if (!isOpen()) return;
		if (!nav.contains(e.target)) setOpen(false);
	});

	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape" && isOpen()) {
			setOpen(false);
			toggle.focus();
		}
	});

	panel.addEventListener("click", function (e) {
		var printBtn = e.target.closest("[data-site-nav-print]");
		if (printBtn) {
			e.preventDefault();
			setOpen(false);
			window.print();
			return;
		}
		var link = e.target.closest("a");
		if (link) setOpen(false);
	});
})();
