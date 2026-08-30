// 教材用 Network タブ（headed Chrome）。方針は .cursor/rules/textbook-screenshots.mdc
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import puppeteer from "puppeteer-core";
import { verifyBase, verifyHost } from "./capture-hosts.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const outDir = join(root, "public", "images");
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = "http://localhost:8080/shinsei";
const profile = join(tmpdir(), "shinsei-capture-profile");
const ps1 = join(root, "shinsei-kun", "scripts", "window-shot.ps1");
const cropPs1 = join(root, "shinsei-kun", "scripts", "crop-jpeg.ps1");
const manualPromptPs1 = join(root, "shinsei-kun", "scripts", "manual-prompt.ps1");
mkdirSync(outDir, { recursive: true });
rmSync(profile, { recursive: true, force: true });
mkdirSync(join(profile, "Default"), { recursive: true });
writeFileSync(
  join(profile, "Default", "Preferences"),
  JSON.stringify({
    profile: {
      password_manager_enabled: false,
      password_manager_leak_detection: false,
    },
    credentials_enable_service: false,
    safebrowsing: { enabled: false, enhanced: false },
    devtools: {
      preferences: {
        currentDockState: '"right"',
        "panel-selectedTab": '"network"',
        "network-log.preserve-log": "false",
        "network-show-overview": "false",
        "disable-locale-info-bar": "true",
        "InspectorView.splitViewState": JSON.stringify({
          vertical: { size: 460, showMode: "Both" },
          horizontal: { size: 460, showMode: "Both" },
        }),
      },
    },
    browser: { check_default_browser: false },
  }),
);

let browserPid = 0;

function shotWindow(name, selectNetwork = false, { outPath, preserveUi = false } = {}) {
  const args = [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    ps1,
    "-ProcessId",
    String(browserPid),
    "-OutPath",
    outPath ?? join(outDir, name),
  ];
  if (selectNetwork) args.push("-SelectNetwork");
  if (preserveUi) args.push("-PreserveUi");
  const result = execFileSync("powershell", args, { encoding: "utf8" });
  console.log(result.trim());
}

function cropJpeg(srcPath, destName, { left, top, width, height }) {
  const result = execFileSync(
    "powershell",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      cropPs1,
      "-InPath",
      srcPath,
      "-OutPath",
      join(outDir, destName),
      "-Left",
      String(left),
      "-Top",
      String(top),
      "-Width",
      String(width),
      "-Height",
      String(height),
    ],
    { encoding: "utf8" },
  );
  console.log(result.trim());
}

function prepareNetworkPanel({ clear = false, filter = "" } = {}) {
  const args = [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    ps1,
    "-ProcessId",
    String(browserPid),
    "-SelectNetwork",
  ];
  if (clear) args.push("-ClearNetwork");
  if (filter) args.push("-NetworkFilter", filter);
  const result = execFileSync("powershell", args, { encoding: "utf8" });
  console.log(result.trim());
}

function clearNetworkLog() {
  prepareNetworkPanel({ clear: true });
}

function waitForManualStep(message, title = "教材キャプチャ") {
  execFileSync(
    "powershell",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      manualPromptPs1,
      "-Message",
      message,
      "-Title",
      title,
    ],
    { encoding: "utf8" },
  );
  console.log("manual step completed");
}

function showConsoleDrawer() {
  const args = [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    ps1,
    "-ProcessId",
    String(browserPid),
    "-ShowConsole",
  ];
  const result = execFileSync("powershell", args, { encoding: "utf8" });
  console.log(result.trim());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function login(page, appBase = base) {
  await page.goto(`${appBase}/login`, { waitUntil: "networkidle0" });
  await page.type('input[name="username"]', "yamada");
  await page.type('input[name="password"]', "password");
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.click('button[type="submit"]'),
  ]);
}

function stopIntercept(page, handler) {
  page.off("request", handler);
  return page.setRequestInterception(false);
}

async function captureLoginFail(page) {
  await page.bringToFront();
  clearNetworkLog();
  await page.setRequestInterception(true);
  const onFail = (req) => {
    if (req.isNavigationRequest() && req.url().includes(`${verifyHost}:8080/shinsei/login`)) {
      req.abort("failed").catch(() => {});
      return;
    }
    req.continue().catch(() => {});
  };
  page.on("request", onFail);
  await page.goto(`${verifyBase}/login`, { timeout: 15000 }).catch(() => {});
  await sleep(900);
  shotWindow("screen-network-login-fail.jpg", true);
  await stopIntercept(page, onFail);
}

async function prepareNoPostShot(page, appBase) {
  await page.goto(`${appBase}/requests`, { waitUntil: "networkidle0" });
  await sleep(600);
  await page.bringToFront();
  prepareNetworkPanel();
  await sleep(300);
}

async function finishNoPostShot() {
  await page.bringToFront();
  await sleep(200);
  shotWindow("screen-network-no-post.jpg", true);
}

async function captureNoPost(page, appBase) {
  await prepareNoPostShot(page, appBase);
  waitForManualStep(
    "次の操作を実施した後、OK を押してください。\n\n" +
      "1. Network タブでログを消す\n" +
      "2. 承認ボタンを押す\n" +
      "3. Console を開き、TypeError のメッセージが読める状態にする\n" +
      "   （Network と Console の両方が見えるように DevTools を調整する）",
  );
  await finishNoPostShot();
}

async function captureRows(page, appBase) {
  await page.goto(`${appBase}/requests`, { waitUntil: "networkidle0" });
  await sleep(600);
  await page.bringToFront();
  prepareNetworkPanel();
  await sleep(300);
  shotWindow("screen-network-rows.jpg", true);
}

async function captureListEmpty200(page) {
  await page.goto(`${verifyBase}/requests`, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const tbody = document.querySelector("table.data tbody");
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="6">表示できる申請はありません。</td></tr>';
    }
  });
  await sleep(600);
  await page.bringToFront();
  prepareNetworkPanel();
  await sleep(300);
  shotWindow("screen-network-list-empty.jpg", true);
}

async function blockApproveWithFlash() {
  await page.evaluate(() => {
    const script = document.createElement("script");
    script.textContent = `document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!document.querySelector(".demo-flash")) {
      if (!document.getElementById("demo-flash-style")) {
        const style = document.createElement("style");
        style.id = "demo-flash-style";
        style.textContent = ".demo-flash{color:#b91c1c;background:#fef2f2;border:1px solid #fecaca;padding:0.65rem 0.75rem;margin:0 0 1rem;font-size:0.95rem}";
        document.head.appendChild(style);
      }
      const flash = document.createElement("p");
      flash.className = "demo-flash";
      flash.textContent = "処理に失敗しました";
      document.querySelector(".page-head")?.after(flash);
    }
    throw new TypeError("Cannot read properties of null (reading 'value')");
  }, true);
});`;
    document.documentElement.appendChild(script);
    script.remove();
  });
}

async function prepareJsErrorShot(page, appBase = base) {
  await page.goto(`${appBase}/requests`, { waitUntil: "networkidle0" });
  await blockApproveWithFlash();
  await page.bringToFront();
  prepareNetworkPanel();
  await sleep(300);
}

async function finishJsErrorShot() {
  await page.bringToFront();
  await sleep(200);
  shotWindow("screen-network-js-error.jpg", true);
}

async function captureJsError(page, appBase = base) {
  await prepareJsErrorShot(page, appBase);
  waitForManualStep(
    "次の操作を実施した後、OK を押してください。\n\n" +
      "1. Network タブでログを消す\n" +
      "2. 承認ボタンを押す（「処理に失敗しました」が出る）\n" +
      "3. Console を開き、TypeError のメッセージが読める状態にする\n" +
      "   （Network と Console の両方が見えるように DevTools を調整する）",
  );
  await finishJsErrorShot();
}

async function captureCannotApprove(page, appBase = verifyBase) {
  await page.goto(`${appBase}/requests/11`, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    window.confirm = () => true;
  });
  await page.bringToFront();
  prepareNetworkPanel();
  await sleep(300);
  await Promise.allSettled([
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 8000 }),
    page.$eval("form.js-approve-confirm", (form) => form.submit()),
  ]);
  await sleep(800);
  shotWindow("screen-network-cannot-approve.jpg", true);
}

async function captureHistorySearch(page, appBase = verifyBase) {
  const url = `${appBase}/requests/history?title=申請&status=APPROVED&createdFrom=&createdTo=`;
  await page.bringToFront();
  prepareNetworkPanel({ clear: true });
  await page.goto(url, { waitUntil: "networkidle0" });
  await sleep(600);
  await page.bringToFront();
  prepareNetworkPanel();
  await sleep(300);
  shotWindow("screen-network-history-search.jpg", true);
  waitForManualStep(
    "次の操作を実施した後、OK を押してください。\n\n" +
      "1. Network タブで、先頭の document（history?title=申請&status=...）をクリックする\n" +
      "2. Payload を開き、Query String Parameters で title=申請 と status=APPROVED が見える状態にする\n" +
      "3. マウスを DevTools の外へ移す（ツールチップが残らないように）",
  );
  const headersShot = join(tmpdir(), "screen-network-history-headers.jpg");
  shotWindow("screen-network-history-search.jpg", false, {
    outPath: headersShot,
    preserveUi: true,
  });
  cropJpeg(headersShot, "screen-network-history-search-request.jpg", {
    left: 900 / 1444,
    top: 210 / 893,
    width: 530 / 1444,
    height: 240 / 893,
  });
}

async function captureCss404(page, appBase = verifyBase) {
  await page.goto(`${appBase}/requests`, { waitUntil: "networkidle0" });
  await page.setRequestInterception(true);
  const onCss404 = (req) => {
    if (req.url().includes("/css/app.css")) {
      req.respond({ status: 404, contentType: "text/plain", body: "" }).catch(() => {});
      return;
    }
    req.continue().catch(() => {});
  };
  page.on("request", onCss404);
  await page.reload({ waitUntil: "networkidle0" });
  await sleep(700);
  await page.bringToFront();
  prepareNetworkPanel();
  await sleep(300);
  shotWindow("screen-network-css-404.jpg", true);
  await stopIntercept(page, onCss404);
}

async function captureVerifyScenarios(page) {
  await login(page, verifyBase);
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(400);
  await captureNoPost(page, verifyBase);
  await captureListEmpty200(page);

  await page.goto(`${verifyBase}/requests/16`, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    window.confirm = () => true;
  });
  await Promise.allSettled([
    page.waitForNavigation({ waitUntil: "networkidle0", timeout: 8000 }),
    page.click(".btn-approve"),
  ]);
  await sleep(800);
  shotWindow("screen-network-500.jpg", true);

  await captureCannotApprove(page, verifyBase);

  await captureHistorySearch(page, verifyBase);

  await captureCss404(page, verifyBase);

  await captureLoginFail(page);
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: false,
  defaultViewport: null,
  ignoreDefaultArgs: ["--enable-automation"],
  args: [
    `--user-data-dir=${profile}`,
    "--auto-open-devtools-for-tabs",
    "--window-size=1440,900",
    "--window-position=40,10",
    "--disable-infobars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-session-crashed-bubble",
    "--disable-save-password-bubble",
    "--disable-features=PasswordLeakDetection,PasswordManagerOnboarding,SafeBrowsingEnhanced,DevToolsLanguageOffer",
    "--lang=ja",
  ],
});
browserPid = browser.process()?.pid ?? 0;
if (!browserPid) throw new Error("chrome pid missing");

const page = (await browser.pages())[0] ?? (await browser.newPage());
page.on("dialog", (dialog) => dialog.accept());
await page.emulateTimezone("Asia/Tokyo");
await sleep(1200);

if (process.argv.includes("--login-fail-only")) {
  await captureLoginFail(page);
  await browser.close();
  process.exit(0);
}

if (process.argv.includes("--js-error-only") || process.argv.includes("--js-error-manual")) {
  const appBase = process.argv.includes("--verify") ? verifyBase : base;
  await login(page, appBase);
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(400);
  await captureJsError(page, appBase);
  await browser.close();
  process.exit(0);
}

if (process.argv.includes("--cannot-approve-only")) {
  const appBase = process.argv.includes("--verify") ? verifyBase : base;
  await login(page, appBase);
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(400);
  await captureCannotApprove(page, appBase);
  await browser.close();
  process.exit(0);
}

if (process.argv.includes("--list-empty-only")) {
  const appBase = process.argv.includes("--verify") ? verifyBase : base;
  await login(page, appBase);
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(400);
  if (process.argv.includes("--verify")) {
    await captureListEmpty200(page);
  } else {
    await page.goto(`${appBase}/requests`, { waitUntil: "networkidle0" });
    await page.evaluate(() => {
      const tbody = document.querySelector("table.data tbody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6">表示できる申請はありません。</td></tr>';
      }
    });
    await sleep(600);
    await page.bringToFront();
    prepareNetworkPanel();
    await sleep(300);
    shotWindow("screen-network-list-empty.jpg", true);
  }
  await browser.close();
  process.exit(0);
}

if (process.argv.includes("--no-post-only")) {
  const appBase = process.argv.includes("--verify") ? verifyBase : base;
  await login(page, appBase);
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(400);
  await captureNoPost(page, appBase);
  await browser.close();
  process.exit(0);
}

if (process.argv.includes("--history-search-only")) {
  const appBase = process.argv.includes("--verify") ? verifyBase : base;
  await login(page, appBase);
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(400);
  await captureHistorySearch(page, appBase);
  await browser.close();
  process.exit(0);
}

if (process.argv.includes("--rows-only")) {
  const appBase = process.argv.includes("--verify") ? verifyBase : base;
  await login(page, appBase);
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(400);
  await captureRows(page, appBase);
  await browser.close();
  process.exit(0);
}

if (process.argv.includes("--css-404-only")) {
  await login(page, verifyBase);
  await page.keyboard.press("Escape").catch(() => {});
  await sleep(400);
  await captureCss404(page, verifyBase);
  await browser.close();
  process.exit(0);
}

if (process.argv.includes("--verify-scenarios")) {
  await captureVerifyScenarios(page);
  await browser.close();
  process.exit(0);
}

await login(page);
await page.keyboard.press("Escape").catch(() => {});
await sleep(400);
await captureRows(page, base);

await login(page, verifyBase);
await page.keyboard.press("Escape").catch(() => {});
await sleep(400);
await captureCss404(page, verifyBase);

await captureNoPost(page, base);

await captureJsError(page, base);

await page.goto(`${base}/requests/12`, { waitUntil: "networkidle0" });
await page.evaluate(() => {
  window.confirm = () => true;
});
await Promise.allSettled([
  page.waitForNavigation({ waitUntil: "networkidle0", timeout: 8000 }),
  page.click(".btn-approve"),
]);
await sleep(800);
shotWindow("screen-network-403.jpg", true);

await page.goto(`${base}/requests/16`, { waitUntil: "networkidle0" });
await page.evaluate(() => {
  window.confirm = () => true;
});
await Promise.allSettled([
  page.waitForNavigation({ waitUntil: "networkidle0", timeout: 8000 }),
  page.click(".btn-approve"),
]);
await sleep(800);
shotWindow("screen-network-500.jpg", true);

await browser.close();
