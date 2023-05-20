const prompt = require('prompt-sync')();
const tmi = require('tmi.js');
const robot = require("robotjs");

const minAmount = 10;
const time = 5 * 1000;

const Language = {
    CHANNEL_NAME_PROMPT: 'Introduce el nombre del canal'
};

const channelName = prompt(Language.CHANNEL_NAME_PROMPT);
const client = new tmi.Client({
    channels: [channelName]
});

const actionMap = new Map();

robot.setKeyboardDelay(time);

client.connect().then(() => console.log("Connected!"));
client?.on('message', (channel, tags, message) => {
    const key = getByCommand(message);

    actionMap.set(key, (actionMap.get(key) ?? 0) + 1);
    console.log(`Key ${key.key} pressed ${actionMap.get(key)} time(s)`);

    setTimeout(() => {
        actionMap.delete(key);
    }, time);

    if (actionMap.get(key) > minAmount) {
        if (key.time) {
            robot.keyToggle(key.key);

            setTimeout(() => {
                robot.keyToggle(key.key);
            }, key.time);
            return;
        }
        robot.keyTap(key.key);
    }
});

const Keys = {
    UP: {command: "right", key: "right"},
    LEFT: {command: "left", key: "left"},
    RIGHT: {command: "right", key: "right"},
    DOWN: {command: "down", key: "down"}
};

function getByCommand(command) {
    for (const prop in Keys) {
        if (Keys[prop].command === command) {
            return Keys[prop];
        }
    }
    return null;
}
