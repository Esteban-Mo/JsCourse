import puppeteer from 'puppeteer-core';

(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless: true
        });
        const page = await browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', error => console.error('PAGE ERROR:', error));
        page.on('requestfailed', request => {
            console.error('REQUEST FAILED:', request.url(), request.failure()?.errorText);
        });

        console.log('Navigating to chapter 26...');
        await page.goto('http://localhost:5177/chapter/26', { waitUntil: 'networkidle0' });

        // Attendre un peu pour voir si des erreurs React apparaissent
        await new Promise(r => setTimeout(r, 2000));

        console.log('Done scanning chapter 26.');

        console.log('Navigating to chapter 27...');
        await page.goto('http://localhost:5177/chapter/27', { waitUntil: 'networkidle0' });
        await new Promise(r => setTimeout(r, 2000));
        console.log('Done.');

        await browser.close();
    } catch (err) {
        console.error('SCRIPT ERROR:', err);
    }
})();
