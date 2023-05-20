const prompt = require('prompt-sync')();
const tmi = require('tmi.js');
const robot = require("robotjs");
const config = require('./config.json');

const minAmount = 10;
const time = 5 * 1000;

const channelName = prompt(config.language.CHANNEL_NAME_PROMPT);
const client = new tmi.Client({
    channels: [channelName]
});

const action = {
    key: [],
    mouse: [],
    time: Number,
    repeat: Number,
    delay: Number,
    cancel: Boolean
};

const actionMap = new Map();

robot.setKeyboardDelay(time);

client.connect().then(() => console.log("Connected!"));
client?.on('message', (channel, tags, message) => {
    const action = getByCommand(message);

    actionMap.set(action, (actionMap.get(action) ?? 0) + 1);
    console.log(config.language.CHANNEL_NAME_PROMPT.replace("{key}", action.key).replace("{amount}", actionMap.get(action)));

    setTimeout(() => {
        actionMap.delete(action);
    }, time);

    if (actionMap.get(action) > minAmount) {
        repeatAction(() => {
            if (action.key) {
                if (action.time) {
                    action.key.forEach(action => {
                        robot.keyToggle(action);
                    })

                    setTimeout(() => {
                        action.key.forEach(action => {
                            robot.keyToggle(action);
                        })
                    }, action.time);

                    return;
                }

                action.key.forEach(action => {
                    robot.keyTap(action);
                })
            }

            if (action.mouse) {
                if (action.time) {
                    action.mouse.forEach(action => {
                        robot.mouseClick(action);
                    })

                    setTimeout(() => {
                        action.mouse.forEach(action => {
                            robot.mouseToggle(action);
                        })
                    }, action.time);

                    return;
                }

                action.mouse.forEach(action => {
                    robot.mouseClick(action);
                })
            }
        }, action.delay, action.repeat ?? 1);
    }
});

function getByCommand(command) {
    for (const index in config.keys) {
        if (config.keys[index].command === command) {
            return config.keys[index];
        }
    }
    return null;
}

function repeatAction(action, delay, repetitions) {
    if (repetitions <= 0) {
        return;
    }

    action();

    setTimeout(function() {
        repeatAction(action, delay, repetitions - 1);
    }, delay);
}
