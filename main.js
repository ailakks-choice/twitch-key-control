const prompt = require('prompt-sync')();
const tmi = require('tmi.js');
const robot = require("robotjs");

const Language = {
    CHANNEL_NAME_PROMPT: 'Introduce el nombre del canal'
};

const channelName = prompt(Language.CHANNEL_NAME_PROMPT);
const client = new tmi.Client({
    channels: [ channelName ]
});

client.connect();
client.on('message', (channel, tags, message, self) => {
    console.log(`Key ${getByCommand(message).key} pressed`)
    robot.keyTap(getByCommand(message).key);
});

const Keys = {
    UP: { command: "right", key: "right" },
    LEFT: { command: "left", key: "left" },
    RIGHT: { command: "right", key: "right" },
    DOWN: { command: "down", key: "down" }
};

function getByCommand(command) {
    for (const prop in Keys) {
        if (Keys[prop].command === command) {
            return Keys[prop];
        }
    }
    return null;
}
