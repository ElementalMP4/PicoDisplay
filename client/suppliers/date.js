function zeroify(input) {
    return input < 10 ? "0" + input : input;
}

module.exports = {
    id: "date",
    async supply(config) {
        const time = new Date();
        return time.toLocaleDateString() + " " + zeroify(time.getHours()) + ":" + zeroify(time.getMinutes());
    }
}