#!/usr/bin/env node
/**
 * Build a single, self-contained HTML file (`ev-comparison.html`) by inlining
 * styles.css, data.js and app.js into index.html.
 *
 * This keeps the multi-file source (index.html / styles.css / data.js / app.js)
 * as the single source of truth, and regenerates the shareable one-file version
 * so the two can never drift apart.
 *
 * Usage:  node build.js
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");

const html = read("index.html");
const css = read("styles.css");
const data = read("data.js");
const app = read("app.js");

const inlinedScripts = `<script>\n${data}\n${app}\n</script>`;

const output = html
  // Replace the external stylesheet link with an inline <style> block.
  .replace(
    '<link rel="stylesheet" href="styles.css" />',
    `<style>\n${css}\n</style>`
  )
  // Replace the two external script tags with a single inline <script> block.
  .replace(
    /<script src="data\.js"><\/script>\s*<script src="app\.js"><\/script>/,
    inlinedScripts
  );

if (output.includes('src="data.js"') || output.includes('href="styles.css"')) {
  console.error(
    "build failed: expected placeholders not found in index.html — did the markup change?"
  );
  process.exit(1);
}

const outPath = path.join(root, "ev-comparison.html");
fs.writeFileSync(outPath, output);
console.log(`Wrote ${outPath} (${output.length} bytes).`);
