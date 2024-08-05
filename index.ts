import { exit } from "process";
import { Browser, Page } from "puppeteer";
import * as fs from "fs";
import * as rd from "readline";
import puppeteer from "puppeteer";
// const puppeteer = require("puppeteer");

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
const pkInput = 'input[aria-label="Recovery phrase or private key"]';
const submitPKButton = 'button[data-testid="btn-import-wallet"]';

// create password
const passwordInput = 'input[aria-label="Password"]';
const verifyPasswordInput = 'input[aria-label="Verify password"]';
const privacyButton = 'input[data-testid="terms-and-privacy-policy"]';
const submitButton = 'button[data-testid="btn-password-continue"]';

//connect auth btn
const connectButton = 'button[data-testid="allow-authorize-button"]';

const spinSelectButton = 'button[data-testid="spinwheelButton"]';
const spin2win = 'button[data-testid="spinWheelButton"]';

const connectRainbowButton =
  'button[data-testid="gradient-connect-wallet-btn"]';

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

const login_into_coinbase = async (page: Page, privateKey: string) => {
  await page.click(importExistingButton);
  await page.click(pkButton);
  await page.click(scamAlertAckButtonXpath);

  // input private key
  await page.type(pkInput, privateKey);
  await page.click(submitPKButton);
  await delay(2000);
  // create PW
  const pw = "balls";
  await page.type(passwordInput, pw);
  await page.type(verifyPasswordInput, pw);
  await page.click(privacyButton);
  await page.click(submitButton);

  await delay(2000);
  // allow extention to work
  await page.click(connectButton);
};

const handleNewPage = async (target: any) => {
  if (target.type() === "page") {
    const newPage = await target.page();
    await newPage.waitForSelector("body"); // Ensure the new page has loaded
    console.log("New page opened:", await newPage.title());

    login_into_coinbase(newPage, "benis");
  }
};

const main = async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    args: [
      "--disable-extensions-except=./extentions/wallet/",
      "--load-extension=./extentions/wallet/",
    ],
  });
  const page: Page = await browser.newPage();
  browser.on("targetcreated", handleNewPage);
  await page.goto(url, { waitUntil: "load" });
  await page.setViewport({ width: 1080, height: 1024 });
  await delay(2000);
  await navigate_to_login(page);
  console.log("Navigated to extention");

  await page.click(connectRainbowButton);

  // await browser.close();
};

main();
