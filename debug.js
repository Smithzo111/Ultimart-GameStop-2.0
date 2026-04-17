const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));
  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);
  const gamesHTML = await page.evaluate(() => {
    return document.getElementById('catalog-container').innerHTML;
  });
  console.log("GAMELEN:", gamesHTML.length);
  await browser.close();
})();
