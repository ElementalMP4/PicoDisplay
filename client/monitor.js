const { SerialPort } = require('serialport');
const config = require("./config.json");
const serial = new SerialPort({ path: config.devicePath, baudRate: config.baudRate })

const fs = require("fs");
const supplierFiles = fs.readdirSync('./suppliers').filter(file => file.endsWith('.js'));
const suppliers = [];

for (const file of supplierFiles) {
    const supplier = require(`./suppliers/${file}`);
    suppliers.push({id: supplier.id, supply: supplier.supply});
}

async function processPattern(line) {
    let newLine = line;
    const supplierMatches = line.match(/(?<=\{)(.*?)(?=\})/g);
    for (supplierMatch of supplierMatches) {
        const supplier = suppliers.filter(s => s.id == supplierMatch)[0];
        const response = await supplier.supply(config.supplierConfig[supplierMatch]);
        if (supplier != null) newLine = newLine.replace("{" + supplierMatch + "}", response);
        else console.log("Unknown supplier '" + supplierMatch + "'");
    }
    return newLine;
}

setInterval(async () => {
    const lines = [];
    for (line of config.displayPattern) {
        lines.push(await processPattern(line));
    }
    console.log(lines);
    const resultString = lines.join("|") + "\n";
    serial.write(resultString);
}, config.refreshRate);