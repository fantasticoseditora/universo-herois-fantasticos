import { readFile, writeFile } from "node:fs/promises";

const CSS_MARKER = "/* UHF desktop silhouettes and physical price */";

const cssPatch = `

${CSS_MARKER}
@media (min-width: 641px) {
  .silhouette-winged,
  .silhouette-arrow,
  .silhouette-trident {
    filter: brightness(0) saturate(100%) invert(86%) sepia(38%) saturate(704%)
      hue-rotate(352deg) brightness(104%) contrast(93%);
  }

  .silhouette-team {
    filter: brightness(0) saturate(100%) invert(89%) sepia(20%) saturate(582%)
      hue-rotate(175deg) brightness(105%) contrast(92%);
  }

  .silhouette-occult {
    filter: brightness(0) saturate(100%) invert(17%) sepia(29%) saturate(946%)
      hue-rotate(111deg) brightness(91%) contrast(96%);
  }
}

.purchase-card .physical-price {
  color: var(--forest);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 28px;
  font-weight: 700;
}
`;

async function appendCssPatch(path) {
  const current = await readFile(path, "utf8");
  if (current.includes(CSS_MARKER)) return false;
  await writeFile(path, `${current.trimEnd()}${cssPatch}\n`, "utf8");
  return true;
}

async function patchSourcePage() {
  const path = "app/page.tsx";
  const current = await readFile(path, "utf8");
  if (current.includes('className="physical-price"')) return false;

  const needle = "              <span>Impressão sob demanda pela UICLAP</span>\n              <a";
  const replacement =
    "              <span>Impressão sob demanda pela UICLAP</span>\n" +
    "              <span className=\"physical-price\">R$ 72,33</span>\n" +
    "              <a";

  if (!current.includes(needle)) {
    throw new Error("Trecho do preço físico não encontrado em app/page.tsx.");
  }

  await writeFile(path, current.replace(needle, replacement), "utf8");
  return true;
}

async function patchStaticPage() {
  const path = "index.html";
  const current = await readFile(path, "utf8");
  if (current.includes('class="physical-price"')) return false;

  const pattern = /(<article class="purchase-card purchase-physical">[\s\S]*?<span>Impressão sob demanda pela UICLAP<\/span>)(?!<span class="physical-price">)/;
  if (!pattern.test(current)) {
    throw new Error("Trecho do preço físico não encontrado em index.html.");
  }

  const updated = current.replace(
    pattern,
    '$1<span class="physical-price">R$ 72,33</span>',
  );
  await writeFile(path, updated, "utf8");
  return true;
}

const results = await Promise.all([
  appendCssPatch("app/globals.css"),
  appendCssPatch("style.css"),
  patchSourcePage(),
  patchStaticPage(),
]);

console.log(`Arquivos alterados: ${results.filter(Boolean).length}`);
