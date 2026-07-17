import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless:false, userDataDir:"/tmp/ns-chrome-profile2", args:["--window-size=1500,940","--no-first-run","--no-default-browser-check","--disable-session-crashed-bubble"] });
try {
  const page=(await browser.pages())[0];
  await page.setViewport({width:1500,height:920});
  await page.goto("http://localhost:3000/",{waitUntil:"networkidle0"});
  await page.waitForSelector(".brand-logo",{timeout:30000});
  await sleep(2500);
  const el = await page.$(".topbar");
  await el.screenshot({ path:"/tmp/logo_topbar.png" });
  console.log("captured topbar");
} finally { await browser.close(); }
