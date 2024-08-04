import { Browser, Page } from "puppeteer";

const puppeteer = require("puppeteer");

const SS_FOLDER: string = "./screenshots/";
const url = "https://wallet.coinbase.com/ocs/progress";

// enter site
const welcomeCloseButton = 'button[data-testid="nux-welcome-modal-close"]';
const walletSelectButton =
  'button[data-testid="coinbase-wallet-option-cell-pressable"]';
const mobileSelectButton =
  'button[data-testid="coinbase-wallet-selector-wallet-cell-pressable"]';

// in extention window select import wallet
const importExistingButton = 'button[data-testid="btn-import-existing-wallet"]';
const pkButton = 'button[data-testid="btn-import-recovery-phrase"]';

// enter private key and ack sman alert
const scamAlertAckButtonXpath =
  'xpath=//*[@id="modalsContainer"]/div/div/div[2]/div/div/div/div[2]/button';
const pkInputXpath =
  'xpath=//*[@id="modalsContainer"]/div/div/div[2]/div/div/div/div[2]/button';
const submitPKButton = 'button[data-testid="btn-import-wallet"]';

// create password
const inputPWXpath = 'xpath=//*[@id="cds-textinput-label-:rh:"]';
const inputPWAgainXpath = 'xpath=//*[@id="cds-textinput-label-:ri:"]';
const agreeCBoxXpath = 'xpath=//*[@id="collapsible-:rj:"]';
const submitButton = 'button[data-testid="btn-password-continue"]';

//connect auth btn
const connectButton = 'button[data-testid="allow-authorize-button"]';

const spinSelectButton = 'button[data-testid="spinwheelButton"]';
const spin2win = 'button[data-testid="spinWheelButton"]';

// const extention_id_string = "hnfanknocfeofbddgcijnmhnfnkdnaad";
// const extention_version =

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const navigate_to_login = async (page: Page) => {
  await page.click(welcomeCloseButton);
  await page.click(walletSelectButton);
  await page.click(mobileSelectButton);
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

  await navigate_to_login(page);

  // await page.screenshot({ path: `screenshots/screen.png` });

  // await browser.close();
};

main();
