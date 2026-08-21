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

  // Determine which vehicles "win" a numeric row for highlighting.
  function winnersFor(row) {
    if (!row.better) return new Set();
    const entries = VEHICLES.map((v) => [v.id, v.specs[row.key]]).filter(
      ([, val]) => typeof val === "number"
    );
    if (entries.length < 2) return new Set();
    const values = entries.map(([, val]) => val);
    const target = row.better === "high" ? Math.max(...values) : Math.min(...values);
    // A frunk/boot of 0 shouldn't "win" a "high" comparison trivially; still fine.
    return new Set(entries.filter(([, val]) => val === target).map(([id]) => id));
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
    diffToggle.addEventListener("change", () => {
      document.body.classList.toggle("show-diff", diffToggle.checked);
    });

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
