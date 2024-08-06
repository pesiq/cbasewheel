import { exit } from "process";
import { Browser, Page } from "puppeteer";
import { importWallets, importProxies, importPassword } from "./file_reader";
import puppeteer from "puppeteer";
// const puppeteer = require("puppeteer");

const url = "https://wallet.coinbase.com/ocs/progress";

var fs = require("fs");
var util = require("util");
var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
var log_stdout = process.stdout;

const log = (d: string) => {
  log_file.write(util.format(d) + "\n");
  log_stdout.write(util.format(d) + "\n");
};

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

const warmWelcomeDiv = 'div[data-testid="warm-welcome-text-animation"]';
const warmWelcomeXpath =
  'xpath=//*[@id="root"]/div/div/div[2]/div/div/div/div/div/div/div[2]/div[1]/div[1]';

const youWonXpath =
  'xpath=//*[@id="modalsContainer"]/div/div/div[2]/div/div[2]/div/div[2]/p[1]';
const youWon = 'p[data-testid="youWon"]';

const wheelXpath =
  'xpath=//*[@id="modalsContainer"]/div/div/div[2]/div/div[2]/div/div[1]/div/div/canvas';

// const extention_id_string = "hnfanknocfeofbddgcijnmhnfnkdnaad";
// const extention_version =

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const navigate_to_login = async (page: Page) => {
  await page.click(walletSelectButton);
  await page.click(mobileSelectButton);
};

const login_into_coinbase = async (page: Page, privateKey: string) => {
  await page.waitForSelector(importExistingButton);
  await page.click(importExistingButton);
  await page.click(pkButton);
  await page.click(scamAlertAckButtonXpath);

  // input private key
  await page.waitForSelector(pkInput);
  await page.type(pkInput, privateKey);
  await page.click(submitPKButton);
  await delay(1000);

  // create PW
  const password = await importPassword();
  await page.waitForSelector(passwordInput);
  await page.type(passwordInput, password);
  await page.type(verifyPasswordInput, password);
  await page.click(privacyButton);
  await delay(500);
  await page.click(submitButton);
  await delay(1000);

  // allow extention to work
  await page.waitForSelector(connectButton);
  await page.click(connectButton);
};

const spin = async (page: Page) => {
  // click spin
  await page.click(spinSelectButton);
  await delay(1000);

  // check if spin button active, if not -> skip
  const isSpun = await page.$$(spin2win);
  if (isSpun.length == 0) {
    console.error("Already spun, \nSkipping...");
    return;
  }

  // await for spin wheel to load
  await page.waitForSelector(wheelXpath);
  await delay(500);

  // click spin
  await page.click(spin2win);
  await delay(15000);

  // get youWon message
  const maxWinElement = await page.$(youWonXpath);
  if (maxWinElement) {
    const maxWin = await page.evaluate(
      (element) => element.textContent,
      maxWinElement,
    );
    console.log(maxWin);
  } else {
    console.error("Could not get spin result");
  }
};

const handleNewPage = async (target: any, pk: string) => {
  if (target.type() === "page") {
    const newPage = await target.page();
    await newPage.waitForSelector("body"); // Ensure the new page has loaded
    console.log("New page opened:", await newPage.title());
    delay(1000); // wait for extention to load

    // check if extention has a welcome sreen
    const welcome = await newPage.$$(warmWelcomeXpath);
    if (welcome.length != 0) {
      login_into_coinbase(newPage, pk); // if welcome screen, then login
    } else {
      newPage.click(connectButton); // if logged in press connect
    }
  }
};

interface Proxy {
  ip: string;
  port: string;
  username: string;
  password: string;
}

const work = async (privateKey: string, proxy: Proxy) => {
  log(`PrivateKey ${privateKey}`);

  const browser: Browser = await puppeteer.launch({
    headless: false,
    slowMo: 30,
    args: [
      "--disable-extensions-except=./extentions/wallet/",
      "--load-extension=./extentions/wallet/",
      `--proxy-server=${proxy.ip}:${proxy.port}`,
    ],
  });
  const page: Page = await browser.newPage();

  await page.authenticate({
    username: proxy.username,
    password: proxy.password,
  });

  browser.on("targetcreated", (event) => {
    handleNewPage(event, privateKey);
  });
  await page.goto(url, { waitUntil: "load" });
  await page.setViewport({ width: 1080, height: 1024 });
  await delay(5000);

  const welcome = await page.$$(welcomeCloseButton);
  if (welcome.length != 0) {
    await page.click(welcomeCloseButton);
  }

  await navigate_to_login(page);
  console.log("Navigated to extention");

  // wait 20 seconds for login
  await delay(20000);

  console.log("Checking if logged in");
  const rainbowBTN = await page.$$(connectRainbowButton);
  if (rainbowBTN.length != 0) {
    console.error("Not logged in, trying again");
    await page.click(connectRainbowButton);
    await navigate_to_login(page);
  }

  console.log("Logged in, trying to spin");

  const spinBTN = await page.$$(spinSelectButton);
  if (spinBTN.length == 0) {
    console.error("Cannot find the spin button");
    delay(2000);
    return;
  }

  await spin(page);
  await browser.close();
};

const parseProxy = (proxy: string): Proxy => {
  const split: string[] = proxy.split(":");
  const s: Proxy = {
    ip: split[0],
    port: split[1],
    username: split[2],
    password: split[3],
  };

  return s;
};

const main = async () => {
  const proxies = await importProxies();
  const wallets = await importWallets();

  if (proxies.length != wallets.length) {
    console.error(
      `Proxies: ${proxies.length} and wallets: ${wallets.length} amounts don't match`,
    );
    exit(-1);
  }

  const amount = proxies.length;
  // add counter i/max
  //
  // add export to csv
  for (var i = 0; i < amount; i++) {
    console.info(`${i}/${amount}`);
    await work(wallets[i], parseProxy(proxies[i]));
  }
};

main();
