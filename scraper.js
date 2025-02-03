import puppeteer from 'puppeteer';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Test Route
app.get('/', (req, res) => {
    res.send("✅ Scraper API is running on Render!");
});

// ✅ Tacobot Check API
app.post('/check-tacobot', async (req, res) => {
    const { steamId } = req.body;
    if (!steamId) return res.status(400).json({ error: "Missing Steam ID" });

    console.log(`🔍 Checking Tacobot for Steam ID: ${steamId}`);

    const browser = await puppeteer.launch({ 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });

    const page = await browser.newPage();
    await page.goto('https://tacobot.tf', { waitUntil: 'networkidle2' });

    await page.waitForSelector('.filter-name-input', { visible: true, timeout: 10000 });
    await page.type('.filter-name-input', steamId);
    await page.keyboard.press('Enter');

    await new Promise(resolve => setTimeout(resolve, 5000));

    const foundUser = await page.$(`div[row-id="${steamId}"]`);
    const isListed = foundUser ? true : false;

    console.log(isListed ? `🚨 ALERT: Steam ID ${steamId} is LISTED! 🚨` : `✅ Steam ID ${steamId} is NOT listed.`);

    await browser.close();

    res.json({ steamId, isListed });
});

// ✅ Start Express Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Scraper API Running on Port ${PORT}`));
