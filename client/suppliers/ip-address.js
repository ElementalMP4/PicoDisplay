const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const interfaces = {};

module.exports = {
    id: "ip",
    async supply(config) {
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
        return interfaces[config.networkInterface][0];
    }
}