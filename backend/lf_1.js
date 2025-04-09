const fs = require('fs');
const readline = require('readline');

async function getLastTwoLines(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lines = [];
    
    for await (const line of rl) {
        lines.push(line);
        if (lines.length > 2) {
            lines.shift(); // Remove the oldest line to keep only last 2
        }
    }

    console.log('Last 2 lines:');
    console.log(lines.join('\n'));
}

// Usage
getLastTwoLines('large-file.txt').catch(console.error);