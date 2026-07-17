import puppeteer from "puppeteer-core";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: false, userDataDir: "/tmp/ns-chrome-profile2",
  args: ["--window-size=1440,960","--no-first-run","--no-default-browser-check","--disable-session-crashed-bubble"],
});
try {
  const page = (await browser.pages())[0];
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForSelector(".nav-btn", { timeout: 30000 });
  await sleep(5000); // model fetch + first render + camera settle
  const clickNav = async (i) => page.evaluate((idx)=>document.querySelectorAll('.nav-btn')[idx].click(), i);
  const status = async () => page.evaluate(()=>document.querySelector('.status')?.textContent?.trim());

  // default district is attention
  console.log("attention:", await status());
  await page.screenshot({ path: "/tmp/p2_attention.png" });

  await clickNav(1); await sleep(3200); // embedding
  console.log("embedding:", await status());
  await page.screenshot({ path: "/tmp/p2_embedding.png" });

  // scrub embedding layer to 1 (best clustering) then screenshot
  await page.evaluate(()=>{const el=[...document.querySelectorAll('input[type=range]')][0]; if(el){const s=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value').set; s.call(el,'1'); el.dispatchEvent(new Event('input',{bubbles:true}));}});
  await sleep(1500);
  await page.screenshot({ path: "/tmp/p2_embedding_l1.png" });

  await clickNav(0); await sleep(3200); // tokenizer
  console.log("tokenizer:", await status());
  await page.screenshot({ path: "/tmp/p2_tokenizer.png" });
} finally { await browser.close(); }
console.log("done");
