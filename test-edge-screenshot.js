import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless: true
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        console.log('Navigating to chapter 26...');
        await page.goto('http://localhost:5177/chapter/26', { waitUntil: 'networkidle0' });

        await new Promise(r => setTimeout(r, 2000));

        // Take a screenshot
        await page.screenshot({ path: 'edge-ch26.png', fullPage: true });

        // Evaluate CSS properties on body and #root
        const styles = await page.evaluate(() => {
            const body = document.body;
            const root = document.getElementById('root');
            return {
                bodyHeight: body.scrollHeight,
                rootHeight: root ? root.scrollHeight : 0,
                bodyDisplay: window.getComputedStyle(body).display,
                rootDisplay: root ? window.getComputedStyle(root).display : null,
                rootHtmlLength: root ? root.innerHTML.length : 0
            };
        });

        console.log('Styles:', styles);

        await browser.close();
    } catch (err) {
        console.error('SCRIPT ERROR:', err);
    }
})();
