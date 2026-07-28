import { readFile, writeFile } from "node:fs/promises";

const CSS_MARKER = "/* UHF footer layout refinement */";

const cssPatch = `

${CSS_MARKER}
footer {
  column-gap: clamp(24px, 4vw, 58px);
  row-gap: 18px;
}

.footer-catalog {
  align-items: center;
  background: rgba(242, 212, 107, 0.08);
  border: 1px solid rgba(242, 212, 107, 0.48);
  color: var(--gold-light);
  display: inline-flex;
  font-size: 13px;
  font-weight: 800;
  gap: 10px;
  justify-self: end;
  letter-spacing: 0.04em;
  padding: 13px 17px;
  transition: background 180ms ease, border-color 180ms ease, color 180ms ease,
    transform 180ms ease;
}

.footer-catalog:hover,
.footer-catalog:focus-visible {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--ink);
  outline: none;
  transform: translateY(-2px);
}

.footer-support {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  grid-column: 1 / -1;
  margin: 0;
  padding-top: 16px;
  width: 100%;
}

@media (min-width: 641px) and (max-width: 980px) {
  footer {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .footer-brand {
    grid-column: 1;
    grid-row: 1;
  }

  .publisher-brand {
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  .footer-catalog {
    grid-column: 1;
    grid-row: 2;
    justify-self: start;
  }
}

@media (max-width: 640px) {
  footer {
    display: grid;
    gap: 18px;
    grid-template-columns: 1fr;
    justify-items: center;
    padding: 28px 24px 118px;
  }

  .footer-brand,
  .publisher-brand,
  .footer-catalog {
    justify-self: center;
  }

  .footer-catalog {
    justify-content: center;
    width: min(100%, 280px);
  }

  .footer-support {
    grid-column: 1;
    font-size: 13px;
    overflow-wrap: anywhere;
    padding-top: 16px;
  }
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
  if (current.includes('className="footer-catalog"')) return false;

  const needle = '<a href={catalogUrl}>Conheça o catálogo ↗</a>';
  const replacement =
    '<a className="footer-catalog" href={catalogUrl}>Conheça o catálogo ↗</a>';

  if (!current.includes(needle)) {
    throw new Error("Link do catálogo não encontrado em app/page.tsx.");
  }

  await writeFile(path, current.replace(needle, replacement), "utf8");
  return true;
}

async function patchStaticPage() {
  const path = "index.html";
  const current = await readFile(path, "utf8");
  if (current.includes('class="footer-catalog"')) return false;

  const pattern = /<a href="([^"]+)">Conheça o catálogo ↗<\/a>/;
  if (!pattern.test(current)) {
    throw new Error("Link do catálogo não encontrado em index.html.");
  }

  await writeFile(
    path,
    current.replace(
      pattern,
      '<a class="footer-catalog" href="$1">Conheça o catálogo ↗</a>',
    ),
    "utf8",
  );
  return true;
}

const results = await Promise.all([
  appendCssPatch("app/globals.css"),
  appendCssPatch("style.css"),
  patchSourcePage(),
  patchStaticPage(),
]);

console.log(`Arquivos alterados: ${results.filter(Boolean).length}`);
