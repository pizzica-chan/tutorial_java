// 教材用画面キャプチャ。方針は .cursor/rules/textbook-screenshots.mdc
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import { verifyBase } from "./capture-hosts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const outDir = join(root, "public", "images");
const demoDir = join(root, "shinsei-kun", "src", "main", "resources", "static", "demo");
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = "http://localhost:8080";
const base = `${origin}/shinsei`;
const width = 960;
const jpeg = { type: "jpeg", quality: 84 };
const mocksOnly = process.argv.includes("--mocks-only");

mkdirSync(outDir, { recursive: true });

async function fitApp(page) {
  await page.evaluate(() => {
    const body = document.body;
    body.style.margin = "0";
    body.style.minHeight = "0";
    const header = document.querySelector(".app-header");
    if (header) header.style.margin = "0 0 1.5rem";
    if (body.classList.contains("login-body")) {
      body.style.display = "block";
      body.style.padding = "20px";
      body.style.minHeight = "0";
      const card = document.querySelector(".login-card");
      if (card) card.style.width = "auto";
    }
  });
}

async function addAddressBar(page, url) {
  await page.evaluate((url) => {
    document.querySelector("[data-shot-chrome]")?.remove();
    const bar = document.createElement("div");
    bar.setAttribute("data-shot-chrome", "1");
    bar.style.cssText = [
      "box-sizing:border-box",
      "background:#e8eaed",
      "border-bottom:1px solid #dadce0",
      "padding:8px 10px 10px",
      "font:13px/1.3 system-ui,Segoe UI,sans-serif",
    ].join(";");
    bar.innerHTML = `
      <div style="display:flex;gap:6px;align-items:center;margin:0 0 8px 4px;">
        <span style="width:10px;height:10px;border-radius:50%;background:#ff5f57;"></span>
        <span style="width:10px;height:10px;border-radius:50%;background:#febc2e;"></span>
        <span style="width:10px;height:10px;border-radius:50%;background:#28c840;"></span>
      </div>
      <div style="background:#fff;border:1px solid #dadce0;border-radius:16px;padding:6px 12px;color:#202124;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${url}</div>
    `;
    document.body.insertBefore(bar, document.body.firstChild);
  }, url);
}

async function contentHeight(page) {
  return page.evaluate(() => {
    const bottomOf = (el) => (el ? el.getBoundingClientRect().bottom : 0);
    const bottoms = [
      bottomOf(document.querySelector("[data-shot-chrome]")),
      bottomOf(document.querySelector(".app-header")),
      bottomOf(document.querySelector(".app-main")),
      bottomOf(document.querySelector(".login-card")),
      bottomOf(document.body),
    ];
    return Math.ceil(Math.max(...bottoms) + 12);
  });
}

async function shot(page, name, url, pageWidth = width) {
  await page.setViewport({ width: pageWidth, height: 900, deviceScaleFactor: 2 });
  await fitApp(page);
  await addAddressBar(page, url);
  const height = Math.max(await contentHeight(page), 160);
  await page.setViewport({ width: pageWidth, height, deviceScaleFactor: 2 });
  await page.screenshot({
    path: join(outDir, name),
    ...jpeg,
    clip: { x: 0, y: 0, width: pageWidth, height },
  });
  console.log("wrote", name, `${pageWidth}x${height}`);
}

async function login(page, username, password = "password", appBase = base) {
  await page.goto(`${appBase}/login`, { waitUntil: "networkidle0" });
  await page.setViewport({ width, height: 720, deviceScaleFactor: 2 });
  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click('button[type="submit"]'),
  ]);
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  defaultViewport: { width, height: 720, deviceScaleFactor: 2 },
  args: ["--lang=ja-JP"],
});
const page = await browser.newPage();
page.on("dialog", (dialog) => dialog.accept());
await page.emulateTimezone("Asia/Tokyo");
await page.setViewport({ width, height: 720, deviceScaleFactor: 2 });

if (process.argv.includes("--verify-scenarios")) {
  await login(page, "yamada", "password", verifyBase);
  await shot(page, "screen-list.jpg", `${verifyBase}/requests`);

  await page.goto(`${verifyBase}/requests/16`, { waitUntil: "networkidle0" });
  await Promise.allSettled([
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 8000 }),
    page.$eval("form.js-approve-confirm", (form) => form.submit()),
  ]);
  await shot(page, "screen-error-500.jpg", `${verifyBase}/requests/16/approve`);

  await page.goto(pathToFileURL(join(demoDir, "list-empty.html")).href, { waitUntil: "networkidle0" });
  await page.setViewport({ width, height: 720, deviceScaleFactor: 2 });
  await shot(page, "screen-list-empty.jpg", `${verifyBase}/requests`);

  await page.goto(pathToFileURL(join(demoDir, "list-unstyled.html")).href, { waitUntil: "networkidle0" });
  await page.setViewport({ width, height: 720, deviceScaleFactor: 2 });
  await shot(page, "screen-list-unstyled.jpg", `${verifyBase}/requests`);

  await browser.close();
  process.exit(0);
}

if (!mocksOnly) {
  await page.goto(`${base}/login`, { waitUntil: "networkidle0" });
  await shot(page, "screen-login.jpg", `${base}/login`, 440);

  await page.goto(`${base}/login`, { waitUntil: "networkidle0" });
  await page.setViewport({ width: 440, height: 720, deviceScaleFactor: 2 });
  await page.type('input[name="username"]', "yamada");
  await page.type('input[name="password"]', "wrong");
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click('button[type="submit"]'),
  ]);
  await shot(page, "screen-login-error.jpg", `${base}/login`, 440);

  await login(page, "yamada");
  await shot(page, "screen-list.jpg", `${base}/requests`);

  await page.goto(`${base}/requests/12`, { waitUntil: "networkidle0" });
  await shot(page, "screen-detail.jpg", `${base}/requests/12`);

  await page.goto(`${base}/requests/16`, { waitUntil: "networkidle0" });
  await Promise.allSettled([
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 8000 }),
    page.$eval("form.js-approve-confirm", (form) => form.submit()),
  ]);
  await shot(page, "screen-error-500.jpg", `${base}/requests/16/approve`);

  await page.goto(`${base}/requests/99999`, { waitUntil: "networkidle0" });
  await shot(page, "screen-not-found.jpg", `${base}/requests/99999`);
}

const mocks = [
  ["list-empty.html", "screen-list-empty.jpg", `${verifyBase}/requests`],
  ["list-unstyled.html", "screen-list-unstyled.jpg", `${verifyBase}/requests`],
  ["forbidden.html", "screen-forbidden.jpg", `${base}/requests/12/approve`],
];
for (const [file, name, url] of mocks) {
  await page.goto(pathToFileURL(join(demoDir, file)).href, { waitUntil: "networkidle0" });
  await page.setViewport({ width, height: 720, deviceScaleFactor: 2 });
  await shot(page, name, url);
}

await browser.close();
