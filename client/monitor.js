const { SerialPort } = require('serialport');
const config = require("./config.json");
const { networkInterfaces } = require('os');

const pico = new SerialPort({ path: config.devicePath, baudRate: config.baudRate })

const nets = networkInterfaces();
const interfaces = {};

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!interfaces[name]) {
                interfaces[name] = [];
            }
            interfaces[name].push(net.address);
        }
    }
}

const ip = interfaces[config.networkInterface][0];

setInterval(() => {
    const time = new Date();
    const timeString = time.toLocaleDateString() + " " + time.getHours() + ":" + time.getMinutes();
    const resultString = timeString + "\0" + ip + "\n";
    console.log(resultString);
    pico.write(resultString);

}, 1000);