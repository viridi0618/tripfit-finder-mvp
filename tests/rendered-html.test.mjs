import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;
const templateRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the travel generator homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.match(html, /Random Vacation Generator/i);
  assert.match(html, /Where can your passport and budget take you\?/i);
  assert.match(html, /Passport/i);
  assert.match(html, /Total trip budget/i);
  assert.match(html, /Find My Trips/i);
});

test("ships MVP pages instead of starter preview assets", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /export const metadata:\s*Metadata/);
  assert.doesNotMatch(page, /"codex-preview": "development"|SkeletonPreview/);
  assert.match(layout, /TripFit Finder/);
  assert.doesNotMatch(
    layout,
    /codex-preview|_sites-preview|themeColor|\bViewport\b/,
  );
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("app/_sites-preview", templateRoot)));
});

test("server-renders indexable MVP support pages", async () => {
  for (const pathname of [
    "/quiz",
    "/destinations",
    "/visa-free-countries/uk-passport",
    "/visa-free-countries/indian-passport",
    "/methodology",
    "/affiliate-disclosure",
  ]) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    assert.match(html, /<h1/i, pathname);
  }
});
