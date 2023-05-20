const fs = require('fs');

const config = require('./config.json');

function getConfig() {
    let configData;
    try {
        configData = fs.readFileSync('./config.json');
    } catch (error) {
        createConfigFile();
        configData = fs.readFileSync('./config.json');
    }
    return JSON.parse(configData);
}

function createConfigFile() {
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

function updateConfig(newConfig) {
    fs.writeFileSync('./config.json', JSON.stringify(newConfig, null, 2));
}

module.exports = { getConfig, updateConfig };
