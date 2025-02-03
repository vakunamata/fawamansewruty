import puppeteer from 'puppeteer';

async function scrapeTacobot(steamId) {
    const browser = await puppeteer.launch({ 
        headless: false, // Keep visible for debugging, change to true when done
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://tacobot.tf', { waitUntil: 'networkidle2' });

    // ✅ Wait for the search field to appear
    await page.waitForSelector('.filter-name-input', { visible: true, timeout: 10000 });

    // ✅ Type the Steam ID into the search field
    await page.type('.filter-name-input', steamId);
    await page.keyboard.press('Enter');

    // ✅ Use setTimeout() instead of waitForTimeout()
    await new Promise(resolve => setTimeout(resolve, 5000));

    // ✅ Check if a row exists with the searched Steam ID
    const foundUser = await page.$(`div[row-id="${steamId}"]`);

    if (foundUser) {
        console.log(`🚨 ALERT: Steam ID ${steamId} is LISTED on Tacobot! 🚨`);
    } else {
        console.log(`✅ Steam ID ${steamId} is NOT listed.`);
    }

    await browser.close();
}

// Run the scraper
scrapeTacobot("76561198326804371");
//scrapeTacobot("76561198043439624");
