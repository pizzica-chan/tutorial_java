// 教材用 Network タブ（headed Chrome）。方針は .cursor/rules/textbook-screenshots.mdc
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import puppeteer from "puppeteer-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const outDir = join(root, "public", "images");
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = "http://localhost:8080/shinsei";
const profile = join(tmpdir(), "shinsei-capture-profile");
const ps1 = join(root, "shinsei-kun", "scripts", "window-shot.ps1");
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

function shotWindow(name, selectNetwork = false) {
  const args = [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    ps1,
    "-ProcessId",
    String(browserPid),
    "-OutPath",
    join(outDir, name),
  ];
  if (selectNetwork) args.push("-SelectNetwork");
  const result = execFileSync("powershell", args, { encoding: "utf8" });
  console.log(result.trim());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function login(page) {
  await page.goto(`${base}/login`, { waitUntil: "networkidle0" });
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

await login(page);
await page.keyboard.press("Escape").catch(() => {});
await sleep(400);
await page.goto(`${base}/requests`, { waitUntil: "networkidle0" });
await sleep(800);
shotWindow("screen-network-rows.jpg", true);

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
shotWindow("screen-network-css-404.jpg", true);
await stopIntercept(page, onCss404);

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

await page.reload({ waitUntil: "networkidle0" });
await page.click(".btn-approve");
await sleep(800);
shotWindow("screen-network-no-post.jpg", true);

await page.reload({ waitUntil: "networkidle0" });
await blockApproveWithFlash();
await page.click(".btn-approve");
await sleep(800);
shotWindow("screen-network-js-error.jpg", true);

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

await page.goto(`${base}/requests`, { waitUntil: "networkidle0" });
await page.setRequestInterception(true);
let hung = null;
const onHang = (req) => {
  if (!hung && req.isNavigationRequest() && req.url().includes("/shinsei/requests") && !req.url().includes("/12")) {
    hung = req;
    return;
  }
  req.continue().catch(() => {});
};
page.on("request", onHang);
const hungNav = page.reload({ waitUntil: "domcontentloaded", timeout: 2500 }).catch(() => {});
await sleep(1800);
shotWindow("screen-network-pending.jpg", true);
page.off("request", onHang);
if (hung) await hung.abort("timedout").catch(() => {});
await page.setRequestInterception(false);
await hungNav;

await browser.close();
