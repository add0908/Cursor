/* global VEHICLES, SPEC_GROUPS, CURRENCY */
(function () {
  "use strict";

  const numberFmt = new Intl.NumberFormat("en-AU");
  const currencyFmt = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
  });

  function formatValue(value, row) {
    if (value === null || value === undefined || value === "") return "—";
    if (row.format === "currency" && typeof value === "number") {
      return currencyFmt.format(value);
    }
    if (typeof value === "number") {
      const num = numberFmt.format(value);
      return row.unit ? `${num}<span class="unit">${row.unit}</span>` : num;
    }
    return String(value);
  }

  // Rank a Yes / Standard / Optional / No style value (higher = better).
  function featureTier(value) {
    const s = String(value).toLowerCase();
    if (/\b(no|none)\b/.test(s) || s === "—" || s === "-") return 0;
    if (/\boptional\b/.test(s)) return 1;
    if (/\b(yes|standard|included|full)\b/.test(s)) return 2;
    return null;
  }

  // Pull the first number out of a string (e.g. "17-speaker" -> 17).
  function firstNumber(value) {
    const m = String(value).match(/\d[\d,.]*/);
    return m ? parseFloat(m[0].replace(/,/g, "")) : null;
  }

  // Determine which vehicles "win" a row (numeric, feature, or quantity text).
  function winnersFor(row) {
    const present = VEHICLES.map((v) => [v.id, v.specs[row.key]]).filter(
      ([, val]) => val !== null && val !== undefined && val !== ""
    );

    let scored;
    if (row.better === "high" || row.better === "low") {
      scored = present
        .filter(([, val]) => typeof val === "number")
        .map(([id, val]) => [id, row.better === "low" ? -val : val]);
    } else if (row.hl === "feature") {
      scored = present
        .map(([id, val]) => [id, featureTier(val)])
        .filter(([, s]) => s !== null);
    } else if (row.hl === "num") {
      scored = present
        .map(([id, val]) => [id, firstNumber(val)])
        .filter(([, s]) => s !== null);
    } else {
      return new Set();
    }

    if (scored.length < 2) return new Set();
    const values = scored.map(([, s]) => s);
    const max = Math.max(...values);
    const min = Math.min(...values);
    if (max === min) return new Set(); // no meaningful winner
    return new Set(scored.filter(([, s]) => s === max).map(([id]) => id));
  }

  function rowValuesDiffer(row) {
    const vals = VEHICLES.map((v) => v.specs[row.key]);
    return new Set(vals.map((v) => String(v))).size > 1;
  }

  function renderCurrencyNote() {
    document.getElementById("currency-note").textContent =
      `Prices in ${CURRENCY}, indicative RRP before on-road costs.`;
  }

  function renderCards() {
    const container = document.getElementById("vehicle-cards");
    container.innerHTML = "";
    VEHICLES.forEach((v) => {
      const s = v.specs;
      const card = document.createElement("article");
      card.className = "card";
      card.style.setProperty("--card-accent", v.accent);
      card.innerHTML = `
        <div class="brand">${v.brand}</div>
        <div class="model">${v.model}</div>
        <span class="trim">${v.trimShort}</span>
        <div class="price"><span class="cur">${CURRENCY}</span>${numberFmt.format(
        s.price
      )}</div>
        <p class="highlight">${v.highlight}</p>
        <div class="quickstats">
          <div><div class="v">${s.power} kW</div><div class="l">Power</div></div>
          <div><div class="v">${s.accel}s</div><div class="l">0–100</div></div>
          <div><div class="v">${s.rangeWltp} km</div><div class="l">Range</div></div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function renderTableHead() {
    const head = document.getElementById("compare-head");
    const tr = document.createElement("tr");
    tr.innerHTML = `<th class="row-label">Specification</th>`;
    VEHICLES.forEach((v) => {
      const th = document.createElement("th");
      th.className = "col-head";
      th.style.setProperty("--ch-accent", v.accent);
      th.innerHTML = `
        <div class="ch-brand">${v.brand}</div>
        <div class="ch-model">${v.model}</div>
        <div class="ch-trim">${v.trimShort}</div>
        <div class="ch-bar"></div>
      `;
      tr.appendChild(th);
    });
    head.innerHTML = "";
    head.appendChild(tr);
  }

  function renderTableBody() {
    const body = document.getElementById("compare-body");
    const onlyDiff = document.getElementById("toggle-onlydiff").checked;
    body.innerHTML = "";

    SPEC_GROUPS.forEach((group) => {
      const visibleRows = group.rows.filter(
        (row) => !onlyDiff || rowValuesDiffer(row)
      );
      if (visibleRows.length === 0) return;

      const groupTr = document.createElement("tr");
      groupTr.className = "group-row";
      groupTr.innerHTML = `<td colspan="${VEHICLES.length + 1}">${group.title}</td>`;
      body.appendChild(groupTr);

      visibleRows.forEach((row) => {
        const winners = winnersFor(row);
        const tr = document.createElement("tr");
        const label = document.createElement("td");
        label.className = "row-label";
        label.textContent = row.label;
        tr.appendChild(label);

        VEHICLES.forEach((v) => {
          const td = document.createElement("td");
          td.className = "val";
          if (winners.has(v.id)) td.classList.add("win");
          td.innerHTML = formatValue(v.specs[row.key], row);
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });
    });
  }

  function init() {
    renderCurrencyNote();
    renderCards();
    renderTableHead();
    renderTableBody();

    const diffToggle = document.getElementById("toggle-diff");
    const applyHighlight = () =>
      document.body.classList.toggle("show-diff", diffToggle.checked);
    diffToggle.addEventListener("change", applyHighlight);
    applyHighlight(); // honour the default (checked) state on load

    document
      .getElementById("toggle-onlydiff")
      .addEventListener("change", renderTableBody);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
