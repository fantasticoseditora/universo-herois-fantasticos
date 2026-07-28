import { readFile, writeFile } from "node:fs/promises";

const CSS_MARKER = "/* UHF desktop silhouettes and physical price */";
const FOOTER_SUPPORT_MARKER = "/* UHF footer support */";
const SUPPORT_EMAIL = "fantasticoseditora@gmail.com";

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

const footerSupportCss = `

${FOOTER_SUPPORT_MARKER}
.footer-support {
  flex-basis: 100%;
  margin: 8px 0 0;
  text-align: center;
  color: rgba(255, 253, 247, 0.74);
  font-size: 14px;
  line-height: 1.6;
}

.footer-support a {
  color: var(--gold-light);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}
`;

async function appendCssPatch(path) {
  const current = await readFile(path, "utf8");
  let updated = current;

  if (!updated.includes(CSS_MARKER)) {
    updated = `${updated.trimEnd()}${cssPatch}\n`;
  }

  if (!updated.includes(FOOTER_SUPPORT_MARKER)) {
    updated = `${updated.trimEnd()}${footerSupportCss}\n`;
  }

  if (updated === current) return false;
  await writeFile(path, updated, "utf8");
  return true;
}

async function patchSourcePage() {
  const path = "app/page.tsx";
  const current = await readFile(path, "utf8");
  let updated = current;

  if (!updated.includes('className="physical-price"')) {
    const priceNeedle =
      "              <span>Impressão sob demanda pela UICLAP</span>\n              <a";
    const priceReplacement =
      "              <span>Impressão sob demanda pela UICLAP</span>\n" +
      "              <span className=\"physical-price\">R$ 72,33</span>\n" +
      "              <a";

    if (!updated.includes(priceNeedle)) {
      throw new Error("Trecho do preço físico não encontrado em app/page.tsx.");
    }
    updated = updated.replace(priceNeedle, priceReplacement);
  }

  if (!updated.includes('className="footer-support"')) {
    const footerNeedle =
      '        <a href={catalogUrl}>Conheça o catálogo ↗</a>\n      </footer>';
    const footerReplacement =
      '        <a href={catalogUrl}>Conheça o catálogo ↗</a>\n' +
      '        <p className="footer-support">\n' +
      '          Suporte e problemas com arquivos: {" "}\n' +
      `          <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>\n` +
      '        </p>\n' +
      '      </footer>';

    if (!updated.includes(footerNeedle)) {
      throw new Error("Rodapé não encontrado em app/page.tsx.");
    }
    updated = updated.replace(footerNeedle, footerReplacement);
  }

  if (updated === current) return false;
  await writeFile(path, updated, "utf8");
  return true;
}

async function patchStaticPage() {
  const path = "index.html";
  const current = await readFile(path, "utf8");
  let updated = current;

  if (!updated.includes('class="physical-price"')) {
    const pricePattern = /(<article class="purchase-card purchase-physical">[\s\S]*?<span>Impressão sob demanda pela UICLAP<\/span>)(?!<span class="physical-price">)/;
    if (!pricePattern.test(updated)) {
      throw new Error("Trecho do preço físico não encontrado em index.html.");
    }
    updated = updated.replace(
      pricePattern,
      '$1<span class="physical-price">R$ 72,33</span>',
    );
  }

  if (!updated.includes('class="footer-support"')) {
    const footerPattern = /(<a href="https:\/\/uiclap\.bio\/editorafantasticos">Conheça o catálogo ↗<\/a>)(<\/footer>)/;
    if (!footerPattern.test(updated)) {
      throw new Error("Rodapé não encontrado em index.html.");
    }
    updated = updated.replace(
      footerPattern,
      `$1<p class="footer-support">Suporte e problemas com arquivos: <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>$2`,
    );
  }

  if (updated === current) return false;
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
