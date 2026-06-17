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
    applyFilters();
  }
});