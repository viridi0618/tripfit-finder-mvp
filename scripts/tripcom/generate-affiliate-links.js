import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let playwright;
try {
  playwright = require('playwright-core');
} catch {
  const managedPath = 'C:/Users/Administrator/.workbuddy/binaries/node/workspace/node_modules/playwright-core';
  playwright = require(managedPath);
}

const { chromium } = playwright;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const INPUT_CSV = path.join(__dirname, 'affiliate-input.csv');
const OUTPUT_DIR = path.join(__dirname, 'output');
const OUTPUT_JSON = path.join(OUTPUT_DIR, 'affiliate-links.json');
const OUTPUT_REPORT = path.join(OUTPUT_DIR, 'run-report.csv');
const PROFILE_DIR = path.join(ROOT_DIR, '.tripcom-profile');

const CONFIG = {
  url: 'https://hk.trip.com/partners/tools/deeplink/create',
  targetLanguage: 'English-SG',
  targetWebsite: 'whereatlas',
  expectedHost: 'sg.trip.com',
  expectedSID: '328960094',
  expectedAllianceId: '10173661',
  proxyServer: 'http://127.0.0.1:7897',
  chromeExecutable: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
};

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];
  const header = lines[0].split(',').map(s => s.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(s => s.trim());
    if (parts.length < header.length) continue;
    rows.push({
      type: parts[0],
      origin: parts[1] || '',
      destination: parts[2] || '',
      trip_sub1: parts[3] || ''
    });
  }
  return rows;
}

function loadExistingLinks() {
  if (fs.existsSync(OUTPUT_JSON)) {
    try {
      const data = JSON.parse(fs.readFileSync(OUTPUT_JSON, 'utf-8'));
      return data.links || [];
    } catch {
      return [];
    }
  }
  return [];
}

function safeWriteFileSync(filePath, content) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Ignore deletion errors before writing
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

function saveOutput(links, reports) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  // Save JSON
  const outputData = {
    generatedAt: new Date().toISOString(),
    links: links
  };
  safeWriteFileSync(OUTPUT_JSON, JSON.stringify(outputData, null, 2));

  // Save CSV Report
  let reportCsv = 'status,type,origin,destination,trip_sub1,url,error\n';
  for (const r of reports) {
    const row = [
      r.status,
      r.type,
      r.origin || '',
      r.destination,
      r.trip_sub1,
      `"${r.url || ''}"`,
      `"${r.error || ''}"`
    ].join(',');
    reportCsv += row + '\n';
  }
  safeWriteFileSync(OUTPUT_REPORT, reportCsv);
}

function validateAffiliateUrl(urlStr, expected) {
  if (!urlStr || !urlStr.startsWith('https://')) {
    return { valid: false, reason: 'URL must start with https://' };
  }
  let parsed;
  try {
    parsed = new URL(urlStr);
  } catch {
    return { valid: false, reason: 'Invalid URL syntax' };
  }

  // Strict Hostname check: must be sg.trip.com for English-SG
  if (parsed.hostname !== CONFIG.expectedHost) {
    return { valid: false, reason: `Invalid hostname: got "${parsed.hostname}", expected "${CONFIG.expectedHost}"` };
  }

  // Check Allianceid
  const allianceId = parsed.searchParams.get('Allianceid') || parsed.searchParams.get('allianceid');
  if (allianceId !== CONFIG.expectedAllianceId) {
    return { valid: false, reason: `Invalid Allianceid: got ${allianceId}, expected ${CONFIG.expectedAllianceId}` };
  }

  // Check SID
  const sid = parsed.searchParams.get('SID') || parsed.searchParams.get('sid');
  if (sid !== CONFIG.expectedSID) {
    return { valid: false, reason: `Invalid SID: got ${sid}, expected ${CONFIG.expectedSID}` };
  }

  // Check trip_sub1
  const tripSub1 = parsed.searchParams.get('trip_sub1');
  if (tripSub1 !== expected.trip_sub1) {
    return { valid: false, reason: `Invalid trip_sub1: got ${tripSub1}, expected ${expected.trip_sub1}` };
  }

  // Product specific checks
  if (expected.type === 'hotel') {
    const dest = (expected.destination || '').toLowerCase();
    const urlLower = urlStr.toLowerCase();
    if (!urlLower.includes('hotel') && !urlLower.includes('hotels')) {
      return { valid: false, reason: 'Generated URL does not appear to be a Hotel link' };
    }
    if (!urlLower.includes(dest)) {
      return { valid: false, reason: `Generated URL does not contain destination "${expected.destination}"` };
    }
  } else if (expected.type === 'flight') {
    const urlLower = urlStr.toLowerCase();
    if (!urlLower.includes('flight') && !urlLower.includes('flights')) {
      return { valid: false, reason: 'Generated URL does not appear to be a Flight link' };
    }
  }

  return { valid: true };
}

/**
 * Accurately locate and read Language from DOM
 */
async function getDisplayedLanguageFromDOM(page) {
  return await page.evaluate(() => {
    // Locate the label or container with text "連結語言"
    const labels = Array.from(document.querySelectorAll('*')).filter(el => {
      return el.children.length === 0 && (el.innerText || '').trim() === '連結語言';
    });

    for (const label of labels) {
      // Find the select element in parent or sibling tree
      let container = label.parentElement;
      for (let depth = 0; depth < 4 && container; depth++) {
        const select = container.querySelector('.MuiSelect-root, .MuiSelect-select, select');
        if (select) {
          return (select.innerText || select.value || '').trim();
        }
        container = container.parentElement;
      }
    }

    // Fallback: search selects with known language list items
    const allSelects = Array.from(document.querySelectorAll('.MuiSelect-root, .MuiSelect-select'));
    for (const s of allSelects) {
      const text = (s.innerText || '').trim();
      if (['English-SG', '繁體中文(香港)', 'English', '日本語', '繁體中文(台湾)'].includes(text)) {
        return text;
      }
    }
    return null;
  });
}

/**
 * Accurately ensure Language = English-SG with pre/post DOM verification
 */
async function ensureLanguage(page, targetLanguage) {
  console.log(`[Language] Verifying Language is "${targetLanguage}" from DOM...`);
  
  let currentLang = await getDisplayedLanguageFromDOM(page);
  console.log(`[Language] Initial DOM displayed Language: "${currentLang}"`);

  if (currentLang === targetLanguage) {
    console.log(`[Language] Language is already "${targetLanguage}".`);
    return;
  }

  // Find the exact Language Select locator scoped to "連結語言"
  const langContainer = page.locator('div, section, p, label').filter({ hasText: /^連結語言$/ }).locator('..');
  let langSelect = langContainer.locator('.MuiSelect-root, .MuiSelect-select').first();

  if (!(await langSelect.isVisible().catch(() => false))) {
    // Scoped fallback to select displaying currentLang
    langSelect = page.locator(`.MuiSelect-root:has-text("${currentLang}")`).first();
  }

  await langSelect.waitFor({ state: 'visible', timeout: 8000 });
  await langSelect.click();
  await page.waitForTimeout(600);

  // Click target option in dropdown menu
  const targetOption = page.locator(`li[role="option"]:has-text("${targetLanguage}"), .MuiMenuItem-root:has-text("${targetLanguage}")`).first();
  await targetOption.waitFor({ state: 'visible', timeout: 8000 });
  await targetOption.click();
  await page.waitForTimeout(1000);

  // POST-VERIFICATION: Read back from DOM
  const verifiedLang = await getDisplayedLanguageFromDOM(page);
  console.log(`[Language] Post-selection DOM displayed Language: "${verifiedLang}"`);

  if (verifiedLang !== targetLanguage) {
    throw new Error(`Language verification failed: DOM shows "${verifiedLang}", expected "${targetLanguage}"`);
  }
}

/**
 * Accurately locate and read Website from DOM
 */
async function getDisplayedWebsiteFromDOM(page) {
  return await page.evaluate(() => {
    // Locate the label or container with text containing "選擇您的網站"
    const labels = Array.from(document.querySelectorAll('*')).filter(el => {
      return el.children.length === 0 && (el.innerText || '').includes('選擇您的網站');
    });

    for (const label of labels) {
      let container = label.parentElement;
      for (let depth = 0; depth < 4 && container; depth++) {
        const select = container.querySelector('.MuiSelect-root, .MuiSelect-select, select');
        if (select) {
          return (select.innerText || select.value || '').trim();
        }
        container = container.parentElement;
      }
    }

    const allSelects = Array.from(document.querySelectorAll('.MuiSelect-root, .MuiSelect-select'));
    for (const s of allSelects) {
      const text = (s.innerText || '').trim();
      if (text.includes('whereatlas')) {
        return text;
      }
    }
    return null;
  });
}

/**
 * Accurately ensure Website = whereatlas with pre/post DOM verification
 */
async function ensureWebsite(page, targetWebsite) {
  console.log(`[Website] Verifying Website is "${targetWebsite}" from DOM...`);

  let currentSite = await getDisplayedWebsiteFromDOM(page);
  console.log(`[Website] Initial DOM displayed Website: "${currentSite}"`);

  if (currentSite && currentSite.includes(targetWebsite)) {
    console.log(`[Website] Website is already "${targetWebsite}".`);
    return;
  }

  // Find the exact Website Select locator scoped to "選擇您的網站"
  const siteContainer = page.locator('div, section, p, label').filter({ hasText: /選擇您的網站/ }).locator('..');
  let siteSelect = siteContainer.locator('.MuiSelect-root, .MuiSelect-select').first();

  if (!(await siteSelect.isVisible().catch(() => false))) {
    siteSelect = page.locator('.MuiSelect-root').filter({ hasNotText: /English|繁體|日本語/ }).first();
  }

  await siteSelect.waitFor({ state: 'visible', timeout: 8000 });
  await siteSelect.click();
  await page.waitForTimeout(600);

  const targetOption = page.locator(`li[role="option"]:has-text("${targetWebsite}"), .MuiMenuItem-root:has-text("${targetWebsite}")`).first();
  await targetOption.waitFor({ state: 'visible', timeout: 8000 });
  await targetOption.click();
  await page.waitForTimeout(1000);

  // POST-VERIFICATION: Read back from DOM
  const verifiedSite = await getDisplayedWebsiteFromDOM(page);
  console.log(`[Website] Post-selection DOM displayed Website: "${verifiedSite}"`);

  if (!verifiedSite || !verifiedSite.includes(targetWebsite)) {
    throw new Error(`Website verification failed: DOM shows "${verifiedSite}", expected to contain "${targetWebsite}"`);
  }
}

async function selectAutocomplete(page, inputSelector, textToType, semanticKeywords) {
  console.log(`[Autocomplete] Filling ${inputSelector} with "${textToType}"...`);
  const input = page.locator(inputSelector).first();
  await input.waitFor({ state: 'visible', timeout: 15000 });
  await input.click();
  await input.fill('');
  await page.waitForTimeout(300);
  await input.fill(textToType);
  await page.waitForTimeout(1500);

  // Wait for dropdown
  await page.locator('.MuiAutocomplete-option, [role=option]').first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});

  const keywords = Array.isArray(semanticKeywords) ? semanticKeywords : [semanticKeywords || textToType];
  const options = await page.locator('.MuiAutocomplete-option, [role=option]').all();
  let matchedOption = null;

  for (const opt of options) {
    const text = await opt.innerText();
    for (const kw of keywords) {
      if (text.toLowerCase().includes(kw.toLowerCase())) {
        matchedOption = opt;
        console.log(`[Autocomplete] Found semantic match: "${text.trim().replace(/\n/g, ' ')}" for keyword "${kw}"`);
        break;
      }
    }
    if (matchedOption) break;
  }

  if (matchedOption) {
    await matchedOption.click();
  } else if (options.length > 0) {
    console.log(`[Autocomplete] Fallback to first available suggestion.`);
    await options[0].click();
  } else {
    console.log(`[Autocomplete] No dropdown option visible, pressing Enter.`);
    await input.press('Enter');
  }
  await page.waitForTimeout(1000);
}

async function readGeneratedUrl(page) {
  console.log('[DOM] Extracting generated affiliate URL from page...');
  
  for (let i = 0; i < 15; i++) {
    await page.waitForTimeout(1000);
    
    const extractedUrl = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('textarea, input, a, p, span, div'));
      for (const el of elements) {
        const val = (el.value || el.innerText || el.href || '').trim();
        if (val.includes('trip.com') && (val.includes('Allianceid=10173661') || val.includes('allianceid=10173661'))) {
          const match = val.match(/https:\/\/[^\s\n\r"']+/);
          if (match && match[0].includes('Allianceid=10173661')) {
            return match[0];
          }
        }
      }
      return null;
    });

    if (extractedUrl) {
      return extractedUrl;
    }
  }

  return null;
}

async function main() {
  const force = process.argv.includes('--force');
  console.log(`=== Trip.com Affiliate Link Generator === (Force: ${force})\n`);

  if (!fs.existsSync(INPUT_CSV)) {
    console.error(`Input file not found: ${INPUT_CSV}`);
    process.exit(1);
  }

  const inputRows = parseCSV(fs.readFileSync(INPUT_CSV, 'utf-8'));
  console.log(`Loaded ${inputRows.length} rows from CSV:\n`, inputRows);

  let existingLinks = loadExistingLinks();
  const reportResults = [];

  let browser;
  let context;
  let page;

  try {
    console.log('\n[Browser] Connecting over CDP to Chrome (port 9222)...');
    browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    context = browser.contexts()[0];
    page = context.pages().find(p => p.url().includes('trip.com')) || context.pages()[0] || await context.newPage();
  } catch {
    console.log('[Browser] CDP connection failed, launching persistent context at', PROFILE_DIR);
    context = await chromium.launchPersistentContext(PROFILE_DIR, {
      executablePath: CONFIG.chromeExecutable,
      headless: false,
      proxy: { server: CONFIG.proxyServer },
      viewport: { width: 1400, height: 900 }
    });
    page = context.pages()[0] || await context.newPage();
  }

  console.log('[Browser] Navigating to Link Builder...');
  await page.goto(CONFIG.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  if (!page.url().includes('/deeplink/create')) {
    console.warn('\n[AUTH WARNING] Page redirected. Please ensure you are logged into Trip.com Partner Portal.');
    console.log('Waiting for login to complete (timeout: 2 minutes)...');
    await page.waitForFunction(() => window.location.href.includes('/deeplink/create'), { timeout: 120000 });
  }

  for (const row of inputRows) {
    const { type, origin, destination, trip_sub1 } = row;
    console.log(`\n==================================================`);
    console.log(`Processing: [${type.toUpperCase()}] ${origin ? origin + ' -> ' : ''}${destination} (${trip_sub1})`);

    // Strict Cache / Idempotency Check: Existing cache must pass full validation
    const cachedLink = existingLinks.find(
      l => l.type === type && (l.origin || '') === origin && l.destination === destination && l.tripSub1 === trip_sub1
    );

    if (cachedLink && !force) {
      const cacheValidation = validateAffiliateUrl(cachedLink.url, row);
      if (cacheValidation.valid) {
        console.log(`[Cache Valid] Skipping valid cached link: ${cachedLink.url}`);
        reportResults.push({
          status: 'PASS',
          type,
          origin,
          destination,
          trip_sub1,
          url: cachedLink.url,
          error: ''
        });
        continue;
      } else {
        console.log(`[Cache Invalid] Cached link failed validation (${cacheValidation.reason}), regenerating...`);
      }
    }

    try {
      if (!page.url().includes('/deeplink/create')) {
        await page.goto(CONFIG.url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
      }

      if (type === 'hotel') {
        // Switch to Hotel tab
        console.log('[Hotel] Clicking "酒店頁面" tab...');
        const hotelTab = page.locator('text=酒店頁面').first();
        await hotelTab.click();
        await page.waitForTimeout(1000);

        // Verify and set Language & Website strictly from DOM
        await ensureLanguage(page, CONFIG.targetLanguage);
        await ensureWebsite(page, CONFIG.targetWebsite);

        // Fill Destination
        await selectAutocomplete(page, '#des-hotel-poi', destination, [destination, '東京', 'Tokyo']);

        // Fill trip_sub1
        console.log(`[Hotel] Setting trip_sub1 to "${trip_sub1}"...`);
        const sub1Input = page.locator('#view-form-common-ouid').first();
        await sub1Input.waitFor({ state: 'visible', timeout: 10000 });
        await sub1Input.click();
        await sub1Input.fill(trip_sub1);
        await page.waitForTimeout(500);

      } else if (type === 'flight') {
        // Switch to Flight tab
        console.log('[Flight] Clicking "機票頁面" tab...');
        const flightTab = page.locator('text=機票頁面').first();
        await flightTab.click();
        await page.waitForTimeout(1000);

        // Verify and set Language & Website strictly from DOM
        await ensureLanguage(page, CONFIG.targetLanguage);
        await ensureWebsite(page, CONFIG.targetWebsite);

        // Fill Origin
        await selectAutocomplete(page, '#des-flight-poi-dep', origin, [origin, '倫敦', 'London']);

        // Fill Destination
        await selectAutocomplete(page, '#des-flight-poi-arr', destination, [destination, '東京', 'Tokyo']);

        // Fill trip_sub1
        console.log(`[Flight] Setting trip_sub1 to "${trip_sub1}"...`);
        const sub1Input = page.locator('#view-form-common-ouid').first();
        await sub1Input.waitFor({ state: 'visible', timeout: 10000 });
        await sub1Input.click();
        await sub1Input.fill(trip_sub1);
        await page.waitForTimeout(500);
      } else {
        throw new Error(`Unsupported type: ${type}`);
      }

      // Pre-create sanity check: confirm DOM language is still English-SG
      const preCheckLang = await getDisplayedLanguageFromDOM(page);
      if (preCheckLang !== CONFIG.targetLanguage) {
        throw new Error(`Pre-create DOM Language check failed: got "${preCheckLang}", expected "${CONFIG.targetLanguage}"`);
      }

      // Click Create Link Button
      console.log('[Action] Clicking "創建聯盟連結"...');
      const createBtn = page.locator('button:has-text("創建聯盟連結"), [role=button]:has-text("創建聯盟連結")').first();
      await createBtn.click();

      // Extract Generated URL
      const rawUrl = await readGeneratedUrl(page);
      if (!rawUrl) {
        const screenshotPath = path.join(OUTPUT_DIR, `failed_${type}_${destination}.png`);
        await page.screenshot({ path: screenshotPath });
        throw new Error(`Could not extract generated URL from DOM. Screenshot saved: ${screenshotPath}`);
      }

      console.log(`[Result] Generated URL:\n${rawUrl}`);

      // Strict Validation (hostname must be sg.trip.com)
      const validation = validateAffiliateUrl(rawUrl, { type, origin, destination, trip_sub1 });
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.reason}`);
      }

      console.log('[Validation] URL passed all strict integrity checks!');

      // Update link records
      existingLinks = existingLinks.filter(
        l => !(l.type === type && (l.origin || '') === origin && l.destination === destination && l.tripSub1 === trip_sub1)
      );
      existingLinks.push({
        type,
        origin: origin || null,
        destination,
        tripSub1: trip_sub1,
        url: rawUrl
      });

      reportResults.push({
        status: 'PASS',
        type,
        origin,
        destination,
        trip_sub1,
        url: rawUrl,
        error: ''
      });

    } catch (err) {
      console.error(`[FAIL] ${type} for ${destination}:`, err.message);
      reportResults.push({
        status: 'FAIL',
        type,
        origin,
        destination,
        trip_sub1,
        url: '',
        error: err.message
      });
    }
  }

  // Write outputs
  saveOutput(existingLinks, reportResults);
  console.log('\n==================================================');
  console.log(`Pipeline finished.`);
  console.log(`JSON Output: ${OUTPUT_JSON}`);
  console.log(`Report CSV: ${OUTPUT_REPORT}`);
  console.log('==================================================\n');

  if (reportResults.some(r => r.status === 'FAIL')) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
