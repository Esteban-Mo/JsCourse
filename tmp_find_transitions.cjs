const fs = require('fs');
const path = require('path');

const chaptersDir = 'c:\\Users\\estmo\\Desktop\\JsCourse\\src\\chapters';
const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.tsx'));

let foundIssues = false;

for (const file of files) {
    const content = fs.readFileSync(path.join(chaptersDir, file), 'utf-8');

    // Look for <h2> or <h3> followed by <CodeBlock without any <p> or <InfoBox> in between
    // We can write a regex: <h[23]>...</h[23]> then whitespace then <CodeBlock
    const regex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>\s*<CodeBlock/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        foundIssues = true;
        console.log(`File: ${file} -> Title: ${match[1]}`);
    }
}

if (!foundIssues) {
    console.log("No issues found with simple regex, trying a more relaxed regex or checking other patterns.");
}
