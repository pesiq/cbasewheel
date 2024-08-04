import { Browser, Page } from "puppeteer";

const puppeteer = require("puppeteer");

const SS_FOLDER: string = "./screenshots/";
const url = "https://wallet.coinbase.com/ocs/progress";

// const extention_id_string = "hnfanknocfeofbddgcijnmhnfnkdnaad";
// const extention_version =

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const navigate = async (page: Page) => {
  const [gettngStartedClose] = await Promise.all([
    page.waitForSelector('button[data-testid="nux-welcome-modal-close"]'),
    page.click('button[data-testid="nux-welcome-modal-close"]'),
  ]);

  const [selectingWallet] = await Promise.all([
    page.waitForSelector(
      'button[data-testid="coinbase-wallet-option-cell-pressable"]',
    ),
    page.click('button[data-testid="coinbase-wallet-option-cell-pressable"]'),
  ]);

  const [selectMobile] = await Promise.all([
    page.waitForSelector(
      'button[data-testid="coinbase-wallet-selector-wallet-cell-pressable"]',
    ),
    page.click(
      'button[data-testid="coinbase-wallet-selector-wallet-cell-pressable"]',
    ),
  ]);
};

const main = async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    args: [
      "--disable-extensions-except=./extentions/wallet/",
      "--load-extension=./extentions/wallet/",
    ],
  });
  const page: Page = await browser.newPage();
  await page.goto(url, { waitUntil: "load" });
  await page.setViewport({ width: 1080, height: 1024 });

  // await navigate(page);

  // await page.screenshot({ path: `screenshots/screen.png` });

  // await browser.close();
};

main();
