/* ==========================================================================
   main.js
   Page-specific interactivity. Each block checks for the elements it
   needs, so this single file can be safely included on every page.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ------------------------------------------------------------------
     Eucharistic Miracles: filter, search, and sort
     Each <details class="miracle-card"> carries:
       data-category  e.g. "bleeding-host", "preservation", "protection", "saint"
       data-century   e.g. "13"
       data-location  used for searching and A-Z sort
       data-year      numeric year used for sorting (use a best-guess
                       integer even for approximate dates)
  ------------------------------------------------------------------ */
  var grid = document.querySelector(".miracle-grid");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".miracle-card"));
    var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
    var searchInput = document.getElementById("miracle-search");
    var sortSelect = document.getElementById("miracle-sort");
    var emptyMessage = document.querySelector(".miracle-empty");
    var activeCategory = "all";

    function cardText(card) {
      return (
        (card.getAttribute("data-location") || "") + " " +
        card.textContent
      ).toLowerCase();
    }

    function applyFilters() {
      var query = (searchInput && searchInput.value || "").trim().toLowerCase();
      var visibleCount = 0;

      cards.forEach(function (card) {
        var matchesCategory = activeCategory === "all" || card.getAttribute("data-category") === activeCategory;
        var matchesQuery = query === "" || cardText(card).indexOf(query) !== -1;

        if (matchesCategory && matchesQuery) {
          card.removeAttribute("hidden");
          visibleCount++;
        } else {
          card.setAttribute("hidden", "");
        }
      });

      if (emptyMessage) {
        emptyMessage.classList.toggle("is-visible", visibleCount === 0);
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        activeCategory = chip.getAttribute("data-filter");
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        var value = sortSelect.value;
        var sorted = cards.slice().sort(function (a, b) {
          if (value === "year-asc" || value === "year-desc") {
            var ay = parseInt(a.getAttribute("data-year"), 10) || 0;
            var by = parseInt(b.getAttribute("data-year"), 10) || 0;
            return value === "year-asc" ? ay - by : by - ay;
          }
          if (value === "location-az") {
            var aloc = (a.getAttribute("data-location") || "").toLowerCase();
            var bloc = (b.getAttribute("data-location") || "").toLowerCase();
            return aloc.localeCompare(bloc);
          }
          return 0;
        });
        sorted.forEach(function (card) { grid.appendChild(card); });
        cards = sorted;
      });
    }

    // Only one miracle card open at a time keeps the page tidy
    cards.forEach(function (card) {
      card.addEventListener("toggle", function () {
        if (card.open) {
          cards.forEach(function (other) {
            if (other !== card) other.open = false;
          });
        }
      });
    });

/* ------------------------------------------------------------------
   Hero host: click/tap once to reveal 1–2 spots in the pattern of a
   Eucharistic miracle (e.g. Lanciano, Buenos Aires). Fires only once.
------------------------------------------------------------------ */
(function () {
  var hostVisual = document.getElementById("hostVisual");
  if (!hostVisual) return;
  var spotsContainer = hostVisual.querySelector(".host-spots");
  if (!spotsContainer) return;

  var revealed = false;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function addSpot() {
    var spot = document.createElement("span");
    spot.className = "host-spot";

    // Uniform random point within a circle (sqrt keeps density even),
    // kept inside a margin so spots never touch the clipped edge.
    var maxR = 38;
    var r = Math.sqrt(Math.random()) * maxR;
    var angle = Math.random() * Math.PI * 2;
    var x = 50 + r * Math.cos(angle);
    var y = 50 + r * Math.sin(angle);

    var w = rand(7, 14);
    var h = w * rand(0.7, 1.15);

    spot.style.left = x + "%";
    spot.style.top = y + "%";
    spot.style.width = w + "%";
    spot.style.height = h + "%";
    spot.style.borderRadius =
      rand(35, 65) + "% " + rand(35, 65) + "% " +
      rand(35, 65) + "% " + rand(35, 65) + "% / " +
      rand(35, 65) + "% " + rand(35, 65) + "% " +
      rand(35, 65) + "% " + rand(35, 65) + "%";

    spotsContainer.appendChild(spot);
  }

  function revealMiracle() {
    if (revealed) return;
    revealed = true;

    var howMany = Math.random() < 0.5 ? 1 : 2;
    for (var i = 0; i < howMany; i++) {
      setTimeout(addSpot, i * 250); // slight stagger if two appear
    }

    // Stop inviting interaction once the miracle has appeared.
    hostVisual.style.cursor = "default";
    hostVisual.setAttribute("aria-label", "A sign has appeared on the host");
    hostVisual.removeAttribute("role");
    hostVisual.removeAttribute("tabindex");
  }

  hostVisual.addEventListener("click", revealMiracle);
  hostVisual.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      revealMiracle();
    }
  });
})();

    applyFilters();
  }

});
